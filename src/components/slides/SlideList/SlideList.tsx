import styles from "./SlideList.module.css";
import { SlideView } from "../SlideView/SlideView";
import { useEffect } from "react";
import { MenuState } from "../../layout/EditorContainer/EditorContainer";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { useSlideSelection } from "../../hooks/useSlideSelection";
import { removeSlides } from "../../../store/slices/presentationSlice";
import { clearSelection } from "../../../store/slices/viewModelSlice";
import { isEditableTarget } from "../../utils/isEditableTarget";

type SlideListProps = {
    setMenuState: (state: MenuState) => void,
}

function SlideList(props: SlideListProps) {
    const dispatch = useAppDispatch();
    const presentation = useAppSelector(state => state.presentation);
    const selectionTarget = useAppSelector(state => state.viewModel.selectionTarget);
    const { activeSlideId, selectedSlideIds, selectSlide } = useSlideSelection();
    const { setMenuState } = props;
    const scale = 150 / 1280; 

    const handleContextMenu = (e: React.MouseEvent, slideId: string) => {
        e.preventDefault(); 
        e.stopPropagation(); 

        props.setMenuState({
            type: "slide",
            x: e.clientX, 
            y: e.clientY, 
            slideId: slideId,
        });
    };

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.defaultPrevented ||(event.key !== "ArrowUp" && event.key !== "ArrowDown")) 
                return;
            if (isEditableTarget(event.target)) return;

            if (!presentation) return;
            const slides = presentation.slides;
            if (slides.length === 0) return;
            event.preventDefault();
            const currentIndex = slides.findIndex(slide => slide.id === activeSlideId);
            const nextIndex = currentIndex === -1
                ? 0
                : Math.max(
                    0,
                    Math.min(
                        slides.length - 1,
                        currentIndex + (event.key === "ArrowDown" ? 1 : -1)
                    )
                );

            selectSlide(slides[nextIndex].id);
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [presentation, activeSlideId, selectSlide]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key !== "Delete" || event.defaultPrevented) return;
            if (isEditableTarget(event.target)) return;
            if (selectionTarget !== "slides" || selectedSlideIds.length === 0) return;

            event.preventDefault();
            dispatch(removeSlides({ slideIds: selectedSlideIds }));
            dispatch(clearSelection());
            setMenuState(null);
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [selectionTarget, selectedSlideIds, dispatch, setMenuState]);

    if (!presentation) return null;

    return (
        <div className={styles.slideList}>
            {presentation.slides.map((slide) => {
                const isSelected = selectedSlideIds.includes(slide.id);
                return (
                    <div
                        key={slide.id}
                        tabIndex={-1}
                        className={isSelected ? styles.thumbnailWrapperActive : styles.thumbnailWrapper}
                        onClick={(event) => {
                            event.stopPropagation();
                            event.currentTarget.focus();
                            selectSlide(slide.id, event.ctrlKey || event.metaKey);
                        }}
                        onContextMenu={(e) => handleContextMenu(e, slide.id)}
                    >
                        <div
                            className={styles.thumbnailInner}
                            style={{
                                transform: `scale(${scale})`,
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
