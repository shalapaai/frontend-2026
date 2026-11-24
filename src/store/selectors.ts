import type { RootState } from "./index";
import type { Slide } from "../types/slide";
import type { SlideObject } from "../types/objects";

function selectActiveSlide(state: RootState): Slide | undefined {
    const { activeSlideId } = state.viewModel;
    return state.presentation?.slides.find(slide => slide.id === activeSlideId);
}

function selectSelectedObject(state: RootState): SlideObject | undefined {
    const { selectedObjectIds } = state.viewModel;
    if (selectedObjectIds.length !== 1) return undefined;
    return selectActiveSlide(state)?.objects.find(object => object.id === selectedObjectIds[0]);
}

export { selectActiveSlide, selectSelectedObject };
