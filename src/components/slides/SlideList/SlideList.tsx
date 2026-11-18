import { setActiveSlide, clearSelection } from "../../../store/slices/presentationSlice";
import styles from "./SlideList.module.css";
import { SlideView } from "../SlideView/SlideView";
import { useEffect } from "react";
import { MenuState } from "../../layout/EditorContainer/EditorContainer";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";

type SlideListProps = {
    setMenuState: (state: MenuState) => void,
    selectedSlideIds: string[],
    setSelectedSlideIds: (s: string[]) => void,
    setSelectionTarget: (s: "slides" | "objects") => void
}

function SlideList(props: SlideListProps) {
    const dispatch = useAppDispatch();
    const presentation = useAppSelector(state => state.presentation.presentation);
    const activeSlideId = useAppSelector(state => state.presentation.activeSlideId);
    const { setSelectedSlideIds, setSelectionTarget } = props;
    const scale = 150 / 1280; 

    const handleSlideSelect = (slideId: string, additive: boolean) => {
        props.setSelectionTarget("slides");
        const selectedIds = props.selectedSlideIds;
        let nextIds: string[];

        if (!additive) {
            nextIds = [slideId];
        } else if (selectedIds.includes(slideId)) {
            if (selectedIds.length === 1) return;
            nextIds = selectedIds.filter(id => id !== slideId);
        } else {
            nextIds = [...selectedIds, slideId];
        }

        props.setSelectedSlideIds(nextIds);

        if (!additive || !selectedIds.includes(slideId)) {
            dispatch(setActiveSlide(slideId));
        } else if (activeSlideId === slideId) {
            dispatch(setActiveSlide(nextIds[0]));
        }
    };

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

            const target = event.target;

            if (target instanceof HTMLElement &&
                (target.isContentEditable 
                    || (target instanceof HTMLInputElement && !target.readOnly && !target.disabled)
                    || ( target instanceof HTMLTextAreaElement && !target.readOnly && !target.disabled))
            ) return;

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

            const nextSlide = slides[nextIndex];

            dispatch(setActiveSlide(nextSlide.id));
            setSelectedSlideIds([nextSlide.id]);
            setSelectionTarget("slides");
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [presentation, activeSlideId, dispatch, setSelectedSlideIds, setSelectionTarget]);

    if (!presentation) return null;

    return (
        <div className={styles.slideList}>
            {presentation.slides.map((slide) => {
                const isSelected = props.selectedSlideIds.includes(slide.id);
                return (
                    <div
                        key={slide.id}
                        tabIndex={-1}
                        className={isSelected ? styles.thumbnailWrapperActive : styles.thumbnailWrapper}
                        onClick={(event) => {
                            event.stopPropagation();
                            event.currentTarget.focus();
                            dispatch(clearSelection());
                            handleSlideSelect(slide.id, event.ctrlKey || event.metaKey);
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
