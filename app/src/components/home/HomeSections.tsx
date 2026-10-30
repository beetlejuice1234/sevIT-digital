import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { SectionHeader } from '@/components/kit';
import { TESTIMONIALS } from '@/lib/site';
import { cn } from '@/lib/utils';

/* ─── Studio: the one loud block on the page, set on the page accent ───── */
const STATEMENT =
  'sevIT started with three friends who kept getting asked to fix the same things: slow websites, clunky billing systems and product photos that cost a fortune. So we built one studio that handles all of it.';

export function Studio() {
  const ref = useRef<HTMLParagraphElement>(null);
  const words = STATEMENT.split(' ');

  // words darken in as you scroll through the block
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
        const p = Math.min(1, Math.max(0, (vh * 0.85 - r.top) / (r.height + vh * 0.3)));
        const lit = p * spans.length;
        spans.forEach((s, i) => (s.style.opacity = String(Math.min(1, Math.max(0.22, lit - i + 0.22)))));
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section id="about" className="relative bg-a2 py-24 text-black sm:py-36">
      <div className="container-x grid gap-10 md:grid-cols-12 md:gap-8">
        <p className="text-[15px] font-medium md:col-span-3 md:pt-4">About the studio</p>
        <div className="md:col-span-9">
          <p ref={ref} className="display text-balance text-[clamp(2rem,4.6vw,4rem)] leading-[1.02]">
            {words.map((w, i) => (
              <span key={i} data-w="" style={{ opacity: 0.22 }}>
                {w}{' '}
              </span>
            ))}
          </p>
          <div className="mt-14 grid gap-8 border-t border-black/20 pt-8 text-[17px] leading-relaxed sm:grid-cols-2">
            <p>You talk to the founders, not an account manager. The person on your first call is one of the people designing or coding your project.</p>
            <p>Design, code, 3D and ads sit at the same desk, so your website, your POS and your launch campaign actually look like they belong together.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Process: a real sequence, so it gets numbers ─────────────────────── */
const STEPS = [
  { title: 'We listen', text: 'A call or a visit. We learn how your business runs, who your customers are and what has to change.' },
  { title: 'We sketch', text: 'Wireframes, moodboards or a clickable prototype, so you can react before anything is built for real.' },
  { title: 'We build', text: 'Code, renders and copy in weekly drops on a live preview link. You see progress every week.' },
  { title: 'We launch', text: 'Go-live, training for your team and analytics set up. Then we stay around to fix and improve.' },
];

export function Process() {
  return (
    <section id="process" className="relative scroll-mt-24 py-24 sm:py-32">
      <div className="container-x">
        <SectionHeader eyebrow="How a project runs" title="Four steps, with a preview link you can open from day one." />
        <ol className="grid gap-x-8 border-t border-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <li key={s.title} className="group border-b border-white/10 py-8 lg:border-b-0 lg:border-r lg:pr-8 lg:last:border-r-0">
              <span className="display block text-[5.5rem] leading-none text-white/15 transition-colors duration-500 group-hover:text-a2">{i + 1}</span>
              <h3 className="mt-6 text-2xl font-bold">{s.title}</h3>
              <p className="mt-3 max-w-[34ch] leading-relaxed text-white/60">{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ─── Testimonials: one voice at a time ────────────────────────────────── */
export function Testimonials() {
  const [i, setI] = useState(0);
  const t = TESTIMONIALS[i];
  const go = (d: number) => setI((n) => (n + d + TESTIMONIALS.length) % TESTIMONIALS.length);

  return (
    <section id="testimonials" className="relative scroll-mt-24 border-t border-white/10 py-24 sm:py-32">
      <div className="container-x grid gap-10 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-3">
          <p className="eyebrow md:pt-3">From our clients</p>
          <ul className="mt-6 hidden space-y-1 md:block">
            {TESTIMONIALS.map((x, n) => (
              <li key={x.name}>
                <button
                  type="button"
                  onClick={() => setI(n)}
                  aria-pressed={n === i}
                  className={cn('text-left text-[15px] transition-colors', n === i ? 'text-white' : 'text-white/40 hover:text-white/70')}
                >
                  {x.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <figure className="md:col-span-9" aria-live="polite">
          <blockquote key={t.name} className="display text-balance text-[clamp(1.8rem,3.6vw,3.2rem)] leading-[1.08] [animation:svc-in_.6s_var(--ease-out)_both]">
            “{t.quote}”
          </blockquote>
          <figcaption className="mt-10 flex flex-wrap items-center justify-between gap-6">
            <span>
              <span className="block text-lg font-semibold">{t.name}</span>
              <span className="block text-white/50">{t.role}</span>
            </span>
            <span className="flex gap-2">
              <button type="button" onClick={() => go(-1)} aria-label="Previous testimonial" className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 transition-colors hover:border-a2 hover:text-a2">
                <ArrowLeft className="h-5 w-5" />
              </button>
              <button type="button" onClick={() => go(1)} aria-label="Next testimonial" className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 transition-colors hover:border-a2 hover:text-a2">
                <ArrowRight className="h-5 w-5" />
              </button>
            </span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

/* ─── sevAI teaser ──────────────────────────────────────────────────── */
const PROMPTS = ['How much does a website cost?', 'Can you build a POS for my café?', 'What could AI automate for me?'];

export function AITeaser() {
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  const go = (text: string) => navigate(`/services/ai-solutions?msg=${encodeURIComponent(text)}#sevai`);
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (q.trim()) go(q.trim());
  };

  return (
    <section className="relative border-t border-white/10 py-20">
      <div className="container-x grid items-end gap-8 md:grid-cols-12 md:gap-8 [&>*]:min-w-0">
        <div className="md:col-span-5">
          <p className="eyebrow">Got a quick question?</p>
          <h2 className="display mt-4 text-[clamp(2.2rem,4.4vw,3.6rem)]">Ask sevAI, our own assistant.</h2>
          <p className="mt-4 max-w-[44ch] text-white/60">It knows what we do and roughly how projects work. For a real quote, it will point you to us.</p>
        </div>
        <div className="md:col-span-7">
          <form onSubmit={submit} className="flex items-center gap-2 border-b-2 border-white/25 pb-3 focus-within:border-a2">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Type a question…"
              aria-label="Ask sevAI"
              className="min-w-0 flex-1 bg-transparent py-2 text-xl placeholder:text-white/30 focus:outline-none sm:text-2xl"
            />
            <button type="submit" className="btn btn-accent shrink-0 !px-5 !py-2.5">Ask</button>
          </form>
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
            {PROMPTS.map((p) => (
              <button key={p} type="button" onClick={() => go(p)} className="text-[15px] text-white/50 underline decoration-white/20 underline-offset-4 transition-colors hover:text-white hover:decoration-a2">
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
