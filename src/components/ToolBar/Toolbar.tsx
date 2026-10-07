import { updatePresentationName } from "../../functions/presentation";
import { Presentation } from "../../types/presentation";
import { TextInput } from "../ui/TextInput/TextInput";
import { Button } from "../ui/Button/Button";
import styles from './Toolbar.module.css';
import { addSlide } from "../../functions/slide";
import { addObject } from "../../functions/objects";
import { setSlideBackgroundColor } from "../../functions/background";
import { deepClone } from "../../functions/utils";

type ToolbarProps = {
    presentation: Presentation,
    setPresentation: (p: Presentation) => void,
    setPreviewMode: (mode: boolean) => void,
    setActiveSlideId: (s: string) => void,
    activeSlideId: string
}

function Toolbar(props: ToolbarProps) {
    const activeSlide = props.presentation.slides.find(slide => slide.id === props.activeSlideId);
    if (!activeSlide) return (
        <></>
    );
    return (
        <div className={styles.toolbar}>
            <TextInput
                value={props.presentation.name}
                validate={(value) => value !== ""} 
                onSubmit={(value) => {
                    props.setPresentation(updatePresentationName(props.presentation, value.trim()));
                }}
                className={styles.presentationName}
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
                onClick={() => console.log("Добавить изображение")}
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
                value={activeSlide.background.type === "solid" ? activeSlide.background.color : "#ffffff"}
                onChange={(e) => {
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
                    props.setActiveSlideId(props.presentation.slides[0].id);
                }}
            />
        </div>
    )
}

export {
    Toolbar
}
