import { Link } from "react-router-dom";
import type { submissions } from "../../data/mockData";
export default function SubmissionsTable({ rows }: { rows: typeof submissions }) { return <div className="table-wrap"><table><thead><tr><th>Студент</th><th>Робота</th><th>Статус</th><th /></tr></thead><tbody>{rows.map((row) => <tr key={row.id}><td>{row.student}</td><td>{row.assignment}</td><td>{row.status}</td><td><Link to={`/mentor/review/${row.id}`}>Перевірити</Link></td></tr>)}</tbody></table></div>; }
