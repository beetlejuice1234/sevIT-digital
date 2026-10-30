import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { Reveal, SectionHeader, SpotlightCard, Sparkle } from '@/components/kit';
import { serviceBySlug, type Service } from '@/lib/site';
import { cn } from '@/lib/utils';

function CardShell({ service, className, children, delay = 0 }: { service: Service; className?: string; children: React.ReactNode; delay?: number }) {
  return (
    <Reveal delay={delay} className={className}>
      <SpotlightCard as={Link} to={service.path} className="group flex h-full flex-col">
        <div className="relative min-h-[200px] flex-1 overflow-hidden">{children}</div>
        <div className="relative flex items-end justify-between gap-4 p-6 sm:p-7">
          <div>
            <div className="mb-3 flex flex-wrap gap-1.5">
              {service.tags.map((t) => (
                <span key={t} className="rounded-full border border-white/10 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-white/45">
                  {t}
                </span>
              ))}
            </div>
            <h3 className="font-display text-2xl font-bold tracking-tight">{service.name}</h3>
            <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-white/50">{service.blurb}</p>
          </div>
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/15 transition-all duration-500 group-hover:rotate-45 group-hover:border-transparent group-hover:bg-white group-hover:text-black">
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
      </SpotlightCard>
    </Reveal>
  );
}

/* ─── mini visuals ─── */

function WebVisual() {
  return (
    <div className="absolute inset-x-6 top-6 sm:inset-x-8 sm:top-8">
      <div className="overflow-hidden rounded-xl border border-white/10 bg-[#0c0c0c] shadow-2xl transition-transform duration-700 [transition-timing-function:var(--ease-out)] group-hover:-translate-y-2">
        <div className="flex gap-1.5 border-b border-white/[0.06] px-3 py-2">
          <span className="h-2 w-2 rounded-full bg-white/15" />
          <span className="h-2 w-2 rounded-full bg-white/15" />
          <span className="h-2 w-2 rounded-full bg-white/15" />
        </div>
        <img src="/images/renders/sm/clickzone.webp" alt="ClickZone Mobiles website homepage" loading="lazy" className="w-full" />
      </div>
      <img
        src="/images/renders/sm/clickzone-mobile.webp"
        alt=""
        loading="lazy"
        className="absolute -bottom-24 right-2 w-[26%] rounded-2xl border border-white/15 shadow-2xl transition-transform duration-700 [transition-timing-function:var(--ease-out)] group-hover:-translate-y-6 sm:right-6"
      />
    </div>
  );
}

function PosVisual() {
  const bars = [38, 52, 44, 70, 58, 86, 74];
  return (
    <div className="absolute inset-6 grid grid-cols-[1.1fr_1fr] gap-3 sm:inset-8">
      <div className="rounded-xl border border-white/10 bg-black/50 p-3">
        <p className="font-mono text-[10px] uppercase tracking-wider text-white/40">Today's sales</p>
        <p className="mt-1 font-display text-xl font-bold">Rs 184,250</p>
        <div className="mt-3 flex h-20 items-end gap-1.5">
          {bars.map((h, i) => (
            <span
              key={i}
              className="flex-1 origin-bottom rounded-t bg-gradient-to-t from-red-500/60 to-orange-400 transition-transform duration-700 [transition-timing-function:var(--ease-out)] group-hover:scale-y-110"
              style={{ height: `${h}%`, transitionDelay: `${i * 40}ms` }}
            />
          ))}
        </div>
      </div>
      <div className="space-y-2 rounded-xl border border-white/10 bg-black/50 p-3 text-[11px]">
        {[
          ['Espresso', '650'],
          ['Club sandwich', '1,450'],
          ['Mango juice', '900'],
        ].map(([n, p]) => (
          <div key={n} className="flex justify-between text-white/65">
            <span>{n}</span>
            <span className="font-mono">{p}</span>
          </div>
        ))}
        <div className="flex justify-between border-t border-white/10 pt-2 font-semibold">
          <span>Total</span>
          <span className="font-mono">3,000</span>
        </div>
        <div className="rounded-lg bg-gradient-to-r from-red-500 to-orange-500 py-1.5 text-center font-semibold">Charge</div>
      </div>
    </div>
  );
}

function AIVisual() {
  return (
    <div className="absolute inset-6 flex flex-col justify-center gap-2.5 sm:inset-8">
      <div className="ml-auto max-w-[75%] rounded-2xl rounded-br-md bg-white px-3.5 py-2 text-xs text-black">Do you deliver to Kandy today?</div>
      <div className="flex max-w-[85%] items-start gap-2">
        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-orange-400">
          <Sparkle className="h-3 w-3 [&_path]:fill-white" />
        </span>
        <div className="rounded-2xl rounded-tl-md border border-white/10 bg-white/[0.06] px-3.5 py-2 text-xs text-white/80">
          Yes! Orders before 2pm arrive the same day. Want me to start one for you?
        </div>
      </div>
      <div className="ml-8 flex gap-1">
        {[0, 1, 2].map((i) => (
          <span key={i} className="h-1.5 w-1.5 animate-bounce rounded-full bg-orange-300/70" style={{ animationDelay: `${i * 120}ms` }} />
        ))}
      </div>
    </div>
  );
}

