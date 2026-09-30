type ButtonProps = {
    text: string,
    onClick: () => void,
    className?: string
}

function Button(props: ButtonProps) {
    return (
        <button
            className={props.className}
            onClick={() => props.onClick()}
        >
            {props.text}
        </button>
    )
}

export {
    Button
}
