import { useEffect, useRef } from 'react';
import { Search, Instagram, Target, LineChart, Heart, MessageCircle, Send, Bookmark } from 'lucide-react';
import ServiceLayout, { StepsSection } from '@/components/service/ServiceLayout';
import { Reveal, SectionHeader, PhoneFrame, Sparkle, Marquee } from '@/components/kit';

function AdPhone({ src, poster, brand, caption, tilt = 0, className }: { src: string; poster: string; brand: string; caption: string; tilt?: number; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause()), { threshold: 0.3 });
    io.observe(v);
    return () => io.disconnect();
  }, []);
  return (
    <PhoneFrame className={className}>
      <div className="relative aspect-[9/19] bg-black" style={{ transform: `rotate(${tilt}deg)` }}>
        <video ref={ref} src={src} poster={poster} muted loop playsInline preload="none" className="absolute inset-0 h-full w-full object-cover" aria-label={`${brand} ad creative`} />
        <div className="absolute inset-x-0 top-0 flex items-center gap-2 bg-gradient-to-b from-black/70 to-transparent p-3 pt-8 text-[11px]">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-a1 to-a2">
            <Sparkle className="h-3 w-3 [&_path]:fill-white" />
          </span>
          <span>
            <span className="block font-semibold leading-tight">{brand}</span>
            <span className="block text-[9px] text-white/60">Sponsored</span>
          </span>
        </div>
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-3 pt-10">
          <div className="mb-2 flex gap-3 text-white/90">
            <Heart className="h-4 w-4" /> <MessageCircle className="h-4 w-4" /> <Send className="h-4 w-4" />
            <Bookmark className="ml-auto h-4 w-4" />
          </div>
          <p className="text-[11px] leading-snug text-white/80">{caption}</p>
          <div className="mt-2 rounded-md bg-white/95 py-1.5 text-center text-[11px] font-semibold text-black">Shop now</div>
        </div>
      </div>
    </PhoneFrame>
  );
}

function Creatives() {
  return (
    <section id="work" className="relative scroll-mt-24 overflow-hidden py-20 sm:py-28">
      <div className="container-x">
        <SectionHeader eyebrow="Ad creative" title={<>Creative that <span className="text-gradient">stops the scroll.</span></>} intro="Most ads fail in the first second. We make CGI and motion creative in-house, so your campaigns look like nobody else’s in the feed." />
        <div className="relative flex items-end justify-center gap-3 sm:gap-6">
          <div className="pointer-events-none absolute inset-x-0 bottom-0 top-1/3 bg-[radial-gradient(ellipse_at_center,rgb(var(--a2)/0.22),transparent_65%)]" />
          <Reveal className="w-[30%] max-w-[250px] translate-y-6">
            <AdPhone src="/images/video/chocolate.mp4" poster="/images/video/chocolate.webp" brand="Choco Bar" caption="Crunch you can hear. New Hazelnut Crunch — out now." />
          </Reveal>
          <Reveal delay={100} className="w-[34%] max-w-[280px]">
            <AdPhone src="/images/video/showreel.mp4" poster="/images/video/showreel.webp" brand="Sound Studio" caption="Silence everything but the music. Pre-order today." />
          </Reveal>
          <Reveal delay={200} className="w-[30%] max-w-[250px] translate-y-6">
            <AdPhone src="/images/video/bergamood.mp4" poster="/images/video/bergamood.webp" brand="Bergamood" caption="Citrus, smoke and a little mischief. The scent of Bergamood." />
          </Reveal>
        </div>
        <p className="mt-14 text-center font-mono text-xs text-white/35">Concept creatives produced by sevIT</p>
      </div>
    </section>
  );
}

const ROWS = [
  { ch: 'Meta · Reels', spend: 42, res: 'Messages', trend: [3, 5, 4, 7, 6, 9, 10] },
  { ch: 'Google Search', spend: 33, res: 'Calls', trend: [4, 4, 6, 5, 7, 7, 8] },
  { ch: 'TikTok', spend: 25, res: 'Site visits', trend: [2, 3, 5, 4, 6, 8, 9] },
];

