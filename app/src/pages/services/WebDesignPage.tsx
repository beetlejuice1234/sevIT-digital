import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, ChevronLeft, ChevronRight, ExternalLink, Code2, Zap, Smartphone, Search, Shield, Layers, Monitor, Sparkles, CheckCircle2, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

// Mobile Portfolio Swipe Deck Component
function MobilePortfolioDeck({ websites }: { websites: typeof portfolioWebsites }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  
  const dragStartX = useRef(0);
  const dragCurrentX = useRef(0);
  const dragStartY = useRef(0);
  const isSwipeValid = useRef(false);
  const rafId = useRef<number | null>(null);
  const isAnimating = useRef(false);

  const SWIPE_THRESHOLD = 60;
  const ROTATION_FACTOR = 0.05;

  const getStackOrder = useCallback(() => {
    const order = [];
    for (let i = 0; i < Math.min(3, websites.length); i++) {
      order.push((currentIndex + i) % websites.length);
    }
    return order;
  }, [currentIndex, websites.length]);

  const initializeStack = useCallback(() => {
    const order = getStackOrder();
    order.forEach((siteIdx, stackPos) => {
      const card = cardsRef.current[siteIdx];
      if (!card) return;
      const isTop = stackPos === 0;
      if (isTop) {
        gsap.set(card, { x: 0, y: 0, scale: 1, rotation: 0, opacity: 1, zIndex: 30 });
      } else {
        const depth = stackPos;
        gsap.set(card, {
          x: 0, y: depth * 10, scale: 1 - depth * 0.06, rotation: 0,
          opacity: 1, zIndex: 30 - depth * 10, filter: `brightness(${0.55 - depth * 0.15})`,
        });
      }
    });
    websites.forEach((_, idx) => {
      if (!order.includes(idx)) {
        const card = cardsRef.current[idx];
        if (card) gsap.set(card, { opacity: 0, zIndex: 0 });
      }
    });
  }, [currentIndex, getStackOrder, websites.length]);

  const updateDragPosition = useCallback((deltaX: number) => {
    const order = getStackOrder();
    const topCard = cardsRef.current[order[0]];
    const secondCard = cardsRef.current[order[1]];
    if (!topCard) return;
    const rotation = deltaX * ROTATION_FACTOR;
    const progress = Math.min(Math.abs(deltaX) / 150, 1);
    gsap.set(topCard, { x: deltaX, rotation, scale: 1 - progress * 0.02 });
    if (secondCard) {
      gsap.set(secondCard, {
        scale: 0.94 + progress * 0.06, y: 10 - progress * 10,
        filter: `brightness(${0.55 + progress * 0.45})`,
      });
    }
  }, [getStackOrder]);

  const swipeNext = useCallback(() => {
    if (isAnimating.current) return;
    isAnimating.current = true;
    const order = getStackOrder();
    const topCard = cardsRef.current[order[0]];
    const secondCard = cardsRef.current[order[1]];
    const thirdCard = cardsRef.current[order[2]];
    if (!topCard) { isAnimating.current = false; return; }
    gsap.to(topCard, { x: window.innerWidth, rotation: 15, opacity: 0, duration: 0.4, ease: 'power3.out' });
    if (secondCard) gsap.to(secondCard, { scale: 1, y: 0, filter: 'brightness(1)', zIndex: 30, duration: 0.4, ease: 'power3.out' });
    if (thirdCard) gsap.to(thirdCard, { scale: 0.94, y: 10, opacity: 1, filter: 'brightness(0.55)', zIndex: 20, duration: 0.4, ease: 'power3.out' });
    setTimeout(() => {
      gsap.set(topCard, { x: 0, rotation: 0, opacity: 0 });
      setCurrentIndex((prev) => (prev + 1) % websites.length);
      isAnimating.current = false;
    }, 400);
  }, [getStackOrder, websites.length]);

  const swipePrev = useCallback(() => {
    if (isAnimating.current) return;
    isAnimating.current = true;
    const prevIndex = (currentIndex - 1 + websites.length) % websites.length;
    const order = getStackOrder();
    const topCard = cardsRef.current[order[0]];
    const prevCard = cardsRef.current[prevIndex];
    if (!topCard || !prevCard) { isAnimating.current = false; return; }
    gsap.set(prevCard, { x: -window.innerWidth, opacity: 0, scale: 1, y: 0, zIndex: 35, filter: 'brightness(1)' });
    gsap.to(prevCard, { x: 0, opacity: 1, duration: 0.4, ease: 'power3.out' });
    gsap.to(topCard, { scale: 0.94, y: 10, filter: 'brightness(0.55)', zIndex: 20, duration: 0.4, ease: 'power3.out' });
    setTimeout(() => { setCurrentIndex(prevIndex); isAnimating.current = false; }, 400);
  }, [currentIndex, getStackOrder, websites.length]);

  const snapBack = useCallback(() => {
    const order = getStackOrder();
    const topCard = cardsRef.current[order[0]];
    const secondCard = cardsRef.current[order[1]];
    if (topCard) gsap.to(topCard, { x: 0, rotation: 0, scale: 1, duration: 0.5, ease: 'elastic.out(1, 0.6)' });
    if (secondCard) gsap.to(secondCard, { scale: 0.94, y: 10, filter: 'brightness(0.55)', duration: 0.4, ease: 'power3.out' });
  }, [getStackOrder]);

  const handleStart = useCallback((clientX: number, clientY: number) => {
    if (isAnimating.current) return;
    setIsDragging(true);
    dragStartX.current = clientX;
    dragStartY.current = clientY;
    dragCurrentX.current = clientX;
    isSwipeValid.current = false;
    const topCard = cardsRef.current[getStackOrder()[0]];
    if (topCard) gsap.killTweensOf(topCard);
  }, [getStackOrder]);

  const handleMove = useCallback((clientX: number, clientY: number) => {
    if (!isDragging || isAnimating.current) return;
    if (rafId.current) return;
    rafId.current = requestAnimationFrame(() => {
      dragCurrentX.current = clientX;
      const deltaX = clientX - dragStartX.current;
      const deltaY = clientY - dragStartY.current;
      if (!isSwipeValid.current && Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10) { rafId.current = null; return; }
      if (Math.abs(deltaY) > Math.abs(deltaX) * 1.2) { setIsDragging(false); rafId.current = null; return; }
      isSwipeValid.current = true;
      updateDragPosition(deltaX);
      rafId.current = null;
    });
  }, [isDragging, updateDragPosition]);

  const handleEnd = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);
    if (rafId.current) { cancelAnimationFrame(rafId.current); rafId.current = null; }
    if (!isSwipeValid.current || isAnimating.current) return;
    const deltaX = dragCurrentX.current - dragStartX.current;
    if (Math.abs(deltaX) > SWIPE_THRESHOLD) { deltaX > 0 ? swipeNext() : swipePrev(); } else { snapBack(); }
  }, [isDragging, swipeNext, swipePrev, snapBack]);

  useEffect(() => { initializeStack(); }, [currentIndex, initializeStack]);

  const stackOrder = getStackOrder();

  return (
    <div className="w-full px-4">
      <div className="relative mx-auto" style={{ maxWidth: '320px' }}>
        <div ref={containerRef} className="relative h-[460px] select-none cursor-grab active:cursor-grabbing"
          onTouchStart={(e) => handleStart(e.touches[0].clientX, e.touches[0].clientY)}
          onTouchMove={(e) => handleMove(e.touches[0].clientX, e.touches[0].clientY)}
          onTouchEnd={handleEnd}
          onMouseDown={(e) => handleStart(e.clientX, e.clientY)}
          onMouseMove={(e) => isDragging && handleMove(e.clientX, e.clientY)}
          onMouseUp={handleEnd}
          onMouseLeave={() => isDragging && handleEnd()}
          style={{ perspective: '1000px', touchAction: 'pan-y' }}
        >
          {websites.map((site, idx) => {
            const isInStack = stackOrder.includes(idx);
            const isTop = stackOrder.indexOf(idx) === 0;
            return (
              <div key={site.id} ref={(el) => { cardsRef.current[idx] = el; }} className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl"
                style={{ opacity: isInStack ? 1 : 0, pointerEvents: isTop ? 'auto' : 'none', willChange: 'transform, opacity', transform: 'translateZ(0)', border: `2px solid ${site.color}40` }}
              >
                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `linear-gradient(135deg, ${site.color}30, ${site.color}10)` }} />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 0%, transparent 40%, rgba(0,0,0,0.7) 70%, rgba(0,0,0,0.95) 100%)' }} />
                <div className="absolute inset-0 opacity-30" style={{ background: `radial-gradient(circle at 30% 20%, ${site.color}40, transparent 60%)` }} />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <span className="text-xs font-bold uppercase tracking-wider px-2 py-1 rounded" style={{ backgroundColor: `${site.color}30`, color: site.color }}>{site.category}</span>
                  <h3 className="text-2xl font-bold text-white mt-2">{site.title}</h3>
                  <p className="text-white/70 text-sm mt-1 line-clamp-2">{site.description}</p>
                  <a href={site.url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="mt-4 flex items-center justify-center gap-2 px-5 py-3 bg-white text-black rounded-full text-sm font-semibold hover:bg-gray-100 transition-all w-full">
                    <span>Open in New Tab</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
                {/* Site Favicon Placeholder - Center */}
                <div className="absolute top-12 left-1/2 -translate-x-1/2">
                  <div className="w-16 h-16 rounded-xl flex items-center justify-center shadow-lg" style={{ backgroundColor: site.color, border: '3px solid rgba(255,255,255,0.2)' }}>
                    <Globe className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-black/50 flex items-center justify-center border border-white/20">
                    <span className="text-[10px] font-bold text-white">{site.title.charAt(0)}</span>
                  </div>
                </div>
                {/* Category Icon - Top Right */}
                <div className="absolute top-4 right-4 w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${site.color}25` }}>
                  <Monitor className="w-5 h-5" style={{ color: site.color }} />
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex items-center justify-between mt-5 px-1">
          <button onClick={swipePrev} disabled={isAnimating.current} className="flex items-center gap-1.5 px-3 py-2.5 rounded-full bg-white/5 border border-white/10 text-white/70 hover:text-white hover:border-white/30 active:scale-95 transition-all disabled:opacity-50">
            <ChevronLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Prev</span>
          </button>
          <div className="flex items-center gap-1.5">
            {websites.map((_, idx) => (
              <button key={idx} onClick={() => !isAnimating.current && setCurrentIndex(idx)} className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-5 bg-red-500' : 'w-1.5 bg-white/30 hover:bg-white/50'}`} />
            ))}
          </div>
          <button onClick={swipeNext} disabled={isAnimating.current} className="flex items-center gap-1.5 px-3 py-2.5 rounded-full bg-white/5 border border-white/10 text-white/70 hover:text-white hover:border-white/30 active:scale-95 transition-all disabled:opacity-50">
            <span className="text-sm font-medium">Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="text-center mt-3">
          <span className="text-xs text-white/50">{currentIndex + 1} / {websites.length}</span>
        </div>
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
