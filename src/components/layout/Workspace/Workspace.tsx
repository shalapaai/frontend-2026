import { Slide } from "../../../types/slide";
import styles from "./Workspace.module.css";
import { SlideView } from "../../slides/SlideView/SlideView";

type WorkspaceProps = {
    previewSlide: Slide,
    setPreviewSlide: (s: Slide) => void,
    activeSlideId: string
}

function Workspace(props: WorkspaceProps) {
    return (
        <div className={styles.workspace}>
            <SlideView 
                slide={props.previewSlide} 
                setPreviewSlide={props.setPreviewSlide}
                preview={true}
                className="slideWorkspacePreview"
            />
        </div>
    )
}

export {
    Workspace
}
