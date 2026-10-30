import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { SectionHeader, Marquee } from '@/components/kit';

type Case = {
  client: string;
  title: string;
  summary: string;
  services: string[];
  link: { label: string; to: string };
  visual: React.ReactNode;
  tint: string;
};

const CASES: Case[] = [
  {
    client: 'ClickZone Mobiles',
    title: 'An iPhone store that keeps selling after the shutters come down.',
    summary:
      'Online store and launch campaigns for one of Kandy’s go-to iPhone shops. Fast browsing, ordering over WhatsApp and a look that matches the phones.',
    services: ['Web design', 'Development', 'Advertising'],
    link: { label: 'Visit live site', to: 'https://clickzonemobiles.com' },
    tint: 'from-sky-500/20',
    visual: (
      <div className="relative h-full w-full">
        <img src="/images/renders/sm/clickzone.webp" alt="ClickZone Mobiles e-commerce homepage" loading="lazy" className="absolute inset-0 h-full w-full object-cover object-left-top" />
        <img
          src="/images/renders/sm/clickzone-mobile.webp"
          alt="ClickZone Mobiles on mobile"
          loading="lazy"
          className="absolute bottom-[-12%] right-[6%] w-[24%] min-w-[110px] rounded-[1.4rem] border-4 border-[#111] shadow-2xl"
        />
      </div>
    ),
  },
  {
    client: 'Bergamood',
    title: 'A fragrance ad film made without a camera, a studio or a real bottle.',
    summary:
      'A cinematic concept spot and still campaign built entirely in CGI. Smoke, glass, citrus and light, art-directed frame by frame.',
    services: ['3D rendering', 'Motion', 'Ad creative'],
    link: { label: 'See 3D work', to: '/services/3d-rendering' },
    tint: 'from-emerald-500/20',
    visual: (
      <div className="relative h-full w-full">
        <video
          src="/images/video/bergamood.mp4"
          poster="/images/video/bergamood.webp"
          muted
          loop
          playsInline
          autoPlay
          preload="none"
          className="absolute inset-0 h-full w-full object-cover"
          aria-label="Bergamood fragrance CGI ad film"
        />
      </div>
    ),
  },
  {
    client: 'Elkaduwa Springs',
    title: 'Bottled water, shot like a perfume.',
    summary:
      'A full set of product visuals for a mineral water brand: misty glass, mossy forest floors and clean studio shots for packaging, social and print.',
    services: ['3D product visuals', 'Art direction'],
    link: { label: 'See 3D work', to: '/services/3d-rendering' },
    tint: 'from-lime-500/20',
    visual: (
      <div className="grid h-full grid-cols-3 gap-2 p-2">
        {['elkaduwamist', 'elkaduwaskin', 'elkaduwa'].map((n, i) => (
          <img
            key={n}
            src={`/images/renders/sm/${n}.webp`}
            alt="Elkaduwa Springs bottle render"
            loading="lazy"
            className="h-full w-full rounded-xl object-cover"
            style={{ transform: `translateY(${[18, -12, 6][i]}px)` }}
          />
        ))}
      </div>
    ),
  },
  {
    client: 'BodyLab · Golden Hour',
    title: 'Two brands, two personalities, both built for the phone first.',
    summary:
      'A membership-first platform for BodyLab Fitness with schedules and booking, plus Golden Hour Coffee, a hospitality concept exploring a menu-led brand experience.',
    services: ['Web design', 'Development'],
    link: { label: 'Visit live site', to: 'https://bodylabfitness.vercel.app' },
    tint: 'from-a1/25',
    visual: (
      <div className="flex h-full items-center justify-center gap-4 bg-[radial-gradient(circle_at_50%_40%,rgb(var(--a1)/0.25),transparent_60%)] p-6">
        {['bodylab', 'goldencafe'].map((n, i) => (
          <img
            key={n}
            src={`/images/renders/sm/${n}-mobile.webp`}
            alt={`${n === 'bodylab' ? 'BodyLab Fitness' : 'Golden Hour Coffee'} mobile site`}
            loading="lazy"
            className="h-auto w-[38%] max-w-[220px] rounded-[1.6rem] border-4 border-[#111] shadow-2xl"
            style={{ transform: `rotate(${i ? 5 : -4}deg) translateY(${i ? 20 : 0}px)` }}
          />
        ))}
      </div>
    ),
  },
];

