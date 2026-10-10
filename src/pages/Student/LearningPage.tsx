import { useCallback, useState } from "react";
import { Link, useParams } from "react-router-dom";
import UiIcon from "../../components/ui/Icon/UiIcon";
import { getCourse } from "../../services/courseService";
import { getModuleStats } from "../../services/courseStatsService";
import { getLessons, getMaterials, getModules, type Lesson, type Material } from "../../services/learningService";
import { submissionFileUrl } from "../../services/submissionService";
import LessonQuiz from "../shared/LessonQuiz";
import RequestError from "../shared/RequestError";
import useRemoteData from "../shared/useRemoteData";
import "../../styles/LessonPage.css";

function ordered<T extends { id: string }>(items: T[], ids?: string[]) {
  const position = (id: string) => { const index = ids?.indexOf(id) ?? -1; return index < 0 ? Number.MAX_SAFE_INTEGER : index; };
  return [...items].sort((a, b) => position(a.id) - position(b.id));
}

async function loadLesson(courseId?: string, lessonId?: string) {
  if (!lessonId) throw new Error("Урок не вказано. Оберіть його у програмі курсу.");
  if (!courseId) return { lesson: { id: lessonId, title: "Урок" } as Lesson, lessons: [] as Lesson[] };
  const course = await getCourse(courseId);
  const modules = ordered(await getModules(courseId), course.modules);
  const groups = await Promise.all(modules.map(async module => {
    try { return { module, lessons: ordered(await getLessons(module.id), module.lessonsId) }; }
    catch (reason) { return { module, lessons: [] as Lesson[], error: reason instanceof Error ? reason.message : "Не вдалося отримати уроки." }; }
  }));
  const group = groups.find(item => item.lessons.some(lesson => lesson.id === lessonId));
  if (!group) throw new Error(groups.some(item => item.error) ? "Не вдалося отримати повну програму курсу. Спробуйте ще раз." : "Урок не знайдено у цьому курсі.");
  return { course, module: group.module, moduleIndex: modules.indexOf(group.module), lesson: group.lessons.find(lesson => lesson.id === lessonId)!, lessons: group.lessons };
}

export default function LearningPage() {
  const { courseId, lessonId } = useParams();
  return <LessonView key={`${courseId ?? ""}/${lessonId ?? ""}`} courseId={courseId} lessonId={lessonId} />;
}

function LessonView({ courseId, lessonId }: { courseId?: string; lessonId?: string }) {
  const load = useCallback(() => loadLesson(courseId, lessonId), [courseId, lessonId]);
  const remote = useRemoteData(load);
  const data = remote.data;
  const createdAt = data?.lesson.createdAt ? new Date(data.lesson.createdAt) : undefined;
  const validDate = createdAt && Number.isFinite(createdAt.getTime()) && createdAt.getFullYear() >= 1970;
  const lessonPath = (id: string) => courseId ? `/student/learning/${encodeURIComponent(courseId)}/lesson/${encodeURIComponent(id)}` : `/student/lesson/${encodeURIComponent(id)}`;
  const coursePath = courseId ? `/student/learning/${encodeURIComponent(courseId)}` : "/student/courses";
  return <div className="lesson-page">
    <nav className="lp-breadcrumbs" aria-label="Навігаційний шлях"><Link to="/student">Головна</Link><UiIcon name="chevron" /><Link to="/student/courses">Мої курси</Link><UiIcon name="chevron" />{courseId && <><Link to={coursePath}>{data?.course?.title ?? "Програма курсу"}</Link><UiIcon name="chevron" /></>}<span>{data?.lesson.title ?? "Урок"}</span></nav>
    {remote.loading && <div className="lp-empty" role="status"><UiIcon name="loading" size={32} /><p>Завантаження уроку…</p></div>}
    {remote.error && <RequestError message={remote.error} retry={remote.reload} />}
    {data && <>
      <header className="lp-heading"><div className="lp-heading-meta"><span className="lp-tag">{data.lessons.length ? `Урок ${String(data.lessons.findIndex(item => item.id === lessonId) + 1).padStart(2, "0")}` : "Урок"}</span>{validDate && <time dateTime={data.lesson.createdAt} title="Дата створення уроку">{createdAt.toLocaleDateString("uk-UA", { day: "numeric", month: "long", year: "numeric" })}</time>}</div><h1>{data.lesson.title}</h1>{data.lesson.description && <p>{data.lesson.description}</p>}</header>
      <LessonContent key={data.lesson.id} lesson={data.lesson} lessons={data.lessons} module={data.module} moduleIndex={data.moduleIndex} courseId={courseId} courseTitle={data.course?.title} lessonPath={lessonPath} />
    </>}
  </div>;
}

type LessonContentProps = Pick<Awaited<ReturnType<typeof loadLesson>>, "lesson" | "lessons" | "module" | "moduleIndex"> & { courseId?: string; courseTitle?: string; lessonPath: (id: string) => string };

