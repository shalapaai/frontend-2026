import { PropertiesBar } from "./PropertiesBar/PropertiesBar";
import { usePdfExport } from "../hooks/usePdfExport";
import { updatePresentationName } from "../../functions/presentation";
import { Presentation } from "../../types/presentation";
import { Button } from "../ui/Button/Button";
import styles from './Toolbar.module.css';
import { addSlide } from "../../functions/slide";
import type { Dispatch, SetStateAction } from "react";

type ToolbarProps = {
    selectedObjectIds: string[],
    presentation: Presentation,
    setPresentation: Dispatch<SetStateAction<Presentation>>,
    setPreviewMode: (mode: boolean) => void,
    setActiveSlideId: (s: string | null) => void,
    activeSlideId: string | null
}

function Toolbar(props: ToolbarProps) {
    const { setPresentation } = props;
    const { exportToPdf, isExporting } = usePdfExport();
    return (
        <header>
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
                text={isExporting ? "Экспорт…" : "Экспорт PDF"}
                className={styles.toolbarButton}
                onClick={() => {
                    void exportToPdf(props.presentation).catch(error => {
                        alert(error instanceof Error ? error.message : "Не удалось экспортировать PDF");
                    });
                }}
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
        <PropertiesBar
            presentation={props.presentation}
            activeSlideId={props.activeSlideId}
            selectedObjectIds={props.selectedObjectIds}
            setPresentation={setPresentation}
        />
        </header>
    )
}

export {
    Toolbar
}
