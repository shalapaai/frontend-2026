import type { SlideObject } from "../../types/objects";
import { useRef, useState } from "react";
import type { PointerEvent, RefObject } from "react";

type Position = {
    x: number;
    y: number;
};

type DragState = {
    pointerId: number;
    startX: number;
    startY: number;
    origin: Position;
    scale: number;
    moved: boolean;
};

type Options = {
    object: SlideObject;
    workspaceRef?: RefObject<HTMLDivElement | null>;
    slideRef: RefObject<HTMLDivElement | null>;
    enabled: boolean;
    onDragEnd: (position: Position) => void;
};

// добавить возможность перетаскивания нескольких объектов
function useObjectDrag({ object, workspaceRef, slideRef, enabled, onDragEnd }: Options) {
    const { x, y, width, height } = object;
    const [dragPosition, setDragPosition] = useState<Position | null>(null);
    const dragRef = useRef<DragState | null>(null);

    const getPosition = (event: PointerEvent<HTMLDivElement>, drag: DragState): Position => ({
        x: drag.origin.x + (event.clientX - drag.startX) / drag.scale,
        y: drag.origin.y + (event.clientY - drag.startY) / drag.scale,
    });

    const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
        if (!enabled || event.button !== 0 || !event.isPrimary) return;
        if (event.target !== event.currentTarget && !(event.target instanceof HTMLImageElement)) return;
        if (event.ctrlKey || event.metaKey || dragRef.current) return;

        const frame = event.currentTarget;
        const workspace = workspaceRef?.current;
        const slide = slideRef.current;
        if (!workspace || !slide || !slide.offsetWidth || !slide.offsetHeight) return;

        const scale = slide.getBoundingClientRect().width / slide.offsetWidth;
        if (scale <= 0) return;

        event.preventDefault();
        event.stopPropagation();
        frame.focus();

        dragRef.current = {
            pointerId: event.pointerId,
            startX: event.clientX,
            startY: event.clientY,
            origin: { x, y },
            scale,
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
        setDragPosition(null);

        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId);
        }

        if (!drag.moved) return;

        const workspace = workspaceRef?.current;
        const slide = slideRef.current;
        if (!workspace || !slide) return;

        const workspaceRect = workspace.getBoundingClientRect();
        const slideRect = slide.getBoundingClientRect();
        const left = slideRect.left + nextPosition.x * drag.scale;
        const top = slideRect.top + nextPosition.y * drag.scale;
        const workspaceLeft = workspaceRect.left + workspace.clientLeft;
        const workspaceTop = workspaceRect.top + workspace.clientTop;

        if (left < workspaceLeft || top < workspaceTop ||
            left + width * drag.scale > workspaceLeft + workspace.clientWidth ||
            top + height * drag.scale > workspaceTop + workspace.clientHeight) return;

        if (nextPosition.x !== drag.origin.x || nextPosition.y !== drag.origin.y) {
            onDragEnd(nextPosition);
        }
    };

    const cancelDrag = (event: PointerEvent<HTMLDivElement>) => {
        const drag = dragRef.current;
        if (!drag || drag.pointerId !== event.pointerId) return;

        dragRef.current = null;
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