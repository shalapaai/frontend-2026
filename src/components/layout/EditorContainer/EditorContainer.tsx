import styles from "./EditorContainer.module.css"
import { Presentation } from "../../../types/presentation";
import { SlideList } from "../../slides/SlideList/SlideList";
import { Workspace } from "../Workspace/Workspace";
import { useEffect, useState } from "react";
import { Slide } from "../../../types/slide";
import { ContextMenu } from "../../ContextMenu/ContextMenu";
import { removeSlides } from "../../../functions/slide";
import { removeObject } from "../../../functions/objects";
import { deepClone } from "../../../functions/utils";

type TwoPanelsLayoutProps = {
    presentation: Presentation,
    setPresentation: (p: Presentation) => void,
    setActiveSlideId: (s: string | null) => void,
    activeSlideId: string | null
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

function EditorContainer(props: TwoPanelsLayoutProps) {
    let activeSlide = props.presentation.slides.find(slide => slide.id === props.activeSlideId);
    const [previewSlide, setPreviewSlide] = useState<Slide | undefined>(activeSlide);
    if (previewSlide !== activeSlide) setPreviewSlide(activeSlide);

    const handleSlideChange = (updatedSlide: Slide) => {
        setPreviewSlide(updatedSlide);

        const newPresentation = deepClone(props.presentation);
        newPresentation.slides = newPresentation.slides.map(slide =>
            slide.id === updatedSlide.id ? updatedSlide : slide
        );
        props.setPresentation(newPresentation);
    };

    const [menuState, setMenuState] = useState<MenuState>(null);

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

    return (
        <div className={styles.twoPanelsLayout}>
            <SlideList 
                presentation={props.presentation} 
                setPresentation={props.setPresentation}
                setActiveSlideId={props.setActiveSlideId}
                activeSlideId={props.activeSlideId}
                setMenuState={setMenuState}
            />
            <Workspace 
                previewSlide={previewSlide}
                setPreviewSlide={handleSlideChange}
                setMenuState={setMenuState}
            />
            {menuState !== null && (
                <ContextMenu
                    x={menuState.x}
                    y={menuState.y}
                    onClose={() => setMenuState(null)}
                    onDelete={() => {
                        const menu = menuState;
                        if (!menu) return;
                        if (menu.type === "slide") {
                            props.setPresentation(removeSlides(props.presentation, [menu.slideId]));
                            if (props.activeSlideId === menu.slideId) {
                                const remainingSlides = props.presentation.slides.filter(
                                    s => s.id !== menu.slideId
                                );
                                props.setActiveSlideId(remainingSlides[0]?.id ?? null);
                            }
                        } else if (menu.type === "object") {
                            if (!previewSlide) return;
                            handleSlideChange(removeObject(previewSlide, menu.objectId));
                            console.log('delete object: ', menu.objectId);
                        }
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
