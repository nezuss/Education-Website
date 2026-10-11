import { getFeedbackReviewer } from "../../services/studentFeedbackPresentation";
import { useState } from "react";
import { Link } from "react-router-dom";
import UiIcon from "../../components/ui/Icon/UiIcon";
import { getEnrolledCourses } from "../../services/courseService";
import { getProfile } from "../../services/profileService";
import { getCourseStats } from "../../services/courseStatsService";
import { assignmentDate, getStudentAssignments } from "../../services/assignmentService";
import { getStudentSubmissions, submissionFileUrl, submissionGrade } from "../../services/submissionService";
import { getDashboardSubmissionSummary, selectDashboardAssignment } from "../../services/studentDashboardService";
import RequestError from "../shared/RequestError";
import useRemoteData from "../shared/useRemoteData";
import "../../styles/StudentHome.css";

async function loadDashboard() {
  const [enrolled, profile] = await Promise.allSettled([getEnrolledCourses(), getProfile()]);
  const courses = enrolled.status === "fulfilled" ? enrolled.value : undefined;
  const results = await Promise.allSettled((courses ?? []).map(course => getCourseStats(course.id)));
  const allStats = results.flatMap(result => result.status === "fulfilled" ? [result.value] : []);
  const errors = [enrolled, profile].flatMap(result => result.status === "rejected" ? [result.reason instanceof Error ? result.reason.message : "Дані поки недоступні."] : []);
  if (results.some(result => result.status === "rejected")) errors.push("Не вдалося завантажити частину статистики. Показано доступні дані.");
  return { courses, profile: profile.status === "fulfilled" ? profile.value : undefined, allStats, errors };
}

function CourseCover({ src }: { src: string }) {
  const [failed, setFailed] = useState(false);
  return failed ? <div className="sfd-cover-empty"><UiIcon name="courses" size={40} /><span>Обкладинка курсу недоступна</span></div>
    : <img src={src} alt="" onError={() => setFailed(true)} />;
}

function Tag({ children }: { children: string }) {
  return <span className="sfd-tag">[ {children} ]</span>;
}

function shortDate(value?: string) {
  const date = assignmentDate(value);
  return date ? new Intl.DateTimeFormat("uk-UA", { day: "numeric", month: "long" }).format(date) : "Не вказано";
}

