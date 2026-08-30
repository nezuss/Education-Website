import { Link, useParams } from "react-router-dom";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { getLessons, getMaterials, getModules, submitTest, type Lesson, type Material, type Module } from "../../services/learningService";
import { PageHeader, Panel } from "../shared/PageComponents";
import "../PlatformPages.css";

function materialUrl(material: Material) { return material.videoUrl ?? material.fileUrl ?? material.url; }

function TestMaterial({ material }: { material: Material }) {
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault(); setError("");
        try { await submitTest(material.id, Object.entries(answers).map(([questionId, answerId]) => ({ questionId, answerId }))); setMessage("Відповіді надіслано."); }
        catch (reason) { setError((reason as Error).message); }
    }
    return <form onSubmit={handleSubmit}><h2>Тест</h2>{material.questions?.map((question) => <fieldset key={question.id}><legend>{question.text}</legend>{question.answers.map((answer) => <label key={answer.id}><input type="radio" name={question.id} required onChange={() => setAnswers((current) => ({ ...current, [question.id]: answer.id }))} />{answer.text}</label>)}</fieldset>)}{error && <p role="alert">{error}</p>}{message && <p>{message}</p>}<button type="submit">Надіслати відповіді</button></form>;
}

export default function LearningPage() {
    const { courseId, lessonId } = useParams();
    const [modules, setModules] = useState<Module[]>([]);
    const [lessonsByModule, setLessonsByModule] = useState<Record<string, Lesson[]>>({});
    const [materials, setMaterials] = useState<Material[]>([]);
    const [error, setError] = useState("");
    const lessons = useMemo(() => modules.flatMap((module) => lessonsByModule[module.id] ?? []), [modules, lessonsByModule]);

    useEffect(() => { if (courseId) getModules(courseId).then(setModules).catch((reason: Error) => setError(reason.message)); }, [courseId]);
    useEffect(() => { if (modules.length === 0) return; Promise.all(modules.map(async (module) => [module.id, await getLessons(module.id)] as const)).then((entries) => setLessonsByModule(Object.fromEntries(entries))).catch((reason: Error) => setError(reason.message)); }, [modules]);
    const currentLesson = lessonId ? lessons.find((lesson) => lesson.id === lessonId) : lessons[0];
    const selectedLessonId = lessonId ?? lessons[0]?.id;
    useEffect(() => { if (selectedLessonId) getMaterials(selectedLessonId).then(setMaterials).catch((reason: Error) => setError(reason.message)); }, [selectedLessonId]);

    return <><PageHeader title={currentLesson?.title ?? "Навчання"} description={currentLesson?.description} />
        {error && <p role="alert">Не вдалося завантажити навчальні матеріали: {error}</p>}
        <div className="two-column"><Panel><h2>Модулі та уроки</h2><ol className="list">{modules.map((module) => <li key={module.id}><strong>{module.title}</strong>{(lessonsByModule[module.id] ?? []).map((lesson) => <div key={lesson.id}><Link to={`/student/learning/${courseId}/lesson/${lesson.id}`}>{lesson.title}</Link></div>)}</li>)}</ol></Panel>
        <Panel>{currentLesson && materials.length === 0 && !error && <p>Матеріали уроку ще не додано.</p>}{materials.map((material) => <article key={material.id} className="section"><h2>{material.title ?? material.type}</h2>{material.description && <p>{material.description}</p>}{material.content && <p>{material.content}</p>}{materialUrl(material) && <p><a href={materialUrl(material)} target="_blank" rel="noreferrer">Відкрити матеріал</a></p>}{material.type === "Assignment" && <p><Link className="button-link" to={`/student/assignments/${material.id}`}>Виконати завдання</Link></p>}{material.type === "Test" && <TestMaterial material={material} />}</article>)}</Panel></div></>;
}
