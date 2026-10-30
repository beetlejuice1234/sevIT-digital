import useTyped from '@/lib/useTyped';
import { useCallback, useEffect, useState } from 'react';
import { Search, MousePointerClick, Mail, MapPin, Star } from 'lucide-react';
import ServiceLayout, { StepsSection, HeroCtas } from '@/components/service/ServiceLayout';
import { Reveal, SectionHeader } from '@/components/kit';
import { cn } from '@/lib/utils';

const STAGES = [
  { label: 'Get found', width: 100, what: 'SEO, Google Business Profile and content that put you in front of people already searching.', tactics: ['Keyword & competitor research', 'Technical SEO fixes', 'Google Business Profile', 'Local landing pages'] },
  { label: 'Get chosen', width: 78, what: 'Conversion work that turns more of those visitors into calls, bookings and orders.', tactics: ['Landing page rewrites', 'Clear offers & CTAs', 'Reviews & trust signals', 'A/B testing'] },
  { label: 'Get them back', width: 56, what: 'Email, WhatsApp and loyalty flows that bring customers back without paying for them twice.', tactics: ['Welcome & win-back emails', 'WhatsApp broadcasts', 'Offers & loyalty', 'Segmented newsletters'] },
  { label: 'Keep improving', width: 38, what: 'Analytics and a monthly rhythm of looking at the numbers and doing more of what works.', tactics: ['GA4 & Search Console', 'Monthly growth review', 'Experiment backlog', 'Clear dashboards'] },
];

