import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import ShaderBackdrop from '@/components/kit/ShaderBackdrop';
import { Sparkle } from '@/components/kit';
import useLocalTime from '@/lib/useLocalTime';
import { THEMES } from '@/lib/theme';
import { cn } from '@/lib/utils';

const WORDS: [string, string][] = [
  ['Websites', 'web-design'],
  ['POS systems', 'software-pos'],
  ['AI assistants', 'ai-solutions'],
  ['3D product ads', '3d-rendering'],
  ['Brand identities', 'branding'],
  ['Ad campaigns', 'advertising'],
];
function RotatingWord() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setI((n) => (n + 1) % WORDS.length), 2200);
    return () => window.clearInterval(id);
  }, []);
  return (
    <span className="relative grid h-[1.02em] overflow-hidden" aria-live="polite">
      {WORDS.map(([w, slug], n) => (
        <span
          key={w}
          aria-hidden={n !== i}
          style={{ color: `rgb(${THEMES[slug].a2})` }}
          className={cn(
            'col-start-1 row-start-1 whitespace-nowrap pb-[0.06em] transition-all duration-700 [transition-timing-function:var(--ease-out)]',
            n === i ? 'translate-y-0 opacity-100' : n === (i - 1 + WORDS.length) % WORDS.length ? '-translate-y-full opacity-0' : 'translate-y-full opacity-0',
          )}
        >
          {w}
        </span>
      ))}
    </span>
  );
}

