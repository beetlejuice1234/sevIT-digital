import { useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Plus } from 'lucide-react';
import Seo from '@/components/Seo';
import { faqLd, serviceLd } from '@/seo/schema';
import ShaderBackdrop from '@/components/kit/ShaderBackdrop';
import { Reveal, SectionHeader } from '@/components/kit';
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
  /** The page's own opening section. Each service has a different one. */
  hero: ReactNode;
  /** Background behind the hero: the shader by default, or a custom layer. */
  heroBackdrop?: ReactNode;
  offeringsTitle?: ReactNode;
  offeringsIntro?: string;
  offerings: Offering[];
  faqs: Faq[];
  children?: ReactNode;
};

export default function ServiceLayout({ slug, hero, heroBackdrop, offeringsTitle, offeringsIntro, offerings, faqs, children }: Props) {
  const service = serviceBySlug(slug);
  const route = seo.routes.find((r) => r.path === service.path)!;

  return (
    <>
      <Seo
        path={service.path}
        breadcrumbs={[{ name: service.name, path: service.path }]}
        jsonLd={[serviceLd(service.name, service.path, route.description), faqLd(faqs)]}
      />

      {/* Hero: shared shell (backdrop + breadcrumb), page-specific content */}
      <section className="relative overflow-hidden pt-28 sm:pt-32">
        {heroBackdrop ?? <ShaderBackdrop intensity={0.75} />}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" aria-hidden />
        <nav aria-label="Breadcrumb" className="container-x relative z-10 mb-10 flex items-center gap-1.5 text-[15px] text-white/50">
          <Link to="/" className="hover:text-white">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/#services" className="hover:text-white">Services</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-a3">{service.short}</span>
        </nav>
        <div className="relative">{hero}</div>
        <style>{`
          @keyframes svc-in { from { opacity: 0; transform: translate3d(0, 24px, 0) } to { opacity: 1; transform: none } }
        `}</style>
      </section>

      {/* Offerings: an editorial list, not a card grid */}
      <section className="relative py-20 sm:py-28">
        <div className="container-x">
          <SectionHeader eyebrow="What we do" title={offeringsTitle ?? 'What we do'} intro={offeringsIntro} />
          <ul className="border-t border-white/10">
            {offerings.map((o) => (
              <li key={o.title} className="group grid gap-3 border-b border-white/10 py-7 md:grid-cols-12 md:gap-8">
                <h3 className="text-2xl font-bold transition-colors group-hover:text-a3 md:col-span-5 md:col-start-4 lg:text-[1.75rem]">{o.title}</h3>
                <p className="max-w-[52ch] leading-relaxed text-white/60 md:col-span-4">{o.text}</p>
              </li>
            ))}
          </ul>
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
        <SectionHeader stacked className="!mb-0 lg:sticky lg:top-32 lg:self-start" title="Questions people ask us" />
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
    <section className="relative border-t border-white/10 py-20">
      <div className="container-x grid gap-6 md:grid-cols-12 md:gap-8">
        <p className="eyebrow md:col-span-3 md:pt-2">Often paired with</p>
        <ul className="flex flex-wrap gap-x-6 gap-y-1 md:col-span-9">
          {others.map((s) => (
            <li key={s.slug} style={themeStyle(THEMES[s.slug])}>
              <Link to={s.path} className="display text-[clamp(1.35rem,3vw,2.6rem)] text-white/40 transition-colors hover:text-a2">
                {s.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** Generic numbered steps block used by several service pages. */
export function StepsSection({ eyebrow = 'How it works', title, steps }: { eyebrow?: string; title: ReactNode; steps: { title: string; text: string }[] }) {
  return (
    <section className="relative border-t border-white/10 py-24 sm:py-32">
      <div className="container-x">
        <SectionHeader eyebrow={eyebrow} title={title} />
        <ol className={cn('grid gap-x-8 border-t border-white/10 sm:grid-cols-2', steps.length === 5 ? 'lg:grid-cols-5' : steps.length === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-4')}>
          {steps.map((s, i) => (
            <li key={s.title} className="group grid grid-cols-[3.25rem_1fr] gap-x-3 border-b border-white/10 py-6 sm:block sm:py-8 lg:border-b-0 lg:border-r lg:pr-8 lg:last:border-r-0">
              <span className="display row-span-2 block text-5xl leading-none text-white/20 transition-colors duration-500 group-hover:text-a2 sm:text-[4.5rem] sm:text-white/15">{i + 1}</span>
              <h3 className="text-xl font-bold sm:mt-5">{s.title}</h3>
              <p className="mt-2 max-w-[34ch] text-[15px] leading-relaxed text-white/60">{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ─── small building blocks the page heroes share ─── */
export function HeroCtas({ className }: { className?: string }) {
  return (
    <div className={cn('flex flex-wrap gap-3', className)}>
      <Link to="#contact" className="btn btn-accent">Start a project</Link>
      <Link to="#work" className="btn btn-ghost">See the work</Link>
    </div>
  );
}
