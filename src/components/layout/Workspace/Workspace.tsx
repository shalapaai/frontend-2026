import { Slide } from "../../../types/slide";
import styles from "./Workspace.module.css";
import { SlidePreview } from "../../slides/SlidePreview/SlidePreview";

type WorkspaceProps = {
    slide: Slide,
}

function Workspace(props: WorkspaceProps) {
    return (
        <div className={styles.workspace}>
            <SlidePreview slide={props.slide} />
        </div>
    )
}

export {
    Workspace
}
