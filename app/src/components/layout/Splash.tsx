import { useEffect, useState } from 'react';
import { THEMES } from '@/lib/theme';
import { getLenis } from '@/lib/lenis';

/**
 * First-visit splash.
 *  1. The sevIT spark draws itself in white.
 *  2. It flashes through every service colour, naming each service.
 *  3. The wordmark slides in and the counter reaches 100 once fonts + page are ready.
 *  4. Seven columns, each edged in a service colour, lift away to reveal the site.
 * Shown once per browser session; skipped for reduced motion; click/tap or any key to skip.
 */
const SEQUENCE: [string, string][] = [
  ['Websites', 'web-design'],
  ['POS systems', 'software-pos'],
  ['AI assistants', 'ai-solutions'],
  ['3D renders', '3d-rendering'],
  ['Brands', 'branding'],
  ['Ad campaigns', 'advertising'],
  ['Growth', 'marketing'],
];
const KEY = 'sevit-splash-seen';
const SPARK =
  'M14.5 1c.5 3.6 1.9 5 5.5 5.5-3.6.5-5 1.9-5.5 5.5-.5-3.6-1.9-5-5.5-5.5 3.6-.5 5-1.9 5.5-5.5ZM8 11c.6 4.3 2.2 5.9 6.5 6.5-4.3.6-5.9 2.2-6.5 6.5-.6-4.3-2.2-5.9-6.5-6.5C5.8 16.9 7.4 15.3 8 11Z';

const shouldShow = () => {
  try {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
    return !sessionStorage.getItem(KEY);
  } catch {
    return true;
  }
};

