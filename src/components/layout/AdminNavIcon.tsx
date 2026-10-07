import UiIcon, { type UiIconName } from "../ui/Icon/UiIcon";
const icons = {
  home: "home",
  users: "users",
  courses: "course-manage",
  orders: "orders",
  analytics: "admin",
  profile: "person",
} satisfies Record<string, UiIconName>;
export default function AdminNavIcon({ name }: { name: keyof typeof icons }) {
  return <span className="lms-nav-icon"><UiIcon name={icons[name]} size={18} /></span>;
}
