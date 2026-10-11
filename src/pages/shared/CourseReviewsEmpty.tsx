import "../../styles/CourseReviewsEmpty.css";

const topics = [
    { title: "Досвід навчання", text: "Враження студентів від курсу", path: "M4 5h7a3 3 0 0 1 3 3v14a4 4 0 0 0-4-3H4V5Zm20 0h-7a3 3 0 0 0-3 3v14a4 4 0 0 1 4-3h6V5Z" },
    { title: "Результати та проєкти", text: "Знання, застосовані на практиці", path: "M4 9h20v15H4V9Zm6 0V5h8v4M4 15h20M12 15v3h4v-3" },
    { title: "Поради майбутнім студентам", text: "Що варто знати перед початком", path: "M14 15a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm-9 9v-2a7 7 0 0 1 14 0v2M22 7a4 4 0 0 1 0 8m1 3a5 5 0 0 1 3 4v2" },
];

export default function CourseReviewsEmpty() {
    return <section className="course-reviews-empty" aria-labelledby="course-reviews-heading">
        <div className="course-reviews-art" aria-hidden="true">
            <span className="course-reviews-art-ring" />
            <svg viewBox="0 0 80 64" fill="currentColor"><path d="M8 54V31C8 17 16 9 30 7v8c-8 2-12 7-12 15h15v24H8Zm39 0V31C47 17 55 9 69 7v8c-8 2-12 7-12 15h15v24H47Z" /></svg>
            <span className="course-reviews-art-label">Голоси нашої спільноти</span>
        </div>
        <div className="course-reviews-message">
            <span className="course-reviews-label">Відгуки студентів</span>
            <h2 id="course-reviews-heading">Тут будуть ваші історії</h2>
            <p>Досвід навчання, перші проєкти та нові відкриття. Відгуки студентів з’являться в цьому розділі, щойно він стане доступним.</p>
            <span className="course-reviews-status"><span aria-hidden="true" />Відгуки поки недоступні</span>
        </div>
        <ul className="course-reviews-topics">
            {topics.map(topic => <li key={topic.title}>
                <svg viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true"><path d={topic.path} /></svg>
                <div><h3>{topic.title}</h3><p>{topic.text}</p></div>
            </li>)}
        </ul>
    </section>;
}
