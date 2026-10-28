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

        expect(newSlide.background.type).toBe('color');

        if (slide.background.type === 'color' && newSlide.background.type === 'color') {
            expect(slide.background.color).not.toBe(newSlide.background.color);
            expect(newSlide.background.color).toBe('#000000');
        }
    });

    it('should not switch a background color with unvalid color', () => {
        const slide = createDefaultSlide();
        const newSlide = setSlideBackgroundColor(slide, '#00000');

        if (slide.background.type === 'color' && newSlide.background.type === 'color') {
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

        if (slide.background.type === 'color' && newSlide.background.type === 'image') {
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

        if (slide.background.type === 'color' && newSlide.background.type === 'gradient') {
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

        expect(newSlide.background.type).toBe('color');

        if (slide.background.type === 'color' && newSlide.background.type === 'color') {
            expect(newSlide.background.color).not.toBe(slide.background.color);
            expect(newSlide.background.color).toBe('#FFFFFF');
        }
    });
});

describe('gradient settings', () => {
    it('stores radial gradients without mutating the original slide', () => {
        const slide = createDefaultSlide();
        const original = structuredClone(slide);
        const result = setSlideBackgroundGradient(slide, ['#ffffff', '#000000'], 180, 'radial');
        expect(result.background).toEqual({
            type: 'gradient', colors: ['#ffffff', '#000000'], angle: 180, gradientType: 'radial',
        });
        expect(slide).toEqual(original);
    });

    it('rejects invalid angles and gradients with fewer than two colors', () => {
        const slide = createDefaultSlide();
        for (const angle of [-1, 361, NaN, Infinity]) {
            expect(setSlideBackgroundGradient(slide, ['#ffffff', '#000000'], angle)).toBe(slide);
        }
        expect(setSlideBackgroundGradient(slide, ['#ffffff'], 90)).toBe(slide);
        expect(setSlideBackgroundGradient(slide, [], 90)).toBe(slide);
    });
});
