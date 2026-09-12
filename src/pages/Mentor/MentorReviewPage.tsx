import { useState, type FormEvent } from "react";
import { useParams, Link } from "react-router-dom";
import { rateSubmission } from "../../services/mentorService";
import { PageHeader, Panel } from "../shared/PageComponents";
import "../PlatformPages.css";

export default function MentorReviewPage() {
    const { submissionId: initialSubmissionId } = useParams();
    const [submissionId, setSubmissionId] = useState(
        initialSubmissionId && initialSubmissionId !== "new" ? initialSubmissionId : ""
    );
    const [rate, setRate] = useState<number>(10);
    const [statusMessage, setStatusMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleRate(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setStatusMessage("");
        setError("");

        if (!submissionId.trim()) {
            setError("Вкажіть ID роботи (Submission ID).");
            return;
        }

        if (rate < 1 || rate > 12) {
            setError("Оцінка повинна бути від 1 до 12.");
            return;
        }

        setLoading(true);
        try {
            const message = await rateSubmission({
                submissionId: submissionId.trim(),
                rate: Number(rate),
            });
            setStatusMessage(message ?? "Оцінку успішно збережено!");
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <PageHeader
                title="Оцінювання роботи студента"
                description="Виставлення оцінки за завдання або тест за шкалою від 1 до 12 балів."
                action={<Link className="button-link" to="/mentor/submissions">Список робіт</Link>}
            />

            <section className="form-panel">
                <Panel>
                    <h2>Форма оцінювання</h2>
                    <p>
                        Згідно з бізнес-правилами бекенду, оцінювати роботи можуть користувачі з роллю <strong>Teacher</strong>.
                        Оцінка виставляється один раз від 1 до 12 балів.
                    </p>

                    <form onSubmit={handleRate}>
                        <label>
                            ID зданої роботи (Submission ID)
                            <input
                                type="text"
                                value={submissionId}
                                onChange={(e) => setSubmissionId(e.target.value)}
                                placeholder="наприклад: 3fa85f64-5717-4562-b3fc-2c963f66afa6"
                                required
                            />
                        </label>

                        <label>
                            Оцінка (від 1 до 12 балів)
                            <input
                                type="number"
                                min={1}
                                max={12}
                                value={rate}
                                onChange={(e) => setRate(Number(e.target.value))}
                                required
                            />
                        </label>

                        {error && <p role="alert" style={{ color: "#d32f2f" }}>{error}</p>}
                        {statusMessage && <p style={{ color: "#2e7d32", fontWeight: 600 }}>{statusMessage}</p>}

                        <button type="submit" disabled={loading}>
                            {loading ? "Збереження оцінки..." : "Зберегти оцінку"}
                        </button>
                    </form>
                </Panel>
            </section>
        </>
    );
}
