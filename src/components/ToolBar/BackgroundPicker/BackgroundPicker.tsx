import { useCallback, useEffect, useRef, useState } from "react";
import type { ChangeEvent, Dispatch, SetStateAction } from "react";
import type { Presentation } from "../../../types/presentation";
import type { Slide } from "../../../types/slide";
import {
    setSlideBackgroundColor,
    setSlideBackgroundImage,
    setSlideBackgroundGradient,
    clearSlideBackground,
} from "../../../functions/background";
import styles from "./BackgroundPicker.module.css";

type BackgroundPickerProps = {
    activeSlide: Slide;
    setPresentation: Dispatch<SetStateAction<Presentation>>;
};

function BackgroundPicker({ activeSlide, setPresentation }: BackgroundPickerProps) {
    const controlRef = useRef<HTMLDivElement>(null);
    const activeSlideId = activeSlide.id;
    const [backgroundType, setBackgroundType] = useState(activeSlide.background.type);
    const backgroundInputRef = useRef<HTMLInputElement>(null);
    const [backgroundPanelSlideId, setBackgroundPanelSlideId] = useState<string | null>(null);
    const isOpen = backgroundPanelSlideId === activeSlideId;

    useEffect(() => {
        if (!isOpen) return;
        const handlePointerDown = (event: PointerEvent) => {
            if (event.target instanceof Node && !controlRef.current?.contains(event.target)) {
                setBackgroundPanelSlideId(null);
            }
        };
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key !== "Escape") return;
            event.preventDefault();
            event.stopPropagation();
            setBackgroundPanelSlideId(null);
            controlRef.current?.querySelector("button")?.focus();
        };

        document.addEventListener("pointerdown", handlePointerDown, true);
        document.addEventListener("keydown", handleKeyDown, true);
        return () => {
            document.removeEventListener("pointerdown", handlePointerDown, true);
            document.removeEventListener("keydown", handleKeyDown, true);
        };
    }, [isOpen]);

    const gradient = activeSlide.background.type === "gradient" ? activeSlide.background : null;
    const gradientColors = gradient?.colors ?? ["#ffffff", "#0b57d0"];

    const changeBackground = (update: (slide: Slide) => Slide) => {
        const slideId = activeSlide.id;
        setPresentation(previous => ({
            ...previous,
            slides: previous.slides.map(slide => slide.id === slideId ? update(slide) : slide),
        }));
    };

    const changeGradient = (
        colors = gradientColors,
        angle = gradient?.angle ?? 90,
        gradientType = gradient?.gradientType ?? "linear",
    ) => changeBackground(slide => setSlideBackgroundGradient(slide, colors, angle, gradientType));

    const handleBackgroundImageChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        const file = event.currentTarget.files?.[0];
        event.currentTarget.value = "";
        if (!file || !file.type.startsWith("image/") || !activeSlideId) return;
        const slideId = activeSlideId;
        const reader = new FileReader();
        reader.onload = () => {
            const src = reader.result;
            if (typeof src !== "string") return;
            setPresentation(previous => ({
                ...previous,
                slides: previous.slides.map(slide => slide.id === slideId
                    ? setSlideBackgroundImage(slide, src) : slide),
            }));
        };
        reader.onerror = () => alert("Не удалось прочитать фоновое изображение");
        reader.readAsDataURL(file);
    }, [activeSlideId, setPresentation]);


    return (
    <div
        ref={controlRef}
        className={styles.backgroundControl}
        onKeyDown={event => event.stopPropagation()}
    >
        <button
            type="button"
            className={styles.toolbarButton}
            aria-expanded={backgroundPanelSlideId === activeSlide.id}
            onClick={() => setBackgroundPanelSlideId(previous =>
                previous === activeSlide.id ? null : activeSlide.id
            )}
        >
            Изменить фон слайда
        </button>
        {backgroundPanelSlideId === activeSlide.id && (
            <div className={styles.backgroundPanel}>
                <label>
                    Тип фона
                    <select
                        value={backgroundType}
                        onChange={event => {
                            const type = event.currentTarget.value;
                            if (type !== "color" && type !== "gradient" && type !== "image") return;
                            setBackgroundType(type);
                            if (type === "color") {
                                const color = activeSlide.background.type === "color"
                                    ? activeSlide.background.color : "#ffffff";
                                changeBackground(slide => setSlideBackgroundColor(slide, color));
                            } else if (type === "gradient") {
                                changeGradient();
                            }
                        }}
                    >
                        <option value="color">Цвет</option>
                        <option value="gradient">Градиент</option>
                        <option value="image">Картинка</option>
                    </select>
                </label>
                {backgroundType === "color" && (
                <label>
                    Цвет фона
                    <input
                        type="color"
                        value={activeSlide.background.type === "color"
                            ? activeSlide.background.color : "#ffffff"}
                        onChange={event => {
                            const color = event.currentTarget.value;
                            changeBackground(slide => setSlideBackgroundColor(slide, color));
                        }}
                    />
                </label>
                )}
                {backgroundType === "image" && (
                <>
                <button type="button" onClick={() => backgroundInputRef.current?.click()}>
                    Добавить фоновое изображение
                </button>
                <input
                    ref={backgroundInputRef}
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleBackgroundImageChange}
                />
                </>
                )}
                {backgroundType === "gradient" && (
                <fieldset className={styles.gradientControls}>
                    <legend>Градиент</legend>
                    <label>
                        Тип
                        <select
                            value={gradient?.gradientType ?? "linear"}
                            onChange={event => changeGradient(
                                gradientColors,
                                gradient?.angle ?? 90,
                                event.currentTarget.value === "radial" ? "radial" : "linear",
                            )}
                        >
                            <option value="linear">Линейный</option>
                            <option value="radial">Радиальный</option>
                        </select>
                    </label>
                    {[0, 1].map(index => (
                        <label key={index}>
                            Цвет {index + 1}
                            <input
                                type="color"
                                value={gradientColors[index]}
                                onChange={event => {
                                    const colors = [...gradientColors];
                                    colors[index] = event.currentTarget.value;
                                    changeGradient(colors);
                                }}
                            />
                        </label>
                    ))}
                    <label>
                        Угол: {gradient?.angle ?? 90}°
                        <input
                            type="range"
                            min="0"
                            max="360"
                            value={gradient?.angle ?? 90}
                            disabled={gradient?.gradientType === "radial"}
                            onChange={event => changeGradient(
                                gradientColors, Number(event.currentTarget.value),
                            )}
                        />
                    </label>
                </fieldset>
                )}
                <button type="button" onClick={() => {
                    changeBackground(clearSlideBackground);
                    setBackgroundType("color");
                }}>
                    Убрать фон
                </button>
            </div>
        )}
    </div>    );
}

export { BackgroundPicker };
