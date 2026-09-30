import styles from "./TwoPanelsLayout.module.css"
import { Presentation } from "../../../types/presentation";
import { SlideList } from "../../slides/SlideList/SlideList";
import { Workspace } from "../Workspace/Workspace";

type TwoPanelsLayoutProps = {
    presentation: Presentation,
}

function TwoPanelsLayout(props: TwoPanelsLayoutProps) {
    return (
        <div className={styles.twoPanelsLayout}>
            <SlideList presentation={props.presentation} />
            <Workspace slide={props.presentation.slides[0]} />
        </div>
    )
}

export {
    TwoPanelsLayout
}
