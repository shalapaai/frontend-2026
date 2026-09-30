import { dispatch } from "../../../editor";
import { SlideObject } from "../../../types/objects";
import styles from "./SlideObject.module.css";
import { TextInput } from "../../ui/TextInput/TextInput";

type SlideObjectProps = {
    object: SlideObject,
    key: string,
}

function SlideObject(props: SlideObjectProps) {
    if (props.object.type === "text") {
        return (
            <TextInput
                className={styles.slideObject}
                textProperties={props.object}
                value={props.object.text}
            />
            // <TextInput 
            //     className={styles.slideObject}
            //     textProperties={props.object}
            //     value={props.object.text}
            //     onChange={(value) => {
            //         dispatch(updateObject, {props.slide, props.object.id, {text: value}});
            //         console.log(value);
            //     }}
            // />
        )
    } else {
        return (
            <>йоу</>
        )
    }
}

export {
    SlideObject
}
