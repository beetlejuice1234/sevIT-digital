import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, Quote, Search, PenTool, Code2, Rocket } from 'lucide-react';
import { Reveal, SectionHeader, SpotlightCard, Sparkle } from '@/components/kit';
import { TESTIMONIALS } from '@/lib/site';

/* ─── Studio statement: words light up as you scroll ─────────────────── */
const STATEMENT =
  'We’re three friends who got tired of watching good businesses settle for average digital work. So we built a studio where design, code and visuals live under one roof — and every project gets the founders’ full attention.';

export function Studio() {
  const ref = useRef<HTMLParagraphElement>(null);
  const words = STATEMENT.split(' ');

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const spans = Array.from(el.querySelectorAll<HTMLSpanElement>('span[data-w]'));
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      spans.forEach((s) => (s.style.opacity = '1'));
      return;
    }
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const vh = window.innerHeight;
        const p = Math.min(1, Math.max(0, (vh * 0.85 - r.top) / (r.height + vh * 0.35)));
        const lit = p * spans.length;
        spans.forEach((s, i) => (s.style.opacity = String(Math.min(1, Math.max(0.14, lit - i + 0.14)))));
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const facts = [
    { k: '3', v: 'Founders on every project' },
    { k: '7', v: 'Disciplines, all in-house' },
    { k: '1', v: 'Point of contact, start to finish' },
    { k: '24h', v: 'Typical first response' },
  ];

  return (
    <section id="about" className="relative py-28 sm:py-40">
      <div className="container-x">
        <Reveal className="eyebrow mb-10">The studio</Reveal>
        <p ref={ref} className="display max-w-5xl text-balance text-3xl leading-[1.12] sm:text-5xl lg:text-[3.6rem]">
          {words.map((w, i) => (
            <span key={i} data-w="" className="transition-opacity duration-200" style={{ opacity: 0.14 }}>
              {w}{' '}
            </span>
          ))}
        </p>
        <div className="mt-20 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.08] lg:grid-cols-4">
          {facts.map((f, i) => (
            <Reveal key={f.v} delay={i * 80} className="bg-background p-6 sm:p-8">
              <p className="display text-gradient text-5xl sm:text-6xl">{f.k}</p>
              <p className="mt-3 text-sm text-white/50">{f.v}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Process ───────────────────────────────────────────────────────── */
const STEPS = [
  { icon: Search, title: 'Discover', sub: 'Audit & strategy', text: 'We learn your business, customers and goals, look at what you have today and agree on what success looks like — in numbers.' },
  { icon: PenTool, title: 'Design', sub: 'UX, UI & identity', text: 'Wireframes, visual direction and clickable prototypes you can react to early, before a single line of production code.' },
  { icon: Code2, title: 'Build', sub: 'Code, content & CGI', text: 'Engineering, renders and copy come together in weekly drops you can review. No black box, no surprise invoices.' },
  { icon: Rocket, title: 'Launch & grow', sub: 'Ship, measure, improve', text: 'We deploy, train your team, wire up analytics and keep tuning after go-live. Launch day is the start, not the end.' },
];

export function Process() {
  const listRef = useRef<HTMLOListElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const vh = window.innerHeight;
        setProgress(Math.min(1, Math.max(0, (vh * 0.6 - r.top) / r.height)));
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section id="process" className="relative scroll-mt-24 border-t border-white/[0.06] py-24 sm:py-32">
      <div className="container-x grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <SectionHeader
            className="!mb-0"
            eyebrow="How we work"
            title={
              <>
                A process you can <span className="text-gradient">actually see.</span>
              </>
            }
            intro="Four clear stages, weekly check-ins and a shared board so you always know what’s happening and what’s next."
          />
        </div>

        <ol ref={listRef} className="relative space-y-4 pl-10 sm:pl-14">
          <span className="absolute left-[15px] top-2 h-[calc(100%-1rem)] w-px bg-white/10 sm:left-[19px]" aria-hidden />
          <span
            className="absolute left-[15px] top-2 w-px origin-top bg-gradient-to-b from-red-500 to-orange-400 sm:left-[19px]"
            style={{ height: `calc((100% - 1rem) * ${progress})` }}
            aria-hidden
          />
          {STEPS.map((s, i) => {
            const active = progress >= i / STEPS.length - 0.02;
            return (
              <li key={s.title} className="relative">
                <span
                  className={`absolute -left-10 top-7 flex h-8 w-8 items-center justify-center rounded-full border text-xs font-semibold transition-all duration-500 sm:-left-14 sm:h-10 sm:w-10 ${
                    active ? 'border-transparent bg-gradient-to-br from-red-500 to-orange-400 text-white shadow-[0_0_24px_rgba(249,115,22,0.5)]' : 'border-white/15 bg-background text-white/40'
                  }`}
                >
                  {i + 1}
                </span>
                <SpotlightCard className="p-6 sm:p-8">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-orange-300/80">{s.sub}</p>
                      <h3 className="mt-2 font-display text-2xl font-bold sm:text-3xl">{s.title}</h3>
                    </div>
                    <s.icon className="h-6 w-6 text-white/30" />
                  </div>
                  <p className="mt-4 max-w-lg leading-relaxed text-white/55">{s.text}</p>
                </SpotlightCard>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

/* ─── Testimonials ──────────────────────────────────────────────────── */
export function Testimonials() {
  const [lead, ...rest] = TESTIMONIALS;
  return (
    <section id="testimonials" className="relative scroll-mt-24 py-24 sm:py-32">
      <div className="container-x">
        <SectionHeader eyebrow="Client stories" title={<>Kind words from <span className="text-white/40">real clients.</span></>} />
        <div className="grid gap-4 lg:grid-cols-3">
          <Reveal className="lg:row-span-2">
            <SpotlightCard as="figure" className="flex h-full flex-col bg-gradient-to-br from-orange-500/[0.09] to-transparent p-8 sm:p-10">
              <Quote className="h-10 w-10 text-orange-400" />
              <blockquote className="mt-8 font-display text-2xl font-semibold leading-snug tracking-tight sm:text-3xl">“{lead.quote}”</blockquote>
              <Person name={lead.name} role={lead.role} className="mt-auto pt-10" />
            </SpotlightCard>
          </Reveal>
          {rest.map((t, i) => (
            <Reveal key={t.name} delay={(i + 1) * 80} className={i === 2 ? 'lg:col-span-2' : ''}>
              <SpotlightCard as="figure" className="flex h-full flex-col p-7">
                <div className="flex gap-0.5 text-orange-400" aria-label="5 out of 5">
                  {Array.from({ length: 5 }).map((_, n) => (
                    <Sparkle key={n} className="h-4 w-4" />
                  ))}
                </div>
                <blockquote className="mt-5 leading-relaxed text-white/75">“{t.quote}”</blockquote>
                <Person name={t.name} role={t.role} className="mt-auto pt-6" />
              </SpotlightCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Person({ name, role, className }: { name: string; role: string; className?: string }) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('');
  return (
    <figcaption className={`flex items-center gap-3 ${className ?? ''}`}>
      <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-sm font-semibold">{initials}</span>
      <span>
        <span className="block text-sm font-semibold">{name}</span>
        <span className="block text-xs text-white/45">{role}</span>
      </span>
    </figcaption>
  );
}

/* ─── sevAI teaser ──────────────────────────────────────────────────── */
const PROMPTS = ['How much does a website cost?', 'Can you build a POS for my café?', 'What can AI automate for me?'];

export function AITeaser() {
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  const go = (text: string) => navigate(`/services/ai-solutions?msg=${encodeURIComponent(text)}#sevai`);
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (q.trim()) go(q.trim());
  };

  return (
    <section className="relative py-12">
      <div className="container-x">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#0b0b0b] p-7 sm:p-12">
            <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-orange-500/20 blur-[100px]" />
            <div className="relative grid items-center gap-8 lg:grid-cols-[1fr_1.1fr] [&>*]:min-w-0">
              <div>
                <p className="eyebrow mb-4">Try it now</p>
                <h2 className="display text-4xl sm:text-5xl">
                  Ask <span className="text-gradient">sevAI</span> anything.
                </h2>
                <p className="mt-4 max-w-md text-white/55">Our own AI assistant — the same kind we build for clients. Ask about services, pricing or what’s possible for your business.</p>
              </div>
              <div>
                <form onSubmit={submit} className="flex items-center gap-2 rounded-full border border-white/15 bg-black/60 p-1.5 pl-5 focus-within:border-orange-400/60">
                  <Sparkle className="h-4 w-4 shrink-0" />
                  <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Ask sevAI about your project…"
                    aria-label="Ask sevAI"
                    className="min-w-0 flex-1 bg-transparent py-2 text-base placeholder:text-white/30 focus:outline-none sm:text-sm"
                  />
                  <button type="submit" className="btn btn-accent !px-4 !py-2.5" aria-label="Ask">
                    <ArrowUpRight className="h-4 w-4" />
                  </button>
                </form>
                <div className="mt-3 flex flex-wrap gap-2">
                  {PROMPTS.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => go(p)}
                      className="rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 text-xs text-white/60 transition-colors hover:border-orange-400/40 hover:text-white"
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
