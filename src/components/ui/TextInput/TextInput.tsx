import { SlideObject } from "../../../types/objects";

type TextInputProps = {
	value: string,
	placeholder?: string,
	onChange?: (value: string) => void,
	className?: string,
	textProperties?: SlideObject
}

function TextInput(props: TextInputProps) {
	return (
		<input
			type="text"
			value={props.value}
			placeholder={props.placeholder}
			className={props.className}
			style={props.textProperties && props.textProperties.type === "text"
				? {
					fontFamily: props.textProperties.fontFamily,
                    fontSize: props.textProperties.fontSize,
                    color: props.textProperties.fontColor,
                    left: props.textProperties.x,
                    top: props.textProperties.y,
                    width: props.textProperties.width,
                    height: props.textProperties.height
				}
				: {}
			}
			onChange={(event) => props.onChange?.(event.target.value)}
		/>
	)
}

export {
	TextInput
}
