import { combineReducers } from '@reduxjs/toolkit';
import type { UnknownAction } from '@reduxjs/toolkit';
import { recordHistory, undoHistory, redoHistory } from '../functions/history';
import presentationReducer, { openPresentation } from './slices/presentationSlice';
import viewModelReducer, { syncWithPresentation, clearSelection } from './slices/viewModelSlice';
import historyReducer, { clearHistory, undo, redo } from './slices/historySlice';

const combinedReducer = combineReducers({
    presentation: presentationReducer,
    viewModel: viewModelReducer,
    history: historyReducer,
});

type State = ReturnType<typeof combinedReducer>;

export function rootReducer(state: State | undefined, action: UnknownAction): State {
    if (state && (undo.match(action) || redo.match(action))) {
        const present = state.presentation;
        const { past, future } = state.history;
        if (!present || (undo.match(action) ? !past.length : !future.length)) return state;

        const history = { past, present, future };
        const restored = undo.match(action) ? undoHistory(history) : redoHistory(history);
        const viewModel = viewModelReducer(
            viewModelReducer(state.viewModel, syncWithPresentation(restored.present)),
            clearSelection(),
        );
        return {
            presentation: restored.present,
            viewModel,
            history: { past: restored.past, future: restored.future },
        };
    }

    const next = combinedReducer(state, action);
    if (openPresentation.match(action)) {
        return {
            ...next,
            viewModel: viewModelReducer(undefined, syncWithPresentation(next.presentation)),
            history: historyReducer(next.history, clearHistory()),
        };
    }

    const previousPresentation = state?.presentation;
    const nextPresentation = next.presentation;
    if (previousPresentation && nextPresentation && previousPresentation !== nextPresentation) {
        const history = recordHistory({ ...next.history, present: previousPresentation }, nextPresentation);
        return {
            ...next,
            viewModel: viewModelReducer(next.viewModel, syncWithPresentation(nextPresentation)),
            history: { past: history.past, future: history.future },
        };
    }
    return next;
}
