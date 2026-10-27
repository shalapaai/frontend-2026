import { Slide } from "../../../types/slide";
import { MenuState } from "../../layout/EditorContainer/EditorContainer";
import { SlideObject } from "../SlideObject/SlideObject";
import styles from "./SlideView.module.css";

type SlideViewProps = {
    slide: Slide,
    preview: boolean,
    setPreviewSlide?: (slide: Slide) => void,
    className: string,
    setMenuState?: (menu: MenuState) => void
}

function SlideView(props: SlideViewProps) {
    const handleContextMenu = (e: React.MouseEvent, objectId: string) => {
        if (!props.setMenuState) return;
        e.preventDefault(); 
        e.stopPropagation(); 

        props.setMenuState({
            type: "object",
            x: e.clientX, 
            y: e.clientY, 
            slideId: props.slide.id,
            objectId: objectId
        });
    };
    return (
        <div
            className={styles[props.className]}
            style={{
                background: props.slide.background.type === "solid" 
                    ? props.slide.background.color 
                    : "#fff",
            }}
        >
            {props.slide.objects.map((object) => (
                <div 
                    key={object.id}
                    onContextMenu={(e) => handleContextMenu(e, object.id)}
                >
                    <SlideObject
                        key={object.id}
                        slide={props.slide}
                        object={object}
                        preview={props.preview}
                        setPreviewSlide={props.setPreviewSlide}
                        
                    />
                </div>
            ))}
        </div>
    )
}

export {
    SlideView
}
