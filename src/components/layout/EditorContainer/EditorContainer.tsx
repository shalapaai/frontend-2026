import styles from "./EditorContainer.module.css"
import { SlideList } from "../../slides/SlideList/SlideList";
import { Workspace } from "../Workspace/Workspace";
import { useCallback, useEffect, useState } from "react";
import { Slide } from "../../../types/slide";
import { ContextMenu } from "../../ContextMenu/ContextMenu";
import {
    removeSlides,
    setPresentation,
    setActiveSlide,
    setSelectedObjects,
    clearSelection as clearObjectSelection,
} from "../../../store/slices/presentationSlice";
import { updateSlide } from "../../../functions/slide";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";

type MenuState =
    | {
        type: "slide";
        slideId: string;
        x: number;
        y: number;
    }
    | {
        type: "object";
        slideId: string;
        objectId: string;
        x: number;
        y: number;
    }
    | null;

function EditorContainer() {
    const dispatch = useAppDispatch();
    const presentation = useAppSelector(state => state.presentation.presentation);
    const activeSlideId = useAppSelector(state => state.presentation.activeSlideId);
    const selectedObjectIds = useAppSelector(state => state.presentation.selectedObjectIds);
    const [menuState, setMenuState] = useState<MenuState>(null);
    const [selectedSlideIds, setSelectedSlideIds] = useState<string[]>(
        activeSlideId ? [activeSlideId] : []
    );
    const [selectionTarget, setSelectionTarget] = useState<
        "slides" | "objects"
    >("slides");

    const setActiveSlideId = useCallback((id: string | null) => {
        dispatch(setActiveSlide(id));
    }, [dispatch]);

    const setSelectedObjectIds = useCallback((ids: string[]) => {
        dispatch(setSelectedObjects(ids));
    }, [dispatch]);

    const handleSlideChange = (updatedSlide: Slide) => {
        if (!presentation) return;
        dispatch(setPresentation(updateSlide(presentation, updatedSlide.id, () => updatedSlide)));
    };

    const clearSelection = () => {
        setSelectedObjectIds([]);
        setSelectedSlideIds(
            activeSlideId ? [activeSlideId] : []
        );
    };

    const deleteSlides = (ids: string[]) => {
        if (!presentation) return;
        const remainingSlides = presentation.slides.filter(slide => !ids.includes(slide.id));
        const nextActiveId = remainingSlides.some(slide => slide.id === activeSlideId)
            ? activeSlideId : remainingSlides[0]?.id ?? null;

        dispatch(removeSlides({ slideIds: ids }));
        setSelectedSlideIds(nextActiveId ? [nextActiveId] : []);
        dispatch(clearObjectSelection());
    };

    const deleteObjects = (slideId: string, ids: string[]) => {
        const slide = presentation?.slides.find(
            slide => slide.id === slideId
        );
        if (!slide) return;

        const objects = slide.objects.filter(object => !ids.includes(object.id));
        if (objects.length !== slide.objects.length) {
            handleSlideChange({ ...slide, objects });
        }

        setSelectedObjectIds([]);
    };

    const isMenuOpen = menuState !== null;

    useEffect(() => {
        const handleClickOutside = () => {
            setMenuState(null);
        };
        if (isMenuOpen) window.addEventListener("click", handleClickOutside);
        return () => window.removeEventListener("click", handleClickOutside);
    }, [isMenuOpen]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key !== "Delete" || event.defaultPrevented) return;
            const target = event.target;
            if (target instanceof HTMLElement &&
                target.closest(
                    'input, textarea, select, [contenteditable]:not([contenteditable="false"])'
                )
            ) return;

            if (selectionTarget === "objects" &&
                activeSlideId &&
                selectedObjectIds.length > 0
            ) {
                event.preventDefault();
                deleteObjects(activeSlideId, selectedObjectIds);
            } else if (
                selectionTarget === "slides" &&
                selectedSlideIds.length > 0
            ) {
                event.preventDefault();
                deleteSlides(selectedSlideIds);
            } else {
                return;
            }

            setMenuState(null);
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    });

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key !== "Escape") return;

            setSelectedObjectIds([]);
            setSelectedSlideIds(activeSlideId ? [activeSlideId] : []);
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [activeSlideId, setSelectedObjectIds]);

    if (!presentation) return null;

    return (
        <div 
            className={styles.twoPanelsLayout}
            onClick={event => {
                if (event.defaultPrevented) return;
                if (event.target instanceof Element && event.target.closest("[data-slide-object]")) return;
                clearSelection();
            }}
        >
            <SlideList 
                setMenuState={setMenuState}
                selectedSlideIds={selectedSlideIds}
                setSelectedSlideIds={setSelectedSlideIds}
                setSelectionTarget={setSelectionTarget}
            />
            <Workspace 
                setMenuState={setMenuState}
                setSelectionTarget={setSelectionTarget}
            />
            {menuState !== null && (
                <ContextMenu
                    x={menuState.x}
                    y={menuState.y}
                    onClose={() => setMenuState(null)}
                    onDelete={() => {
                        if (!menuState) return;

                        if (menuState.type === "slide") {
                            const ids = selectedSlideIds.includes(menuState.slideId)
                                ? selectedSlideIds
                                : [menuState.slideId];
                            deleteSlides(ids);
                        } else {
                            const ids = selectedObjectIds.includes(menuState.objectId)
                                ? selectedObjectIds
                                : [menuState.objectId];
                            deleteObjects(menuState.slideId, ids);
                        }
                        setMenuState(null);
                    }}
                />
            )}
        </div>
    )
}

export {
    EditorContainer,
    MenuState
}
