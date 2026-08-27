import { useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { enrollToCourse } from "../../services/courseService";
import { useCourses } from "../../hooks/useCourses";
import { PageHeader, Panel, Success } from "../shared/PageComponents";
import "../PlatformPages.css";

export default function CheckoutPage() {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const { courses } = useCourses();
    const course = courses.find((item) => item.id === courseId) ?? courses[0];
    const [error, setError] = useState("");
    const [isPaid, setIsPaid] = useState(false);

    if (!course) {
        return <PageHeader title="Курс не знайдено" />;
    }

    async function handlePay(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");

        try {
            await enrollToCourse(course.id);
            setIsPaid(true);
        } catch (e) {
            const err = e as { status?: number; message?: string };
            if (err.status === 401) {
                navigate("/login");
                return;
            }
            setError(err.message ?? "Не вдалося записатися на курс");
        }
    }

    return <><PageHeader title="Оформлення курсу" /><section className="form-panel"><Panel><h2>{course.title}</h2><p>До сплати: <strong>{course.price.toLocaleString("uk-UA")} грн</strong></p>{isPaid ? <Success title="Запис оформлено" text="Курс додано до розділу «Мої курси»." to="/student/courses" label="Перейти до курсів" /> : <form onSubmit={handlePay}><label>Email<input type="email" required /></label><label>Спосіб оплати<select><option>Банківська картка</option><option>Банківський переказ</option></select></label>{error && <p role="alert">{error}</p>}<button type="submit">Підтвердити оплату</button></form>}</Panel></section></>;
}
