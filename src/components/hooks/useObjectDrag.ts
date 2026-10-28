import { useRef, useState } from "react";
import type { MouseEvent, PointerEvent, RefObject } from "react";

type Position = {
    x: number;
    y: number;
};

type Bounds = {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
};

type DragState = {
    bounds: Bounds;
    pointerId: number;
    startX: number;
    startY: number;
    origin: Position;
    scaleX: number;
    scaleY: number;
    moved: boolean;
};

type Options = Position & {
    width: number;
    height: number;
    workspaceRef?: RefObject<HTMLDivElement | null>;
    slideRef: RefObject<HTMLDivElement | null>;
    enabled: boolean;
    onDragEnd: (position: Position) => void;
};

// добавить возможность перетаскивания нескольких объектов
function useObjectDrag({ x, y, width, height, workspaceRef, slideRef, enabled, onDragEnd }: Options) {
    const [dragPosition, setDragPosition] = useState<Position | null>(null);
    const dragRef = useRef<DragState | null>(null);
    const suppressClickRef = useRef(false);

    const getPosition = (event: PointerEvent<HTMLDivElement>, drag: DragState): Position => {
        const nextX = drag.origin.x + (event.clientX - drag.startX) / drag.scaleX;
        const nextY = drag.origin.y + (event.clientY - drag.startY) / drag.scaleY;

        return {
            x: Math.max(drag.bounds.minX, Math.min(drag.bounds.maxX, nextX)),
            y: Math.max(drag.bounds.minY, Math.min(drag.bounds.maxY, nextY)),
        };
    };

    const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
        suppressClickRef.current = false;

        if (!enabled || event.button !== 0 || !event.isPrimary) return;
        if (event.target !== event.currentTarget) return;
        if (event.ctrlKey || event.metaKey || dragRef.current) return;

        const frame = event.currentTarget;
        const workspace = workspaceRef?.current;
        const slide = slideRef.current;
        if (!workspace || !slide || !slide.offsetWidth || !slide.offsetHeight) return;

        const workspaceRect = workspace.getBoundingClientRect();
        const slideRect = slide.getBoundingClientRect();
        const scaleX = slideRect.width / slide.offsetWidth;
        const scaleY = slideRect.height / slide.offsetHeight;
        if (scaleX <= 0 || scaleY <= 0) return;

        const left = workspaceRect.left + workspace.clientLeft;
        const top = workspaceRect.top + workspace.clientTop;
        const bounds: Bounds = {
            minX: (left - slideRect.left) / scaleX - width / 2,
            maxX: (left + workspace.clientWidth - slideRect.left) / scaleX - width / 2,
            minY: (top - slideRect.top) / scaleY - height / 2,
            maxY: (top + workspace.clientHeight - slideRect.top) / scaleY - height / 2,
        };

        if (!frame.offsetWidth || !frame.offsetHeight) return;

        event.preventDefault();
        event.stopPropagation();
        frame.focus();

        dragRef.current = {
            pointerId: event.pointerId,
            startX: event.clientX,
            startY: event.clientY,
            origin: { x, y },
            scaleX,
            scaleY,
            bounds,
            moved: false,
        };

        frame.setPointerCapture(event.pointerId);
    };

    const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
        const drag = dragRef.current;
        if (!drag || drag.pointerId !== event.pointerId) return;

        const distance = Math.hypot(
            event.clientX - drag.startX,
            event.clientY - drag.startY,
        );

        if (!drag.moved && distance < 4) return;

        drag.moved = true;
        setDragPosition(getPosition(event, drag));
    };

    const onPointerUp = (event: PointerEvent<HTMLDivElement>) => {
        const drag = dragRef.current;
        if (!drag || drag.pointerId !== event.pointerId) return;

        const nextPosition = getPosition(event, drag);

        dragRef.current = null;
        suppressClickRef.current = drag.moved;
        setDragPosition(null);

        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId);
        }

        if (drag.moved) {
            onDragEnd(nextPosition);
        }
    };

    const cancelDrag = (event: PointerEvent<HTMLDivElement>) => {
        const drag = dragRef.current;
        if (!drag || drag.pointerId !== event.pointerId) return;

        dragRef.current = null;
        suppressClickRef.current = drag.moved;
        setDragPosition(null);
    };

    return {
        position: dragPosition ?? { x, y },
        dragHandlers: {
            onPointerDown,
            onPointerMove,
            onPointerUp,
            onPointerCancel: cancelDrag,
            onLostPointerCapture: cancelDrag,
        },
    };
}

export { useObjectDrag };