/** Fan of floating work cards that tilt with the pointer. */
function WorkFan() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia('(pointer: coarse)').matches) return;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const x = e.clientX / window.innerWidth - 0.5;
        const y = e.clientY / window.innerHeight - 0.5;
        el.style.setProperty('--rx', `${-y * 10}deg`);
        el.style.setProperty('--ry', `${x * 14}deg`);
        el.style.setProperty('--tx', `${x * 18}px`);
        el.style.setProperty('--ty', `${y * 18}px`);
      });
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  return (
    <div className="relative mx-auto aspect-[4/5] w-full max-w-[460px] [perspective:1200px]">
      <div
        ref={ref}
        className="relative h-full w-full transition-transform duration-700 [transform-style:preserve-3d] [transition-timing-function:var(--ease-out)]"
        style={{ transform: 'rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg))' }}
      >
        {/* back left */}
        <figure
          className="hero-card absolute left-[-6%] top-[12%] w-[46%] overflow-hidden rounded-2xl border border-white/10 shadow-2xl shadow-black/60"
          style={{ transform: 'translateZ(-60px) rotate(-9deg)', animationDelay: '0.15s' }}
        >
          <img src="/images/renders/sm/elkaduwa4.webp" alt="Elkaduwa Springs water bottles, 3D product render" className="aspect-[9/16] w-full object-cover" fetchPriority="high" />
        </figure>
        {/* back right */}
        <figure
          className="hero-card absolute right-[-4%] top-[4%] w-[46%] overflow-hidden rounded-2xl border border-white/10 shadow-2xl shadow-black/60"
          style={{ transform: 'translateZ(-30px) rotate(8deg)', animationDelay: '0.3s' }}
        >
          <img src="/images/renders/sm/perf1.webp" alt="Bergamood fragrance, CGI concept ad" className="aspect-[9/16] w-full object-cover" fetchPriority="high" />
        </figure>
        {/* front */}
        <figure
          className="hero-card absolute left-1/2 top-[16%] w-[54%] -translate-x-1/2 overflow-hidden rounded-[1.4rem] border border-white/15 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.9)]"
          style={{ transform: 'translateX(-50%) translateZ(40px)', animationDelay: '0s' }}
        >
          <img src="/images/renders/sm/saraperf.webp" alt="Fragrance campaign with model, virtual product shoot" className="aspect-[9/16] w-full object-cover" fetchPriority="high" />
          <figcaption className="absolute inset-x-3 bottom-3 flex items-center justify-between rounded-xl border border-white/10 bg-black/55 px-3 py-2 text-[11px] backdrop-blur-md">
            <span className="text-white/80">Virtual product shoot</span>
            <span className="font-mono text-a3">3D</span>
          </figcaption>
        </figure>

        {/* floating UI chips: shows we do more than visuals */}
        <div
          className="float-slow absolute -left-[10%] bottom-[8%] w-44 rounded-2xl border border-white/10 bg-black/70 p-3 shadow-2xl backdrop-blur-xl sm:-left-[16%] sm:w-52"
          style={{ transform: 'translate3d(var(--tx,0),var(--ty,0),80px)', '--r': '-3deg' } as React.CSSProperties}
        >
          <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-white/40">
            <span>POS · Sale #1042</span>
            <span className="text-emerald-400">Paid</span>
          </div>
          <div className="mt-2 space-y-1 text-[11px] text-white/70">
            <div className="flex justify-between"><span>Iced latte ×2</span><span>1,700</span></div>
            <div className="flex justify-between"><span>Croissant</span><span>950</span></div>
          </div>
          <div className="mt-2 flex justify-between border-t border-white/10 pt-2 text-xs font-semibold">
            <span>Total</span>
            <span>Rs 2,650</span>
          </div>
        </div>

        <div
          className="float-slow absolute -right-[6%] bottom-[22%] flex items-center gap-2.5 rounded-2xl border border-white/10 bg-black/70 px-3 py-2.5 shadow-2xl backdrop-blur-xl sm:-right-[12%]"
          style={{ transform: 'translate3d(calc(var(--tx,0) * -1),calc(var(--ty,0) * -1),100px)', animationDelay: '-3s', '--r': '4deg' } as React.CSSProperties}
        >
          <span className="relative flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-a1 to-a2">
            <Sparkle className="h-3.5 w-3.5 [&_path]:fill-white" />
          </span>
          <div className="text-[11px] leading-tight">
            <p className="font-medium">sevAI</p>
            <p className="text-white/50">Replied in 1.2s</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Hero() {
  const time = useLocalTime();
  return (
    <section className="relative flex min-h-[100svh] flex-col overflow-hidden pt-28 sm:pt-32">
      <ShaderBackdrop />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" aria-hidden />

      <div className="container-x relative grid flex-1 items-center gap-12 pb-10 lg:grid-cols-[1.3fr_1fr] lg:gap-6 [&>*]:min-w-0">
        <div className="hero-copy">
          <h1 className="display text-[clamp(2.8rem,6.4vw,6rem)]">
            <RotatingWord />
            <span className="block">designed and built</span>
            <span className="block text-white/45">in Sri Lanka.</span>
          </h1>
          <p className="mt-8 max-w-[46ch] text-pretty text-lg leading-relaxed text-white/65">
            sevIT is a small studio run by three friends. We make websites, POS and business software, AI tools, brands and
            3D product ads, and the people you talk to are the people who build it.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link to="/#contact" className="btn btn-accent">Start a project</Link>
            <Link to="/#work" className="btn btn-ghost">See recent work</Link>
          </div>
        </div>

        <div className="hero-visual relative pb-6 lg:pb-0">
          <WorkFan />
        </div>
      </div>

      <div className="container-x relative flex items-center justify-between border-t border-white/10 py-5 text-sm text-white/50">
        <span>Scroll for recent work</span>
        <span>
          {time} in Sri Lanka
        </span>
      </div>

      <style>{`
        @keyframes hero-in { from { opacity: 0; transform: translate3d(0, 40px, 0); filter: blur(10px); } to { opacity: 1; transform: none; filter: none; } }
        @keyframes card-in { from { opacity: 0; translate: 0 60px; } to { opacity: 1; translate: 0 0; } }
        .hero-copy > * { animation: hero-in 1.1s var(--ease-out) both; }
        .hero-copy > :nth-child(2) { animation-delay: .08s } .hero-copy > :nth-child(3) { animation-delay: .2s } .hero-copy > :nth-child(4) { animation-delay: .3s }
        .hero-card { animation: card-in 1.4s var(--ease-out) both; }
        .hero-visual { animation: hero-in 1.4s .2s var(--ease-out) both; }
      `}</style>
    </section>
  );
}
