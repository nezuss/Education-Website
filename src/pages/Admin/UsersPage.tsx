import { PageHeader } from "../shared/PageComponents";
import "../PlatformPages.css";
const users = [["Ірина Петренко", "Студент", "iryna@example.com", "Активний"], ["Олена Марченко", "Ментор", "olena@example.com", "Активний"], ["Адміністратор", "Адміністратор", "admin@nexylva.ua", "Активний"]];
export default function UsersPage() { return <><PageHeader title="Користувачі" description="Облікові записи та ролі в системі." /><div className="table-wrap"><table><thead><tr><th>Користувач</th><th>Роль</th><th>Email</th><th>Статус</th></tr></thead><tbody>{users.map((user) => <tr key={user[2]}>{user.map((cell) => <td key={cell}>{cell}</td>)}</tr>)}</tbody></table></div></>; }
