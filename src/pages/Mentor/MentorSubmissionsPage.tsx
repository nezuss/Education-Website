import { PageHeader, Panel } from "../shared/PageComponents";
import "../PlatformPages.css";
export default function MentorSubmissionsPage() { return <><PageHeader title="Роботи студентів" /><Panel><p>API містить лише статус здачі матеріалу для поточного студента. Для відображення черги ментора потрібен окремий серверний ендпоінт.</p></Panel></>; }
