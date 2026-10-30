import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { SectionHeader, Sparkle } from '@/components/kit';
import { SERVICES } from '@/lib/site';
import { THEMES, themeStyle } from '@/lib/theme';
import { cn } from '@/lib/utils';

function PosVisual() {
  const bars = [38, 52, 44, 70, 58, 86, 74];
  return (
    <div className="absolute inset-6 grid grid-cols-[1.1fr_1fr] gap-3 sm:inset-8">
      <div className="rounded-xl border border-white/10 bg-black/50 p-3">
        <p className="font-mono text-[10px] uppercase tracking-wider text-white/40">Today's sales</p>
        <p className="mt-1 font-display text-xl font-bold">Rs 184,250</p>
        <div className="mt-3 flex h-20 items-end gap-1.5">
          {bars.map((h, i) => (
            <span
              key={i}
              className="flex-1 origin-bottom rounded-t bg-gradient-to-t from-a1/60 to-a2 transition-transform duration-700 [transition-timing-function:var(--ease-out)] group-hover:scale-y-110"
              style={{ height: `${h}%`, transitionDelay: `${i * 40}ms` }}
            />
          ))}
        </div>
      </div>
      <div className="space-y-2 rounded-xl border border-white/10 bg-black/50 p-3 text-[11px]">
        {[
          ['Espresso', '650'],
          ['Club sandwich', '1,450'],
          ['Mango juice', '900'],
        ].map(([n, p]) => (
          <div key={n} className="flex justify-between text-white/65">
            <span>{n}</span>
            <span className="font-mono">{p}</span>
          </div>
        ))}
        <div className="flex justify-between border-t border-white/10 pt-2 font-semibold">
          <span>Total</span>
          <span className="font-mono">3,000</span>
        </div>
        <div className="rounded-lg bg-gradient-to-r from-a1 to-a2 py-1.5 text-center font-semibold">Charge</div>
      </div>
    </div>
  );
}

function AIVisual() {
  return (
    <div className="absolute inset-6 flex flex-col justify-center gap-2.5 sm:inset-8">
      <div className="ml-auto max-w-[75%] rounded-2xl rounded-br-md bg-white px-3.5 py-2 text-xs text-black">Do you deliver to Kandy today?</div>
      <div className="flex max-w-[85%] items-start gap-2">
        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-a1 to-a2">
          <Sparkle tone="white" className="h-3 w-3" />
        </span>
        <div className="rounded-2xl rounded-tl-md border border-white/10 bg-white/[0.06] px-3.5 py-2 text-xs text-white/80">
          Yes! Orders before 2pm arrive the same day. Want me to start one for you?
        </div>
      </div>
      <div className="ml-8 flex gap-1">
        {[0, 1, 2].map((i) => (
          <span key={i} className="h-1.5 w-1.5 animate-bounce rounded-full bg-a3/70" style={{ animationDelay: `${i * 120}ms` }} />
        ))}
      </div>
    </div>
  );
}

function GrowthVisual() {
  return (
    <div className="absolute inset-6 sm:inset-8">
      <svg viewBox="0 0 300 140" className="h-full w-full overflow-visible" preserveAspectRatio="none" aria-hidden>
        <defs>
          <linearGradient id="gv-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" style={{ stopColor: 'rgb(var(--a2))' }} stopOpacity=".35" />
            <stop offset="1" style={{ stopColor: 'rgb(var(--a2))' }} stopOpacity="0" />
          </linearGradient>
        </defs>
        {[35, 70, 105].map((y) => (
          <line key={y} x1="0" x2="300" y1={y} y2={y} stroke="rgba(255,255,255,.06)" />
        ))}
        <path d="M0 120 C40 115 60 100 90 96 S140 90 165 70 S220 50 245 32 S285 14 300 8 L300 140 L0 140Z" fill="url(#gv-fill)" />
        <path
          d="M0 120 C40 115 60 100 90 96 S140 90 165 70 S220 50 245 32 S285 14 300 8"
          fill="none"
          style={{ stroke: 'rgb(var(--a2))' }}
          strokeWidth="2.5"
          vectorEffect="non-scaling-stroke"
          className="[stroke-dasharray:420] [stroke-dashoffset:420] [transition:stroke-dashoffset_1.6s_var(--ease-out)] group-hover:[stroke-dashoffset:0] [.is-in_&]:[stroke-dashoffset:0]"
        />
      </svg>
      <div className="absolute right-0 top-0 rounded-xl border border-white/10 bg-black/60 px-3 py-2 backdrop-blur">
        <p className="font-mono text-[10px] uppercase tracking-wider text-white/40">Organic traffic</p>
        <p className="font-display text-lg font-bold text-a3">↑ trending</p>
      </div>
    </div>
  );
}


