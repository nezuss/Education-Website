export default function RequestError({ message, retry = () => window.location.reload() }: { message: string; retry?: () => void }) {
  return <div className="request-error" role="alert"><p>{message}</p><button type="button" onClick={retry}>Спробувати ще раз</button></div>;
}
