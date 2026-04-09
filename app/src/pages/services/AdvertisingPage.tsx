import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, TrendingUp, Search, Share2, Target, Zap, MousePointer, BarChart2, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';
import MobileAccordionCards from '../../components/ui/MobileAccordionCards';
import type { AccordionCardItem } from '../../components/ui/MobileAccordionCards';
import MobileTimeline from '../../components/ui/MobileTimeline';
import type { TimelineStep } from '../../components/ui/MobileTimeline';
import MobileFlipCards from '../../components/ui/MobileFlipCards';
import type { FlipCardItem } from '../../components/ui/MobileFlipCards';

gsap.registerPlugin(ScrollTrigger);

// ─── Shared accent config ────────────────────────────────────────────────────
const RED = {
  color: 'rgb(239,68,68)',
  accentClass: 'text-red-500',
  bgClass: 'bg-red-500/20',
  borderClass: 'border-red-500/40',
};

// ─── Service Card  (Desktop only) ────────────────────────────────────────────
function ServiceCard({ icon: Icon, title, description, bullets }: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  bullets: string[];
}) {
  return (
    <div className="group relative bg-white/[0.02] border border-white/10 rounded-3xl p-8 hover:border-red-500/50 transition-all duration-500 overflow-hidden h-full flex flex-col">
      <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-red-500/20 blur-3xl opacity-0 group-hover:opacity-30 transition-opacity" />
      <div className="w-14 h-14 rounded-2xl bg-red-500/20 flex items-center justify-center mb-6">
        <Icon className="w-7 h-7 text-red-500" />
      </div>
      <h3 className="text-2xl font-bold mb-3">{title}</h3>
      <p className="text-white/50 text-sm mb-6 leading-relaxed">{description}</p>
      <ul className="space-y-3">
        {bullets.map((b, i) => (
          <li key={i} className="flex items-center gap-3 text-sm text-white/70">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
            {b}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── WhyAdsFailSection (desktop list + mobile flip cards) ────────────────────
function WhyAdsFailSection() {
  const reasons = [
    { problem: 'Targeting everyone', fix: 'Narrow, intent-based audiences', icon: Target },
    { problem: 'Set-it-and-forget-it campaigns', fix: 'Ongoing weekly optimization', icon: Zap },
    { problem: 'No creative testing', fix: 'Multiple ad variants, data picks the winner', icon: Layers },
    { problem: 'Clicks without conversions', fix: 'Landing pages built around the ad message', icon: MousePointer },
    { problem: 'Vanity metrics (likes, reach)', fix: 'Focus on leads, sales, and real ROI', icon: BarChart2 },
  ];

  // Mobile flip card data
  const flipItems: FlipCardItem[] = reasons.map((r) => ({
    icon: r.icon,
    problem: r.problem,
    solution: r.fix,
    accentClass: RED.accentClass,
    bgClass: 'bg-red-500/10',
    iconBgClass: 'bg-white/5',
  }));

  return (
    <>
      {/* Desktop */}
      <div className="hidden md:block space-y-4">
        {reasons.map((r, i) => {
          const Icon = r.icon;
          return (
            <div key={i} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-0 bg-white/[0.02] border border-white/10 rounded-2xl p-5 group hover:border-red-500/30 transition-all duration-300">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-white/40" />
                </div>
                <span className="text-white/40 text-sm line-through decoration-red-500/60">{r.problem}</span>
              </div>
              <div className="hidden sm:flex items-center justify-center w-10 shrink-0">
                <ArrowRight className="w-5 h-5 text-red-500" />
              </div>
              <div className="flex-1 min-w-0 pl-12 sm:pl-0">
                <span className="text-white text-sm font-medium">{r.fix}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile — flip cards */}
      <MobileFlipCards items={flipItems} />
    </>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
function AdvertisingPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const isVisibleRef = useRef(true);

  // Starfield background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const stars: { x: number; y: number; size: number; speed: number; opacity: number }[] = [];
    for (let i = 0; i < 80; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.5 + 0.5,
        speed: Math.random() * 0.3 + 0.1,
        opacity: Math.random() * 0.5 + 0.2,
      });
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
        { opacity: 0, y: 80 },
        { opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: 'power3.out', delay: 0.3 }
      );
      gsap.fromTo('.platform-card',
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out',
          scrollTrigger: { trigger: '.platforms-section', start: 'top 80%', once: true } }
      );
      gsap.fromTo('.why-section',
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: '.why-section', start: 'top 80%', once: true } }
      );
      gsap.fromTo('.process-step',
        { opacity: 0, x: -30 },
        { opacity: 1, x: 0, duration: 0.7, stagger: 0.15, ease: 'power3.out',
          scrollTrigger: { trigger: '.process-section', start: 'top 80%', once: true } }
      );
    });
    return () => ctx.revert();
  }, []);

  // ── Data ──────────────────────────────────────────────────────────────────
  const services = [
    {
      icon: Search,
      title: 'Google & Search Ads',
      description: 'People searching for what you sell are already warm leads. We make sure your ad is the first thing they see — and that clicking it actually leads somewhere worth clicking.',
      bullets: [
        'Keyword research focused on buying intent',
        'Search, Shopping & YouTube placements',
        'Ad copy written to get the click and the sale',
        'Bid strategy tuned for efficiency, not just traffic',
      ],
    },
    {
      icon: Share2,
      title: 'Social Media Ads',
      description: 'Meta and TikTok have absurd targeting power — most brands just use it badly. We build audiences around the people most likely to actually care about your product.',
      bullets: [
        'Facebook, Instagram & TikTok campaigns',
        'Creative testing to find what actually works',
        'Lookalike audiences built from real buyer data',
        'Retargeting people who already showed interest',
      ],
    },
    {
      icon: Target,
      title: 'Strategy & Reporting',
      description: "You'll always know exactly where your money is going and what it's returning. No confusing dashboards — just clear, honest reporting and a direct line to us.",
      bullets: [
        'Monthly performance reviews, plain-English',
        'Budget allocation recommendations',
        'A/B testing with documented results',
        'Full transparency, no hidden spend',
      ],
    },
  ];

  // Mobile accordion items
  const mobileServiceItems: AccordionCardItem[] = services.map((s) => ({
    icon: s.icon,
    title: s.title,
    description: s.description,
    bullets: s.bullets,
    accentColor: RED.color,
    accentClass: RED.accentClass,
    bgClass: RED.bgClass,
    borderClass: RED.borderClass,
  }));

  const processSteps = [
    { number: '01', title: 'We Learn Your Business', description: "Before we write a single ad, we want to understand who your customers are, what makes them buy, and what your competitors are doing wrong. Good ads start with good homework." },
    { number: '02', title: 'We Build the Campaign', description: 'We set up your campaign structure, write the copy, design the creative direction, and configure targeting — all with a clear goal in mind, not just to spend your budget.' },
    { number: '03', title: 'We Test, Then Scale', description: "We run multiple versions of your ads to see what resonates, then pour more budget into the winners and cut what isn't earning its keep. No guessing — just data." },
    { number: '04', title: 'We Keep You in the Loop', description: "You get regular updates on what's performing, what we're changing, and why. If something isn't working, we tell you before you have to ask." },
  ];

  // Mobile timeline steps
  const mobileTimelineSteps: TimelineStep[] = processSteps.map((s) => ({
    ...s,
    accentColor: 'rgb(245,158,11)',
    accentClass: 'text-amber-500',
    bgClass: 'bg-amber-500/20',
    borderClass: 'border-amber-500/40',
  }));

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-x-hidden">
      <canvas ref={canvasRef} className="fixed inset-0 w-full h-full pointer-events-none z-0" />

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[85vh] flex items-center justify-center px-6 lg:px-12 pt-28 pb-32 md:pt-32 md:pb-40 z-10">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 50% 30%, rgba(239, 68, 68, 0.15) 0%, transparent 60%)' }}
        />
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-full mb-6 md:mb-8">
            <TrendingUp className="w-4 h-4 text-red-500" />
            <span className="text-xs uppercase tracking-[0.3em] text-red-400">Performance Advertising</span>
          </div>

          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black leading-[0.9] tracking-tighter mb-6 md:mb-8">
            <span className="hero-line block opacity-0">ADS THAT</span>
            <span className="hero-line block text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500 opacity-0">
              ACTUALLY WORK.
            </span>
          </h1>

          <p className="hero-line text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-4 opacity-0 leading-relaxed">
            Most ad agencies charge a lot and report on metrics that don't mean anything to your bottom line.
            We focus on the numbers that matter: leads, sales, and how much you're getting back on every dollar you spend.
          </p>

          <p className="hero-line text-sm md:text-base text-white/35 max-w-xl mx-auto mb-8 md:mb-10 opacity-0">
            No fluff. No locked-in retainers before we've proven ourselves. Just focused, honest advertising work.
          </p>

          <div className="hero-line opacity-0">
            <Link
              to="/#chat"
              className="inline-flex items-center gap-3 px-7 md:px-8 py-3.5 md:py-4 bg-red-500 text-white rounded-full font-bold uppercase tracking-wider hover:bg-white hover:text-black transition-all group text-sm md:text-base"
            >
              <span>Let's Talk About Your Ads</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Mobile scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30 md:hidden">
          <span className="text-[10px] uppercase tracking-widest">Scroll</span>
          <div className="w-px h-6 bg-gradient-to-b from-red-500 to-transparent" />
        </div>
        {/* Desktop scroll hint */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 text-white/40">
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-red-500 to-transparent" />
        </div>
      </section>

      {/* ── WHAT WE DO ───────────────────────────────────────────────────────── */}
      <section className="platforms-section relative py-20 md:py-24 px-6 lg:px-12 z-10 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10 md:mb-16">
            <span className="text-sm text-red-400 uppercase tracking-wider">What We Handle</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mt-2">
              We Run Your Ads.<br />You Run Your Business.
            </h2>
            <p className="text-white/40 mt-4 max-w-xl mx-auto text-sm leading-relaxed">
              Advertising is overwhelming to manage on top of everything else. Here's what we take off your plate.
            </p>
          </div>

          {/* Desktop Grid */}
          <div className="hidden md:grid grid-cols-3 gap-6 items-stretch">
            {services.map((service, i) => (
              <div key={i} className="platform-card opacity-0 h-full">
                <ServiceCard
                  icon={service.icon}
                  title={service.title}
                  description={service.description}
                  bullets={service.bullets}
                />
              </div>
            ))}
          </div>

          {/* Mobile — Accordion */}
          <MobileAccordionCards items={mobileServiceItems} />
        </div>
      </section>

      {/* ── WHY ADS FAIL ─────────────────────────────────────────────────────── */}
      <section className="why-section relative py-20 md:py-24 px-6 lg:px-12 z-10 border-t border-white/10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10 md:mb-12">
            <span className="text-sm text-red-400 uppercase tracking-wider">The Real Problem</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mt-2">
              Why Most Ad Spend<br />Goes Nowhere
            </h2>
            <p className="text-white/40 mt-4 max-w-lg mx-auto text-sm leading-relaxed">
              These are the most common mistakes we see — not attacking anyone, just being honest about what doesn't work and what we do differently.
            </p>
          </div>
          <WhyAdsFailSection />
        </div>
      </section>

      {/* ── PROCESS ──────────────────────────────────────────────────────────── */}
      <section className="process-section relative py-20 md:py-24 px-6 lg:px-12 z-10 border-t border-white/10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10 md:mb-16">
            <span className="text-sm text-amber-400 uppercase tracking-wider">How We Work</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mt-2">From Day One to Results</h2>
            <p className="text-white/40 mt-4 max-w-lg mx-auto text-sm leading-relaxed">
              No mysterious black boxes. Here's exactly how we run your advertising from start to finish.
            </p>
          </div>

          {/* Desktop List */}
          <div className="hidden md:block space-y-4">
            {processSteps.map((step, i) => (
              <div key={i} className="process-step opacity-0 flex gap-6 bg-white/[0.02] border border-white/10 rounded-2xl p-6 hover:border-amber-500/30 transition-all duration-300 group">
                <div className="w-14 h-14 rounded-xl bg-amber-500/20 flex items-center justify-center shrink-0">
                  <span className="text-xl font-black text-amber-500">{step.number}</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1 group-hover:text-amber-400 transition-colors">{step.title}</h3>
                  <p className="text-sm text-white/50 leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile — Timeline */}
          <MobileTimeline steps={mobileTimelineSteps} />
        </div>
      </section>

      {/* ── HONEST PITCH ─────────────────────────────────────────────────────── */}
      <section className="relative py-20 md:py-24 px-6 lg:px-12 z-10 border-t border-white/10">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-8 lg:p-12 backdrop-blur-sm">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div>
                <span className="text-sm text-red-400 uppercase tracking-wider">Why sevIT</span>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-black mt-3 mb-5">
                  We're a small team.<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">
                    That's the point.
                  </span>
                </h2>
                <p className="text-white/50 text-sm leading-relaxed mb-4">
                  Big agencies have account coordinators and layers of management between you and the person actually running your ads.
                  With us, the people you talk to are the same people doing the work.
                </p>
                <p className="text-white/50 text-sm leading-relaxed mb-4">
                  We're selective about who we work with because we want every campaign we run to actually perform.
                  A bad result doesn't just hurt your business — it hurts ours.
                </p>
                <p className="text-white/50 text-sm leading-relaxed">
                  If you're looking for cheap campaign management on autopilot, we're not the right fit.
                  If you want a team that's genuinely invested in your results, let's talk.
                </p>
              </div>
              <div className="space-y-3 md:space-y-4">
                {[
                  { label: 'You talk directly to whoever is working your account', icon: '👤' },
                  { label: "We tell you when something isn't working before you notice", icon: '📊' },
                  { label: 'No confusing reports — just clear numbers and what they mean', icon: '✅' },
                  { label: "We only take on work we're confident we can deliver on", icon: '🎯' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 bg-white/[0.03] border border-white/10 rounded-xl">
                    <span className="text-xl shrink-0">{item.icon}</span>
                    <p className="text-sm text-white/70 leading-snug">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────────── */}
      <section className="relative py-24 md:py-32 px-6 lg:px-12 z-10 border-t border-white/10 overflow-hidden">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center, rgba(239, 68, 68, 0.18) 0%, transparent 60%)' }}
        />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4">
            Not Sure If Your<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">
              Ads Are Working?
            </span>
          </h2>
          <p className="text-base md:text-lg text-white/50 mb-3 leading-relaxed">
            Let's take a look together. We'll give you an honest assessment of what's going on with your current ad spend — no sales pitch, no pressure.
          </p>
          <p className="text-sm text-white/30 mb-8 md:mb-10 uppercase tracking-widest">
            Free. No obligation. Real feedback.
          </p>
          <Link
            to="/#chat"
            className="inline-flex items-center gap-3 px-8 md:px-10 py-4 md:py-5 bg-red-500 text-white rounded-full font-bold text-base md:text-lg uppercase tracking-wider hover:bg-white hover:text-black transition-all group"
          >
            <span>Get a Free Ad Review</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
}

export default AdvertisingPage;
