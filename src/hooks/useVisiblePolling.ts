import { useEffect, useRef } from 'react';

// Runs `fn` every `ms` while the tab is visible. The timer is cleared when the tab is
// hidden and fired once on return, so forgotten background tabs stop hitting /api/*.
export function useVisiblePolling(fn: () => unknown, ms: number, enabled = true) {
  const fnRef = useRef(fn);
  fnRef.current = fn;

  useEffect(() => {
    if (!enabled) return;
    let id: ReturnType<typeof setInterval> | null = null;

    const start = () => {
      if (!id) id = setInterval(() => void fnRef.current(), ms);
    };
    const stop = () => {
      if (id) {
        clearInterval(id);
        id = null;
      }
    };
    const onVisibility = () => {
      if (document.hidden) {
        stop();
      } else {
        void fnRef.current();
        start();
      }
    };

    if (!document.hidden) {
      void fnRef.current();
      start();
    }
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      stop();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [ms, enabled]);
}
