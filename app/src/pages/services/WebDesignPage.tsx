import useTyped from '@/lib/useTyped';
import { useState } from 'react';
import { ArrowUpRight, Gauge, Smartphone, Search, ShoppingBag, LayoutTemplate, Wrench } from 'lucide-react';
import ServiceLayout, { StepsSection, HeroCtas } from '@/components/service/ServiceLayout';
import { BrowserFrame, PhoneFrame, SectionHeader, Marquee } from '@/components/kit';
import { cn } from '@/lib/utils';

const PROJECTS = [
  {
    name: 'ClickZone Mobiles',
    type: 'E-commerce',
    url: 'clickzonemobiles.com',
    href: 'https://clickzonemobiles.com',
    text: 'iPhone retail store with product catalogue, live stock, WhatsApp ordering and warranty info, designed to feel as premium as the phones it sells.',
    desktop: '/images/renders/sm/clickzone.webp',
    mobile: '/images/renders/sm/clickzone-mobile.webp',
  },
  {
    name: 'BodyLab Fitness',
    type: 'Fitness platform',
    url: 'bodylabfitness.vercel.app',
    href: 'https://bodylabfitness.vercel.app',
    text: 'A bold, membership-first site for a fitness network with programmes, transformations and booking that works one-handed.',
    desktop: null,
    mobile: '/images/renders/sm/bodylab-mobile.webp',
  },
  {
    name: 'Golden Hour Coffee',
    type: 'Hospitality concept',
    url: 'goldencafe.vercel.app',
    href: 'https://goldencafe.vercel.app',
    text: 'A concept project exploring a menu-led brand experience for a specialty café, warm, editorial and quick to order from.',
    desktop: null,
    mobile: '/images/renders/sm/goldencafe-mobile.webp',
  },
];

const STACK = ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Vite', 'Node.js', 'Supabase', 'PostgreSQL', 'Vercel', 'Shopify', 'WordPress', 'GSAP', 'Three.js'];

const INCLUDED = [
  'Custom design, no recycled templates',
  'Mobile-first, tested on real devices',
  'Technical SEO, sitemap & structured data',
  'Analytics and conversion tracking',
  'Fast hosting with SSL and backups',
  'CMS or simple editing where you need it',
  'WhatsApp, booking & payment integrations',
  'Training and 30 days of post-launch support',
];

/** Hero: the page itself is a website being built, in a browser window. */
function Hero() {
  const { typed, done } = useTyped('yourbusiness.lk', 90, 500);
  return (
    <div className="container-x pb-12">
      <div className="overflow-hidden rounded-[1.6rem] border border-white/15 bg-[#080808]/90 shadow-[0_40px_120px_-40px_rgb(var(--a2)/0.5)] backdrop-blur [animation:svc-in_.9s_var(--ease-out)_both]">
        <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
          <div className="flex gap-1.5">
            <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
            <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
            <span className="h-3 w-3 rounded-full bg-[#28c840]" />
          </div>
          <div className="mx-auto flex w-full max-w-md items-center gap-2 rounded-full bg-white/[0.06] px-4 py-1.5 text-sm text-white/60">
            <span className="text-white/35">https://</span>
            <span className="text-white">{typed}</span>
            <span className={done ? 'hidden' : 'h-4 w-px animate-pulse bg-a2'} />
          </div>
        </div>
        <div className="grid gap-8 p-6 sm:p-10 lg:grid-cols-12 lg:gap-10 lg:p-14">
          <h1 className="display text-balance text-[clamp(2.6rem,5.6vw,5.2rem)] lg:col-span-7">Websites and online stores, designed and coded in-house.</h1>
          <div className="lg:col-span-5 lg:pt-3">
            <p className="max-w-[44ch] text-lg leading-relaxed text-white/65">
              From a sharp one-page site to a full online store. Fast, easy to find on Google, and built by the same people who design it.
            </p>
            <HeroCtas className="mt-8" />
          </div>
        </div>
        <div className="relative h-[200px] overflow-hidden border-t border-white/10 sm:h-[280px]" data-cursor="View">
          <img src="/images/renders/sm/clickzone.webp" alt="ClickZone Mobiles website, built by sevIT" className="web-scroll absolute inset-x-0 top-0 w-full object-cover object-top" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
          <p className="absolute bottom-5 left-6 text-sm text-white/70 sm:left-10">Live now: <a href="https://clickzonemobiles.com" target="_blank" rel="noopener noreferrer" className="text-white underline decoration-a2 underline-offset-4">clickzonemobiles.com</a></p>
          <div className="absolute -bottom-24 right-6 w-[110px] sm:right-12 sm:w-[150px]">
            <PhoneFrame><img src="/images/renders/sm/bodylab-mobile.webp" alt="BodyLab Fitness mobile site" className="w-full" /></PhoneFrame>
          </div>
        </div>
      </div>
      <style>{`@keyframes web-scroll { 0%, 15% { transform: translateY(0) } 85%, 100% { transform: translateY(-35%) } } .web-scroll { animation: web-scroll 12s ease-in-out infinite alternate }`}</style>
    </div>
  );
}

