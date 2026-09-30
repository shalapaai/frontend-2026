import { Presentation } from "../../../types/presentation";
import styles from "./SlideList.module.css";
import { SlideThumbnail } from "../SlideThumbnail/SlideThumbnail";

type SlideListProps = {
    presentation: Presentation 
}

function SlideList(props: SlideListProps) {
    return (
        <div className={styles.slideList}>
            {props.presentation.slides.map((slide) =>
                <SlideThumbnail key={slide.id} slide={slide} />
            )}
        </div>
    )
}

export {
    SlideList
}
