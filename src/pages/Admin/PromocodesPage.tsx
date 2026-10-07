import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { getPromocodes, createPromocode, updatePromocode, deletePromocode, type Promocode } from "../../services/promocodeService";
import RequestError from "../shared/RequestError";
import "../../styles/AdminPortal.css";

function localDate(value: string) {
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return "";
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
}
export default function PromocodesPage() {
  const [items, setItems] = useState<Promocode[]>([]);
  const [loading, setLoading] = useState(true), [busy, setBusy] = useState(false);
  const [error, setError] = useState(""), [notice, setNotice] = useState("");
  const [revision, setRevision] = useState(0), [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ promocode: "", discount: "0", willExpireAt: "" });
  useEffect(() => {
    let active = true;
    getPromocodes().then(data => { if (active) setItems(data); }).catch((reason: Error) => { if (active) setError(reason.message); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [revision]);
  function refresh() { setError(""); setLoading(true); setRevision(value => value + 1); }
  async function save(event: FormEvent) {
    event.preventDefault(); setBusy(true); setError(""); setNotice("");
    try {
      const discount = Number(form.discount);
      if (!Number.isFinite(discount) || discount < 0 || discount > 100) throw new Error("Знижка має бути від 0 до 100%.");
      const data = { promocode: form.promocode.trim(), discount, willExpireAt: new Date(form.willExpireAt).toISOString() };
      if (editing) await updatePromocode(data); else await createPromocode(data);
      setEditing(false); setForm({ promocode: "", discount: "0", willExpireAt: "" }); setNotice("Промокод збережено."); refresh();
    } catch (reason) { setError((reason as Error).message); } finally { setBusy(false); }
  }
  async function remove(code: string) {
    if (!window.confirm(`Видалити промокод «${code}»?`)) return;
    setBusy(true); setError(""); setNotice("");
    try { await deletePromocode(code); setNotice("Промокод видалено."); refresh(); }
    catch (reason) { setError((reason as Error).message); } finally { setBusy(false); }
  }
  return <div className="admin-container"><Link to="/admin">Головна</Link>
    <header className="admin-header"><div><h1 className="admin-header-title">Промокоди</h1><p className="admin-header-sub">Керуйте кодами знижок.</p></div><button disabled={busy} onClick={refresh}>Оновити</button></header>
    {error && <RequestError message={error} />}{notice && <p role="status">{notice}</p>}
    <section className="admin-chart-card"><h2>{editing ? "Редагування промокоду" : "Новий промокод"}</h2><form className="curriculum-form" onSubmit={save}><fieldset disabled={busy}>
      <label>Код<input className="admin-modal-input" required value={form.promocode} disabled={editing} onChange={event => setForm({ ...form, promocode: event.target.value })} /></label>
      <label>Знижка (%)<input className="admin-modal-input" required type="number" min="0" max="100" step="any" value={form.discount} onChange={event => setForm({ ...form, discount: event.target.value })} /></label>
      <label>Діє до<input className="admin-modal-input" required type="datetime-local" value={form.willExpireAt} onChange={event => setForm({ ...form, willExpireAt: event.target.value })} /></label>
      <button type="submit" className="admin-btn-primary">{busy ? "Збереження…" : "Зберегти"}</button>
      {editing && <button type="button" onClick={() => { setEditing(false); setForm({ promocode: "", discount: "0", willExpireAt: "" }); }}>Скасувати</button>}
    </fieldset></form></section>
    <section className="admin-chart-card"><h2>Наявні промокоди</h2>{loading ? <p role="status">Завантаження…</p> : !error && items.length === 0 ? <p>Промокодів ще немає.</p> : items.map(item => <article className="course-module-row" key={item.promocode}><h3>{item.promocode}</h3><p>{item.discount ?? "—"}% · Діє до {new Date(item.willExpireAt).toLocaleString("uk-UA")}</p><div className="curriculum-actions"><button disabled={busy} onClick={() => { setEditing(true); setForm({ promocode: item.promocode, discount: String(item.discount ?? 0), willExpireAt: localDate(item.willExpireAt) }); }}>Редагувати</button><button disabled={busy} onClick={() => void remove(item.promocode)}>Видалити</button></div></article>)}</section>
  </div>;
}
