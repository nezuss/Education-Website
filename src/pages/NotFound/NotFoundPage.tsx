import { Link } from "react-router-dom";
import "../PlatformPages.css";
export default function NotFoundPage() { return <section className="empty-state"><h1>Сторінку не знайдено</h1><Link className="button-link" to="/">На головну</Link></section>; }
