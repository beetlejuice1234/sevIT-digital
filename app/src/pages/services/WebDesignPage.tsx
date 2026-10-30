import { useState } from 'react';
import { ArrowUpRight, Gauge, Smartphone, Search, ShoppingBag, LayoutTemplate, Wrench, Check } from 'lucide-react';
import ServiceLayout, { StepsSection } from '@/components/service/ServiceLayout';
import { BrowserFrame, PhoneFrame, Reveal, SectionHeader, Marquee } from '@/components/kit';
import { cn } from '@/lib/utils';

const PROJECTS = [
  {
    name: 'ClickZone Mobiles',
    type: 'E-commerce',
    url: 'clickzonemobiles.com',
    href: 'https://clickzonemobiles.com',
    text: 'iPhone retail store with product catalogue, live stock, WhatsApp ordering and warranty info — designed to feel as premium as the phones it sells.',
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
    text: 'A concept project exploring a menu-led brand experience for a specialty café — warm, editorial and quick to order from.',
    desktop: null,
    mobile: '/images/renders/sm/goldencafe-mobile.webp',
  },
];

const STACK = ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Vite', 'Node.js', 'Supabase', 'PostgreSQL', 'Vercel', 'Shopify', 'WordPress', 'GSAP', 'Three.js'];

const INCLUDED = [
  'Custom design — no recycled templates',
  'Mobile-first, tested on real devices',
  'Technical SEO, sitemap & structured data',
  'Analytics and conversion tracking',
  'Fast hosting with SSL and backups',
  'CMS or simple editing where you need it',
  'WhatsApp, booking & payment integrations',
  'Training and 30 days of post-launch support',
];

function HeroVisual() {
  return (
    <div className="relative mx-auto max-w-[620px] pb-10">
      <BrowserFrame url="clickzonemobiles.com" className="float-slow [--r:-1deg]">
        <img src="/images/renders/sm/clickzone.webp" alt="ClickZone Mobiles website designed by sevIT" className="w-full" fetchPriority="high" />
      </BrowserFrame>
      <PhoneFrame className="absolute -bottom-2 -right-2 w-[30%] min-w-[120px] sm:-right-8">
        <img src="/images/renders/sm/bodylab-mobile.webp" alt="BodyLab Fitness mobile website" className="w-full" />
      </PhoneFrame>
      <div className="absolute -left-4 bottom-6 hidden rounded-2xl border border-white/10 bg-black/70 px-4 py-3 backdrop-blur-xl sm:block">
        <p className="font-mono text-[10px] uppercase tracking-wider text-white/40">Built with</p>
        <p className="mt-1 text-sm font-medium">React · TypeScript · Tailwind</p>
      </div>
    </div>
  );
}

function ProjectSwitcher() {
  const [i, setI] = useState(0);
  const p = PROJECTS[i];
  return (
    <section id="work" className="relative scroll-mt-24 py-20 sm:py-28">
      <div className="container-x">
        <SectionHeader eyebrow="Recent builds" title={<>Websites that do <span className="text-gradient">real work.</span></>} />
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
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_30%_20%,rgba(249,115,22,0.18),transparent_60%)] p-4 sm:p-10">
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
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-orange-300">{p.type}</p>
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
          <SectionHeader className="!mb-8" eyebrow="Every build" title={<>The boring stuff, <span className="text-white/40">done properly.</span></>} intro="The details most agencies skip are the ones that decide whether a site actually ranks, loads and converts." />
        </div>
        <ul className="grid gap-3 sm:grid-cols-2">
          {INCLUDED.map((x, i) => (
            <Reveal as="li" key={x} delay={i * 50} className="flex items-start gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 text-sm text-white/75">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-orange-400">
                <Check className="h-3 w-3" />
              </span>
              {x}
            </Reveal>
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
      title={
        <>
          Websites that <span className="text-gradient">sell</span> while you sleep.
        </>
      }
      intro="Custom-designed, fast and search-ready websites and web apps — from a sharp one-page presence to full e-commerce. Built by the same people who design them."
      heroVisual={<HeroVisual />}
      offeringsTitle={<>From landing page <span className="text-white/40">to full platform.</span></>}
      offerings={[
        { icon: LayoutTemplate, title: 'Business websites', text: 'Polished multi-page sites that explain what you do and turn visitors into enquiries.' },
        { icon: ShoppingBag, title: 'E-commerce', text: 'Online stores with catalogues, carts, payments, delivery options and WhatsApp ordering.' },
        { icon: Smartphone, title: 'Web apps & portals', text: 'Booking systems, member areas, dashboards and internal tools that run in the browser.' },
        { icon: Search, title: 'SEO foundations', text: 'Clean structure, metadata, schema and speed so Google understands and ranks your pages.' },
        { icon: Gauge, title: 'Performance tuning', text: 'Optimised images, code-splitting and caching for sites that load fast on any connection.' },
        { icon: Wrench, title: 'Care & updates', text: 'Ongoing changes, monitoring and improvements after launch, so the site never goes stale.' },
      ]}
      faqs={[
        { q: 'How long does a website take?', a: 'A focused business site usually takes 2–4 weeks from kickoff to launch. E-commerce and custom web apps take longer depending on features — we give you a clear timeline before we start.' },
        { q: 'How much does a website cost?', a: 'It depends on the number of pages, features and integrations. We quote a fixed price after a short discovery call so there are no surprises.' },
        { q: 'Will I be able to update the site myself?', a: 'Yes. Where you need it we add simple content editing, and we walk you through it at handover. We can also handle updates for you.' },
        { q: 'Do you handle domains and hosting?', a: 'We can set up and manage your domain, hosting, SSL and business email, or work with what you already have.' },
        { q: 'Can you redesign my existing website?', a: 'Absolutely. We audit what you have, keep what works (including your search rankings) and rebuild the rest.' },
      ]}
    >
      <ProjectSwitcher />
      <Included />
      <StepsSection
        title={<>How a site comes together.</>}
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
