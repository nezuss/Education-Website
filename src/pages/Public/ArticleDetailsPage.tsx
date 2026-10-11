import UiIcon from "../../components/ui/Icon/UiIcon";
import { Link } from "react-router-dom";
import DataUnavailable from "../shared/DataUnavailable";
import "../../styles/EcoJournalPage.css";
export default function Page() { return <div className="journal-page-container"><nav className="catalog-breadcrumbs"><Link to="/">Головна</Link><span>›</span><span>Стаття</span></nav><section className="content-intro-grid"><div><span className="std-badge-tag">[ NEXYLVA ]</span><h1>Стаття</h1><p>Знання, проєкти та ідеї для сталого дизайну.</p></div><img src="/landing/banner-moss.webp" alt="" /></section><DataUnavailable title="Матеріали поки недоступні">Ми готуємо цей розділ. Поверніться пізніше або перегляньте доступні навчальні програми.</DataUnavailable><Link className="assignment-outline-link" to="/courses">Переглянути курси <UiIcon name="arrow" /></Link></div>; }
