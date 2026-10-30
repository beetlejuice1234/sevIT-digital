import { useEffect, useState, type CSSProperties } from 'react';
import { getLenis } from '@/lib/lenis';
import { CUT, SPARK_BOTTOM, SPARK_TOP } from '@/lib/spark';

/**
 * First-visit splash, built from the logo itself.
 *  1. The two halves of the sevIT spark glide together along their cut.
 *  2. The cut extends as a thin line across the whole screen.
 *  3. The screen splits along that line, each side carrying its half of the
 *     mark, and the site is underneath.
 * Shown once per browser session, skipped for reduced motion; click or any key skips.
 */
const KEY = 'sevit-splash-seen';
type Phase = 'join' | 'cut' | 'open';

const shouldShow = () => {
  try {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
    return !sessionStorage.getItem(KEY);
  } catch {
    return true;
  }
};

/** Polygon (in px) covering the half of the viewport on one side of the cut line. */
function halfPlane(w: number, h: number, side: 1 | -1) {
  const cx = w / 2;
  const cy = h / 2;
  const big = w + h;
  const p1 = [cx - CUT.dx * big, cy - CUT.dy * big];
  const p2 = [cx + CUT.dx * big, cy + CUT.dy * big];
  const off = [CUT.nx * big * side, CUT.ny * big * side];
  const pts = [p1, p2, [p2[0] + off[0], p2[1] + off[1]], [p1[0] + off[0], p1[1] + off[1]]];
  return `polygon(${pts.map(([x, y]) => `${x.toFixed(0)}px ${y.toFixed(0)}px`).join(', ')})`;
}

function Half({ side, d, w, h, mark, opening }: { side: 1 | -1; d: string; w: number; h: number; mark: number; opening: boolean }) {
  const travel = Math.hypot(w, h) * 0.75;
  return (
    <div
      className="absolute inset-0 bg-[#050505]"
      style={{
        clipPath: halfPlane(w, h, side),
        transform: opening ? `translate(${CUT.nx * travel * side}px, ${CUT.ny * travel * side}px)` : 'none',
        transition: 'transform 1.1s cubic-bezier(0.76, 0, 0.24, 1)',
      }}
    >
      <svg
        viewBox="-1 -1 2 2"
        width={mark}
        height={mark}
        className="splash-half absolute left-1/2 top-1/2 overflow-visible"
        style={{ '--sx': `${CUT.nx * 70 * side}px`, '--sy': `${CUT.ny * 70 * side}px`, marginLeft: -mark / 2, marginTop: -mark / 2 } as CSSProperties}
        aria-hidden
      >
        <path d={d} fill="#f97316" />
      </svg>
    </div>
  );
}

export default function Splash() {
  const [show, setShow] = useState(shouldShow);
  const [phase, setPhase] = useState<Phase>('join');
  const [size, setSize] = useState(() => ({ w: window.innerWidth, h: window.innerHeight }));

  useEffect(() => {
    if (!show) return;
    try {
      sessionStorage.setItem(KEY, '1');
    } catch {
      /* private mode: it just shows again next time */
    }
    const root = document.documentElement;
    (window as unknown as { __splashStart?: number }).__splashStart ??= performance.now();
    root.style.overflow = 'hidden';
    root.dataset.splash = 'on';
    getLenis()?.stop();

    const timers: number[] = [];
    const at = (ms: number, fn: () => void) => timers.push(window.setTimeout(fn, ms));
    const release = () => {
      delete root.dataset.splash;
    };
    const finish = () => {
      root.style.overflow = '';
      release();
      getLenis()?.start();
      setShow(false);
    };
    const open = (delay: number) => {
      at(delay, () => {
        setPhase('open');
        release();
      });
      at(delay + 1150, finish);
    };

    at(1000, () => setPhase('cut'));
    open(1650);

    const skip = () => {
      timers.forEach(clearTimeout);
      timers.length = 0;
      open(0);
    };
    const onResize = () => setSize({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener('keydown', skip, { once: true });
    window.addEventListener('pointerdown', skip, { once: true });
    window.addEventListener('resize', onResize);

    return () => {
      timers.forEach(clearTimeout);
      window.removeEventListener('keydown', skip);
      window.removeEventListener('pointerdown', skip);
      window.removeEventListener('resize', onResize);
      root.style.overflow = '';
      release();
      getLenis()?.start();
    };
  }, [show]);

  if (!show) return null;

  const { w, h } = size;
  const mark = Math.min(200, Math.max(120, w * 0.14));
  const opening = phase === 'open';
  const reach = w + h;

  return (
    <div className="fixed inset-0 z-[200] select-none" role="status" aria-label="Loading sevIT">
      <Half side={1} d={SPARK_TOP} w={w} h={h} mark={mark} opening={opening} />
      <Half side={-1} d={SPARK_BOTTOM} w={w} h={h} mark={mark} opening={opening} />

      {/* the logo's cut, extended across the screen */}
      <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden>
        <line
          x1={w / 2 - CUT.dx * reach}
          y1={h / 2 - CUT.dy * reach}
          x2={w / 2 + CUT.dx * reach}
          y2={h / 2 + CUT.dy * reach}
          stroke="#f97316"
          strokeWidth={1.5}
          pathLength={1}
          style={{
            strokeDasharray: 1,
            strokeDashoffset: phase === 'join' ? 1 : 0,
            opacity: opening ? 0 : 1,
            transition: 'stroke-dashoffset .6s cubic-bezier(0.65,0,0.35,1), opacity .25s ease',
            filter: 'drop-shadow(0 0 6px #f97316)',
          }}
        />
      </svg>

      <p className="absolute inset-x-0 bottom-8 text-center text-sm text-white/40 transition-opacity duration-300" style={{ opacity: opening ? 0 : 1 }}>
        Designed and built in Sri Lanka
      </p>

      <style>{`
        .splash-half { animation: splash-join 1s cubic-bezier(.22,1,.36,1) .05s both }
        @keyframes splash-join {
          from { transform: translate(var(--sx), var(--sy)) scale(.8); opacity: 0 }
          to { transform: none; opacity: 1 }
        }
      `}</style>
    </div>
  );
}
