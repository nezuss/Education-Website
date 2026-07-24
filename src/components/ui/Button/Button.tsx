import "./Button.css";
import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
}

export default function Button({
    children,
    ...props
}: ButtonProps) {
    return (
        <button className="button" {...props}>
            {children}
        </button>
    );
}