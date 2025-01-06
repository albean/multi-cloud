
import { useState, useEffect } from 'react';

export function useAsync<T>(asyncFn: () => Promise<T>) {
  const [data, setData] = useState<T | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    console.log("INSIDE", {loading, data, error})
    if (loading || data) return;
    setLoading(true);
    setError(null);

    asyncFn()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));

  }, [asyncFn]);

  return { data, loading, error };
}
