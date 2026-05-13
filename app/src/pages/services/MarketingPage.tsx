import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Search, Mail, BarChart3, Rocket, Target, TrendingUp, Users, RefreshCw, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';
import MobileAccordionCards from '../../components/ui/MobileAccordionCards';
import type { AccordionCardItem } from '../../components/ui/MobileAccordionCards';
import MobileTimeline from '../../components/ui/MobileTimeline';
import type { TimelineStep } from '../../components/ui/MobileTimeline';

gsap.registerPlugin(ScrollTrigger);

const GREEN = {
  color: 'rgb(16,185,129)',
  accentClass: 'text-emerald-500',
  bgClass: 'bg-emerald-500/20',
  borderClass: 'border-emerald-500/40',
};

// ─── Service Card (Desktop) ───────────────────────────────────────────────────
function ServiceCard({ icon: Icon, title, subtitle, description, bullets }: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle: string;
  description: string;
  bullets: string[];
}) {
  return (
    <div className="group relative bg-white/[0.02] border border-white/10 rounded-3xl p-8 hover:border-emerald-500/50 transition-all duration-500 h-full flex flex-col">
      <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-emerald-500/10 blur-3xl opacity-0 group-hover:opacity-40 transition-opacity" />
      <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 flex items-center justify-center mb-6 shrink-0">
        <Icon className="w-7 h-7 text-emerald-500" />
      </div>
      <span className="text-xs uppercase tracking-[0.2em] text-emerald-400 mb-2 block">{subtitle}</span>
      <h3 className="text-2xl font-bold mb-3">{title}</h3>
      <p className="text-white/50 text-sm mb-6 leading-relaxed">{description}</p>
      <ul className="space-y-3 mt-auto">
        {bullets.map((b, i) => (
          <li key={i} className="flex items-start gap-3 text-sm text-white/70">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
            {b}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── Growth Explainer (desktop 2×2 + mobile 2×2 always-visible grid) ─────────
function GrowthExplainer() {
  const pillars = [
    { icon: TrendingUp, label: 'Get Found', detail: 'Showing up in search results when people are already looking for what you offer.' },
    { icon: Users, label: 'Get Chosen', detail: "Turning website visitors into actual customers by making your site easy to trust and use." },
    { icon: RefreshCw, label: 'Get Them Back', detail: 'Keeping past customers engaged so they buy again — the most efficient revenue you can make.' },
    { icon: BarChart3, label: 'Keep Improving', detail: "Every campaign teaches us something. We use that to make the next one better." },
  ];

  return (
    <>
      {/* Desktop */}
      <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 gap-4">
        {pillars.map((p, i) => {
          const Icon = p.icon;
          return (
            <div key={i} className="flex gap-4 bg-white/[0.02] border border-white/10 rounded-2xl p-5 hover:border-emerald-500/30 transition-all duration-300 group">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <h4 className="font-bold text-sm mb-1 group-hover:text-emerald-400 transition-colors">{p.label}</h4>
                <p className="text-white/45 text-xs leading-relaxed">{p.detail}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile — always-visible 2×2 compact grid */}
      <div className="md:hidden grid grid-cols-2 gap-3 mt-6">
        {pillars.map((p, i) => {
          const Icon = p.icon;
          return (
            <div
              key={i}
              className="flex flex-col gap-3 bg-white/[0.03] border border-white/10 rounded-2xl p-4"
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <Icon className="w-4 h-4 text-emerald-500" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-emerald-400 mb-1">{p.label}</h4>
                <p className="text-white/45 text-xs leading-relaxed">{p.detail}</p>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
function MarketingPage() {
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
      (entries) => { entries.forEach((e) => { isVisibleRef.current = e.isIntersecting; }); },
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
      gsap.fromTo('.service-card',
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out',
          scrollTrigger: { trigger: '.services-section', start: 'top 80%', once: true } }
      );
      gsap.fromTo('.explainer-section',
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: '.explainer-section', start: 'top 80%', once: true } }
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
      title: 'SEO',
      subtitle: 'Get Found Organically',
      description: "When someone searches for what you offer, you want to be there. SEO is the long game — it takes time to build, but once it's working, it brings in customers without you paying per click.",
      bullets: [
        'Figuring out what your customers are actually searching for',
        'Making sure your website loads fast and is easy for Google to read',
        'Writing content that answers real questions and ranks',
        'Building credibility through quality links over time',
      ],
    },
    {
      icon: Target,
      title: 'Conversion Optimization',
      subtitle: 'Turn Visitors Into Customers',
      description: "Getting traffic is only half the battle. If people land on your site and leave without doing anything, something's off. We find out what and fix it.",
      bullets: [
        'Looking at where people are dropping off on your site',
        'Testing different versions of your pages to see what works better',
        'Making your calls-to-action clearer and more compelling',
        'Simplifying the path from "interested" to "bought"',
      ],
    },
    {
      icon: Mail,
      title: 'Email Marketing',
      subtitle: 'Your Most Reliable Channel',
      description: "Email is still one of the highest-ROI marketing channels — because you own the list. We set up flows and campaigns that stay in touch with your customers without being annoying.",
      bullets: [
        'Automated welcome and onboarding sequences',
        'Campaigns that feel personal, not like a newsletter blast',
        'Segmenting your list so the right people get the right message',
        'Re-engaging people who went quiet',
      ],
    },
  ];

  const mobileServiceItems: AccordionCardItem[] = services.map((s) => ({
    icon: s.icon,
    title: s.title,
    subtitle: s.subtitle,
    description: s.description,
    bullets: s.bullets,
    accentColor: GREEN.color,
    accentClass: GREEN.accentClass,
    bgClass: GREEN.bgClass,
    borderClass: GREEN.borderClass,
  }));

  const processSteps = [
    { number: '01', title: 'Understand Where You Are', description: "We start by looking at what you already have — your site, your traffic, your existing content. No point building on a broken foundation." },
    { number: '02', title: 'Identify the Real Opportunities', description: "Not every business needs the same thing. We figure out which channels and tactics will actually move the needle for your specific situation, and prioritize those." },
    { number: '03', title: 'Build and Execute', description: "We put the plan into action — whether that's fixing your site structure, creating content, setting up email flows, or running experiments on your landing pages." },
    { number: '04', title: 'Measure, Learn, Repeat', description: "Growth marketing is an ongoing loop, not a one-time project. We track what's working, cut what isn't, and keep iterating until the numbers are consistently moving in the right direction." },
  ];

  const mobileTimelineSteps: TimelineStep[] = processSteps.map((s) => ({
    ...s,
    accentColor: GREEN.color,
    accentClass: GREEN.accentClass,
    bgClass: GREEN.bgClass,
    borderClass: GREEN.borderClass,
  }));

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-x-hidden">
      <canvas ref={canvasRef} className="fixed inset-0 w-full h-full pointer-events-none z-0" />

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[85vh] flex items-center justify-center px-6 lg:px-12 pt-28 pb-32 md:pt-32 md:pb-40 z-10">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 30%, rgba(16, 185, 129, 0.15) 0%, transparent 60%)' }} />
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full mb-6 md:mb-8">
            <Rocket className="w-4 h-4 text-emerald-500" />
            <span className="text-xs uppercase tracking-[0.3em] text-emerald-400">Growth Marketing</span>
          </div>

          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black leading-[0.9] tracking-tighter mb-6 md:mb-8">
            <span className="hero-line block opacity-0">MORE PEOPLE.</span>
            <span className="hero-line block text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-green-400 opacity-0">
              MORE CUSTOMERS.
            </span>
          </h1>

          <p className="hero-line text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-4 opacity-0 leading-relaxed">
            Growth marketing is the systematic accumulation of audience, authority, and trust. 
            We build assets that consistently convert—not one-off campaigns that fade.
          </p>

          <p className="hero-line text-sm md:text-base text-white/35 max-w-xl mx-auto mb-8 md:mb-10 opacity-0">
            We handle the SEO, CRO, and email strategy so you can focus on scale.
          </p>

          <div className="hero-line opacity-0">
            <Link
              to="/#chat"
              className="inline-flex items-center gap-3 px-7 md:px-8 py-3.5 md:py-4 bg-emerald-500 text-white rounded-full font-bold uppercase tracking-wider hover:bg-white hover:text-black transition-all group text-sm md:text-base"
            >
              <span>Let's Build Your Growth Plan</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Mobile scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30 md:hidden">
          <span className="text-[10px] uppercase tracking-widest">Scroll</span>
          <div className="w-px h-6 bg-gradient-to-b from-emerald-500 to-transparent" />
        </div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 text-white/40">
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-emerald-500 to-transparent" />
        </div>
      </section>

      {/* ── WHAT IS GROWTH MARKETING ──────────────────────────────────────────── */}
      <section className="explainer-section relative py-20 md:py-24 px-6 lg:px-12 z-10 border-t border-white/10">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-12 items-start lg:items-center">
            <div>
              <span className="text-sm text-emerald-400 uppercase tracking-wider">The Short Version</span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mt-3 mb-5">
                What is growth<br />marketing, actually?
              </h2>
              <p className="text-white/50 text-sm leading-relaxed mb-4">
                The world's most visible brands don't appear by accident. They use growth marketing—a systematic combination of channels engineered for compounding returns.
              </p>
              <p className="text-white/50 text-sm leading-relaxed mb-4">
                The key is <span className="text-white">compounding value</span>. The work we do today builds equity that pays off for months.
              </p>
              <p className="text-white/50 text-sm leading-relaxed">
                Unlike paid ads that stop the moment the budget ends, growth assets like search rankings and email lists keep working for you long after the initial setup.
              </p>
            </div>
            <GrowthExplainer />
          </div>
        </div>
      </section>

      {/* ── SERVICES ─────────────────────────────────────────────────────────── */}
      <section className="services-section relative py-20 md:py-24 px-6 lg:px-12 z-10 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10 md:mb-16">
            <span className="text-sm text-emerald-400 uppercase tracking-wider">What We Handle</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mt-2">
              Three channels.<br />One consistent strategy.
            </h2>
            <p className="text-white/40 mt-4 max-w-xl mx-auto text-sm leading-relaxed">
              We focus on the three channels that tend to deliver the best long-term results for growing businesses.
            </p>
          </div>

          {/* Desktop Grid */}
          <div className="hidden md:grid grid-cols-3 gap-6 items-stretch">
            {services.map((service, i) => (
              <div key={i} className="service-card opacity-0 h-full">
                <ServiceCard
                  icon={service.icon}
                  title={service.title}
                  subtitle={service.subtitle}
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

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────────── */}
      <section className="process-section relative py-20 md:py-24 px-6 lg:px-12 z-10 border-t border-white/10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10 md:mb-16">
            <span className="text-sm text-emerald-400 uppercase tracking-wider">How We Work</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mt-2">No mysteries. Just a clear process.</h2>
            <p className="text-white/40 mt-4 max-w-lg mx-auto text-sm leading-relaxed">
              Growth isn't a switch you flip — it's a loop you build. Here's how we build it with you.
            </p>
          </div>

          {/* Desktop List */}
          <div className="hidden md:block space-y-4">
            {processSteps.map((step, i) => (
              <div key={i} className="process-step opacity-0 flex gap-6 bg-white/[0.02] border border-white/10 rounded-2xl p-6 hover:border-emerald-500/30 transition-all duration-300 group">
                <div className="w-14 h-14 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0">
                  <span className="text-xl font-black text-emerald-500">{step.number}</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1 group-hover:text-emerald-400 transition-colors">{step.title}</h3>
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
                <span className="text-sm text-emerald-400 uppercase tracking-wider">The Honest Truth</span>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-black mt-3 mb-5">
                  Growth marketing<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-green-400">
                    isn't magic.
                  </span>
                </h2>
                <p className="text-white/50 text-sm leading-relaxed mb-4">
                  Anyone promising specific traffic or revenue numbers before seeing your data is guessing. Growth depends on your market, your product, and your starting point.
                </p>
                <p className="text-white/50 text-sm leading-relaxed mb-4">
                  We promise a methodical approach: test, measure, learn, and repeat. No busy work. No vanity metrics. No reports full of charts that don't connect to revenue.
                </p>
                <p className="text-white/50 text-sm leading-relaxed">
                  If you're a fit for our systems, we'll tell you honestly. If you're not, we'll tell you that too.
                </p>
              </div>
              <div className="space-y-3 md:space-y-4">
                {[
                  { label: "We focus on the channels that make sense for your specific business", icon: Layers },
                  { label: "You get a clear explanation of what we're doing and why", icon: BarChart3 },
                  { label: "We report on real outcomes — leads and sales, not just traffic", icon: TrendingUp },
                  { label: "We move at a pace that doesn't outrun your ability to handle growth", icon: Rocket },
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div key={i} className="flex items-start gap-4 p-4 bg-white/[0.03] border border-white/10 rounded-xl">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4 text-emerald-500" />
                      </div>
                      <p className="text-sm text-white/70 leading-snug">{item.label}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────────── */}
      <section className="relative py-24 md:py-32 px-6 lg:px-12 z-10 border-t border-white/10 overflow-hidden">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center, rgba(16, 185, 129, 0.18) 0%, transparent 60%)' }}
        />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4">
            Ready to start<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-green-400">
              growing for real?
            </span>
          </h2>
          <p className="text-base md:text-lg text-white/50 mb-3 leading-relaxed">
            Let's look at your business together and figure out where growth marketing can actually make a difference for you — no pitch, no pressure.
          </p>
          <p className="text-sm text-white/30 mb-8 md:mb-10 uppercase tracking-widest">
            Free conversation. Zero obligation.
          </p>
          <Link
            to="/#chat"
            className="inline-flex items-center gap-3 px-8 md:px-10 py-4 md:py-5 bg-emerald-500 text-white rounded-full font-bold text-base md:text-lg uppercase tracking-wider hover:bg-white hover:text-black transition-all group"
          >
            <span>Let's Have That Conversation</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
}

export default MarketingPage;
