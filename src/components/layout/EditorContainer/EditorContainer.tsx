import styles from "./EditorContainer.module.css"
import { Presentation } from "../../../types/presentation";
import { SlideList } from "../../slides/SlideList/SlideList";
import { Workspace } from "../Workspace/Workspace";
import { useEffect, useState } from "react";
import { Slide } from "../../../types/slide";
import { ContextMenu } from "../../ContextMenu/ContextMenu";
import { removeSlides } from "../../../functions/slide";
import { deepClone } from "../../../functions/utils";

type EditorContainerProps = {
    presentation: Presentation,
    setPresentation: (p: Presentation) => void,
    setActiveSlideId: (s: string | null) => void,
    activeSlideId: string | null,
    selectedObjectIds: string[];
    setSelectedObjectIds: (s: string[]) => void
}

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

function EditorContainer(props: EditorContainerProps) {
    let activeSlide = props.presentation.slides.find(slide => slide.id === props.activeSlideId);
    const [previewSlide, setPreviewSlide] = useState<Slide | undefined>(activeSlide);
    const [menuState, setMenuState] = useState<MenuState>(null);
    const [selectedSlideIds, setSelectedSlideIds] = useState<string[]>(
        props.activeSlideId ? [props.activeSlideId] : []
    );
    const { selectedObjectIds, setSelectedObjectIds } = props;
    const [selectionTarget, setSelectionTarget] = useState<
        "slides" | "objects"
    >("slides");

    if (previewSlide !== activeSlide) setPreviewSlide(activeSlide);

    const handleSlideChange = (updatedSlide: Slide) => {
        setPreviewSlide(updatedSlide);

        const newPresentation = deepClone(props.presentation);
        newPresentation.slides = newPresentation.slides.map(slide =>
            slide.id === updatedSlide.id ? updatedSlide : slide
        );
        props.setPresentation(newPresentation);
    };

    const clearSelection = () => {
        setSelectedObjectIds([]);
        setSelectedSlideIds(
            props.activeSlideId ? [props.activeSlideId] : []
        );
    };

    const deleteSlides = (ids: string[]) => {
        const updatedPresentation = removeSlides(props.presentation, ids);
        const remainingSlides = updatedPresentation.slides;

        const nextActiveId = remainingSlides.some(
            slide => slide.id === props.activeSlideId
        )
            ? props.activeSlideId
            : remainingSlides[0]?.id ?? null;

        props.setPresentation(updatedPresentation);
        props.setActiveSlideId(nextActiveId);
        setSelectedSlideIds(nextActiveId ? [nextActiveId] : []);
        setSelectedObjectIds([]);
    };

    const deleteObjects = (slideId: string, ids: string[]) => {
        const slide = props.presentation.slides.find(
            slide => slide.id === slideId
        );
        if (!slide) return;

        handleSlideChange({
            ...slide,
            objects: slide.objects.filter(object => !ids.includes(object.id)),
        });

        setSelectedObjectIds([]);
    };

    useEffect(() => {
        const handleClickOutside = () => {
            setMenuState(null);
        };

        if (menuState !== null) {
            window.addEventListener("click", handleClickOutside);
        }

        return () => {
            window.removeEventListener("click", handleClickOutside);
        };
    }, [menuState !== null]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key !== "Delete" || event.defaultPrevented) return;
            const target = event.target;
            if (
                target instanceof HTMLElement &&
                target.closest(
                    'input, textarea, select, [contenteditable]:not([contenteditable="false"])'
                )
            ) {
                return;
            }

            if (
                selectionTarget === "objects" &&
                props.activeSlideId &&
                selectedObjectIds.length > 0
            ) {
                event.preventDefault();
                deleteObjects(props.activeSlideId, selectedObjectIds);
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
            setSelectedSlideIds(
                props.activeSlideId ? [props.activeSlideId] : []
            );
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [props.activeSlideId]);

    return (
        <div 
            className={styles.twoPanelsLayout}
            onClick={clearSelection}
        >
            <SlideList 
                presentation={props.presentation} 
                setPresentation={props.setPresentation}
                setActiveSlideId={props.setActiveSlideId}
                activeSlideId={props.activeSlideId}
                setMenuState={setMenuState}
                selectedSlideIds={selectedSlideIds}
                setSelectedSlideIds={setSelectedSlideIds}
                setSelectedObjectIds={setSelectedObjectIds}
                setSelectionTarget={setSelectionTarget}
            />
            <Workspace 
                previewSlide={previewSlide}
                setPreviewSlide={handleSlideChange}
                setMenuState={setMenuState}
                selectedObjectIds={selectedObjectIds}
                setSelectedSlideIds={setSelectedSlideIds}
                setSelectedObjectIds={setSelectedObjectIds}
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
