import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { confirmEmail } from "../../services/authService";
import { PageHeader, Panel } from "../shared/PageComponents";
import "../PlatformPages.css";

export default function ConfirmationPage() {
    const { code } = useParams(); const [state, setState] = useState<"idle" | "success" | "error">("idle"); const [error, setError] = useState("");
    const confirm = async () => { if (!code) return; try { await confirmEmail(code); setState("success"); } catch (reason) { setError((reason as Error).message); setState("error"); } };
    return <><PageHeader title="Підтвердження email" /><section className="form-panel"><Panel>{state === "success" ? <p>Email підтверджено. <Link to="/login">Увійти</Link></p> : <><p>Підтвердіть адресу електронної пошти для активації акаунта.</p>{state === "error" && <p role="alert">{error}</p>}<button onClick={confirm} disabled={!code}>Підтвердити email</button></>}</Panel></section></>;
}
