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

export interface PresentationState {
    presentation: Presentation | null;
    activeSlideId: string | null;
    selectedObjectIds: string[];
    isPreviewMode: boolean;
}

const initialState: PresentationState = {
    presentation: null,
    activeSlideId: null,
    selectedObjectIds: [],
    isPreviewMode: false,
};

const presentationSlice = createSlice({
    name: 'presentation',
    initialState,
    reducers: {
        openPresentation: (state, action: PayloadAction<Presentation>) => {
            state.presentation = action.payload;
            state.activeSlideId = action.payload.slides[0]?.id || null;
            state.selectedObjectIds = [];
        },
        setPresentation: (state, action: PayloadAction<Presentation>) => {
            state.presentation = action.payload;
            const activeSlide = action.payload.slides.find(slide => slide.id === state.activeSlideId);
            if (!activeSlide) {
                state.activeSlideId = action.payload.slides[0]?.id ?? null;
                state.selectedObjectIds = [];
            } else {
                state.selectedObjectIds = state.selectedObjectIds.filter(id =>
                    activeSlide.objects.some(object => object.id === id)
                );
            }
        },
        setSelectedObjects: (state, action: PayloadAction<string[]>) => {
            state.selectedObjectIds = action.payload;
        },
        setActiveSlide: (state, action: PayloadAction<string | null>) => {
            state.activeSlideId = action.payload;
            state.selectedObjectIds = [];
        },
        toggleSelectObject: (state, action: PayloadAction<string>) => {
            const index = state.selectedObjectIds.indexOf(action.payload);
            if (index === -1) {
                state.selectedObjectIds.push(action.payload);
            } else {
                state.selectedObjectIds.splice(index, 1);
            }
        },
        clearSelection: (state) => {
            state.selectedObjectIds = [];
        },
        setPreviewMode: (state, action: PayloadAction<boolean>) => {
            state.isPreviewMode = action.payload;
        },

        updatePresentationName: (state, action: PayloadAction<string>) => {
            if (!state.presentation) return;

            state.presentation = updatePresentationNameFn(
                state.presentation,
                action.payload,
            );
        },

        addSlide: state => {
            if (!state.presentation) return;
            state.presentation = addSlideFn(state.presentation);
        },

        removeSlides: (state, action: PayloadAction<{ slideIds: string[] }>) => {
            if (!state.presentation) return;
            state.presentation = removeSlidesFn(state.presentation, action.payload.slideIds);
            const activeSlideExists = state.presentation.slides.some(
                slide => slide.id === state.activeSlideId,
            );
            if (!activeSlideExists) {
                state.activeSlideId = state.presentation.slides[0]?.id ?? null;
                state.selectedObjectIds = [];
            }
        },

        moveSlide: (state, action: PayloadAction<{ slideId: string, newIndex: number }>) => {
            if (!state.presentation) return;
            state.presentation = moveSlideFn(
                state.presentation,
                action.payload.slideId,
                action.payload.newIndex,
            );
        },

        duplicateSlide: (state, action: PayloadAction<{ slideId: string, index: number }>) => {
            if (!state.presentation) return;
            state.presentation = duplicateSlideFn(
                state.presentation,
                action.payload.slideId,
                action.payload.index,
            );
        },

        addObject: (state,  action: PayloadAction<AddObjectPayload>) => {
            if (!state.presentation) return;
            state.presentation = updateSlideFn(
                state.presentation,
                action.payload.slideId,
                slide => addObjectFn(slide, action.payload.object),
            );
        },

        removeObject: (
            state,
            action: PayloadAction<{ slideId: string; objectId: string }>,
        ) => {
            if (!state.presentation) return;
            const { slideId, objectId } = action.payload;
            state.presentation = updateSlideFn(
                state.presentation,
                slideId,
                slide => removeObjectFn(slide, objectId),
            );
            if (state.activeSlideId === slideId) {
                state.selectedObjectIds = state.selectedObjectIds.filter(
                    id => id !== objectId,
                );
            }
        },

        updateObject: (state, action: PayloadAction<UpdateObjectPayload>) => {
            if (!state.presentation) return;

            const { slideId, objectId, changes } = action.payload;

            state.presentation = updateSlideFn(
                state.presentation,
                slideId,
                slide => updateObjectFn(slide, objectId, changes),
            );
        },

        setSlideBackgroundColor: (
            state,
            action: PayloadAction<{ slideId: string; color: string }>,
        ) => {
            if (!state.presentation) return;
            state.presentation = updateSlideFn(
                state.presentation,
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
            if (!state.presentation) return;
            state.presentation = updateSlideFn(
                state.presentation,
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
            if (!state.presentation) return;
            state.presentation = updateSlideFn(
                state.presentation,
                action.payload.slideId,
                slide => setSlideBackgroundImageFn(slide, action.payload.imageUrl),
            );
        },

        clearSlideBackground: (
            state,
            action: PayloadAction<{ slideId: string }>,
        ) => {
            if (!state.presentation) return;
            state.presentation = updateSlideFn(
                state.presentation,
                action.payload.slideId,
                slide => clearSlideBackgroundFn(slide),
            );
        },
    },
});

export const {
    openPresentation,
    setPresentation,
    setSelectedObjects,
    setActiveSlide,
    toggleSelectObject,
    clearSelection,
    setPreviewMode,
    updatePresentationName,
    addSlide,
    removeSlides,
    moveSlide,
    duplicateSlide,
    addObject,
    removeObject,
    updateObject,
    setSlideBackgroundColor,
    setSlideBackgroundGradient,
    setSlideBackgroundImage,
    clearSlideBackground,
} = presentationSlice.actions;

export default presentationSlice.reducer;
