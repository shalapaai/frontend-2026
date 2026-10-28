import { useEffect, useRef, useState } from "react";
import type { MouseEvent, RefObject } from "react";

type Size = { 
    width: number,
    height: number 
};

type Options = Size & {
    x: number,
    y: number,
    workspaceRef?: RefObject<HTMLDivElement | null>,
    enabled: boolean,
    slideRef: RefObject<HTMLDivElement | null>,
    onResizeEnd: (size: Size) => void,
};

type ResizeState = Size & {
    startX: number;
    startY: number;
    scaleX: number;
    scaleY: number;
    minWidth: number;
    minHeight: number;
    maxWidth: number;
    maxHeight: number;
    current: Size;
    moved: boolean;
};

function useObjectResize({ x, y, width, height, enabled, workspaceRef, slideRef, onResizeEnd }: Options) {
    const resizeRef = useRef<ResizeState | null>(null);
    const [size, setSize] = useState<Size | null>(null);

    useEffect(() => {
        const getSize = (event: globalThis.MouseEvent, resize: ResizeState): Size => ({
            width: Math.max(resize.minWidth, Math.min(resize.maxWidth, resize.width + (event.clientX - resize.startX) / resize.scaleX)),
            height: Math.max(resize.minHeight, Math.min(resize.maxHeight, resize.height + (event.clientY - resize.startY) / resize.scaleY)),
        });

        const handleMove = (event: globalThis.MouseEvent) => {
            const resize = resizeRef.current;
            if (!resize) return;
            resize.moved = true;
            resize.current = getSize(event, resize);
            setSize(resize.current);
        };

        const handleUp = (event: globalThis.MouseEvent) => {
            const resize = resizeRef.current;
            if (!resize || event.button !== 0) return;
            resizeRef.current = null;
            setSize(null);
            if (resize.moved) onResizeEnd(getSize(event, resize));
        };

        const cancel = () => {
            resizeRef.current = null;
            setSize(null);
        };

        window.addEventListener("mousemove", handleMove);
        window.addEventListener("mouseup", handleUp);
        window.addEventListener("blur", cancel);
        return () => {
            window.removeEventListener("mousemove", handleMove);
            window.removeEventListener("mouseup", handleUp);
            window.removeEventListener("blur", cancel);
        };
    }, [onResizeEnd]);

    const onMouseDown = (event: MouseEvent<HTMLDivElement>) => {
        event.stopPropagation();
        if (!enabled || event.button !== 0) return;
        const slide = slideRef.current;
        if (!slide || !slide.offsetWidth || !slide.offsetHeight) return;
        const rect = slide.getBoundingClientRect();
        const scaleX = rect.width / slide.offsetWidth;
        const scaleY = rect.height / slide.offsetHeight;
        if (scaleX <= 0 || scaleY <= 0) return;

        const workspace = workspaceRef?.current;
        if (!workspace) return;
        const workspaceRect = workspace.getBoundingClientRect();
        const left = workspaceRect.left + workspace.clientLeft;
        const top = workspaceRect.top + workspace.clientTop;
        const right = left + workspace.clientWidth;
        const bottom = top + workspace.clientHeight;
        const minWidth = Math.max(30, 2 * ((left - rect.left) / scaleX - x));
        const minHeight = Math.max(30, 2 * ((top - rect.top) / scaleY - y));
        const maxWidth = Math.max(minWidth, (right - rect.left) / scaleX - x);
        const maxHeight = Math.max(minHeight, (bottom - rect.top) / scaleY - y);

        event.preventDefault();
        event.currentTarget.parentElement?.focus();
        resizeRef.current = {
            width, height,
            startX: event.clientX,
            startY: event.clientY,
            scaleX, scaleY,
            minWidth, minHeight,
            maxWidth, maxHeight,
            current: { width, height },
            moved: false,
        };
    };

    return {
        size: size ?? { width, height },
        resizeHandlers: {
            onMouseDown,
            onPointerDown: (event: React.PointerEvent<HTMLDivElement>) => event.stopPropagation(),
            onClick: (event: MouseEvent<HTMLDivElement>) => event.stopPropagation(),
        },
    };
}

export { useObjectResize };