function LessonContent({ lesson, lessons, module, moduleIndex, courseId, courseTitle, lessonPath }: LessonContentProps) {
  const [progressAttempt, setProgressAttempt] = useState(0);
  const load = useCallback(() => getMaterials(lesson.id), [lesson.id]);
  const remote = useRemoteData(load);
  const materials = remote.data;
  const videos = materials?.filter(material => material.type === "Video");
  const texts = materials?.filter(material => material.type === "Text");
  const resources = materials?.filter(material => !["Video", "Text", "Test", "Assignment"].includes(material.type));
  const assignments = materials?.filter(material => material.type === "Assignment");
  return <div className="lp-grid">
    <div className="lp-main">
      <section className="lp-media" aria-label="Відео уроку">
        {remote.loading && <div className="lp-media-empty" role="status"><UiIcon name="loading" size={32} /><p>Завантаження матеріалів…</p></div>}
        {remote.error && <div className="lp-media-empty"><RequestError message={remote.error} retry={remote.reload} /></div>}
        {materials && (videos?.length ? videos.map(video => <LessonVideo key={video.id} material={video} />) : <div className="lp-media-empty"><UiIcon name="courses" size={40} /><h2>Відео ще не додано</h2><p>Доступні матеріали й тести розміщено нижче.</p></div>)}
      </section>
      <section className="lp-discussion" aria-labelledby="lesson-discussion"><span className="lp-tag">Обговорення уроку</span><h2 id="lesson-discussion">Запитання та обговорення</h2><p>Обговорюйте матеріал уроку з ментором та студентами.</p><label htmlFor={`question-${lesson.id}`} className="lp-question-label">Ваше запитання</label><textarea id={`question-${lesson.id}`} placeholder="Поставити запитання про матеріал уроку…" disabled /><div className="lp-discussion-action"><span>Обговорення поки недоступне.</span><button type="button" disabled>Надіслати<UiIcon name="arrow" /></button></div></section>
      <section className="lp-card lp-about"><span className="lp-tag">Про цей урок</span><h2>{lesson.title}</h2>{texts?.length ? texts.map(material => <div key={material.id} className="lp-text-material">{material.title && <h3>{material.title}</h3>}<p>{material.content || material.description || "Текст матеріалу ще не додано."}</p></div>) : <p>{lesson.description || "Додатковий опис уроку ще не додано."}</p>}</section>
      {materials?.filter(material => material.type === "Test").map(material => <LessonQuiz key={material.id} material={material} onSubmitted={() => setProgressAttempt(value => value + 1)} />)}
      <section className="lp-card lp-resources"><span className="lp-tag">Матеріали до уроку</span><h2>Корисні файли та посилання</h2>{remote.loading && <p role="status">Завантаження матеріалів…</p>}{remote.error && <p>Матеріали недоступні. Спробуйте завантажити їх ще раз вище.</p>}{resources?.length ? <ul>{resources.map(material => <LessonResource key={material.id} material={material} />)}</ul> : materials && <p>Файли та посилання до цього уроку ще не додано.</p>}</section>
    </div>
    <aside className="lp-aside" aria-label="Модуль і завдання">
      {module && <section className="lp-card lp-module"><header><span className="lp-tag">Модуль {String((moduleIndex ?? 0) + 1).padStart(2, "0")}</span><h2>{module.title}</h2>{module.description && <p>{module.description}</p>}<span className="lp-module-count">{lessons.length} {new Intl.PluralRules("uk-UA").select(lessons.length) === "one" ? "урок" : new Intl.PluralRules("uk-UA").select(lessons.length) === "few" ? "уроки" : "уроків"}</span></header><ol>{lessons.map((item, index) => <li key={item.id}><Link to={lessonPath(item.id)} aria-current={item.id === lesson.id ? "page" : undefined}><span className="lp-lesson-title"><span className="lp-lesson-number">{index + 1}</span><strong>{item.title}</strong></span><span className="lp-lesson-description">{item.id === lesson.id ? "Поточний урок" : item.description || "Матеріали уроку"}</span><span className="lp-lesson-action">{item.id === lesson.id ? "Відкрито" : "Перейти до уроку"}</span></Link></li>)}</ol></section>}
      <ModuleProgress key={`${module?.id ?? lesson.id}/${progressAttempt}`} moduleId={module?.id} moduleIndex={moduleIndex} lessons={lessons} activeLessonId={lesson.id} lessonPath={lessonPath} />
      {assignments?.length ? assignments.map(material => <section key={material.id} className="lp-card lp-assignment"><span className="lp-tag">Після уроку</span><h2>{material.title || "Практичне завдання"}</h2>{material.description && <p>{material.description}</p>}{material.deadline && Number.isFinite(Date.parse(material.deadline)) && <div className="lp-deadline"><span>Дедлайн</span><time dateTime={material.deadline}>{new Date(material.deadline).toLocaleDateString("uk-UA")}</time></div>}<img src="/courses/curator-character.webp" alt="" /><Link className="lp-button" to={`/student/assignments/${encodeURIComponent(material.id)}`} state={{ courseId, courseTitle, assignmentTitle: material.title, description: material.description, deadline: material.deadline }}>Перейти до завдання<UiIcon name="arrow" /></Link></section>) : materials && <section className="lp-card lp-assignment"><span className="lp-tag">Після уроку</span><h2>Практичне завдання</h2><p>Практичне завдання до цього уроку ще не додано.</p></section>}
    </aside>
  </div>;
}

