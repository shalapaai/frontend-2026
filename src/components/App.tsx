import { Presentation } from "../types/presentation";
import { Toolbar } from "./ToolBar/Toolbar";
import { TwoPanelsLayout } from "./layout/TwoPanelsLayout/TwoPanelsLayout";

type AppProps = {
    presentation: Presentation | null;
};

export function App(props: AppProps) {
    if (props.presentation === null) {
        return (
            <>
                Presentation = null
            </>
        )
    }
    return (
        <div>
            <Toolbar presentation={props.presentation} />
            <TwoPanelsLayout presentation={props.presentation} />
        </div>
    );
}

export default App
