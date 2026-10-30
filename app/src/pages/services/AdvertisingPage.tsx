import { useEffect, useRef } from 'react';
import { Search, Instagram, Target, LineChart, Heart, MessageCircle, Send, Bookmark, Music2, ThumbsUp, Share2, MoreVertical } from 'lucide-react';
import ServiceLayout, { StepsSection, HeroCtas } from '@/components/service/ServiceLayout';
import { Reveal, SectionHeader, PhoneFrame, Sparkle, Marquee } from '@/components/kit';
import VideoCard from '@/components/kit/VideoCard';

/** Plays while on screen, pauses when scrolled away. */
function useAutoplay() {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause()), { threshold: 0.3 });
    io.observe(v);
    return () => io.disconnect();
  }, []);
  return ref;
}

const Avatar = () => (
  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-a2">
    <Sparkle tone="black" className="h-3.5 w-3.5" />
  </span>
);

/* Each ad is shown in the app layout that matches its shape, so nothing is cropped. */

/** Portrait video → full-screen Reel / TikTok. */
function ReelPhone({ src, poster, brand, caption }: { src: string; poster: string; brand: string; caption: string }) {
  const ref = useAutoplay();
  return (
    <PhoneFrame>
      <div className="relative aspect-[9/19] bg-black">
        <video ref={ref} src={src} poster={poster} muted loop playsInline preload="none" className="absolute inset-0 h-full w-full object-cover" aria-label={`${brand} reel`} />
        <p className="absolute inset-x-0 top-8 text-center text-[11px] font-semibold">Reels</p>
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/85 to-transparent p-3 pt-16">
          <div className="flex items-center gap-2 text-[11px] font-semibold">
            <Avatar /> {brand} <span className="rounded border border-white/40 px-1.5 py-0.5 text-[9px] font-medium">Follow</span>
          </div>
          <p className="mt-2 text-[11px] leading-snug text-white/85">{caption}</p>
          <p className="mt-1.5 flex items-center gap-1 text-[10px] text-white/60"><Music2 className="h-3 w-3" /> Original audio · Sponsored</p>
        </div>
        <div className="absolute bottom-24 right-2 flex flex-col items-center gap-3 text-white/90">
          <Heart className="h-5 w-5" /><MessageCircle className="h-5 w-5" /><Send className="h-5 w-5" />
        </div>
      </div>
    </PhoneFrame>
  );
}

/** 16:9 video → YouTube in-stream ad, video sits at its real ratio on top. */
function YouTubePhone({ src, poster, brand, title }: { src: string; poster: string; brand: string; title: string }) {
  const ref = useAutoplay();
  return (
    <PhoneFrame>
      <div className="flex aspect-[9/19] flex-col bg-[#0f0f0f] pt-7 text-[11px]">
        <div className="relative aspect-video w-full bg-black">
          <video ref={ref} src={src} poster={poster} muted loop playsInline preload="none" className="absolute inset-0 h-full w-full object-contain" aria-label={`${brand} YouTube ad`} />
          <span className="absolute bottom-1.5 left-1.5 rounded-sm bg-[#f2c94c] px-1 text-[9px] font-bold text-black">Ad</span>
          <span className="absolute bottom-1.5 right-1.5 rounded-sm bg-black/70 px-1.5 py-0.5 text-[9px]">Skip in 5</span>
        </div>
        <div className="space-y-2 p-3">
          <p className="font-semibold leading-snug">{title}</p>
          <div className="flex items-center gap-2"><Avatar /><span className="font-medium">{brand}</span><span className="text-white/50">Sponsored</span></div>
          <div className="flex gap-2 pt-1 text-[10px]">
            <span className="flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1"><ThumbsUp className="h-3 w-3" /> 1.2K</span>
            <span className="flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1"><Share2 className="h-3 w-3" /> Share</span>
          </div>
          <div className="rounded-full bg-[#3ea6ff] py-1.5 text-center text-[11px] font-semibold text-black">Shop now</div>
        </div>
        <div className="mt-auto space-y-2 p-3 opacity-40">
          {[0, 1].map((n) => (
            <div key={n} className="flex gap-2"><div className="h-10 w-16 rounded bg-white/15" /><div className="flex-1 space-y-1"><div className="h-2 rounded bg-white/15" /><div className="h-2 w-2/3 rounded bg-white/10" /></div><MoreVertical className="h-3 w-3" /></div>
          ))}
        </div>
      </div>
    </PhoneFrame>
  );
}

