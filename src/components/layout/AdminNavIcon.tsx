const paths = {
  home: "M3 10 12 3l9 7v10h-6v-7H9v7H3Z",
  users: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M17 4a4 4 0 0 1 0 8M22 21v-2a4 4 0 0 0-3-3.87",
  courses: "M4 3h11l5 5v13H4ZM14 3v6h6M8 13h8M8 17h5",
  orders: "M3 5h18v14H3ZM3 10h18M7 15h4",
  analytics: "M3 3v18h18M7 17v-4M12 17V8M17 17V5",
  profile: "M20 21v-2a7 7 0 0 0-14 0v2M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z",
};
export default function AdminNavIcon({ name }: { name: keyof typeof paths }) {
  return <span className="lms-nav-icon" aria-hidden="true"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d={paths[name]} />{name === "users" && <circle cx="9" cy="7" r="4" />}</svg></span>;
}
