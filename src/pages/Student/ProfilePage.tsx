import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import UiIcon from "../../components/ui/Icon/UiIcon";
import { getCourseStats, type CourseStats } from "../../services/courseStatsService";
import { getEnrolledCourses } from "../../services/courseService";
import { getProfile, getProfileStats, type UserProfile } from "../../services/profileService";
import { submissionGrade } from "../../services/submissionService";
import type { Course } from "../../types/course";
import RequestError from "../shared/RequestError";
import PasswordChangeForm from "../shared/PasswordChangeForm";
import "../../styles/StudentProfile.css";

type ProfileData = { profile?: UserProfile; courses?: Course[]; stats: Record<string, CourseStats>; submissions?: unknown[] };
type ProfileWork = { relatedMaterialId: string; rate: number; status?: string; createdAt: string; type?: string };

function latestWorks(submissions?: unknown[]): ProfileWork[] | undefined {
  if (!submissions) return undefined;
  const latest = new Map<string, ProfileWork>();
  for (const value of submissions) {
    if (!value || typeof value !== "object") return undefined;
    const item = value as Partial<ProfileWork>;
    if (typeof item.relatedMaterialId !== "string" || !item.relatedMaterialId || typeof item.type !== "string" || !["Assignment", "Test"].includes(item.type) || typeof item.rate !== "number" || (item.rate !== -1 && submissionGrade(item.rate) === undefined) || typeof item.createdAt !== "string" || !Number.isFinite(Date.parse(item.createdAt))) return undefined;
    const previous = latest.get(item.relatedMaterialId);
    if (!previous || Date.parse(item.createdAt) > Date.parse(previous.createdAt)) latest.set(item.relatedMaterialId, item as ProfileWork);
  }
  return [...latest.values()];
}

function validStats(stats?: CourseStats): stats is CourseStats {
  return Boolean(stats && [stats.progressPercentage, stats.totalSubmittableMaterials, stats.completedSubmittableMaterials].every(value => typeof value === "number" && Number.isFinite(value) && value >= 0) && stats.progressPercentage <= 100 && stats.completedSubmittableMaterials <= stats.totalSubmittableMaterials);
}