/** Wide cinematic video → Instagram / Facebook feed post. */
function FeedPhone({ src, poster, brand, caption }: { src: string; poster: string; brand: string; caption: string }) {
  const ref = useAutoplay();
  return (
    <PhoneFrame>
      <div className="flex aspect-[9/19] flex-col bg-black pt-7 text-[11px]">
        <p className="px-3 pb-2 font-display text-base font-bold">Instagram</p>
        <div className="flex items-center gap-2 px-3 py-2"><Avatar /><span><span className="block font-semibold leading-tight">{brand}</span><span className="block text-[9px] text-white/55">Sponsored</span></span><MoreVertical className="ml-auto h-3.5 w-3.5" /></div>
        <div className="relative aspect-[1280/550] w-full bg-black">
          <video ref={ref} src={src} poster={poster} muted loop playsInline preload="none" className="absolute inset-0 h-full w-full object-cover" aria-label={`${brand} feed ad`} />
        </div>
        <div className="flex items-center justify-between bg-a2 px-3 py-2 text-[11px] font-semibold text-black">Shop now <span>›</span></div>
        <div className="flex gap-3 px-3 py-2"><Heart className="h-4 w-4" /><MessageCircle className="h-4 w-4" /><Send className="h-4 w-4" /><Bookmark className="ml-auto h-4 w-4" /></div>
        <p className="px-3 leading-snug text-white/85"><span className="font-semibold">{brand}</span> {caption}</p>
        <div className="mt-auto space-y-2 p-3 opacity-40">
          <div className="flex items-center gap-2"><div className="h-7 w-7 rounded-full bg-white/15" /><div className="h-2 w-24 rounded bg-white/15" /></div>
          <div className="h-24 rounded bg-white/10" />
        </div>
      </div>
    </PhoneFrame>
  );
}

const ADS = {
  reel: <ReelPhone src="/images/video/showreel.mp4" poster="/images/video/showreel.webp" brand="Sound Studio" caption="Silence everything but the music. Pre-order today." />,
  youtube: <YouTubePhone src="/images/video/chocolate.mp4" poster="/images/video/chocolate.webp" brand="Choco Bar" title="Crunch you can hear. The new Hazelnut Crunch is here." />,
  feed: <FeedPhone src="/images/video/bergamood.mp4" poster="/images/video/bergamood.webp" brand="Bergamood" caption="Citrus, smoke and a little mischief." />,
};

