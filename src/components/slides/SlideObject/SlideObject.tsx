import { useObjectResize } from "../../hooks/useObjectResize";
import { useCallback } from "react";
import type { MouseEvent, RefObject } from "react";
import { SlideObject } from "../../../types/objects";
import styles from "./SlideObject.module.css";
import { TextInput } from "../../ui/TextInput/TextInput";
import { updateObject } from "../../../functions/objects";
import { Slide } from "../../../types/slide";
import { useObjectDrag } from "../../hooks/useObjectDrag";

type SlideObjectProps = {
    workspaceRef?: RefObject<HTMLDivElement | null>;
    slideRef: RefObject<HTMLDivElement | null>;
    object: SlideObject,
    slide: Slide,
    preview?: boolean;
    setPreviewSlide?: (s: Slide) => void,
    selectedObjectIds?: string[],
    onSelect?: (objectId: string, additive: boolean) => void;
}

function SlideObject(props: SlideObjectProps) {
    const { preview, onSelect, object, slide, setPreviewSlide } = props;

    const handleClick = useCallback((event: MouseEvent<HTMLDivElement>) => {
        if (!preview) return;
        if (event.target !== event.currentTarget) {
            onSelect?.(object.id, false);
            return;
        }

        event.preventDefault();
        event.currentTarget.focus();
        onSelect?.(object.id, event.ctrlKey || event.metaKey);
    }, [preview, onSelect, object.id]);

    const handleSubmit = useCallback((text: string) => {
        setPreviewSlide?.(updateObject(slide, object.id, { text }));
    }, [setPreviewSlide, slide, object.id]);

    const isSelected = props.selectedObjectIds?.includes(props.object.id) ?? false;
    const { position, dragHandlers } = useObjectDrag({
        object: props.object,
        workspaceRef: props.workspaceRef,
        slideRef: props.slideRef,
        enabled: props.preview === true,
        onDragEnd: position => {
            props.setPreviewSlide?.(
                updateObject(props.slide, props.object.id, position)
            );
        },
    });
    const { size, resizeHandlers } = useObjectResize({
        object: props.object,
        workspaceRef: props.workspaceRef,
        enabled: props.preview === true && isSelected,
        slideRef: props.slideRef,
        onResizeEnd: ({ width, height }) => {
            props.setPreviewSlide?.(
                updateObject(props.slide, props.object.id, { width, height })
            );
        },
    });
    return (
        <div
            {...dragHandlers}
            data-slide-object
            tabIndex={props.preview ? -1 : undefined}
            className={[
                styles.objectFrame,
                props.preview ? styles.objectFramePreview : "",
                isSelected ? styles.objectFrameSelected : "",
            ].join(" ")}
            style={{
                left: position.x - 5,
                top: position.y - 5,
                width: size.width,
                height: size.height,
                boxSizing: "content-box",
                pointerEvents: props.preview ? "auto" : "none",
            }}
            onClick={handleClick}
        >
            {props.object.type === "text" ? (
                <TextInput 
                    className={styles.objectInput}
                    value={props.object.text}
                    style={{
                        fontFamily: props.object.fontFamily,
                        fontSize: props.object.fontSize,
                        color: props.object.fontColor,
                    }}
                    onSubmit={handleSubmit}
                    readOnly={!props.preview}
                />
            ) : (
                <img
                    src={props.object.src}
                    alt=""
                    draggable={false}
                    className={styles.objectImage}
                />
            )}
            
            {props.preview && isSelected && (
                <div className={styles.resizeHandle} {...resizeHandlers} />
            )}
        </div>
    )
}

export {
    SlideObject
}
