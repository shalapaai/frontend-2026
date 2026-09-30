import { describe, it, expect } from 'vitest';

import { generateId, isColorHash, deepClone } from '../functions/utils.js';

describe('generateId', () => {
    it('should create an id', () => {
        const id = generateId();

        expect(id).toBeDefined();
        expect(typeof id).toBe('string');
    });
});

describe('isColorHash', () => {
    it('should be valid color', () => {
        expect(isColorHash('#FFFFFF')).toBe(true);
        expect(isColorHash('#ffffff')).toBe(true);
        expect(isColorHash('#000000')).toBe(true);
        expect(isColorHash('#0f0f0f')).toBe(true);
    });

    it('should be unvalid color', () => {
        expect(isColorHash('#FFFFF')).toBe(false);
        expect(isColorHash('#HHHHHH')).toBe(false);
        expect(isColorHash('#0000000')).toBe(false);
        expect(isColorHash('#FFF')).toBe(false);
    });
});

describe('deepClone', () => {
    it('should clone primitive values', () => {
        expect(deepClone(10)).toBe(10);
        expect(deepClone('hello')).toBe('hello');
        expect(deepClone(true)).toBe(true);
        expect(deepClone(null)).toBe(null);
        expect(deepClone(undefined)).toBe(undefined);
    });

    it('should clone an object', () => {
        const object = {
            name: 'Presentation',
            width: 1020,
            height: 720
        };

        const clone = deepClone(object);

        expect(clone).toStrictEqual(object);
        expect(clone).not.toBe(object);
    });

    it('should clone a nested object', () => {
        const object = {
            name: 'Presentation',
            background: {
                type: 'solid',
                color: '#FFFFFF'
            }
        };

        const clone = deepClone(object);

        expect(clone).toStrictEqual(object);
        expect(clone).not.toBe(object);
        expect(clone.background).not.toBe(object.background);
    });

    it('should clone an array', () => {
        const array = [1, 2, 3, 4];

        const clone = deepClone(array);

        expect(clone).toStrictEqual(array);
        expect(clone).not.toBe(array);
    });

    it('should clone an array with objects', () => {
        const array = [
            { id: '1', name: 'First' },
            { id: '2', name: 'Second' }
        ];

        const clone = deepClone(array);

        expect(clone).toStrictEqual(array);
        expect(clone).not.toBe(array);
        expect(clone[0]).not.toBe(array[0]);
        expect(clone[1]).not.toBe(array[1]);
    });

    it('should clone a Date', () => {
        const date = new Date('2026-01-01T00:00:00.000Z');

        const clone = deepClone(date);

        expect(clone).toEqual(date);
        expect(clone).not.toBe(date);
    });

    it('should not affect original object when clone is changed', () => {
        const object = {
            name: 'Presentation',
            settings: {
                width: 1020,
                height: 720
            }
        };

        const clone = deepClone(object);

        clone.name = 'New presentation';
        clone.settings.width = 1920;

        expect(object.name).toBe('Presentation');
        expect(object.settings.width).toBe(1020);

        expect(clone.name).toBe('New presentation');
        expect(clone.settings.width).toBe(1920);
    });

    it('should not affect original array when clone is changed', () => {
        const object = [
            {
                id: '1',
                text: 'Hello'
            }
        ];

        const clone = deepClone(object);

        clone[0].text = 'Changed';

        expect(object[0].text).toBe('Hello');
        expect(clone[0].text).toBe('Changed');
    });
});
