import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import type { Course } from "../../data/mockData";

export function PageHeader({ title, description, action }: { title: string; description?: string; action?: ReactNode }) { return <section className="page-header"><div><h1>{title}</h1>{description && <p>{description}</p>}</div>{action}</section>; }
export function Panel({ children, className = "" }: { children: ReactNode; className?: string }) { return <article className={`panel ${className}`}>{children}</article>; }
export function Stat({ value, label }: { value: string; label: string }) { return <Panel className="stat"><strong>{value}</strong><span>{label}</span></Panel>; }
export function CourseCard({ course }: { course: Course }) { return <Panel className="course-card"><p className="eyebrow">{course.direction}</p><h3>{course.title}</h3><p>{course.description}</p><p className="meta">Ментор: {course.mentor}</p><div className="card-footer"><strong>{course.price.toLocaleString("uk-UA")} грн</strong><Link className="button-link" to={`/courses/${course.id}`}>Детальніше</Link></div></Panel>; }
export function Success({ title, text, to, label }: { title: string; text: string; to: string; label: string }) { return <div className="success"><h2>{title}</h2><p>{text}</p><Link className="button-link" to={to}>{label}</Link></div>; }
