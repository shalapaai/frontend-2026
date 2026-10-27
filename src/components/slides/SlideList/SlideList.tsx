import { Presentation } from "../../../types/presentation";
import styles from "./SlideList.module.css";
import { SlideView } from "../SlideView/SlideView";
import { useEffect, useState } from "react";
import { ContextMenu } from "../../ContextMenu/ContextMenu";
import { removeSlides } from "../../../functions/slide";
import { MenuState } from "../../layout/EditorContainer/EditorContainer";

type SlideListProps = {
    presentation: Presentation,
    setActiveSlideId: (s: string | null) => void,
    activeSlideId: string | null,
    setPresentation: (p: Presentation) => void,
    setMenuState: (state: MenuState) => void,
}

function SlideList(props: SlideListProps) {
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
    return (
        <div className={styles.slideList}>
            {props.presentation.slides.map((slide) => {
                const isActive = slide.id === props.activeSlideId;
                return (
                    <div
                        key={slide.id}
                        className={isActive ? styles.thumbnailWrapperActive : styles.thumbnailWrapper}
                        onClick={() => props.setActiveSlideId(slide.id)}
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
