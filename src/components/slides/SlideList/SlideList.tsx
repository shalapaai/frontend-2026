import { Presentation } from "../../../types/presentation";
import styles from "./SlideList.module.css";
import { SlideView } from "../SlideView/SlideView";

type SlideListProps = {
    presentation: Presentation,
    setActiveSlideId: (s: string) => void,
    activeSlideId: string
}


function SlideList(props: SlideListProps) {
    const scale = 150 / 1280; 

    return (
        <div className={styles.slideList}>
            {props.presentation.slides.map((slide) => {
                const isActive = slide.id === props.activeSlideId;
                
                return (
                    <div
                        key={slide.id}
                        className={isActive ? styles.thumbnailWrapperActive : styles.thumbnailWrapper}
                        onClick={() => props.setActiveSlideId(slide.id)}
                    >
                        <div
                            className={styles.thumbnailInner}
                            style={{
                                transform: `scale(${scale})`,
                                background: slide.background.type === "solid" 
                                    ? slide.background.color 
                                    : "#fff",
                            }}
                        >
                            <SlideView
                                slide={slide}
                                preview={false} 
                                className="slideThumbnail"
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export {
    SlideList
}
