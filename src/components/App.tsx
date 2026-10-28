import { usePresentationHistory } from "./hooks/usePresentationHistory";
import { PreviewOverlay } from "./layout/PreviewOverlay/PreviewOverlay";
import { Toolbar } from "./ToolBar/Toolbar";
import { EditorContainer } from "./layout/EditorContainer/EditorContainer";
import { useEffect, useState } from "react";
import { createTestPresentation } from "../data";

export function App() {
    const {
        presentation, setPresentation, undo, redo, canUndo, canRedo, historyRevision,
    } = usePresentationHistory(createTestPresentation);
    const [selectedObjectIds, setSelectedObjectIds] = useState<string[]>([]);
    const [previewMode, setPreviewMode] = useState(false);
    const [requestedActiveSlideId, setActiveSlideId] = useState<string | null>(
        presentation.slides[0]?.id ?? null
    );
    
    const activeSlideId = presentation.slides.some(slide => slide.id === requestedActiveSlideId)
        ? requestedActiveSlideId : presentation.slides[0]?.id ?? null;

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
                setSelectedObjectIds([]);
                if (isUndo) undo();
                else redo();
            }
        };
        window.addEventListener("keydown", handleKeyDown, true);
        return () => window.removeEventListener("keydown", handleKeyDown, true);
    }, [previewMode, canUndo, canRedo, undo, redo]);

    if (!presentation) return;
    
    if (previewMode) {
        return <PreviewOverlay 
            presentation={presentation} 
            activeSlideId={activeSlideId}
            setActiveSlideId={setActiveSlideId}
            onClose={() => setPreviewMode(false)}
        />;
    }
    console.log(presentation);
    return (
        <>
            <Toolbar
                selectedObjectIds={selectedObjectIds}
                presentation={presentation} 
                setPresentation={setPresentation}
                setPreviewMode={setPreviewMode}
                setActiveSlideId={setActiveSlideId}
                activeSlideId={activeSlideId}
            />
            <EditorContainer
                key={historyRevision}
                selectedObjectIds={selectedObjectIds}
                setSelectedObjectIds={setSelectedObjectIds}
                presentation={presentation} 
                setPresentation={setPresentation}
                setActiveSlideId={setActiveSlideId}
                activeSlideId={activeSlideId}
            />
        </>
    );
}

export default App