function Funnel() {
  const [i, setI] = useState(0);
  const s = STAGES[i];
  return (
    <section id="work" className="relative scroll-mt-24 py-20 sm:py-28">
      <div className="container-x">
        <SectionHeader eyebrow="How we think about growth" title="Growth comes from four places. Most businesses only work on one." intro="Tap each stage to see what we work on. Most businesses only pull one of these; growth comes from all four." />
        <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr]">
          <Reveal className="flex flex-col items-center gap-2 rounded-[2rem] border border-white/10 bg-[#0b0b0b] p-6 sm:p-10">
            {STAGES.map((x, n) => (
              <button
                key={x.label}
                type="button"
                onClick={() => setI(n)}
                aria-pressed={n === i}
                className={cn(
                  'relative flex h-16 items-center justify-between rounded-2xl px-5 text-left transition-all duration-500 [transition-timing-function:var(--ease-out)] sm:h-20',
                  n === i ? 'bg-gradient-to-r from-a1 to-a2 text-white shadow-[0_10px_40px_-10px_rgb(var(--a2)/0.7)]' : 'bg-white/[0.04] text-white/55 hover:bg-white/[0.08]',
                )}
                style={{ width: `${x.width}%`, minWidth: 220 }}
              >
                <span className="font-mono text-xs opacity-70">0{n + 1}</span>
                <span className="font-display text-lg font-bold sm:text-xl">{x.label}</span>
              </button>
            ))}
          </Reveal>
          <div key={s.label} className="flex flex-col justify-center [animation:svc-in_.6s_var(--ease-out)_both]">
            <p className="text-[13px] text-a3">Stage 0{i + 1}</p>
            <h3 className="display mt-3 text-4xl sm:text-5xl">{s.label}</h3>
            <p className="mt-4 max-w-md leading-relaxed text-white/60">{s.what}</p>
            <ul className="mt-6 grid gap-2 sm:grid-cols-2">
              {s.tactics.map((t) => (
                <li key={t} className="rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-3 text-sm text-white/75">{t}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function SerpPreview() {
  const [name, setName] = useState('Golden Hour Coffee');
  const [city, setCity] = useState('Kandy');
  const [kind, setKind] = useState('café');
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '') || 'yourbusiness';
  return (
    <section className="relative border-t border-white/[0.06] py-24 sm:py-32">
      <div className="container-x grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <div>
          <SectionHeader stacked className="!mb-8" eyebrow="Try it with your business" title="Preview your business on Google." intro="Type your business details and preview how a well-optimised listing could look when someone nearby searches for you." />
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { l: 'Business name', v: name, s: setName },
              { l: 'What you are', v: kind, s: setKind },
              { l: 'City', v: city, s: setCity },
            ].map((f) => (
              <label key={f.l} className="block">
                <span className="mb-1.5 block text-xs text-white/50">{f.l}</span>
                <input value={f.v} onChange={(e) => f.s(e.target.value)} className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-base focus:border-a2/60 focus:outline-none sm:text-sm" />
              </label>
            ))}
          </div>
        </div>
        <Reveal>
          <div className="rounded-[2rem] bg-white p-5 text-[#202124] shadow-2xl sm:p-7">
            <div className="flex items-center gap-3 rounded-full border border-black/10 px-4 py-2.5 shadow-sm">
              <Search className="h-4 w-4 text-[#9aa0a6]" />
              <span className="truncate text-sm">best {kind || 'business'} in {city || 'your city'}</span>
            </div>
            <div className="mt-5 rounded-2xl border border-black/10 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-lg font-medium text-[#1a0dab]">{name || 'Your Business'}</p>
                  <p className="mt-0.5 flex items-center gap-1 text-sm">
                    <span className="font-medium">4.9</span>
                    <span className="flex text-[#fbbc04]">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-current" />)}</span>
                    <span className="text-[#70757a]">(128) · {kind}</span>
                  </p>
                  <p className="mt-0.5 flex items-center gap-1 text-sm text-[#70757a]"><MapPin className="h-3.5 w-3.5" /> {city} · Open now</p>
                </div>
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl">
                  <img src="/images/renders/sm/perf3.webp" alt="" className="h-full w-full object-cover" />
                </div>
              </div>
              <div className="mt-3 flex gap-2 text-xs">
                {['Website', 'Directions', 'Call'].map((b) => (
                  <span key={b} className="rounded-full border border-black/15 px-3 py-1 text-[#1a73e8]">{b}</span>
                ))}
              </div>
            </div>
            <div className="mt-5">
              <p className="text-xs text-[#4d5156]">https://{slug}.lk</p>
              <p className="text-lg text-[#1a0dab]">{name || 'Your Business'}, {kind ? kind[0].toUpperCase() + kind.slice(1) : 'Business'} in {city}</p>
              <p className="text-sm text-[#4d5156]">Visit {name || 'us'} in {city}. See our menu, opening hours and reviews, and book or order online in seconds.</p>
            </div>
            <p className="mt-5 text-center text-[11px] text-black/35">Preview for illustration, ratings shown are placeholders</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

const QUERIES = ['best café in kandy', 'iphone shop near me', 'gym membership kandy', 'bridal salon colombo'];

/** Hero: a search results page where the headline is the number one result. */
function Query({ text, onDone }: { text: string; onDone: () => void }) {
  const { typed, done } = useTyped(text, 70, 400);
  useEffect(() => {
    if (!done) return;
    const id = window.setTimeout(onDone, 2600);
    return () => window.clearTimeout(id);
  }, [done, onDone]);
  return <span className="truncate">{typed}</span>;
}

function Hero() {
  const [q, setQ] = useState(0);
  const next = useCallback(() => setQ((n) => (n + 1) % QUERIES.length), []);

  return (
    <div className="container-x pb-16">
      <div className="max-w-4xl">
        <div className="flex items-center gap-3 rounded-full border border-white/15 bg-white/[0.04] px-5 py-3.5 text-lg">
          <Search className="h-5 w-5 shrink-0 text-white/45" />
          <Query key={q} text={QUERIES[q]} onDone={next} />
          <span className="h-5 w-px animate-pulse bg-a2" />
        </div>
        <p className="mt-5 text-sm text-white/40">Top result</p>
        <div className="mt-3">
          <p className="text-sm text-white/55">https://<span className="text-white/80">yourbusiness.lk</span></p>
          <h1 className="display mt-2 text-balance text-[clamp(2.6rem,5.8vw,5.4rem)] text-a3">SEO and marketing that keeps working after the ad budget runs out.</h1>
          <p className="mt-5 max-w-[56ch] text-lg leading-relaxed text-white/65">
            We get you found on Google and Maps, turn more visitors into calls and bookings, and bring customers back with email and WhatsApp.
          </p>
          <HeroCtas className="mt-8" />
        </div>
        <div className="mt-14 space-y-6 opacity-40" aria-hidden>
          {[0, 1].map((n) => (
            <div key={n} className="space-y-2">
              <div className="h-2.5 w-40 rounded bg-white/20" />
              <div className="h-5 w-[min(28rem,80%)] rounded bg-white/25" />
              <div className="h-2.5 w-[min(36rem,95%)] rounded bg-white/15" />
            </div>
          ))}
          <p className="text-sm">Your competitors, further down the page.</p>
        </div>
      </div>
    </div>
  );
}

export default function MarketingPage() {
  return (
    <ServiceLayout
      slug="marketing"
      hero={<Hero />}
      offeringsTitle="Three things we do every month."
      offerings={[
        { icon: Search, title: 'SEO & local search', text: 'Technical fixes, content and Google Business Profile work that help nearby customers find you first.' },
        { icon: MousePointerClick, title: 'Conversion optimisation', text: 'Sharper pages, offers and forms that get more out of the traffic you already have.' },
        { icon: Mail, title: 'Email & WhatsApp', text: 'Automated flows and campaigns that turn one-time buyers into regulars.' },
      ]}
      faqs={[
        { q: 'How long does SEO take to work?', a: 'Technical fixes can help within weeks, but meaningful ranking gains usually take three to six months. It’s slower than ads, and it keeps working after you stop paying.' },
        { q: 'Do you guarantee first place on Google?', a: 'No honest agency can. We guarantee the work: solid technical foundations, useful content and clear monthly reporting on rankings and traffic.' },
        { q: 'Do I need a new website for this?', a: 'Not necessarily. We start with an audit; sometimes small fixes on your current site are enough, sometimes a rebuild is the better investment.' },
        { q: 'What does a monthly retainer include?', a: 'An agreed set of SEO, content and conversion tasks each month, plus a short report and a review call.' },
      ]}
    >
      <Funnel />
      <SerpPreview />
      <StepsSection
        title="What a month with us looks like"
        steps={[
          { title: 'Audit', text: 'Where you rank, where visitors drop off and what competitors do better.' },
          { title: 'Prioritise', text: 'The few changes with the biggest expected impact go first.' },
          { title: 'Execute', text: 'Fixes, content, pages and flows shipped every month.' },
          { title: 'Review', text: 'Results, learnings and next month’s plan, in plain language.' },
        ]}
      />
    </ServiceLayout>
  );
}
