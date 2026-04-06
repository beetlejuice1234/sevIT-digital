import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ChevronDown } from 'lucide-react';

function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const heading1Ref = useRef<HTMLHeadingElement>(null);
  const heading2Ref = useRef<HTMLHeadingElement>(null);
  const subheadingRef = useRef<HTMLParagraphElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // Label fade in
      tl.fromTo(
        labelRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8 }
      );

      // Heading 1 clip-path reveal
      tl.fromTo(
        heading1Ref.current,
        { clipPath: 'inset(100% 0 0 0)', opacity: 0 },
        { clipPath: 'inset(0% 0 0 0)', opacity: 1, duration: 1, ease: 'expo.out' },
        '-=0.4'
      );

      // Heading 2 clip-path reveal
      tl.fromTo(
        heading2Ref.current,
        { clipPath: 'inset(100% 0 0 0)', opacity: 0 },
        { clipPath: 'inset(0% 0 0 0)', opacity: 1, duration: 1, ease: 'expo.out' },
        '-=0.7'
      );

      // Subheading fade in
      tl.fromTo(
        subheadingRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8 },
        '-=0.5'
      );

      // Scroll hint
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
        {/* Label */}
        <div
          ref={labelRef}
          className="mb-8 opacity-0"
        >
          <span className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium tracking-[0.3em] text-muted-foreground uppercase">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            Digital Marketing Agency
          </span>
        </div>

        {/* Main Heading */}
        <h1 className="mb-8">
          <span
            ref={heading1Ref}
            className="block text-[12vw] sm:text-[10vw] lg:text-[8vw] font-bold leading-[0.9] text-white opacity-0"
            style={{ clipPath: 'inset(100% 0 0 0)' }}
          >
            ELEVATE
          </span>
          <span
            ref={heading2Ref}
            className="block text-[12vw] sm:text-[10vw] lg:text-[8vw] font-bold leading-[0.9] text-white opacity-0"
            style={{ clipPath: 'inset(100% 0 0 0)' }}
          >
            YOUR BRAND
          </span>
        </h1>

        {/* Subheading */}
        <p
          ref={subheadingRef}
          className="max-w-xl mx-auto text-base sm:text-lg text-muted-foreground leading-relaxed opacity-0"
        >
          We craft stunning websites, powerful ad campaigns, and immersive 3D experiences 
          that launch your business into the digital stratosphere.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center opacity-0 animate-fade-up" style={{ animationDelay: '1.2s', animationFillMode: 'forwards' }}>
          <a
            href="#chat"
            className="group relative inline-flex items-center justify-center px-8 py-4 text-sm font-medium text-background bg-foreground rounded-full overflow-hidden transition-all duration-300 hover:scale-105"
          >
            <span className="relative z-10">Start Your Project</span>
            <div className="absolute inset-0 bg-accent transition-transform duration-300 translate-y-full group-hover:translate-y-0" />
          </a>
          <a
            href="#services"
            className="inline-flex items-center justify-center px-8 py-4 text-sm font-medium text-foreground border border-border rounded-full transition-all duration-300 hover:bg-surface hover:border-foreground/20"
          >
            Explore Services
          </a>
        </div>
      </div>

      {/* Scroll Hint */}
      <div
        ref={scrollHintRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-0"
      >
        <span className="text-xs text-muted-foreground tracking-wider uppercase">Scroll</span>
        <ChevronDown className="w-5 h-5 text-muted-foreground animate-scroll-bounce" />
      </div>
    </section>
  );
}

export default Hero;
