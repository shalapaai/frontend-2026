import { combineReducers } from '@reduxjs/toolkit';
import type { UnknownAction } from '@reduxjs/toolkit';
import { recordHistory, undoHistory, redoHistory } from '../functions/history';
import presentationReducer, { setPresentation, openPresentation } from './slices/presentationSlice';
import historyReducer, { clearHistory, undo, redo } from './slices/historySlice';

const combinedReducer = combineReducers({
    presentation: presentationReducer,
    history: historyReducer,
});

type State = ReturnType<typeof combinedReducer>;

export function rootReducer(state: State | undefined, action: UnknownAction): State {
    if (state && (undo.match(action) || redo.match(action))) {
        const present = state.presentation.presentation;
        const { past, future } = state.history;
        if (!present || (undo.match(action) ? !past.length : !future.length)) return state;

        const history = { past, present, future };
        const restored = undo.match(action) ? undoHistory(history) : redoHistory(history);
        const presentation = presentationReducer(state.presentation, setPresentation(restored.present));
        return {
            presentation: { ...presentation, selectedObjectIds: [] },
            history: { past: restored.past, future: restored.future },
        };
    }

    const next = combinedReducer(state, action);
    if (openPresentation.match(action)) {
        return { ...next, history: historyReducer(next.history, clearHistory()) };
    }

    const previousPresentation = state?.presentation.presentation;
    const nextPresentation = next.presentation.presentation;
    if (previousPresentation && nextPresentation && previousPresentation !== nextPresentation) {
        const history = recordHistory({ ...next.history, present: previousPresentation }, nextPresentation);
        return { ...next, history: { past: history.past, future: history.future } };
    }
    return next;
}
