import { useEffect, useRef, useState } from 'react';
import { PenTool, BookOpen, Compass, Package, Copy, Check } from 'lucide-react';
import { THEMES, themeStyle } from '@/lib/theme';
import ServiceLayout, { StepsSection, HeroCtas } from '@/components/service/ServiceLayout';
import { Reveal, SectionHeader, Sparkle } from '@/components/kit';

const PALETTE = [
  { name: 'Void', hex: '#050505', text: 'text-white' },
  { name: 'Ember', hex: '#EF4444', text: 'text-white' },
  { name: 'Flare', hex: '#F97316', text: 'text-black' },
  { name: 'Glow', hex: '#FDBA74', text: 'text-black' },
  { name: 'Paper', hex: '#F5F1EA', text: 'text-black' },
];

function Swatch({ name, hex, text }: (typeof PALETTE)[number]) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard?.writeText(hex).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 1400);
        });
      }}
      className={`group relative flex min-h-[120px] min-w-0 flex-1 basis-[30%] flex-col sm:min-h-[140px] sm:basis-0 justify-between rounded-2xl border border-white/10 p-4 text-left transition-[flex-grow] duration-500 [transition-timing-function:var(--ease-out)] hover:flex-[1.6] ${text}`}
      style={{ background: hex }}
      aria-label={`Copy ${name} ${hex}`}
    >
      <span className="truncate text-xs font-semibold sm:text-sm">{name}</span>
      <span className="flex items-center justify-between gap-1 font-mono text-[9px] opacity-70 sm:text-xs">
        {hex}
        {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />}
      </span>
    </button>
  );
}

function BrandBoard() {
  return (
    <section id="work" className="relative scroll-mt-24 py-20 sm:py-28">
      <div className="container-x">
        <SectionHeader
          eyebrow="Our own brand"
          title="The sevIT identity, built the way we’d build yours."
          intro="Our own identity, built the way we build yours: a mark with a story, a tight palette, one typeface family and rules that keep it consistent."
        />
        <div className="grid gap-4 lg:grid-cols-6 [&>*]:min-w-0" style={themeStyle(THEMES.home)}>
          {/* logo hero */}
          <Reveal className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-black lg:col-span-4 lg:row-span-2">
            <img src="/images/3dlogo.webp" alt="sevIT sparkle mark rendered in 3D" loading="lazy" className="h-full min-h-[320px] w-full object-cover" />
            <p className="absolute left-6 top-6 text-[13px] text-white/50">Primary mark, rendered in 3D</p>
          </Reveal>
          {/* wordmark on light */}
          <Reveal delay={80} className="flex min-h-[200px] items-center justify-center rounded-[2rem] bg-[#F5F1EA] p-8 lg:col-span-2">
            <p className="relative font-display text-5xl font-semibold sm:text-6xl tracking-[-0.04em] text-[#0a0a0a]" aria-label="sevIT wordmark on light">
              sevIT
              <Sparkle className="absolute -right-6 -top-3 h-7 w-7" />
            </p>
          </Reveal>
          {/* sparkle construction */}
          <Reveal delay={160} className="relative flex min-h-[200px] items-center justify-center overflow-hidden rounded-[2rem] border border-white/10 bg-[#0b0b0b] lg:col-span-2">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.05)_1px,transparent_1px)] bg-[size:20px_20px]" />
            <div className="absolute h-36 w-36 rounded-full border border-dashed border-white/15" />
            <div className="absolute h-20 w-20 rounded-full border border-dashed border-a2/30" />
            <Sparkle className="spin-slow relative h-24 w-24 [animation-duration:60s]" />
            <p className="absolute bottom-4 left-5 text-[13px] text-white/40">The spark, constructed</p>
          </Reveal>
          {/* palette */}
          <Reveal className="flex flex-col gap-3 rounded-[2rem] border border-white/10 bg-[#0b0b0b] p-4 lg:col-span-3">
            <p className="px-1 text-[13px] text-white/40">Palette (click a colour to copy it)</p>
            <div className="flex flex-1 flex-wrap gap-2 sm:flex-nowrap">
              {PALETTE.map((p) => (
                <Swatch key={p.hex} {...p} />
              ))}
            </div>
          </Reveal>
          {/* type */}
          <Reveal delay={80} className="flex flex-col justify-between gap-6 rounded-[2rem] border border-white/10 bg-[#0b0b0b] p-6 lg:col-span-3">
            <div className="flex items-start justify-between">
              <p className="text-[13px] text-white/40">Typography</p>
              <p className="font-mono text-[10px] text-white/30">Inter Tight / Inter / JetBrains Mono</p>
            </div>
            <p className="display text-7xl sm:text-8xl">Aag</p>
            <p className="text-sm leading-relaxed text-white/50">ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz 0123456789, set tight, loud and confident.</p>
          </Reveal>
          {/* applications */}
          <Reveal className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_30%_30%,rgb(var(--a2)/0.25),#0b0b0b_60%)] p-8 lg:col-span-3">
            <p className="text-[13px] text-white/40">Business card</p>
            <div className="mt-8 flex justify-center gap-4 [perspective:900px]">
              <div className="aspect-[1.75] w-[46%] rounded-xl bg-[#050505] p-4 shadow-2xl ring-1 ring-white/10 [transform:rotateY(14deg)_rotateX(6deg)]">
                <img src="/images/logo-sevit.webp" alt="" className="h-5 w-auto" />
                <p className="mt-6 text-[9px] text-white/50 sm:text-[10px]">sevit@sevitdigital.com</p>
              </div>
              <div className="flex aspect-[1.75] w-[46%] items-center justify-center rounded-xl bg-gradient-to-br from-a1 to-a2 shadow-2xl [transform:rotateY(-14deg)_rotateX(6deg)]">
                <Sparkle className="h-10 w-10 [&_path]:fill-white" />
              </div>
            </div>
          </Reveal>
          <Reveal delay={80} className="grid grid-cols-3 gap-2 rounded-[2rem] border border-white/10 bg-[#0b0b0b] p-4 lg:col-span-3">
            <p className="col-span-3 px-1 text-[13px] text-white/40">Packaging & label work</p>
            {['elkaduwa', 'perf2', 'collage1'].map((n) => (
              <img key={n} src={`/images/renders/sm/${n}.webp`} alt="Packaging design shown in a 3D render" loading="lazy" className="aspect-[3/4] w-full rounded-xl object-cover" />
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}

const WORD = 'recognise.';

/** Hero: a giant word whose letters get heavier as the pointer comes near (variable font). */
function Hero() {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const letters = Array.from(el.querySelectorAll<HTMLSpanElement>('span'));
    const pointer = { x: -9999, y: -9999, active: false };
    let raf = 0;
    const t0 = performance.now();
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      letters.forEach((l, i) => {
        const r = l.getBoundingClientRect();
        let k: number;
        if (pointer.active) {
          const d = Math.hypot(pointer.x - (r.left + r.width / 2), pointer.y - (r.top + r.height / 2));
          k = Math.max(0, 1 - d / 320);
        } else {
          // no pointer (touch): a slow wave runs through the word
          k = (Math.sin((now - t0) / 700 - i * 0.6) + 1) / 2;
        }
        l.style.fontVariationSettings = `'wght' ${Math.round(250 + k * 550)}, 'wdth' ${Math.round(100 - k * 25)}`;
      });
    };
    const move = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.active = true;
    };
    const leave = () => (pointer.active = false);
    window.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerleave', leave);
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', move);
      document.removeEventListener('pointerleave', leave);
    };
  }, []);

  return (
    <div className="container-x pb-16 text-center">
      <h1 aria-label="Logos and identities people actually recognise.">
        <span aria-hidden className="block text-[clamp(1.4rem,3vw,2.4rem)] font-medium text-white/70">Logos and identities people actually</span>
        <span ref={ref} aria-hidden className="mt-2 block whitespace-nowrap font-display text-[clamp(3.6rem,15vw,15rem)] leading-[0.95] tracking-[-0.04em]">
          {WORD.split('').map((c, i) => (
            <span key={i} className={c === '.' ? 'text-a2' : ''} style={{ fontVariationSettings: "'wght' 250, 'wdth' 100" }}>
              {c}
            </span>
          ))}
        </span>
      </h1>
      <p className="mx-auto mt-8 max-w-[52ch] text-lg leading-relaxed text-white/65">
        A logo, a colour and type system, and simple rules that keep your brand consistent on every sign, box, post and screen. The word above is set in a variable typeface that shifts weight as you move. Type is half of a brand.
      </p>
      <HeroCtas className="mt-8 justify-center" />
    </div>
  );
}

