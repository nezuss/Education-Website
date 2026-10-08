import { useId, useState } from "react";

type PasswordFieldProps = {
  name: string;
  label: string;
  placeholder?: string;
  autoComplete?: "current-password" | "new-password";
  inlineLabel?: boolean;
};

export default function PasswordField({ name, label, placeholder, autoComplete = "new-password", inlineLabel = false }: PasswordFieldProps) {
  const id = useId();
  const [visible, setVisible] = useState(false);
  return <div className={`nex-auth-field${inlineLabel ? " nex-auth-field-inline" : ""}`}>
    <label htmlFor={id}>{label}</label>
    <div className="nex-auth-input-wrap">
      <input id={id} name={name} type={visible ? "text" : "password"} className="nex-auth-input nex-auth-password" placeholder={placeholder} autoComplete={autoComplete} required />
      <button type="button" className="nex-auth-pwd-toggle" onClick={() => setVisible(value => !value)} aria-label={visible ? `Сховати: ${label}` : `Показати: ${label}`} aria-pressed={visible}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          {visible ? <><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" /></> : <><path d="M2 9s4 6 10 6 10-6 10-6M4 12l-2 4m6-2-1 4m9-4 1 4m3-6 2 4" /></>}
        </svg>
      </button>
    </div>
  </div>;
}
