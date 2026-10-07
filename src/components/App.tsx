import { PreviewOverlay } from "./layout/PreviewOverlay/PreviewOverlay";
import { Toolbar } from "./ToolBar/Toolbar";
import { EditorContainer } from "./layout/EditorContainer/EditorContainer";
import { useState } from "react";
import { createTestPresentation } from "../data";



export function App() {
    const [presentation, setPresentation] = useState(createTestPresentation());
    if (!presentation) {
        return (
            <>
                Presentation = null
            </>
        )
    }
    const [previewMode, setPreviewMode] = useState(false);
    const [activeSlideId, setActiveSlideId] = useState(presentation?.slides[0].id);
    
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
