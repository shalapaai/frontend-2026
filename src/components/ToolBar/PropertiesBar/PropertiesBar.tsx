import { useCallback, useRef } from "react";
import type { ChangeEvent } from "react";
import { Button } from "../../ui/Button/Button";
import { BackgroundPicker } from "../BackgroundPicker/BackgroundPicker";
import { TextStylePanel } from "../TextStylePanel/TextStylePanel";
import styles from "./PropertiesBar.module.css";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { addObject, updateObject } from "../../../store/slices/presentationSlice";

function PropertiesBar() {
    const dispatch = useAppDispatch();
    const presentation = useAppSelector(state => state.presentation.presentation);
    const activeSlideId = useAppSelector(state => state.presentation.activeSlideId);
    const selectedObjectIds = useAppSelector(state => state.presentation.selectedObjectIds);

    const activeSlide = presentation?.slides.find(slide => slide.id === activeSlideId);
    const selectedObject = selectedObjectIds.length === 1
        ? activeSlide?.objects.find(object => object.id === selectedObjectIds[0])
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

                dispatch(addObject({
                    slideId,
                    object: {
                        type: "image",
                        src,
                        x: 200,
                        y: 150,
                        width: 300,
                        height: 200,
                    },
                }));
            };

            reader.onerror = () => {
                alert("Не удалось прочитать изображение");
            };

            reader.readAsDataURL(file);
        },
        [activeSlideId, dispatch],
    );

    if (!presentation) return null;
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
                    dispatch(addObject({
                        slideId: activeSlide.id,
                        object: {
                            type: "text",
                            x: 600,
                            y: 300,
                            width: 300,
                            height: 100,
                            fontSize: 18,
                            fontColor: "#000000",
                            fontFamily: "Arial",
                            text: "",
                        },
                    }));
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
                />
            )}
            {activeSlide && selectedObject?.type === "text" && (
                <TextStylePanel
                    object={selectedObject}
                    onChange={style => dispatch(updateObject({
                        slideId: activeSlide.id,
                        objectId: selectedObject.id,
                        changes: style,
                    }))}
                />
            )}
        </section>
    );
}

export { PropertiesBar };