/** Hero: headline across the top, three phones rising out of the bottom edge. */
function Hero() {
  return (
    <div className="container-x">
      <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
        <h1 className="display text-balance text-[clamp(2.8rem,6.4vw,6rem)] lg:col-span-8">Ads people stop scrolling for.</h1>
        <div className="lg:col-span-4">
          <p className="max-w-[40ch] text-lg leading-relaxed text-white/65">Meta, TikTok and Google campaigns with video and CGI we make ourselves, and a plain-English report every week.</p>
          <HeroCtas className="mt-6" />
        </div>
      </div>
      <div className="no-scrollbar relative -mx-5 mt-14 flex snap-x gap-4 overflow-x-auto px-5 pb-4 sm:mx-0 sm:h-[min(56vw,520px)] sm:items-start sm:justify-center sm:gap-8 sm:overflow-hidden sm:px-0 sm:pb-0">
        <div className="ad-rise w-[250px] shrink-0 snap-center sm:w-[30%] sm:max-w-[250px] sm:pt-16" style={{ animationDelay: '.15s' }}>{ADS.youtube}</div>
        <div className="ad-rise w-[250px] shrink-0 snap-center sm:w-[33%] sm:max-w-[270px]">{ADS.reel}</div>
        <div className="ad-rise w-[250px] shrink-0 snap-center sm:w-[30%] sm:max-w-[250px] sm:pt-16" style={{ animationDelay: '.3s' }}>{ADS.feed}</div>
      </div>
      <p className="mt-3 text-sm text-white/40 sm:hidden">Swipe to see all three formats</p>
      <style>{`@keyframes ad-rise { from { transform: translateY(120px); opacity: 0 } to { transform: none; opacity: 1 } } .ad-rise { animation: ad-rise 1.1s var(--ease-out) both }`}</style>
    </div>
  );
}

function Films() {
  return (
    <section id="work" className="relative scroll-mt-24 py-20 sm:py-28">
      <div className="container-x">
        <SectionHeader eyebrow="Our ads, full size" title="Made in-house, from the first frame to the last." intro="CGI and motion we produce ourselves, so testing a new idea takes days, not a reshoot." />
        <div className="grid items-start gap-4 lg:grid-cols-2">
          <Reveal><VideoCard src="/images/video/bergamood.mp4" poster="/images/video/bergamood.webp" title="Bergamood" tag="Fragrance, concept film" aspect="aspect-[1280/550]" /></Reveal>
          <Reveal delay={80}><VideoCard src="/images/video/chocolate.mp4" poster="/images/video/chocolate.webp" title="Choco Bar" tag="Snack, character ad" aspect="aspect-video" /></Reveal>
        </div>
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
          stacked className="!mb-0"
          eyebrow="Reporting"
          title="One page a week on what your budget did."
          intro="Every week you get one simple page: where the money went, what came back and what we’re changing next. No 40-tab spreadsheets."
        />
        <Reveal>
          <div className="rounded-[2rem] border border-white/10 bg-[#0b0b0b] p-5 sm:p-7">
            <div className="flex items-center justify-between">
              <p className="font-display text-lg font-bold">Weekly snapshot</p>
              <span className="rounded-full border border-white/10 px-2.5 py-1 text-[13px] text-white/40">Example</span>
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

export default function AdvertisingPage() {
  return (
    <ServiceLayout
      slug="advertising"
      hero={<Hero />}
      offeringsTitle="Everything a campaign needs, under one roof."
      offerings={[
        { icon: Instagram, title: 'Social ads', text: 'Facebook, Instagram and TikTok campaigns built around Reels-first creative.' },
        { icon: Search, title: 'Search & Maps', text: 'Google Search and Maps ads that catch people the moment they’re looking for you.' },
        { icon: Target, title: 'Targeting & retargeting', text: 'Audiences built from your customers, site visitors and lookalikes, not guesswork.' },
        { icon: LineChart, title: 'Tracking & reporting', text: 'Pixels, conversions and a weekly one-pager showing exactly what your budget returned.' },
      ]}
      faqs={[
        { q: 'How much should I spend on ads?', a: 'It depends on your goals and market. We’ll suggest a starting budget that’s big enough to learn from, then scale what works.' },
        { q: 'Do you make the ad creative too?', a: 'Yes, that’s our edge. Video, CGI, graphics and copy are all made in-house, so testing new ideas is fast.' },
        { q: 'How soon will I see results?', a: 'Campaigns usually start producing data within days. Expect two to four weeks of testing before performance settles.' },
        { q: 'Who owns the ad accounts?', a: 'You do. We work inside your Business Manager and Google Ads accounts so you keep all the data and history.' },
      ]}
    >
      <Films />
      <Report />
      <StepsSection
        title="How a campaign gets better each week"
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
