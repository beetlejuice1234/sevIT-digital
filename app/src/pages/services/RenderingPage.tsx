import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Box, Layers, Sparkles, Camera, Cpu, Globe, Play, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import MobileAccordionCards from '../../components/ui/MobileAccordionCards';
import type { AccordionCardItem } from '../../components/ui/MobileAccordionCards';

gsap.registerPlugin(ScrollTrigger);

const VIOLET = {
  color: 'rgb(139,92,246)',
  accentClass: 'text-violet-500',
  bgClass: 'bg-violet-500/20',
  borderClass: 'border-violet-500/40',
};

const showcaseItems = [
  {
    id: 1,
    title: 'VIRTUAL PRODUCT SHOOT',
    tag: 'Fragrance • Lifestyle',
    description: 'Model and product composited in a single cohesive scene — editorial-grade fragrance advertising.',
    image: '/images/renders/saraperf.png',
    rotation: -2,
    glow: 'rgba(120, 180, 120, 0.5)',
    fit: 'cover' as const,
  },
  {
    id: 2,
    title: 'FRAGRANCE PERFECTION',
    tag: 'Luxury • Detail',
    description: 'Glass, liquid, and metallic materials rendered at photographic fidelity.',
    image: '/images/renders/collageperf3.png',
    rotation: 1.5,
    glow: 'rgba(99, 102, 241, 0.5)',
    fit: 'cover' as const,
  },
  {
    id: 3,
    title: 'ORIGAMI INTERIOR',
    tag: 'Architecture • Spatial',
    description: 'Spatial storytelling that sells the feeling of being there before the space exists.',
    image: '/images/renders/origamiinterior.png',
    rotation: -1.5,
    glow: 'rgba(245, 158, 11, 0.45)',
    fit: 'cover' as const,
  },
  {
    id: 4,
    title: 'PERFUME MODEL',
    tag: 'PBR • Caustics',
    description: 'Precise caustic lighting and subsurface scattering on luxury perfume bottles.',
    image: '/images/renders/perfmodel2.png',
    rotation: 2.5,
    glow: 'rgba(244, 63, 94, 0.45)',
    fit: 'cover' as const,
  },
  {
    id: 5,
    title: 'ELKADUWA SPRINGS',
    tag: 'Product • Lifestyle',
    description: 'Premium water bottle brand imagery — clean composition, studio-quality lighting.',
    image: '/images/renders/elkaduwa4.png',
    rotation: -2,
    glow: 'rgba(6, 182, 212, 0.45)',
    fit: 'cover' as const,
  },
  {
    id: 6,
    title: 'TOM FORD — LOST CHERRY',
    tag: 'Luxury • Mood',
    description: 'Warm ambient storytelling with reflective surfaces and botanical elements.',
    image: '/images/renders/perf3.png',
    rotation: 1,
    glow: 'rgba(190, 70, 70, 0.5)',
    fit: 'cover' as const,
  },
  {
    id: 7,
    title: 'THE SCENT OF BERGAMOOD',
    tag: 'Studio • Dramatic',
    description: 'Dark moody product photography with atmospheric smoke and citrus elements.',
    image: '/images/renders/perf1.png',
    rotation: -1,
    glow: 'rgba(52, 211, 153, 0.45)',
    fit: 'cover' as const,
  },
  {
    id: 8,
    title: 'WATCH — MATERIAL STUDY',
    tag: 'Micro-Detail • Jewellery',
    description: 'Every scratch, reflection, and bevelled edge rendered to absolute perfection.',
    image: '/images/renders/watch-detail.png',
    rotation: 1.5,
    glow: 'rgba(251, 191, 36, 0.5)',
    fit: 'cover' as const,
  },
];

const services = [
  {
    icon: Box,
    title: 'PRODUCT VISUALS',
    subtitle: 'Show Every Detail',
    description: `We create materials that look exactly like the real thing. Whether it's the subtle reflection on brushed metal or the precise way light passes through glass, we nail the details so you don't have to hire a photographer.\n\nWe make sure your product looks its absolute best from every single angle.`,
  },
  {
    icon: Globe,
    title: 'ARCHITECTURE & SPACES',
    subtitle: 'Build The Vibe',
    description: `We can build an entire room, building, or landscape before a single brick is actually laid. \n\nIt's not just about showing the layout; it's about making people feel what it's like to actually stand in that space, using lighting and composition to capture the perfect mood.`,
  },
  {
    icon: Play,
    title: 'MOTION & ANIMATION',
    subtitle: 'Bring It To Life',
    description: `Static images are great, but showing your product in motion is what really grabs attention. \n\nWe animate everything from simple, clean product spins to complex, dynamic reveals that would be incredibly difficult (and expensive) to shoot in real life.`,
  },
];

const methodologyPoints = [
  { icon: Cpu, title: 'SMART WORKFLOWS', desc: "We keep our files clean and optimized so you get your renders delivered on time, every time." },
  { icon: Camera, title: 'EYE FOR DESIGN', desc: "We don't just light a scene; we craft an atmosphere that makes your product shine." },
  { icon: Zap, title: 'BUILT TO SELL', desc: "Our visuals aren't just pretty pictures—they're designed to make people want to buy." },
];

