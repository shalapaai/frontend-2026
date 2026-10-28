import { useCallback, useState } from "react";
import type { SetStateAction } from "react";
import type { Presentation } from "../../types/presentation";
import { recordHistory, undoHistory, redoHistory } from "../../functions/history";
import type { History } from "../../functions/history";

function usePresentationHistory(createInitial: () => Presentation) {
    const [history, setHistory] = useState<History<Presentation>>(() => ({
        past: [], present: createInitial(), future: [], revision: 0,
    }));

    const setPresentation = useCallback((update: SetStateAction<Presentation>) => {
        setHistory(previous => {
            const next = typeof update === "function" ? update(previous.present) : update;
            if (JSON.stringify(next) === JSON.stringify(previous.present)) return previous;
            return recordHistory(previous, next);
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
        historyRevision: history.revision,
    };
}

export { usePresentationHistory };
