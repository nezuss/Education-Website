import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PageHeader, Panel } from "../shared/PageComponents";
import "../PlatformPages.css";

export default function MentorSubmissionsPage() {
    const navigate = useNavigate();
    const [lookupId, setLookupId] = useState("");

    return (
        <>
            <PageHeader
                title="Роботи студентів"
                description="Перегляд та перехід до перевірки зданих завдань."
                action={<Link className="button-link" to="/mentor">Кабінет ментора</Link>}
            />

            <div className="two-column">
                <Panel>
                    <h2>Перейти до перевірки за ID</h2>
                    <p>
                        Введіть ID зданої роботи студента, щоб переглянути деталі та виставити оцінку.
                    </p>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            if (lookupId.trim()) {
                                navigate(`/mentor/review/${encodeURIComponent(lookupId.trim())}`);
                            }
                        }}
                    >
                        <label>
                            Submission ID
                            <input
                                type="text"
                                value={lookupId}
                                onChange={(e) => setLookupId(e.target.value)}
                                placeholder="Введіть ID роботи..."
                                required
                            />
                        </label>
                        <button type="submit">Відкрити форму оцінювання</button>
                    </form>
                </Panel>

                <Panel>
                    <h2>Інформація про чергу перевірки</h2>
                    <p>
                        Наразі бекенд надає API для виставлення оцінки (<code>POST /api/cource/rate</code>) та перевірки
                        статусу окремого матеріалу для студента (<code>GET /api/cource/submit-material/status/:materialId</code>).
                    </p>
                    <p className="meta" style={{ marginTop: "12px" }}>
                        Як тільки в API зʼявиться ендпоінт для отримання повного списку робіт конкретного викладача/курсу,
                        тут відображатиметься автоматична таблиця з роботами всіх студентів.
                    </p>
                    <div style={{ marginTop: "18px" }}>
                        <Link className="button-link" to="/mentor/review/new">Перейти до виставлення оцінки</Link>
                    </div>
                </Panel>
            </div>
        </>
    );
}
