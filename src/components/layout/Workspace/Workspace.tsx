import { Slide } from "../../../types/slide";
import styles from "./Workspace.module.css";
import { SlideView } from "../../slides/SlideView/SlideView";
import { MenuState } from "../EditorContainer/EditorContainer";

type WorkspaceProps = {
    previewSlide: Slide | undefined,
    setPreviewSlide: (s: Slide) => void,
    setMenuState: (menu: MenuState) => void
}

function Workspace(props: WorkspaceProps) {
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
        <div className={styles.workspace} >
            <SlideView 
                slide={props.previewSlide} 
                setPreviewSlide={props.setPreviewSlide}
                preview={true}
                className="slideWorkspacePreview"
                setMenuState= {props.setMenuState}
            />
        </div>
    )
}

export {
    Workspace
}
