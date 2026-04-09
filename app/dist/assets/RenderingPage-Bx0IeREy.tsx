import React, { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Box, Layers, Sparkles, Camera, Cpu, Globe, Play, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import LazyImage from '../../components/ui/LazyImage';

gsap.registerPlugin(ScrollTrigger);

// Mobile Swipe Carousel Component
function MobileSwipeCarousel({ children, activeColor = 'bg-violet-500' }: { children: React.ReactNode[], activeColor?: string }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return;
    const scrollLeft = scrollRef.current.scrollLeft;
    const itemWidth = scrollRef.current.children[0].clientWidth;
    const newIndex = Math.round(scrollLeft / itemWidth);
    if (newIndex !== activeIndex) setActiveIndex(newIndex);
  }, [activeIndex]);

  return (
    <div className="lg:hidden block w-full pb-8">
      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 -mx-6 px-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] items-stretch"
      >
        {React.Children.map(children, (child) => (
          <div className="w-[85vw] shrink-0 snap-center h-auto flex flex-col">
            {child}
          </div>
        ))}
      </div>
      <div className="flex justify-center gap-2 mt-4">
        {React.Children.map(children, (_, i) => (
          <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === activeIndex ? "w-8 " + activeColor : 'w-2 bg-white/20'}`} />
        ))}
      </div>
    </div>
  );
}

const showcaseItems = [
  {
    id: 1,
    title: 'MATERIAL SIMULATION',
    tag: 'PBR • Subsurface',
    description: 'Physically accurate translucency and caustic light refraction.',
    image: '/images/3d-portfolio-1.jpg',
    rotation: -3,
    scale: 1.05,
  },
  {
    id: 2,
    title: 'LIGHTING MASTERY',
    tag: 'Volumetric • HDR',
    description: 'Studio-grade three-point lighting with controlled caustics.',
    image: '/images/3d-portfolio-2.jpg',
    rotation: 2,
    scale: 1,
  },
  {
    id: 3,
    title: 'TOPOLOGY EXCELLENCE',
    tag: 'Quad-Based • Clean',
    description: 'Subdivision-ready meshes and optimized UV unwrapping.',
    image: '/images/3d-portfolio-3.jpg',
    rotation: -1.5,
    scale: 0.95,
  },
  {
    id: 4,
    title: 'ENVIRONMENTAL STORYTELLING',
    tag: 'Context • Narrative',
    description: 'We build worlds that sell lifestyles, not just products.',
    image: '/images/3d-portfolio-4.jpg',
    rotation: 3.5,
    scale: 1.02,
  },
  {
    id: 5,
    title: 'COMPOSITION SCIENCE',
    tag: 'Camera • Focal',
    description: 'Every frame engineered for maximum visual persuasion.',
    image: '/images/3d-portfolio-5.jpg',
    rotation: -2.5,
    scale: 0.98,
  },
  {
    id: 6,
    title: 'MOTION & DYNAMICS',
    tag: 'Physics • Particles',
    description: 'Cinematic pacing and fluid dynamics that convert.',
    image: '/images/3d-portfolio-6.jpg',
    rotation: 1.5,
    scale: 1.03,
  },
];

const services = [
  {
    icon: Box,
    title: 'PRODUCT VISUALS',
    subtitle: 'Show Every Detail',
    description: `We create materials that look exactly like the real thing. Whether it's the subtle reflection on brushed metal or the precise way light passes through glass, we nail the details so you don't have to hire a photographer.

We make sure your product looks its absolute best from every single angle.`,
  },
  {
    icon: Globe,
    title: 'ARCHITECTURE & SPACES',
    subtitle: 'Build The Vibe',
    description: `We can build an entire room, building, or landscape before a single brick is actually laid. 

It's not just about showing the layout; it's about making people feel what it's like to actually stand in that space, using lighting and composition to capture the perfect mood.`,
  },
  {
    icon: Play,
    title: 'MOTION & ANIMATION',
    subtitle: 'Bring It To Life',
    description: `Static images are great, but showing your product in motion is what really grabs attention. 

We animate everything from simple, clean product spins to complex, dynamic reveals that would be incredibly difficult (and expensive) to shoot in real life.`,
  },
];

