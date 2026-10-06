import type { CSSProperties } from "react";
import "./UiIcon.css";

export type UiIconName = "home" | "courses" | "assignment" | "users" | "person" | "mail" | "recycle" | "wave" | "teacher" | "admin" | "course-manage" | "orders" | "bell" | "bell-filled" | "cart" | "cart-filled" | "search" | "globe" | "chevron" | "left" | "arrow" | "down" | "logout" | "check" | "check-circle" | "warning" | "loading" | "download" | "file" | "external" | "plus" | "close";

type UiIconProps = {
  name: UiIconName;
  size?: number;
  className?: string;
  label?: string;
  style?: CSSProperties;
};

export default function UiIcon({ name, size = 18, className = "", label, style }: UiIconProps) {
  const iconStyle = {
    "--ui-icon-source": `url("/ui/${name}.png")`,
    "--ui-icon-size": `${size}px`,
    ...style,
  } as CSSProperties;
  return <span
    className={`ui-icon ui-icon-${name} ${className}`.trim()}
    style={iconStyle}
    role={label ? "img" : undefined}
    aria-label={label}
    aria-hidden={label ? undefined : true}
  />;
}
