import { Slide } from "./slide";

type Presentation = {
    id: string,
    name: string,
    slides: Slide[],
    activeSlideId: string
}

export {
    Presentation
}