export default function ProfilePage() {
  const [data, setData] = useState<ProfileData>({ stats: {} });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    async function load() {
      const [profile, courses, profileStats] = await Promise.allSettled([getProfile(), getEnrolledCourses(), getProfileStats()]);
      const errors: string[] = [];
      if (profile.status === "rejected") errors.push("профіль");
      if (courses.status === "rejected") errors.push("курси");
      if (profileStats.status === "rejected") errors.push("статистику робіт");
      const enrolled = courses.status === "fulfilled" ? courses.value : undefined;
      const stats: Record<string, CourseStats> = {};
      const entries = await Promise.allSettled((enrolled ?? []).map(async course => [course.id, await getCourseStats(course.id)] as const));
      entries.forEach(entry => {
        if (entry.status === "fulfilled" && validStats(entry.value[1])) stats[entry.value[0]] = entry.value[1];
        else if (!errors.includes("прогрес курсів")) errors.push("прогрес курсів");
      });
      if (!mounted) return;
      setData({ profile: profile.status === "fulfilled" ? profile.value : undefined, courses: enrolled, stats, submissions: profileStats.status === "fulfilled" ? profileStats.value.submissions : undefined });
      setError(errors.length ? `Не вдалося завантажити ${errors.join(", ")}. Частина даних поки недоступна.` : "");
      setLoading(false);
    }
    void load();
    return () => { mounted = false; };
  }, []);

  const summary = useMemo(() => {
    const allStatsAvailable = data.courses !== undefined && data.courses.every(course => validStats(data.stats[course.id]));
    const stats = Object.values(data.stats);
    const total = stats.reduce((sum, item) => sum + item.totalSubmittableMaterials, 0);
    const completed = stats.reduce((sum, item) => sum + item.completedSubmittableMaterials, 0);
    const works = latestWorks(data.submissions);
    const graded = works?.filter(item => item.status !== "NeedsRevision" && submissionGrade(item.rate) !== undefined);
    return {
      activeCourses: allStatsAvailable ? stats.filter(item => item.progressPercentage < 100).length : undefined,
      progress: allStatsAvailable && total > 0 ? Math.round(completed / total * 100) : undefined,
      projects: works?.filter(item => item.type === "Assignment" && item.status !== "NeedsRevision" && submissionGrade(item.rate) !== undefined).length,
      averageGrade: graded?.length ? Math.round(graded.reduce((sum, item) => sum + item.rate, 0) / graded.length * 10) / 10 : undefined,
    };
  }, [data]);

  const name = loading ? "Завантаження…" : data.profile?.username || data.profile?.name || "Дані недоступні";
  const email = loading ? "Завантаження…" : data.profile?.email || "Дані недоступні";
  const editReason = "Редагування профілю тимчасово недоступне.";

  return <div className="student-figma-profile" aria-busy={loading}>
    <nav className="sfp-breadcrumb" aria-label="Навігаційний шлях"><Link to="/student">Головна</Link><UiIcon name="chevron" size={16} /><span>Профіль</span><UiIcon name="chevron" size={16} /><span aria-current="page">Профіль студента</span></nav>
    <section className="sfp-intro">
      <div className="sfp-intro-copy"><span className="sfp-tag">[ ПРОФІЛЬ СТУДЕНТА ]</span><div><h1>Профіль студента</h1><p>Керуй інформацією про себе, відстежуй навчальний шлях і збирай найкращі проєкти в одному місці.</p></div></div>
      <button className="sfp-edit-button" type="button" disabled title={editReason} aria-describedby="sfp-edit-note">Редагувати профіль <UiIcon name="arrow" size={18} /></button>
    </section>
    <p className="sfp-edit-note" id="sfp-edit-note">{editReason}</p>
    {error && <RequestError message={error} />}
    <section className="sfp-overview" aria-label="Профіль та особисті інтереси">
      <div className="sfp-identity-card">
        <div className="sfp-avatar-empty"><span className="sfp-avatar-monogram" aria-hidden="true">{data.profile?.username?.charAt(0).toUpperCase() || "—"}</span><span>Фото профілю поки недоступне</span></div>
        <div className="sfp-identity-copy"><span className="sfp-tag">[ STUDENT PROFILE / ПРОФІЛЬ ]</span><div className="sfp-identity-heading"><h2>{name}</h2><p>Опис профілю поки недоступний.</p></div><div className="sfp-identity-numbers">
          <ProfileNumber value={loading ? undefined : summary.activeCourses} label="активних курсів" /><ProfileNumber value={loading ? undefined : summary.projects} label="перевірених проєктів" /><ProfileNumber value={loading || summary.progress === undefined ? undefined : `${summary.progress}%`} label="загальний прогрес" /><ProfileNumber label="досягнень" />
        </div></div>
      </div>
      <aside className="sfp-about"><div className="sfp-about-top"><span className="sfp-tag">[ ABOUT ME / ПРО МЕНЕ ]</span><h2>МОЯ ЦІЛЬ</h2><p className="sfp-goal">Дані поки недоступні.</p><p className="sfp-about-tags">Інтереси ще не вказані.</p></div><div className="sfp-professional"><h3>ПРОФЕСІЙНІ ІНТЕРЕСИ</h3><p>Дані поки недоступні.</p></div><p className="sfp-about-location">Місто та дата приєднання поки недоступні.</p></aside>
    </section>
    <section className="sfp-stat-grid" aria-label="Навчальна статистика"><ProfileStat title="НАВЧАННЯ" label="час навчання поки недоступний" /><ProfileStat title="ПРОЄКТИ" value={loading ? undefined : summary.projects} label="перевірених проєктів" /><ProfileStat title="СЕРЕДНІЙ БАЛ" value={loading || summary.averageGrade === undefined ? undefined : `${summary.averageGrade.toLocaleString("uk-UA")} / 12`} label={summary.averageGrade === undefined ? "оцінки поки недоступні" : "за перевірені роботи"} /><ProfileStat title="СЕРТИФІКАТИ" label="дані поки недоступні" /></section>
    <section className="sfp-showcase" aria-label="Портфоліо та сертифікати">
      <div className="sfp-portfolio"><div className="sfp-section-heading"><h2>Моє портфоліо</h2><button type="button" disabled title="Портфоліо поки недоступне">Усі проєкти <UiIcon name="arrow" size={16} /></button></div><div className="sfp-portfolio-empty"><UiIcon name="file" size={48} /><h3>Проєкти поки недоступні</h3><p>Тут з’являться твої опубліковані роботи.</p><Link to="/student/assignments">Мої завдання <UiIcon name="arrow" size={18} /></Link></div></div>
      <aside className="sfp-certificates"><div className="sfp-section-heading"><h2>Сертифікати</h2><button type="button" disabled title="Сертифікати поки недоступні">Переглянути всі <UiIcon name="arrow" size={16} /></button></div><div className="sfp-certificate-empty"><UiIcon name="file" size={40} /><h3>Сертифікати поки недоступні</h3><p>Дані про отримані сертифікати ще не доступні.</p></div><div className="sfp-certificate-decoration"><img src="/ui/profile-mascot.png" width={283} height={245} alt="" /></div></aside>
    </section>
    <section className="sfp-personal"><div className="sfp-section-heading"><h2>Особиста інформація</h2><span className="sfp-heading-line" /><button type="button" disabled title={editReason}>Редагувати <UiIcon name="arrow" size={16} /></button></div><dl className="sfp-personal-grid"><ProfileField label="Email" value={email} /><ProfileField label="Телефон" value="Дані недоступні" /><ProfileField label="Місто" value="Дані недоступні" /><ProfileField label="Статус профілю" value="Дані недоступні" /></dl></section>
    <details className="sfp-security"><summary>Безпека акаунта <UiIcon name="chevron" size={18} /></summary><PasswordChangeForm /></details>
  </div>;
}

function ProfileNumber({ value, label }: { value?: string | number; label: string }) { return <div><strong>{value ?? "—"}</strong><span>{label}</span></div>; }
function ProfileStat({ title, value, label }: { title: string; value?: string | number; label: string }) { return <div><span>{title}</span><strong>{value ?? "—"}</strong><p>{label}</p></div>; }
function ProfileField({ label, value }: { label: string; value: string }) { return <div><dt>{label}</dt><dd>{value}</dd></div>; }
