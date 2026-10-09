import { useEffect, useState } from "react";

export default function useRemoteData<T>(load: () => Promise<T>) {
  const [result, setResult] = useState<{ data?: T; error?: string }>({});
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let active = true;
    load().then(data => { if (active) setResult({ data }); })
      .catch((reason: Error) => { if (active) setResult({ error: reason.message }); });
    return () => { active = false; };
  }, [load, attempt]);
  return { ...result, loading: !result.data && !result.error, reload: () => { setResult({}); setAttempt(value => value + 1); } };
}
