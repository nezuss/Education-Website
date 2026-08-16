import type { FormEvent } from "react";
import { useState } from "react";
import { PageHeader, Panel, Success } from "../shared/PageComponents";
import "../PlatformPages.css";
export default function UploadProjectPage() { const [submitted, setSubmitted] = useState(false); const handleSubmit = (event: FormEvent) => { event.preventDefault(); setSubmitted(true); }; return <><PageHeader title="Завантаження проєкту" /><section className="form-panel"><Panel>{submitted ? <Success title="Роботу надіслано" text="Ментор отримає її на перевірку." to="/student" label="До кабінету" /> : <form onSubmit={handleSubmit}><label>Файл проєкту<input type="file" required /></label><label>Коментар для ментора<textarea rows={5} /></label><button type="submit">Надіслати на перевірку</button></form>}</Panel></section></>; }
