import type { FormEvent } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { submitAssignment } from "../../services/learningService";
import { PageHeader, Panel, Success } from "../shared/PageComponents";
import "../PlatformPages.css";
export default function UploadProjectPage() {
    const { assignmentId } = useParams(); const [submitted, setSubmitted] = useState(false); const [error, setError] = useState(""); const [loading, setLoading] = useState(false);
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); const file = new FormData(event.currentTarget).get("file"); if (!assignmentId || !(file instanceof File)) return; setLoading(true); setError(""); try { await submitAssignment(assignmentId, file); setSubmitted(true); } catch (reason) { setError((reason as Error).message); } finally { setLoading(false); } };
    return <><PageHeader title="Завантаження проєкту" /><section className="form-panel"><Panel>{submitted ? <Success title="Роботу надіслано" text="Ментор отримає її на перевірку." to="/student" label="До кабінету" /> : <form onSubmit={handleSubmit}><label>Файл проєкту<input name="file" type="file" required /></label>{error && <p role="alert">{error}</p>}<button type="submit" disabled={loading}>{loading ? "Надсилання…" : "Надіслати на перевірку"}</button></form>}</Panel></section></>;
}
