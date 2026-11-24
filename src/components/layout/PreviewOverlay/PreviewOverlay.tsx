import { useCallback, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { setActiveSlide, setPreviewMode } from "../../../store/slices/viewModelSlice";
import { SlideView } from "../../slides/SlideView/SlideView";
import styles from "./PreviewOverlay.module.css";

function PreviewOverlay() {
    const dispatch = useAppDispatch();
    const presentation = useAppSelector(state => state.presentation);
    const activeSlideId = useAppSelector(state => state.viewModel.activeSlideId);

    const handleClose = useCallback(() => {
        dispatch(setPreviewMode(false));
    }, [dispatch]);

    const changeSlide = useCallback((direction: number) => {
        if (!presentation) return;
        const currentIndex = presentation.slides.findIndex(slide => slide.id === activeSlideId);
        if (currentIndex === -1) return;
        const nextSlide = presentation.slides[currentIndex + direction];
        if (nextSlide) dispatch(setActiveSlide(nextSlide.id));
    }, [presentation, activeSlideId, dispatch]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                event.preventDefault();
                handleClose();
            } else if (event.key === "ArrowRight") {
                event.preventDefault();
                changeSlide(1);
            } else if (event.key === "ArrowLeft") {
                event.preventDefault();
                changeSlide(-1);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [handleClose, changeSlide]);

    const activeSlide = presentation?.slides.find(slide => slide.id === activeSlideId);
    if (!activeSlide) {
        return (
            <div className={styles.previewOverlay} onClick={handleClose}>
                <div className={styles.emptyState}>Добавьте слайд</div>
            </div>
        );
    }
    const scale = Math.min(window.innerWidth / 1280, window.innerHeight / 720);
    return (
        <div className={styles.previewOverlay} onClick={() => changeSlide(1)}>
            <div
                className={styles.slideContainer}
                style={{ transform: `scale(${scale})` }}
            >
                <SlideView slide={activeSlide} preview={false} className="slideView" />
            </div>
        </div>
    );
}

export { PreviewOverlay };
