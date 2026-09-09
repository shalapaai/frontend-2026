import { describe, it, expect } from 'vitest';

import { 
    addObject,
    removeObject,
    updateObject
} from '../functions/objects.js';
import { createDefaultSlide } from '../functions/slide.js';

describe('addObject', () => {
    it('should add a new text object', () => {
        const slide = createDefaultSlide();
        const newSlide = addObject(
            slide, 
            {
                type: 'text',
                x: 0,
                y: 0,
                width: 100,
                height: 100,
                text: 'Привет',
                fontFamily: 'Arial',
                fontSize: 16,
                fontColor: '#000000'
            }
        );

        expect(newSlide.objects.length).toBeGreaterThan(0);
        expect(newSlide.objects[0]).toEqual(
            expect.objectContaining({
                type: 'text',
                x: 0,
                y: 0,
                width: 100,
                height: 100,
                text: 'Привет',
                fontFamily: 'Arial',
                fontSize: 16,
                fontColor: '#000000'
            })
        );
    });

    it('should not add a new text object with unvalid font family', () => {
        const slide = createDefaultSlide();
        const newSlide = addObject(
            slide, 
            {
                type: 'text',
                x: 0,
                y: 0,
                width: 100,
                height: 100,
                text: 'Привет',
                fontFamily: '',
                fontSize: 1,
                fontColor: '#000000'
            }
        );

        expect(newSlide.objects.length).toBe(0);
    });

    it('should not add a new text object with unvalid font size', () => {
        const slide = createDefaultSlide();
        const newSlide = addObject(
            slide, 
            {
                type: 'text',
                x: 0,
                y: 0,
                width: 100,
                height: 100,
                text: 'Привет',
                fontFamily: 'Arial',
                fontSize: 0,
                fontColor: '#000000'
            }
        );

        expect(newSlide.objects.length).toBe(0);
    });

    it('should not add a new text object with unvalid font color', () => {
        const slide = createDefaultSlide();
        const newSlide = addObject(
            slide, 
            {
                type: 'text',
                x: 0,
                y: 0,
                width: 100,
                height: 100,
                text: 'Привет',
                fontFamily: 'Arial',
                fontSize: 10,
                fontColor: '#00000'
            }
        );

        expect(newSlide.objects.length).toBe(0);
    });

    it('should add a new image object', () => {
        const slide = createDefaultSlide();
        const newSlide = addObject(
            slide, 
            {
                type: 'image',
                x: 0,
                y: 0,
                width: 100,
                height: 100,
                src: 'images/image.jpg'
            }
        );

        expect(newSlide.objects.length).toBeGreaterThan(0);
        expect(newSlide.objects[0]).toEqual(
            expect.objectContaining({
                type: 'image',
                x: 0,
                y: 0,
                width: 100,
                height: 100,
                src: 'images/image.jpg'
            })
        );
    });
});

describe('removeObject', () => {
    it('should remove an object', () => {
        const slide = addObject(
            createDefaultSlide(), 
            {
                type: 'text',
                x: 0,
                y: 0,
                width: 100,
                height: 100,
                text: 'Привет',
                fontFamily: 'Arial',
                fontSize: 16,
                fontColor: '#000000'
            }
        );
        const newSlide = removeObject(slide, slide.objects[0].id);
        expect(newSlide.objects.length).toBe(0);
    });
});