function ProjectSwitcher() {
  const [i, setI] = useState(0);
  const p = PROJECTS[i];
  return (
    <section id="work" className="relative scroll-mt-24 py-20 sm:py-28">
      <div className="container-x">
        <SectionHeader eyebrow="Recent work" title="Some sites we’ve built" />
        <div role="tablist" aria-label="Projects" className="no-scrollbar mb-8 flex gap-2 overflow-x-auto">
          {PROJECTS.map((x, n) => (
            <button
              key={x.name}
              role="tab"
              aria-selected={n === i}
              onClick={() => setI(n)}
              className={cn(
                'shrink-0 rounded-full border px-5 py-2.5 text-sm transition-all duration-300',
                n === i ? 'border-white bg-white text-black' : 'border-white/10 text-white/60 hover:border-white/30 hover:text-white',
              )}
            >
              {x.name}
            </button>
          ))}
        </div>

        <div key={p.name} role="tabpanel" className="grid gap-8 lg:grid-cols-[1.5fr_1fr] [animation:svc-in_.7s_var(--ease-out)_both]">
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_30%_20%,rgb(var(--a2)/0.18),transparent_60%)] p-4 sm:p-10">
            {p.desktop ? (
              <div className="relative pb-8">
                <BrowserFrame url={p.url}>
                  <img src={p.desktop} alt={`${p.name} homepage`} className="w-full" loading="lazy" />
                </BrowserFrame>
                <PhoneFrame className="absolute -bottom-2 right-4 w-[24%] min-w-[100px]">
                  <img src={p.mobile} alt={`${p.name} on mobile`} className="w-full" loading="lazy" />
                </PhoneFrame>
              </div>
            ) : (
              <div className="flex justify-center py-4">
                <PhoneFrame className="w-[min(280px,70%)]">
                  <img src={p.mobile} alt={`${p.name} on mobile`} className="w-full" loading="lazy" />
                </PhoneFrame>
              </div>
            )}
          </div>
          <div className="flex flex-col justify-center">
            <p className="text-[13px] text-a3">{p.type}</p>
            <h3 className="display mt-4 text-4xl sm:text-5xl">{p.name}</h3>
            <p className="mt-5 leading-relaxed text-white/60">{p.text}</p>
            <a href={p.href} target="_blank" rel="noopener noreferrer" className="btn btn-ghost group mt-8 self-start">
              Open live site
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Included() {
  return (
    <section className="relative border-t border-white/[0.06] py-24 sm:py-32">
      <div className="container-x grid gap-12 lg:grid-cols-2 lg:gap-20">
        <div>
          <SectionHeader stacked className="!mb-8" eyebrow="Every build" title="What every site gets, whatever the budget" intro="The details most agencies skip are the ones that decide whether a site actually ranks, loads and converts." />
        </div>
        <ul className="grid gap-x-8 sm:grid-cols-2">
          {INCLUDED.map((x) => (
            <li key={x} className="border-t border-white/10 py-4 text-[17px] text-white/80">
              {x}
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-20 [mask-image:linear-gradient(90deg,transparent,#000_15%,#000_85%,transparent)]">
        <Marquee duration={35}>
          {STACK.map((s) => (
            <span key={s} className="mr-3 rounded-full border border-white/10 bg-white/[0.03] px-5 py-2.5 font-mono text-sm text-white/55">
              {s}
            </span>
          ))}
        </Marquee>
      </div>
    </section>
  );
}

export default function WebDesignPage() {
  return (
    <ServiceLayout
      slug="web-design"
      hero={<Hero />}
      offeringsTitle="From a one-page site to a full online store."
      offerings={[
        { icon: LayoutTemplate, title: 'Business websites', text: 'Polished multi-page sites that explain what you do and turn visitors into enquiries.' },
        { icon: ShoppingBag, title: 'E-commerce', text: 'Online stores with catalogues, carts, payments, delivery options and WhatsApp ordering.' },
        { icon: Smartphone, title: 'Web apps & portals', text: 'Booking systems, member areas, dashboards and internal tools that run in the browser.' },
        { icon: Search, title: 'SEO foundations', text: 'Clean structure, metadata, schema and speed so Google understands and ranks your pages.' },
        { icon: Gauge, title: 'Performance tuning', text: 'Optimised images, code-splitting and caching for sites that load fast on any connection.' },
        { icon: Wrench, title: 'Care & updates', text: 'Ongoing changes, monitoring and improvements after launch, so the site never goes stale.' },
      ]}
      faqs={[
        { q: 'How long does a website take?', a: 'A focused business site usually takes 2–4 weeks from kickoff to launch. E-commerce and custom web apps take longer depending on features, we give you a clear timeline before we start.' },
        { q: 'How much does a website cost?', a: 'It depends on the number of pages, features and integrations. We quote a fixed price after a short discovery call so there are no surprises.' },
        { q: 'Will I be able to update the site myself?', a: 'Yes. Where you need it we add simple content editing, and we walk you through it at handover. We can also handle updates for you.' },
        { q: 'Do you handle domains and hosting?', a: 'We can set up and manage your domain, hosting, SSL and business email, or work with what you already have.' },
        { q: 'Can you redesign my existing website?', a: 'Absolutely. We audit what you have, keep what works (including your search rankings) and rebuild the rest.' },
      ]}
    >
      <ProjectSwitcher />
      <Included />
      <StepsSection
        title="How a site comes together"
        steps={[
          { title: 'Discovery', text: 'Goals, audience, competitors and the pages you actually need.' },
          { title: 'Wireframes', text: 'Structure and user journeys mapped out before any visuals.' },
          { title: 'Design', text: 'High-fidelity screens in your brand, reviewed together.' },
          { title: 'Build', text: 'Clean, fast code with weekly previews on a live link.' },
          { title: 'Launch', text: 'Go-live, analytics, search console and handover.' },
        ]}
      />
    </ServiceLayout>
  );
}
