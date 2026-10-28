import { useCallback, useRef } from "react";
import type { ChangeEvent } from "react";
import { Button } from "../../ui/Button/Button";
import { deepClone } from "../../../functions/utils";
import type { Dispatch, SetStateAction } from "react";
import type { Presentation } from "../../../types/presentation";
import { addObject, updateObject } from "../../../functions/objects";
import { BackgroundPicker } from "../BackgroundPicker/BackgroundPicker";
import { TextStylePanel } from "../TextStylePanel/TextStylePanel";
import styles from "./PropertiesBar.module.css";

type PropertiesBarProps = {
    presentation: Presentation;
    activeSlideId: string | null;
    selectedObjectIds: string[];
    setPresentation: Dispatch<SetStateAction<Presentation>>;
};

function PropertiesBar(props: PropertiesBarProps) {
    const { activeSlideId, setPresentation } = props;
    const activeSlide = props.presentation.slides.find(slide => slide.id === props.activeSlideId);
    const selectedObject = props.selectedObjectIds.length === 1
        ? activeSlide?.objects.find(object => object.id === props.selectedObjectIds[0])
        : undefined;

    const imageInputRef = useRef<HTMLInputElement>(null);
    const handleImageChange = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            const file = event.currentTarget.files?.[0];
            event.currentTarget.value = "";

            if (!file || !file.type.startsWith("image/")) return;

            const slideId = activeSlideId;
            if (!slideId) return;

            const reader = new FileReader();

            reader.onload = () => {
                const src = reader.result;
                if (typeof src !== "string") return;

                setPresentation(previous => ({
                    ...previous,
                    slides: previous.slides.map(slide =>
                        slide.id === slideId
                            ? addObject(slide, {
                                type: "image",
                                src,
                                x: 200,
                                y: 150,
                                width: 300,
                                height: 200,
                            })
                            : slide
                    ),
                }));
            };

            reader.onerror = () => {
                alert("Не удалось прочитать изображение");
            };

            reader.readAsDataURL(file);
        },
        [activeSlideId, setPresentation],
    );
    return (
        <section className={styles.bar} aria-label="Свойства слайда и текста">
            <Button
                text="Добавить текстовое поле"
                className={styles.button}
                onClick={() => {
                    if (!activeSlide) {
                        alert("Нет активного слайда");
                        return;
                    }
                    const updatedSlide = addObject(activeSlide, {
                        type: "text",
                        x: 600,
                        y: 300,
                        width: 300,
                        height: 100,
                        fontSize: 18,
                        fontColor: "#000000",
                        fontFamily: "Arial",
                        text: ""
                    });
                    const newPresentation = deepClone(props.presentation);
                    const slideIndex = newPresentation.slides.findIndex(
                        slide => slide.id === props.activeSlideId
                    );
                    
                    if (slideIndex !== -1) {
                        newPresentation.slides[slideIndex] = updatedSlide;
                    }
                    props.setPresentation(newPresentation);
                    console.log("Добавить текстовое поле");
                }}
            />
            <Button
                text="Добавить изображение"
                className={styles.button}
                onClick={() => {
                    if (!activeSlide) {
                        alert("Нет активного слайда");
                        return;
                    }

                    imageInputRef.current?.click();
                }}
            />
            <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={handleImageChange}
            />
            

            {activeSlide && (
                <BackgroundPicker
                    key={activeSlide.id}
                    activeSlide={activeSlide}
                    setPresentation={setPresentation}
                />
            )}
            {activeSlide && selectedObject?.type === "text" && (
                <TextStylePanel
                    object={selectedObject}
                    onChange={style => {
                        const slideId = activeSlide.id;
                        const objectId = selectedObject.id;
                        setPresentation(previous => ({
                            ...previous,
                            slides: previous.slides.map(slide => slide.id === slideId
                                ? updateObject(slide, objectId, style) : slide),
                        }));
                    }}
                />
            )}
        </section>
    );
}

export { PropertiesBar };
