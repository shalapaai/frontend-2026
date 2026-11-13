import { Button } from "../../ui/Button/Button";
import barStyles from "../PropertiesBar/PropertiesBar.module.css";
import { useEffect, useRef, useState } from "react";
import type { TextObject } from "../../../types/objects";
import styles from "./TextStylePanel.module.css";

type TextObjectStyle = Partial<Pick<TextObject, "fontFamily" | "fontSize" | "fontColor">>;

type TextStylePanelProps = {
    object: TextObject;
    onChange: (style: TextObjectStyle) => void;
};

const fonts = ["Arial", "Times New Roman", "Verdana"];

function TextStylePanel({ object, onChange }: TextStylePanelProps) {
    const colorInputRef = useRef<HTMLInputElement>(null);
    const [fontSize, setFontSize] = useState(String(object.fontSize));

    useEffect(() => {
        setFontSize(String(object.fontSize));
    }, [object.id, object.fontSize]);

    const changeSize = (value: string) => {
        setFontSize(value);
        const number = Number(value);
        if (value !== "" && Number.isFinite(number) && number >= 8 && number <= 200) {
            onChange({ fontSize: number });
        }
    };

    return (
        <section
            className={styles.panel}
            aria-label="Свойства текста"
            onKeyDown={event => event.stopPropagation()}
        >
            <label>
                <select
                    aria-label="Шрифт"
                    value={object.fontFamily}
                    onChange={event => {
                        const value = event.currentTarget.value;
                        onChange({ fontFamily: value });
                    }}
                >
                    {fonts.map(font => <option key={font} value={font}>{font}</option>)}
                </select>
            </label>
            <div className={styles.sizeControl}>
                <input
                    id="text-font-size"
                    aria-label="Размер шрифта"
                    type="number"
                    min="8"
                    max="200"
                    step="1"
                    value={fontSize}
                    onChange={event => changeSize(event.currentTarget.value)}
                    onBlur={() => {
                        const next = fontSize === "" ? object.fontSize
                            : Math.max(8, Math.min(200, Number(fontSize)));
                        setFontSize(String(next));
                        if (next !== object.fontSize) onChange({ fontSize: next });
                    }}
                />
            </div>
            <div className={styles.colorControl}>
                <Button
                    text="Цвет текста"
                    className={barStyles.button}
                    onClick={() => colorInputRef.current?.click()}
                />
                <input
                    ref={colorInputRef}
                    className={styles.colorInput}
                    type="color"
                    aria-label="Цвет текста"
                    tabIndex={-1}
                    value={object.fontColor}
                    onChange={event => {
                        const value = event.currentTarget.value;
                        onChange({ fontColor: value });
                    }}
                />
            </div>
        </section>
    );
}

export { TextStylePanel };
