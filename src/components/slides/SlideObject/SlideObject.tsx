import { useObjectResize } from "../../hooks/useObjectResize";
import type { RefObject } from "react";
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
    const isSelected = props.selectedObjectIds?.includes(props.object.id) ?? false;
    const { position, dragHandlers } = useObjectDrag({
        x: props.object.x,
        y: props.object.y,
        width: props.object.width,
        height: props.object.height,
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
        x: props.object.x,
        y: props.object.y,
        workspaceRef: props.workspaceRef,
        width: props.object.width,
        height: props.object.height,
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
            onClick={event => {
                if (!props.preview) return;
                event.stopPropagation();
                if (event.target !== event.currentTarget) {
                    props.onSelect?.(props.object.id, false);
                    return;
                }

                event.currentTarget.focus();
                props.onSelect?.(
                    props.object.id,
                    event.ctrlKey || event.metaKey
                );
            }}
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
                    onSubmit={(value) => {
                        if (!props.setPreviewSlide) return;
                        const updatedSlide = updateObject(props.slide, props.object.id, { text: value });
                        props.setPreviewSlide(updatedSlide);
                        console.log(value);
                    }}
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
