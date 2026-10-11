import { useState } from "react";
import { Link } from "react-router-dom";
import UiIcon from "../../components/ui/Icon/UiIcon";
import { assignmentDate, assignmentDaysLeft } from "../../services/assignmentService";
import { getStudentProgress, getSubmittedProjectCount, getUpcomingDeadlines } from "../../services/studentProgressService";
import { submissionFileUrl } from "../../services/submissionService";
import type { CourseStats } from "../../services/courseStatsService";
import useRemoteData from "../shared/useRemoteData";
import RequestError from "../shared/RequestError";
import "../../styles/StudentProgress.css";

function Unavailable({ children }: { children: React.ReactNode }) {
  return <div className="sp-unavailable"><strong>Дані поки недоступні</strong><p>{children}</p></div>;
}

function percentageLabel(value: number) {
  const rounded = Math.round(value * 100) / 100;
  return value < 100 && rounded === 100 ? "<100%" : `${new Intl.NumberFormat("uk-UA", { maximumFractionDigits: 2 }).format(value)}%`;
}

function coursePercentage(stats?: CourseStats) {
  return stats && stats.totalSubmittableMaterials > 0 ? stats.completedSubmittableMaterials / stats.totalSubmittableMaterials * 100 : undefined;
}

function CourseCover({ bannerUrl }: { bannerUrl?: string }) {
  const [failed, setFailed] = useState(false);
  const src = submissionFileUrl(bannerUrl);
  return src && !failed ? <img src={src} alt="" onError={() => setFailed(true)} />
    : <span className="sp-cover-empty"><UiIcon name="courses" size={40} /><span>Дані поки недоступні</span></span>;
}

