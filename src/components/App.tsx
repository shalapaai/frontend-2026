import { PreviewOverlay } from "./layout/PreviewOverlay/PreviewOverlay";
import { Toolbar } from "./ToolBar/Toolbar";
import { EditorContainer } from "./layout/EditorContainer/EditorContainer";
import { useState } from "react";
import { createTestPresentation } from "../data";

export function App() {
    const [presentation, setPresentation] = useState(createTestPresentation());
    const [previewMode, setPreviewMode] = useState(false);
    const [activeSlideId, setActiveSlideId] = useState<string | null>(
        presentation.slides[0]?.id ?? null
    );
    
    if (!presentation) {
        return (
            <>
                Presentation = null
            </>
        )
    }
    
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
                presentation={presentation} 
                setPresentation={setPresentation}
                setPreviewMode={setPreviewMode}
                setActiveSlideId={setActiveSlideId}
                activeSlideId={activeSlideId}
            />
            <EditorContainer 
                presentation={presentation} 
                setPresentation={setPresentation}
                setActiveSlideId={setActiveSlideId}
                activeSlideId={activeSlideId}
            />
        </>
    );
}

export default App
