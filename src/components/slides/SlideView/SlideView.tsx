import { Slide } from "../../../types/slide";
import { SlideObject } from "../SlideObject/SlideObject";
import styles from "./SlideView.module.css";

type SlideViewProps = {
    slide: Slide,
    preview: boolean,
    setPreviewSlide?: (slide: Slide) => void
    setActiveSlideId?: (s: string) => void
    className: string
}

function SlideView(props: SlideViewProps) {
    return (
        <div
            className={styles[props.className]}
            onClick={() => {
                if (props.setActiveSlideId)
                    props.setActiveSlideId(props.slide.id);
            }}
        >
            {props.slide.objects.map((object) => (
                <SlideObject
                    key={object.id}
                    slide={props.slide}
                    object={object}
                    preview={props.preview}
                    setPreviewSlide={props.setPreviewSlide}
                />
            ))}
        </div>
    )
}

export {
    SlideView
}