function ImageVisual({ src, alt, position = 'center' }: { src: string; alt: string; position?: string }) {
  return (
    <>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 [transition-timing-function:var(--ease-out)] group-hover:scale-105"
        style={{ objectPosition: position }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/20 to-transparent" />
    </>
  );
}

function GrowthVisual() {
  return (
    <div className="absolute inset-6 sm:inset-8">
      <svg viewBox="0 0 300 140" className="h-full w-full overflow-visible" preserveAspectRatio="none" aria-hidden>
        <defs>
          <linearGradient id="gv-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f97316" stopOpacity=".35" />
            <stop offset="1" stopColor="#f97316" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[35, 70, 105].map((y) => (
          <line key={y} x1="0" x2="300" y1={y} y2={y} stroke="rgba(255,255,255,.06)" />
        ))}
        <path d="M0 120 C40 115 60 100 90 96 S140 90 165 70 S220 50 245 32 S285 14 300 8 L300 140 L0 140Z" fill="url(#gv-fill)" />
        <path
          d="M0 120 C40 115 60 100 90 96 S140 90 165 70 S220 50 245 32 S285 14 300 8"
          fill="none"
          stroke="#fb923c"
          strokeWidth="2.5"
          vectorEffect="non-scaling-stroke"
          className="[stroke-dasharray:420] [stroke-dashoffset:420] [transition:stroke-dashoffset_1.6s_var(--ease-out)] group-hover:[stroke-dashoffset:0] [.is-in_&]:[stroke-dashoffset:0]"
        />
      </svg>
      <div className="absolute right-0 top-0 rounded-xl border border-white/10 bg-black/60 px-3 py-2 backdrop-blur">
        <p className="font-mono text-[10px] uppercase tracking-wider text-white/40">Organic traffic</p>
        <p className="font-display text-lg font-bold text-orange-300">↑ trending</p>
      </div>
    </div>
  );
}

function AdVisual() {
  return (
    <>
      <video
        className="absolute inset-0 h-full w-full object-cover opacity-80 transition-opacity duration-500 group-hover:opacity-100"
        src="/images/video/chocolate.mp4"
        poster="/images/video/chocolate.webp"
        muted
        loop
        playsInline
        preload="none"
        onMouseEnter={(e) => e.currentTarget.play().catch(() => {})}
        onMouseLeave={(e) => e.currentTarget.pause()}
        aria-label="Chocolate bar CGI ad film"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
      <span className="absolute left-6 top-6 flex items-center gap-2 rounded-full border border-white/15 bg-black/50 px-3 py-1 font-mono text-[10px] uppercase tracking-wider backdrop-blur sm:left-8 sm:top-8">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" /> Hover to play
      </span>
    </>
  );
}

export default function ServicesBento() {
  return (
    <section id="services" className="relative scroll-mt-24 py-24 sm:py-32">
      <div className="container-x">
        <SectionHeader
          eyebrow="What we do"
          title={
            <>
              Seven disciplines.
              <br />
              <span className="text-white/40">One team that ships.</span>
            </>
          }
          intro="Most businesses juggle a web agency, a software vendor, a designer and an ads person. We're all of them, working from the same brief."
        />

        <div className="grid auto-rows-[minmax(0,auto)] gap-4 md:grid-cols-6">
          <CardShell service={serviceBySlug('web-design')} className="md:col-span-4 [&_.spotlight]:min-h-[480px]">
            <WebVisual />
          </CardShell>
          <CardShell service={serviceBySlug('software-pos')} className="md:col-span-2 [&_.spotlight]:min-h-[480px]" delay={80}>
            <PosVisual />
          </CardShell>
          <CardShell service={serviceBySlug('3d-rendering')} className="md:col-span-2 [&_.spotlight]:min-h-[440px]">
            <ImageVisual src="/images/renders/sm/saraperf.webp" alt="Fragrance model render" position="50% 30%" />
          </CardShell>
          <CardShell service={serviceBySlug('ai-solutions')} className="md:col-span-2 [&_.spotlight]:min-h-[440px]" delay={80}>
            <AIVisual />
          </CardShell>
          <CardShell service={serviceBySlug('advertising')} className="md:col-span-2 [&_.spotlight]:min-h-[440px]" delay={160}>
            <AdVisual />
          </CardShell>
          <CardShell service={serviceBySlug('branding')} className="md:col-span-3 [&_.spotlight]:min-h-[380px]">
            <ImageVisual src="/images/3dlogo.webp" alt="sevIT 3D brand mark" />
          </CardShell>
          <CardShell service={serviceBySlug('marketing')} className={cn('md:col-span-3 [&_.spotlight]:min-h-[380px]')} delay={80}>
            <GrowthVisual />
          </CardShell>
        </div>
      </div>
    </section>
  );
}
