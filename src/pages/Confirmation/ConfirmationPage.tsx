import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { confirmEmail } from "../../services/authService";
import { PageHeader, Panel } from "../shared/PageComponents";
import "../PlatformPages.css";

export default function ConfirmationPage() {
    const { code: routeCode } = useParams();
    const [code, setCode] = useState(routeCode ?? "");
    const [state, setState] = useState<"idle" | "success" | "error">("idle");
    const [error, setError] = useState("");

    async function confirm() {
        if (!code.trim()) return;

        setError("");
        try {
            await confirmEmail(code.trim());
            setState("success");
        } catch (reason) {
            setError((reason as Error).message);
            setState("error");
        }
    }

    return <><PageHeader title="Підтвердження email" /><section className="form-panel"><Panel>{state === "success" ? <p>Email підтверджено. <Link to="/login">Увійти</Link></p> : <><p>Введіть шестизначний код із листа або з консолі локального бэкенда.</p><label>Код підтвердження<input value={code} onChange={(event) => setCode(event.target.value)} inputMode="numeric" maxLength={6} placeholder="123456" /></label>{state === "error" && <p role="alert">{error}</p>}<button onClick={confirm} disabled={!code.trim()}>Підтвердити email</button></>}</Panel></section></>;
}
