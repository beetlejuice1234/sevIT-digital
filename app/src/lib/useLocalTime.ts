import { useEffect, useState } from 'react';

/** Live time in Sri Lanka, e.g. "4:55 PM". */
export default function useLocalTime() {
  const fmt = () =>
    new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', timeZone: 'Asia/Colombo' }).format(new Date());
  const [t, setT] = useState(fmt);
  useEffect(() => {
    const id = window.setInterval(() => setT(fmt()), 20_000);
    return () => window.clearInterval(id);
  }, []);
  return t;
}
