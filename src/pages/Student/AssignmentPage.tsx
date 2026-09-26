import { useEffect, useState, type FormEvent } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import { getSubmissionStatus, submitAssignment, type SubmissionStatus } from "../../services/learningService";
import "../../styles/StudentDashboard.css";

interface LocationState {
  courseId?: string;
  courseTitle?: string;
  assignmentTitle?: string;
  deadline?: string;
  description?: string;
}

export default function AssignmentPage() {
  const { assignmentId } = useParams();
  const location = useLocation();
  const state = (location.state as LocationState) || {};
  const [status, setStatus] = useState<SubmissionStatus>();
  const [file, setFile] = useState<File | null>(null);
  const [comment, setComment] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!assignmentId) return;
    getSubmissionStatus(assignmentId)
      .then(setStatus)
      .catch(() => {});
  }, [assignmentId]);

  const handleUpload = async (e: FormEvent) => {
    e.preventDefault();
    if (!file || !assignmentId) return;

    setIsUploading(true);
    setError("");

    try {
      await submitAssignment(assignmentId, file, comment);
      setUploadSuccess(true);
      const updated = await getSubmissionStatus(assignmentId);
      setStatus(updated);
    } catch (err) {
      setError((err as Error)?.message || "Не вдалося завантажити файл. Спробуйте ще раз.");
    } finally {
      setIsUploading(false);
    }
  };

  const isSubmitted = status?.isSubmitted || uploadSuccess;
  const submission = status?.submission;
  const isRated = Boolean(submission && submission.rate > 0);

  const courseTitle = state.courseTitle || "LCA & Еко-проєктування";
  const courseId = state.courseId || "1";
  const assignmentTitle = state.assignmentTitle || "Аналіз життєвого циклу продукту";
  const assignmentDesc = state.description || "Оберіть предмет повсякденного вжитку та оцініть його життєвий цикл від видобутку сировини до завершення експлуатації. Завантажте презентацію чи PDF-дослідження з обґрунтуванням циркулярного підходу.";

  return (
    <div className="std-dash">
      <nav className="learn-breadcrumbs" aria-label="breadcrumb">
        <Link to="/student">Головна</Link>
        <span>&gt;</span>
        <Link to="/student/courses">Мої курси</Link>
        <span>&gt;</span>
        <Link to={`/student/learning/${courseId}`}>{courseTitle}</Link>
        <span>&gt;</span>
        <span className="active">{assignmentTitle}</span>
      </nav>

      <div className="assignment-card-box">
        <span className="std-badge-tag">[ ПРАКТИЧНЕ ЗАВДАННЯ ]</span>
        <h1 className="assignment-title">
          {assignmentTitle}
        </h1>
        <p className="assignment-desc">
          {assignmentDesc}
        </p>

        <div className="assignment-grid-cols">
          <div className="assignment-req-box">
            <h3 className="assignment-req-title">
              Вимоги до завдання:
            </h3>
            <ul className="assignment-req-list">
              <li>Визначте матеріальний склад обраного продукту (не менше 3 матеріалів).</li>
              <li>Складіть схему життєвого циклу (сировина &rarr; виробництво &rarr; використання &rarr; переробка).</li>
              <li>Запропонуйте мінімум 2 рішення для оптимізації екологічного сліду.</li>
              <li>Формат: PDF, Figma або презентація до 50 МБ.</li>
            </ul>
          </div>

          <div className="assignment-deadline-box">
            <div>
              <div className="assignment-deadline-caption">Дедлайн здачі</div>
              <div className="assignment-deadline-date">
                {state.deadline
                  ? new Intl.DateTimeFormat("uk-UA", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(state.deadline))
                  : "Дедлайн не вказано"}
              </div>
            </div>

            <div style={{ marginTop: "16px" }}>
              <div style={{ fontSize: "13px", color: "var(--color-brand-soft)" }}>Ментор курсу:</div>
              <div style={{ fontSize: "15px", fontWeight: 600, color: "var(--color-brand-dark)" }}>Перевірте деталі курсу</div>
            </div>
          </div>
        </div>

        {isSubmitted ? (
          <div className="assignment-submitted-box">
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
              <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "var(--color-brand-primary)", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>
                ✓
              </div>
              <h3 style={{ fontSize: "20px", fontWeight: 700, margin: 0, color: "var(--color-brand-dark)" }}>
                Роботу надіслано на перевірку
              </h3>
            </div>

            <p style={{ fontSize: "14px", color: "var(--color-brand-soft)", marginBottom: "20px" }}>
              Ваш файл успішно завантажено. Ментор перевірить роботу та залишить детальний зворотний зв’язок протягом 48 годин.
            </p>

            <div style={{ background: "#FFFFFF", borderRadius: "12px", padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <span style={{ fontSize: "13px", color: "#8C6D53" }}>Статус оцінювання: </span>
                <strong style={{ color: isRated ? "var(--color-brand-primary)" : "#E65100" }}>
                  {isRated ? `${submission?.rate} / 12 балів` : "Очікує оцінки викладачем"}
                </strong>
              </div>
              {submission?.fileUrl && (
                <a href={submission.fileUrl} target="_blank" rel="noreferrer" style={{ fontSize: "13px", color: "var(--color-brand-primary)", fontWeight: 600 }}>
                  Завантажити файл &darr;
                </a>
              )}
            </div>
          </div>
        ) : (
          <form onSubmit={handleUpload}>
            <div
              className="assignment-dropzone"
              onClick={() => document.getElementById("file-upload")?.click()}
            >
              <input
                id="file-upload"
                type="file"
                style={{ display: "none" }}
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
              <div style={{ fontSize: "36px", marginBottom: "12px" }}>📁</div>
              <div style={{ fontSize: "16px", fontWeight: 600, color: "var(--color-brand-dark)", marginBottom: "6px" }}>
                {file ? file.name : "Перетягніть файл або натисніть для вибору"}
              </div>
              <div style={{ fontSize: "13px", color: "var(--color-brand-soft)" }}>
                Підтримуються PDF, ZIP, PNG, MP4 до 50 MB
              </div>
            </div>

            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", fontSize: "14px", fontWeight: 600, marginBottom: "8px", color: "var(--color-brand-dark)" }}>
                Коментар до роботи (необов'язково)
              </label>
              <textarea
                className="contacts-input contacts-textarea"
                placeholder="Вкажіть посилання на Figma чи напишіть короткий коментар для ментора..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                style={{ width: "100%", boxSizing: "border-box" }}
              />
            </div>

            {error && <div className="nex-auth-error-box" style={{ marginBottom: "16px" }}>{error}</div>}

            <button
              type="submit"
              className="std-continue-btn"
              disabled={isUploading || !file}
              style={{ padding: "14px 32px", fontSize: "15px" }}
            >
              <span>{isUploading ? "Завантаження..." : "Завантажити проєкт на перевірку"}</span>
              <span>&rarr;</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
