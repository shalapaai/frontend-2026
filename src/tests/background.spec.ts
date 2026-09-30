import { describe, it, expect } from 'vitest';

import { 
    setSlideBackgroundColor, 
    setSlideBackgroundImage, 
    setSlideBackgroundGradient, 
    clearSlideBackground 
} from '../functions/background.js';
import { createDefaultSlide } from '../functions/slide.js';

describe('setSlideBackgroundColor', () => {
    it('should switch a background color', () => {
        const slide = createDefaultSlide();
        const newSlide = setSlideBackgroundColor(slide, '#000000');

        expect(newSlide.background.type).toBe('solid');

        if (slide.background.type === 'solid' && newSlide.background.type === 'solid') {
            expect(slide.background.color).not.toBe(newSlide.background.color);
            expect(newSlide.background.color).toBe('#000000');
        }
    });

    it('should not switch a background color with unvalid color', () => {
        const slide = createDefaultSlide();
        const newSlide = setSlideBackgroundColor(slide, '#00000');

        if (slide.background.type === 'solid' && newSlide.background.type === 'solid') {
            expect(slide.background.color).toBe(newSlide.background.color);
            expect(newSlide.background.color).not.toBe('#00000');
        }
    });
});

describe('setSlideBackgroundImage', () => {
    it('should switch a background image', () => {
        const slide = createDefaultSlide();
        const newSlide = setSlideBackgroundImage(slide, 'images/image.jpg');

        expect(newSlide.background.type).toBe('image');

        if (slide.background.type === 'solid' && newSlide.background.type === 'image') {
            expect(slide.background.color).not.toBe(newSlide.background.src);
            expect(newSlide.background.src).toBe('images/image.jpg');
        }
    });
});

describe('setSlideBackgroundGradient', () => {
    it('should switch a background color to gradient', () => {
        const slide = createDefaultSlide();
        const newSlide = setSlideBackgroundGradient(slide, ['#000000', '#FFFFFF'], 90);

        expect(newSlide.background.type).toBe('gradient');

        if (slide.background.type === 'solid' && newSlide.background.type === 'gradient') {
            expect(newSlide.background.colors).toStrictEqual(['#000000', '#FFFFFF']);
        }
    });

    it('should not switch a background color to gradient with unvalid colors', () => {
        const slide = createDefaultSlide();
        const newSlide = setSlideBackgroundGradient(slide, ['#00000', '#FFFFFF'], 90);

        expect(newSlide.background.type).not.toBe('gradient');
    });
});

describe('clearSlideBackground', () => {
    it('should switch a background color to default', () => {
        const slide = setSlideBackgroundColor(createDefaultSlide(), '#000000');
        const newSlide = clearSlideBackground(slide);

        expect(newSlide.background.type).toBe('solid');

        if (slide.background.type === 'solid' && newSlide.background.type === 'solid') {
            expect(newSlide.background.color).not.toBe(slide.background.color);
            expect(newSlide.background.color).toBe('#FFFFFF');
        }
    });
});