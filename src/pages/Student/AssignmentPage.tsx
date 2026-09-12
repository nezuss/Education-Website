import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getSubmissionStatus, type SubmissionStatus } from "../../services/learningService";
import { PageHeader, Panel } from "../shared/PageComponents";
import "../PlatformPages.css";

export default function AssignmentPage() {
    const { assignmentId } = useParams();
    const [status, setStatus] = useState<SubmissionStatus>();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!assignmentId) return;
        getSubmissionStatus(assignmentId)
            .then(setStatus)
            .catch((reason: Error) => setError(reason.message))
            .finally(() => setLoading(false));
    }, [assignmentId]);

    const submission = status?.submission;
    const isRated = submission && submission.rate !== -1;

    return (
        <>
            <PageHeader
                title="Практичне завдання"
                description="Перегляд деталей завдання, статусу перевірки та отриманої оцінки від ментора."
                action={
                    assignmentId && !status?.isSubmitted ? (
                        <Link className="button-link" to={`/student/upload/${assignmentId}`}>
                            Завантажити розв'язок
                        </Link>
                    ) : undefined
                }
            />

            <div className="two-column">
                <Panel>
                    <h2>Інструкція до виконання</h2>
                    <p>
                        Ознайомтеся з описом завдання на сторінці уроку, підготуйте файл розв'язку (проєкт, архів або документ)
                        та відправте його на перевірку.
                    </p>
                    <div style={{ marginTop: "18px" }}>
                        {status?.isSubmitted ? (
                            <p style={{ color: "#2e7d32", fontWeight: 600 }}>
                                ✓ Ви вже успішно надіслали роботу за цим завданням.
                            </p>
                        ) : (
                            <Link className="button-link" to={`/student/upload/${assignmentId}`}>
                                Перейти до завантаження файлу
                            </Link>
                        )}
                    </div>
                </Panel>

                <Panel>
                    <h2>Статус перевірки роботи</h2>
                    {loading ? (
                        <p>Перевірка статусу...</p>
                    ) : error ? (
                        <p role="alert" style={{ color: "#d32f2f" }}>Не вдалося отримати статус: {error}</p>
                    ) : !status?.isSubmitted ? (
                        <div>
                            <p style={{ color: "#e65100", fontWeight: 600 }}>Роботу ще не надіслано</p>
                            <p className="meta" style={{ marginTop: "8px" }}>
                                Надішліть файл проєкту, щоб ментор міг його оцінити.
                            </p>
                        </div>
                    ) : (
                        <dl className="profile-list" style={{ marginTop: "10px" }}>
                            <dt>Статус</dt>
                            <dd style={{ color: "#2e7d32", fontWeight: 600 }}>Надіслано на перевірку</dd>

                            <dt>ID зданої роботи</dt>
                            <dd style={{ wordBreak: "break-all", fontFamily: "monospace" }}>{submission?.id}</dd>

                            <dt>Дата подання</dt>
                            <dd>{submission?.createdAt ? new Date(submission.createdAt).toLocaleString("uk-UA") : "—"}</dd>

                            <dt>Оцінка ментора</dt>
                            <dd>
                                {isRated ? (
                                    <strong style={{ fontSize: "18px", color: "#1b5e20" }}>
                                        {submission?.rate} / 12 балів
                                    </strong>
                                ) : (
                                    <span style={{ color: "#666" }}>Очікує перевірки викладачем</span>
                                )}
                            </dd>

                            {submission?.fileUrl && (
                                <>
                                    <dt>Файл роботи</dt>
                                    <dd>
                                        <a href={submission.fileUrl} target="_blank" rel="noreferrer" style={{ textDecoration: "underline" }}>
                                            Завантажити надісланий файл
                                        </a>
                                    </dd>
                                </>
                            )}
                        </dl>
                    )}
                </Panel>
            </div>
        </>
    );
}
