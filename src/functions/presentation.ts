import type { Presentation } from '../types/presentation.js';
import { generateId, deepClone } from './utils.js';
import { createDefaultSlide } from './slide.js';

function createPresentation(name: string = "Новая Презентация"): Presentation {
    const defaultSlide = createDefaultSlide();
    return {
        id: generateId(),
        name,
        slides: [defaultSlide]
    };
}

function updatePresentationName(presentation: Presentation, name: string): Presentation {
    if (name === "") {
        return presentation;
    }
    const newPresentation = deepClone(presentation);
    newPresentation.name = name;
    return newPresentation;
}

function savePresentation(presentation: Presentation): string {
    return JSON.stringify(presentation, null, 2);
}

function loadPresentation(json: string): Presentation {
    return JSON.parse(json) as Presentation;
}

export {
    createPresentation,
    updatePresentationName,
    savePresentation,
    loadPresentation,
};