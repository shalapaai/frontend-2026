import { deepClone } from "../../../functions/utils";
import { Slide } from "../../../types/slide";
import { SlideObjectThumbnail } from "../SlideObjectThumbnail/SlideObjectThumbnail";
import styles from "./SlideThumbnail.module.css";

type SlideThumbnailProps = {
    slide: Slide,
    key: string
}

function SlideThumbnail(props: SlideThumbnailProps) {
    return (
        <div 
            className={styles.slideThumbnail}
            style={{
            background:
                props.slide.background.type === "solid"
                ? props.slide.background.color
                : "#fff",
            }}
        >
            {props.slide.objects.map((object) => {
            let objectCopy = deepClone(object);
            objectCopy.x = object.x / (1280 / 150);
            objectCopy.y = object.y / (1280 / 150);
            objectCopy.width = object.width / (1280 / 150);
            objectCopy.height = object.height / (1280 / 150);
            if (objectCopy.type === "text" && object.type === "text") {
                objectCopy.fontSize = object.fontSize / (1280 / 150)
            }
            return (
                <SlideObjectThumbnail key={objectCopy.id} object={objectCopy}/>
            )
            })}
        </div>
    )
}

export {
    SlideThumbnail
}
