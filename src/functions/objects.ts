import { Slide } from "../types/slide";
import { SlideObject, TextObject, ImageObject } from "../types/objects";
import { generateId } from "./utils";

type NewSlide = Omit<TextObject, 'id'> | Omit<ImageObject, 'id'>;

function addObject(slide: Slide, object: NewSlide): Slide {
    if (object.type === 'text' && (object.fontColor.length !== 7 
        || object.fontColor[0] !== '#' || object.fontSize <= 0 || object.fontFamily === '')
    ) {
        return {
            ...slide
        }
    }
    const newObject = {
        ...object,
        id: generateId()
    };
    return {
        ...slide,
        objects: [...slide.objects, newObject]
    };
}

function removeObject(slide: Slide, objectId: string): Slide {
    return {
        ...slide,
        objects: slide.objects.filter(object => object.id !== objectId)
    }
}

function updateObject(slide: Slide, objectId: string, updatedObject: Partial<Omit<TextObject, 'id' | 'type'>>
| Partial<Omit<ImageObject, 'id' | 'type'>>): Slide {
    if (('fontSize' in updatedObject && updatedObject.fontSize !== undefined && updatedObject.fontSize <= 0)
        || ('fontFamily' in updatedObject && updatedObject.fontFamily !== undefined && updatedObject.fontFamily === '')
        || ('fontColor' in updatedObject && updatedObject.fontColor !== undefined 
        && (updatedObject.fontColor.length !== 7 || updatedObject.fontColor[0] !== '#'))
    ) {
        return slide;
    }
    return {
        ...slide,
        objects: slide.objects.map(object =>
            object.id === objectId
                ? { ...object, ...updatedObject }
                : object
        )
    };
}

export {
    addObject,
    removeObject,
    updateObject
}