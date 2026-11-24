import { useObjectResize } from "../../hooks/useObjectResize";
import { useCallback } from "react";
import type { MouseEvent, RefObject } from "react";
import { SlideObject } from "../../../types/objects";
import styles from "./SlideObject.module.css";
import { TextInput } from "../../ui/TextInput/TextInput";
import { updateObject } from "../../../store/slices/presentationSlice";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { useObjectDrag } from "../../hooks/useObjectDrag";

type SlideObjectProps = {
    workspaceRef?: RefObject<HTMLDivElement | null>;
    slideRef: RefObject<HTMLDivElement | null>;
    object: SlideObject,
    slideId: string,
    preview?: boolean;
    onSelect?: (objectId: string, additive: boolean) => void;
}

function SlideObject(props: SlideObjectProps) {
    const dispatch = useAppDispatch();
    const { preview, onSelect, object, slideId } = props;

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
        if (!preview) return;
        dispatch(updateObject({ slideId, objectId: object.id, changes: { text } }));
    }, [dispatch, preview, slideId, object.id]);

    const isSelected = useAppSelector(state =>
        preview === true &&
        state.viewModel.activeSlideId === slideId &&
        state.viewModel.selectedObjectIds.includes(object.id)
    );
    const { position, dragHandlers } = useObjectDrag({
        object: props.object,
        workspaceRef: props.workspaceRef,
        slideRef: props.slideRef,
        enabled: props.preview === true,
        onDragEnd: position => {
            dispatch(updateObject({ slideId, objectId: object.id, changes: position }));
        },
    });
    const { size, resizeHandlers } = useObjectResize({
        object: props.object,
        workspaceRef: props.workspaceRef,
        enabled: props.preview === true && isSelected,
        slideRef: props.slideRef,
        onResizeEnd: ({ width, height }) => {
            dispatch(updateObject({ slideId, objectId: object.id, changes: { width, height } }));
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
