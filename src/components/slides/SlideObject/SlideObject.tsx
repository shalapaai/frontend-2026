import { SlideObject } from "../../../types/objects";
import styles from "./SlideObject.module.css";
import { TextInput } from "../../ui/TextInput/TextInput";
import { updateObject } from "../../../functions/objects";
import { Slide } from "../../../types/slide";
import { deepClone } from "../../../functions/utils";

type SlideObjectProps = {
    object: SlideObject,
    key: string,
    slide: Slide,
    preview?: boolean;
    setPreviewSlide?: (s: Slide) => void,
}

function SlideObject(props: SlideObjectProps) {
    if (props.object.type === "text") {
        return (
            <TextInput 
                className={props.preview === true ? styles.slideObjectPreview : styles.slideObject}
                textProperties={props.object}
                value={props.object.text}
                style={{
                    position: "absolute",

                    left: props.object.x,
                    top: props.object.y,

                    width: props.object.width,
                    height: props.object.height,

                    fontFamily: props.object.fontFamily,
                    fontSize: props.object.fontSize,
                    color: props.object.fontColor,
                }}
                onSubmit={(value) => {
                    if (!props.setPreviewSlide) {
                        return;
                    }
                    const updatedSlide = updateObject(props.slide, props.object.id, { text: value });
                    props.setPreviewSlide(updatedSlide);
                    console.log(value);
                }}
            />
        )
    } else if (props.object.type === "image") {
        return (
            <></>
        )
    }
}

export {
    SlideObject
}