export default function BrandingPage() {
  return (
    <ServiceLayout
      slug="branding"
      hero={<Hero />}
      offeringsTitle="A logo is the start. The system around it is what makes it stick."
      offerings={[
        { icon: PenTool, title: 'Logo & mark', text: 'A distinctive primary logo, icon and variations that work from favicon to billboard.' },
        { icon: Compass, title: 'Brand strategy', text: 'Positioning, audience and voice, so how you look matches what you stand for.' },
        { icon: BookOpen, title: 'Brand guidelines', text: 'A clear rulebook for colours, type, imagery and tone your whole team can follow.' },
        { icon: Package, title: 'Packaging & collateral', text: 'Labels, packaging, business cards, menus and social templates, rendered before they’re printed.' },
      ]}
      faqs={[
        { q: 'What do I get at the end of a branding project?', a: 'Logo files in every format you need, a colour and type system, brand guidelines, and any collateral we agreed on, ready for print and digital.' },
        { q: 'How many logo concepts will I see?', a: 'Usually two or three distinct directions, then we refine your favourite together until it’s right.' },
        { q: 'Can you refresh my existing brand instead of starting over?', a: 'Yes. Often a refresh, cleaning up the logo, tightening colours and type, gets you most of the benefit for a fraction of the effort.' },
        { q: 'Can you show the packaging before it’s printed?', a: 'Yes, we render packaging and labels in 3D so you can see the real thing, and use those visuals for marketing straight away.' },
      ]}
    >
      <BrandBoard />
      <StepsSection
        title="How a brand comes together"
        steps={[
          { title: 'Discover', text: 'Your story, audience, competitors and what makes you different.' },
          { title: 'Explore', text: 'Moodboards and two or three distinct creative directions.' },
          { title: 'Refine', text: 'One direction developed into a full identity system.' },
          { title: 'Deliver', text: 'Guidelines, source files and launch-ready assets.' },
        ]}
      />
    </ServiceLayout>
  );
}
