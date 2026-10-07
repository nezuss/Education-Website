import UiIcon from "../../components/ui/Icon/UiIcon";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getCourseStats, type CourseStats } from "../../services/courseStatsService";
import { getEnrolledCourses } from "../../services/courseService";
import { getProfile, getProfileStats, type UserProfile } from "../../services/profileService";
import type { Course } from "../../types/course";
import "../../styles/StudentDashboard.css";
import RequestError from "../shared/RequestError";
import PasswordChangeForm from "../shared/PasswordChangeForm";

type ProfileData = { profile?: UserProfile; courses: Course[]; stats: Record<string, CourseStats> };

export default function ProfilePage() {
  const [data, setData] = useState<ProfileData>({ courses: [], stats: {} });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submissionCount, setSubmissionCount] = useState<number>();

  useEffect(() => {
    let mounted = true;
    async function loadProfile() {
      try {
        const [profile, courses] = await Promise.all([getProfile(), getEnrolledCourses()]);
        const entries = await Promise.all(courses.map(async (course) => {
          try { return [course.id, await getCourseStats(course.id)] as const; }
          catch (reason) { if (mounted) setError((reason as Error).message); return [course.id, undefined] as const; }
        }));
        if (mounted) setData({
          profile,
          courses,
          stats: Object.fromEntries(entries.filter((entry): entry is readonly [string, CourseStats] => Boolean(entry[1]))),
        });
      } catch {
        if (mounted) setError("Не вдалося завантажити дані профілю. Спробуйте оновити сторінку.");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    void loadProfile();
    getProfileStats().then(stats => { if (mounted) setSubmissionCount(stats.submissions.length); }).catch((reason: Error) => { if (mounted) setError(reason.message); });
    return () => { mounted = false; };
  }, []);

  const summary = useMemo(() => {
    const stats = Object.values(data.stats);
    const activeCourses = stats.filter((item) => item.progressPercentage < 100).length;
    const completedCourses = stats.filter((item) => item.progressPercentage >= 100).length;
    const submittedWorks = submissionCount ?? "—";
    const totalLessons = stats.reduce((total, item) => total + item.totalLessons, 0);
    const completedLessons = stats.reduce((total, item) => total + item.completedLessons, 0);
    const progress = totalLessons ? Math.round((completedLessons / totalLessons) * 100) : 0;
    return { activeCourses, completedCourses, submittedWorks, progress, totalLessons };
  }, [data.stats, submissionCount]);

  const name = data.profile?.username || data.profile?.name || "Користувач";
  const email = data.profile?.email || "Не вказано";

  return <div className="std-dash student-profile-page">
    <div className="std-breadcrumb"><Link to="/student">Головна</Link><span>›</span><span>Профіль</span></div>
    <section className="student-profile-intro">
      <div><span className="std-badge-tag">[ ПРОФІЛЬ СТУДЕНТА ]</span><h1>Профіль студента</h1><p>Відстежуйте свій навчальний шлях та прогрес у курсах.</p></div>
      <span className="student-profile-api-note">Дані синхронізовано з акаунтом</span>
    </section>
    {error && <RequestError message={error} />}

    <section className="student-profile-overview">
      <div className="student-profile-main-card">
        <span className="profile-initial-avatar">{name.charAt(0)}</span>
        <div className="student-profile-identity">
          <span className="student-profile-label">[ STUDENT PROFILE / ПРОФІЛЬ ]</span>
          <h2>{loading ? "Завантаження…" : name}</h2><p>Студентка / студент платформи NEXYLVA</p>
          <div className="student-profile-numbers">
            <ProfileNumber value={summary.activeCourses} label="активних курсів" /><ProfileNumber value={summary.submittedWorks} label="зданих завдань" />
            <ProfileNumber value={`${summary.progress}%`} label="загальний прогрес" /><ProfileNumber value={summary.completedCourses} label="завершених курсів" />
          </div>
        </div>
      </div>
      <aside className="student-profile-about">
        <span className="std-badge-tag">[ ПРО МЕНЕ / ABOUT ME ]</span><h2>Мій профіль</h2>
        <p className="student-profile-about-copy">Персональні дані надходять з облікового запису. Редагування стане доступним після підключення відповідного методу API.</p>
        <div className="student-profile-detail"><span>Роль</span><strong>{data.profile?.role === "None" || !data.profile?.role ? "Студент" : data.profile.role}</strong></div>
        <div className="student-profile-detail"><span>Курсів у навчанні</span><strong>{data.courses.length}</strong></div>
        <div className="student-profile-detail"><span>Уроків пройдено</span><strong>{summary.totalLessons ? `${summary.progress}%` : "—"}</strong></div>
      </aside>
    </section>

    <section className="student-profile-stat-grid" aria-label="Навчальна статистика">
      <ProfileStat title="НАВЧАННЯ" value={summary.totalLessons} label="уроків у курсах" /><ProfileStat title="ПРОЄКТИ" value={summary.submittedWorks} label="завдань здано" />
      <ProfileStat title="ПРОГРЕС" value={`${summary.progress}%`} label="за всіма курсами" /><ProfileStat title="СЕРТИФІКАТИ" value="—" label="дані ще не надані API" />
    </section>

    <section className="student-profile-lower-grid">
      <div className="student-profile-courses">
        <div className="student-profile-section-heading"><div><span className="std-badge-tag">[ НАВЧАННЯ ]</span><h2>Мої курси</h2></div><Link to="/student/courses">Усі курси <UiIcon name="arrow" /></Link></div>
        {loading ? <p className="student-profile-empty">Завантажуємо курси…</p> : data.courses.length ? <div className="student-profile-course-list">
          {data.courses.slice(0, 3).map((course) => {
            const progress = data.stats[course.id]?.progressPercentage ?? 0;
            return <Link className="student-profile-course" to={`/student/learning/${course.id}`} key={course.id}>
              <div><h3>{course.title}</h3><p>{course.direction || "Навчальний курс"}</p></div>
              <div className="student-profile-course-progress"><strong>{progress}%</strong><div><span style={{ width: `${progress}%` }} /></div></div>
            </Link>;
          })}
        </div> : <p className="student-profile-empty">Ви ще не записалися на жоден курс.</p>}
      </div>
      <aside className="student-profile-certificates"><span className="std-badge-tag">[ СЕРТИФІКАТИ ]</span><h2>Сертифікати</h2><p>Сертифікати з’являться тут, коли сервер передаватиме дані про їх отримання.</p></aside>
    </section>

    <section className="student-profile-personal">
      <div className="student-profile-section-heading"><div><span className="std-badge-tag">[ АКАУНТ ]</span><h2>Особиста інформація</h2></div></div>
      <div className="student-profile-personal-grid"><ProfileField label="Ім’я" value={name} /><ProfileField label="Email" value={email} /><ProfileField label="Телефон" value="Не вказано" /><ProfileField label="Статус профілю" value="Видимий у системі" /></div>
      <p className="student-profile-readonly">Поля доступні лише для перегляду: сервер поки не має методу оновлення профілю.</p>
    </section>
    <PasswordChangeForm />
  </div>;
}

function ProfileNumber({ value, label }: { value: string | number; label: string }) { return <div><strong>{value}</strong><span>{label}</span></div>; }
function ProfileStat({ title, value, label }: { title: string; value: string | number; label: string }) { return <div><span>{title}</span><strong>{value}</strong><p>{label}</p></div>; }
function ProfileField({ label, value }: { label: string; value: string }) { return <div><span>{label}</span><strong>{value}</strong></div>; }
