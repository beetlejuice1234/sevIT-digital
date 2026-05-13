import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Target, BookOpen, Crown, BarChart3, Shield, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import MobileAccordionCards from '../../components/ui/MobileAccordionCards';
import type { AccordionCardItem } from '../../components/ui/MobileAccordionCards';

gsap.registerPlugin(ScrollTrigger);

const pillars = [
  {
    icon: Crown,
    title: 'THE ICON\nTHAT CONQUERS',
    subtitle: 'Logo Design',
    description: `A logo is the nucleus of your digital existence. We craft vector-perfect, mathematically precise marks engineered for instant recognition. No templates. No recycled concepts. Every curve is calculated for psychological impact. Scalable, timeless, and designed to dominate across every touchpoint. This is where empires begin.`,
    color: '#EC4899',
  },
  {
    icon: BookOpen,
    title: 'THE BRAND BIBLE\nZERO DEVIATION',
    subtitle: 'Style Guides',
    description: `Inconsistent branding is brand suicide. One rogue post can erode your authority. The sevIT Brand Bible is your company's law—governing every pixel, word, and interaction with surgical precision. This isn't just a guide; it's a system that ensures zero dilution and maximum impact across your entire digital empire.`,
    color: '#F472B6',
  },
  {
    icon: Target,
    title: 'STRATEGIC\nWARFARE',
    subtitle: 'Brand Strategy',
    description: `We dissect your market to identify the psychological angles your competitors missed. By mapping the competitive landscape and tearing down existing narratives, we engineer a brand position that makes you the only logical choice. Not the cheapest. Not the flashiest. The inevitable.`,
    color: '#DB2777',
  },
];

const methodologyPoints = [
  { icon: BarChart3, title: 'DATA-DRIVEN DECISIONS', desc: "No guesswork. Every color, font, and layout choice is backed by research." },
  { icon: TrendingUp, title: 'CONVERSION-FOCUSED DESIGN', desc: "Pretty doesn't pay. We engineer visual systems that turn visitors into buyers." },
  { icon: Shield, title: 'COMPETITIVE INTELLIGENCE', desc: "We study your market, identify gaps, and position you to dominate." },
];

function BrandingPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const isVisibleRef = useRef(true);

  // Starfield background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    const stars: { x: number; y: number; size: number; speed: number; opacity: number }[] = [];
    for (let i = 0; i < 80; i++) {
      stars.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, size: Math.random() * 1.5 + 0.5, speed: Math.random() * 0.3 + 0.1, opacity: Math.random() * 0.5 + 0.2 });
    }

    const animate = () => {
      if (!isVisibleRef.current) { animationRef.current = requestAnimationFrame(animate); return; }
      ctx.fillStyle = 'rgba(5, 5, 5, 0.15)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      stars.forEach((star) => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.fill();
        star.y += star.speed;
        if (star.y > canvas.height) { star.y = 0; star.x = Math.random() * canvas.width; }
      });
      animationRef.current = requestAnimationFrame(animate);
    };
    animate();

    const observer = new IntersectionObserver(
      (entries) => { entries.forEach((entry) => { isVisibleRef.current = entry.isIntersecting; }); },
      { threshold: 0 }
    );
    observer.observe(canvas);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', resize);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.hero-line',
        { opacity: 0, y: 100 },
        { opacity: 1, y: 0, duration: 1.2, stagger: 0.2, ease: 'power3.out', delay: 0.3 }
      );
      gsap.fromTo('.hero-sub',
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.9 }
      );
      gsap.fromTo('.hero-cta',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 1.1 }
      );
      gsap.fromTo('.pillar-card',
        { opacity: 0, y: 80 },
        { opacity: 1, y: 0, duration: 1, stagger: 0.2, ease: 'power3.out',
          scrollTrigger: { trigger: '.pillars-section', start: 'top 75%', once: true } }
      );
      gsap.fromTo('.method-point',
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.15, ease: 'power2.out',
          scrollTrigger: { trigger: '.method-section', start: 'top 80%', once: true } }
      );
    });
    return () => ctx.revert();
  }, []);

  // Mobile accordion items for the Three Pillars
  const mobilePillarItems: AccordionCardItem[] = pillars.map((p) => ({
    icon: p.icon,
    title: p.title.replace('\n', ' '),
    subtitle: p.subtitle,
    description: p.description.split('\n\n')[0], // first paragraph only in accordion
    accentColor: p.color,
    accentClass: 'text-pink-500',
    bgClass: 'bg-pink-500/20',
    borderClass: 'border-pink-500/40',
  }));

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-x-hidden">
      <canvas ref={canvasRef} className="fixed inset-0 w-full h-full pointer-events-none z-0" />

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center px-6 lg:px-12 pt-20 z-10">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 30%, rgba(236, 72, 153, 0.15) 0%, transparent 60%)' }} />
        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-pink-500/10 border border-pink-500/30 rounded-full mb-8 md:mb-10">
            <Crown className="w-4 h-4 text-pink-500" />
            <span className="text-xs uppercase tracking-[0.3em] text-pink-400">Brand Engineering</span>
          </div>

          <h1 className="text-6xl sm:text-8xl lg:text-[10rem] font-black leading-[0.85] tracking-tighter mb-8 md:mb-10">
            <span className="hero-line block opacity-0">VISUAL</span>
            <span className="hero-line block text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-rose-500 to-pink-500 opacity-0">
              DOMINANCE
            </span>
          </h1>

          <p className="hero-sub text-base sm:text-lg md:text-xl text-white/60 max-w-3xl mx-auto mb-10 md:mb-12 leading-relaxed opacity-0">
            Your brand is your greatest weapon. We engineer visual systems that command
            authority, outpace competition, and burn into the consumer psyche. While
            others play with colors, we architect digital empires.
          </p>

          <div className="hero-cta opacity-0">
            <Link
              to="/#chat"
              className="inline-flex items-center gap-3 px-8 md:px-10 py-4 md:py-5 bg-pink-500 text-white rounded-full font-bold text-base md:text-lg uppercase tracking-wider hover:bg-white hover:text-black transition-all duration-300 group"
            >
              <span>Initiate Brand Overhaul</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Mobile scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30 md:hidden">
          <span className="text-[10px] uppercase tracking-widest">Scroll</span>
          <div className="w-px h-6 bg-gradient-to-b from-pink-500 to-transparent" />
        </div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 text-white/40">
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-pink-500 to-transparent" />
        </div>
      </section>

      {/* ── THREE PILLARS ─────────────────────────────────────────────────────── */}
      <section className="pillars-section relative py-24 md:py-32 px-6 lg:px-12 z-10 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14 md:mb-20">
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full mb-6">
              <span className="text-xs uppercase tracking-[0.2em] text-white/40">The Foundation</span>
            </span>
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight">
              THE THREE PILLARS
            </h2>
            <p className="text-xl sm:text-2xl md:text-3xl text-pink-500 font-bold mt-2 uppercase tracking-wider">
              Of Market Domination
            </p>
          </div>

          {/* Desktop Pillars */}
          <div className="hidden lg:grid grid-cols-3 gap-8">
            {pillars.map((pillar, index) => {
              const Icon = pillar.icon;
              return (
                <div key={index} className="pillar-card group relative opacity-0 block">
                  <div
                    className="relative h-full p-8 lg:p-10 rounded-3xl bg-white/[0.02] border border-white/10 hover:border-pink-500/50 transition-all duration-500 overflow-hidden"
                    style={{ boxShadow: `0 0 60px ${pillar.color}10` }}
                  >
                    <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity" style={{ background: pillar.color }} />
                    <div className="relative w-16 h-16 rounded-2xl flex items-center justify-center mb-8" style={{ background: `${pillar.color}20` }}>
                      <Icon className="w-8 h-8" style={{ color: pillar.color }} />
                    </div>
                    <span className="text-xs uppercase tracking-[0.2em] mb-4 block" style={{ color: pillar.color }}>{pillar.subtitle}</span>
                    <h3 className="text-3xl lg:text-4xl font-black leading-[0.95] mb-6 whitespace-pre-line">{pillar.title}</h3>
                    <div className="text-white/60 text-sm leading-relaxed whitespace-pre-line">{pillar.description}</div>
                    <div className="absolute bottom-0 left-0 right-0 h-1" style={{ background: `linear-gradient(90deg, transparent, ${pillar.color}, transparent)` }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mobile — Accordion (replaces full-page swipe carousel) */}
          <MobileAccordionCards items={mobilePillarItems} defaultOpenIndex={0} />
        </div>
      </section>

      {/* ── METHODOLOGY ───────────────────────────────────────────────────────── */}
      <section className="method-section relative py-24 md:py-32 px-6 lg:px-12 z-10 border-t border-white/10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight mb-4">
              THE sevIT
            </h2>
            <p className="text-2xl sm:text-3xl md:text-4xl text-pink-500 font-bold uppercase tracking-wider">
              METHODOLOGY
            </p>
            <p className="text-white/40 text-base md:text-lg mt-4 uppercase tracking-widest">
              Why We Crush The Competition
            </p>
          </div>

          <div className="text-center mb-14 md:mb-20">
            <p className="text-lg sm:text-xl md:text-2xl text-white/70 leading-relaxed max-w-4xl mx-auto">
              Most agencies design what "looks cool." We design what <span className="text-pink-500 font-bold">converts</span>.
            </p>
            <p className="text-white/50 leading-relaxed max-w-3xl mx-auto mt-6">
              Every branding decision is backed by market research and psychology. We don't chase trends—we engineer trust, authority, and desire. A sevIT brand is magnetic, lowering acquisition costs and commanding premium pricing by making you the category leader.
            </p>
            <p className="text-xl md:text-2xl font-bold text-white mt-8 uppercase tracking-wider">
              We build digital monuments that outlast market shifts, economic downturns, and competitor attacks.
            </p>
            <p className="text-2xl md:text-3xl font-black text-pink-500 mt-4 uppercase tracking-widest">
              Branding engineered for absolute ROI.
            </p>
          </div>

          {/* Desktop Grid */}
          <div className="hidden md:grid grid-cols-3 gap-8">
            {methodologyPoints.map((point, index) => {
              const Icon = point.icon;
              return (
                <div key={index} className="method-point text-center p-8 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-pink-500/30 hover:bg-white/[0.04] transition-all opacity-0">
                  <div className="w-14 h-14 rounded-xl bg-pink-500/10 flex items-center justify-center mx-auto mb-6">
                    <Icon className="w-7 h-7 text-pink-500" />
                  </div>
                  <h4 className="text-sm font-bold uppercase tracking-wider mb-3">{point.title}</h4>
                  <p className="text-white/50 text-sm leading-relaxed">{point.desc}</p>
                </div>
              );
            })}
          </div>

          {/* Mobile — Stacked cards (all visible, no swiping) */}
          <div className="md:hidden space-y-4">
            {methodologyPoints.map((point, index) => {
              const Icon = point.icon;
              return (
                <div key={index} className="flex items-start gap-4 p-5 rounded-2xl bg-white/[0.03] border border-white/10">
                  <div className="w-12 h-12 rounded-xl bg-pink-500/10 flex items-center justify-center shrink-0">
                    <Icon className="w-6 h-6 text-pink-500" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-wider mb-2 text-white">{point.title}</h4>
                    <p className="text-white/50 text-sm leading-relaxed">{point.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────────────────────────── */}
      <section className="relative py-24 md:py-32 px-6 lg:px-12 z-10 border-t border-white/10 overflow-hidden">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center, rgba(236, 72, 153, 0.25) 0%, transparent 60%)', animation: 'pulse 4s ease-in-out infinite' }}
        />
        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 0.5; transform: translate(-50%, -50%) scale(1); }
            50% { opacity: 0.8; transform: translate(-50%, -50%) scale(1.1); }
          }
        `}</style>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight mb-8">
            THE CHOICE
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-500">
              IS YOURS
            </span>
          </h2>

          <p className="text-base sm:text-lg md:text-xl text-white/60 leading-relaxed max-w-2xl mx-auto mb-6">
            You can keep blending in with a forgettable identity. Or you can step up. 
            sevIT brands don't compete—they <span className="text-white font-semibold">dominate</span>. 
            They command attention, drive revenue, and leave the competition in the minor leagues.
          </p>

          <p className="text-pink-500 font-bold uppercase tracking-widest mb-10 md:mb-12">
            The market rewards the bold. The choice is yours.
          </p>

          <Link
            to="/#chat"
            className="inline-flex items-center gap-3 px-8 md:px-12 py-5 md:py-6 bg-pink-500 text-white rounded-full font-bold text-base md:text-xl uppercase tracking-wider hover:bg-white hover:text-black transition-all duration-300 group"
          >
            <span>Book Your Domination Session</span>
            <ArrowRight className="w-5 md:w-6 h-5 md:h-6 group-hover:translate-x-1 transition-transform" />
          </Link>

          <p className="text-white/30 text-sm mt-8 uppercase tracking-widest">
            Limited availability. We only take on 4 new brand overhauls per month.
          </p>
        </div>
      </section>
    </div>
  );
}

export default BrandingPage;
