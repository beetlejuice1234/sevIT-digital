import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Box, Layers, Sparkles, Camera, Cpu, Globe, Play, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import BackToHome from '../../components/BackToHome';
import LazyImage from '../../components/ui/LazyImage';

gsap.registerPlugin(ScrollTrigger);

const bentoBlocks = [
  {
    id: 1,
    size: 'large',
    title: 'HYPER-REALISTIC MATERIAL SIMULATION',
    description: 'Subsurface scattering, caustic light refraction, and physically accurate translucency. We engineer materials that don\'t just look real—they behave real under any lighting condition.',
    image: '/images/3d-portfolio-1.jpg',
  },
  {
    id: 2,
    size: 'medium',
    title: 'DRAMATIC LIGHTING MASTERY',
    description: 'Studio-grade three-point lighting, volumetric fog, and controlled caustics. Every shadow, highlight, and reflection is calculated to maximize visual impact.',
    image: '/images/3d-portfolio-2.jpg',
  },
  {
    id: 3,
    size: 'small',
    title: 'TOPOLOGY EXCELLENCE',
    description: 'Clean quad-based geometry, optimized UV unwrapping, and subdivision-ready meshes. The foundation of every great render is invisible wireframe perfection.',
    image: '/images/3d-portfolio-3.jpg',
  },
  {
    id: 4,
    size: 'medium',
    title: 'ENVIRONMENTAL STORYTELLING',
    description: 'Contextual props, atmospheric depth, and narrative composition. We don\'t just place products—we build worlds that sell lifestyles.',
    image: '/images/3d-portfolio-4.jpg',
  },
  {
    id: 5,
    size: 'small',
    title: 'COMPOSITION & ANGLE SCIENCE',
    description: 'Dynamic camera positioning, rule-of-thirds mastery, and focal length psychology. Every frame is engineered for maximum visual persuasion.',
    image: '/images/3d-portfolio-5.jpg',
  },
  {
    id: 6,
    size: 'wide',
    title: 'DYNAMIC ANIMATION & MOTION',
    description: 'Cinematic pacing, physics-based particle systems, and fluid dynamics. Static images capture attention—motion captures conversions.',
    image: '/images/3d-portfolio-6.jpg',
  },
];

const services = [
  {
    icon: Box,
    title: 'PRODUCT VISUALIZATION',
    subtitle: 'PBR Pipeline',
    description: `We deploy scientifically accurate material shaders with global illumination and ray-traced reflections. Every surface interaction—metal, glass, fabric, liquid—is calculated using real-world physics parameters.

The result? Visuals so convincing your customers can't tell if they're looking at a photograph or a render. That level of trust converts browsers into buyers.`,
  },
  {
    icon: Globe,
    title: 'ARCHITECTURAL RENDERS',
    subtitle: 'Atmospheric Immersion',
    description: `We build spaces before they exist. Photorealistic interiors and exteriors with accurate lighting simulation, material authenticity, and environmental context that sells the vision.

Whether it's pre-construction sales materials or portfolio showcases, our architectural renders create emotional connection before the first brick is laid.`,
  },
  {
    icon: Play,
    title: 'ANIMATIONS',
    subtitle: 'Cinematic Storytelling',
    description: `Dynamic camera work, physics-accurate motion, and optimized geometry for smooth playback. We craft product animations that feel like high-end commercials—

Fluid simulations, particle effects, and camera moves that would cost six figures to shoot physically. Delivered as optimized assets ready for web, social, and broadcast deployment.`,
  },
];

