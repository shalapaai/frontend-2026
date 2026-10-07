import { Presentation } from "../../../types/presentation";
import { SlideView } from "../../slides/SlideView/SlideView"
import styles from './PreviewOverlay.module.css';
import { useEffect } from "react";

type PreviewOverlayProps = {
    presentation: Presentation,
    activeSlideId: string,
    setActiveSlideId: (s: string) => void,
    onClose: () => void
}

function PreviewOverlay(props: PreviewOverlayProps) {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                props.onClose();
                return;
            }
            const currentIndex = props.presentation.slides.findIndex(
                (slide) => slide.id === props.activeSlideId
            );
            if (currentIndex === -1) return;

            if (event.key === "ArrowRight") {
                if (currentIndex < props.presentation.slides.length - 1) {
                    props.setActiveSlideId(props.presentation.slides[currentIndex + 1].id);
                }
            } 
            else if (event.key === "ArrowLeft") {
                if (currentIndex > 0) {
                    props.setActiveSlideId(props.presentation.slides[currentIndex - 1].id);
                }
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [props.activeSlideId, props.onClose]);

    const scaleX = window.innerWidth / 1280;
    const scaleY = window.innerHeight / 720;
    const scale = Math.min(scaleX, scaleY);

    const activeSlide = props.presentation.slides.find(slide => slide.id === props.activeSlideId);
    if (!activeSlide) return;

    return (
        <div className={styles.previewOverlay} onClick={props.onClose}>
            <div
                className={styles.slideContainer}
                style={{
                    transform: `scale(${scale})`,
                    backgroundColor: activeSlide.background.type === "solid" 
                        ? activeSlide.background.color 
                        : "#ffffff",
                }}
            >
                <SlideView 
                    slide={activeSlide}
                    preview={false} 
                    className="slideView"
                />
            </div>
        </div>
    )
}

export {
    PreviewOverlay
}
