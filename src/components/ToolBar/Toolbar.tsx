import { updatePresentationName } from "../../functions/presentation";
import { Presentation } from "../../types/presentation";
import { Button } from "../ui/Button/Button";
import styles from './Toolbar.module.css';
import { addSlide } from "../../functions/slide";
import { addObject } from "../../functions/objects";
import { setSlideBackgroundColor } from "../../functions/background";
import { deepClone } from "../../functions/utils";
import { ChangeEvent, useCallback, useRef } from "react";

type ToolbarProps = {
    presentation: Presentation,
    setPresentation: (p: Presentation) => void,
    setPreviewMode: (mode: boolean) => void,
    setActiveSlideId: (s: string | null) => void,
    activeSlideId: string | null
}

function Toolbar(props: ToolbarProps) {
    const activeSlide = props.presentation.slides.find(slide => slide.id === props.activeSlideId);
    const imageInputRef = useRef<HTMLInputElement>(null);

    const handleImageChange = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            const file = event.currentTarget.files?.[0];
            event.currentTarget.value = "";

            if (!file || !file.type.startsWith("image/")) return;

            const slideId = props.activeSlideId;
            if (!slideId) return;

            const reader = new FileReader();

            reader.onload = () => {
                const src = reader.result;
                if (typeof src !== "string") return;

                const newPresentation = deepClone(props.presentation);
                newPresentation.slides = newPresentation.slides.map(slide =>
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
                );

                props.setPresentation(newPresentation);
            };

            reader.onerror = () => {
                alert("Не удалось прочитать изображение");
            };

            reader.readAsDataURL(file);
        },
        [props.activeSlideId, props.setPresentation],
    );
    return (
        <div className={styles.toolbar}>
            <input
                type="text"
                defaultValue={props.presentation.name}
                key={props.presentation.name}
                className={styles.presentationName}
                onBlur={event => {
                    const name = event.currentTarget.value.trim();
                    if (!name) {
                        event.currentTarget.value = props.presentation.name;
                        return;
                    }
                    event.currentTarget.value = name;
                    if (name !== props.presentation.name) {
                        props.setPresentation(
                            updatePresentationName(props.presentation, name)
                        );
                    }
                }}
                onKeyDown={event => {
                    if (event.key === "Enter") {
                        event.currentTarget.blur();
                    } else if (event.key === "Escape") {
                        event.currentTarget.value = props.presentation.name;
                        event.currentTarget.blur();
                    }
                }}
            />
            <Button
                text="Добавить слайд"
                className={styles.toolbarButton}
                onClick={() => {
                    props.setPresentation(addSlide(props.presentation));
                    console.log("Добавить слайд");
                }}
            />
            <Button
                text="Добавить текстовое поле"
                className={styles.toolbarButton}
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
                className={styles.toolbarButton}
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
            
            <Button
                text="Изменить фон слайда"
                className={styles.toolbarButton}
                onClick={() => {
                    const colorInput = document.getElementById('slide-bg-color-picker') as HTMLInputElement;
                    if (colorInput) {
                        colorInput.click();
                    }
                }}
            />

            <input
                id="slide-bg-color-picker"
                type="color"
                
                onChange={(e) => {
                    if (!activeSlide) {
                        alert("Нет активного слайда");
                        return;
                    }
                    const updatedSlide = setSlideBackgroundColor(activeSlide, e.target.value);
                    const newPresentation = deepClone(props.presentation);
                    const slideIndex = newPresentation.slides.findIndex(
                        slide => slide.id === props.activeSlideId
                    );
                    if (slideIndex !== -1) {
                        newPresentation.slides[slideIndex] = updatedSlide;
                    }
                    props.setPresentation(newPresentation);
                }}
                value={activeSlide && activeSlide.background.type === "solid" ? activeSlide.background.color : "#ffffff"}
                className={styles.hiddenColorInput}
            />
            <Button
                text="Сохранить"
                className={styles.toolbarButton}
                onClick={() => console.log("Сохранить")}
            />
            <Button
                text="Запуск предпросмотра"
                className={styles.toolbarButton}
                onClick={() => {
                    props.setPreviewMode(true);
                    props.setActiveSlideId(
                        props.presentation.slides[0] 
                            ? props.presentation.slides[0].id 
                            : null
                    );
                }}
            />
        </div>
    )
}

export {
    Toolbar
}
