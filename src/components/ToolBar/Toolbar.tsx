import { PropertiesBar } from "./PropertiesBar/PropertiesBar";
import { usePdfExport } from "../hooks/usePdfExport";
import { Button } from "../ui/Button/Button";
import styles from './Toolbar.module.css';
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { addSlide, updatePresentationName } from "../../store/slices/presentationSlice";
import { setActiveSlide, setPreviewMode } from "../../store/slices/viewModelSlice";

function Toolbar() {
    const dispatch = useAppDispatch();
    const presentation = useAppSelector(state => state.presentation);
    const { exportToPdf, isExporting } = usePdfExport();
    if (!presentation) return null;
    return (
        <header>
            <div className={styles.toolbar}>
                <input
                    type="text"
                    defaultValue={presentation.name}
                    key={presentation.name}
                    className={styles.presentationName}
                    onBlur={event => {
                        const name = event.currentTarget.value.trim();
                        if (!name) {
                            event.currentTarget.value = presentation.name;
                            return;
                        }
                        event.currentTarget.value = name;
                        if (name !== presentation.name) {
                            dispatch(updatePresentationName(name));
                        }
                    }}
                    onKeyDown={event => {
                        if (event.key === "Enter") {
                            event.currentTarget.blur();
                        } else if (event.key === "Escape") {
                            event.currentTarget.value = presentation.name;
                            event.currentTarget.blur();
                        }
                    }}
                />
                <Button
                    text="Добавить слайд"
                    className={styles.toolbarButton}
                    onClick={() => dispatch(addSlide())}
                />
                <Button
                    text={isExporting ? "Экспорт…" : "Экспорт PDF"}
                    className={styles.toolbarButton}
                    onClick={() => {
                        void exportToPdf(presentation).catch(error => {
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
                        dispatch(setActiveSlide(presentation.slides[0]?.id ?? null));
                        dispatch(setPreviewMode(true));
                    }}
                />
            </div>
            <PropertiesBar />
        </header>
    )
}

export {
    Toolbar
}
