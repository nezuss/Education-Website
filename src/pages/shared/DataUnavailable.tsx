export default function DataUnavailable({ title = "Дані поки недоступні", children }: { title?: string; children?: React.ReactNode }) {
  return <div className="data-unavailable" role="status"><strong>{title}</strong><p>{children || "Цей розділ стане доступним після оновлення платформи."}</p></div>;
}
