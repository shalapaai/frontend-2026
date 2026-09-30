type Background = SolidBackground | ImageBackground | GradientBackground;

type ImageBackground = {
    src: string,
    type: 'image'
}

type SolidBackground = {
    color: string,
    type: 'solid'
}

type GradientBackground = {
    colors: string[],
    angle: number,
    type: 'gradient'
}

export {
    Background
}