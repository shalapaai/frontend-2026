type Background = SolidBackground | ImageBackground | GradientBackground;

type ImageBackground = {
    src: string,
    type: 'image'
}

type SolidBackground = {
    color: string,
    type: 'color'
}

type GradientBackground = {
    colors: string[],
    angle: number,
    gradientType?: 'linear' | 'radial',
    type: 'gradient'
}

export {
    Background
}