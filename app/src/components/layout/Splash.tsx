import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { getLenis } from '@/lib/lenis';
import { THEMES } from '@/lib/theme';

/**
 * First-visit splash, cut like a title sequence.
 * Giant words for each thing we make flash past, each one filled with our
 * actual work (or the service colour), then the sevIT wordmark lands and the
 * whole screen lifts away. Once per session; skipped for reduced motion;
 * any click, tap or key skips it.
 */
type Cut = { word: string; fill: string; image?: string };

const CUTS: Cut[] = [
  { word: 'Websites', fill: THEMES['web-design'].a2, image: '/images/renders/sm/clickzone.webp' },
  { word: 'POS', fill: THEMES['software-pos'].a2 },
  { word: '3D', fill: THEMES['3d-rendering'].a2, image: '/images/renders/sm/saraperf.webp' },
  { word: 'AI', fill: THEMES['ai-solutions'].a2 },
  { word: 'Brands', fill: THEMES.branding.a2, image: '/images/renders/sm/collageperf.webp' },
  { word: 'Ads', fill: THEMES.advertising.a2, image: '/images/video/chocolate.webp' },
];
const HOLD = 270; // ms per cut
const KEY = 'sevit-splash-seen';

const shouldShow = () => {
  try {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
    return !sessionStorage.getItem(KEY);
  } catch {
    return true;
  }
};

/** Scales a single line of text so it fills `max` of the screen width. */
function FitWord({ text, style, max = 0.9 }: { text: string; style?: React.CSSProperties; max?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fit = () => {
      el.style.fontSize = '100px';
      const w = el.getBoundingClientRect().width || 1;
      el.style.fontSize = `${Math.min((window.innerWidth * max * 100) / w, window.innerHeight * 0.55)}px`;
    };
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, [text, max]);
  return (
    <span ref={ref} className="display inline-block whitespace-nowrap leading-[0.85] tracking-[-0.045em]" style={style}>
      {text}
    </span>
  );
}

export default function Splash() {
  const [show, setShow] = useState(shouldShow);
  const [i, setI] = useState(-1); // -1 = black, 0..n-1 = cuts, n = wordmark
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (!show) return;
    try {
      sessionStorage.setItem(KEY, '1');
    } catch {
      /* private mode */
    }
    const root = document.documentElement;
    root.style.overflow = 'hidden';
    root.dataset.splash = 'on';
    getLenis()?.stop();
    CUTS.forEach((c) => {
      if (c.image) new Image().src = c.image;
    });

    const timers: number[] = [];
    const at = (ms: number, fn: () => void) => timers.push(window.setTimeout(fn, ms));
    const done = () => {
      root.style.overflow = '';
      getLenis()?.start();
      setShow(false);
    };
    const leave = (delay: number) => {
      at(delay, () => {
        setLeaving(true);
        delete root.dataset.splash;
      });
      at(delay + 1000, done);
    };

    const start = 250;
    CUTS.forEach((_, n) => at(start + n * HOLD, () => setI(n)));
    at(start + CUTS.length * HOLD, () => setI(CUTS.length));
    leave(start + CUTS.length * HOLD + 900);

    const skip = () => {
      timers.forEach(clearTimeout);
      timers.length = 0;
      setI(CUTS.length);
      leave(150);
    };
    window.addEventListener('keydown', skip, { once: true });
    window.addEventListener('pointerdown', skip, { once: true });

    return () => {
      timers.forEach(clearTimeout);
      window.removeEventListener('keydown', skip);
      window.removeEventListener('pointerdown', skip);
      root.style.overflow = '';
      delete root.dataset.splash;
      getLenis()?.start();
    };
  }, [show]);

  if (!show) return null;

  const cut = i >= 0 && i < CUTS.length ? CUTS[i] : null;
  const final = i >= CUTS.length;

  return (
    <div
      className="fixed inset-0 z-[200] flex select-none items-center justify-center overflow-hidden bg-[#050505]"
      style={{
        transform: leaving ? 'translateY(-100%)' : 'none',
        transition: 'transform 1s cubic-bezier(0.76, 0, 0.24, 1)',
      }}
      role="status"
      aria-label="Loading sevIT"
    >
      {/* each cut: the word, filled with our work or the service colour */}
      {cut && (
        <div key={cut.word} className="splash-cut flex flex-col items-center">
          <FitWord
            text={cut.word}
            style={
              cut.image
                ? {
                    backgroundImage: `url(${cut.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    color: 'transparent',
                    WebkitTextStroke: `1px rgb(${cut.fill})`,
                  }
                : { color: `rgb(${cut.fill})` }
            }
          />
        </div>
      )}

      {final && (
        <div className="splash-final flex flex-col items-center">
          <FitWord text="sevIT" max={0.6} style={{ color: '#fff' }} />
          <p className="mt-4 text-base text-white/55 sm:text-lg">Designed and built in Sri Lanka</p>
        </div>
      )}

      {/* thin progress line in the colour of the current cut */}
      <div className="absolute inset-x-0 bottom-0 h-1 bg-white/5">
        <div
          className="h-full transition-[width,background-color] duration-200 ease-out"
          style={{
            width: `${Math.max(0, Math.min(1, (i + 1) / (CUTS.length + 1))) * 100}%`,
            background: cut ? `rgb(${cut.fill})` : final ? `rgb(${THEMES.home.a2})` : 'transparent',
          }}
        />
      </div>
      <p className="absolute bottom-5 left-5 text-xs text-white/35 sm:left-8">Tap to skip</p>

      {/* the lifting edge picks up the brand colour */}
      <div className="absolute inset-x-0 bottom-0 h-[3px]" style={{ background: `rgb(${THEMES.home.a2})`, opacity: leaving ? 1 : 0 }} />

      <style>{`
        .splash-cut { animation: splash-cut ${HOLD}ms steps(1, end) both }
        @keyframes splash-cut { from { transform: scale(1.06) } to { transform: scale(1) } }
        .splash-cut > span { animation: splash-zoom ${HOLD}ms cubic-bezier(.22,1,.36,1) both }
        @keyframes splash-zoom { from { transform: scale(1.12); filter: blur(4px) } to { transform: scale(1); filter: none } }
        .splash-final > span { animation: splash-land .8s cubic-bezier(.22,1,.36,1) both }
        @keyframes splash-land { from { transform: scale(1.25); opacity: 0; letter-spacing: .1em } to { transform: none; opacity: 1 } }
      `}</style>
    </div>
  );
}
