import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Presentation } from '../../types/presentation';

import {
    createPresentation as createPresentationFn,
    savePresentation as savePresentationFn,
    loadPresentation as loadPresentationFn,
    updatePresentationName as updatePresentationNameFn,
} from '../../functions/presentation.js';

import {
    createDefaultSlide as createDefaultSlideFn,
    addSlide as addSlideFn,
    removeSlides as removeSlidesFn,
    moveSlide as moveSlideFn,
    duplicateSlide as duplicateSlideFn,
    updateSlide as updateSlideFn,
} from '../../functions/slide.js';

import {
    addObject as addObjectFn,
    removeObject as removeObjectFn,
    removeObjects as removeObjectsFn,
    updateObject as updateObjectFn,
} from '../../functions/objects.js';

import {
    setSlideBackgroundColor as setSlideBackgroundColorFn,
    setSlideBackgroundImage as setSlideBackgroundImageFn,
    setSlideBackgroundGradient as setSlideBackgroundGradientFn,
    clearSlideBackground as clearSlideBackgroundFn,
} from '../../functions/background.js';

type UpdateObjectPayload = {
    slideId: string;
    objectId: string;
    changes: Parameters<typeof updateObjectFn>[2];
};

type AddObjectPayload = {
    slideId: string,
    object: Parameters<typeof addObjectFn>[1]
}

export type PresentationState = Presentation | null;

const initialState = null as PresentationState;

const presentationSlice = createSlice({
    name: 'presentation',
    initialState,
    reducers: {
        openPresentation: (state, action: PayloadAction<Presentation>) => action.payload,
        setPresentation: (state, action: PayloadAction<Presentation>) => action.payload,

        updatePresentationName: (state, action: PayloadAction<string>) => {
            if (!state) return;

            return updatePresentationNameFn(
                state,
                action.payload,
            );
        },

        addSlide: state => {
            if (!state) return;
            return addSlideFn(state);
        },

        removeSlides: (state, action: PayloadAction<{ slideIds: string[] }>) => {
            if (!state) return;
            return removeSlidesFn(state, action.payload.slideIds);
        },

        moveSlide: (state, action: PayloadAction<{ slideId: string, newIndex: number }>) => {
            if (!state) return;
            return moveSlideFn(
                state,
                action.payload.slideId,
                action.payload.newIndex,
            );
        },

        duplicateSlide: (state, action: PayloadAction<{ slideId: string, index: number }>) => {
            if (!state) return;
            return duplicateSlideFn(
                state,
                action.payload.slideId,
                action.payload.index,
            );
        },

        addObject: (state,  action: PayloadAction<AddObjectPayload>) => {
            if (!state) return;
            return updateSlideFn(
                state,
                action.payload.slideId,
                slide => addObjectFn(slide, action.payload.object),
            );
        },

        removeObject: (
            state,
            action: PayloadAction<{ slideId: string; objectId: string }>,
        ) => {
            if (!state) return;
            const { slideId, objectId } = action.payload;
            return updateSlideFn(
                state,
                slideId,
                slide => removeObjectFn(slide, objectId),
            );
        },

        removeObjects: (
            state,
            action: PayloadAction<{ slideId: string; objectIds: string[] }>,
        ) => {
            if (!state) return;
            const { slideId, objectIds } = action.payload;
            return updateSlideFn(
                state,
                slideId,
                slide => removeObjectsFn(slide, objectIds),
            );
        },

        updateObject: (state, action: PayloadAction<UpdateObjectPayload>) => {
            if (!state) return;

            const { slideId, objectId, changes } = action.payload;

            return updateSlideFn(
                state,
                slideId,
                slide => updateObjectFn(slide, objectId, changes),
            );
        },

        setSlideBackgroundColor: (
            state,
            action: PayloadAction<{ slideId: string; color: string }>,
        ) => {
            if (!state) return;
            return updateSlideFn(
                state,
                action.payload.slideId,
                slide => setSlideBackgroundColorFn(slide, action.payload.color),
            );
        },

        setSlideBackgroundGradient: (
            state,
            action: PayloadAction<{
                slideId: string;
                colors: string[];
                angle: number;
                gradientType: "linear" | "radial";
            }>
        ) => {
            if (!state) return;
            return updateSlideFn(
                state,
                action.payload.slideId,
                slide => setSlideBackgroundGradientFn(
                    slide, 
                    action.payload.colors, 
                    action.payload.angle,
                    action.payload.gradientType,
                ),
            );
        },

        setSlideBackgroundImage: (
            state,
            action: PayloadAction<{ slideId: string; imageUrl: string }>,
        ) => {
            if (!state) return;
            return updateSlideFn(
                state,
                action.payload.slideId,
                slide => setSlideBackgroundImageFn(slide, action.payload.imageUrl),
            );
        },

        clearSlideBackground: (
            state,
            action: PayloadAction<{ slideId: string }>,
        ) => {
            if (!state) return;
            return updateSlideFn(
                state,
                action.payload.slideId,
                slide => clearSlideBackgroundFn(slide),
            );
        },
    },
});

export const {
    openPresentation,
    setPresentation,
    updatePresentationName,
    addSlide,
    removeSlides,
    moveSlide,
    duplicateSlide,
    addObject,
    removeObject,
    removeObjects,
    updateObject,
    setSlideBackgroundColor,
    setSlideBackgroundGradient,
    setSlideBackgroundImage,
    clearSlideBackground,
} = presentationSlice.actions;

export default presentationSlice.reducer;
