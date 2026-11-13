import { useCallback, useState } from "react";
import type { SetStateAction } from "react";
import type { Presentation } from "../../types/presentation";
import { recordHistory, undoHistory, redoHistory } from "../../functions/history";
import type { History } from "../../functions/history";

function usePresentationHistory(createInitial: () => Presentation) {
    const [history, setHistory] = useState<History<Presentation>>(() => ({
        past: [], present: createInitial(), future: [],
    }));

    const setPresentation = useCallback((update: SetStateAction<Presentation>) => {
        setHistory(v => {
            const next = typeof update === "function" ? update(v.present) : update;
            return recordHistory(v, next);
        });
    }, []);

    const undo = useCallback(() => setHistory(undoHistory), []);
    const redo = useCallback(() => setHistory(redoHistory), []);

    return {
        presentation: history.present,
        setPresentation,
        undo,
        redo,
        canUndo: history.past.length > 0,
        canRedo: history.future.length > 0,
    };
}

export { usePresentationHistory };
