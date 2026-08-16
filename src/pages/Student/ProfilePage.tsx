import { PageHeader, Panel } from "../shared/PageComponents";
import "../PlatformPages.css";
export default function ProfilePage() { return <><PageHeader title="Профіль студента" /><section className="form-panel"><Panel><form><label>Ім’я<input defaultValue="Ірина Петренко" /></label><label>Email<input defaultValue="iryna@example.com" /></label><button type="button">Зберегти зміни</button></form></Panel></section></>; }
