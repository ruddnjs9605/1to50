import { useEffect, useRef, useState } from "react";

export function useTimer(active: boolean) {
  const [elapsed, setElapsed] = useState(0);
  const startRef = useRef(0);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!active) return;

    startRef.current = Date.now();
    timerRef.current = window.setInterval(() => {
      setElapsed((Date.now() - startRef.current) / 1000);
    }, 50);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [active]);

  return elapsed;
}
