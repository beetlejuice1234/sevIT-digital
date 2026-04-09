import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, ChevronLeft, ChevronRight, ExternalLink, Code2, Zap, Smartphone, Search, Shield, Layers, Monitor, Sparkles, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

// Mobile Portfolio — Premium phone-frame showcase with swipe
function MobilePortfolioDeck({ websites }: { websites: typeof portfolioWebsites }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragDeltaX, setDragDeltaX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const phoneRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);

  const SWIPE_THRESHOLD = 55;
  const site = websites[currentIndex];

  const animateTo = useCallback((direction: 'left' | 'right', targetIndex: number) => {
    if (isAnimating) return;
    setIsAnimating(true);
    const phone = phoneRef.current;
    const info = infoRef.current;
    if (!phone || !info) { setIsAnimating(false); return; }
    // Slide out
    gsap.to([phone, info], {
      x: direction === 'left' ? -60 : 60,
      opacity: 0,
      duration: 0.25,
      ease: 'power2.in',
      onComplete: () => {
        setCurrentIndex(targetIndex);
        setDragDeltaX(0);
        gsap.fromTo([phone, info],
          { x: direction === 'left' ? 60 : -60, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.35, ease: 'power2.out', onComplete: () => setIsAnimating(false) }
        );
      }
    });
  }, [isAnimating]);

  const goNext = useCallback(() => {
    animateTo('left', (currentIndex + 1) % websites.length);
  }, [animateTo, currentIndex, websites.length]);

  const goPrev = useCallback(() => {
    animateTo('right', (currentIndex - 1 + websites.length) % websites.length);
  }, [animateTo, currentIndex, websites.length]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setDragStartX(e.touches[0].clientX);
    setIsDragging(true);
    setDragDeltaX(0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const delta = e.touches[0].clientX - dragStartX;
    setDragDeltaX(delta);
    if (phoneRef.current) gsap.set(phoneRef.current, { x: delta * 0.4 });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    if (Math.abs(dragDeltaX) > SWIPE_THRESHOLD) {
      dragDeltaX < 0 ? goNext() : goPrev();
    } else {
      if (phoneRef.current) gsap.to(phoneRef.current, { x: 0, duration: 0.3, ease: 'elastic.out(1, 0.7)' });
      setDragDeltaX(0);
    }
  };

  return (
    <div className="w-full px-4 pb-4 select-none">
      {/* Category pill + counter */}
      <div className="flex items-center justify-between mb-5 px-1">
        <span
          className="text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full"
          style={{ backgroundColor: `${site.color}25`, color: site.color }}
        >
          {site.category}
        </span>
        <span className="text-xs text-white/40">
          <span className="text-white font-semibold">{currentIndex + 1}</span>
          <span className="mx-1 text-white/20">/</span>
          {websites.length}
        </span>
      </div>

      {/* Phone frame mockup */}
      <div
        ref={phoneRef}
        className="mx-auto relative"
        style={{ maxWidth: 280 }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Phone shell */}
        <div
          className="relative rounded-[2.5rem] overflow-hidden shadow-2xl"
          style={{
            background: '#111',
            border: `2px solid ${site.color}50`,
            boxShadow: `0 30px 80px ${site.color}30, 0 0 0 1px rgba(255,255,255,0.06)`,
          }}
        >
          {/* Status bar */}
          <div className="flex items-center justify-between px-5 pt-3 pb-2 bg-[#0a0a0a]">
            <span className="text-[10px] text-white/50 font-medium">9:41</span>
            <div className="w-20 h-4 bg-black rounded-full" />
            <div className="flex gap-1 items-center">
              <div className="w-3 h-2 border border-white/40 rounded-sm" />
              <div className="w-1 h-2.5 rounded-full bg-white/40" />
            </div>
          </div>

          {/* Browser address bar */}
          <div className="flex items-center gap-2 px-3 py-2 bg-[#141414] border-t border-white/5">
            <div className="flex gap-1">
              <div className="w-2 h-2 rounded-full bg-red-500/70" />
              <div className="w-2 h-2 rounded-full bg-yellow-500/70" />
              <div className="w-2 h-2 rounded-full bg-green-500/70" />
            </div>
            <div className="flex-1 flex items-center gap-1.5 bg-black/40 rounded-lg px-2 py-1">
              <div className="w-2 h-2 rounded-full bg-green-500/60" />
              <span className="text-[9px] text-white/35 truncate">{site.url.replace('https://', '')}</span>
            </div>
          </div>

          {/* Website "screenshot" area */}
          <div
            className="relative overflow-hidden"
            style={{ height: 340, background: `linear-gradient(160deg, ${site.color}28 0%, #050505 60%)` }}
          >
            {/* Simulated website layout */}
            <div className="absolute inset-0 p-4 flex flex-col gap-3">
              {/* Simulated hero area */}
              <div
                className="rounded-xl flex-1 flex flex-col items-center justify-center gap-3 relative overflow-hidden"
                style={{ background: `linear-gradient(135deg, ${site.color}20, ${site.color}05)`, border: `1px solid ${site.color}20` }}
              >
                {/* Simulated nav dots */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                  <div className="flex gap-1.5">
                    {[0,1,2].map(i => <div key={i} className="h-1.5 bg-white/20 rounded-full" style={{ width: i === 0 ? 24 : 12 }} />)}
                  </div>
                  <div className="w-5 h-5 rounded bg-white/10" />
                </div>

                {/* Big title sim */}
                <div className="space-y-2 text-center px-4">
                  <div className="h-4 bg-white/30 rounded-full w-32 mx-auto" />
                  <div className="h-2.5 bg-white/15 rounded-full w-24 mx-auto" />
                  <div className="h-2.5 bg-white/10 rounded-full w-20 mx-auto" />
                </div>

                {/* CTA sim */}
                <div
                  className="h-7 w-24 rounded-full flex items-center justify-center"
                  style={{ background: site.color }}
                >
                  <div className="h-1.5 w-12 bg-white/60 rounded-full" />
                </div>
              </div>

              {/* Simulated content cards */}
              <div className="grid grid-cols-2 gap-2">
                {[0, 1].map(i => (
                  <div key={i} className="rounded-lg p-2.5 flex flex-col gap-1.5" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                    <div className="w-6 h-6 rounded" style={{ background: `${site.color}40` }} />
                    <div className="h-2 bg-white/20 rounded-full w-full" />
                    <div className="h-1.5 bg-white/10 rounded-full w-3/4" />
                  </div>
                ))}
              </div>
            </div>

            {/* Scan line shimmer effect */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: 'linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.15) 100%)' }}
            />
          </div>

          {/* Home indicator */}
          <div className="bg-[#0a0a0a] py-2 flex justify-center">
            <div className="w-24 h-1 bg-white/25 rounded-full" />
          </div>
        </div>

        {/* Swipe hint */}
        <div className="flex items-center justify-center gap-1.5 mt-3">
          <div className="w-3 h-0.5 bg-white/20 rounded-full" />
          <span className="text-[10px] uppercase tracking-widest text-white/25">swipe</span>
          <div className="w-3 h-0.5 bg-white/20 rounded-full" />
        </div>
      </div>

      {/* Project info */}
      <div ref={infoRef} className="mt-6 px-1">
        <h3 className="text-2xl font-black mb-1">{site.title}</h3>
        <p className="text-white/50 text-sm leading-relaxed mb-4">{site.description}</p>

        {/* Stats row */}
        <div className="flex gap-3 mb-4">
          <div className="flex-1 bg-white/[0.03] border border-white/10 rounded-xl p-3 text-center">
            <span className="text-lg font-black" style={{ color: site.color }}>{site.stats.loadTime}</span>
            <p className="text-[10px] text-white/40 uppercase tracking-wider mt-0.5">Load Time</p>
          </div>
          <div className="flex-1 bg-white/[0.03] border border-white/10 rounded-xl p-3 text-center">
            <span className="text-lg font-black text-emerald-400">{site.stats.conversion}</span>
            <p className="text-[10px] text-white/40 uppercase tracking-wider mt-0.5">Conversion</p>
          </div>
        </div>

        {/* Open site button */}
        <a
          href={site.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl font-bold text-sm transition-all active:scale-95"
          style={{ background: site.color, color: '#fff' }}
        >
          <span>Open Live Site</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      {/* Dot nav */}
      <div className="flex items-center justify-center gap-2 mt-5">
        <button
          onClick={goPrev}
          disabled={isAnimating}
          className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 active:scale-90 transition-all disabled:opacity-40"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div className="flex gap-1.5">
          {websites.map((_, idx) => (
            <button
              key={idx}
              onClick={() => !isAnimating && animateTo(idx > currentIndex ? 'left' : 'right', idx)}
              className="h-1.5 rounded-full transition-all duration-300"
              style={{
                width: idx === currentIndex ? 20 : 6,
                background: idx === currentIndex ? site.color : 'rgba(255,255,255,0.2)',
              }}
            />
          ))}
        </div>
        <button
          onClick={goNext}
          disabled={isAnimating}
          className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 active:scale-90 transition-all disabled:opacity-40"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

const features = [
  { icon: Zap, title: 'Lightning Fast', desc: 'Sub-second load times with optimized code and edge caching.' },
  { icon: Smartphone, title: 'Mobile-First', desc: 'Responsive designs that look stunning on every device.' },
  { icon: Search, title: 'SEO Optimized', desc: 'Built-in SEO best practices for higher rankings.' },
  { icon: Shield, title: 'Secure by Default', desc: 'HTTPS, security headers, and best practices.' },
  { icon: Code2, title: 'Clean Code', desc: 'Maintainable, well-documented code.' },
  { icon: Layers, title: 'Scalable Architecture', desc: 'Built to grow from startup to enterprise.' },
];

const portfolioWebsites = [
  {
    id: 1,
    title: 'ClickZone',
    category: 'E-Commerce',
    url: 'https://clickzonemobiles.com',
    description: 'Sleek iPhone e-commerce platform with 3D product showcase and dark theme.',
    stats: { loadTime: '0.9s', conversion: '+220%' },
    color: '#3B82F6',
  },
  {
    id: 2,
    title: 'TechFlow Solutions',
    category: 'Corporate',
    url: 'https://example.com/techflow',
    description: 'Modern corporate website with dynamic animations and seamless UX.',
    stats: { loadTime: '0.8s', conversion: '+150%' },
    color: '#10B981',
  },
  {
    id: 3,
    title: 'Bloom Boutique',
    category: 'E-Commerce',
    url: 'https://example.com/bloom',
    description: 'Fashion e-commerce with smooth checkout and 3D product views.',
    stats: { loadTime: '1.2s', conversion: '+200%' },
    color: '#EC4899',
  },
  {
    id: 4,
    title: 'GrowthLabs',
    category: 'SaaS Platform',
    url: 'https://example.com/growthlabs',
    description: 'Dashboard-focused SaaS with real-time data visualization.',
    stats: { loadTime: '0.9s', conversion: '+180%' },
    color: '#8B5CF6',
  },
];

const processSteps = [
  { number: '01', title: 'Discovery', desc: 'We dive deep into your business goals and target audience.' },
  { number: '02', title: 'Wireframing', desc: 'Low-fidelity layouts mapping user journeys.' },
  { number: '03', title: 'Design', desc: 'High-fidelity mockups with your brand identity.' },
  { number: '04', title: 'Development', desc: 'Clean, performant code with modern frameworks.' },
  { number: '05', title: 'Launch', desc: 'Deployment, monitoring, and optimization.' },
];

const technologies = [
  { name: 'React', icon: '⚛️' },
  { name: 'Next.js', icon: '▲' },
  { name: 'TypeScript', icon: 'TS' },
  { name: 'Tailwind', icon: '🌊' },
  { name: 'Node.js', icon: '🟢' },
  { name: 'PostgreSQL', icon: '🐘' },
];

function WebDesignPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const isVisibleRef = useRef(true);

  const currentWebsite = portfolioWebsites[currentIndex];

  // Starfield background animation with IntersectionObserver
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
    for (let i = 0; i < 100; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.5 + 0.5,
        speed: Math.random() * 0.3 + 0.1,
        opacity: Math.random() * 0.5 + 0.2,
      });
    }

    const animate = () => {
      if (!isVisibleRef.current) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }
      
      ctx.fillStyle = 'rgba(5, 5, 5, 0.15)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      stars.forEach((star) => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.fill();

        star.y += star.speed;
        if (star.y > canvas.height) {
          star.y = 0;
          star.x = Math.random() * canvas.width;
        }
      });

      animationRef.current = requestAnimationFrame(animate);
    };
    animate();

    // IntersectionObserver to pause when not visible
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisibleRef.current = entry.isIntersecting;
        });
      },
      { threshold: 0 }
    );
    observer.observe(canvas);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', resize);
      observer.disconnect();
    };
  }, []);

  const navigate = (newDirection: 'left' | 'right') => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setIsLoading(true);

    const newIndex = newDirection === 'right' 
      ? (currentIndex + 1) % portfolioWebsites.length
      : (currentIndex - 1 + portfolioWebsites.length) % portfolioWebsites.length;

    gsap.to(contentRef.current, {
      x: newDirection === 'right' ? '-100%' : '100%',
      opacity: 0,
      duration: 0.4,
      ease: 'power2.in',
      onComplete: () => {
        setCurrentIndex(newIndex);
        gsap.fromTo(contentRef.current, 
          { x: newDirection === 'right' ? '100%' : '-100%', opacity: 0 },
          { x: '0%', opacity: 1, duration: 0.5, ease: 'power2.out', onComplete: () => setIsAnimating(false) }
        );
      }
    });
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.hero-title', { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.3 });
      gsap.fromTo('.hero-subtitle', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.5 });
      gsap.fromTo('.hero-cta', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.7 });

      gsap.fromTo('.feature-card', { opacity: 0, y: 50 }, { 
        opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out',
        scrollTrigger: { trigger: '.features-section', start: 'top 80%', once: true }
      });

      gsap.fromTo('.process-step', { opacity: 0, x: -40 }, { 
        opacity: 1, x: 0, duration: 0.6, stagger: 0.12, ease: 'power2.out',
        scrollTrigger: { trigger: '.process-section', start: 'top 80%', once: true }
      });

      gsap.fromTo('.tech-item', { opacity: 0, scale: 0.8 }, { 
        opacity: 1, scale: 1, duration: 0.4, stagger: 0.08, ease: 'back.out(1.7)',
        scrollTrigger: { trigger: '.tech-section', start: 'top 85%', once: true }
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-x-hidden">
      {/* Animated Starfield Background */}
      <canvas 
        ref={canvasRef} 
        className="fixed inset-0 w-full h-full pointer-events-none z-0"
      />

      {/* Back Navigation - New Design */}
      {/* HERO SECTION */}
      <section className="relative min-h-[70vh] flex items-center justify-center px-6 lg:px-12 pt-32 pb-20 z-10">
        <div className="absolute inset-0 pointer-events-none" 
          style={{ background: 'radial-gradient(ellipse at 50% 30%, rgba(239, 68, 68, 0.12) 0%, transparent 60%)' }} 
        />

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-full mb-8 hero-title opacity-0">
            <Monitor className="w-4 h-4 text-red-500" />
            <span className="text-xs uppercase tracking-[0.3em] text-red-400">Web Design & Development</span>
          </div>

          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black leading-[0.9] tracking-tight mb-6 hero-title opacity-0">
            WEBSITES THAT
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">CONVERT</span>
          </h1>

          <p className="text-xl text-white/60 max-w-2xl mx-auto mb-10 hero-subtitle opacity-0">
            We build blazing-fast, SEO-optimized websites with stunning designs that turn visitors into customers.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center hero-cta opacity-0">
            <a href="#portfolio" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black rounded-full font-medium hover:bg-red-500 hover:text-white transition-all group">
              <span>View Our Work</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <Link to="/#chat" className="inline-flex items-center gap-2 px-8 py-4 border border-white/20 rounded-full font-medium hover:bg-white/5 transition-all">
              <span>Start Your Project</span>
            </Link>
          </div>
        </div>
      </section>

      {/* PORTFOLIO SHOWCASE - INTERACTIVE IFRAME */}
      <section id="portfolio" className="relative py-20 px-4 lg:px-12 z-10">
        <div className="max-w-[1600px] mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/10 rounded-full mb-4">
              <Sparkles className="w-3 h-3 text-red-400" />
              <span className="text-xs uppercase tracking-[0.2em] text-red-400">Portfolio</span>
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              Our <span className="text-red-500">Work</span>
            </h2>
            <p className="text-white/50 max-w-xl mx-auto">
              Browse and interact with our latest web design projects.
            </p>
          </div>

          {/* Mobile: Swipe Deck */}
          <div className="md:hidden">
            <MobilePortfolioDeck websites={portfolioWebsites} />
          </div>

          {/* Desktop: macOS Mockup - Unchanged */}
          <div className="hidden md:flex relative items-center justify-center gap-4 lg:gap-8">
            {/* Left Arrow */}
            <button 
              onClick={() => navigate('left')}
              disabled={isAnimating}
              className="flex-shrink-0 w-14 h-14 lg:w-16 lg:h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-red-500 hover:border-red-500 transition-all duration-300 disabled:opacity-50 z-20"
            >
              <ChevronLeft className="w-6 h-6 lg:w-8 lg:h-8" />
            </button>

            {/* Preview Box with Iframe */}
            <div 
              className="relative flex-1 max-w-6xl aspect-[16/10] rounded-2xl lg:rounded-3xl overflow-hidden bg-[#0a0a0a] border border-white/10 shadow-2xl"
              style={{ boxShadow: '0 0 100px rgba(239, 68, 68, 0.15)' }}
            >
              {/* Browser Chrome */}
              <div className="h-8 md:h-10 lg:h-12 bg-[#1a1a1a] border-b border-white/10 flex items-center px-3 md:px-4 gap-2 md:gap-3">
                <div className="flex gap-1.5 md:gap-2">
                  <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-red-500/80" />
                  <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-green-500/80" />
                </div>
                <div className="flex-1 flex justify-center px-2">
                  <a 
                    href={currentWebsite.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2 md:px-4 py-1 md:py-1.5 bg-[#0a0a0a] rounded-lg text-[10px] md:text-xs text-white/40 flex items-center gap-1.5 md:gap-2 hover:text-white/60 transition-colors truncate max-w-[180px] md:max-w-none"
                  >
                    <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-green-500/50 flex-shrink-0" />
                    <span className="truncate">{currentWebsite.url}</span>
                    <ExternalLink className="w-2.5 h-2.5 md:w-3 md:h-3 flex-shrink-0" />
                  </a>
                </div>
              </div>

              {/* Website Preview Content with Iframe */}
              <div className="relative flex-1 h-[calc(100%-40px)] md:h-[calc(100%-48px)] overflow-hidden">
                <div ref={contentRef} className="w-full h-full">
                  {/* Loading Spinner */}
                  {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-[#0a0a0a] z-10">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-10 h-10 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                        <span className="text-white/40 text-sm">Loading {currentWebsite.title}...</span>
                      </div>
                    </div>
                  )}
                  
                  {/* Iframe - Actual Website */}
                  {currentWebsite.id === 1 ? (
                    <iframe
                      src={currentWebsite.url}
                      title={currentWebsite.title}
                      className="w-full h-full border-0"
                      onLoad={() => setIsLoading(false)}
                      sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                    />
                  ) : (
                    <div 
                      className="w-full h-full flex items-center justify-center"
                      style={{ background: `linear-gradient(135deg, ${currentWebsite.color}20, transparent)` }}
                    >
                      <div className="text-center p-8">
                        <div 
                          className="w-32 h-32 mx-auto rounded-2xl mb-6 flex items-center justify-center"
                          style={{ background: currentWebsite.color }}
                        >
                          <Monitor className="w-16 h-16 text-white" />
                        </div>
                        <h3 className="text-3xl font-bold mb-2">{currentWebsite.title}</h3>
                        <p className="text-white/50 mb-4">{currentWebsite.category}</p>
                        <a 
                          href={currentWebsite.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-5 py-3 bg-white text-black rounded-full text-sm font-medium hover:bg-red-500 hover:text-white transition-all"
                        >
                          <span>Visit Live Site</span>
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Overlay Info - Desktop Only */}
                  <div className="hidden md:block absolute bottom-0 left-0 right-0 p-6 lg:p-8 bg-gradient-to-t from-black via-black/90 to-transparent pointer-events-none">
                    <div className="flex items-end justify-between pointer-events-auto">
                      <div>
                        <span className="text-xs text-red-400 uppercase tracking-wider">{currentWebsite.category}</span>
                        <h3 className="text-2xl lg:text-3xl font-bold mt-1">{currentWebsite.title}</h3>
                        <p className="text-white/60 text-sm mt-2 max-w-md">{currentWebsite.description}</p>
                      </div>
                      <a 
                        href={currentWebsite.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-5 py-3 bg-white text-black rounded-full text-sm font-medium hover:bg-red-500 hover:text-white transition-all"
                      >
                        <span>Open in New Tab</span>
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress Indicators */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                {portfolioWebsites.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      if (i !== currentIndex && !isAnimating) {
                        navigate(i > currentIndex ? 'right' : 'left');
                      }
                    }}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      i === currentIndex ? 'w-8 bg-red-500' : 'bg-white/30 hover:bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Right Arrow */}
            <button 
              onClick={() => navigate('right')}
              disabled={isAnimating}
              className="flex-shrink-0 w-14 h-14 lg:w-16 lg:h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-red-500 hover:border-red-500 transition-all duration-300 disabled:opacity-50 z-20"
            >
              <ChevronRight className="w-6 h-6 lg:w-8 lg:h-8" />
            </button>
          </div>

          {/* Website Counter */}
          <div className="text-center mt-8">
            <span className="text-white/40 text-sm">
              <span className="text-red-500 font-bold">{currentIndex + 1}</span> / {portfolioWebsites.length}
            </span>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="features-section relative py-24 px-6 lg:px-12 z-10 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/10 rounded-full mb-4">
              <Sparkles className="w-3 h-3 text-red-400" />
              <span className="text-xs uppercase tracking-[0.2em] text-red-400">Features</span>
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">Built for Performance</h2>
            <p className="text-white/50 max-w-2xl mx-auto">
              Every website we build is optimized for speed, accessibility, and conversion.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={index}
                  className="feature-card group p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-red-500/50 hover:bg-white/[0.08] transition-all duration-500"
                >
                  <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center mb-5 group-hover:bg-red-500/20 transition-colors">
                    <Icon className="w-6 h-6 text-red-500" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-red-400 transition-colors">{feature.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* PROCESS SECTION */}
      <section className="process-section relative py-24 px-6 lg:px-12 z-10 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/10 rounded-full mb-4">
                <span className="text-xs uppercase tracking-[0.2em] text-red-400">Our Process</span>
              </span>
              <h2 className="text-4xl sm:text-5xl font-bold mb-6">How We Build</h2>
              <p className="text-white/50 text-lg mb-8">
                A proven 5-step process that takes your project from concept to launch.
              </p>

              <div className="space-y-4">
                {['Weekly progress updates', 'Unlimited revisions during design', 'Full source code ownership', '30-day post-launch support'].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-red-500 flex-shrink-0" />
                    <span className="text-white/80">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {processSteps.map((step, index) => (
                <div 
                  key={index}
                  className="process-step flex gap-4 p-5 bg-white/5 rounded-2xl border border-white/10 hover:border-red-500/30 transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-red-500">{step.number}</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold mb-1">{step.title}</h4>
                    <p className="text-sm text-white/50">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TECH STACK */}
      <section className="tech-section relative py-24 px-6 lg:px-12 z-10 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/10 rounded-full mb-4">
              <Code2 className="w-3 h-3 text-red-400" />
              <span className="text-xs uppercase tracking-[0.2em] text-red-400">Tech Stack</span>
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">Modern Technologies</h2>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {technologies.map((tech, index) => (
              <div 
                key={index}
                className="tech-item flex items-center gap-3 px-6 py-4 bg-white/5 rounded-xl border border-white/10 hover:border-red-500/30 transition-all"
              >
                <span className="text-2xl">{tech.icon}</span>
                <span className="font-medium">{tech.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="relative py-32 px-6 lg:px-12 z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full opacity-30 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center, rgba(239, 68, 68, 0.3) 0%, transparent 60%)' }} 
        />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-br from-red-500/20 to-background rounded-3xl p-12 sm:p-16 border border-red-500/20">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">Ready to Launch?</h2>
            <p className="text-white/50 text-lg mb-8 max-w-xl mx-auto">
              Let's discuss your project and create a website that drives results.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/#chat" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black rounded-full font-medium hover:bg-red-500 hover:text-white transition-all">
                <span>Get a Free Quote</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a href="mailto:hello@sevit.agency" className="inline-flex items-center gap-2 px-8 py-4 border border-white/20 rounded-full hover:bg-white/5 transition-all">
                <span>Contact Us</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default WebDesignPage;
