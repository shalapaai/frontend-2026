import { Slide } from "../types/slide";
import { deepClone } from "./utils";
import { isColorHash } from "./utils";

function setSlideBackgroundColor(slide: Slide, color: string): Slide {
    if (!isColorHash(color)) {
        console.log('setSlideBackgroundColor err');
        return slide;
    }
    const newSlide = deepClone(slide);
    newSlide.background = {
        type: 'solid',
        color
    }
    return newSlide;
}

function setSlideBackgroundImage(slide: Slide, imageUrl: string): Slide  {
    const newSlide = deepClone(slide);
    newSlide.background = {
        type: 'image',
        src: imageUrl
    }
    return newSlide;
}

function setSlideBackgroundGradient(slide: Slide, colors: string[], angle: number): Slide {
    if (colors.filter(color => !isColorHash(color)).length > 0) {
        return slide;
    }
    const newSlide = deepClone(slide);
    newSlide.background = {
        type: 'gradient',
        colors,
        angle 
    }
    return newSlide;
}

function clearSlideBackground(slide: Slide): Slide {
    const newSlide = deepClone(slide);
    newSlide.background = {
        type: 'solid',
        color: '#FFFFFF'
    }
    return newSlide;
}

export {
    setSlideBackgroundColor,
    setSlideBackgroundImage,
    setSlideBackgroundGradient,
    clearSlideBackground
}