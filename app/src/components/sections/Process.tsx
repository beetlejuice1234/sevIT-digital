import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Search, PenTool, Code, Rocket, Star, Orbit } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    number: '01',
    title: 'DISCOVER',
    subtitle: 'Audit & Strategy',
    description: 'We analyze your current digital presence, identify opportunities, and craft a strategic roadmap tailored to your goals.',
    icon: Search,
  },
  {
    number: '02',
    title: 'DESIGN',
    subtitle: 'UI/UX & Branding',
    description: 'Our designers create stunning, user-centered interfaces that align with your brand and delight your audience.',
    icon: PenTool,
  },
  {
    number: '03',
    title: 'DEVELOP',
    subtitle: 'Code & Integration',
    description: 'We build robust, scalable solutions using cutting-edge technology and integrate tools where they add the most value.',
    icon: Code,
  },
  {
    number: '04',
    title: 'DEPLOY',
    subtitle: 'Launch & Optimize',
    description: 'Your project goes live with monitoring, analytics, and continuous optimization for peak performance.',
    icon: Rocket,
  },
];

/**
 * GPU-Optimized Process Section
 * 
 * SVG line animation uses stroke-dashoffset (GPU accelerated).
 * Card animations use transform and opacity only.
 */
function Process() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<SVGPathElement>(null);
  const stepsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header entrance - GPU accelerated
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            once: true,
          },
        }
      );

      // SVG line draw animation - stroke-dashoffset is GPU accelerated
      if (lineRef.current) {
        const pathLength = lineRef.current.getTotalLength();
        
        gsap.set(lineRef.current, {
          strokeDasharray: pathLength,
          strokeDashoffset: pathLength,
          willChange: 'stroke-dashoffset',
        });

        gsap.to(lineRef.current, {
          strokeDashoffset: 0,
          duration: 2,
          ease: 'power2.inOut',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 60%',
            end: 'bottom 80%',
            scrub: 1,
          },
        });
      }

      // Steps staggered entrance - GPU accelerated
      stepsRef.current.forEach((step, i) => {
        if (!step) return;
        
        gsap.fromTo(
          step,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: step,
              start: 'top 85%',
              once: true,
            },
            delay: i * 0.1,
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="process"
      className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 z-40"
    >
      {/* Space decorations - CSS animations */}
      <div className="absolute top-20 left-10 text-accent/20">
        <Star className="w-5 h-5 animate-pulse" />
      </div>
      <div className="absolute bottom-40 right-20 text-accent/15">
        <Orbit className="w-8 h-8 animate-pulse" style={{ animationDelay: '0.5s' }} />
      </div>

      {/* Section Header - GPU accelerated */}
      <div 
        ref={headerRef} 
        className="max-w-7xl mx-auto mb-16 sm:mb-24 text-center"
        style={{
          willChange: 'transform, opacity',
          transform: 'translateZ(0)',
        }}
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/10 rounded-full mb-4">
          <Orbit className="w-3 h-3 text-accent" />
          <span className="text-xs font-medium text-accent uppercase tracking-wider">Our Process</span>
        </div>
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
          Launch Sequence
        </h2>
        <p className="max-w-2xl mx-auto text-muted-foreground text-base sm:text-lg">
          Our proven four-stage process that launches your brand 
          from concept to digital stardom.
        </p>
      </div>

      {/* Process Steps */}
      <div className="max-w-7xl mx-auto relative">
        {/* Connecting Line - Desktop - SVG animation is GPU accelerated */}
        <svg
          className="absolute top-1/2 left-0 w-full h-4 -translate-y-1/2 hidden lg:block"
          preserveAspectRatio="none"
          style={{
            willChange: 'contents',
          }}
        >
          <path
            ref={lineRef}
            d="M 100 8 Q 300 8 400 8 Q 500 8 600 8 Q 700 8 800 8 Q 900 8 1000 8 Q 1100 8 1200 8"
            fill="none"
            stroke="url(#lineGradient)"
            strokeWidth="2"
            strokeLinecap="round"
            className="opacity-60"
          />
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#3B82F6" stopOpacity="1" />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.2" />
            </linearGradient>
          </defs>
        </svg>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                ref={(el) => { stepsRef.current[index] = el; }}
                className="relative group"
                style={{
                  willChange: 'transform, opacity',
                  transform: 'translateZ(0)',
                }}
              >
                {/* Step Card */}
                <div 
                  className="relative bg-surface/50 backdrop-blur-sm rounded-3xl p-8 border border-border/50 transition-all duration-500 hover:border-foreground/20 hover:bg-surface"
                  style={{
                    willChange: 'transform',
                  }}
                >
                  {/* Step Number */}
                  <div className="absolute -top-4 left-8 px-3 py-1 bg-accent rounded-full">
                    <span className="text-xs font-bold text-white">{step.number}</span>
                  </div>

                  {/* Icon - GPU accelerated hover */}
                  <div 
                    className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110"
                    style={{
                      willChange: 'transform',
                    }}
                  >
                    <Icon className="w-6 h-6 text-accent" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold text-foreground mb-1">
                    {step.title}
                  </h3>
                  <p className="text-sm text-accent mb-4">{step.subtitle}</p>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Connector dot - Desktop */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-6 -translate-y-1/2 z-10">
                    <div className="w-full h-full rounded-full bg-accent/20 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-accent" />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Process;
