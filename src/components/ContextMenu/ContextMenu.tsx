import { Button } from "../ui/Button/Button";
import style from "./ContextMenu.module.css";

type ContextMenuProps = {
    x: number,
    y: number,
    onDelete: () => void,
    onClose: () => void,
}

function ContextMenu(props: ContextMenuProps) {
    return (
        <div
            className={style.contextMenu}
            style={{
                top: props.y,
                left: props.x
            }}
            
        >
            <Button
                text={"Удалить"}
                onClick={() => {
                    props.onDelete();
                    props.onClose();
                }}
            />
        </div>
    );
}

export { ContextMenu };