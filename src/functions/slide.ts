import { Slide } from "../types/slide";
import { Presentation } from "../types/presentation";
import { generateId } from "./utils";

function createDefaultSlide(): Slide {
    return {
        id: generateId(),
        background: { 
            type: 'solid', 
            color: '#FFFFFF'
        },
        objects: [],
        width: 1020,
        height: 720
    };
}

function addSlide(presentation: Presentation): Presentation {
    const newSlide = createDefaultSlide();
    return {
        ...presentation,
        slides: [...presentation.slides, newSlide],
    };
}

function removeSlides(presentation: Presentation, slideIds: string[]): Presentation {
    return {
        ...presentation,
        slides: presentation.slides.filter(slide => !slideIds.includes(slide.id))
    }
}

function moveSlide(presentation: Presentation, slideId: string, newIndex: number): Presentation {
    if (newIndex < 0) {
        return {
            ...presentation
        }
    }

    const slideIndex = presentation.slides.findIndex(slide => slide.id === slideId);
    const slides = [...presentation.slides];
    const [slide] = slides.splice(slideIndex, 1);

    slides.splice(newIndex, 0, slide);
    return {
        ...presentation,
        slides
    }
}

function setActiveSlide(presentation: Presentation, slideId: string): Presentation {
    if (presentation.slides.filter(slide => slide.id === slideId).length === 0) {
        return {
            ...presentation
        }
    }
    return {
        ...presentation,
        activeSlideId: slideId
    }
}

function duplicateSlide(presentation: Presentation, slideId: string, index: number): Presentation {
    if (index <= 0) {
        return {
            ...presentation
        }
    }
    const slide = presentation.slides.find(slide => slide.id === slideId);
    if (!slide) {
        return {
            ...presentation
        }
    }
    const newSlide = {
        ...slide,
        id: generateId()
    };
    newSlide.id = generateId();
    const slides = [...presentation.slides];

    slides.splice(index, 0, newSlide);
    return {
        ...presentation,
        slides
    }
}

export {
    createDefaultSlide,
    addSlide,
    removeSlides,
    moveSlide,
    setActiveSlide,
    duplicateSlide
}