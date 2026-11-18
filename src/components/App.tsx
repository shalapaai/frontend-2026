import { setPreviewMode } from "../store/slices/presentationSlice";
import { undo, redo } from "../store/slices/historySlice";
import { PreviewOverlay } from "./layout/PreviewOverlay/PreviewOverlay";
import { Toolbar } from "./ToolBar/Toolbar";
import { EditorContainer } from "./layout/EditorContainer/EditorContainer";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";

export function App() {
    const dispatch = useAppDispatch();
    const presentation = useAppSelector(
        state => state.presentation.presentation
    );
    const activeSlideId = useAppSelector(
        state => state.presentation.activeSlideId
    );
    const selectedObjectIds = useAppSelector(
        state => state.presentation.selectedObjectIds
    );
    const previewMode = useAppSelector(
        state => state.presentation.isPreviewMode
    );

    const canUndo = useAppSelector(state => state.history.past.length > 0);
    const canRedo = useAppSelector(state => state.history.future.length > 0);

    useEffect(() => {
        if (previewMode) return;
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.defaultPrevented || event.isComposing || event.altKey ||
                !(event.ctrlKey || event.metaKey)) return;
            const target = event.target;
            if (target instanceof HTMLElement && (target.isContentEditable ||
                target.closest("input, textarea, select"))) return;
            const isUndo = event.code === "KeyZ" && !event.shiftKey;
            const isRedo = (event.code === "KeyZ" && event.shiftKey) ||
                (event.code === "KeyY" && !event.shiftKey);
            if (!isUndo && !isRedo) return;
            event.preventDefault();
            if ((isUndo && canUndo) || (isRedo && canRedo)) {
                if (isUndo) dispatch(undo());
                else dispatch(redo());
            }
        };
        window.addEventListener("keydown", handleKeyDown, true);
        return () => window.removeEventListener("keydown", handleKeyDown, true);
    }, [previewMode, canUndo, canRedo, dispatch]);

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
