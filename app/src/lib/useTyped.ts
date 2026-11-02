import { useEffect, useState } from 'react';

const calm = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Types `text` out one character at a time (shows it whole with reduced motion). */
export default function useTyped(text: string, speed = 45, startDelay = 300) {
  const [n, setN] = useState(() => (calm() ? text.length : 0));
  useEffect(() => {
    if (calm()) return;
    let i = 0;
    let id = 0;
    const start = window.setTimeout(() => {
      id = window.setInterval(() => {
        i += 1;
        setN(i);
        if (i >= text.length) window.clearInterval(id);
      }, speed);
    }, startDelay);
    return () => {
      window.clearTimeout(start);
      window.clearInterval(id);
    };
  }, [text, speed, startDelay]);
  return { typed: text.slice(0, n), done: n >= text.length };
}