export default function ProgressPage() {
  const progress = useRemoteData(getStudentProgress);
  const projects = useRemoteData(getSubmittedProjectCount);
  const deadlines = useRemoteData(getUpcomingDeadlines);
  const totals = progress.data?.totals;
  const percentage = totals?.percentage;
  const title = percentage === 100 ? "Усі доступні роботи перевірено." : percentage === undefined ? "Твій шлях у навчанні." : percentage === 0 ? "Твій шлях тільки починається." : "Кожен урок наближає до мети.";

  return <div className="student-progress">
    <nav className="sp-breadcrumbs" aria-label="Хлібні крихти"><Link to="/student">Головна</Link><UiIcon name="chevron" size={16} /><span aria-current="page">Прогрес</span></nav>
    <header className="sp-heading">
      <div><span className="sp-tag">[ ПРОГРЕС ]</span><h1>Твій прогрес</h1><p>Відстежуй завершені модулі, активність, дедлайни та як поступово формується твоє портфоліо.</p></div>
      <div className="sp-periods" aria-label="Період статистики"><button type="button" disabled title="Статистика за окремі періоди поки недоступна">7 днів</button><button type="button" disabled title="Статистика за окремі періоди поки недоступна">30 днів</button><button type="button" aria-pressed="true">Весь час</button></div>
    </header>
    <div className="sp-overview-row">
      <section className="sp-card sp-overall" aria-labelledby="sp-overall-title">
        <span className="sp-tag">[ OVERALL PROGRESS / ЗАГАЛЬНИЙ ПРОГРЕС ]</span>
        <div className="sp-overall-content"><div><h2 id="sp-overall-title">{title}</h2><p>Прогрес відображає частку перевірених робіт і тестів у твоїх курсах.</p></div>
          <div className={`sp-ring${percentage === undefined ? " sp-ring-unavailable" : ""}`} role={percentage !== undefined ? "meter" : undefined} aria-label="Загальний прогрес" aria-valuenow={percentage} aria-valuemin={percentage !== undefined ? 0 : undefined} aria-valuemax={percentage !== undefined ? 100 : undefined}>
            <svg viewBox="0 0 241 241" aria-hidden="true"><circle className="sp-ring-base" cx="123.105" cy="118.495" r="84.195" />{percentage !== undefined && percentage > 0 && <circle className="sp-ring-value" cx="123.105" cy="118.495" r="84.195" pathLength="100" strokeDasharray={`${percentage} 100`} transform="rotate(-90 123.105 118.495)" />}</svg>
            <div><strong>{percentage === undefined ? "—" : percentageLabel(percentage)}</strong><span>{percentage === undefined ? "Дані поки недоступні" : "загальний прогрес"}</span></div>
          </div>
        </div>
        <dl className="sp-overall-metrics"><div><dd>{totals?.lessons ?? "—"}</dd><dt>уроків завершено</dt></div><div><dd>{projects.data ?? "—"}</dd><dt>проєктів здано</dt></div><div><dd>—</dd><dt>годин навчання</dt></div></dl>
        {progress.loading && <p role="status">Завантаження прогресу…</p>}
        {progress.error && <RequestError message={progress.error} retry={progress.reload} />}
        {progress.data?.items.some(item => !item.stats) && <p className="sp-partial" role="status">Загальний підсумок недоступний: статистику частини курсів не вдалося отримати.</p>}
        {projects.error && <button className="sp-retry-text" type="button" onClick={projects.reload}>Дані проєктів недоступні · Спробувати ще раз</button>}
      </section>
      <section className="sp-card sp-streak" aria-labelledby="sp-streak-title"><span className="sp-tag">[ LEARNING STREAK / СЕРІЯ ]</span><h2 id="sp-streak-title">Твій ритм навчання</h2><p>Відстежуй регулярність навчання та серію активних днів.</p><Unavailable>Історія щоденної активності поки недоступна.</Unavailable><div className="sp-week" aria-hidden="true">{["ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ", "НД"].map(day => <span key={day}>{day}</span>)}</div><div className="sp-streak-longest"><span>Найдовша серія</span><strong>—</strong></div></section>
    </div>
    <div className="sp-courses-row">
      <section className="sp-card sp-courses" aria-labelledby="sp-courses-title"><header className="sp-section-header"><h2 id="sp-courses-title">Прогрес за курсами</h2><Link to="/student/courses">Усі курси <UiIcon name="arrow" size={16} /></Link></header>
        {progress.loading && <p role="status">Завантаження курсів…</p>}
        {progress.error && <RequestError message={progress.error} retry={progress.reload} />}
        {progress.data?.items.length === 0 && <div className="sp-empty"><h3>Дані поки недоступні</h3><p>У тебе ще немає курсів. Обери свій наступний напрям навчання.</p><Link to="/courses">Перейти до каталогу <UiIcon name="arrow" size={16} /></Link></div>}
        <div className="sp-course-list">{progress.data?.items.map(({ course, stats, error }) => { const value = coursePercentage(stats); return <article className="sp-course" key={course.id}>
          <Link to={`/student/learning/${encodeURIComponent(course.id)}`} className="sp-cover" aria-label={`Відкрити курс «${course.title}»`}><CourseCover key={course.bannerUrl} bannerUrl={course.bannerUrl} /></Link>
          <div className="sp-course-content"><div className={`sp-course-description${value === undefined ? " sp-course-description-unavailable" : ""}`}><div><h3><Link to={`/student/learning/${encodeURIComponent(course.id)}`}>{course.title}</Link></h3><p>{stats ? `Модулів ${stats.completedModules} із ${stats.totalModules} · ${stats.completedLessons} уроків завершено` : "Статистика курсу поки недоступна"}</p></div><div className={`sp-course-percent${value === undefined ? " sp-course-percent-unavailable" : ""}`}><strong>{value === undefined ? "Дані поки недоступні" : percentageLabel(value)}</strong>{value !== undefined && <span>пройдено</span>}</div></div>
            {value !== undefined ? <progress max={100} value={value} aria-label={`Прогрес курсу «${course.title}»`} /> : !stats && <button className="sp-retry-text" type="button" title={error} onClick={progress.reload}>Спробувати ще раз</button>}
          </div>
        </article>; })}</div>
      </section>
      <section className="sp-card sp-activity" aria-labelledby="sp-activity-title"><h2 id="sp-activity-title">Активність за 7 днів</h2><div className="sp-activity-empty"><Unavailable>Щоденна статистика й час навчання поки недоступні.</Unavailable></div><div className="sp-activity-footer"><span>Середній час: —</span><span>Найактивніший день: —</span></div><div className="sp-activity-decoration" aria-hidden="true"><svg viewBox="0 0 522 139"><path d="M2 137H218C365 137 431 123 509 14" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" /><path d="m499 16 23-16-7 29Z" fill="currentColor" /></svg><img src="/ui/progress-mascot.png" className="sp-activity-mascot" alt="" /></div></section>
    </div>
    <div className="sp-bottom-row">
      <section className="sp-card sp-achievements" aria-labelledby="sp-achievements-title"><header className="sp-section-header"><h2 id="sp-achievements-title">Останні досягнення</h2><button type="button" disabled>Усі досягнення <UiIcon name="arrow" size={16} /></button></header><div className="sp-achievements-empty"><UiIcon name="progress" size={28} /><Unavailable>Досягнення та відзнаки поки недоступні.</Unavailable></div><div className="sp-goal"><h3>НАСТУПНА ЦІЛЬ</h3><p>Дані про навчальні цілі поки недоступні.</p></div></section>
      <section className="sp-card sp-deadlines" aria-labelledby="sp-deadlines-title"><header className="sp-section-header"><h2 id="sp-deadlines-title">Найближчі дедлайни</h2><button type="button" disabled title="Календар поки недоступний">Календар <UiIcon name="arrow" size={16} /></button></header>
        {deadlines.loading && <p role="status">Завантаження завдань…</p>}{deadlines.error && <RequestError message={deadlines.error} retry={deadlines.reload} />}
        {deadlines.data?.incomplete && <div><Unavailable>Частина завдань або їхні терміни поки недоступні.</Unavailable><button className="sp-retry-text" type="button" onClick={deadlines.reload}>Спробувати ще раз</button></div>}
        {deadlines.data?.items.length === 0 && !deadlines.data.incomplete && <div className="sp-empty"><UiIcon name="calendar" size={28} /><h3>Немає найближчих дедлайнів</h3><p>У доступних завданнях твоїх курсів не заплановано нових термінів.</p><Link to="/student/assignments">Переглянути завдання <UiIcon name="arrow" size={16} /></Link></div>}
        <div className="sp-deadline-list">{deadlines.data?.items.slice(0, 3).map(item => { const date = assignmentDate(item.deadline)!; const days = assignmentDaysLeft(item.deadline)!; return <Link to={`/student/assignments/${encodeURIComponent(item.id)}`} className="sp-deadline" key={item.id}><time dateTime={date.toISOString()}><strong>{date.toLocaleDateString("uk-UA", { day: "2-digit" })}</strong><span>{date.toLocaleDateString("uk-UA", { month: "short" })}</span></time><div><h3>{item.title || "Практичне завдання"}</h3><p>{item.courseTitle} · {item.moduleTitle}</p></div><span className="sp-days">{days === 0 ? "Сьогодні" : `Днів: ${days}`}</span></Link>; })}</div>
      </section>
    </div>
  </div>;
}