export default function StudentDashboardPage() {
  const dashboard = useRemoteData(loadDashboard);
  const submissions = useRemoteData(getStudentSubmissions);
  const assignments = useRemoteData(getStudentAssignments);
  const summary = submissions.data ? getDashboardSubmissionSummary(submissions.data) : undefined;
  const task = assignments.data ? selectDashboardAssignment(assignments.data) : undefined;
  const { courses, profile, allStats = [] } = dashboard.data ?? {};
  const statisticsComplete = courses !== undefined && allStats.length === courses.length;
  const activeCourse = courses?.find(course => allStats.some(stats => stats.courceId === course.id && stats.progressPercentage < 100)) ?? courses?.[0];
  const activeCourseStats = allStats.find(stats => stats.courceId === activeCourse?.id);
  const progressVal = activeCourseStats ? Math.round(activeCourseStats.progressPercentage) : undefined;
  const coverUrl = submissionFileUrl(activeCourse?.bannerUrl);
  const latestFeedback = summary?.latestFeedback;
  const feedbackText = latestFeedback?.status === "NeedsRevision" ? latestFeedback.revisionMessage?.trim() || latestFeedback.feedback?.trim() : latestFeedback?.feedback?.trim() || latestFeedback?.revisionMessage?.trim();
  const grade = submissionGrade(latestFeedback?.rate, latestFeedback?.type);
  const submissionsUnavailable = !!submissions.error || (!!submissions.data && summary?.projects === undefined);
  const eventsUnavailable = submissionsUnavailable || (!!submissions.data?.length && !summary?.events.length);
  const pending = task?.assignment;
  const deadlinesUnavailable = !task || task.deadlinesUnavailable;
  const error = dashboard.error || dashboard.data?.errors.join(" ");
  const today = new Date();
  const formattedDate = new Intl.DateTimeFormat("uk-UA", { day: "numeric", month: "long", year: "numeric" }).format(today);

  return <div className="sfd">
    {error && <RequestError message={error} retry={dashboard.reload} />}
    {dashboard.loading && <p className="sfd-loading" role="status">Завантаження кабінету…</p>}
    <header className="sfd-greeting">
      <div><h1><UiIcon name="wave" size={64} /><span>Добрий день{profile?.username || profile?.name ? ", " + (profile.username || profile.name) : ""}</span></h1><p>Продовжуйте навчання та не пропустіть найближчі дедлайни.</p></div>
      <time className="sfd-date" dateTime={today.toISOString()}>{formattedDate}</time>
    </header>
    <div className="sfd-top">
      <section className="sfd-course" aria-label="Продовжити навчання">
        <div className="sfd-course-copy">
          <header><Tag>{activeCourse ? "ПРОДОВЖИТИ НАВЧАННЯ" : "ВІТАЄМО В NEXYLVA"}</Tag><h2 className="std-active-course-title">{activeCourse?.title || (dashboard.loading ? "Завантаження курсів…" : courses === undefined ? "Дані курсів поки недоступні" : "У вас поки немає активних курсів")}</h2></header>
          <p className="sfd-course-description">{activeCourse?.description || (activeCourse ? "Оберіть урок у програмі курсу, щоб продовжити навчання." : "Перегляньте свої курси або оберіть напрямок у каталозі.")}</p>
          {activeCourse && <div className="sfd-chips"><span>{activeCourseStats ? activeCourseStats.completedModules + " / " + activeCourseStats.totalModules + " модулів" : "Прогрес модулів недоступний"}</span><span>{activeCourseStats ? activeCourseStats.completedLessons + " / " + activeCourseStats.totalLessons + " уроків завершено" : "Завершені уроки поки недоступні"}</span></div>}
          {activeCourse && <div className="sfd-progress"><div><span>Ваш прогрес</span><span>{progressVal === undefined ? "Недоступний" : progressVal + "%"}</span></div><div className="sfd-progress-track" role={progressVal === undefined ? undefined : "progressbar"} aria-label="Прогрес курсу" aria-valuenow={progressVal} aria-valuemin={0} aria-valuemax={100}>{progressVal !== undefined && <div className="std-progress-bar-fill" style={{ width: progressVal + "%" }} />}</div></div>}
          {activeCourse ? <Link className="sfd-button" to={"/student/learning/" + activeCourse.id}>{activeCourseStats?.progressPercentage === 100 ? "Переглянути курс" : "Продовжити навчання"}<UiIcon name="arrow" size={16} /></Link>
            : courses === undefined ? <button className="sfd-button" type="button" disabled={dashboard.loading} onClick={dashboard.reload}>Оновити дані<UiIcon name="loading" size={16} /></button>
              : <Link className="sfd-button" to="/courses">Обрати курс у каталозі<UiIcon name="arrow" size={16} /></Link>}
        </div>
        <div className="sfd-cover">{coverUrl ? <CourseCover key={coverUrl} src={coverUrl} /> : <div className="sfd-cover-empty"><UiIcon name="courses" size={40} /><span>{dashboard.loading ? "Завантаження обкладинки…" : "Обкладинка курсу відсутня"}</span></div>}</div>
      </section>
      <section className="sfd-overview" aria-labelledby="sfd-overview-title"><header><Tag>ОГЛЯД</Tag><h2 id="sfd-overview-title">Навчання</h2></header>
        <div className="sfd-metrics">{[
          [statisticsComplete ? allStats.filter(item => item.progressPercentage < 100).length : undefined, "активні курси"],
          [statisticsComplete ? allStats.filter(item => item.progressPercentage >= 100).length : undefined, "завершені курси"],
          [summary?.projects, "проєкти здано"],
          [undefined, "сертифікати"],
        ].map(([value, label]) => <div className="sfd-metric" key={label}><strong className="std-stat-num" title={value === undefined ? "Дані поки недоступні" : undefined}>{value ?? "—"}</strong><span>{label}</span></div>)}</div>
        <div className="sfd-next-deadline"><p>Наступний дедлайн: <strong>{assignments.loading ? "Завантаження…" : deadlinesUnavailable ? "Недоступні" : pending?.deadline ? shortDate(pending.deadline) : "Не заплановано"}</strong></p>{pending ? <Link to={"/student/assignments/" + pending.id}>{pending.title || "Практичне завдання"}</Link> : <p>{deadlinesUnavailable ? "Оновіть дані завдань" : "Доступні завдання перевірено"}</p>}</div>
      </section>
    </div>
    <div className="sfd-middle">
      <section className="sfd-assignment" aria-labelledby="sfd-assignment-title"><header><Tag>ЗАВДАННЯ</Tag><h2 id="sfd-assignment-title">{pending?.title || (assignments.loading ? "Завантаження завдань…" : !assignments.data || courses === undefined || assignments.data.warnings.length ? "Дані завдань поки недоступні" : "Немає активних завдань")}</h2></header>
        <h3>{pending?.courseTitle || (activeCourse ? "Завдання курсу" : "Практичні завдання")}</h3>
        <p className="sfd-assignment-description">{pending?.description || (pending ? pending.moduleTitle + " / " + pending.lessonTitle : !assignments.data || assignments.data.warnings.length ? "Дані поки недоступні. Спробуйте оновити список завдань." : "У ваших курсах зараз немає практичних завдань, які потрібно надіслати.")}</p>
        <footer>{pending ? <Link to={"/student/assignments/" + pending.id}>Дедлайн: {shortDate(pending.deadline)}</Link> : <Link to="/student/assignments">Усі завдання<UiIcon name="arrow" size={16} /></Link>}{assignmentDate(pending?.createdAt) && <time className="sfd-date" dateTime={pending!.createdAt}>{shortDate(pending!.createdAt)}</time>}{(assignments.error || !!assignments.data?.warnings.length) && <button type="button" onClick={assignments.reload} disabled={assignments.loading}>Оновити дані</button>}</footer>
      </section>
      <section className="sfd-feedback" aria-labelledby="sfd-feedback-title"><header><Tag>{getFeedbackReviewer(latestFeedback).automatic ? "АВТОПЕРЕВІРКА" : "МЕНТОР"}</Tag><h2 id="sfd-feedback-title">Останній фідбек</h2></header>
        <p className="sfd-feedback-copy" role={submissions.loading ? "status" : undefined}>{submissions.loading ? "Завантаження відгуків…" : feedbackText || (submissionsUnavailable ? "Відгуки поки недоступні. Спробуйте оновити дані." : "Коментарів ментора ще немає.")}</p>
        <div className="sfd-feedback-meta"><span className="sfd-feedback-symbol"><UiIcon name="feedback" size={28} /></span><div>{latestFeedback ? <><Link to={"/student/submissions/" + latestFeedback.id}>{latestFeedback.status === "NeedsRevision" ? "Повернуто на доопрацювання" : latestFeedback.type === "Test" ? "Коментар до тесту" : "Коментар до проєкту"}<UiIcon name="arrow" size={16} /></Link><span>{grade !== undefined ? "Оцінка: " + grade + " / 12" : "Оцінку ще не виставлено"}</span></> : <Link to="/student/submissions">Мої роботи та результати перевірки<UiIcon name="arrow" size={16} /></Link>}</div>{submissionsUnavailable && <button type="button" onClick={submissions.reload}>Оновити</button>}</div>
      </section>
    </div>
    <div className="sfd-bottom">
      <section className="sfd-activity" aria-labelledby="sfd-activity-title"><header><Tag>АКТИВНІСТЬ</Tag><h2 id="sfd-activity-title">Останні події</h2></header>
        {summary?.events.length ? <ul>{summary.events.map(event => <li key={event.id}><span className="sfd-event-icon"><UiIcon name={event.kind === "submitted" ? "assignment" : "feedback"} size={28} /></span><div><Link to={"/student/submissions/" + event.submissionId}>{event.title}</Link><p title={event.description}>{event.description}</p></div><time dateTime={event.date}>{shortDate(event.date)}</time></li>)}</ul> : <p className="sfd-empty">{submissions.loading ? "Завантаження подій…" : eventsUnavailable ? "Дані подій поки недоступні." : "Ви ще не надсилали роботи."}</p>}
        <p className="sfd-history-note">Події робіт. Історія навчання поки недоступна.</p>
      </section>
      <section className="sfd-community"><header><Tag>СПІЛЬНОТА</Tag><h2>Покажіть свій прогрес</h2></header><p>Діліться проєктами, отримуйте реакції та дивіться роботи інших студентів.</p><Link className="sfd-button sfd-button-sand" to="/community"><UiIcon name="users" size={16} /><span>Перейти у спільноту</span><UiIcon name="arrow" size={16} /></Link></section>
      <div className="sfd-illustration" aria-hidden="true"><img src="/ui/dashboard-tree.png" alt="" width={412} height={315} /></div>
    </div>
  </div>;
}
