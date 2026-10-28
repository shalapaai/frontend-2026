import { KeyboardEvent, FocusEvent } from "react";

type TextInputProps = {
    value: string;
    placeholder?: string;
    onSubmit?: (value: string) => void;
	validate?: (value: string) => boolean;
    className?: string;
    style?: React.CSSProperties;
    readOnly?: boolean;
}

function TextInput(props: TextInputProps) {
    const handleSubmit = (e: FocusEvent<HTMLTextAreaElement> | KeyboardEvent<HTMLTextAreaElement>) => {
        const inputElement = e.currentTarget;
        const cleanValue = inputElement.value;

        if (props.validate && !props.validate(cleanValue)) {
            inputElement.value = props.value;
            return;
        }

        if (cleanValue !== props.value) {
            props.onSubmit?.(cleanValue);
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Escape') {
            e.currentTarget.value = props.value;
            e.currentTarget.blur();
        }
    };

    const handleBlur = (event: FocusEvent<HTMLTextAreaElement>) => {
        handleSubmit(event);
    };

    return (
        <textarea
            defaultValue={props.value}
            key={props.value} 
            placeholder={props.placeholder}
            className={props.className}
            style={props.style}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            readOnly={props.readOnly}
            tabIndex={props.readOnly ? -1 : undefined}
            onMouseDown={event => {
                if (props.readOnly) {
                    event.preventDefault();
                }
            }}
        />
    );
}

export { TextInput };