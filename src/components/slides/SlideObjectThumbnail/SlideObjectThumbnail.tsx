import { SlideObject } from "../../../types/objects";
import styles from "./SlideObjectThumbnail.module.css"

type SlideObjectProps = {
    object: SlideObject,
    key: string,
}

function SlideObjectThumbnail(props: SlideObjectProps) {
    if (props.object.type === "text"){
        return (
            <div 
                className={styles.slideObject}
                style={{
                    fontFamily: props.object.fontFamily,
                    fontSize: props.object.fontSize,
                    color: props.object.fontColor,
                    left: props.object.x,
                    top: props.object.y,
                    width: props.object.width,
                    height: props.object.height
                }}
            >
                {props.object.text}
            </div>
        )
    } else {
        return (
            <>йоу</>
        )
    }
}

export {
    SlideObjectThumbnail
}
