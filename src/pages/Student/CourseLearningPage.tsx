import { useCallback, type ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import UiIcon from "../../components/ui/Icon/UiIcon";
import { getCourse } from "../../services/courseService";
import { getCourseStats, getModuleStats, type ModuleStats } from "../../services/courseStatsService";
import { getLessons, getMaterials, getModules, type Lesson, type Material, type Module } from "../../services/learningService";
import { submissionFileUrl } from "../../services/submissionService";
import RequestError from "../shared/RequestError";
import useRemoteData from "../shared/useRemoteData";
import "../../styles/CourseLearningOverview.css";

type LearningModule = Module & { lessons?: Lesson[]; lessonsError?: string; stats?: ModuleStats; statsError?: string };

function errorMessage(result: PromiseRejectedResult) {
  return result.reason instanceof Error ? result.reason.message : "Не вдалося отримати дані.";
}

function percentage(value?: number) {
  return typeof value === "number" && Number.isFinite(value) && value >= 0 && value <= 100 ? value : undefined;
}

function countLabel(value: number, one: string, few: string, many: string) {
  const form = new Intl.PluralRules("uk-UA").select(value);
  return `${value} ${form === "one" ? one : form === "few" ? few : many}`;
}

async function loadCourse(courseId: string) {
  const [courseResult, modulesResult, statsResult] = await Promise.allSettled([
    getCourse(courseId), getModules(courseId), getCourseStats(courseId),
  ]);
  if (courseResult.status === "rejected") throw courseResult.reason;
  const modules: LearningModule[] = modulesResult.status === "fulfilled" ? await Promise.all(modulesResult.value.map(async module => {
    const [lessons, stats] = await Promise.allSettled([getLessons(module.id), getModuleStats(module.id)]);
    return {
      ...module,
      lessons: lessons.status === "fulfilled" ? lessons.value : undefined,
      lessonsError: lessons.status === "rejected" ? errorMessage(lessons) : undefined,
      stats: stats.status === "fulfilled" ? stats.value : undefined,
      statsError: stats.status === "rejected" ? errorMessage(stats) : undefined,
    };
  })) : [];
  return {
    course: courseResult.value,
    modules,
    modulesError: modulesResult.status === "rejected" ? errorMessage(modulesResult) : undefined,
    stats: statsResult.status === "fulfilled" ? statsResult.value : undefined,
    statsError: statsResult.status === "rejected" ? errorMessage(statsResult) : undefined,
  };
}

export default function CourseLearningPage() {
  const { courseId } = useParams();
  return courseId ? <CourseOverview key={courseId} courseId={courseId} /> : <p role="alert">Курс не знайдено.</p>;
}

function CourseOverview({ courseId }: { courseId: string }) {
  const load = useCallback(() => loadCourse(courseId), [courseId]);
  const remote = useRemoteData(load);
  const data = remote.data;
  const course = data?.course;
  const modules = data?.modules ?? [];
  const progress = percentage(data?.stats?.progressPercentage);
  const recommendedModule = modules.find(module => module.lessons?.length && percentage(module.stats?.progressPercentage) !== 100)
    ?? modules.find(module => module.lessons?.length);
  const lesson = recommendedModule?.lessons?.[0];
  const lessonPath = lesson ? `/student/learning/${encodeURIComponent(courseId)}/lesson/${encodeURIComponent(lesson.id)}` : undefined;
  const moduleIndex = recommendedModule ? modules.indexOf(recommendedModule) : -1;
  const totalLessons = data?.stats?.totalLessons ?? (modules.every(module => module.lessons !== undefined)
    ? modules.reduce((total, module) => total + (module.lessons?.length ?? 0), 0) : undefined);

  return <div className="course-learning-overview">
    <nav className="cl-breadcrumbs" aria-label="Навігаційний шлях"><Link to="/student">Головна</Link><UiIcon name="chevron" /><Link to="/student/courses">Мої курси</Link><UiIcon name="chevron" /><span>{course?.title ?? "Навчання на курсі"}</span></nav>
    {remote.loading && <div className="cl-empty" role="status"><UiIcon name="loading" size={32} /><p>Завантаження програми курсу…</p></div>}
    {remote.error && <RequestError message={remote.error} retry={remote.reload} />}
    {course && <>
      <header className="cl-hero">
        <div className="cl-hero-info"><span className="cl-tag">Навчальний курс</span><h1>{course.title}</h1>{course.description && <p>{course.description}</p>}<div className="cl-chips">{!data?.modulesError && <span>{countLabel(modules.length, "модуль", "модулі", "модулів")}</span>}{totalLessons !== undefined && <span>{countLabel(totalLessons, "урок", "уроки", "уроків")}</span>}</div></div>
        <div className="cl-stage"><span className="cl-caption">{progress === 100 ? "Для повторення" : "Оберіть урок"}</span>{recommendedModule ? <><h2>Модуль {moduleIndex + 1} із {modules.length}</h2><p>{recommendedModule.title}</p></> : <p>Уроки поки недоступні.</p>}</div>
        <div className="cl-hero-progress"><div className="cl-progress-label"><span>Ваш прогрес</span><strong>{progress === undefined ? "Недоступний" : `${Math.round(progress)}%`}</strong></div>{progress !== undefined && <progress aria-label="Прогрес курсу" max={100} value={progress} />}{lessonPath ? <Link className="cl-button" to={lessonPath}>{progress === 100 ? "Переглянути урок" : "Відкрити урок"}<UiIcon name="arrow" /></Link> : <button type="button" className="cl-button" disabled>Відкрити урок</button>}</div>
      </header>
      {data?.statsError && <RequestError message={`Прогрес курсу недоступний: ${data.statsError}`} retry={remote.reload} />}
      <section className="cl-program" aria-labelledby="cl-program-heading">
        <div className="cl-section-heading"><h2 id="cl-program-heading">Програма курсу</h2><span aria-hidden="true" /></div><p className="cl-program-intro">Відкривайте модулі та обирайте урок для навчання.</p>
        <div className="cl-body-grid"><div className="cl-modules">
          {data?.modulesError ? <RequestError message={data.modulesError} retry={remote.reload} /> : !modules.length ? <div className="cl-empty" role="status"><h3>Програму ще не додано</h3><p>Тут з’являться модулі та уроки цього курсу.</p></div> : modules.map((module, index) => <ModuleCard key={module.id} module={module} index={index} courseId={courseId} initiallyOpen={module.id === recommendedModule?.id || !recommendedModule && index === 0} retry={remote.reload} />)}
        </div><aside className="cl-aside" aria-label="Навчання та матеріали">
          <section className="cl-next cl-card"><span className="cl-tag">Далі</span><h2>Наступний крок</h2>{lesson && lessonPath ? <><h3>{lesson.title}</h3><p>{lesson.description || "Перейдіть до матеріалів цього уроку."}</p><div className="cl-next-info"><span>Модуль</span><strong>{recommendedModule?.title}</strong></div><Link className="cl-button" to={lessonPath}>Відкрити урок<UiIcon name="arrow" /></Link></> : <p>Оберіть урок, коли його буде додано до програми курсу.</p>}</section>
          <section className="cl-mentor cl-card"><span className="cl-tag">Ментор</span><h3>{course.mentor}</h3><p>{course.assignedTeacherId ? "Ментор перевіряє практичні роботи та залишає зворотний зв’язок." : "Ментор цього курсу ще не призначений."}</p>{course.assignedTeacherId && <div className="cl-mentor-person"><span className="cl-mentor-avatar" aria-hidden="true"><UiIcon name="teacher" size={28} /></span><span>Ментор курсу</span></div>}</section>
          <div className="cl-tree" role="img" aria-label="Дерево з корінням у вигляді електронних схем" />
          <LessonResources key={lesson?.id ?? "no-lesson"} lesson={lesson} lessonPath={lessonPath} />
        </aside></div>
      </section>
    </>}
  </div>;
}

function ModuleCard({ module, index, courseId, initiallyOpen, retry }: { module: LearningModule; index: number; courseId: string; initiallyOpen: boolean; retry: () => void }) {
  const progress = percentage(module.stats?.progressPercentage);
  const lessons = module.lessons;
  const completed = module.stats?.completedLessons;
  const total = module.stats?.totalLessons ?? lessons?.length;
  return <details className="cl-module" open={initiallyOpen}>
    <summary><span className="cl-module-number">{index + 1}</span><span className="cl-module-copy"><strong>{module.title}</strong>{module.description && <span>{module.description}</span>}</span><span className="cl-module-stats"><strong>{progress === undefined ? "—" : `${Math.round(progress)}%`}</strong><span>{typeof completed === "number" && typeof total === "number" ? `${completed} / ${countLabel(total, "урок", "уроки", "уроків")}` : total !== undefined ? countLabel(total, "урок", "уроки", "уроків") : "Уроки недоступні"}</span></span><UiIcon name="chevron" size={18} /></summary>
    <div className="cl-module-lessons">
      {module.statsError && <RequestError message={`Прогрес модуля недоступний: ${module.statsError}`} retry={retry} />}
      {module.lessonsError ? <RequestError message={`Уроки недоступні: ${module.lessonsError}`} retry={retry} /> : lessons?.length ? <ol>{lessons.map((lesson, lessonIndex) => <li key={lesson.id}><Link className="cl-lesson" to={`/student/learning/${encodeURIComponent(courseId)}/lesson/${encodeURIComponent(lesson.id)}`}><span className="cl-lesson-icon" aria-hidden="true">{lessonIndex + 1}</span><span className="cl-lesson-copy"><strong>{lesson.title}</strong><span>{lesson.description || "Матеріали уроку"}</span></span><span className="cl-lesson-action">Відкрити<UiIcon name="arrow" size={16} /></span></Link></li>)}</ol> : <p className="cl-module-empty">Уроки до цього модуля ще не додано.</p>}
    </div>
  </details>;
}

const materialLabels: Record<string, string> = { File: "Файл уроку", Photo: "Зображення", Text: "Текстовий матеріал", Video: "Відео уроку", Link: "Посилання", Test: "Тестування", Assignment: "Практичне завдання" };

function LessonResources({ lesson, lessonPath }: { lesson?: Lesson; lessonPath?: string }) {
  const load = useCallback(() => lesson ? getMaterials(lesson.id) : Promise.resolve([]), [lesson]);
  const remote = useRemoteData(load);
  return <section className="cl-resources cl-card"><span className="cl-tag">Матеріали уроку</span><h3>Корисні ресурси</h3><p>{lesson ? `Матеріали уроку «${lesson.title}».` : "Матеріали з’являться після додавання уроків."}</p>
    {remote.loading && <p role="status">Завантаження матеріалів…</p>}
    {remote.error && <RequestError message={remote.error} retry={remote.reload} />}
    {remote.data && (remote.data.length ? <ul>{remote.data.map(material => <ResourceLink key={material.id} material={material} lessonPath={lessonPath} />)}</ul> : <p className="cl-resource-empty">Матеріали поки не додано.</p>)}
    {lessonPath && <Link className="cl-button" to={lessonPath}>Переглянути матеріали<UiIcon name="arrow" /></Link>}
  </section>;
}

function ResourceLink({ material, lessonPath }: { material: Material; lessonPath?: string }) {
  const fileUrl = material.type === "File" ? submissionFileUrl(material.fileUrl) : undefined;
  const label = material.title || materialLabels[material.type] || "Матеріал уроку";
  return <li><LinkOrFile href={fileUrl} lessonPath={lessonPath}><UiIcon name={material.type === "Test" || material.type === "Assignment" ? "assignment" : "file"} size={16} /><span>{label}</span><UiIcon name={fileUrl ? "external" : "arrow"} size={16} /></LinkOrFile></li>;
}

function LinkOrFile({ href, lessonPath, children }: { href?: string; lessonPath?: string; children: ReactNode }) {
  return href ? <a href={href} target="_blank" rel="noreferrer">{children}</a> : lessonPath ? <Link to={lessonPath}>{children}</Link> : <span>{children}</span>;
}
