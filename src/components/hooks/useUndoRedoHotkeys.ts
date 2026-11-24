import { useEffect } from "react";
import { undo, redo } from "../../store/slices/historySlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { isEditableTarget } from "../utils/isEditableTarget";

function useUndoRedoHotkeys(enabled: boolean) {
    const dispatch = useAppDispatch();
    const canUndo = useAppSelector(state => state.history.past.length > 0);
    const canRedo = useAppSelector(state => state.history.future.length > 0);

    useEffect(() => {
        if (!enabled) return;
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.defaultPrevented || event.isComposing || event.altKey ||
                !(event.ctrlKey || event.metaKey)) return;
            if (isEditableTarget(event.target)) return;
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
    }, [enabled, canUndo, canRedo, dispatch]);
}

export { useUndoRedoHotkeys };
