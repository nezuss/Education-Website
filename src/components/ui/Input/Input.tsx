import "./Input.css";
import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export default function Input(props: InputProps) {
    return (
        <input
            className="input"
            {...props}
        />
    );
}