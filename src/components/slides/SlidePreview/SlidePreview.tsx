import { dispatch } from "../../../editor";
import { Slide } from "../../../types/slide";
import { SlideObject } from "../SlideObject/SlideObject";
import styles from "./SlidePreview.module.css";

type SlidePreviewProps = {
    slide: Slide, 
}

function SlidePreview(props: SlidePreviewProps) {
    console.log(props.slide);
    return (
        <div 
            className={styles.slidePreview}
            style={{
                width: props.slide.width,
                height: props.slide.height,
                backgroundColor:
                props.slide.background.type === 'solid'
                    ? props.slide.background.color
                    : undefined,
            }}
        >
            {props.slide.objects.map((object) => (
            <SlideObject
                key={object.id}
                object={object}
            />
            ))}
        </div>
    )
}

export {
    SlidePreview
}