export default function Splash() {
  const [show, setShow] = useState(shouldShow);
  const [step, setStep] = useState(-1); // which service colour is showing
  const [pct, setPct] = useState(0);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (!show) return;
    try {
      sessionStorage.setItem(KEY, '1');
    } catch {
      /* private mode: fine, it just shows again */
    }
    document.documentElement.style.overflow = 'hidden';
    document.documentElement.dataset.splash = 'on';
    getLenis()?.stop();

    const timers: number[] = [];
    const at = (ms: number, fn: () => void) => timers.push(window.setTimeout(fn, ms));

    // colour flashes
    SEQUENCE.forEach((_, i) => at(800 + i * 210, () => setStep(i)));
    at(800 + SEQUENCE.length * 210, () => setStep(SEQUENCE.length)); // settle on the sevIT orange

    // counter follows real readiness (fonts + window load), with a floor so the sequence plays out
    let ready = document.readyState === 'complete';
    const onLoad = () => (ready = true);
    window.addEventListener('load', onLoad);
    const fontsReady = document.fonts?.ready ?? Promise.resolve();
    let fonts = false;
    fontsReady.then(() => (fonts = true));
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = now - start;
      const floor = Math.min(1, t / 2900);
      const cap = ready && fonts ? 1 : 0.9;
      const p = Math.min(cap, floor);
      setPct(Math.round(p * 100));
      if (p >= 1 || t > 4500) {
        setPct(100);
        at(250, () => setLeaving(true));
        at(1350, finish);
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const finish = () => {
      document.documentElement.style.overflow = '';
      delete document.documentElement.dataset.splash;
      getLenis()?.start();
      setShow(false);
    };
    const skip = () => {
      cancelAnimationFrame(raf);
      setLeaving(true);
      at(1100, finish);
    };
    window.addEventListener('keydown', skip, { once: true });

    return () => {
      timers.forEach(clearTimeout);
      cancelAnimationFrame(raf);
      window.removeEventListener('load', onLoad);
      window.removeEventListener('keydown', skip);
      document.documentElement.style.overflow = '';
      delete document.documentElement.dataset.splash;
      getLenis()?.start();
    };
  }, [show]);

  useEffect(() => {
    if (leaving) delete document.documentElement.dataset.splash;
  }, [leaving]);

  if (!show) return null;

  const current = step >= 0 && step < SEQUENCE.length ? SEQUENCE[step] : null;
  const colour = current ? `rgb(${THEMES[current[1]].a2})` : step >= SEQUENCE.length ? `rgb(${THEMES.home.a2})` : 'transparent';

  return (
    <div
      className="fixed inset-0 z-[200] cursor-pointer select-none"
      role="status"
      aria-label="Loading sevIT"
      onClick={() => {
        setLeaving(true);
        window.setTimeout(() => {
          document.documentElement.style.overflow = '';
          delete document.documentElement.dataset.splash;
          getLenis()?.start();
          setShow(false);
        }, 1100);
      }}
    >
      {/* the curtain: seven columns, each edged with a service colour */}
      <div className="absolute inset-0 flex">
        {SEQUENCE.map(([, slug], i) => (
          <div
            key={slug}
            className="relative h-full flex-1 bg-[#050505] transition-transform duration-[900ms] [transition-timing-function:cubic-bezier(0.76,0,0.24,1)]"
            style={{ transform: leaving ? 'translateY(-101%)' : 'none', transitionDelay: leaving ? `${Math.abs(i - 3) * 55}ms` : '0ms' }}
          >
            <span
              className="absolute inset-x-0 bottom-0 h-1 transition-opacity duration-300"
              style={{ background: `rgb(${THEMES[slug].a2})`, opacity: leaving ? 1 : 0 }}
            />
          </div>
        ))}
      </div>

      {/* colour wash that follows the current service */}
      <div
        className={`pointer-events-none absolute inset-0 transition-[background,opacity] duration-200 ${leaving ? 'opacity-0' : ''}`}
        style={{ background: `radial-gradient(circle at 50% 50%, ${colour === 'transparent' ? 'transparent' : colour.replace('rgb(', 'rgba(').replace(')', ', 0.22)')}, transparent 55%)` }}
      />

      {/* centre piece */}
      <div className={`absolute inset-0 flex flex-col items-center justify-center transition-[opacity,transform] duration-500 ${leaving ? '-translate-y-10 opacity-0' : ''}`}>
        <div className="relative flex items-center gap-4 sm:gap-6">
          <svg viewBox="0 0 24 24" className="h-20 w-20 overflow-visible sm:h-28 sm:w-28" aria-hidden>
            {/* glow follows the colour */}
            <path d={SPARK} fill={colour} className="transition-[fill] duration-150" style={{ filter: `drop-shadow(0 0 18px ${colour})` }} />
            <path d={SPARK} fill="none" stroke="#fff" strokeWidth="0.35" pathLength={1} className="splash-draw" />
          </svg>
          <span className="flex overflow-hidden font-display text-6xl font-bold tracking-[-0.04em] sm:text-8xl" aria-hidden>
            {'sevIT'.split('').map((c, i) => (
              <span key={i} className="splash-letter inline-block" style={{ animationDelay: `${2000 + i * 60}ms` }}>
                {c}
              </span>
            ))}
          </span>
        </div>

        <p className="mt-8 h-6 text-lg font-medium transition-colors duration-150" style={{ color: colour }}>
          {current ? current[0] : step >= SEQUENCE.length ? 'Designed and built in Sri Lanka' : ''}
        </p>
      </div>

      <div className={`absolute inset-x-0 bottom-0 flex items-end justify-between p-6 text-sm text-white/45 transition-opacity duration-300 sm:p-10 ${leaving ? 'opacity-0' : ''}`}>
        <span>Click anywhere to skip</span>
        <span className="font-display text-5xl font-bold tabular-nums text-white sm:text-7xl">{pct}</span>
      </div>

      <style>{`
        .splash-draw { stroke-dasharray: 1; stroke-dashoffset: 1; animation: splash-draw .9s cubic-bezier(.65,0,.35,1) .1s forwards }
        @keyframes splash-draw { to { stroke-dashoffset: 0 } }
        .splash-letter { transform: translateY(110%); animation: splash-up .7s cubic-bezier(.22,1,.36,1) forwards }
        @keyframes splash-up { to { transform: none } }
      `}</style>
    </div>
  );
}