const img = (src: string, pos = 'center') => (
  <img src={src} alt="" className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition: pos }} />
);

const PREVIEW: Record<string, React.ReactNode> = {
  'web-design': img('/images/renders/sm/clickzone.webp', 'left top'),
  'software-pos': <PosVisual />,
  'ai-solutions': <AIVisual />,
  '3d-rendering': img('/images/renders/sm/saraperf.webp', '50% 30%'),
  branding: img('/images/3dlogo.webp'),
  advertising: img('/images/video/chocolate.webp'),
  marketing: <GrowthVisual />,
};

/**
 * Services as a big typographic index. On desktop, hovering a row floats a
 * preview of that service next to the cursor, in the service's own colour.
 */
export default function ServicesIndex() {
  const [active, setActive] = useState<string | null>(null);
  const box = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const move = (e: React.PointerEvent) => {
    const list = listRef.current?.getBoundingClientRect();
    if (!box.current || !list) return;
    box.current.style.transform = `translate3d(${e.clientX - list.left + 28}px, ${e.clientY - list.top - 140}px, 0)`;
  };

  return (
    <section id="services" className="relative scroll-mt-24 py-24 sm:py-32">
      <div className="container-x">
        <SectionHeader
          eyebrow="What we make"
          title="One team for the website, the software, the visuals and the ads."
          intro="Most businesses juggle a web agency, a software vendor, a designer and an ads person. We do all of it from the same brief, so nothing gets lost between them."
        />

        <div ref={listRef} className="relative" onPointerMove={move} onPointerLeave={() => setActive(null)}>
          <ul className="border-t border-white/10">
          {SERVICES.map((s) => (
            <li key={s.slug} style={themeStyle(THEMES[s.slug])} onPointerEnter={() => setActive(s.slug)}>
              <Link
                to={s.path}
                data-cursor="Open"
                className="group grid items-baseline gap-y-2 border-b border-white/10 py-6 sm:py-8 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] md:gap-x-10"
              >
                <span className="display text-[clamp(2rem,5vw,4.2rem)] transition-[color,transform] duration-500 [transition-timing-function:var(--ease-out)] group-hover:translate-x-2 group-hover:text-a2">
                  {s.name}
                </span>
                <span className="max-w-[42ch] text-[15px] leading-relaxed text-white/55 md:self-center">
                  {s.blurb}
                  <span className="mt-2 block text-sm text-white/35">{s.tags.join(', ')}</span>
                </span>
              </Link>
            </li>
          ))}
          </ul>

          {/* floating preview (desktop pointer only) */}
          <div
            ref={box}
            aria-hidden
            className="pointer-events-none absolute left-0 top-0 z-10 hidden h-[260px] w-[360px] [@media(pointer:fine)]:lg:block"
            style={active ? themeStyle(THEMES[active]) : undefined}
          >
            <div
              className={cn(
                'relative h-full w-full overflow-hidden rounded-2xl bg-[#0a0a0a] ring-1 ring-a2/40 transition-[opacity,transform] duration-300 [transition-timing-function:var(--ease-out)]',
                active ? 'scale-100 opacity-100' : 'scale-90 opacity-0',
              )}
            >
              {SERVICES.map((s) => (
                <div key={s.slug} className={cn('absolute inset-0 transition-opacity duration-300', active === s.slug ? 'opacity-100' : 'opacity-0')} style={themeStyle(THEMES[s.slug])}>
                  {PREVIEW[s.slug]}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
