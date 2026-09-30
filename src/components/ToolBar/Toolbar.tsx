import { dispatch } from "../../editor";
import { updatePresentationName } from "../../functions/presentation";
import { Presentation } from "../../types/presentation";
import { TextInput } from "../ui/TextInput/TextInput";
import { Button } from "../ui/Button/Button";
import styles from './Toolbar.module.css';

type ToolbarProps = {
    presentation: Presentation
}

function Toolbar(props: ToolbarProps) {
    return (
        <div className={styles.toolbar}>
            <TextInput
                value={props.presentation.name}
                onChange={(value) => {
                    dispatch(updatePresentationName, value);
                    console.log(value);
                }}
                className={styles.presentationName}
            />
            <Button
                text="Добавить слайд"
                className={styles.toolbarButton}
                onClick={() => console.log("Добавить слайд")}
            />
            <Button
                text="Добавить изображение"
                className={styles.toolbarButton}
                onClick={() => console.log("Добавить изображение")}
            />
            <Button
                text="Сохранить"
                className={styles.toolbarButton}
                onClick={() => console.log("Сохранить")}
            />
            <Button
                text="Запуск предпросмотра"
                className={styles.toolbarButton}
                onClick={() => console.log("Запуск предпросмотра")}
            />
        </div>
    )
}

export {
    Toolbar
}
