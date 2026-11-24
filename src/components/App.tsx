import { PreviewOverlay } from "./layout/PreviewOverlay/PreviewOverlay";
import { Toolbar } from "./ToolBar/Toolbar";
import { EditorContainer } from "./layout/EditorContainer/EditorContainer";
import { useAppSelector } from "../store/hooks";
import { useUndoRedoHotkeys } from "./hooks/useUndoRedoHotkeys";

export function App() {
    const presentation = useAppSelector(
        state => state.presentation
    );
    const previewMode = useAppSelector(
        state => state.viewModel.isPreviewMode
    );

    useUndoRedoHotkeys(!previewMode);

    if (!presentation) return;
    
    if (previewMode) {
        return <PreviewOverlay />;
    }
    return (
        <>
            <Toolbar />
            <EditorContainer />
        </>
    );
}

export default App
