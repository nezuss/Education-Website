import { useEffect, useState, type FormEvent } from "react";
import { useCourses } from "../../hooks/useCourses";
import { createCourse } from "../../services/courseService";
import {
    assignLessonToModule,
    assignMaterialToLesson,
    assignModuleToCourse,
    createLesson,
    createModule,
    getLessons,
    getModules,
    type Lesson,
    type Module,
} from "../../services/learningService";
import {
    assignTeacherToCourse,
    createMaterial,
    deleteCourse,
    uploadMaterialFile,
    type CreateMaterialPayload,
} from "../../services/adminService";
import { getUsersStats, type UsersByRole } from "../../services/statsService";
import { PageHeader, Panel, Stat } from "../shared/PageComponents";
import "../PlatformPages.css";

export default function AdminDashboardPage() {
    const { courses } = useCourses();
    const [users, setUsers] = useState<UsersByRole[]>([]);
    const [selectedCourseId, setSelectedCourseId] = useState("");
    const [modules, setModules] = useState<Module[]>([]);
    const [selectedModuleId, setSelectedModuleId] = useState("");
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [materialType, setMaterialType] = useState<CreateMaterialPayload["type"]>("Text");
    const [selectedLessonForMaterial, setSelectedLessonForMaterial] = useState("");

    const [message, setMessage] = useState("");
    const [formError, setFormError] = useState("");
    const [fileUploading, setFileUploading] = useState(false);
    const isAuthenticated = Boolean(localStorage.getItem("token"));

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        getUsersStats()
            .then(setUsers)
            .catch((reason: Error & { status?: number }) => {
                if (reason.status !== 401) {
                    setFormError(reason.message);
                }
            });
    }, []);

    useEffect(() => {
        if (!selectedCourseId) return;
        getModules(selectedCourseId)
            .then(setModules)
            .catch((err: Error) => setFormError(err.message));
    }, [selectedCourseId]);

    useEffect(() => {
        if (!selectedModuleId) return;
        getLessons(selectedModuleId)
            .then(setLessons)
            .catch((err: Error) => setFormError(err.message));
    }, [selectedModuleId]);

    const totalUsers = users.reduce(
        (total, item) => (item.roleName === "None" ? total + item.userCount : total),
        0
    );

    async function submitForm(
        event: FormEvent<HTMLFormElement>,
        action: (formData: FormData) => Promise<string>
    ) {
        event.preventDefault();
        const form = event.currentTarget;
        setMessage("");
        setFormError("");
        try {
            setMessage(await action(new FormData(form)));
            form.reset();
        } catch (reason) {
            setFormError((reason as Error).message);
        }
    }

    async function handleCreateMaterial(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setMessage("");
        setFormError("");

        const formData = new FormData(e.currentTarget);
        const lessonId = selectedLessonForMaterial;
        if (!lessonId) {
            setFormError("Оберіть урок для додавання матеріалу.");
            return;
        }

        try {
            let payload: CreateMaterialPayload = { type: materialType };

            if (materialType === "Text") {
                payload = { ...payload, content: String(formData.get("content")) };
            } else if (materialType === "Video") {
                payload = { ...payload, videoUrl: String(formData.get("videoUrl")) };
            } else if (materialType === "Link") {
                payload = {
                    ...payload,
                    url: String(formData.get("url")),
                    linkTitle: String(formData.get("linkTitle")),
                };
            } else if (materialType === "Assignment") {
                const deadline = formData.get("deadline");
                payload = {
                    ...payload,
                    description: String(formData.get("description")),
                    deadline: deadline ? new Date(String(deadline)).toISOString() : undefined,
                };
            } else if (materialType === "File") {
                const file = formData.get("file");
                if (!(file instanceof File) || file.size === 0) {
                    throw new Error("Оберіть файл для завантаження");
                }
                setFileUploading(true);
                const fileUrl = await uploadMaterialFile(file);
                payload = { ...payload, fileUrl };
            } else if (materialType === "Test") {
                const q1Text = String(formData.get("q1Text"));
                const a1Text = String(formData.get("a1Text"));
                const a2Text = String(formData.get("a2Text"));
                const correct = Number(formData.get("correctAnswer"));

                payload = {
                    ...payload,
                    questions: [
                        {
                            text: q1Text,
                            answers: [
                                { text: a1Text, isCorrect: correct === 1 },
                                { text: a2Text, isCorrect: correct === 2 },
                            ],
                        },
                    ],
                };
            }

            const created = await createMaterial(payload);
            await assignMaterialToLesson(lessonId, created.id);
            setMessage(`Матеріал типу «${materialType}» успішно створено та прикріплено до уроку!`);
            e.currentTarget.reset();
        } catch (err) {
            setFormError((err as Error).message);
        } finally {
            setFileUploading(false);
        }
    }

    return (
        <>
            <PageHeader
                title="Адміністрування платформи"
                description="Створення навчального контенту, закріплення менторів та управління матеріалами."
            />

            <section className="grid grid-3">
                <Stat value={String(courses.length)} label="Курсів" />
                <Stat value={String(totalUsers)} label="Користувачів" />
                <Stat value={String(users.find((u) => u.roleName === "Teacher")?.userCount ?? 0)} label="Менторів" />
            </section>

            {!isAuthenticated && (
                <section className="section">
                    <Panel>
                        <p style={{ color: "#b45309", margin: 0, fontWeight: 500 }}>
                            ⚠️ Ви не авторизовані. Для виконання дій адміністратора та отримання повної статистики, будь ласка,{" "}
                            <a href="/login" style={{ color: "inherit", textDecoration: "underline", fontWeight: 700 }}>
                                увійдіть у свій акаунт
                            </a>.
                        </p>
                    </Panel>
                </section>
            )}

            {(message || formError) && (
                <section className="section">
                    <Panel>
                        {message && <p style={{ color: "#2e7d32", fontWeight: 600 }}>{message}</p>}
                        {formError && <p role="alert" style={{ color: "#d32f2f" }}>{formError}</p>}
                    </Panel>
                </section>
            )}

            <section className="section grid grid-2">
                <Panel>
                    <h2>1. Створити курс</h2>
                    <form
                        onSubmit={(e) =>
                            submitForm(e, async (data) => {
                                const course = await createCourse({
                                    title: String(data.get("title")),
                                    description: String(data.get("description")),
                                    bannerUrl: String(data.get("bannerUrl")),
                                    price: Number(data.get("price")),
                                    totalLearningPeriodWeeks: Number(data.get("weeks")),
                                    projectsReadyForPortfolio: Number(data.get("projects")),
                                });
                                return `Курс «${course.title}» успішно створено!`;
                            })
                        }
                    >
                        <label>
                            Назва курсу
                            <input name="title" required placeholder="Наприклад: Circular Eco-Design" />
                        </label>
                        <label>
                            Опис курсу
                            <textarea name="description" rows={3} required />
                        </label>
                        <label>
                            URL банера
                            <input name="bannerUrl" type="url" required placeholder="https://..." />
                        </label>
                        <label>
                            Вартість, грн
                            <input name="price" type="number" min="1" defaultValue="4500" required />
                        </label>
                        <label>
                            Тривалість (тижнів)
                            <input name="weeks" type="number" min="1" defaultValue="4" required />
                        </label>
                        <label>
                            Проєктів у портфоліо
                            <input name="projects" type="number" min="0" defaultValue="1" required />
                        </label>
                        <button type="submit">Створити курс</button>
                    </form>
                </Panel>

                <Panel>
                    <h2>2. Закріпити ментора на курс</h2>
                    <form
                        onSubmit={(e) =>
                            submitForm(e, async (data) => {
                                await assignTeacherToCourse({
                                    courceId: String(data.get("courseId")),
                                    teacherId: String(data.get("teacherId")).trim(),
                                });
                                return "Ментора успішно закріплено за курсом!";
                            })
                        }
                    >
                        <label>
                            Оберіть курс
                            <select name="courseId" required>
                                <option value="">Оберіть курс зі списку</option>
                                {courses.map((c) => (
                                    <option value={c.id} key={c.id}>
                                        {c.title}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <label>
                            ID викладача (User ID з роллю Teacher)
                            <input name="teacherId" required placeholder="Введіть Teacher ID..." />
                        </label>
                        <button type="submit">Призначити викладача</button>
                    </form>
                </Panel>

                <Panel>
                    <h2>3. Додати модуль до курсу</h2>
                    <form
                        onSubmit={(e) =>
                            submitForm(e, async (data) => {
                                const courseId = String(data.get("courseId"));
                                const module = await createModule({
                                    title: String(data.get("title")),
                                    description: String(data.get("description")),
                                });
                                await assignModuleToCourse(courseId, module.id);
                                if (courseId === selectedCourseId) {
                                    setModules((cur) => [...cur, module]);
                                }
                                return `Модуль «${module.title}» додано до обраного курсу.`;
                            })
                        }
                    >
                        <label>
                            Курс
                            <select
                                name="courseId"
                                value={selectedCourseId}
                                onChange={(e) => setSelectedCourseId(e.target.value)}
                                required
                            >
                                <option value="">Оберіть курс</option>
                                {courses.map((c) => (
                                    <option value={c.id} key={c.id}>
                                        {c.title}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <label>
                            Назва модуля
                            <input name="title" required placeholder="Модуль 1: Вступ..." />
                        </label>
                        <label>
                            Опис модуля
                            <textarea name="description" rows={3} required />
                        </label>
                        <button type="submit">Створити модуль</button>
                    </form>
                </Panel>

                <Panel>
                    <h2>4. Додати урок до модуля</h2>
                    <form
                        onSubmit={(e) =>
                            submitForm(e, async (data) => {
                                const moduleId = String(data.get("moduleId"));
                                const lesson = await createLesson({
                                    title: String(data.get("title")),
                                    description: String(data.get("description")),
                                });
                                await assignLessonToModule(moduleId, lesson.id);
                                if (moduleId === selectedModuleId) {
                                    setLessons((cur) => [...cur, lesson]);
                                }
                                return `Урок «${lesson.title}» додано до модуля.`;
                            })
                        }
                    >
                        <label>
                            Модуль
                            <select
                                name="moduleId"
                                value={selectedModuleId}
                                onChange={(e) => setSelectedModuleId(e.target.value)}
                                required
                            >
                                <option value="">Спершу оберіть курс вище, потім модуль</option>
                                {modules.map((m) => (
                                    <option value={m.id} key={m.id}>
                                        {m.title}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <label>
                            Назва уроку
                            <input name="title" required placeholder="Урок 1.1: Основи..." />
                        </label>
                        <label>
                            Опис уроку
                            <textarea name="description" rows={3} required />
                        </label>
                        <button type="submit">Створити урок</button>
                    </form>
                </Panel>
            </section>

            <section className="section">
                <Panel>
                    <h2>5. Конструктор матеріалів уроку</h2>
                    <p>
                        Підтримуються всі типи матеріалів бекенду: <strong>Текст</strong>, <strong>Відео</strong>, <strong>Файл (завантаження на сервер)</strong>, <strong>Посилання</strong>, <strong>Завдання</strong> та <strong>Тест</strong>.
                    </p>

                    <form onSubmit={handleCreateMaterial} style={{ marginTop: "20px" }}>
                        <div className="grid grid-2">
                            <label>
                                Оберіть урок
                                <select
                                    value={selectedLessonForMaterial}
                                    onChange={(e) => setSelectedLessonForMaterial(e.target.value)}
                                    required
                                >
                                    <option value="">Оберіть урок для додавання</option>
                                    {lessons.map((l) => (
                                        <option value={l.id} key={l.id}>
                                            {l.title}
                                        </option>
                                    ))}
                                </select>
                            </label>

                            <label>
                                Тип матеріалу
                                <select
                                    value={materialType}
                                    onChange={(e) => setMaterialType(e.target.value as CreateMaterialPayload["type"])}
                                >
                                    <option value="Text">Текстовий конспект (Text)</option>
                                    <option value="Video">Відео-урок (Video URL)</option>
                                    <option value="File">Завантаження файлу на сервер (File Upload)</option>
                                    <option value="Link">Зовнішнє посилання (Link)</option>
                                    <option value="Assignment">Практичне завдання (Assignment)</option>
                                    <option value="Test">Тестові запитання (Test)</option>
                                </select>
                            </label>
                        </div>

                        <div style={{ marginTop: "16px" }}>
                            {materialType === "Text" && (
                                <label>
                                    Зміст конспекту
                                    <textarea name="content" rows={5} required placeholder="Текст лекції або конспекту..." />
                                </label>
                            )}

                            {materialType === "Video" && (
                                <label>
                                    Посилання на відео (YouTube або пряме відео MP4)
                                    <input name="videoUrl" type="url" required placeholder="https://www.youtube.com/watch?v=..." />
                                </label>
                            )}

                            {materialType === "File" && (
                                <label>
                                    Оберіть файл для завантаження через <code>/api/cource/material/upload</code>
                                    <input name="file" type="file" required />
                                </label>
                            )}

                            {materialType === "Link" && (
                                <div className="grid grid-2">
                                    <label>
                                        Назва посилання
                                        <input name="linkTitle" required placeholder="Додаткові джерела" />
                                    </label>
                                    <label>
                                        URL адреса
                                        <input name="url" type="url" required placeholder="https://..." />
                                    </label>
                                </div>
                            )}

                            {materialType === "Assignment" && (
                                <div className="grid grid-2">
                                    <label>
                                        Опис практичного завдання
                                        <textarea name="description" rows={4} required placeholder="Створіть проєкт..." />
                                    </label>
                                    <label>
                                        Дедлайн здачі
                                        <input name="deadline" type="date" />
                                    </label>
                                </div>
                            )}

                            {materialType === "Test" && (
                                <div style={{ background: "#fbfbfb", padding: "16px", border: "1px solid #e0e0e0", borderRadius: "4px" }}>
                                    <label>
                                        Текст запитання
                                        <input name="q1Text" required placeholder="Який основний принцип сталого дизайну?" />
                                    </label>
                                    <div className="grid grid-2" style={{ marginTop: "12px" }}>
                                        <label>
                                            Варіант 1
                                            <input name="a1Text" required placeholder="Циркулярність матеріалів" />
                                        </label>
                                        <label>
                                            Варіант 2
                                            <input name="a2Text" required placeholder="Одноразове використання" />
                                        </label>
                                    </div>
                                    <label style={{ marginTop: "12px" }}>
                                        Правильна відповідь:
                                        <select name="correctAnswer" defaultValue="1">
                                            <option value="1">Варіант 1</option>
                                            <option value="2">Варіант 2</option>
                                        </select>
                                    </label>
                                </div>
                            )}
                        </div>

                        <button type="submit" disabled={fileUploading} style={{ marginTop: "20px" }}>
                            {fileUploading ? "Завантаження файлу на сервер..." : "Створити матеріал"}
                        </button>
                    </form>
                </Panel>
            </section>

            <section className="section">
                <Panel>
                    <h2>Керування курсами</h2>
                    {courses.length === 0 ? (
                        <p>Курсів ще немає в базі даних.</p>
                    ) : (
                        <div className="table-wrap">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Назва</th>
                                        <th>Ціна</th>
                                        <th>Ментор ID</th>
                                        <th>Дії</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {courses.map((course) => (
                                        <tr key={course.id}>
                                            <td><strong>{course.title}</strong></td>
                                            <td>{course.price} грн</td>
                                            <td style={{ fontFamily: "monospace", fontSize: "12px" }}>
                                                {course.assignedTeacherId ?? "—"}
                                            </td>
                                            <td>
                                                <button
                                                    onClick={async () => {
                                                        if (confirm(`Видалити курс «${course.title}»?`)) {
                                                            try {
                                                                await deleteCourse(course.id);
                                                                setMessage(`Курс «${course.title}» видалено.`);
                                                                window.location.reload();
                                                            } catch (err) {
                                                                setFormError((err as Error).message);
                                                            }
                                                        }
                                                    }}
                                                    style={{ color: "#d32f2f", borderColor: "#d32f2f", padding: "4px 8px", fontSize: "12px" }}
                                                >
                                                    Видалити
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </Panel>
            </section>
        </>
    );
}
