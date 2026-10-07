import { Slide } from "../types/slide";
import { SlideObject, TextObject, ImageObject } from "../types/objects";
import { deepClone, generateId, isColorHash } from "./utils";

// разобраться
type NewObject = Omit<TextObject, 'id'> | Omit<ImageObject, 'id'>;
type UpdatedObject = Partial<Omit<TextObject, 'id' | 'type'>> | Partial<Omit<ImageObject, 'id' | 'type'>>;

type UpdateObjectParams = {
    objectId: string;
    updatedObject: UpdatedObject;
};

function addObject(slide: Slide, object: NewObject): Slide {
    if (object.type === 'text' && (!isColorHash(object.fontColor) || object.fontSize <= 0 || object.fontFamily === '')) 
        return slide;
    let newObject: SlideObject;

    if (object.type === 'text') {
        newObject = {
            id: generateId(),
            type: 'text',
            x: object.x,
            y: object.y,
            width: object.width,
            height: object.height,
            text: object.text,
            fontFamily: object.fontFamily,
            fontSize: object.fontSize,
            fontColor: object.fontColor
        };
    } else {
        newObject = {
            id: generateId(),
            type: 'image',
            x: object.x,
            y: object.y,
            width: object.width,
            height: object.height,
            src: object.src
        };
    }
    const newSlide = deepClone(slide);
    newSlide.objects.push(newObject);
    return newSlide;
}

function removeObject(slide: Slide, objectId: string): Slide {
    const newSlide = deepClone(slide);
    newSlide.objects = newSlide.objects.filter(object => object.id !== objectId);
    return newSlide;
}

function updateObject(slide: Slide, objectId: string, updatedObject: UpdatedObject): Slide {

    const isFontSizeNotValid = 
        'fontSize' in updatedObject && updatedObject.fontSize !== undefined && updatedObject.fontSize <= 0;
    const isFontFamilyNotValid = 
        'fontFamily' in updatedObject && updatedObject.fontFamily !== undefined && updatedObject.fontFamily === '';
    const isFontColorNotValid = 
        'fontColor' in updatedObject && updatedObject.fontColor !== undefined && !isColorHash(updatedObject.fontColor);

    if (isFontSizeNotValid || isFontFamilyNotValid || isFontColorNotValid) {
        return slide;
    }
    const object = slide.objects.find(object => object.id === objectId);
    if (!object) {
        return slide;
    }

    const newSlide = deepClone(slide);
    let newObject = newSlide.objects.find(object => object.id === objectId);
    if (!newObject) {
        return slide;
    }

    Object.assign(newObject, updatedObject);
    return newSlide;
}

export {
    addObject,
    removeObject,
    updateObject
}