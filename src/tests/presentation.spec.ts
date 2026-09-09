import { describe, it, expect } from 'vitest';
import { createPresentation, updatePresentationName } from '../functions/presentation.js';

describe('createPresentation', () => {
    it('should create a presentation with default slide', () => {
        const presentation = createPresentation('My Presentation');
        expect(presentation.name).toBe('My Presentation');
        expect(presentation.slides.length).toBe(1);
    });

    it('should create a presentation with default name', () => {
        const presentation = createPresentation();
        expect(presentation.name).toBe('Новая Презентация');
        expect(presentation.slides.length).toBe(1);
    });
});

describe('updatePresentationName', () => {
    it('should create a presentation with new name', () => {
        const presentation = updatePresentationName(createPresentation(), "Новая Презентация1");
        expect(presentation.name).toBe('Новая Презентация1');
    });

    it('should create a presentation with new name', () => {
        const presentation = updatePresentationName(createPresentation(), "");
        expect(presentation.name).toBe('Новая Презентация');
    });
});