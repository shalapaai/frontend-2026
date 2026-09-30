import { Slide } from "../types/slide";
import { Presentation } from "../types/presentation";
import { generateId, deepClone } from "./utils";

const SLIDE_WIDTH = 1280;
const SLIDE_HEIGHT = 720;

function createDefaultSlide(): Slide {
    return {
        id: generateId(),
        background: { 
            type: 'solid', 
            color: '#FFFFFF'
        },
        objects: [],
        width: SLIDE_WIDTH,
        height: SLIDE_HEIGHT
    };
}

function addSlide(presentation: Presentation): Presentation {
    const newPresentation = deepClone(presentation);
    newPresentation.slides.push(createDefaultSlide())
    return newPresentation;
}

function removeSlides(presentation: Presentation, slideIds: string[]): Presentation {
    const newPresentation = deepClone(presentation);
    const slides = newPresentation.slides.filter(slide => !slideIds.includes(slide.id));
    newPresentation.slides = slides;
    return newPresentation;
}

function moveSlide(presentation: Presentation, slideId: string, newIndex: number): Presentation {
    if (newIndex < 0) {
        return presentation;
    }
    const newPresentation = deepClone(presentation);

    const slideIndex = presentation.slides.findIndex(slide => slide.id === slideId);
    const slides = newPresentation.slides;
    const [slide] = slides.splice(slideIndex, 1);
    slides.splice(newIndex, 0, slide);

    newPresentation.slides = slides;
    return newPresentation;
}

function duplicateSlide(presentation: Presentation, slideId: string, index: number): Presentation {
    if (index < 0) {
        return presentation;
    }
    const slide = presentation.slides.find(slide => slide.id === slideId);
    if (!slide) {
        return presentation;
    }
    const newSlide = deepClone(slide);
    newSlide.id = generateId();
    
    const newPresentation = deepClone(presentation);
    const slides = newPresentation.slides;

    slides.splice(index, 0, newSlide);
    return newPresentation;
}

export {
    createDefaultSlide,
    addSlide,
    removeSlides,
    moveSlide,
    duplicateSlide
}