const methodologyPoints = [
  {
    icon: Cpu,
    title: 'TECHNICAL OPTIMIZATION',
    desc: 'Optimized geometry and fast render times without sacrificing quality.',
  },
  {
    icon: Camera,
    title: 'CREATIVE DIRECTION',
    desc: 'High-end visual storytelling that makes your products unforgettable.',
  },
  {
    icon: Zap,
    title: 'CONVERSION ENGINEERING',
    desc: 'Every render is built to stop scrolls and drive purchasing decisions.',
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

      // Bento blocks
      gsap.fromTo('.bento-block', 
        { opacity: 0, y: 80, scale: 0.95 }, 
        { 
          opacity: 1, y: 0, scale: 1, duration: 1, stagger: 0.15, ease: 'power3.out',
          scrollTrigger: { trigger: '.bento-section', start: 'top 75%', once: true }
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

      {/* Back Navigation - New Design */}
      <BackToHome accentColor="#8B5CF6" variant="floating" />

      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center px-6 lg:px-12 pt-20 z-10">
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
            Cinematic 3D visuals indistinguishable from reality—eliminating costly production, 
            logistics, and physical limitations. What you see is what you get. Before it exists.
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
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40">
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-violet-500 to-transparent" />
        </div>
      </section>

      {/* BENTO BOX PORTFOLIO EXHIBIT */}
      <section className="bento-section relative py-32 px-6 lg:px-12 z-10 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-20">
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full mb-6">
              <Sparkles className="w-3 h-3 text-violet-400" />
              <span className="text-xs uppercase tracking-[0.2em] text-white/40">Curated Digital Exhibit</span>
            </span>
            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight">
              TECHNICAL DOMINANCE
            </h2>
            <p className="text-2xl sm:text-3xl text-violet-500 font-bold mt-2 uppercase tracking-wider">
              On Display
            </p>
          </div>

          {/* Asymmetrical Bento Grid with Lazy Images */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {/* Block 1 - Large (2x2) */}
            <div className="bento-block lg:col-span-2 lg:row-span-2 opacity-0">
              <div className="group relative h-full min-h-[500px] lg:min-h-[700px] rounded-3xl overflow-hidden bg-white/[0.02] border border-white/10 hover:border-violet-500/50 transition-all duration-700">
                <LazyImage 
                  src={bentoBlocks[0].image} 
                  alt={bentoBlocks[0].title}
                  className="absolute inset-0 w-full h-full"
                  placeholderColor="#0a0a0a"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent pointer-events-none" />
                <div className="absolute bottom-0 left-0 right-0 p-8 pointer-events-none">
                  <span className="text-xs uppercase tracking-[0.2em] text-violet-400 mb-3 block">Material Simulation</span>
                  <h3 className="text-2xl lg:text-3xl font-bold mb-3">{bentoBlocks[0].title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed max-w-lg">{bentoBlocks[0].description}</p>
                </div>
              </div>
            </div>

            {/* Block 2 - Medium */}
            <div className="bento-block lg:col-span-1 lg:row-span-1 opacity-0">
              <div className="group relative h-full min-h-[340px] rounded-3xl overflow-hidden bg-white/[0.02] border border-white/10 hover:border-violet-500/50 transition-all duration-700">
                <LazyImage 
                  src={bentoBlocks[1].image} 
                  alt={bentoBlocks[1].title}
                  className="absolute inset-0 w-full h-full"
                  placeholderColor="#0a0a0a"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent pointer-events-none" />
                <div className="absolute bottom-0 left-0 right-0 p-6 pointer-events-none">
                  <span className="text-xs uppercase tracking-[0.2em] text-violet-400 mb-2 block">Lighting</span>
                  <h3 className="text-lg font-bold">{bentoBlocks[1].title}</h3>
                </div>
              </div>
            </div>

            {/* Block 3 - Small */}
            <div className="bento-block lg:col-span-1 lg:row-span-1 opacity-0">
              <div className="group relative h-full min-h-[340px] rounded-3xl overflow-hidden bg-white/[0.02] border border-white/10 hover:border-violet-500/50 transition-all duration-700">
                <LazyImage 
                  src={bentoBlocks[2].image} 
                  alt={bentoBlocks[2].title}
                  className="absolute inset-0 w-full h-full"
                  placeholderColor="#0a0a0a"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent pointer-events-none" />
                <div className="absolute bottom-0 left-0 right-0 p-6 pointer-events-none">
                  <span className="text-xs uppercase tracking-[0.2em] text-violet-400 mb-2 block">Topology</span>
                  <h3 className="text-lg font-bold">{bentoBlocks[2].title}</h3>
                </div>
              </div>
            </div>

            {/* Block 4 - Medium */}
            <div className="bento-block lg:col-span-1 lg:row-span-1 opacity-0">
              <div className="group relative h-full min-h-[340px] rounded-3xl overflow-hidden bg-white/[0.02] border border-white/10 hover:border-violet-500/50 transition-all duration-700">
                <LazyImage 
                  src={bentoBlocks[3].image} 
                  alt={bentoBlocks[3].title}
                  className="absolute inset-0 w-full h-full"
                  placeholderColor="#0a0a0a"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent pointer-events-none" />
                <div className="absolute bottom-0 left-0 right-0 p-6 pointer-events-none">
                  <span className="text-xs uppercase tracking-[0.2em] text-violet-400 mb-2 block">Environment</span>
                  <h3 className="text-lg font-bold">{bentoBlocks[3].title}</h3>
                </div>
              </div>
            </div>

            {/* Block 5 - Small */}
            <div className="bento-block lg:col-span-1 lg:row-span-1 opacity-0">
              <div className="group relative h-full min-h-[340px] rounded-3xl overflow-hidden bg-white/[0.02] border border-white/10 hover:border-violet-500/50 transition-all duration-700">
                <LazyImage 
                  src={bentoBlocks[4].image} 
                  alt={bentoBlocks[4].title}
                  className="absolute inset-0 w-full h-full"
                  placeholderColor="#0a0a0a"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent pointer-events-none" />
                <div className="absolute bottom-0 left-0 right-0 p-6 pointer-events-none">
                  <span className="text-xs uppercase tracking-[0.2em] text-violet-400 mb-2 block">Composition</span>
                  <h3 className="text-lg font-bold">{bentoBlocks[4].title}</h3>
                </div>
              </div>
            </div>

            {/* Block 6 - Large/Wide (2x1) */}
            <div className="bento-block lg:col-span-2 lg:row-span-1 opacity-0">
              <div className="group relative h-full min-h-[340px] rounded-3xl overflow-hidden bg-white/[0.02] border border-white/10 hover:border-violet-500/50 transition-all duration-700">
                <LazyImage 
                  src={bentoBlocks[5].image} 
                  alt={bentoBlocks[5].title}
                  className="absolute inset-0 w-full h-full"
                  placeholderColor="#0a0a0a"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent pointer-events-none" />
                <div className="absolute bottom-0 left-0 right-0 p-8 pointer-events-none">
                  <span className="text-xs uppercase tracking-[0.2em] text-violet-400 mb-3 block">Animation</span>
                  <h3 className="text-2xl font-bold mb-3">{bentoBlocks[5].title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed max-w-2xl">{bentoBlocks[5].description}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
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

          {/* Services Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <div 
                  key={index}
                  className="service-card group relative opacity-0"
                >
                  <div className="relative h-full p-8 lg:p-10 rounded-3xl bg-white/[0.02] border border-white/10 hover:border-violet-500/50 transition-all duration-500 overflow-hidden">
                    {/* Glow effect */}
                    <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-violet-500/20 blur-3xl opacity-20 group-hover:opacity-40 transition-opacity" />

                    {/* Icon */}
                    <div className="relative w-16 h-16 rounded-2xl bg-violet-500/20 flex items-center justify-center mb-8">
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
                    <div className="text-white/60 text-sm leading-relaxed whitespace-pre-line">
                      {service.description}
                    </div>

                    {/* Bottom accent */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-violet-500 to-transparent" />
                  </div>
                </div>
              );
            })}
          </div>
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
              Because they are <span className="text-violet-500 font-bold">engineered</span> that way.
            </p>
            <p className="text-white/50 leading-relaxed max-w-3xl mx-auto mt-6">
              We don't just output pixels—we engineer high-converting visual assets. Every render 
              balances technical optimization with uncompromising creative direction.
            </p>
            <p className="text-white/50 leading-relaxed max-w-3xl mx-auto mt-4">
              Our pipeline combines scientifically accurate PBR materials, optimized topology for 
              fast iteration, render farm efficiency for tight deadlines, and web-optimized exports 
              that load fast and look stunning.
            </p>
            <p className="text-2xl font-bold text-white mt-8 uppercase tracking-wider">
              The result? Visuals that dominate feeds, stop scrolls, and convert viewers—
            </p>
            <p className="text-3xl font-black text-violet-500 mt-4 uppercase tracking-widest">
              Without the six-figure production budgets.
            </p>
          </div>

          {/* Three Points */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
