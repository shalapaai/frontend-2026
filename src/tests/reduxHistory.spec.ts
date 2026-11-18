import { describe, expect, it } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from '../store/rootReducer';
import { undo, redo, clearHistory } from '../store/slices/historySlice';
import {
    openPresentation, setPresentation, updatePresentationName,
    setActiveSlide, setSelectedObjects, addObject, removeSlides, addSlide,
} from '../store/slices/presentationSlice';
import { createPresentation } from '../functions/presentation';

function setup() {
    const store = configureStore({ reducer: rootReducer });
    store.dispatch(openPresentation(createPresentation('Original')));
    return store;
}

describe('Redux history', () => {
    it('restores presentation and preserves redo until a new document edit', () => {
        const store = setup();
        store.dispatch(updatePresentationName('First'));
        store.dispatch(updatePresentationName('Second'));
        store.dispatch(undo());
        expect(store.getState().presentation.presentation?.name).toBe('First');
        store.dispatch(undo());
        expect(store.getState().presentation.presentation?.name).toBe('Original');
        store.dispatch(redo());
        expect(store.getState().presentation.presentation?.name).toBe('First');
        const id = store.getState().presentation.activeSlideId;
        store.dispatch(setActiveSlide(id));
        expect(store.getState().history.future).toHaveLength(1);
        store.dispatch(updatePresentationName('New branch'));
        expect(store.getState().history.future).toHaveLength(0);
        store.dispatch(redo());
        expect(store.getState().presentation.presentation?.name).toBe('New branch');
    });

    it('records legacy document replacements without resetting the active slide', () => {
        const store = setup();
        store.dispatch(addSlide());
        const document = store.getState().presentation.presentation!;
        const slideId = document.slides[1].id;
        store.dispatch(setActiveSlide(slideId));
        store.dispatch(setPresentation({ ...document, name: 'Legacy edit' }));
        expect(store.getState().presentation.activeSlideId).toBe(slideId);
        store.dispatch(undo());
        expect(store.getState().presentation.presentation?.name).toBe('Original');
        expect(store.getState().presentation.activeSlideId).toBe(slideId);
    });

    it('undoes object changes and clears selection, ignoring selection-only actions', () => {
        const store = setup();
        const slideId = store.getState().presentation.activeSlideId!;
        store.dispatch(addObject({ slideId, object: {
            type: 'image', src: 'photo.png', x: 0, y: 0, width: 100, height: 100,
        } }));
        const objectId = store.getState().presentation.presentation!.slides[0].objects[0].id;
        store.dispatch(setSelectedObjects([objectId]));
        expect(store.getState().history.past).toHaveLength(1);
        store.dispatch(undo());
        expect(store.getState().presentation.presentation!.slides[0].objects).toHaveLength(0);
        expect(store.getState().presentation.selectedObjectIds).toEqual([]);
        store.dispatch(redo());
        expect(store.getState().presentation.presentation!.slides[0].objects[0].id).toBe(objectId);
    });

    it('handles empty documents, history boundaries, and loading a different document', () => {
        const store = setup();
        store.dispatch(undo());
        store.dispatch(redo());
        const id = store.getState().presentation.activeSlideId!;
        store.dispatch(removeSlides({ slideIds: [id] }));
        expect(store.getState().presentation.activeSlideId).toBeNull();
        store.dispatch(undo());
        expect(store.getState().presentation.activeSlideId).toBe(id);
        store.dispatch(redo());
        expect(store.getState().presentation.presentation!.slides).toHaveLength(0);
        store.dispatch(openPresentation(createPresentation('Loaded')));
        expect(store.getState().history).toEqual({ past: [], future: [] });
        store.dispatch(updatePresentationName('Changed'));
        store.dispatch(clearHistory());
        expect(store.getState().history).toEqual({ past: [], future: [] });
        expect(store.getState().presentation.presentation?.name).toBe('Changed');
    });

    it('keeps the existing limit of 50 undo steps', () => {
        const store = setup();
        for (let i = 1; i <= 60; i++) store.dispatch(updatePresentationName(String(i)));
        expect(store.getState().history.past).toHaveLength(50);
        for (let i = 0; i < 60; i++) store.dispatch(undo());
        expect(store.getState().presentation.presentation?.name).toBe('10');
    });
});
