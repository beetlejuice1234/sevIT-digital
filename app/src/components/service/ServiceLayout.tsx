import { useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ChevronRight, Plus } from 'lucide-react';
import Seo from '@/components/Seo';
import { faqLd, serviceLd } from '@/seo/schema';
import ShaderBackdrop from '@/components/kit/ShaderBackdrop';
import { Reveal, SectionHeader, SpotlightCard } from '@/components/kit';
import ContactSection from '@/components/layout/ContactSection';
import seo from '@/seo/routes.json';
import { SERVICES, serviceBySlug } from '@/lib/site';
import { cn } from '@/lib/utils';
import { THEMES, themeStyle } from '@/lib/theme';
import type { LucideIcon } from 'lucide-react';

export type Offering = { icon: LucideIcon; title: string; text: string; points?: string[] };
export type Faq = { q: string; a: string };

type Props = {
  slug: string;
  title: ReactNode;
  intro: ReactNode;
  heroVisual?: ReactNode;
  heroNote?: ReactNode;
  offeringsTitle?: ReactNode;
  offeringsIntro?: string;
  offerings: Offering[];
  faqs: Faq[];
  children?: ReactNode;
};

export default function ServiceLayout({ slug, title, intro, heroVisual, heroNote, offeringsTitle, offeringsIntro, offerings, faqs, children }: Props) {
  const service = serviceBySlug(slug);
  const route = seo.routes.find((r) => r.path === service.path)!;

  return (
    <>
      <Seo
        path={service.path}
        breadcrumbs={[{ name: service.name, path: service.path }]}
        jsonLd={[serviceLd(service.name, service.path, route.description), faqLd(faqs)]}
      />

      {/* Hero */}
      <section className="relative overflow-hidden pb-16 pt-32 sm:pb-24 sm:pt-40">
        <ShaderBackdrop intensity={0.75} />
        <div className="grid-bg pointer-events-none absolute inset-0 opacity-50" aria-hidden />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" aria-hidden />
        <div className={cn('container-x relative grid items-center gap-14 [&>*]:min-w-0', heroVisual && 'lg:grid-cols-[1.05fr_1fr]')}>
          <div className="svc-hero">
            <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-white/40">
              <Link to="/" className="hover:text-white">Home</Link>
              <ChevronRight className="h-3 w-3" />
              <Link to="/#services" className="hover:text-white">Services</Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-a3">{service.short}</span>
            </nav>
            <h1 className="display text-balance text-[clamp(2.6rem,5.6vw,5.2rem)]">{title}</h1>
            <p className="mt-7 max-w-xl text-pretty text-lg leading-relaxed text-white/60">{intro}</p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link to="#contact" className="btn btn-accent group">
                Start a project
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
              <Link to="#work" className="btn btn-ghost">See the work</Link>
            </div>
            {heroNote && <div className="mt-10">{heroNote}</div>}
          </div>
          {heroVisual && <div className="svc-hero-visual relative">{heroVisual}</div>}
        </div>
        <style>{`
          @keyframes svc-in { from { opacity: 0; transform: translate3d(0, 36px, 0); filter: blur(8px) } to { opacity: 1; transform: none; filter: none } }
          .svc-hero > * { animation: svc-in 1s var(--ease-out) both }
          .svc-hero > :nth-child(2) { animation-delay: .06s } .svc-hero > :nth-child(3) { animation-delay: .14s } .svc-hero > :nth-child(4) { animation-delay: .22s } .svc-hero > :nth-child(5) { animation-delay: .3s }
          .svc-hero-visual { animation: svc-in 1.3s .2s var(--ease-out) both }
        `}</style>
      </section>

      {/* Offerings */}
      <section className="relative py-20 sm:py-28">
        <div className="container-x">
          <SectionHeader eyebrow="What you get" title={offeringsTitle ?? 'What we do'} intro={offeringsIntro} />
          <div className={cn('grid gap-4 sm:grid-cols-2', offerings.length % 3 === 0 && 'lg:grid-cols-3', offerings.length === 4 && 'lg:grid-cols-4')}>
            {offerings.map((o, i) => (
              <Reveal key={o.title} delay={i * 70}>
                <SpotlightCard className="flex h-full flex-col p-7">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-a1/20 to-a2/10 text-a3">
                    <o.icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-6 font-display text-xl font-bold">{o.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/55">{o.text}</p>
                  {o.points && (
                    <ul className="mt-5 space-y-2 border-t border-white/[0.06] pt-5 text-sm text-white/65">
                      {o.points.map((p) => (
                        <li key={p} className="flex gap-2">
                          <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-a2" />
                          {p}
                        </li>
                      ))}
                    </ul>
                  )}
                </SpotlightCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {children}

      <FaqSection faqs={faqs} />
      <Related current={slug} />
      <ContactSection defaultService={service.short} />
    </>
  );
}

function FaqSection({ faqs }: { faqs: Faq[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="relative border-t border-white/[0.06] py-24 sm:py-32">
      <div className="container-x grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <SectionHeader className="lg:sticky lg:top-32 lg:self-start" eyebrow="FAQ" title={<>Questions we <span className="text-white/40">get a lot.</span></>} />
        <div className="divide-y divide-white/[0.08] border-y border-white/[0.08]">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={f.q} delay={i * 50}>
                <h3>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-6 py-6 text-left text-lg font-medium transition-colors hover:text-a3"
                  >
                    {f.q}
                    <span className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/15 transition-transform duration-500', isOpen && 'rotate-45 border-a2/60 text-a3')}>
                      <Plus className="h-4 w-4" />
                    </span>
                  </button>
                </h3>
                <div className={cn('grid transition-[grid-template-rows] duration-500 [transition-timing-function:var(--ease-out)]', isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]')}>
                  <p className="overflow-hidden pr-12 leading-relaxed text-white/55">
                    <span className="block pb-6">{f.a}</span>
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Related({ current }: { current: string }) {
  const others = SERVICES.filter((s) => s.slug !== current);
  return (
    <section className="relative py-20">
      <div className="container-x">
        <Reveal className="eyebrow mb-8">Pairs well with</Reveal>
        <div className="no-scrollbar -mx-5 flex snap-x gap-3 overflow-x-auto px-5 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:px-0 lg:grid-cols-6">
          {others.map((s, i) => (
            <Reveal key={s.slug} delay={i * 50} className="w-[70%] shrink-0 snap-start sm:w-auto" style={themeStyle(THEMES[s.slug])}>
              <SpotlightCard as={Link} to={s.path} className="group flex h-full flex-col p-5">
                <s.icon className="h-5 w-5 text-a2" />
                <p className="mt-8 text-sm font-semibold leading-snug">{s.name}</p>
                <ArrowUpRight className="mt-3 h-4 w-4 text-white/30 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" />
              </SpotlightCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Generic numbered steps block used by several service pages. */
export function StepsSection({ eyebrow = 'Process', title, steps }: { eyebrow?: string; title: ReactNode; steps: { title: string; text: string }[] }) {
  return (
    <section className="relative border-t border-white/[0.06] py-24 sm:py-32">
      <div className="container-x">
        <SectionHeader eyebrow={eyebrow} title={title} />
        <ol className={cn('grid gap-px overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.08] sm:grid-cols-2', steps.length === 4 ? 'lg:grid-cols-4' : steps.length === 5 ? 'lg:grid-cols-5' : 'lg:grid-cols-3')}>
          {steps.map((s, i) => (
            <Reveal as="li" key={s.title} delay={i * 80} className="group relative bg-background p-7 transition-colors hover:bg-[#0b0b0b]">
              <span className="display text-outline block text-6xl transition-all duration-500 group-hover:[-webkit-text-stroke-color:rgb(var(--a2)/0.8)]">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-8 font-display text-xl font-bold">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/55">{s.text}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
