type BaseObject = {
    id: string,
    x: number,
    y: number,
    width: number,
    height: number
}

type TextObject = BaseObject & {
    text: string,
    fontFamily: string,
    fontSize: number,
    fontColor: string,
    type: 'text'
}

type ImageObject = BaseObject & {
    src: string,
    type: 'image'
}

type SlideObject = TextObject | ImageObject

export {
    SlideObject, TextObject, ImageObject
}