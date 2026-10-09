import { useState } from "react";
import { Link } from "react-router-dom";
import UiIcon from "../../components/ui/Icon/UiIcon";
import { getEnrolledCourses } from "../../services/courseService";
import { getCourseStats, type CourseStats } from "../../services/courseStatsService";
import type { Course } from "../../types/course";
import useRemoteData from "../shared/useRemoteData";
import RequestError from "../shared/RequestError";
import "../../styles/MyCourses.css";

async function loadCourses() {
  const courses = await getEnrolledCourses();
  const results = await Promise.allSettled(courses.map(course => getCourseStats(course.id)));
  const stats: Record<string, CourseStats> = {};
  const failed: string[] = [];
  results.forEach((result, index) => {
    if (result.status === "fulfilled") stats[courses[index].id] = result.value;
    else failed.push(courses[index].title);
  });
  return { courses, stats, failed };
}

function progressOf(stats?: CourseStats) {
  const value = stats?.progressPercentage;
  return typeof value === "number" && Number.isFinite(value) && value >= 0 && value <= 100 ? value : undefined;
}

function Progress({ value }: { value?: number }) {
  return <div className="mc-progress"><div><span>Ваш прогрес</span><strong>{value === undefined ? "Недоступний" : `${Math.round(value)}%`}</strong></div>{value !== undefined && <progress aria-label="Прогрес курсу" max={100} value={value} />}</div>;
}

function CourseImage({ course }: { course: Course }) {
  const [failed, setFailed] = useState(false);
  return course.bannerUrl && !failed ? <img src={course.bannerUrl} alt="" onError={() => setFailed(true)} /> : <div className="mc-image-empty"><UiIcon name="courses" size={48} /><span>Обкладинка курсу відсутня</span></div>;
}

export default function MyCoursesPage() {
  const remote = useRemoteData(loadCourses);
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("default");
  const courses = remote.data?.courses ?? [];
  const stats = remote.data?.stats ?? {};
  const featured = courses.find(course => { const value = progressOf(stats[course.id]); return value !== undefined && value < 100; }) ?? courses[0];
  const filtered = courses.filter(course => {
    const progress = progressOf(stats[course.id]);
    return course.title.toLocaleLowerCase("uk-UA").includes(search.trim().toLocaleLowerCase("uk-UA")) &&
      (filter === "all" || progress !== undefined && (filter === "active" ? progress < 100 : progress >= 100));
  }).sort((a, b) => {
    if (sort === "title") return a.title.localeCompare(b.title, "uk");
    if (sort === "progress") return (progressOf(stats[b.id]) ?? -1) - (progressOf(stats[a.id]) ?? -1);
    return 0;
  });
  const featuredProgress = featured ? progressOf(stats[featured.id]) : undefined;
  return <div className="my-courses">
    <nav className="mc-breadcrumbs" aria-label="Навігаційний шлях"><Link to="/student">Головна</Link><UiIcon name="chevron" /><span>Мої курси</span></nav>
    <section className="mc-heading">
      <header><div><h1>Мої курси</h1><p>Продовжуйте активні курси, переглядайте завершені та слідкуйте за прогресом.</p></div><time dateTime={new Date().toISOString()}>{new Intl.DateTimeFormat("uk-UA", { day: "numeric", month: "long", year: "numeric" }).format(new Date())}</time></header>
      <div className="mc-toolbar"><div className="mc-filters" role="group" aria-label="Статус курсів">{([['all', 'Усі'], ['active', 'Активні'], ['completed', 'Завершені']] as const).map(([key, label]) => <button key={key} type="button" aria-pressed={filter === key} onClick={() => setFilter(key)}>{label}</button>)}</div><div className="mc-controls"><label className="mc-search"><UiIcon name="search" size={22} /><input aria-label="Знайти курс" placeholder="Знайти курс…" value={search} onChange={event => setSearch(event.target.value)} /></label><select aria-label="Сортувати курси" value={sort} onChange={event => setSort(event.target.value)}><option value="default">Сортувати</option><option value="title">За назвою</option><option value="progress">За прогресом</option></select></div></div>
    </section>
    {remote.loading && <p className="mc-empty" role="status">Завантаження курсів…</p>}
    {remote.error && <RequestError message={remote.error} retry={remote.reload} />}
    {!!remote.data?.failed.length && <RequestError message={`Прогрес недоступний для курсів: ${remote.data.failed.join(", ")}. Вони залишаються у списку «Усі».`} retry={remote.reload} />}
    {featured && <section className="mc-featured" aria-label="Продовжити навчання"><article className="mc-featured-course"><div className="mc-featured-copy"><span className="mc-tag">Продовжити навчання</span><h2>{featured.title}</h2><p>{featured.description}</p><Progress value={featuredProgress} /><Link className="mc-button" to={`/student/learning/${featured.id}`}>{featuredProgress === 100 ? "Переглянути курс" : "Продовжити навчання"}<UiIcon name="arrow" /></Link></div><div className="mc-featured-image"><CourseImage key={featured.id} course={featured} />{featured.direction && <span className="mc-tag">{featured.direction}</span>}</div></article><aside className="mc-next"><span className="mc-tag">Наступне</span><h2>Що далі?</h2><h3>{featured.title}</h3><p>Відкрийте програму курсу та оберіть урок для навчання.</p><div className="mc-deadline"><span>Дедлайн</span><span>Не вказано</span></div><Link className="mc-button" to={`/student/learning/${featured.id}`}>Переглянути програму<UiIcon name="arrow" /></Link></aside></section>}
    {remote.data && <section className="mc-list"><h2>{filter === "all" ? "Усі мої курси" : filter === "active" ? "Активні курси" : "Завершені курси"}</h2>{filtered.length ? <div className="mc-cards">{filtered.map(course => {
      const value = progressOf(stats[course.id]);
      const completed = value === 100;
      const courseStats = stats[course.id];
      return <article className="mc-course" key={course.id}><div className="mc-cover"><CourseImage course={course} /><span className="mc-course-status">{value === undefined ? "Прогрес недоступний" : completed ? "Завершено" : "Активний"}</span></div><div className="mc-course-copy"><h3>{course.title}</h3><p>{course.description}</p><Progress value={value} /><footer><Link to={`/student/learning/${course.id}`}>{completed ? "Переглянути курс" : "Продовжити"}<UiIcon name="arrow" /></Link>{Number.isFinite(courseStats?.completedModules) && Number.isFinite(courseStats?.totalModules) && <span>{courseStats.completedModules} / {courseStats.totalModules} модулів</span>}</footer></div></article>;
    })}</div> : <div className="mc-empty" role="status"><h3>{courses.length ? "Курсів за цими умовами не знайдено" : "У вас поки немає курсів"}</h3><p>{courses.length ? "Змініть пошук або виберіть інший статус." : "Перегляньте каталог та оберіть напрямок навчання."}</p>{courses.length ? <button className="mc-button" onClick={() => { setSearch(""); setFilter("all"); }}>Скинути фільтри</button> : <Link className="mc-button" to="/courses">Переглянути каталог<UiIcon name="arrow" /></Link>}</div>}</section>}
  </div>;
}