describe('updateObject', () => {
    it('should update an object cords', () => {
        const slide = addObject(
            createDefaultSlide(), 
            {
                type: 'text',
                x: 0,
                y: 0,
                width: 100,
                height: 100,
                text: 'Привет',
                fontFamily: 'Arial',
                fontSize: 16,
                fontColor: '#000000'
            }
        );
        const newSlide = updateObject(slide, slide.objects[0].id, {
            x: 100,
            y: 100
        });
        expect(newSlide.objects.length).toBe(1);
        expect(newSlide.objects[0].x).toBe(100);
        expect(newSlide.objects[0].y).toBe(100);
    });

    it('should update an object size', () => {
        const slide = addObject(
            createDefaultSlide(), 
            {
                type: 'text',
                x: 0,
                y: 0,
                width: 100,
                height: 100,
                text: 'Привет',
                fontFamily: 'Arial',
                fontSize: 16,
                fontColor: '#000000'
            }
        );
        const newSlide = updateObject(slide, slide.objects[0].id, {
            width: 200,
            height: 200
        });
        expect(newSlide.objects.length).toBe(1);
        expect(newSlide.objects[0].width).toBe(200);
        expect(newSlide.objects[0].height).toBe(200);
    });

    it('should update an object text style', () => {
        const slide = addObject(
            createDefaultSlide(), 
            {
                type: 'text',
                x: 0,
                y: 0,
                width: 100,
                height: 100,
                text: 'Привет',
                fontFamily: 'Arial',
                fontSize: 16,
                fontColor: '#000000'
            }
        );

        expect(slide.objects[0].type).toBe('text');
        if (slide.objects[0].type === 'text') {
            const newSlide = updateObject(slide, slide.objects[0].id, {
                fontFamily: 'Roboto',
                fontSize: 40,
                fontColor: "#FFFFFF"
            });
            if (newSlide.objects[0].type === 'text') {
                expect(newSlide.objects.length).toBe(1);
                expect(newSlide.objects[0].fontFamily).toBe('Roboto');
                expect(newSlide.objects[0].fontSize).toBe(40);
                expect(newSlide.objects[0].fontColor).toBe('#FFFFFF');
            }
        }
    });

    it('should not update an object text style with unvalid font family', () => {
        const slide = addObject(
            createDefaultSlide(), 
            {
                type: 'text',
                x: 0,
                y: 0,
                width: 100,
                height: 100,
                text: 'Привет',
                fontFamily: 'Arial',
                fontSize: 16,
                fontColor: '#000000'
            }
        );

        expect(slide.objects[0].type).toBe('text');
        if (slide.objects[0].type === 'text') {
            const newSlide = updateObject(slide, slide.objects[0].id, {
                fontFamily: '',
                fontSize: 1,
                fontColor: "#FFFFFF"
            });
            if (newSlide.objects[0].type === 'text') {
                expect(newSlide.objects.length).toBe(1);
                expect(newSlide.objects[0].fontFamily).not.toBe('');
                expect(newSlide.objects[0].fontSize).not.toBe(-1);
                expect(newSlide.objects[0].fontColor).not.toBe('#FFFFF');
            }
        }
    });

    it('should not update an object text style with unvalid font size', () => {
        const slide = addObject(
            createDefaultSlide(), 
            {
                type: 'text',
                x: 0,
                y: 0,
                width: 100,
                height: 100,
                text: 'Привет',
                fontFamily: 'Arial',
                fontSize: 16,
                fontColor: '#000000'
            }
        );

        expect(slide.objects[0].type).toBe('text');
        if (slide.objects[0].type === 'text') {
            const newSlide = updateObject(slide, slide.objects[0].id, {
                fontFamily: 'Arial',
                fontSize: -1,
                fontColor: "#FFFFFF"
            });
            if (newSlide.objects[0].type === 'text') {
                expect(newSlide.objects.length).toBe(1);
                expect(newSlide.objects[0].fontFamily).not.toBe('');
                expect(newSlide.objects[0].fontSize).not.toBe(-1);
                expect(newSlide.objects[0].fontColor).not.toBe('#FFFFF');
            }
        }
    });

    it('should not update an object text style with unvalid font color', () => {
        const slide = addObject(
            createDefaultSlide(), 
            {
                type: 'text',
                x: 0,
                y: 0,
                width: 100,
                height: 100,
                text: 'Привет',
                fontFamily: 'Arial',
                fontSize: 16,
                fontColor: '#000000'
            }
        );

        expect(slide.objects[0].type).toBe('text');
        if (slide.objects[0].type === 'text') {
            const newSlide = updateObject(slide, slide.objects[0].id, {
                fontFamily: 'Arial',
                fontSize: 1,
                fontColor: "#FFFFF"
            });
            if (newSlide.objects[0].type === 'text') {
                expect(newSlide.objects.length).toBe(1);
                expect(newSlide.objects[0].fontFamily).not.toBe('');
                expect(newSlide.objects[0].fontSize).not.toBe(-1);
                expect(newSlide.objects[0].fontColor).not.toBe('#FFFFF');
            }
        }
    });

    it('should update an object text content', () => {
        const slide = addObject(
            createDefaultSlide(), 
            {
                type: 'text',
                x: 0,
                y: 0,
                width: 100,
                height: 100,
                text: 'Привет',
                fontFamily: 'Arial',
                fontSize: 16,
                fontColor: '#000000'
            }
        );

        expect(slide.objects[0].type).toBe('text');
        if (slide.objects[0].type === 'text') {
            const newSlide = updateObject(slide, slide.objects[0].id, {
                text: 'Пока'
            });
            if (newSlide.objects[0].type === 'text') {
                expect(newSlide.objects.length).toBe(1);
                expect(newSlide.objects[0].text).toBe('Пока');
            }
        }
    });
});