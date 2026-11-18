import { useAppSelector } from "../../../store/hooks";
import { useRef } from "react";
import styles from "./Workspace.module.css";
import { SlideView } from "../../slides/SlideView/SlideView";
import { MenuState } from "../EditorContainer/EditorContainer";

type WorkspaceProps = {
    setMenuState: (menu: MenuState) => void,
    setSelectionTarget: (s: "slides" | "objects") => void
}

function Workspace(props: WorkspaceProps) {
    const presentation = useAppSelector(state => state.presentation.presentation);
    const activeSlideId = useAppSelector(state => state.presentation.activeSlideId);
    const activeSlide = presentation?.slides.find(slide => slide.id === activeSlideId);
    const workspaceRef = useRef<HTMLDivElement>(null);

    if (!activeSlide) {
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
                slide={activeSlide} 
                preview={true}
                className="slideWorkspacePreview"
                setMenuState= {props.setMenuState}
                setSelectionTarget={props.setSelectionTarget}
            />
        </div>
    )
}

export {
    Workspace
}
