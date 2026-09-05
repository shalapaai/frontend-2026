import { Presentation, Slide, SlideObject, Background } from "./types";

type UpdatedPresentation = Partial<Presentation>;

type UpdatedSlide = Partial<Slide>;

type UpdatedSlideObject = Partial<SlideObject>;

type UpdatedBackground = Partial<Background>;

function updatePresentation(presentation: Presentation, update: UpdatedPresentation) {
    return {
        ...presentation, ...update
    }
}

function updateSlide(slide: Slide, update: UpdatedSlide) {
    return {
        ...slide, ...update
    }
}

function updateSlideObject(slideObject: SlideObject, update: UpdatedSlideObject) {
    return {
        ...slideObject, ...update
    }
}

function updateBackground(background: Background, update: UpdatedBackground) {
    return {
        ...background, ...update
    }
}

export {
    updatePresentation,
    updateSlide,
    updateSlideObject,
    updateBackground
}
