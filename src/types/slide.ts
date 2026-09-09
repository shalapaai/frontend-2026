import { SlideObject } from "./objects";
import { Background } from "./background";

type Slide = {
    id: string,
    background: Background,
    objects: SlideObject[],
    width: 1020,
    height: 720
}

export {
    Slide
}