const korloffImages = [
  '/images/renders/saraperf.png',
  '/images/renders/saraa.png',
  '/images/renders/saraprfu.png',
  '/images/renders/3.png',
  '/images/renders/perf in mouth.png',
  '/images/renders/perfmodel2.png',
];
const fragranceImages = [
  '/images/renders/collageperf.png',
  '/images/renders/collage1.png',
];
const elkaduwaImages = [
  '/images/renders/elkaduwa4.png',
  '/images/renders/elkaduwamist.png',
];

function RenderingPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const isVisibleRef = useRef(true);
  const masonryRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [korloffIdx, setKorloffIdx] = useState(0);
  const [fragranceIdx, setFragranceIdx] = useState(0);
  const [elkaduwaIdx, setElkaduwaIdx] = useState(0);

  const korloffTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const fragranceTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const elkaduwaTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const korloffResume = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fragranceResume = useRef<ReturnType<typeof setTimeout> | null>(null);
  const elkaduwaResume = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    korloffTimer.current = setInterval(() => setKorloffIdx(i => (i + 1) % korloffImages.length), 2000);
    fragranceTimer.current = setInterval(() => setFragranceIdx(i => (i + 1) % fragranceImages.length), 2000);
    elkaduwaTimer.current = setInterval(() => setElkaduwaIdx(i => (i + 1) % elkaduwaImages.length), 2000);
    return () => {
      if (korloffTimer.current) clearInterval(korloffTimer.current);
      if (fragranceTimer.current) clearInterval(fragranceTimer.current);
      if (elkaduwaTimer.current) clearInterval(elkaduwaTimer.current);
      if (korloffResume.current) clearTimeout(korloffResume.current);
      if (fragranceResume.current) clearTimeout(fragranceResume.current);
      if (elkaduwaResume.current) clearTimeout(elkaduwaResume.current);
    };
  }, []);

  const pauseAndResume = (
    timerRef: { current: ReturnType<typeof setInterval> | null },
    resumeRef: { current: ReturnType<typeof setTimeout> | null },
    setter: (fn: (i: number) => number) => void,
    length: number
  ) => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    if (resumeRef.current) clearTimeout(resumeRef.current);
    resumeRef.current = setTimeout(() => {
      timerRef.current = setInterval(() => setter(i => (i + 1) % length), 2000);
    }, 5000);
  };

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

      // Desktop gallery
      gsap.fromTo('.showcase-item',
        { opacity: 0, y: 120, rotateX: 15, scale: 0.85 },
        { opacity: 1, y: 0, rotateX: 0, scale: 1, duration: 1.2, stagger: 0.2, ease: 'power4.out',
          scrollTrigger: { trigger: '.showcase-section', start: 'top 80%', once: true } }
      );
      gsap.fromTo('.floating-orb',
        { opacity: 0, scale: 0 },
        { opacity: 1, scale: 1, duration: 1.5, stagger: 0.1, ease: 'elastic.out(1, 0.5)',
          scrollTrigger: { trigger: '.showcase-section', start: 'top 70%', once: true } }
      );
      gsap.fromTo('.service-card',
        { opacity: 0, x: -60 },
        { opacity: 1, x: 0, duration: 0.8, stagger: 0.2, ease: 'power2.out',
          scrollTrigger: { trigger: '.services-section', start: 'top 75%', once: true } }
      );
      gsap.fromTo('.method-point',
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.15, ease: 'power2.out',
          scrollTrigger: { trigger: '.method-section', start: 'top 80%', once: true } }
      );

      // Mobile masonry — stagger in on scroll
      masonryRefs.current.forEach((el, i) => {
        if (!el) return;
        gsap.fromTo(el,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 90%', once: true },
            delay: (i % 2) * 0.1,
          }
        );
      });
    });
    return () => ctx.revert();
  }, []);

  // Mobile accordion items for services
  const mobileServiceItems: AccordionCardItem[] = services.map((s) => ({
    icon: s.icon,
    title: s.title,
    subtitle: s.subtitle,
    description: s.description.split('\n\n')[0],
    accentColor: VIOLET.color,
    accentClass: VIOLET.accentClass,
    bgClass: VIOLET.bgClass,
    borderClass: VIOLET.borderClass,
  }));

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-x-hidden">
      <canvas ref={canvasRef} className="fixed inset-0 w-full h-full pointer-events-none z-0" />

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center px-6 lg:px-12 pt-28 pb-32 md:pt-32 md:pb-40 z-10">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 30%, rgba(139, 92, 246, 0.15) 0%, transparent 60%)' }} />

        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-500/10 border border-violet-500/30 rounded-full mb-8 md:mb-10">
            <Layers className="w-4 h-4 text-violet-500" />
            <span className="text-xs uppercase tracking-[0.3em] text-violet-400">3D Render & Virtual Ads</span>
          </div>

          <h1 className="text-5xl sm:text-7xl lg:text-9xl font-black leading-[0.85] tracking-tighter mb-8 md:mb-10">
            <span className="hero-line block opacity-0">REPLACE</span>
            <span className="hero-line block text-transparent bg-clip-text bg-gradient-to-r from-violet-500 via-purple-500 to-violet-500 opacity-0">
              REALITY.
            </span>
            <span className="hero-line block opacity-0">COMMAND</span>
            <span className="hero-line block text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-violet-500 to-purple-500 opacity-0">
              ATTENTION.
            </span>
          </h1>

          <p className="hero-sub text-sm sm:text-base text-violet-300/80 font-semibold uppercase tracking-[0.2em] max-w-2xl mx-auto mb-5 opacity-0">
            Studio-quality product photography and lifestyle ads. No camera. No studio. Fraction of the cost.
          </p>

          <p className="hero-sub text-base sm:text-lg md:text-xl text-white/60 max-w-3xl mx-auto mb-10 md:mb-12 leading-relaxed opacity-0">
            We create photorealistic 3D visuals and AI-powered virtual ad campaigns that look indistinguishable from real photography — no studio, no crew, no scheduling. Show off your products from every angle, in any setting, before they even exist.
          </p>

          <div className="hero-cta opacity-0">
            <Link
              to="/#chat"
              className="inline-flex items-center gap-3 px-8 md:px-10 py-4 md:py-5 bg-violet-500 text-white rounded-full font-bold text-base md:text-lg uppercase tracking-wider hover:bg-white hover:text-black transition-all duration-300 group"
            >
              <span>Request a Custom Visual Strategy Session</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Mobile scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30 md:hidden">
          <span className="text-[10px] uppercase tracking-widest">Scroll</span>
          <div className="w-px h-6 bg-gradient-to-b from-violet-500 to-transparent" />
        </div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 text-white/40">
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-violet-500 to-transparent" />
        </div>
      </section>

      {/* ── DIMENSIONAL GALLERY ───────────────────────────────────────────────── */}
      <section className="showcase-section relative py-24 md:py-32 px-6 lg:px-12 z-10 border-t border-white/10 overflow-hidden">
        {/* Ambient gradient washes */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-[10%] left-[-5%] w-[500px] h-[500px] rounded-full opacity-20" style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.3) 0%, transparent 70%)' }} />
          <div className="absolute bottom-[10%] right-[-5%] w-[600px] h-[600px] rounded-full opacity-15" style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.25) 0%, transparent 70%)' }} />
        </div>

        {/* Floating decorative orbs */}
        {[...Array(12)].map((_, i) => (
          <div
            key={`orb-${i}`}
            className="floating-orb absolute rounded-full pointer-events-none opacity-0"
            style={{
              width: `${Math.random() * 6 + 3}px`,
              height: `${Math.random() * 6 + 3}px`,
              top: `${10 + Math.random() * 80}%`,
              left: `${5 + Math.random() * 90}%`,
              background: `rgba(139, 92, 246, ${Math.random() * 0.5 + 0.3})`,
              boxShadow: `0 0 ${Math.random() * 15 + 5}px rgba(139, 92, 246, 0.4)`,
              animation: `float-orb ${3 + Math.random() * 4}s ease-in-out infinite alternate`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Section Header */}
          <div className="text-center mb-16 md:mb-24">
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full mb-6">
              <Sparkles className="w-3 h-3 text-violet-400" />
              <span className="text-xs uppercase tracking-[0.2em] text-white/40">Dimensional Exhibit</span>
            </span>
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight">
              TECHNICAL DOMINANCE
            </h2>
            <p className="text-xl sm:text-2xl md:text-3xl text-violet-500 font-bold mt-2 uppercase tracking-wider">
              On Display
            </p>
            <div className="flex items-center justify-center gap-3 mt-8">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-violet-500/50" />
              <div className="w-2 h-2 rounded-full bg-violet-500/60" />
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-violet-500/50" />
            </div>
          </div>

          {/* Desktop Gallery — 8 cards, 4 rows */}
          <div className="relative hidden lg:block">

            {/* Row 1 — wide hero (Korloff) + portrait (Fragrance) */}
            <div className="flex items-start gap-5 mb-5">
              <div
                className="showcase-item group relative w-[60%] flex-shrink-0 opacity-0 rounded-2xl overflow-hidden border border-white/10 transition-all duration-500"
                style={{ transform: `rotate(${showcaseItems[0].rotation}deg)`, zIndex: 10 }}
                onMouseEnter={e => (e.currentTarget.style.boxShadow = `0 0 60px ${showcaseItems[0].glow}`)}
                onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
              >
                <div className="aspect-[4/3] relative overflow-hidden" style={{ background: '#6e8c6b' }}>
                  <img src={korloffImages[korloffIdx]} alt={showcaseItems[0].title}
                    className="absolute inset-0 w-full h-full object-contain transition-transform duration-700 group-hover:scale-[1.03]"
                    loading="eager" decoding="async" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/5 to-transparent" />
                  {/* Carousel buttons */}
                  <button onClick={() => { pauseAndResume(korloffTimer, korloffResume, setKorloffIdx, korloffImages.length); setKorloffIdx(i => (i - 1 + korloffImages.length) % korloffImages.length); }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-black/70 transition-colors">
                    ◀
                  </button>
                  <button onClick={() => { pauseAndResume(korloffTimer, korloffResume, setKorloffIdx, korloffImages.length); setKorloffIdx(i => (i + 1) % korloffImages.length); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-black/70 transition-colors">
                    ▶
                  </button>
                  {/* Dot indicators */}
                  <div className="absolute bottom-16 right-5 z-20 flex gap-1.5">
                    {korloffImages.map((_, i) => (
                      <div key={i} className="w-1.5 h-1.5 rounded-full transition-all duration-300"
                        style={{ background: i === korloffIdx ? 'rgba(139,92,246,1)' : 'rgba(255,255,255,0.3)' }} />
                    ))}
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-7">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-1 h-7 rounded-full" style={{ background: showcaseItems[0].glow }} />
                    <span className="text-[10px] uppercase tracking-[0.3em] text-violet-400 font-medium">{showcaseItems[0].tag}</span>
                  </div>
                  <h3 className="text-2xl lg:text-3xl font-black tracking-tight mb-2 group-hover:text-violet-200 transition-colors">{showcaseItems[0].title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{showcaseItems[0].description}</p>
                  <p className="text-white/30 text-[10px] uppercase tracking-widest mt-2 italic">Concept ad created by <span className="normal-case">sev</span>IT.</p>
                </div>
              </div>

              <div
                className="showcase-item group relative flex-1 opacity-0 mt-12 rounded-2xl overflow-hidden border border-white/10 transition-all duration-500"
                style={{ transform: `rotate(${showcaseItems[1].rotation}deg)`, zIndex: 9 }}
                onMouseEnter={e => (e.currentTarget.style.boxShadow = `0 0 50px ${showcaseItems[1].glow}`)}
                onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
              >
                <div className="aspect-[3/4] relative overflow-hidden bg-black/60">
                  <img src={fragranceImages[fragranceIdx]} alt={showcaseItems[1].title}
                    className="absolute inset-0 w-full h-full object-contain transition-transform duration-700 group-hover:scale-[1.04]"
                    loading="eager" decoding="async" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  {/* Carousel buttons */}
                  <button onClick={() => { pauseAndResume(fragranceTimer, fragranceResume, setFragranceIdx, fragranceImages.length); setFragranceIdx(i => (i - 1 + fragranceImages.length) % fragranceImages.length); }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-black/70 transition-colors">
                    ◀
                  </button>
                  <button onClick={() => { pauseAndResume(fragranceTimer, fragranceResume, setFragranceIdx, fragranceImages.length); setFragranceIdx(i => (i + 1) % fragranceImages.length); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-black/70 transition-colors">
                    ▶
                  </button>
                  {/* Dot indicators */}
                  <div className="absolute bottom-16 right-4 z-20 flex gap-1.5">
                    {fragranceImages.map((_, i) => (
                      <div key={i} className="w-1.5 h-1.5 rounded-full transition-all duration-300"
                        style={{ background: i === fragranceIdx ? 'rgba(99,102,241,1)' : 'rgba(255,255,255,0.3)' }} />
                    ))}
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-1 h-6 rounded-full" style={{ background: showcaseItems[1].glow }} />
                    <span className="text-[10px] uppercase tracking-[0.3em] text-violet-400 font-medium">{showcaseItems[1].tag}</span>
                  </div>
                  <h3 className="text-lg font-black tracking-tight group-hover:text-violet-200 transition-colors">{showcaseItems[1].title}</h3>
                  <p className="text-white/30 text-[10px] uppercase tracking-widest mt-1.5 italic">Concept ad created by <span className="normal-case">sev</span>IT.</p>
                </div>
              </div>
            </div>

            {/* Row 2 — ORIGAMI (wider) + ELKADUWA SPRINGS (carousel) */}
            <div className="flex items-start gap-5 mb-5">
              {/* ORIGAMI INTERIOR — wider */}
              <div
                className="showcase-item group relative flex-[1.7] opacity-0 rounded-2xl overflow-hidden border border-white/10 transition-all duration-500"
                style={{ transform: `rotate(${showcaseItems[2].rotation}deg)`, zIndex: 8 }}
                onMouseEnter={e => (e.currentTarget.style.boxShadow = `0 0 50px ${showcaseItems[2].glow}`)}
                onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
              >
                <div className="aspect-[3/4] relative overflow-hidden">
                  <img src={showcaseItems[2].image} alt={showcaseItems[2].title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    loading="lazy" decoding="async" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-1 h-5 rounded-full" style={{ background: showcaseItems[2].glow }} />
                    <span className="text-[10px] uppercase tracking-[0.3em] text-violet-400">{showcaseItems[2].tag}</span>
                  </div>
                  <h3 className="text-base font-black tracking-tight group-hover:text-violet-200 transition-colors">{showcaseItems[2].title}</h3>
                </div>
              </div>

              {/* ELKADUWA SPRINGS — carousel */}
              <div
                className="showcase-item group relative flex-1 opacity-0 mt-10 rounded-2xl overflow-hidden border border-white/10 transition-all duration-500"
                style={{ transform: `rotate(${showcaseItems[4].rotation}deg)`, zIndex: 8 }}
                onMouseEnter={e => (e.currentTarget.style.boxShadow = `0 0 50px ${showcaseItems[4].glow}`)}
                onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
              >
                <div className="aspect-[3/4] relative overflow-hidden">
                  <img src={elkaduwaImages[elkaduwaIdx]} alt={showcaseItems[4].title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    loading="lazy" decoding="async" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
                  {/* Carousel buttons */}
                  <button onClick={() => { pauseAndResume(elkaduwaTimer, elkaduwaResume, setElkaduwaIdx, elkaduwaImages.length); setElkaduwaIdx(i => (i - 1 + elkaduwaImages.length) % elkaduwaImages.length); }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-black/70 transition-colors">
                    ◀
                  </button>
                  <button onClick={() => { pauseAndResume(elkaduwaTimer, elkaduwaResume, setElkaduwaIdx, elkaduwaImages.length); setElkaduwaIdx(i => (i + 1) % elkaduwaImages.length); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-black/70 transition-colors">
                    ▶
                  </button>
                  {/* Dot indicators */}
                  <div className="absolute bottom-16 right-4 z-20 flex gap-1.5">
                    {elkaduwaImages.map((_, i) => (
                      <div key={i} className="w-1.5 h-1.5 rounded-full transition-all duration-300"
                        style={{ background: i === elkaduwaIdx ? 'rgba(6,182,212,1)' : 'rgba(255,255,255,0.3)' }} />
                    ))}
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-1 h-5 rounded-full" style={{ background: showcaseItems[4].glow }} />
                    <span className="text-[10px] uppercase tracking-[0.3em] text-violet-400">{showcaseItems[4].tag}</span>
                  </div>
                  <h3 className="text-base font-black tracking-tight group-hover:text-violet-200 transition-colors">{showcaseItems[4].title}</h3>
                </div>
              </div>
            </div>

            {/* Row 3 — two portrait cards (Bergamood + Tom Ford) */}
            <div className="flex items-start gap-5 mb-5">
              {[5, 6].map((idx, i) => (
                <div
                  key={idx}
                  className="showcase-item group relative flex-1 opacity-0 rounded-2xl overflow-hidden border border-white/10 transition-all duration-500"
                  style={{ transform: `rotate(${showcaseItems[idx].rotation}deg)`, marginTop: i === 1 ? '32px' : '0', zIndex: 10 }}
                  onMouseEnter={e => (e.currentTarget.style.boxShadow = `0 0 55px ${showcaseItems[idx].glow}`)}
                  onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
                >
                  <div className="aspect-[3/4] relative overflow-hidden">
                    <img src={showcaseItems[idx].image} alt={showcaseItems[idx].title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                      loading="lazy" decoding="async" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-1 h-6 rounded-full" style={{ background: showcaseItems[idx].glow }} />
                      <span className="text-[10px] uppercase tracking-[0.3em] text-violet-400 font-medium">{showcaseItems[idx].tag}</span>
                    </div>
                    <h3 className="text-lg font-black tracking-tight group-hover:text-violet-200 transition-colors">{showcaseItems[idx].title}</h3>
                    <p className="text-white/40 text-xs leading-relaxed mt-1">{showcaseItems[idx].description}</p>
                    <p className="text-white/30 text-[10px] uppercase tracking-widest mt-1.5 italic">Concept ad created by <span className="normal-case">sev</span>IT.</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Row 4 — cinematic watch strip */}
            <div
              className="showcase-item group relative w-[88%] mx-auto opacity-0 rounded-2xl overflow-hidden border border-white/10 transition-all duration-500"
              style={{ transform: `rotate(${showcaseItems[7].rotation}deg)`, zIndex: 12 }}
              onMouseEnter={e => (e.currentTarget.style.boxShadow = `0 0 70px ${showcaseItems[7].glow}`)}
              onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
            >
              <div className="aspect-[21/9] relative overflow-hidden">
                <img src={showcaseItems[7].image} alt={showcaseItems[7].title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                  loading="lazy" decoding="async" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-1 h-8 rounded-full" style={{ background: showcaseItems[7].glow }} />
                  <span className="text-[10px] uppercase tracking-[0.3em] text-violet-400 font-medium">{showcaseItems[7].tag}</span>
                </div>
                <h3 className="text-2xl lg:text-3xl font-black tracking-tight group-hover:text-violet-200 transition-colors">{showcaseItems[7].title}</h3>
                <p className="text-white/40 text-sm leading-relaxed mt-2 max-w-lg">{showcaseItems[7].description}</p>
              </div>
            </div>
          </div>

          {/* ── Mobile Masonry Gallery ─────────────────────────────────────────── */}
          <div className="lg:hidden">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Column A */}
              <div className="flex flex-col gap-3">
                {/* VIRTUAL PRODUCT SHOOT (carousel) */}
                <div
                  ref={(el) => { masonryRefs.current[0] = el; }}
                  className="relative overflow-hidden rounded-2xl border border-white/10 aspect-[3/4]"
                  style={{ background: '#6e8c6b' }}
                >
                  <img src={korloffImages[korloffIdx]} alt={showcaseItems[0].title}
                    className="absolute inset-0 w-full h-full object-contain" loading="lazy" decoding="async" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                  <button onClick={() => { pauseAndResume(korloffTimer, korloffResume, setKorloffIdx, korloffImages.length); setKorloffIdx(i => (i - 1 + korloffImages.length) % korloffImages.length); }}
                    className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-6 sm:h-6 rounded-full bg-black/60 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white text-xs sm:text-[10px]">◀</button>
                  <button onClick={() => { pauseAndResume(korloffTimer, korloffResume, setKorloffIdx, korloffImages.length); setKorloffIdx(i => (i + 1) % korloffImages.length); }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-6 sm:h-6 rounded-full bg-black/60 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white text-xs sm:text-[10px]">▶</button>
                  {/* Dot indicators */}
                  <div className="absolute bottom-12 right-3 z-20 flex gap-1.5">
                    {korloffImages.map((_, i) => (
                      <div key={i} className="w-1.5 h-1.5 rounded-full transition-all duration-300"
                        style={{ background: i === korloffIdx ? 'rgba(139,92,246,1)' : 'rgba(255,255,255,0.3)' }} />
                    ))}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-3">
                    <span className="text-[10px] sm:text-[9px] uppercase tracking-widest text-violet-400 font-bold block mb-1">{showcaseItems[0].tag}</span>
                    <h3 className="text-sm sm:text-[11px] font-black leading-tight text-white">{showcaseItems[0].title}</h3>
                    <p className="text-white/40 text-[9px] sm:text-[8px] uppercase tracking-widest mt-1 italic">Concept ad by <span className="normal-case">sev</span>IT.</p>
                  </div>
                  <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: `linear-gradient(to right, ${showcaseItems[0].glow}, transparent)` }} />
                </div>

                {/* ORIGAMI INTERIOR (idx 2) */}
                <div
                  ref={(el) => { masonryRefs.current[2] = el; }}
                  className="relative overflow-hidden rounded-2xl bg-black/20 border border-white/10"
                  style={{ aspectRatio: '3/4' }}
                >
                  <img src={showcaseItems[2].image} alt={showcaseItems[2].title}
                    className="absolute inset-0 w-full h-full object-cover" loading="lazy" decoding="async" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <span className="text-[9px] uppercase tracking-widest text-violet-400 font-bold block mb-1">{showcaseItems[2].tag}</span>
                    <h3 className="text-[11px] font-black leading-tight text-white">{showcaseItems[2].title}</h3>
                  </div>
                  <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: `linear-gradient(to right, ${showcaseItems[2].glow}, transparent)` }} />
                </div>

                {/* TOM FORD (idx 5) */}
                <div
                  ref={(el) => { masonryRefs.current[5] = el; }}
                  className="relative overflow-hidden rounded-2xl bg-black/20 border border-white/10"
                  style={{ aspectRatio: '3/4' }}
                >
                  <img src={showcaseItems[5].image} alt={showcaseItems[5].title}
                    className="absolute inset-0 w-full h-full object-cover" loading="lazy" decoding="async" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <span className="text-[9px] uppercase tracking-widest text-violet-400 font-bold block mb-1">{showcaseItems[5].tag}</span>
                    <h3 className="text-[11px] font-black leading-tight text-white">{showcaseItems[5].title}</h3>
                    <p className="text-white/40 text-[8px] uppercase tracking-widest mt-1 italic">Concept ad by <span className="normal-case">sev</span>IT.</p>
                  </div>
                  <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: `linear-gradient(to right, ${showcaseItems[5].glow}, transparent)` }} />
                </div>

                {/* WATCH (idx 7) */}
                <div
                  ref={(el) => { masonryRefs.current[7] = el; }}
                  className="relative overflow-hidden rounded-2xl bg-black/20 border border-white/10"
                  style={{ aspectRatio: '4/5' }}
                >
                  <img src={showcaseItems[7].image} alt={showcaseItems[7].title}
                    className="absolute inset-0 w-full h-full object-cover" loading="lazy" decoding="async" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <span className="text-[9px] uppercase tracking-widest text-violet-400 font-bold block mb-1">{showcaseItems[7].tag}</span>
                    <h3 className="text-[11px] font-black leading-tight text-white">{showcaseItems[7].title}</h3>
                  </div>
                  <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: `linear-gradient(to right, ${showcaseItems[7].glow}, transparent)` }} />
                </div>
              </div>

              {/* Column B */}
              <div className="flex flex-col gap-3 sm:mt-6">
                {/* FRAGRANCE PERFECTION (carousel) */}
                <div
                  ref={(el) => { masonryRefs.current[1] = el; }}
                  className="relative overflow-hidden rounded-2xl bg-black/60 border border-white/10"
                  style={{ aspectRatio: '3/4' }}
                >
                  <img src={fragranceImages[fragranceIdx]} alt={showcaseItems[1].title}
                    className="absolute inset-0 w-full h-full object-contain" loading="lazy" decoding="async" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <button onClick={() => { pauseAndResume(fragranceTimer, fragranceResume, setFragranceIdx, fragranceImages.length); setFragranceIdx(i => (i - 1 + fragranceImages.length) % fragranceImages.length); }}
                    className="absolute left-1.5 top-1/2 -translate-y-1/2 z-20 w-6 h-6 rounded-full bg-black/60 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white text-[10px]">◀</button>
                  <button onClick={() => { pauseAndResume(fragranceTimer, fragranceResume, setFragranceIdx, fragranceImages.length); setFragranceIdx(i => (i + 1) % fragranceImages.length); }}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 z-20 w-6 h-6 rounded-full bg-black/60 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white text-[10px]">▶</button>
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <span className="text-[9px] uppercase tracking-widest text-violet-400 font-bold block mb-1">{showcaseItems[1].tag}</span>
                    <h3 className="text-[11px] font-black leading-tight text-white">{showcaseItems[1].title}</h3>
                    <p className="text-white/40 text-[8px] uppercase tracking-widest mt-1 italic">Concept ad by <span className="normal-case">sev</span>IT.</p>
                  </div>
                  <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: `linear-gradient(to right, ${showcaseItems[1].glow}, transparent)` }} />
                </div>

                {/* ELKADUWA SPRINGS (carousel) */}
                <div
                  ref={(el) => { masonryRefs.current[4] = el; }}
                  className="relative overflow-hidden rounded-2xl bg-black/20 border border-white/10"
                  style={{ aspectRatio: '3/4' }}
                >
                  <img src={elkaduwaImages[elkaduwaIdx]} alt={showcaseItems[4].title}
                    className="absolute inset-0 w-full h-full object-cover" loading="lazy" decoding="async" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <button onClick={() => { pauseAndResume(elkaduwaTimer, elkaduwaResume, setElkaduwaIdx, elkaduwaImages.length); setElkaduwaIdx(i => (i - 1 + elkaduwaImages.length) % elkaduwaImages.length); }}
                    className="absolute left-1.5 top-1/2 -translate-y-1/2 z-20 w-6 h-6 rounded-full bg-black/60 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white text-[10px]">◀</button>
                  <button onClick={() => { pauseAndResume(elkaduwaTimer, elkaduwaResume, setElkaduwaIdx, elkaduwaImages.length); setElkaduwaIdx(i => (i + 1) % elkaduwaImages.length); }}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 z-20 w-6 h-6 rounded-full bg-black/60 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white text-[10px]">▶</button>
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <span className="text-[9px] uppercase tracking-widest text-violet-400 font-bold block mb-1">{showcaseItems[4].tag}</span>
                    <h3 className="text-[11px] font-black leading-tight text-white">{showcaseItems[4].title}</h3>
                  </div>
                  <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: `linear-gradient(to right, ${showcaseItems[4].glow}, transparent)` }} />
                </div>

                {/* THE SCENT OF BERGAMOOD (idx 6) */}
                <div
                  ref={(el) => { masonryRefs.current[6] = el; }}
                  className="relative overflow-hidden rounded-2xl bg-black/20 border border-white/10"
                  style={{ aspectRatio: '3/4' }}
                >
                  <img src={showcaseItems[6].image} alt={showcaseItems[6].title}
                    className="absolute inset-0 w-full h-full object-cover" loading="lazy" decoding="async" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <span className="text-[9px] uppercase tracking-widest text-violet-400 font-bold block mb-1">{showcaseItems[6].tag}</span>
                    <h3 className="text-[11px] font-black leading-tight text-white">{showcaseItems[6].title}</h3>
                    <p className="text-white/40 text-[8px] uppercase tracking-widest mt-1 italic">Concept ad by <span className="normal-case">sev</span>IT.</p>
                  </div>
                  <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: `linear-gradient(to right, ${showcaseItems[6].glow}, transparent)` }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <style>{`
          @keyframes float-orb {
            0% { transform: translateY(0px) translateX(0px); }
            100% { transform: translateY(-20px) translateX(10px); }
          }
        `}</style>
      </section>

      {/* ── VIDEO SHOWREEL — Full-bleed cinematic strip ─────────────────────── */}
      <section className="relative z-10 overflow-hidden" style={{ marginTop: '-1px' }}>
        {/* Diagonal cut top edge */}
        <div
          className="absolute top-0 left-0 right-0 h-24 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom right, #050505 49.9%, transparent 50%)' }}
        />
        {/* Diagonal cut bottom edge */}
        <div
          className="absolute bottom-0 left-0 right-0 h-24 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to top left, #050505 49.9%, transparent 50%)' }}
        />

        {/* Full-bleed video — no box, no bars */}
        <div className="relative w-full" style={{ height: 'clamp(45vh, 56vw, 720px)' }}>
          <video
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="none"
            poster="/images/renders/collage1.png"
            aria-label="sevIT 3D rendering showreel"
          >
            <source src="/images/renders/showreel.mp4" type="video/mp4" />
          </video>

          {/* Dark vignette overlay */}
          <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, transparent 30%, rgba(5,5,5,0.55) 100%)' }} />
          {/* Gradient edges to bleed into page bg */}
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#050505] to-transparent" />
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#050505] to-transparent" />

          {/* Floating centre label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 text-center px-6">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-black/40 backdrop-blur-sm rounded-full mb-5 border border-white/10">
              <Play className="w-3 h-3 text-violet-400" />
              <span className="text-xs uppercase tracking-[0.25em] text-white/50">Motion Showreel</span>
            </span>
            <h2 className="text-4xl xs:text-5xl sm:text-6xl md:text-8xl font-black tracking-tighter drop-shadow-2xl">
              SEE IT IN
            </h2>
            <p className="text-3xl xs:text-4xl sm:text-5xl md:text-7xl font-black text-violet-400 uppercase tracking-wider drop-shadow-2xl">
              MOTION
            </p>
          </div>

          {/* Bottom-left badge */}
          <div className="absolute bottom-10 left-6 lg:left-12 z-10 flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-white/50 font-medium">sevIT Digital — 2025 Render Showreel</span>
          </div>
        </div>
      </section>


      {/* ── SERVICES SECTION ─────────────────────────────────────────────────── */}
      <section className="services-section relative py-24 md:py-32 px-6 lg:px-12 z-10 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14 md:mb-20">
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full mb-6">
              <Cpu className="w-3 h-3 text-violet-400" />
              <span className="text-xs uppercase tracking-[0.2em] text-white/40">Technical Stack</span>
            </span>
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight">
              THE RENDERING
            </h2>
            <p className="text-xl sm:text-2xl md:text-3xl text-violet-500 font-bold mt-2 uppercase tracking-wider">
              Engineering Stack
            </p>
          </div>

          {/* Desktop Grid */}
          <div className="hidden lg:grid grid-cols-3 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <div key={index} className="service-card group relative opacity-0 h-full">
                  <div className="relative h-full p-8 lg:p-10 rounded-3xl bg-white/[0.02] border border-white/10 hover:border-violet-500/50 transition-all duration-500 overflow-hidden flex flex-col">
                    <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-violet-500/20 blur-3xl opacity-20 group-hover:opacity-40 transition-opacity" />
                    <div className="relative w-16 h-16 rounded-2xl bg-violet-500/20 flex items-center justify-center mb-8 shrink-0">
                      <Icon className="w-8 h-8 text-violet-500" />
                    </div>
                    <span className="text-xs uppercase tracking-[0.2em] text-violet-400 mb-4 block">{service.subtitle}</span>
                    <h3 className="text-2xl lg:text-3xl font-black mb-6">{service.title}</h3>
                    <div className="text-white/60 text-sm leading-relaxed whitespace-pre-line flex-1">{service.description}</div>
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-violet-500 to-transparent" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mobile — Accordion */}
          <MobileAccordionCards items={mobileServiceItems} />
        </div>
      </section>

      {/* ── METHODOLOGY ───────────────────────────────────────────────────────── */}
      <section className="method-section relative py-24 md:py-32 px-6 lg:px-12 z-10 border-t border-white/10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight mb-4">
              WHY OUR RENDERS
            </h2>
            <p className="text-2xl sm:text-3xl md:text-4xl text-violet-500 font-bold uppercase tracking-wider">
              LOOK "OVER-THE-TOP"
            </p>
          </div>

          <div className="text-center mb-14 md:mb-20">
            <p className="text-lg sm:text-xl md:text-2xl text-white/70 leading-relaxed max-w-4xl mx-auto">
              Because we sweat the <span className="text-violet-500 font-bold">details</span>.
            </p>
            <p className="text-white/50 leading-relaxed max-w-3xl mx-auto mt-6">
              We don't just push a button and hope for the best. We meticulously craft every texture, light, and angle to make sure your product looks exactly how you want it to.
            </p>
            <p className="text-white/50 leading-relaxed max-w-3xl mx-auto mt-4">
              Behind the scenes, we keep our files clean and our processes tight. This means we can iterate quickly, hit your deadlines, and deliver image files that are ready to use everywhere—from your website to massive billboards.
            </p>
            <p className="text-xl md:text-2xl font-bold text-white mt-8 uppercase tracking-wider">
              The result? Visuals that actually grab attention and drive sales—
            </p>
            <p className="text-2xl md:text-3xl font-black text-violet-500 mt-4 uppercase tracking-widest">
              Without the massive photoshoot budget.
            </p>
          </div>

          {/* Desktop Grid */}
          <div className="hidden lg:grid grid-cols-3 gap-8">
            {methodologyPoints.map((point, index) => {
              const Icon = point.icon;
              return (
                <div key={index} className="method-point text-center p-8 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-violet-500/30 hover:bg-white/[0.04] transition-all opacity-0">
                  <div className="w-14 h-14 rounded-xl bg-violet-500/10 flex items-center justify-center mx-auto mb-6">
                    <Icon className="w-7 h-7 text-violet-500" />
                  </div>
                  <h4 className="text-sm font-bold uppercase tracking-wider mb-3">{point.title}</h4>
                  <p className="text-white/50 text-sm leading-relaxed">{point.desc}</p>
                </div>
              );
            })}
          </div>

          {/* Mobile — Stacked cards (all visible) */}
          <div className="lg:hidden space-y-4">
            {methodologyPoints.map((point, index) => {
              const Icon = point.icon;
              return (
                <div key={index} className="flex items-start gap-4 p-5 rounded-2xl bg-white/[0.03] border border-white/10">
                  <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center shrink-0">
                    <Icon className="w-6 h-6 text-violet-500" />
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
          style={{ background: 'radial-gradient(ellipse at center, rgba(139, 92, 246, 0.25) 0%, transparent 60%)', animation: 'pulse 4s ease-in-out infinite' }}
        />
        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 0.5; transform: translate(-50%, -50%) scale(1); }
            50% { opacity: 0.8; transform: translate(-50%, -50%) scale(1.1); }
          }
        `}</style>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight mb-8">
            READY TO STOP USING
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-purple-500">
              STOCK PHOTOS?
            </span>
          </h2>

          <p className="text-base sm:text-lg md:text-xl text-white/60 leading-relaxed max-w-2xl mx-auto mb-6">
            Your competitors are still shooting on white backgrounds.
            Your products deserve better. Your brand demands better.
          </p>

          <p className="text-lg sm:text-xl md:text-2xl text-white font-bold mb-10 md:mb-12">
            It's time to <span className="text-violet-500">dominate</span>.
          </p>

          <Link
            to="/#chat"
            className="inline-flex items-center gap-3 px-8 md:px-12 py-5 md:py-6 bg-violet-500 text-white rounded-full font-bold text-base md:text-xl uppercase tracking-wider hover:bg-white hover:text-black transition-all duration-300 group"
          >
            <span>Book Your Visual Strategy Session</span>
            <ArrowRight className="w-5 md:w-6 h-5 md:h-6 group-hover:translate-x-1 transition-transform" />
          </Link>

          <p className="text-white/30 text-sm mt-8 uppercase tracking-widest">
            No commitment required. We'll analyze your current visual strategy and show you exactly
            where 3D renders and virtual ads can replace costly production.
          </p>
        </div>
      </section>
    </div>
  );
}

export default RenderingPage;
