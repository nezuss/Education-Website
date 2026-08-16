import { useState } from "react";
import { useParams } from "react-router-dom";
import { activeCourse, courses } from "../../data/mockData";
import { PageHeader, Panel, Success } from "../shared/PageComponents";
import "../PlatformPages.css";

export default function CheckoutPage() {
    const { courseId } = useParams();
    const course = courses.find((item) => item.id === courseId) ?? activeCourse;
    const [isPaid, setIsPaid] = useState(false);

    return <><PageHeader title="Оформлення курсу" /><section className="form-panel"><Panel><h2>{course.title}</h2><p>До сплати: <strong>{course.price.toLocaleString("uk-UA")} грн</strong></p>{isPaid ? <Success title="Оплату підтверджено" text="Курс додано до розділу «Мої курси»." to="/student/courses" label="Перейти до курсів" /> : <form onSubmit={(event) => { event.preventDefault(); setIsPaid(true); }}><label>Email<input type="email" required /></label><label>Спосіб оплати<select><option>Банківська картка</option><option>Банківський переказ</option></select></label><button type="submit">Підтвердити оплату</button></form>}</Panel></section></>;
}
