type Presentation = {
    id: string,
    name: string,
    slides: Slide[]
}

type Slide = {
    id: string,
    background: Background,
    objects: SlideObject[]
}

type SlideObject = TextObject | ImageObject

type Background = SolidBackground | ImageBackground

type ImageBackground = {
    src: string,
    type: 'image'
}

type SolidBackground = {
    color: string,
    type: 'solid'
}

type BaseObject = {
    id: string,
    x: number,
    y: number,
    width: number,
    height: number
}

type TextObject = BaseObject & {
    text: string,
    type: 'text'
}

type ImageObject = BaseObject & {
    src: string,
    type: 'image'
}

export {
    Presentation,
    Slide,
    SlideObject,
    Background
}