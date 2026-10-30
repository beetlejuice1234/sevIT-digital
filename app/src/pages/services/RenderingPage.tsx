import { useCallback, useEffect, useState } from 'react';
import { Box, Camera, Building, Film, X, ChevronLeft, ChevronRight } from 'lucide-react';
import ServiceLayout, { StepsSection } from '@/components/service/ServiceLayout';
import { Reveal, SectionHeader } from '@/components/kit';
import VideoCard from '@/components/kit/VideoCard';
import { cn } from '@/lib/utils';
import { getLenis } from '@/lib/lenis';

type Shot = { file: string; full: string; title: string; tag: string };
const sm = (f: string) => `/images/renders/sm/${f.replace(/ /g, '-')}.webp`;
const full = (f: string) => `/images/renders/${f}.webp`;

const SHOTS: Shot[] = [
  { file: 'saraperf', title: 'Virtual product shoot', tag: 'Fragrance · Lifestyle' },
  { file: 'perf1', title: 'Bergamood, concept ad', tag: 'Studio · Dramatic' },
  { file: 'elkaduwamist', title: 'Elkaduwa Springs', tag: 'Product · Beverage' },
  { file: 'watchsevit', title: 'Watch, hero shot', tag: 'Micro-detail · Luxury' },
  { file: 'saraprfu', title: 'Fragrance campaign, concept', tag: 'Fragrance · Editorial' },
  { file: '1', title: 'Grooming campaign', tag: 'Model · Splash' },
  { file: 'collageperf', title: 'Botanical skincare, concept', tag: 'Packaging · Collage' },
  { file: 'pefmouth', title: 'Bergamood, bold', tag: 'Beauty · Editorial' },
  { file: 'elkaduwaskin', title: 'Elkaduwa, forest floor', tag: 'Product · Nature' },
  { file: 'watch-detail', title: 'Watch, material study', tag: 'Mechanics · Detail' },
  { file: 'origamiinterior', title: 'Origami interior', tag: 'Architecture · Spatial' },
  { file: 'perf3', title: 'Luxury fragrance, mood', tag: 'Warm · Ambient' },
  { file: 'perfmodel2', title: 'Botanical skincare, model', tag: 'Fashion · Colour' },
  { file: '3', title: 'Grooming, close-up', tag: 'Model · Product' },
  { file: 'elkaduwa4', title: 'Elkaduwa, flat lay', tag: 'Product · Studio' },
  { file: 'saraa', title: 'Fragrance, portrait', tag: 'Model · Natural light' },
].map((s) => ({ ...s, full: full(s.file), file: sm(s.file) }));

function Lightbox({ index, onClose, onMove }: { index: number; onClose: () => void; onMove: (d: number) => void }) {
  const s = SHOTS[index];
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onMove(1);
      if (e.key === 'ArrowLeft') onMove(-1);
    };
    window.addEventListener('keydown', onKey);
    document.documentElement.style.overflow = 'hidden';
    getLenis()?.stop();
    return () => {
      window.removeEventListener('keydown', onKey);
      document.documentElement.style.overflow = '';
      getLenis()?.start();
    };
  }, [onClose, onMove]);

  return (
    <div role="dialog" aria-modal="true" aria-label={s.title} className="fixed inset-0 z-[80] flex flex-col bg-black/95 backdrop-blur-xl [animation:svc-in_.4s_var(--ease-out)_both]" onClick={onClose}>
      <div className="flex items-center justify-between p-4 sm:p-6">
        <div>
          <p className="font-medium">{s.title}</p>
          <p className="font-mono text-xs text-white/40">{s.tag} · {index + 1}/{SHOTS.length}</p>
        </div>
        <button type="button" onClick={onClose} className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 hover:bg-white/10" aria-label="Close">
          <X className="h-5 w-5" />
        </button>
      </div>
      <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-6 sm:px-20">
        <img key={s.full} src={s.full} alt={`${s.title}, 3D render by sevIT`} className="max-h-full max-w-full rounded-xl object-contain [animation:svc-in_.5s_var(--ease-out)_both]" onClick={(e) => e.stopPropagation()} />
        {[-1, 1].map((d) => (
          <button
            key={d}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onMove(d);
            }}
            aria-label={d < 0 ? 'Previous' : 'Next'}
            className={cn('absolute top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/60 hover:bg-white/10', d < 0 ? 'left-3 sm:left-6' : 'right-3 sm:right-6')}
          >
            {d < 0 ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
          </button>
        ))}
      </div>
    </div>
  );
}

