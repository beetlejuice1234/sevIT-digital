import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowLeft, ArrowRight, Target, BookOpen, Crown, BarChart3, Shield, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

const pillars = [
  {
    icon: Crown,
    title: 'THE ICON\nTHAT CONQUERS',
    subtitle: 'Logo Design',
    description: `A logo isn't decoration—it's the nucleus of your digital existence. We craft vector-perfect, mathematically precise marks engineered for instant recognition at 16px or 50 feet.

No templates. No recycled concepts. Every curve, every angle, every negative space is calculated for maximum psychological impact. We study color theory, gestalt principles, and competitive whitespace to ensure your mark doesn't just exist—it dominates.

Your logo will work on a billboard in Tokyo, an app icon in San Francisco, and a business card in London. Scalable. Timeless. Unforgettable.

This is where empires begin.`,
    color: '#EF4444',
  },
  {
    icon: BookOpen,
    title: 'THE BRAND BIBLE\nZERO DEVIATION',
    subtitle: 'Style Guides',
    description: `Inconsistent branding is brand suicide. One rogue social post, one off-color banner, one misplaced font—and your authority crumbles. We don't let that happen.

The sevIT Brand Bible is your company's constitutional law. It governs every pixel, every word, every interaction:

→ Typography pairings that command attention
→ Color psychology palettes engineered for conversion
→ Spatial rules that create visual hierarchy
→ Tone of voice constraints that maintain authority
→ Usage scenarios for every digital touchpoint

This isn't a PDF that collects dust. It's a living weapon that ensures every employee, every agency, every contractor represents your brand with surgical precision. Zero dilution. Maximum impact.`,
    color: '#F59E0B',
  },
  {
    icon: Target,
    title: 'STRATEGIC\nWARFARE',
    subtitle: 'Brand Strategy',
    description: `Before we touch a single pixel, we dissect your market. We analyze your competitors' positioning, identify their weaknesses, and find the psychological angles they missed.

Who is your ideal customer? What keeps them awake at 3 AM? What do they secretly desire that no one else is selling them?

We map the competitive landscape, tear down existing narratives, and engineer a brand position that makes you the only logical choice. Not the cheapest. Not the flashiest. The inevitable.

This is market warfare backed by data, psychology, and ruthless precision. When we're done, your competitors won't know what hit them.`,
    color: '#8B5CF6',
  },
];

const methodologyPoints = [
  {
    icon: BarChart3,
    title: 'DATA-DRIVEN DECISIONS',
    desc: 'No guesswork. Every color, font, and layout choice is backed by research.',
  },
  {
    icon: TrendingUp,
    title: 'CONVERSION-FOCUSED DESIGN',
    desc: 'Pretty doesn\'t pay. We engineer visual systems that turn visitors into buyers.',
  },
  {
    icon: Shield,
    title: 'COMPETITIVE INTELLIGENCE',
    desc: 'We study your market, identify gaps, and position you to dominate.',
  },
];

function BrandingPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activePillar, setActivePillar] = useState(0);

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

    let animationId: number;
    const animate = () => {
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

      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
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

      // Pillars
      gsap.fromTo('.pillar-card', 
        { opacity: 0, y: 80 }, 
        { 
          opacity: 1, y: 0, duration: 1, stagger: 0.2, ease: 'power3.out',
          scrollTrigger: { trigger: '.pillars-section', start: 'top 75%' }
        }
      );

      // Methodology
      gsap.fromTo('.method-point', 
        { opacity: 0, y: 50 }, 
        { 
          opacity: 1, y: 0, duration: 0.7, stagger: 0.15, ease: 'power2.out',
          scrollTrigger: { trigger: '.method-section', start: 'top 80%' }
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-x-hidden">
      {/* Animated Starfield */}
      <canvas ref={canvasRef} className="fixed inset-0 w-full h-full pointer-events-none z-0" />

      {/* Back Navigation */}
      <div className="fixed top-24 left-6 z-50">
        <Link to="/" className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back</span>
        </Link>
      </div>

      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center px-6 lg:px-12 pt-20 z-10">
        <div className="absolute inset-0 pointer-events-none" 
          style={{ background: 'radial-gradient(ellipse at 50% 30%, rgba(239, 68, 68, 0.15) 0%, transparent 60%)' }} 
        />

        <div className="relative z-10 max-w-6xl mx-auto text-center">
          {/* Label */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-full mb-10">
            <Crown className="w-4 h-4 text-red-500" />
            <span className="text-xs uppercase tracking-[0.3em] text-red-400">Brand Engineering</span>
          </div>

          {/* Massive Headline */}
          <h1 className="text-7xl sm:text-8xl lg:text-[10rem] font-black leading-[0.85] tracking-tighter mb-10">
            <span className="hero-line block opacity-0">VISUAL</span>
            <span className="hero-line block text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-500 to-red-500 opacity-0">
              DOMINANCE
            </span>
          </h1>

          {/* Sub-headline */}
          <p className="hero-sub text-lg sm:text-xl text-white/60 max-w-3xl mx-auto mb-12 leading-relaxed opacity-0">
            Your brand isn't a logo. It's a weapon. We engineer visual ecosystems that command 
            premium pricing, obliterate competition, and burn into the consumer psyche. While 
            others play with colors, we architect digital empires.
          </p>

          {/* CTA */}
          <div className="hero-cta opacity-0">
            <Link 
              to="/#chat" 
              className="inline-flex items-center gap-3 px-10 py-5 bg-red-500 text-white rounded-full font-bold text-lg uppercase tracking-wider hover:bg-white hover:text-black transition-all duration-300 group"
            >
              <span>Initiate Brand Overhaul</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40">
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-red-500 to-transparent" />
        </div>
      </section>

      {/* THREE PILLARS SECTION */}
      <section className="pillars-section relative py-32 px-6 lg:px-12 z-10 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-20">
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full mb-6">
              <span className="text-xs uppercase tracking-[0.2em] text-white/40">The Foundation</span>
            </span>
            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight">
              THE THREE PILLARS
            </h2>
            <p className="text-2xl sm:text-3xl text-red-500 font-bold mt-2 uppercase tracking-wider">
              Of Market Domination
            </p>
          </div>

          {/* Pillar Navigation (Mobile) */}
          <div className="flex justify-center gap-2 mb-12 lg:hidden">
            {pillars.map((_, i) => (
              <button
                key={i}
                onClick={() => setActivePillar(i)}
                className={`w-3 h-3 rounded-full transition-all ${
                  activePillar === i ? 'w-8 bg-red-500' : 'bg-white/20'
                }`}
              />
            ))}
          </div>

          {/* Pillars Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {pillars.map((pillar, index) => {
              const Icon = pillar.icon;
              const isActive = activePillar === index;
              
              return (
                <div 
                  key={index}
                  className={`pillar-card group relative opacity-0 ${
                    index > 0 ? 'hidden lg:block' : ''
                  } ${isActive ? 'block' : 'hidden lg:block'}`}
                  onClick={() => setActivePillar(index)}
                >
                  <div 
                    className="relative h-full p-8 lg:p-10 rounded-3xl bg-white/[0.02] border border-white/10 hover:border-red-500/50 transition-all duration-500 overflow-hidden"
                    style={{ boxShadow: `0 0 60px ${pillar.color}10` }}
                  >
                    {/* Glow effect */}
                    <div 
                      className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity"
                      style={{ background: pillar.color }}
                    />

                    {/* Icon */}
                    <div 
                      className="relative w-16 h-16 rounded-2xl flex items-center justify-center mb-8"
                      style={{ background: `${pillar.color}20` }}
                    >
                      <Icon className="w-8 h-8" style={{ color: pillar.color }} />
                    </div>

                    {/* Subtitle */}
                    <span 
                      className="text-xs uppercase tracking-[0.2em] mb-4 block"
                      style={{ color: pillar.color }}
                    >
                      {pillar.subtitle}
                    </span>

                    {/* Title */}
                    <h3 className="text-3xl lg:text-4xl font-black leading-[0.95] mb-6 whitespace-pre-line">
                      {pillar.title}
                    </h3>

                    {/* Description */}
                    <div className="text-white/60 text-sm leading-relaxed whitespace-pre-line">
                      {pillar.description}
                    </div>

                    {/* Bottom accent */}
                    <div 
                      className="absolute bottom-0 left-0 right-0 h-1"
                      style={{ background: `linear-gradient(90deg, transparent, ${pillar.color}, transparent)` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* METHODOLOGY SECTION */}
      <section className="method-section relative py-32 px-6 lg:px-12 z-10 border-t border-white/10">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-5xl sm:text-6xl font-black tracking-tight mb-4">
              THE sevIT
            </h2>
            <p className="text-3xl sm:text-4xl text-red-500 font-bold uppercase tracking-wider">
              METHODOLOGY
            </p>
            <p className="text-white/40 text-lg mt-4 uppercase tracking-widest">
              Why We Crush The Competition
            </p>
          </div>

          {/* Main Copy */}
          <div className="text-center mb-20">
            <p className="text-xl sm:text-2xl text-white/70 leading-relaxed max-w-4xl mx-auto">
              Most agencies design what "looks cool." We design what <span className="text-red-500 font-bold">converts</span>.
            </p>
            <p className="text-white/50 leading-relaxed max-w-3xl mx-auto mt-6">
              Every sevIT branding decision is backed by market research, consumer psychology, and conversion data. 
              We don't chase trends—we engineer trust, authority, and desire.
            </p>
            <p className="text-white/50 leading-relaxed max-w-3xl mx-auto mt-4">
              A sevIT brand isn't just recognizable. It's <span className="text-white font-semibold">magnetic</span>. 
              It lowers customer acquisition costs because prospects trust you before they even click. 
              It commands premium pricing because you look like the category leader. 
              It creates loyalty because customers feel like they're part of something bigger.
            </p>
            <p className="text-2xl font-bold text-white mt-8 uppercase tracking-wider">
              We don't build brands. We build digital monuments that outlast market shifts, economic downturns, and competitor attacks.
            </p>
            <p className="text-3xl font-black text-red-500 mt-4 uppercase tracking-widest">
              This is branding that prints money.
            </p>
          </div>

          {/* Three Points */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {methodologyPoints.map((point, index) => {
              const Icon = point.icon;
              return (
                <div 
                  key={index}
                  className="method-point text-center p-8 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-red-500/30 hover:bg-white/[0.04] transition-all opacity-0"
                >
                  <div className="w-14 h-14 rounded-xl bg-red-500/10 flex items-center justify-center mx-auto mb-6">
                    <Icon className="w-7 h-7 text-red-500" />
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
        {/* Orange/Red gradient orb */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] pointer-events-none"
          style={{ 
            background: 'radial-gradient(ellipse at center, rgba(239, 68, 68, 0.25) 0%, transparent 60%)',
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
            THE CHOICE
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">
              IS YOURS
            </span>
          </h2>

          <p className="text-lg sm:text-xl text-white/60 leading-relaxed max-w-2xl mx-auto mb-6">
            You can keep blending in. Keep using that forgettable logo. Keep watching competitors 
            steal your market share while your brand fades into digital noise.
          </p>

          <p className="text-xl sm:text-2xl text-white font-bold mb-12">
            Or you can <span className="text-red-500">step up</span>.
          </p>

          <p className="text-white/50 leading-relaxed max-w-2xl mx-auto mb-12">
            sevIT brands don't compete—they <span className="text-white font-semibold">dominate</span>. 
            They command attention. They print money. They make the competition look like amateurs 
            playing in the minor leagues.
          </p>

          <p className="text-red-500 font-bold uppercase tracking-widest mb-12">
            The market doesn't wait for the hesitant. It rewards the bold.
          </p>

          <p className="text-2xl font-black text-white uppercase tracking-wider mb-12">
            What's it going to be?
          </p>

          <Link 
            to="/#chat" 
            className="inline-flex items-center gap-3 px-12 py-6 bg-red-500 text-white rounded-full font-bold text-xl uppercase tracking-wider hover:bg-white hover:text-black transition-all duration-300 group"
          >
            <span>Book Your Domination Session</span>
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </Link>

          <p className="text-white/30 text-sm mt-8 uppercase tracking-widest">
            Limited availability. We only take on 4 new brand overhauls per month.
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative py-8 px-6 lg:px-12 z-10 border-t border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-1 text-lg font-bold">
            <span>sev</span>
            <span className="text-red-500">IT</span>
          </div>
          <p className="text-sm text-white/40">© {new Date().getFullYear()} sevIT Digital Agency</p>
          <Link to="/" className="text-sm text-white/40 hover:text-white transition-colors">Back to Home</Link>
        </div>
      </footer>
    </div>
  );
}

export default BrandingPage;
