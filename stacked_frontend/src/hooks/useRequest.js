import { useEffect, useRef, useState } from "react";

// Runs `load` (a function returning a promise) and re-runs it whenever `key` changes.
// `key` should describe everything the request depends on, e.g. JSON.stringify(params).
// While a new request is in flight the previous `data` is kept, so tables don't flash empty.
export default function useRequest(load, key) {
  const loadRef = useRef(load);
  const [result, setResult] = useState({ key: undefined, data: undefined, error: null });

  useEffect(() => {
    loadRef.current = load;
  });

  useEffect(() => {
    let cancelled = false;

    loadRef.current().then(
      (data) => !cancelled && setResult({ key, data, error: null }),
      (error) => !cancelled && setResult((prev) => ({ key, data: prev.data, error })),
    );

    return () => {
      cancelled = true;
    };
  }, [key]);

  const isLoading = result.key !== key;
  return {
    data: result.data,
    error: isLoading ? null : result.error,
    isLoading,
  };
}