function Report() {
  return (
    <section className="relative border-t border-white/[0.06] py-24 sm:py-32">
      <div className="container-x grid items-center gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
        <SectionHeader
          className="!mb-0"
          eyebrow="Reporting"
          title={<>Numbers you can <span className="text-white/40">actually read.</span></>}
          intro="Every week you get one simple page: where the money went, what came back and what we’re changing next. No 40-tab spreadsheets."
        />
        <Reveal>
          <div className="rounded-[2rem] border border-white/10 bg-[#0b0b0b] p-5 sm:p-7">
            <div className="flex items-center justify-between">
              <p className="font-display text-lg font-bold">Weekly snapshot</p>
              <span className="rounded-full border border-white/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-white/40">Example</span>
            </div>
            <div className="mt-6 space-y-3">
              {ROWS.map((r) => (
                <div key={r.ch} className="grid grid-cols-[1fr_auto] items-center gap-4 rounded-2xl bg-white/[0.03] p-4 sm:grid-cols-[1.2fr_1fr_auto]">
                  <div>
                    <p className="text-sm font-medium">{r.ch}</p>
                    <p className="text-xs text-white/40">Goal: {r.res}</p>
                  </div>
                  <div className="col-span-2 row-start-2 sm:col-span-1 sm:row-start-auto">
                    <div className="h-2 overflow-hidden rounded-full bg-white/10">
                      <div className="h-full rounded-full bg-gradient-to-r from-a1 to-a2" style={{ width: `${r.spend * 2}%` }} />
                    </div>
                    <p className="mt-1 font-mono text-[10px] text-white/40">{r.spend}% of budget</p>
                  </div>
                  <svg viewBox="0 0 70 24" className="h-6 w-20" aria-hidden>
                    <polyline points={r.trend.map((v, i) => `${i * 11},${24 - v * 2.2}`).join(' ')} fill="none" style={{ stroke: 'rgb(var(--a2))' }} strokeWidth="2" strokeLinejoin="round" />
                  </svg>
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-2xl border border-a2/20 bg-a2/[0.06] p-4 text-sm text-white/75">
              <span className="font-semibold text-a3">Next week:</span> move 10% from Search to Reels, test two new hooks on the hero video.
            </div>
          </div>
        </Reveal>
      </div>
      <div className="mt-20 [mask-image:linear-gradient(90deg,transparent,#000_15%,#000_85%,transparent)]">
        <Marquee duration={30}>
          {['Facebook', 'Instagram', 'TikTok', 'Google Search', 'YouTube', 'Google Maps', 'LinkedIn', 'WhatsApp Business'].map((p) => (
            <span key={p} className="mr-10 font-display text-3xl font-bold tracking-tight text-white/20 sm:text-4xl">
              {p}
            </span>
          ))}
        </Marquee>
      </div>
    </section>
  );
}

function HeroVisual() {
  return (
    <div className="relative mx-auto flex max-w-[480px] items-end justify-center gap-4">
      <div className="w-[46%] -rotate-6 translate-y-6">
        <AdPhone src="/images/video/chocolate.mp4" poster="/images/video/chocolate.webp" brand="Choco Bar" caption="Crunch you can hear." />
      </div>
      <div className="w-[46%] rotate-3">
        <AdPhone src="/images/video/showreel.mp4" poster="/images/video/showreel.webp" brand="Sound Studio" caption="Silence everything but the music." />
      </div>
    </div>
  );
}

export default function AdvertisingPage() {
  return (
    <ServiceLayout
      slug="advertising"
      title={
        <>
          Ads that earn the <span className="text-gradient">second look.</span>
        </>
      }
      intro="Social and search campaigns with scroll-stopping creative, careful targeting and honest reporting — run by the same team that makes the visuals."
      heroVisual={<HeroVisual />}
      offeringsTitle={<>Creative, media <span className="text-white/40">and maths.</span></>}
      offerings={[
        { icon: Instagram, title: 'Social ads', text: 'Facebook, Instagram and TikTok campaigns built around Reels-first creative.' },
        { icon: Search, title: 'Search & Maps', text: 'Google Search and Maps ads that catch people the moment they’re looking for you.' },
        { icon: Target, title: 'Targeting & retargeting', text: 'Audiences built from your customers, site visitors and lookalikes — not guesswork.' },
        { icon: LineChart, title: 'Tracking & reporting', text: 'Pixels, conversions and a weekly one-pager showing exactly what your budget returned.' },
      ]}
      faqs={[
        { q: 'How much should I spend on ads?', a: 'It depends on your goals and market. We’ll suggest a starting budget that’s big enough to learn from, then scale what works.' },
        { q: 'Do you make the ad creative too?', a: 'Yes — that’s our edge. Video, CGI, graphics and copy are all made in-house, so testing new ideas is fast.' },
        { q: 'How soon will I see results?', a: 'Campaigns usually start producing data within days. Expect two to four weeks of testing before performance settles.' },
        { q: 'Who owns the ad accounts?', a: 'You do. We work inside your Business Manager and Google Ads accounts so you keep all the data and history.' },
      ]}
    >
      <Creatives />
      <Report />
      <StepsSection
        title={<>How campaigns <span className="text-white/40">get better.</span></>}
        steps={[
          { title: 'Learn the business', text: 'Customers, margins, seasons and what a good lead is worth to you.' },
          { title: 'Build the campaign', text: 'Tracking, audiences and three or more creative angles.' },
          { title: 'Test, then scale', text: 'Kill what doesn’t work quickly; put budget behind what does.' },
          { title: 'Report every week', text: 'One page, plain language, clear next steps.' },
        ]}
      />
    </ServiceLayout>
  );
}
