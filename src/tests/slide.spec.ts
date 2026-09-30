import { describe, it, expect } from 'vitest';
import { addSlide, createDefaultSlide, removeSlides, moveSlide, duplicateSlide } from '../functions/slide.js';
import { createPresentation } from '../functions/presentation.js';

describe('createDefaultSlide', () => {
    it('should create a slide with an id', () => {
        const slide = createDefaultSlide();

        expect(slide.id).toBeDefined();
        expect(typeof slide.id).toBe('string');
        expect(slide.id.length).toBeGreaterThan(0);
    });

    it('should create a white solid background', () => {
        const slide = createDefaultSlide();

        // в константу вынести
        expect(slide.background).toEqual({
            type: 'solid',
            color: '#FFFFFF'
        });
    });

    it('should create a slide with empty objects', () => {
        const slide = createDefaultSlide();
        expect(slide.objects).toEqual([]);
    });
});

describe('addSlide', () => {
    it('should add a slide', () => {
        const presentation = addSlide(createPresentation());

        expect(presentation.slides.length).toBe(2);
        expect(presentation.slides[1].id).toBeDefined();
    });
});

describe('removeSlides', () => {
    it('should remove a slide', () => {
        const presentation = addSlide(createPresentation());
        const slideIndex = presentation.slides[1].id;
        const updatedPresentation = removeSlides(presentation, [slideIndex]);
        expect(updatedPresentation.slides).toHaveLength(1);
    });

    it('should remove a couple of slides', () => {
        const presentation = addSlide(addSlide(createPresentation()));
        const firstSlideIndex = presentation.slides[0].id;
        const secondSlideIndex = presentation.slides[1].id;
        const thirdSlideIndex = presentation.slides[2].id;
        const updatedPresentation = removeSlides(presentation, [firstSlideIndex, secondSlideIndex, thirdSlideIndex]);
        expect(updatedPresentation.slides).toHaveLength(0);
    });
});

describe('moveSlide', () => {
    it('should move a slide', () => {
        const presentation = addSlide(addSlide(createPresentation()));
        const firstSlideIndex = presentation.slides[0].id;
        const secondSlideIndex = presentation.slides[1].id;
        const thirdSlideIndex = presentation.slides[2].id;
        const updatedPresentation = moveSlide(presentation, thirdSlideIndex, 0);
        expect(updatedPresentation.slides[0].id).toBe(thirdSlideIndex);
        expect(updatedPresentation.slides[1].id).toBe(firstSlideIndex);
        expect(updatedPresentation.slides[2].id).toBe(secondSlideIndex);
    });

    it('should not move a slide if newIndex less then 0', () => {
        const presentation = addSlide(addSlide(createPresentation()));
        const firstSlideIndex = presentation.slides[0].id;
        const secondSlideIndex = presentation.slides[1].id;
        const thirdSlideIndex = presentation.slides[2].id;
        const updatedPresentation = moveSlide(presentation, thirdSlideIndex, -2);
        expect(updatedPresentation.slides[0].id).toBe(firstSlideIndex);
        expect(updatedPresentation.slides[1].id).toBe(secondSlideIndex);
        expect(updatedPresentation.slides[2].id).toBe(thirdSlideIndex);
    });
});

describe('duplicateSlide', () => {
    it('should duplicate a slide', () => {
        const presentation = addSlide(addSlide(createPresentation()));
        const firstSlideId = presentation.slides[0].id;

        const updatedPresentation = duplicateSlide(presentation, firstSlideId, 3);
        expect(updatedPresentation.slides[3].id).not.toBe(firstSlideId);
        expect(updatedPresentation.slides[0].objects).toEqual(updatedPresentation.slides[3].objects);
    });

    it('should not duplicate a slide with unvalid index', () => {
        const presentation = addSlide(addSlide(createPresentation()));
        const firstSlideId = presentation.slides[0].id;

        const updatedPresentation = duplicateSlide(presentation, firstSlideId, -1);
        expect(updatedPresentation.slides[-1]).not.toBeDefined();
    });

    it('should not duplicate a slide with unvalid id', () => {
        const presentation = addSlide(addSlide(createPresentation()));

        const updatedPresentation = duplicateSlide(presentation, "123", 3);
        expect(updatedPresentation.slides[3]).not.toBeDefined();
    });
});