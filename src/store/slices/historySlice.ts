import { createAction, createSlice } from '@reduxjs/toolkit';
import type { Presentation } from '../../types/presentation';

export interface HistoryState {
    past: Presentation[];
    future: Presentation[];
}

const initialState: HistoryState = {
    past: [],
    future: [],
};

const historySlice = createSlice({
    name: 'history',
    initialState,
    reducers: {
        clearHistory: () => initialState,
    },
});

export const undo = createAction('history/undo');
export const redo = createAction('history/redo');
export const { clearHistory } = historySlice.actions;
export default historySlice.reducer;
