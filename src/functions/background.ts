import { Slide } from "../types/slide";

function setSlideBackgroundColor(slide: Slide, color: string): Slide {
    if (color.length !== 7 || color[0] !== '#') {
        return {
            ...slide
        }
    }
    return {
        ...slide,
        background: {
            type: 'solid',
            color
        }
    }
}

function setSlideBackgroundImage(slide: Slide, imageUrl: string): Slide  {
    return {
        ...slide,
        background: {
            type: 'image',
            src: imageUrl
        }
    }
}

function setSlideBackgroundGradient(slide: Slide, colors: string[], angle?: number): Slide {
    if (colors.filter(color => color.length !== 7 || color[0] !== '#').length > 0) {
        return {
            ...slide
        }
    }
    return {
        ...slide,
        background: {
            type: 'gradient',
            colors,
            angle
        }
    }
}

function clearSlideBackground(slide: Slide): Slide {
    return {
        ...slide,
        background: {
            type: 'solid',
            color: '#FFFFFF'
        }
    }
}

export {
    setSlideBackgroundColor,
    setSlideBackgroundImage,
    setSlideBackgroundGradient,
    clearSlideBackground
}