const methodologyPoints = [
  {
    icon: Cpu,
    title: 'SMART WORKFLOWS',
    desc: 'We keep our files clean and optimized so you get your renders delivered on time, every time.',
  },
  {
    icon: Camera,
    title: 'EYE FOR DESIGN',
    desc: 'We don\'t just light a scene; we craft an atmosphere that makes your product shine.',
  },
  {
    icon: Zap,
    title: 'BUILT TO SELL',
    desc: 'Our visuals aren\'t just pretty pictures—they\'re designed to make people want to buy.',
  },
];

function RenderingPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const isVisibleRef = useRef(true);

  // Starfield background with IntersectionObserver for performance
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

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero animations
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

      // Showcase items - staggered reveal with rotation
      gsap.fromTo('.showcase-item', 
        { opacity: 0, y: 120, rotateX: 15, scale: 0.85 }, 
        { 
          opacity: 1, y: 0, rotateX: 0, scale: 1, duration: 1.2, stagger: 0.2, ease: 'power4.out',
          scrollTrigger: { trigger: '.showcase-section', start: 'top 80%', once: true }
        }
      );

      // Floating accent orbs
      gsap.fromTo('.floating-orb', 
        { opacity: 0, scale: 0 }, 
        { 
          opacity: 1, scale: 1, duration: 1.5, stagger: 0.1, ease: 'elastic.out(1, 0.5)',
          scrollTrigger: { trigger: '.showcase-section', start: 'top 70%', once: true }
        }
      );

      // Services
      gsap.fromTo('.service-card', 
        { opacity: 0, x: -60 }, 
        { 
          opacity: 1, x: 0, duration: 0.8, stagger: 0.2, ease: 'power2.out',
          scrollTrigger: { trigger: '.services-section', start: 'top 75%', once: true }
        }
      );

      // Methodology
      gsap.fromTo('.method-point', 
        { opacity: 0, y: 50 }, 
        { 
          opacity: 1, y: 0, duration: 0.7, stagger: 0.15, ease: 'power2.out',
          scrollTrigger: { trigger: '.method-section', start: 'top 80%', once: true }
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-x-hidden">
      {/* Animated Starfield */}
      <canvas ref={canvasRef} className="fixed inset-0 w-full h-full pointer-events-none z-0" />

      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center px-6 lg:px-12 pt-32 pb-40 z-10">
        <div className="absolute inset-0 pointer-events-none" 
          style={{ background: 'radial-gradient(ellipse at 50% 30%, rgba(139, 92, 246, 0.15) 0%, transparent 60%)' }} 
        />

        <div className="relative z-10 max-w-6xl mx-auto text-center">
          {/* Label */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-500/10 border border-violet-500/30 rounded-full mb-10">
            <Layers className="w-4 h-4 text-violet-500" />
            <span className="text-xs uppercase tracking-[0.3em] text-violet-400">3D Render Studio</span>
          </div>

          {/* Massive Headline */}
          <h1 className="text-6xl sm:text-7xl lg:text-9xl font-black leading-[0.85] tracking-tighter mb-10">
            <span className="hero-line block opacity-0">REPLACE</span>
            <span className="hero-line block text-transparent bg-clip-text bg-gradient-to-r from-violet-500 via-purple-500 to-violet-500 opacity-0">
              REALITY.
            </span>
            <span className="hero-line block opacity-0">COMMAND</span>
            <span className="hero-line block text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-violet-500 to-purple-500 opacity-0">
              ATTENTION.
            </span>
          </h1>

          {/* Sub-headline */}
          <p className="hero-sub text-lg sm:text-xl text-white/60 max-w-3xl mx-auto mb-12 leading-relaxed opacity-0">
            We create 3D visuals that look totally real, without the headaches of physical photoshoots. Show off your products perfectly, from every angle, before they even exist.
          </p>

          {/* CTA */}
          <div className="hero-cta opacity-0">
            <Link 
              to="/#chat" 
              className="inline-flex items-center gap-3 px-10 py-5 bg-violet-500 text-white rounded-full font-bold text-lg uppercase tracking-wider hover:bg-white hover:text-black transition-all duration-300 group"
            >
              <span>Request a Custom Render Quote</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 text-white/40">
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-violet-500 to-transparent" />
        </div>
      </section>

      {/* DIMENSIONAL GALLERY — Abstract Showcase */}
      <section className="showcase-section relative py-32 px-6 lg:px-12 z-10 border-t border-white/10 overflow-hidden">
        {/* Ambient gradient washes */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-[10%] left-[-5%] w-[500px] h-[500px] rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.3) 0%, transparent 70%)' }} />
          <div className="absolute bottom-[10%] right-[-5%] w-[600px] h-[600px] rounded-full opacity-15"
            style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.25) 0%, transparent 70%)' }} />
          <div className="absolute top-[50%] left-[40%] w-[300px] h-[300px] rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, rgba(192,132,252,0.3) 0%, transparent 70%)' }} />
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
          <div className="text-center mb-24">
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full mb-6">
              <Sparkles className="w-3 h-3 text-violet-400" />
              <span className="text-xs uppercase tracking-[0.2em] text-white/40">Dimensional Exhibit</span>
            </span>
            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight">
              TECHNICAL DOMINANCE
            </h2>
            <p className="text-2xl sm:text-3xl text-violet-500 font-bold mt-2 uppercase tracking-wider">
              On Display
            </p>
            {/* Decorative line */}
            <div className="flex items-center justify-center gap-3 mt-8">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-violet-500/50" />
              <div className="w-2 h-2 rounded-full bg-violet-500/60" />
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-violet-500/50" />
            </div>
          </div>

          {/* Abstract Scattered Gallery - Desktop Only */}
          <div className="relative hidden lg:block" style={{ perspective: '1200px' }}>
            {/* Row 1 — Hero piece + offset companion */}
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-0 mb-8 lg:mb-[-40px] items-start">
              {/* Item 1 — Large hero piece */}
              <div
                className="showcase-item group relative w-full lg:w-[58%] opacity-0"
                style={{ transform: `rotate(${showcaseItems[0].rotation}deg)`, zIndex: 10 }}
              >
                <div className="relative overflow-hidden rounded-[2rem] lg:rounded-[2.5rem] transition-all duration-700 group-hover:scale-[1.02] group-hover:shadow-[0_0_60px_rgba(139,92,246,0.2)]"
                  style={{ clipPath: 'polygon(0 0, 100% 0, 100% 92%, 95% 100%, 0 100%)' }}>
                  {/* Animated gradient border */}
                  <div className="absolute inset-0 rounded-[2.5rem] z-20 pointer-events-none"
                    style={{ 
                      border: '1px solid transparent',
                      background: 'linear-gradient(#050505, #050505) padding-box, linear-gradient(135deg, rgba(139,92,246,0.4), transparent 40%, transparent 60%, rgba(168,85,247,0.3)) border-box',
                    }} />
                  <div className="aspect-[16/11] relative">
                    <LazyImage src={showcaseItems[0].image} alt={showcaseItems[0].title}
                      className="absolute inset-0 w-full h-full" placeholderColor="#0a0a0a" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                    {/* Hover scan line */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                      style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(139,92,246,0.03) 3px, rgba(139,92,246,0.03) 4px)' }} />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-1 h-8 bg-violet-500 rounded-full" />
                      <span className="text-[10px] uppercase tracking-[0.3em] text-violet-400 font-medium">{showcaseItems[0].tag}</span>
                    </div>
                    <h3 className="text-2xl lg:text-4xl font-black tracking-tight mb-3 group-hover:text-violet-200 transition-colors">{showcaseItems[0].title}</h3>
                    <p className="text-white/50 text-sm leading-relaxed max-w-md">{showcaseItems[0].description}</p>
                  </div>
                </div>
              </div>

              {/* Item 2 — Offset companion */}
              <div
                className="showcase-item group relative w-full lg:w-[46%] lg:ml-[-4%] lg:mt-[80px] opacity-0"
                style={{ transform: `rotate(${showcaseItems[1].rotation}deg)`, zIndex: 9 }}
              >
                <div className="relative overflow-hidden rounded-[2rem] transition-all duration-700 group-hover:scale-[1.03] group-hover:shadow-[0_0_50px_rgba(139,92,246,0.15)]"
                  style={{ clipPath: 'polygon(5% 0, 100% 0, 100% 100%, 0 100%, 0 8%)' }}>
                  <div className="absolute inset-0 z-20 pointer-events-none"
                    style={{ 
                      border: '1px solid transparent',
                      background: 'linear-gradient(#050505, #050505) padding-box, linear-gradient(225deg, rgba(139,92,246,0.3), transparent 50%) border-box',
                    }} />
                  <div className="aspect-[4/5] relative">
                    <LazyImage src={showcaseItems[1].image} alt={showcaseItems[1].title}
                      className="absolute inset-0 w-full h-full" placeholderColor="#0a0a0a" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/20" />
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                      style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(139,92,246,0.03) 3px, rgba(139,92,246,0.03) 4px)' }} />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-7">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-1 h-6 bg-violet-500 rounded-full" />
                      <span className="text-[10px] uppercase tracking-[0.3em] text-violet-400 font-medium">{showcaseItems[1].tag}</span>
                    </div>
                    <h3 className="text-xl lg:text-2xl font-black tracking-tight group-hover:text-violet-200 transition-colors">{showcaseItems[1].title}</h3>
                    <p className="text-white/40 text-xs leading-relaxed mt-2">{showcaseItems[1].description}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Row 2 — Three scattered pieces */}
            <div className="flex flex-col md:flex-row gap-8 md:gap-0 mb-8 lg:mb-[-30px] items-start">
              {/* Item 3 */}
              <div
                className="showcase-item group relative w-full md:w-[35%] opacity-0"
                style={{ transform: `rotate(${showcaseItems[2].rotation}deg)`, zIndex: 8 }}
              >
                <div className="relative overflow-hidden rounded-[1.5rem] lg:rounded-[2rem] transition-all duration-700 group-hover:scale-[1.04] group-hover:shadow-[0_0_40px_rgba(139,92,246,0.15)]"
                  style={{ clipPath: 'polygon(0 0, 100% 4%, 96% 100%, 0 100%)' }}>
                  <div className="absolute inset-0 z-20 pointer-events-none"
                    style={{ 
                      border: '1px solid transparent',
                      background: 'linear-gradient(#050505, #050505) padding-box, linear-gradient(180deg, rgba(139,92,246,0.25), transparent 60%) border-box',
                    }} />
                  <div className="aspect-[3/4] relative">
                    <LazyImage src={showcaseItems[2].image} alt={showcaseItems[2].title}
                      className="absolute inset-0 w-full h-full" placeholderColor="#0a0a0a" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                      style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(139,92,246,0.03) 3px, rgba(139,92,246,0.03) 4px)' }} />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-1 h-5 bg-violet-500 rounded-full" />
                      <span className="text-[10px] uppercase tracking-[0.3em] text-violet-400">{showcaseItems[2].tag}</span>
                    </div>
                    <h3 className="text-lg font-black tracking-tight group-hover:text-violet-200 transition-colors">{showcaseItems[2].title}</h3>
                  </div>
                </div>
              </div>

              {/* Item 4 — Center piece, pushed up */}
              <div
                className="showcase-item group relative w-full md:w-[38%] md:ml-[-3%] md:mt-[60px] opacity-0"
                style={{ transform: `rotate(${showcaseItems[3].rotation}deg)`, zIndex: 11 }}
              >
                <div className="relative overflow-hidden rounded-[2rem] transition-all duration-700 group-hover:scale-[1.03] group-hover:shadow-[0_0_50px_rgba(139,92,246,0.2)]"
                  style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 4% 96%)' }}>
                  <div className="absolute inset-0 z-20 pointer-events-none"
                    style={{ 
                      border: '1px solid transparent',
                      background: 'linear-gradient(#050505, #050505) padding-box, linear-gradient(45deg, rgba(168,85,247,0.3), transparent 40%, transparent 60%, rgba(139,92,246,0.25)) border-box',
                    }} />
                  <div className="aspect-[5/4] relative">
                    <LazyImage src={showcaseItems[3].image} alt={showcaseItems[3].title}
                      className="absolute inset-0 w-full h-full" placeholderColor="#0a0a0a" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                      style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(139,92,246,0.03) 3px, rgba(139,92,246,0.03) 4px)' }} />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-7">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-1 h-6 bg-violet-500 rounded-full" />
                      <span className="text-[10px] uppercase tracking-[0.3em] text-violet-400">{showcaseItems[3].tag}</span>
                    </div>
                    <h3 className="text-xl lg:text-2xl font-black tracking-tight group-hover:text-violet-200 transition-colors">{showcaseItems[3].title}</h3>
                    <p className="text-white/40 text-xs leading-relaxed mt-2 max-w-sm">{showcaseItems[3].description}</p>
                  </div>
                </div>
              </div>

              {/* Item 5 */}
              <div
                className="showcase-item group relative w-full md:w-[34%] md:ml-[-3%] opacity-0"
                style={{ transform: `rotate(${showcaseItems[4].rotation}deg)`, zIndex: 7 }}
              >
                <div className="relative overflow-hidden rounded-[1.5rem] lg:rounded-[2rem] transition-all duration-700 group-hover:scale-[1.04] group-hover:shadow-[0_0_40px_rgba(139,92,246,0.15)]"
                  style={{ clipPath: 'polygon(4% 0, 100% 0, 100% 96%, 0 100%)' }}>
                  <div className="absolute inset-0 z-20 pointer-events-none"
                    style={{ 
                      border: '1px solid transparent',
                      background: 'linear-gradient(#050505, #050505) padding-box, linear-gradient(315deg, rgba(139,92,246,0.3), transparent 50%) border-box',
                    }} />
                  <div className="aspect-[3/4] relative">
                    <LazyImage src={showcaseItems[4].image} alt={showcaseItems[4].title}
                      className="absolute inset-0 w-full h-full" placeholderColor="#0a0a0a" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                      style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(139,92,246,0.03) 3px, rgba(139,92,246,0.03) 4px)' }} />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-1 h-5 bg-violet-500 rounded-full" />
                      <span className="text-[10px] uppercase tracking-[0.3em] text-violet-400">{showcaseItems[4].tag}</span>
                    </div>
                    <h3 className="text-lg font-black tracking-tight group-hover:text-violet-200 transition-colors">{showcaseItems[4].title}</h3>
                  </div>
                </div>
              </div>
            </div>

            {/* Row 3 — Full-width cinematic strip */}
            <div
              className="showcase-item group relative w-full lg:w-[85%] mx-auto opacity-0"
              style={{ transform: `rotate(${showcaseItems[5].rotation}deg)`, zIndex: 12 }}
            >
              <div className="relative overflow-hidden rounded-[2rem] lg:rounded-[2.5rem] transition-all duration-700 group-hover:scale-[1.01] group-hover:shadow-[0_0_80px_rgba(139,92,246,0.15)]"
                style={{ clipPath: 'polygon(0 0, 100% 0, 98% 100%, 2% 100%)' }}>
                <div className="absolute inset-0 z-20 pointer-events-none"
                  style={{ 
                    border: '1px solid transparent',
                    background: 'linear-gradient(#050505, #050505) padding-box, linear-gradient(90deg, rgba(139,92,246,0.3), transparent 30%, transparent 70%, rgba(168,85,247,0.3)) border-box',
                  }} />
                <div className="aspect-[21/9] relative">
                  <LazyImage src={showcaseItems[5].image} alt={showcaseItems[5].title}
                    className="absolute inset-0 w-full h-full" placeholderColor="#0a0a0a" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                  {/* Cinematic bars */}
                  <div className="absolute top-0 left-0 right-0 h-[8%] bg-black/60" />
                  <div className="absolute bottom-0 left-0 right-0 h-[8%] bg-black/60" />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(139,92,246,0.03) 3px, rgba(139,92,246,0.03) 4px)' }} />
                </div>
                <div className="absolute bottom-[8%] left-0 right-0 p-8 lg:p-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-1 h-8 bg-violet-500 rounded-full" />
                    <span className="text-[10px] uppercase tracking-[0.3em] text-violet-400 font-medium">{showcaseItems[5].tag}</span>
                  </div>
                  <h3 className="text-2xl lg:text-3xl font-black tracking-tight group-hover:text-violet-200 transition-colors">{showcaseItems[5].title}</h3>
                  <p className="text-white/40 text-sm leading-relaxed mt-2 max-w-lg">{showcaseItems[5].description}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Swipe Gallery */}
          <MobileSwipeCarousel activeColor="bg-violet-500">
            {showcaseItems.map((item, index) => (
              <div key={index} className="relative overflow-hidden rounded-[2rem] bg-white/[0.02] border border-white/10 w-full h-[60vh] flex flex-col group">
                <div className="flex-1 relative overflow-hidden shrink-0">
                  <LazyImage src={item.image} alt={item.title} className="absolute inset-0 w-full h-full object-cover" placeholderColor="#0a0a0a" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-1 h-5 bg-violet-500 rounded-full" />
                    <span className="text-[10px] uppercase tracking-[0.3em] text-violet-400 font-bold">{item.tag}</span>
                  </div>
                  <h3 className="text-xl font-black tracking-tight mb-2 text-white">{item.title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </MobileSwipeCarousel>
        </div>

        {/* Keyframe animations */}
        <style>{`
          @keyframes float-orb {
            0% { transform: translateY(0px) translateX(0px); }
            100% { transform: translateY(-20px) translateX(10px); }
          }
        `}</style>
      </section>

      {/* STRATEGIC DEEP DIVE - TECHNICAL AUTHORITY */}
      <section className="services-section relative py-32 px-6 lg:px-12 z-10 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-20">
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full mb-6">
              <Cpu className="w-3 h-3 text-violet-400" />
              <span className="text-xs uppercase tracking-[0.2em] text-white/40">Technical Stack</span>
            </span>
            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight">
              THE RENDERING
            </h2>
            <p className="text-2xl sm:text-3xl text-violet-500 font-bold mt-2 uppercase tracking-wider">
              Engineering Stack
            </p>
          </div>

          {/* Desktop Grid */}
          <div className="hidden lg:grid grid-cols-3 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <div 
                  key={index}
                  className="service-card group relative opacity-0 h-full"
                >
                  <div className="relative h-full p-8 lg:p-10 rounded-3xl bg-white/[0.02] border border-white/10 hover:border-violet-500/50 transition-all duration-500 overflow-hidden flex flex-col">
                    {/* Glow effect */}
                    <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-violet-500/20 blur-3xl opacity-20 group-hover:opacity-40 transition-opacity" />

                    {/* Icon */}
                    <div className="relative w-16 h-16 rounded-2xl bg-violet-500/20 flex items-center justify-center mb-8 shrink-0">
                      <Icon className="w-8 h-8 text-violet-500" />
                    </div>

                    {/* Subtitle */}
                    <span className="text-xs uppercase tracking-[0.2em] text-violet-400 mb-4 block">
                      {service.subtitle}
                    </span>

                    {/* Title */}
                    <h3 className="text-2xl lg:text-3xl font-black mb-6">
                      {service.title}
                    </h3>

                    {/* Description */}
                    <div className="text-white/60 text-sm leading-relaxed whitespace-pre-line flex-1">
                      {service.description}
                    </div>

                    {/* Bottom accent */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-violet-500 to-transparent" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mobile Carousel */}
          <MobileSwipeCarousel activeColor="bg-violet-500">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <div 
                  key={index}
                  className="relative p-8 rounded-3xl bg-white/[0.03] border border-white/10 h-full flex flex-col overflow-hidden text-left"
                >
                  <div className="relative w-14 h-14 rounded-2xl bg-violet-500/20 flex items-center justify-center mb-6 shrink-0">
                    <Icon className="w-7 h-7 text-violet-500" />
                  </div>
                  <span className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-violet-400 mb-3 block font-bold">
                    {service.subtitle}
                  </span>
                  <h3 className="text-2xl font-black mb-4">
                    {service.title}
                  </h3>
                  <div className="text-white/60 text-sm sm:text-base leading-relaxed whitespace-pre-line flex-1">
                    {service.description}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-violet-500 to-transparent" />
                </div>
              );
            })}
          </MobileSwipeCarousel>
        </div>
      </section>

      {/* THE sevIT ADVANTAGE - METHODOLOGY */}
      <section className="method-section relative py-32 px-6 lg:px-12 z-10 border-t border-white/10">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-5xl sm:text-6xl font-black tracking-tight mb-4">
              WHY OUR RENDERS
            </h2>
            <p className="text-3xl sm:text-4xl text-violet-500 font-bold uppercase tracking-wider">
              LOOK "OVER-THE-TOP"
            </p>
          </div>

          {/* Main Copy */}
          <div className="text-center mb-20">
            <p className="text-xl sm:text-2xl text-white/70 leading-relaxed max-w-4xl mx-auto">
              Because we sweat the <span className="text-violet-500 font-bold">details</span>.
            </p>
            <p className="text-white/50 leading-relaxed max-w-3xl mx-auto mt-6">
              We don't just push a button and hope for the best. We meticulously craft every texture, light, and angle to make sure your product looks exactly how you want it to.
            </p>
            <p className="text-white/50 leading-relaxed max-w-3xl mx-auto mt-4">
              Behind the scenes, we keep our files clean and our processes tight. This means we can iterate quickly, hit your deadlines, and deliver image files that are ready to use everywhere—from your website to massive billboards.
            </p>
            <p className="text-2xl font-bold text-white mt-8 uppercase tracking-wider">
              The result? Visuals that actually grab attention and drive sales—
            </p>
            <p className="text-3xl font-black text-violet-500 mt-4 uppercase tracking-widest">
              Without the massive photoshoot budget.
            </p>
          </div>

          {/* Three Points */}
          {/* Desktop Grid */}
          <div className="hidden lg:grid grid-cols-3 gap-8">
            {methodologyPoints.map((point, index) => {
              const Icon = point.icon;
              return (
                <div 
                  key={index}
                  className="method-point text-center p-8 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-violet-500/30 hover:bg-white/[0.04] transition-all opacity-0"
                >
                  <div className="w-14 h-14 rounded-xl bg-violet-500/10 flex items-center justify-center mx-auto mb-6">
                    <Icon className="w-7 h-7 text-violet-500" />
                  </div>
                  <h4 className="text-sm font-bold uppercase tracking-wider mb-3">{point.title}</h4>
                  <p className="text-white/50 text-sm leading-relaxed">{point.desc}</p>
                </div>
              );
            })}
          </div>

          {/* Mobile Carousel */}
          <div className="lg:hidden">
            <MobileSwipeCarousel activeColor="bg-violet-500">
              {methodologyPoints.map((point, index) => {
                const Icon = point.icon;
                return (
                  <div 
                    key={index}
                    className="text-center p-8 rounded-2xl bg-white/[0.02] border border-white/10 flex flex-col justify-center items-center h-full w-full"
                  >
                    <div className="w-14 h-14 rounded-xl bg-violet-500/10 flex items-center justify-center mx-auto mb-5 shrink-0">
                      <Icon className="w-7 h-7 text-violet-500" />
                    </div>
                    <h4 className="text-sm font-bold uppercase tracking-wider mb-3">{point.title}</h4>
                    <p className="text-white/50 text-sm leading-relaxed">{point.desc}</p>
                  </div>
                );
              })}
            </MobileSwipeCarousel>
          </div>
        </div>
      </section>

      {/* FINAL CTA SECTION */}
      <section className="relative py-32 px-6 lg:px-12 z-10 border-t border-white/10 overflow-hidden">
        {/* Purple gradient orb */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] pointer-events-none"
          style={{ 
            background: 'radial-gradient(ellipse at center, rgba(139, 92, 246, 0.25) 0%, transparent 60%)',
            animation: 'pulse 4s ease-in-out infinite'
          }} 
        />

        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 0.5; transform: translate(-50%, -50%) scale(1); }
            50% { opacity: 0.8; transform: translate(-50%, -50%) scale(1.1); }
          }
        `}</style>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight mb-8">
            READY TO STOP USING
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-purple-500">
              STOCK PHOTOS?
            </span>
          </h2>

          <p className="text-lg sm:text-xl text-white/60 leading-relaxed max-w-2xl mx-auto mb-6">
            Your competitors are still shooting on white backgrounds. 
            Your products deserve better. Your brand demands better.
          </p>

          <p className="text-xl sm:text-2xl text-white font-bold mb-12">
            It's time to <span className="text-violet-500">dominate</span>.
          </p>

          <Link 
            to="/#chat" 
            className="inline-flex items-center gap-3 px-12 py-6 bg-violet-500 text-white rounded-full font-bold text-xl uppercase tracking-wider hover:bg-white hover:text-black transition-all duration-300 group"
          >
            <span>Schedule Your 3D Visual Strategy Session</span>
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </Link>

          <p className="text-white/30 text-sm mt-8 uppercase tracking-widest">
            No commitment required. We'll analyze your current visual strategy and show you exactly 
            where 3D rendering can replace costly production.
          </p>
        </div>
      </section>
    </div>
  );
}

export default RenderingPage;
