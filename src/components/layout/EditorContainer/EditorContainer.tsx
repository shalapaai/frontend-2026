import styles from "./EditorContainer.module.css"
import { Presentation } from "../../../types/presentation";
import { SlideList } from "../../slides/SlideList/SlideList";
import { Workspace } from "../Workspace/Workspace";
import { useState } from "react";

type TwoPanelsLayoutProps = {
    presentation: Presentation,
    setPresentation: (p: Presentation) => void,
    setActiveSlideId: (s: string) => void,
    activeSlideId: string
}

function EditorContainer(props: TwoPanelsLayoutProps) {
    const activeSlide = props.presentation.slides.find(slide => slide.id === props.activeSlideId);
    if (!activeSlide) return (
        <></>
    )
    const [previewSlide, setPreviewSlide] = useState(activeSlide);
    if (previewSlide !== activeSlide) setPreviewSlide(activeSlide)
    return (
        <div className={styles.twoPanelsLayout}>
            <SlideList 
                presentation={props.presentation} 
                setActiveSlideId={props.setActiveSlideId}
                activeSlideId={props.activeSlideId}
            />
            <Workspace 
                previewSlide={previewSlide}
                setPreviewSlide={setPreviewSlide}
                activeSlideId={props.activeSlideId}
            />
        </div>
    )
}

export {
    EditorContainer
}
