import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ChevronDown } from 'lucide-react';

/**
 * GPU-Optimized Hero Section
 * 
 * All animations use transform and opacity only for 60FPS hardware acceleration.
 * No layout properties are animated to prevent thrashing.
 */
function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const heading1Ref = useRef<HTMLSpanElement>(null);
  const heading2Ref = useRef<HTMLSpanElement>(null);
  const subheadingRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Master timeline with GPU-optimized defaults
      const tl = gsap.timeline({
        defaults: {
          ease: 'power3.out',
        },
        delay: 0.3, // Wait for loading screen
      });

      // Label entrance - transform only
      tl.fromTo(
        labelRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8 }
      );

      // Heading 1 - GPU accelerated with scale
      tl.fromTo(
        heading1Ref.current,
        { opacity: 0, y: 80, scale: 0.9 },
        { 
          opacity: 1, 
          y: 0, 
          scale: 1, 
          duration: 1.2, 
          ease: 'power4.out',
        },
        '-=0.5'
      );

      // Heading 2 - staggered entrance
      tl.fromTo(
        heading2Ref.current,
        { opacity: 0, y: 80, scale: 0.9 },
        { 
          opacity: 1, 
          y: 0, 
          scale: 1, 
          duration: 1.2, 
          ease: 'power4.out',
        },
        '-=0.9'
      );

      // Subheading - fade up
      tl.fromTo(
        subheadingRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8 },
        '-=0.6'
      );

      // CTA buttons - scale in
      tl.fromTo(
        ctaRef.current,
        { opacity: 0, y: 30, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.7 },
        '-=0.4'
      );

      // Scroll hint - fade in
      tl.fromTo(
        scrollHintRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.6 },
        '-=0.3'
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 z-10"
    >
      <div className="max-w-7xl mx-auto text-center">
        {/* Label - GPU accelerated */}
        <div
          ref={labelRef}
          className="mb-8 opacity-0"
          style={{
            willChange: 'transform, opacity',
            transform: 'translateZ(0)',
            backfaceVisibility: 'hidden',
          }}
        >
          <span className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium tracking-[0.3em] text-muted-foreground uppercase">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            Digital Marketing Agency
          </span>
        </div>

        {/* Main Heading - Fixed dimensions, GPU accelerated */}
        <h1 
          className="mb-8"
          style={{ 
            minHeight: 'clamp(120px, 18vw, 200px)',
          }}
        >
          <span
            ref={heading1Ref}
            className="block text-[12vw] sm:text-[10vw] lg:text-[8vw] font-bold leading-[0.9] text-white opacity-0"
            style={{
              willChange: 'transform, opacity',
              transform: 'translateZ(0)',
              backfaceVisibility: 'hidden',
            }}
          >
            ELEVATE
          </span>
          <span
            ref={heading2Ref}
            className="block text-[12vw] sm:text-[10vw] lg:text-[8vw] font-bold leading-[0.9] text-white opacity-0"
            style={{
              willChange: 'transform, opacity',
              transform: 'translateZ(0)',
              backfaceVisibility: 'hidden',
            }}
          >
            YOUR BRAND
          </span>
        </h1>

        {/* Subheading - GPU accelerated */}
        <p
          ref={subheadingRef}
          className="max-w-xl mx-auto text-base sm:text-lg text-muted-foreground leading-relaxed opacity-0"
          style={{
            minHeight: '56px',
            willChange: 'transform, opacity',
            transform: 'translateZ(0)',
            backfaceVisibility: 'hidden',
          }}
        >
          We craft stunning websites, powerful ad campaigns, and immersive 3D experiences 
          that launch your business into the digital stratosphere.
        </p>

        {/* CTA Buttons - GPU accelerated */}
        <div 
          ref={ctaRef}
          className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center opacity-0"
          style={{
            willChange: 'transform, opacity',
            transform: 'translateZ(0)',
            backfaceVisibility: 'hidden',
          }}
        >
          <a
            href="#chat"
            className="group relative inline-flex items-center justify-center px-8 py-4 text-sm font-medium text-background bg-foreground rounded-full overflow-hidden transition-transform duration-300 hover:scale-105"
            style={{
              willChange: 'transform',
              transform: 'translateZ(0)',
            }}
          >
            <span className="relative z-10">Start Your Project</span>
            <div 
              className="absolute inset-0 bg-accent transition-transform duration-300 translate-y-full group-hover:translate-y-0"
              style={{ willChange: 'transform' }}
            />
          </a>
          <a
            href="#services"
            className="inline-flex items-center justify-center px-8 py-4 text-sm font-medium text-foreground border border-border rounded-full transition-all duration-300 hover:bg-surface hover:border-foreground/20"
            style={{
              willChange: 'transform',
              transform: 'translateZ(0)',
            }}
          >
            Explore Services
          </a>
        </div>
      </div>

      {/* Scroll Hint - GPU accelerated */}
      <div
        ref={scrollHintRef}
        className="absolute bottom-8 left-1/2 flex flex-col items-center gap-2 opacity-0"
        style={{
          willChange: 'opacity',
          transform: 'translateX(-50%) translateZ(0)',
          backfaceVisibility: 'hidden',
        }}
      >
        <span className="text-xs text-muted-foreground tracking-wider uppercase">Scroll</span>
        <ChevronDown className="w-5 h-5 text-muted-foreground animate-scroll-bounce" />
      </div>
    </section>
  );
}

export default Hero;
