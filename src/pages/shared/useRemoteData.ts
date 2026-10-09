import { useEffect, useState } from "react";

export default function useRemoteData<T>(load: () => Promise<T>) {
  const [result, setResult] = useState<{ load: typeof load; attempt: number; settled: true; data?: T; error?: string }>();
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let active = true;
    Promise.resolve().then(load)
      .then(data => { if (active) setResult({ load, attempt, settled: true, data }); })
      .catch((reason: unknown) => { if (active) setResult({ load, attempt, settled: true, error: reason instanceof Error ? reason.message : "Не вдалося завантажити дані." }); });
    return () => { active = false; };
  }, [load, attempt]);
  const current = result?.load === load && result.attempt === attempt ? result : undefined;
  return { data: current?.data, error: current?.error, loading: !current?.settled, reload: () => setAttempt(value => value + 1) };
}
