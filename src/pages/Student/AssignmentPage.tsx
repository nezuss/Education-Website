import { Link } from "react-router-dom";
import { PageHeader, Panel } from "../shared/PageComponents";
import "../PlatformPages.css";
export default function AssignmentPage() { return <><PageHeader title="Завдання: редизайн упаковки" action={<Link className="button-link" to="/student/upload/packaging-project">Завантажити проєкт</Link>} /><div className="two-column"><Panel><h2>Бриф</h2><p>Запропонуйте екологічніший варіант упаковки.</p><ul className="list"><li>PDF-презентація до 10 слайдів.</li><li>Дедлайн: 20 серпня.</li></ul></Panel><Panel><h2>Статус роботи</h2><p>Не надіслано</p></Panel></div></>; }
