import { useEffect, useState, type FormEvent } from "react";
import { useCourses } from "../../hooks/useCourses";
import { createCourse } from "../../services/courseService";
import { assignLessonToModule, assignMaterialToLesson, assignModuleToCourse, createLesson, createModule, createTextMaterial, type Lesson, type Module } from "../../services/learningService";
import { getUsersStats, type UsersByRole } from "../../services/statsService";
import { PageHeader, Panel, Stat } from "../shared/PageComponents";
import "../PlatformPages.css";

export default function AdminDashboardPage() {
    const { courses, error } = useCourses();
    const [users, setUsers] = useState<UsersByRole[]>([]);
    const [modules, setModules] = useState<Module[]>([]);
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [message, setMessage] = useState("");
    const [formError, setFormError] = useState("");

    useEffect(() => { getUsersStats().then(setUsers).catch((reason: Error) => setFormError(reason.message)); }, []);
    const totalUsers = users.reduce((total, item) => item.roleName === "None" ? total + item.userCount : total, 0);

    async function submitForm(event: FormEvent<HTMLFormElement>, action: (formData: FormData) => Promise<string>) {
        event.preventDefault();
        const form = event.currentTarget;
        setMessage(""); setFormError("");
        try { setMessage(await action(new FormData(form))); form.reset(); }
        catch (reason) { setFormError((reason as Error).message); }
    }

    return <><PageHeader title="Адміністрування" description="Створюйте навчальний контент через API." />
        <section className="grid grid-3"><Stat value={String(courses.length)} label="Курсів" /><Stat value={String(totalUsers)} label="Користувачів" /></section>
        <section className="section"><Panel><h2>Статистика користувачів</h2><ul className="list">{users.filter((item) => item.roleName !== "None").map((item) => <li key={item.roleName}>{item.roleName}: {item.userCount}</li>)}</ul>{error && <p role="alert">Не вдалося завантажити курси: {error}</p>}</Panel></section>
        <section className="section grid grid-2">
            <Panel><h2>1. Створити курс</h2><form onSubmit={(event) => submitForm(event, async (data) => { const course = await createCourse({ title: String(data.get("title")), description: String(data.get("description")), bannerUrl: String(data.get("bannerUrl")), price: Number(data.get("price")), totalLearningPeriodWeeks: Number(data.get("weeks")), projectsReadyForPortfolio: Number(data.get("projects")) }); return `Курс «${course.title}» створено. Оновіть сторінку, щоб він з’явився у списках.`; })}><label>Назва<input name="title" required /></label><label>Опис<textarea name="description" rows={3} required /></label><label>Посилання на банер<input name="bannerUrl" type="url" required /></label><label>Вартість, грн<input name="price" type="number" min="1" required /></label><label>Тривалість, тижнів<input name="weeks" type="number" min="1" defaultValue="4" required /></label><label>Проєктів у портфоліо<input name="projects" type="number" min="0" defaultValue="1" required /></label><button type="submit">Створити курс</button></form></Panel>
            <Panel><h2>2. Додати модуль</h2><form onSubmit={(event) => submitForm(event, async (data) => { const module = await createModule({ title: String(data.get("title")), description: String(data.get("description")) }); await assignModuleToCourse(String(data.get("courseId")), module.id); setModules((current) => [...current, module]); return `Модуль «${module.title}» додано до курсу.`; })}><label>Курс<select name="courseId" required><option value="">Оберіть курс</option>{courses.map((course) => <option value={course.id} key={course.id}>{course.title}</option>)}</select></label><label>Назва модуля<input name="title" required /></label><label>Опис<textarea name="description" rows={3} required /></label><button type="submit">Створити модуль</button></form></Panel>
            <Panel><h2>3. Додати урок</h2><form onSubmit={(event) => submitForm(event, async (data) => { const lesson = await createLesson({ title: String(data.get("title")), description: String(data.get("description")) }); await assignLessonToModule(String(data.get("moduleId")), lesson.id); setLessons((current) => [...current, lesson]); return `Урок «${lesson.title}» додано до модуля.`; })}><label>Модуль<select name="moduleId" required><option value="">Створіть і оберіть модуль</option>{modules.map((module) => <option value={module.id} key={module.id}>{module.title}</option>)}</select></label><label>Назва уроку<input name="title" required /></label><label>Опис<textarea name="description" rows={3} required /></label><button type="submit">Створити урок</button></form></Panel>
            <Panel><h2>4. Додати текстовий матеріал</h2><form onSubmit={(event) => submitForm(event, async (data) => { const material = await createTextMaterial(String(data.get("content"))); await assignMaterialToLesson(String(data.get("lessonId")), material.id); return "Текстовий матеріал додано до уроку."; })}><label>Урок<select name="lessonId" required><option value="">Створіть і оберіть урок</option>{lessons.map((lesson) => <option value={lesson.id} key={lesson.id}>{lesson.title}</option>)}</select></label><label>Текст<textarea name="content" rows={6} required /></label><button type="submit">Додати матеріал</button></form></Panel>
        </section>
        {(message || formError) && <section className="section"><Panel>{message && <p>{message}</p>}{formError && <p role="alert">{formError}</p>}</Panel></section>}
    </>;
}
