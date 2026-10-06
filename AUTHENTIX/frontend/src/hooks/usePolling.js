// hooks/usePolling.js
// Generic polling hook: calls `fn` every `intervalMs` while `active` is true.
// Used by Attack Lab to poll GET /api/attacks/:id/status for live updates.
import { useEffect, useRef } from 'react';

export default function usePolling(fn, intervalMs, active) {
  const savedFn = useRef(fn);
  savedFn.current = fn;

  useEffect(() => {
    if (!active) return undefined;
    const id = setInterval(() => savedFn.current(), intervalMs);
    savedFn.current(); // fire immediately on activation
    return () => clearInterval(id);
  }, [active, intervalMs]);
}
