import { useCallback, type CSSProperties, type ReactNode } from "react";
import { Link } from "react-router-dom";
import UiIcon from "../../components/ui/Icon/UiIcon";
import { getProfile } from "../../services/profileService";
import { getMentorCourses, getMentorSubmissions, type MentorCourse, type MentorSubmission } from "../../services/mentorService";
import { getMentorDashboardCourseNames } from "../../services/mentorDashboardCourseService";
import { getMentorQueueContexts } from "../../services/mentorQueueContextService";
import { currentFeedbackState } from "../../services/studentFeedbackPresentation";
import { assignmentDate } from "../../services/assignmentService";
import useRemoteData from "../shared/useRemoteData";
import RequestError from "../shared/RequestError";
import "../../styles/MentorDashboard.css";

function EmptyPanel({ title, children }: { title: string; children: ReactNode }) {
  return <div className="mentor-dashboard-empty"><UiIcon name="assignment" size={32} /><h3>{title}</h3><p>{children}</p></div>;
}

export default function MentorDashboardPage() {
  const profile = useRemoteData(getProfile);
  const courses = useRemoteData(getMentorCourses);
  const submissions = useRemoteData(getMentorSubmissions);
  const loadCourseNames = useCallback(() => courses.data?.length && profile.data
    ? getMentorDashboardCourseNames(courses.data, profile.data) : Promise.resolve(undefined), [courses.data, profile.data]);
  const courseNames = useRemoteData(loadCourseNames);
  const loadContext = useCallback(() => submissions.data?.length && profile.data
    ? getMentorQueueContexts(submissions.data, profile.data) : Promise.resolve(undefined), [submissions.data, profile.data]);
  const learning = useRemoteData(loadContext);
  const contexts = learning.data?.contexts;
  const contextLoading = !!submissions.data?.length && (profile.loading || learning.loading);
  const contextUnavailable = !!submissions.data?.length && !contextLoading && (learning.error || learning.data?.unavailable || !learning.data);
  const namesLoading = !!courses.data?.length && (profile.loading || courseNames.loading);
  const namesUnavailable = !!courses.data?.length && !namesLoading && (courseNames.error || courseNames.data?.unavailable || !courseNames.data);
  const ordered = submissions.data ? [...submissions.data].sort(compareSubmitted) : undefined;
  const unknownCount = submissions.data?.filter(item => currentFeedbackState(item).key === "unknown").length;
  const reviewed = submissions.data && unknownCount === 0 ? submissions.data.filter(item => currentFeedbackState(item).key === "reviewed").length : undefined;
  const pending = ordered?.filter(item => ["new", "in-review"].includes(currentFeedbackState(item).key));
  const pendingCount = pending && unknownCount === 0 ? pending.length : undefined;
  const students = ordered ? [...new Map(ordered.filter(item => nonblank(item.student.id)).map(item => [item.student.id, item.student])).values()] : undefined;
  const studentIdentitiesUnavailable = submissions.data?.some(item => !nonblank(item.student.id));
  const availableFeedback = ordered?.find(item => nonblank(item.feedback));
  const percent = submissions.data?.length && reviewed !== undefined ? Math.round(reviewed / submissions.data.length * 100) : undefined;
  const metrics = [
    { label: "робіт без оцінки", value: courseTotal(courses.data, "notRatedSubmissionsCount") },
    { label: "мої курси", value: validCourseIds(courses.data) ? courses.data!.length : undefined },
    { label: "перевірено робіт", value: reviewed },
  ];
  const date = new Date().toLocaleDateString("uk-UA", { day: "numeric", month: "long", year: "numeric" });

  return <div className="mentor-dashboard">
    <header className="mentor-dashboard-header">
      <div><h1><UiIcon name="wave" size={64} />Добрий день{nonblank(profile.data?.username) ? `, ${profile.data!.username!.trim()}` : ""}</h1><p>Ось що потребує вашої уваги сьогодні.</p></div>
      <time dateTime={new Date().toISOString().slice(0, 10)}>{date}</time>
    </header>
    {profile.error && <RequestError message={profile.error} retry={profile.reload} />}
    <section className="mentor-dashboard-overview" aria-labelledby="mentor-overview-title">
      <div className="mentor-dashboard-overview-top">
        <div><h2 id="mentor-overview-title">Огляд роботи ментора</h2><p>Курси, перевірки та надіслані роботи ваших студентів.</p></div>
        <div className="mentor-dashboard-completion"><div className={`mentor-dashboard-ring${percent === undefined ? " is-unavailable" : ""}`} style={percent === undefined ? undefined : { "--review-percent": `${percent}%` } as CSSProperties} aria-label={percent === undefined ? "Частка перевірених робіт недоступна" : `Перевірено ${percent}% надісланих робіт`}><span>{percent === undefined ? "Дані поки недоступні" : `${percent}%`}</span></div></div>
      </div>
      <dl className="mentor-dashboard-metrics">
        {metrics.map(metric => <div key={metric.label}><dt>{metric.label}</dt><dd className={metric.value === undefined ? "mentor-dashboard-unavailable" : ""}>{metric.value ?? "Дані поки недоступні"}</dd></div>)}
      </dl>
    </section>

    <section className="mentor-dashboard-section" aria-labelledby="mentor-pending-title">
      <div className="mentor-dashboard-section-heading"><h2 id="mentor-pending-title">На перевірці</h2><Link to="/mentor/submissions">Усі роботи <UiIcon name="arrow" /></Link></div>
      <div className="mentor-dashboard-review-grid">
        <div className="mentor-dashboard-panel">
          <div className="mentor-dashboard-panel-heading"><h3>Нові роботи студентів</h3><span>{pendingCount === undefined ? "Дані поки недоступні" : `${pendingCount} на перевірку`}</span></div>
          {submissions.loading && <p className="mentor-dashboard-loading" role="status">Завантаження робіт…</p>}{submissions.error && <RequestError message={submissions.error} retry={submissions.reload} />}
          {pending?.slice(0, 3).map((item, index) => {
            const state = currentFeedbackState(item);
            const context = contexts?.get(item.relatedMaterialId.trim());
            const submitted = assignmentDate(item.submittedAt ?? undefined);
            return <article className="mentor-dashboard-work" key={item.id}>
            <span className="mentor-dashboard-work-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
            <div className="mentor-dashboard-work-info"><h4>{studentName(item.student)}</h4><p>{context?.materialTitle || materialLabel(item)}</p><small>Надіслано: {submitted ? <time dateTime={item.submittedAt!}>{submitted.toLocaleString("uk-UA", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" })}</time> : "Дані поки недоступні"}</small></div>
            <span className={`mentor-dashboard-status ${state.key}`}>{state.key === "new" ? "Нова робота" : state.label}</span>
            <div className="mentor-dashboard-work-context">{context ? <><p>{context.courseTitle}</p><small>{context.moduleTitle}</small></> : <small>{contextLoading ? "Завантаження даних…" : "Дані поки недоступні"}</small>}</div>
            <Link to={`/mentor/review/${encodeURIComponent(item.id)}`} className="mentor-dashboard-button" aria-label={`${state.key === "in-review" ? "Продовжити" : "Перевірити"}: ${studentName(item.student)}, ${context?.materialTitle || materialLabel(item)}`}>{state.key === "in-review" ? "Продовжити" : "Перевірити"} <UiIcon name="arrow" /></Link>
          </article>; })}
          {pending?.length === 0 && <EmptyPanel title={unknownCount ? "Дані поки недоступні" : "Робіт на перевірку немає"}>{unknownCount ? `У ${unknownCount} робіт статус поки недоступний. Перегляньте їх у черзі «Усі роботи».` : "Нові роботи студентів з’являться тут після надсилання."}</EmptyPanel>}
          {!!unknownCount && !!pending?.length && <p className="mentor-dashboard-note">У {unknownCount} робіт статус поки недоступний. Тут показані лише роботи з підтвердженим статусом очікування перевірки.</p>}
        </div>
        <aside className="mentor-dashboard-panel"><div className="mentor-dashboard-panel-heading"><h3>Найближчі дедлайни</h3></div><EmptyPanel title="Дані поки недоступні">Тут відображатимуться найближчі терміни здачі робіт.</EmptyPanel></aside>
      </div>
    </section>

    <section className="mentor-dashboard-section" aria-labelledby="mentor-students-title">
      <div className="mentor-dashboard-section-heading"><div><h2 id="mentor-students-title">Студенти</h2><p>Студенти, які надіслали вам роботи.</p></div></div>
      {submissions.loading && <p className="mentor-dashboard-loading" role="status">Завантаження студентів…</p>}{submissions.error && <RequestError message={submissions.error} retry={submissions.reload} />}
      <div className="mentor-dashboard-students">
        {students?.slice(0, 3).map(student => {
          const works = submissions.data!.filter(item => item.student.id === student.id);
          const awaiting = works.some(item => currentFeedbackState(item).key === "unknown") ? undefined : works.filter(item => ["new", "in-review"].includes(currentFeedbackState(item).key)).length;
          const titles = [...new Set(works.map(item => contexts?.get(item.relatedMaterialId.trim())?.courseTitle).filter(Boolean))];
          return <article className="mentor-dashboard-student" key={student.id}><div className="mentor-dashboard-student-identity"><span className="mentor-dashboard-avatar" aria-hidden="true"><UiIcon name="person" size={28} /></span><div><h3>{studentName(student)}</h3>{nonblank(student.email) && <p>{student.email.trim()}</p>}<p>{titles.length ? titles.join(" · ") : contextLoading ? "Завантаження даних…" : "Дані поки недоступні"}</p></div></div><p className="mentor-dashboard-student-progress">Прогрес навчання: Дані поки недоступні</p><div className="mentor-dashboard-student-footer"><span>Надіслано робіт: {works.length}</span><strong>Очікують перевірки: {awaiting ?? "Дані поки недоступні"}</strong></div></article>;
        })}
        {students?.length === 0 && <div className="mentor-dashboard-panel mentor-dashboard-wide"><EmptyPanel title={submissions.data?.length ? "Дані поки недоступні" : "Надісланих робіт ще немає"}>{submissions.data?.length ? "Не вдалося визначити студентів надісланих робіт." : "Інформація про студентів з’явиться після першого надсилання роботи на вашому курсі."}</EmptyPanel></div>}
      </div>
      {studentIdentitiesUnavailable && <p className="mentor-dashboard-note">Частина даних про студентів: Дані поки недоступні.</p>}
    </section>

    {contextUnavailable && <div className="mentor-dashboard-note" role="status"><p>Частина даних про курси або назви робіт: Дані поки недоступні.</p><button type="button" onClick={profile.error ? profile.reload : learning.reload}>Оновити дані робіт</button></div>}

    <div className="mentor-dashboard-bottom-grid">
      <section className="mentor-dashboard-feedback" aria-labelledby="mentor-feedback-title"><span className="mentor-dashboard-tag">[ FEEDBACK ]</span><h2 id="mentor-feedback-title">Доступний коментар до роботи</h2>
        {submissions.loading ? <p role="status">Завантаження коментаря…</p> : submissions.error ? <RequestError message={submissions.error} retry={submissions.reload} /> : availableFeedback ? <><blockquote>{availableFeedback.feedback!.trim()}</blockquote><div className="mentor-dashboard-feedback-footer"><p>Студент: {studentName(availableFeedback.student)}</p><Link className="mentor-dashboard-button" to={`/mentor/review/${encodeURIComponent(availableFeedback.id)}`}>Переглянути роботу <UiIcon name="arrow" /></Link></div></> : <p>Дані поки недоступні. Коментарів у надісланих роботах ще немає.</p>}
      </section>
      <section className="mentor-dashboard-schedule" aria-labelledby="mentor-schedule-title"><span className="mentor-dashboard-tag">[ СЬОГОДНІ ]</span><h2 id="mentor-schedule-title">Розклад</h2><p>Дані поки недоступні.</p></section>
    </div>

    <section className="mentor-dashboard-section" aria-labelledby="mentor-courses-title"><div className="mentor-dashboard-section-heading"><h2 id="mentor-courses-title">Мої курси</h2></div>
      {courses.loading && <p className="mentor-dashboard-loading" role="status">Завантаження курсів…</p>}{courses.error && <RequestError message={courses.error} retry={courses.reload} />}
      <div className="mentor-dashboard-courses">{courses.data?.map((course, index) => {
        const id = nonblank(course?.courceId);
        const title = id ? courseNames.data?.names.get(id) : undefined;
        return <article className="mentor-dashboard-course" key={`${id || "unavailable"}-${index}`}><UiIcon name="courses" size={28} /><h3>{id ? <Link to={`/courses/${encodeURIComponent(id)}`}>{title || (namesLoading ? "Завантаження назви…" : "Дані поки недоступні")}</Link> : "Дані поки недоступні"}</h3><p>Студентів: {counter(course?.studentsCount) ?? "Дані поки недоступні"} · Робіт без оцінки: {counter(course?.notRatedSubmissionsCount) ?? "Дані поки недоступні"}</p>{id ? <Link to={`/courses/${encodeURIComponent(id)}`} className="mentor-dashboard-course-link">Переглянути курс <UiIcon name="arrow" /></Link> : <button type="button" className="mentor-dashboard-course-link" disabled>Переглянути курс</button>}</article>;
      })}
      {courses.data?.length === 0 && <div className="mentor-dashboard-panel mentor-dashboard-wide"><EmptyPanel title="Вам ще не призначено курси">Після призначення курсу тут з’являться його студенти та роботи на перевірку.</EmptyPanel></div>}</div>
    </section>
    {namesUnavailable && <div className="mentor-dashboard-note" role="status"><p>Назви частини призначених курсів: Дані поки недоступні.</p><button type="button" onClick={profile.error ? profile.reload : courseNames.reload}>Оновити назви курсів</button></div>}
  </div>;
}

function nonblank(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function studentName(student: MentorSubmission["student"]) {
  const name = nonblank(student.username);
  return name && name !== "Unknown" ? name : "Дані поки недоступні";
}

function materialLabel(item: MentorSubmission) {
  return item.type === "Test" ? "Тестування" : item.type === "Assignment" ? "Практична робота" : "Навчальна робота";
}

function compareSubmitted(left: MentorSubmission, right: MentorSubmission) {
  const a = assignmentDate(left.submittedAt ?? undefined)?.getTime();
  const b = assignmentDate(right.submittedAt ?? undefined)?.getTime();
  if (a === undefined || b === undefined) return a === b ? left.id.localeCompare(right.id) : a === undefined ? 1 : -1;
  return b - a || left.id.localeCompare(right.id);
}

function counter(value: unknown): number | undefined {
  return typeof value === "number" && Number.isSafeInteger(value) && value >= 0 ? value : undefined;
}

function validCourseIds(courses?: MentorCourse[]) {
  return !!courses && courses.every(course => nonblank(course?.courceId)) && new Set(courses.map(course => course.courceId.trim())).size === courses.length;
}

function courseTotal(courses: MentorCourse[] | undefined, key: "notRatedSubmissionsCount") {
  if (!validCourseIds(courses) || courses!.some(course => counter(course[key]) === undefined)) return undefined;
  return counter(courses!.reduce((sum, course) => sum + course[key], 0));
}
