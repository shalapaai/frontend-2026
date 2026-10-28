import { useRef } from "react";
import { Slide } from "../../../types/slide";
import styles from "./Workspace.module.css";
import { SlideView } from "../../slides/SlideView/SlideView";
import { MenuState } from "../EditorContainer/EditorContainer";

type WorkspaceProps = {
    previewSlide: Slide | undefined,
    setPreviewSlide: (s: Slide) => void,
    setMenuState: (menu: MenuState) => void,
    selectedObjectIds: string[],
    setSelectedSlideIds: (s: string[]) => void,
    setSelectedObjectIds: (s: string[]) => void,
    setSelectionTarget: (s: "slides" | "objects") => void
}

function Workspace(props: WorkspaceProps) {
    const workspaceRef = useRef<HTMLDivElement>(null);
    if (props.previewSlide === undefined) {
        return (
            <div className={styles.workspace}>
                <div className={styles.emptyState}>
                    Выберите слайд для редактирования
                </div>
            </div>
        );
    }
    return (
        <div ref={workspaceRef} className={styles.workspace}>
            <SlideView 
                workspaceRef={workspaceRef}
                slide={props.previewSlide} 
                setPreviewSlide={props.setPreviewSlide}
                preview={true}
                className="slideWorkspacePreview"
                setMenuState= {props.setMenuState}
                selectedObjectIds={props.selectedObjectIds}
                setSelectedSlideIds={props.setSelectedSlideIds}
                setSelectedObjectIds={props.setSelectedObjectIds}
                setSelectionTarget={props.setSelectionTarget}
            />
        </div>
    )
}

export {
    Workspace
}