function ModuleProgress({ moduleId, moduleIndex, lessons, activeLessonId, lessonPath }: { moduleId?: string; moduleIndex?: number; lessons: Lesson[]; activeLessonId: string; lessonPath: (id: string) => string }) {
  const load = useCallback(async () => ({ stats: moduleId ? await getModuleStats(moduleId) : undefined }), [moduleId]);
  const remote = useRemoteData(load);
  const stats = remote.data?.stats;
  const progress = stats?.progressPercentage;
  const knownProgress = typeof progress === "number" && Number.isFinite(progress) && progress >= 0 && progress <= 100;
  const index = lessons.findIndex(lesson => lesson.id === activeLessonId);
  const previous = index > 0 ? lessons[index - 1] : undefined;
  const next = index >= 0 ? lessons[index + 1] : undefined;
  return <section className="lp-card lp-progress"><span className="lp-tag">Прогрес модуля</span><h2>{moduleId ? `Модуль ${(moduleIndex ?? 0) + 1}` : "Прогрес"}</h2>{remote.loading && <p role="status">Завантаження прогресу…</p>}{remote.error && <RequestError message={remote.error} retry={remote.reload} />}{knownProgress ? <><div className="lp-progress-label"><span>{stats?.completedLessons} із {stats?.totalLessons} уроків завершено</span><strong>{Math.round(progress)}%</strong></div><progress max={100} value={progress} aria-label="Прогрес модуля" /></> : !remote.loading && !remote.error && <p>Прогрес поки недоступний.</p>}<button type="button" className="lp-button" disabled>Завершити урок</button><p className="lp-disabled-note">Позначення уроку завершеним поки недоступне.</p><nav aria-label="Перехід між уроками" className="lp-lesson-navigation">{previous ? <Link to={lessonPath(previous.id)}><UiIcon name="left" />Попередній</Link> : <button type="button" disabled><UiIcon name="left" />Попередній</button>}{next ? <Link to={lessonPath(next.id)}>Наступний<UiIcon name="arrow" /></Link> : <button type="button" disabled>Наступний<UiIcon name="arrow" /></button>}</nav></section>;
}

function LessonVideo({ material }: { material: Material }) {
  const url = submissionFileUrl(material.videoUrl || material.url);
  if (!url) return <div className="lp-media-empty"><p>Посилання на відео недоступне.</p></div>;
  const parsed = new URL(url);
  const youtubeId = ["www.youtube.com", "youtube.com", "m.youtube.com", "youtu.be"].includes(parsed.hostname) ? parsed.hostname === "youtu.be" ? parsed.pathname.slice(1) : parsed.searchParams.get("v") || parsed.pathname.match(/^\/(?:embed|shorts)\/([^/]+)/)?.[1] : undefined;
  if (youtubeId && /^[\w-]{11}$/.test(youtubeId)) return <iframe src={`https://www.youtube-nocookie.com/embed/${youtubeId}`} title={material.title || "Відео уроку"} allow="fullscreen; picture-in-picture" allowFullScreen />;
  if (/\.(mp4|webm|ogg|m4v)$/i.test(parsed.pathname)) return <video controls preload="metadata" src={url} aria-label={material.title || "Відео уроку"}>Ваш браузер не підтримує відео. <a href={url}>Відкрити відео</a></video>;
  return <div className="lp-media-empty"><h2>{material.title || "Відео уроку"}</h2><p>Перегляньте відео за посиланням.</p><a className="lp-button" href={url} target="_blank" rel="noreferrer">Відкрити відео<UiIcon name="external" /></a></div>;
}

function LessonResource({ material }: { material: Material }) {
  const url = submissionFileUrl(material.type === "File" ? material.fileUrl : material.type === "Photo" ? material.photoUrl : material.linkUrl || material.url);
  const [imageFailed, setImageFailed] = useState(false);
  const label = material.title || (material.type === "File" ? "Файл уроку" : material.type === "Photo" ? "Зображення уроку" : "Ресурс уроку");
  return <li>{material.type === "Photo" && url && !imageFailed && <img src={url} alt={label} onError={() => setImageFailed(true)} loading="lazy" />}{url ? <a href={url} target="_blank" rel="noreferrer"><UiIcon name={material.type === "Link" ? "external" : "file"} size={28} /><span><strong>{label}</strong>{material.description && <span>{material.description}</span>}{imageFailed && <span>Не вдалося завантажити зображення.</span>}</span><UiIcon name={material.type === "File" ? "download" : "external"} /></a> : <div className="lp-resource-unavailable"><UiIcon name="file" size={28} /><span><strong>{label}</strong><span>Посилання на матеріал недоступне.</span></span></div>}</li>;
}
