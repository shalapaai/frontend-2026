import { KeyboardEvent, FocusEvent } from "react";
import { SlideObject } from "../../../types/objects";

type TextInputProps = {
    value: string;
    placeholder?: string;
    onSubmit?: (value: string) => void;
	validate?: (value: string) => boolean;
    className?: string;
    textProperties?: SlideObject;
    style?: React.CSSProperties;
}

function TextInput(props: TextInputProps) {
    
    const handleSubmit = (e: FocusEvent<HTMLInputElement> | KeyboardEvent<HTMLInputElement>) => {
        const inputElement = e.currentTarget;
        const cleanValue = inputElement.value.trim();

        if (props.validate && !props.validate(cleanValue)) {
            inputElement.value = props.value;
            return;
        }

        if (cleanValue !== props.value) {
            props.onSubmit?.(cleanValue);
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSubmit(e);
            e.currentTarget.blur();
        }
        if (e.key === 'Escape') {
            e.currentTarget.value = props.value;
            e.currentTarget.blur();
        }
    };

    // FocusEvent
    const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
        handleSubmit(e);
    };

    return (
        <input
            type="text"
            defaultValue={props.value}
            key={props.value} 
            placeholder={props.placeholder}
            className={props.className}
            style={props.style}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
        />
    );
}

export { TextInput };