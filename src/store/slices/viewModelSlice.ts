import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Presentation } from '../../types/presentation';

export type SelectionTarget = "slides" | "objects";

export interface ViewModelState {
    activeSlideId: string | null;
    selectedSlideIds: string[];
    selectedObjectIds: string[];
    selectionTarget: SelectionTarget;
    isPreviewMode: boolean;
}

const initialState: ViewModelState = {
    activeSlideId: null,
    selectedSlideIds: [],
    selectedObjectIds: [],
    selectionTarget: "slides",
    isPreviewMode: false,
};

const viewModelSlice = createSlice({
    name: 'viewModel',
    initialState,
    reducers: {
        setSelectedObjects: (state, action: PayloadAction<string[]>) => {
            state.selectedObjectIds = action.payload;
        },
        setActiveSlide: (state, action: PayloadAction<string | null>) => {
            state.activeSlideId = action.payload;
            state.selectedSlideIds = action.payload ? [action.payload] : [];
            state.selectedObjectIds = [];
        },
        selectSlide: (state, action: PayloadAction<{ slideId: string; additive: boolean }>) => {
            const { slideId, additive } = action.payload;
            const selectedIds = state.selectedSlideIds;
            state.selectionTarget = "slides";
            state.selectedObjectIds = [];

            let nextIds: string[];
            if (!additive) {
                nextIds = [slideId];
            } else if (selectedIds.includes(slideId)) {
                if (selectedIds.length === 1) return;
                nextIds = selectedIds.filter(id => id !== slideId);
            } else {
                nextIds = [...selectedIds, slideId];
            }

            if (!additive || !selectedIds.includes(slideId)) {
                state.activeSlideId = slideId;
            } else if (state.activeSlideId === slideId) {
                state.activeSlideId = nextIds[0];
            }
            state.selectedSlideIds = nextIds;
        },
        setSelectionTarget: (state, action: PayloadAction<SelectionTarget>) => {
            state.selectionTarget = action.payload;
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
            state.selectedSlideIds = state.activeSlideId ? [state.activeSlideId] : [];
        },
        setPreviewMode: (state, action: PayloadAction<boolean>) => {
            state.isPreviewMode = action.payload;
        },
        syncWithPresentation: (state, action: PayloadAction<Presentation | null>) => {
            const slides = action.payload?.slides ?? [];
            const activeSlide = slides.find(slide => slide.id === state.activeSlideId);
            if (!activeSlide) {
                state.activeSlideId = slides[0]?.id ?? null;
                state.selectedSlideIds = state.activeSlideId ? [state.activeSlideId] : [];
                state.selectedObjectIds = [];
            } else {
                state.selectedSlideIds = state.selectedSlideIds.filter(id =>
                    slides.some(slide => slide.id === id)
                );
                if (state.selectedSlideIds.length === 0) {
                    state.selectedSlideIds = [activeSlide.id];
                }
                state.selectedObjectIds = state.selectedObjectIds.filter(id =>
                    activeSlide.objects.some(object => object.id === id)
                );
            }
        },
    },
});

export const {
    setSelectedObjects,
    setActiveSlide,
    selectSlide,
    setSelectionTarget,
    toggleSelectObject,
    clearSelection,
    setPreviewMode,
    syncWithPresentation,
} = viewModelSlice.actions;

export default viewModelSlice.reducer;