function Gallery() {
  const [open, setOpen] = useState<number | null>(null);
  const move = useCallback((d: number) => setOpen((i) => (i === null ? i : (i + d + SHOTS.length) % SHOTS.length)), []);
  const close = useCallback(() => setOpen(null), []);
  return (
    <section id="work" className="relative scroll-mt-24 py-20 sm:py-28">
      <div className="container-x">
        <SectionHeader eyebrow="Recent renders" title="None of these products were ever in front of a camera." intro="Tap any image to see it full size." />
        <div className="columns-2 gap-3 sm:gap-4 lg:columns-4">
          {SHOTS.map((s, i) => (
            <Reveal key={s.file} delay={(i % 4) * 70} className="mb-3 break-inside-avoid sm:mb-4">
              <button type="button" onClick={() => setOpen(i)} className="group relative block w-full overflow-hidden rounded-2xl border border-white/[0.08]" aria-label={`Open ${s.title}`}>
                <img src={s.file} alt={`${s.title}, ${s.tag}`} loading="lazy" className="w-full transition-transform [transition-duration:1.2s] [transition-timing-function:var(--ease-out)] group-hover:scale-[1.06]" />
                <span className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/0 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <span className="absolute inset-x-0 bottom-0 translate-y-3 p-4 text-left opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                  <span className="block text-sm font-semibold">{s.title}</span>
                  <span className="block text-[13px] text-a3">{s.tag}</span>
                </span>
              </button>
            </Reveal>
          ))}
        </div>
      </div>
      {open !== null && <Lightbox index={open} onClose={close} onMove={move} />}
    </section>
  );
}

function Films() {
  return (
    <section className="relative border-t border-white/[0.06] py-24 sm:py-32">
      <div className="container-x">
        <SectionHeader eyebrow="Films" title="We animate them too." intro="CGI ad films for social, web and screens, complete with sound design." />
        <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
          <div className="grid gap-4">
            <Reveal><VideoCard src="/images/video/bergamood.mp4" poster="/images/video/bergamood.webp" title="Bergamood" tag="Fragrance · Concept film" aspect="aspect-[1280/550]" /></Reveal>
            <Reveal delay={80}><VideoCard src="/images/video/chocolate.mp4" poster="/images/video/chocolate.webp" title="Choco bar" tag="FMCG · Character ad" /></Reveal>
          </div>
          <Reveal delay={160}><VideoCard src="/images/video/showreel.mp4" poster="/images/video/showreel.webp" title="Headphones" tag="Tech · Product reveal" aspect="aspect-[600/1024]" className="h-full" /></Reveal>
        </div>
      </div>
    </section>
  );
}

function HeroVisual() {
  return (
    <div className="relative mx-auto grid max-w-[520px] grid-cols-2 gap-3">
      <img src={sm('perf1')} alt="Bergamood fragrance render" className="mt-14 w-full rounded-2xl border border-white/10 shadow-2xl" fetchPriority="high" />
      <img src={sm('watchsevit')} alt="Luxury watch render" className="w-full rounded-2xl border border-white/10 shadow-2xl" fetchPriority="high" />
      <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-full border border-white/15 bg-black/70 px-4 py-2 text-xs backdrop-blur-xl">
        <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" /> 100% CGI, no photoshoot
      </div>
    </div>
  );
}

export default function RenderingPage() {
  return (
    <ServiceLayout
      slug="3d-rendering"
      title={
        <>
          Photoreal product visuals, without a photoshoot.
        </>
      }
      intro="Photoreal 3D renders and AI-assisted virtual ads for fragrance, beverage, tech and lifestyle brands. Any angle, any setting, any season, without a studio, crew or shipping samples."
      heroVisual={<HeroVisual />}
      offeringsTitle="Once your product is in 3D, every new campaign is quicker."
      offeringsIntro="Once your product exists in 3D, every new campaign, colourway or format is a render away."
      offerings={[
        { icon: Box, title: 'Product visuals', text: 'Hero shots, packshots and close-ups with true-to-life glass, liquid, metal and fabric.' },
        { icon: Camera, title: 'Virtual photoshoots', text: 'Your product in lifestyle scenes and with models, art-directed like a real campaign.' },
        { icon: Building, title: 'Architecture & interiors', text: 'Spaces visualised before they’re built, for pre-sales, listings and approvals.' },
        { icon: Film, title: 'Motion & ad films', text: 'Animated reveals and short ad films sized for Reels, TikTok, YouTube and screens.' },
      ]}
      faqs={[
        { q: 'What do you need from us to start?', a: 'Photos of the product from a few angles, dimensions and any packaging artwork. If you have CAD or design files, even better.' },
        { q: 'Are these real photos or AI images?', a: 'They’re built in 3D and composited by our team, sometimes with AI-assisted elements like backgrounds or models. Your product itself is modelled accurately so labels and shapes stay true.' },
        { q: 'How long does a render project take?', a: 'A set of product stills usually takes 1–2 weeks. Animated films depend on length and complexity.' },
        { q: 'Can we reuse the 3D model later?', a: 'Yes, that’s the big win. New angles, scenes and seasonal campaigns are faster and cheaper once the model exists.' },
      ]}
    >
      <Gallery />
      <Films />
      <StepsSection
        title="From your photos to a finished campaign"
        steps={[
          { title: 'Brief & references', text: 'Mood, angles, formats and where the visuals will live.' },
          { title: 'Modelling', text: 'Product built accurately in 3D, labels and materials matched.' },
          { title: 'Lighting & scenes', text: 'Art direction, lighting and environments, reviewed as drafts.' },
          { title: 'Final delivery', text: 'High-res stills and films, cropped for every channel.' },
        ]}
      />
    </ServiceLayout>
  );
}
