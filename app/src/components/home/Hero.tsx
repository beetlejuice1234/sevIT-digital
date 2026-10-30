import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import ShaderBackdrop from '@/components/kit/ShaderBackdrop';
import { Marquee, Sparkle } from '@/components/kit';
import { cn } from '@/lib/utils';

const WORDS = ['websites', 'POS systems', 'AI assistants', '3D ad films', 'brands', 'web apps'];
const CAPABILITIES = [
  'Web Design',
  'E-commerce',
  'POS & Billing',
  'Inventory Systems',
  'AI Chatbots',
  'Workflow Automation',
  '3D Product Renders',
  'CGI Ad Films',
  'Brand Identity',
  'Meta & Google Ads',
  'SEO',
];

function RotatingWord() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setI((n) => (n + 1) % WORDS.length), 2200);
    return () => window.clearInterval(id);
  }, []);
  return (
    <span className="relative inline-grid h-[1.02em] overflow-hidden align-bottom" aria-live="polite">
      {WORDS.map((w, n) => (
        <span
          key={w}
          aria-hidden={n !== i}
          className={cn(
            'text-gradient col-start-1 row-start-1 whitespace-nowrap pb-[0.06em] transition-all duration-700 [transition-timing-function:var(--ease-out)]',
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
            <span className="font-mono text-orange-300">3D</span>
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
          <span className="relative flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-orange-400">
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
  return (
    <section className="relative flex min-h-[100svh] flex-col overflow-hidden pt-28 sm:pt-32">
      <ShaderBackdrop />
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-60" aria-hidden />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" aria-hidden />

      <div className="container-x relative grid flex-1 items-center gap-12 pb-10 lg:grid-cols-[1.25fr_1fr] lg:gap-6">
        <div className="hero-copy">
          <p className="eyebrow mb-7">Digital studio · Sri Lanka</p>
          <h1 className="display text-[clamp(2.9rem,7vw,6.2rem)]">
            <span className="block">We build</span>
            <RotatingWord />
            <span className="block text-white/90">
              that grow <br className="sm:hidden" />
              your business.
            </span>
          </h1>
          <p className="mt-8 max-w-xl text-pretty text-lg leading-relaxed text-white/60">
            sevIT designs and engineers websites, POS &amp; business software, AI automation, brands and photoreal 3D ads —
            everything in-house, from first sketch to launch day.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link to="/#contact" className="btn btn-accent group">
              Start a project
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
            <Link to="/#work" className="btn btn-ghost group">
              See our work
              <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
            </Link>
          </div>
        </div>

        <div className="hero-visual relative pb-6 lg:pb-0">
          <WorkFan />
        </div>
      </div>

      <div className="relative border-y border-white/[0.06] bg-black/30 py-5 backdrop-blur-sm">
        <Marquee duration={45} pauseOnHover={false}>
          {CAPABILITIES.map((c) => (
            <span key={c} className="flex items-center gap-8 pr-8 font-display text-lg font-semibold tracking-tight text-white/40 sm:text-xl">
              {c}
              <Sparkle className="h-4 w-4 opacity-70" />
            </span>
          ))}
        </Marquee>
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
