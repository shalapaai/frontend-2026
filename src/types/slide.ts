import { SlideObject } from "./objects";
import { Background } from "./background";

type Slide = {
    id: string,
    background: Background,
    objects: SlideObject[],
    width: number,
    height: number
}

export {
    Slide
}