const GALLERY = [
  'saraperf', '1', 'perf2', 'watchsevit', 'elkaduwamist', 'pefmouth', 'collageperf', 'perf3',
  'saraa', '3', 'elkaduwa4', 'perfmodel2', 'watch-detail', 'perf-in-mouth', 'collage1', '2',
];

function CaseCard({ c, i }: { c: Case; i: number }) {
  const ref = useRef<HTMLDivElement>(null);
  // scale down slightly as the next card slides over this one
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const next = el.parentElement?.nextElementSibling;
        if (!next) return;
        const top = 96 + i * 16;
        const nTop = next.getBoundingClientRect().top;
        const p = Math.min(1, Math.max(0, 1 - (nTop - top) / (window.innerHeight - top)));
        el.style.transform = `scale(${1 - p * 0.05})`;
        el.style.filter = `brightness(${1 - p * 0.5})`;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [i]);

  const external = c.link.to.startsWith('http');
  const linkCls = 'group mt-8 inline-flex items-center gap-2 self-start text-sm font-semibold';
  const linkInner = (
    <>
      <span className="border-b border-white/30 pb-0.5 transition-colors group-hover:border-a2">{c.link.label}</span>
      <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
    </>
  );

  return (
    <div className="sticky" style={{ top: 96 + i * 16 }}>
      <div
        ref={ref}
        className="relative grid origin-top overflow-hidden rounded-[2rem] border border-white/10 bg-[#090909] will-change-transform lg:min-h-[560px] lg:grid-cols-[0.85fr_1.15fr]"
      >
        <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${c.tint} via-transparent to-transparent opacity-60`} />
        <div className="relative flex flex-col p-7 sm:p-10">
          <p className="text-[15px] font-medium text-a3">{c.client}</p>
          <h3 className="display mt-8 text-balance text-3xl sm:text-4xl lg:mt-auto lg:text-[2.8rem]">{c.title}</h3>
          <p className="mt-4 max-w-md text-pretty leading-relaxed text-white/55">{c.summary}</p>
          <p className="mt-6 text-sm text-white/40">{c.services.join(', ')}</p>
          {external ? (
            <a href={c.link.to} target="_blank" rel="noopener noreferrer" className={linkCls}>
              {linkInner}
            </a>
          ) : (
            <Link to={c.link.to} className={linkCls}>
              {linkInner}
            </Link>
          )}
        </div>
        <div data-cursor={c.client === 'Bergamood' ? 'Watch' : 'View'} className="relative m-2 min-h-[320px] overflow-hidden rounded-[1.6rem] bg-black sm:min-h-[420px] lg:m-3">{c.visual}</div>
      </div>
    </div>
  );
}

export default function SelectedWork() {
  return (
    <section id="work" className="relative scroll-mt-24 pt-24 sm:pt-32">
      <div className="container-x">
        <SectionHeader
          eyebrow="Recent work"
          title="A few things we made recently."
          intro="Websites, CGI films and product visuals. Everything here was designed and built in-house by the three of us."
        />
        <div className="relative space-y-6 pb-8">
          {CASES.map((c, i) => (
            <CaseCard key={c.client} c={c} i={i} />
          ))}
        </div>
      </div>

      <div className="relative mt-20 space-y-4 py-4 [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]">
        {[0, 1].map((row) => (
          <Marquee key={row} duration={70} reverse={row === 1}>
            {GALLERY.slice(row * 8, row * 8 + 8).map((n) => (
              <Link
                key={n}
                to="/services/3d-rendering"
                className="group mr-4 block h-56 w-40 shrink-0 overflow-hidden rounded-2xl border border-white/10 sm:h-72 sm:w-52"
                aria-label="View 3D rendering portfolio" data-cursor="View"
              >
                <img src={`/images/renders/sm/${n}.webp`} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
              </Link>
            ))}
          </Marquee>
        ))}
      </div>
    </section>
  );
}
