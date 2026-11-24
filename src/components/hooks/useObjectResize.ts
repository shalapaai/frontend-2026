import type { SlideObject } from "../../types/objects";
import { useCallback, useEffect, useRef, useState } from "react";
import type { MouseEvent, RefObject } from "react";

type Size = { 
    width: number,
    height: number 
};

type Options = {
    object: SlideObject,
    workspaceRef?: RefObject<HTMLDivElement | null>,
    enabled: boolean,
    slideRef: RefObject<HTMLDivElement | null>,
    onResizeEnd: (size: Size) => void,
};

type ResizeState = Size & {
    startX: number;
    startY: number;
    scale: number;
    moved: boolean;
};

function useObjectResize({ object, enabled, slideRef, onResizeEnd }: Options) {
    const { width, height } = object;
    const resizeRef = useRef<ResizeState | null>(null);
    const [size, setSize] = useState<Size | null>(null);
    
    const getSize = useCallback((event: globalThis.MouseEvent, resize: ResizeState): Size => ({
        width: Math.max(30, resize.width + (event.clientX - resize.startX) / resize.scale),
        height: Math.max(30, resize.height + (event.clientY - resize.startY) / resize.scale),
    }), []);

    useEffect(() => {
        const handleMove = (event: globalThis.MouseEvent) => {
            const resize = resizeRef.current;
            if (!resize) return;
            resize.moved = true;
            setSize(getSize(event, resize));
        };

        const handleUp = (event: globalThis.MouseEvent) => {
            const resize = resizeRef.current;
            if (!resize || event.button !== 0) return;
            resizeRef.current = null;
            setSize(null);
            if (!resize.moved) return;

            const nextSize = getSize(event, resize);
            if (nextSize.width !== resize.width || nextSize.height !== resize.height) {
                onResizeEnd(nextSize);
            }
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
    }, [getSize, onResizeEnd]);

    const onMouseDown = (event: MouseEvent<HTMLDivElement>) => {
        event.stopPropagation();
        if (!enabled || event.button !== 0) return;
        const slide = slideRef.current;
        if (!slide || !slide.offsetWidth || !slide.offsetHeight) return;
        const scale = slide.getBoundingClientRect().width / slide.offsetWidth;
        if (scale <= 0) return;

        event.preventDefault();
        event.currentTarget.parentElement?.focus();
        resizeRef.current = {
            width, height,
            startX: event.clientX,
            startY: event.clientY,
            scale,
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
