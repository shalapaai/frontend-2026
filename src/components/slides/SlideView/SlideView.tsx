import { useRef } from "react";
import type { RefObject } from "react";
import { Slide } from "../../../types/slide";
import { MenuState } from "../../layout/EditorContainer/EditorContainer";
import { SlideObject } from "../SlideObject/SlideObject";
import styles from "./SlideView.module.css";

type SlideViewProps = {
    workspaceRef?: RefObject<HTMLDivElement | null>;
    slide: Slide,
    preview: boolean,
    setPreviewSlide?: (slide: Slide) => void,
    className: string,
    setMenuState?: (menu: MenuState) => void,
    selectedObjectIds?: string[],
    setSelectedSlideIds?: (s: string[]) => void,
    setSelectedObjectIds?: (s: string[]) => void,
    setSelectionTarget?: (s: "slides" | "objects") => void
}

function SlideView(props: SlideViewProps) {
    const slideRef = useRef<HTMLDivElement>(null);
    const handleContextMenu = (e: React.MouseEvent, objectId: string) => {
        if (!props.setMenuState) return;
        e.preventDefault(); 
        e.stopPropagation(); 

        props.setMenuState({
            type: "object",
            x: e.clientX, 
            y: e.clientY, 
            slideId: props.slide.id,
            objectId: objectId
        });
    };

    const handleObjectSelect = (objectId: string, additive: boolean) => {
        console.log(props.selectedObjectIds);
        if (props.preview === false || !props.setSelectedObjectIds || 
            !props.selectedObjectIds || !props.setSelectionTarget) return;
        
        props.setSelectionTarget("objects");
        if (!additive) {
            props.setSelectedObjectIds([objectId]);
            return;
        }

        const selectedIds = props.selectedObjectIds;

        props.setSelectedObjectIds(
            selectedIds.includes(objectId)
                ? selectedIds.filter(id => id !== objectId)
                : [...selectedIds, objectId]
        );
    };
    return (
        <div
            ref={slideRef}
            className={styles[props.className]}
            style={{
                background: props.slide.background.type === "solid" 
                    ? props.slide.background.color 
                    : "#fff",
            }}
        >
            {props.slide.objects.map((object) => (
                <div 
                    key={object.id}
                    onContextMenu={(e) => handleContextMenu(e, object.id)}
                >
                    <SlideObject
                        workspaceRef={props.workspaceRef}
                        slideRef={slideRef}
                        slide={props.slide}
                        object={object}
                        preview={props.preview}
                        setPreviewSlide={props.setPreviewSlide}
                        selectedObjectIds={props.selectedObjectIds}
                        onSelect={handleObjectSelect}
                    />
                </div>
            ))}
        </div>
    )
}

export {
    SlideView
}
