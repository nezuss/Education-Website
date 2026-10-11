import { Link } from "react-router-dom";
import { useState } from "react";
import UiIcon from "../../components/ui/Icon/UiIcon";
import { getProfile, type UserProfile } from "../../services/profileService";
import { getMentorProfileCourseCount } from "../../services/mentorProfileService";
import PasswordChangeForm from "../shared/PasswordChangeForm";
import ProfileNameForm from "../shared/ProfileNameForm";
import RequestError from "../shared/RequestError";
import useRemoteData from "../shared/useRemoteData";
import "../../styles/MentorProfile.css";

const unavailableStats = [
  { title: "СЕРЕДНЯ ОЦІНКА", description: "Відгуки студентів поки недоступні" },
  { title: "FEEDBACK ЦЬОГО МІСЯЦЯ", description: "Статистика перевірок поки недоступна" },
  { title: "СЕРЕДНІЙ ЧАС", description: "Час перевірки поки недоступний" },
];

export default function MentorProfilePage() {
  const profile = useRemoteData(getProfile);
  const [savedProfile, setSavedProfile] = useState<UserProfile>();
  const currentProfile = savedProfile ?? profile.data;
  const courseCount = useRemoteData(getMentorProfileCourseCount);
  const name = profile.loading ? "Завантаження профілю…" : currentProfile?.username || currentProfile?.name || "Профіль поки недоступний";
  const email = profile.loading ? "Завантаження email…" : currentProfile?.email || "Email поки недоступний";
  const role = profile.loading ? "Завантаження ролі…" : currentProfile?.role || "Роль поки недоступна";

  return <div className="mentor-figma-profile" aria-busy={profile.loading || courseCount.loading}>
    <nav className="mfp-breadcrumb" aria-label="Навігаційний шлях"><span className="mfp-breadcrumb-item"><Link to="/mentor">Головна</Link><UiIcon name="chevron" size={16} /></span><span className="mfp-breadcrumb-item"><span>Профіль</span><UiIcon name="chevron" size={16} /></span><span aria-current="page">Профіль ментора</span></nav>

    <header className="mfp-intro">
      <div className="mfp-intro-copy"><span className="mfp-tag">[ ПРОФІЛЬ МЕНТОРА ]</span><div><h1>Профіль ментора</h1><p>Керуй професійною інформацією, експертизою та переглядай свій внесок у розвиток студентів.</p></div></div>
      <div className="mfp-edit">{profile.loading || !currentProfile ? <button className="mfp-edit-button" type="button" disabled>Редагувати ім’я <UiIcon name="arrow" size={12} /></button> : <a className="mfp-edit-button" href="#profile-name-editor">Редагувати ім’я <UiIcon name="arrow" size={12} /></a>}<p id="mfp-edit-note">Фото, опис та інші дані поки не редагуються</p></div>
    </header>

    {(profile.error || courseCount.error) && <div className="mfp-request-errors">
      {profile.error && <RequestError message="Не вдалося завантажити профіль. Особисті дані поки недоступні." retry={profile.reload} />}
      {courseCount.error && <RequestError message="Не вдалося завантажити призначені курси. Їх кількість поки недоступна." retry={courseCount.reload} />}
    </div>}

    <section className="mfp-overview" aria-label="Профіль та експертиза ментора">
      <article className="mfp-identity-card">
        <div className="mfp-portrait-empty"><span className="mfp-portrait-monogram" aria-hidden="true">{currentProfile?.username?.charAt(0).toUpperCase() || "—"}</span><p>Фото профілю поки недоступне</p></div>
        <div className="mfp-identity-copy"><span className="mfp-tag">[ MENTOR PROFILE / ПРОФІЛЬ ]</span><div className="mfp-identity-heading"><h2>{name}</h2><p className="mfp-role">Роль: {role}</p><p className="mfp-email">{email}</p><p className="mfp-bio">Професійний опис поки недоступний.</p></div><dl className="mfp-identity-numbers"><div><dt>років досвіду</dt><dd>—</dd></div><div><dt>перевірені роботи</dt><dd>—</dd></div><div><dt>оцінка студентів</dt><dd>—</dd></div></dl></div>
      </article>
      <aside className="mfp-expertise" aria-labelledby="mfp-expertise-title"><span className="mfp-tag">[ EXPERTISE / ЕКСПЕРТИЗА ]</span><div className="mfp-expertise-body"><div><h2 id="mfp-expertise-title">Професійний фокус</h2><p>Інформація про професійний фокус ментора поки недоступна.</p></div><p className="mfp-skills-empty">Навички та спеціалізації поки недоступні</p><p className="mfp-expertise-description">Розгорнутий опис професійного досвіду поки недоступний.</p></div></aside>
    </section>

    <section className="mfp-stat-grid" aria-label="Статистика менторства">
      <div><h2>СТУДЕНТІВ ЗАРАЗ</h2><strong className="mfp-stat-value" title="Кількість унікальних студентів поки недоступна" aria-label="Кількість унікальних студентів поки недоступна">—</strong><p className="mfp-course-count">{courseCount.loading ? "Завантаження курсів…" : courseCount.data === undefined ? "Кількість курсів поки недоступна" : `Призначених курсів: ${courseCount.data}`}</p></div>
      {unavailableStats.map(stat => <div key={stat.title}><h2>{stat.title}</h2><strong className="mfp-stat-value">—</strong><p>{stat.description}</p></div>)}
    </section>

    <section className="mfp-professional-grid" aria-label="Досвід та напрями менторства">
      <article className="mfp-journey" aria-labelledby="mfp-journey-title"><h2 id="mfp-journey-title">Менторський шлях</h2><div className="mfp-journey-empty"><UiIcon name="calendar" size={32} /><div><h3>Історія досвіду поки недоступна</h3><p>Дані про професійний та менторський шлях ще недоступні.</p></div></div></article>
      <article className="mfp-focus" aria-labelledby="mfp-focus-title"><h2 id="mfp-focus-title">Напрями менторства</h2><div className="mfp-focus-empty"><UiIcon name="teacher" size={32} /><div><h3>Напрями поки недоступні</h3><p>Інформація про спеціалізації та рівень експертизи ще недоступна.</p></div></div></article>
    </section>

    <section className="mfp-feedback" aria-labelledby="mfp-feedback-title"><div className="mfp-feedback-copy"><span className="mfp-tag">[ STUDENT FEEDBACK / ВІДГУКИ ]</span><div className="mfp-feedback-text"><h2 id="mfp-feedback-title">Що говорять студенти</h2><p>Відгуки формують репутацію ментора і допомагають бачити, які підходи в навчанні працюють найкраще.</p></div></div><div className="mfp-feedback-empty"><h3>Відгуки поки недоступні</h3><p>Дані про відгуки та оцінки студентів ще недоступні.</p></div></section>

    <ProfileNameForm username={currentProfile?.username} disabled={profile.loading || !currentProfile} onSaved={setSavedProfile} />
    <details className="mfp-security"><summary>Безпека акаунта <UiIcon name="chevron" size={18} /></summary><PasswordChangeForm /></details>
  </div>;
}
