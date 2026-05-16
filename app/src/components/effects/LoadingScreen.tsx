import { useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';

interface LoadingScreenProps {
  onComplete: () => void;
}

/**
 * GPU-Optimized Cinematic Loading Screen
 *
 * Sparkle mark performs an entry zoom + continuous float/glow,
 * horizontal wordmark fades in beneath it, progress bar drives
 * the reveal, and the whole thing exits with a scale + iris wipe.
 */
function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sparkleRef = useRef<HTMLImageElement>(null);
  const sparkleGlowRef = useRef<HTMLDivElement>(null);
  const wordmarkRef = useRef<HTMLImageElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const progressFillRef = useRef<HTMLDivElement>(null);
  const progressTextRef = useRef<HTMLSpanElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  const progressRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const isCompleteRef = useRef(false);

  const animateProgress = useCallback(() => {
    if (isCompleteRef.current) return;

    const remaining = 100 - progressRef.current;
    const increment = remaining * 0.03 + Math.random() * 1.5;
    progressRef.current = Math.min(progressRef.current + increment, 100);

    if (progressFillRef.current) {
      progressFillRef.current.style.transform = `scaleX(${progressRef.current / 100})`;
    }
    if (progressTextRef.current) {
      progressTextRef.current.textContent = `${Math.round(progressRef.current).toString().padStart(3, '0')}`;
    }

    if (progressRef.current >= 100) {
      isCompleteRef.current = true;

      const exitTl = gsap.timeline({
        onComplete: () => onComplete(),
      });

      // Pulse the sparkle one final time, then implode
      exitTl.to(sparkleGlowRef.current, {
        scale: 2.4,
        opacity: 0,
        duration: 0.7,
        ease: 'power2.out',
      });
      exitTl.to(
        sparkleRef.current,
        { scale: 1.25, duration: 0.35, ease: 'power2.out' },
        '<'
      );
      exitTl.to(
        sparkleRef.current,
        { scale: 0.4, opacity: 0, duration: 0.45, ease: 'power3.in' },
        '>'
      );
      exitTl.to(
        [wordmarkRef.current, taglineRef.current, progressBarRef.current, ringRef.current],
        { opacity: 0, y: -10, duration: 0.4, ease: 'power2.in', stagger: 0.04 },
        '-=0.6'
      );
      exitTl.to(
        containerRef.current,
        { opacity: 0, duration: 0.5, ease: 'power2.inOut' },
        '-=0.2'
      );

      return;
    }

    rafRef.current = requestAnimationFrame(animateProgress);
  }, [onComplete]);

  useEffect(() => {
    const entryTl = gsap.timeline();

    // Sparkle entry: zoom from 0
    entryTl.fromTo(
      sparkleRef.current,
      { opacity: 0, scale: 0.2, rotation: -45 },
      { opacity: 1, scale: 1, rotation: 0, duration: 1.1, ease: 'power3.out' }
    );

    entryTl.fromTo(
      sparkleGlowRef.current,
      { opacity: 0, scale: 0.4 },
      { opacity: 1, scale: 1, duration: 1.0, ease: 'power2.out' },
      '<0.1'
    );

    entryTl.fromTo(
      ringRef.current,
      { opacity: 0, scale: 0.6 },
      { opacity: 1, scale: 1, duration: 0.9, ease: 'power3.out' },
      '<'
    );

    entryTl.fromTo(
      wordmarkRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
      '-=0.4'
    );

    entryTl.fromTo(
      taglineRef.current,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' },
      '-=0.3'
    );

    entryTl.fromTo(
      progressBarRef.current,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' },
      '-=0.3'
    );

    // Continuous float on the sparkle
    gsap.to(sparkleRef.current, {
      y: -8,
      duration: 2.4,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    });

    // Slow rotation
    gsap.to(sparkleRef.current, {
      rotation: 360,
      duration: 18,
      ease: 'none',
      repeat: -1,
    });

    // Pulse glow
    gsap.to(sparkleGlowRef.current, {
      scale: 1.18,
      opacity: 0.55,
      duration: 1.6,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    });

    // Counter-rotating outer ring
    gsap.to(ringRef.current, {
      rotation: -360,
      duration: 24,
      ease: 'none',
      repeat: -1,
    });

    entryTl.add(() => {
      rafRef.current = requestAnimationFrame(animateProgress);
    });

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [animateProgress]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[200] bg-background flex flex-col items-center justify-center overflow-hidden"
      style={{
        backfaceVisibility: 'hidden',
        transform: 'translateZ(0)',
      }}
    >
      {/* Background: orange-tinted radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 50% 50%, rgba(255, 110, 30, 0.10) 0%, rgba(255, 110, 30, 0.04) 35%, transparent 70%)',
        }}
      />

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.06]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          maskImage:
            'radial-gradient(ellipse at 50% 50%, black 20%, transparent 70%)',
          WebkitMaskImage:
            'radial-gradient(ellipse at 50% 50%, black 20%, transparent 70%)',
        }}
      />

      <div className="relative z-10 flex flex-col items-center px-6">
        {/* Sparkle stack: ring + glow + mark */}
        <div className="relative w-40 h-40 sm:w-48 sm:h-48 flex items-center justify-center mb-6">
          {/* Outer rotating ring */}
          <div
            ref={ringRef}
            className="absolute inset-0 rounded-full border border-white/10 opacity-0"
            style={{
              borderTopColor: 'rgba(255, 110, 30, 0.6)',
              borderRightColor: 'rgba(255, 110, 30, 0.2)',
              willChange: 'transform, opacity',
            }}
          />
          {/* Inner static ring */}
          <div
            className="absolute inset-4 rounded-full border border-white/[0.04]"
          />
          {/* Glow */}
          <div
            ref={sparkleGlowRef}
            className="absolute inset-2 rounded-full opacity-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(circle, rgba(255, 110, 30, 0.55) 0%, rgba(255, 110, 30, 0.15) 40%, transparent 70%)',
              filter: 'blur(12px)',
              willChange: 'transform, opacity',
            }}
          />
          {/* Sparkle mark */}
          <img
            ref={sparkleRef}
            src="/images/sevIT_3d_sparkle_transparent_1.webp"
            alt=""
            className="relative w-28 h-28 sm:w-32 sm:h-32 object-contain opacity-0 select-none"
            draggable={false}
            style={{ willChange: 'transform, opacity' }}
          />
        </div>

        {/* Horizontal wordmark */}
        <img
          ref={wordmarkRef}
          src="/images/sevIT_horizontal_logo_transparent.png"
          alt="sevIT"
          className="h-10 sm:h-12 w-auto object-contain opacity-0 select-none"
          draggable={false}
          style={{ willChange: 'transform, opacity' }}
        />

        {/* Tagline */}
        <div
          ref={taglineRef}
          className="mt-3 text-[10px] sm:text-xs tracking-[0.4em] uppercase text-muted-foreground/70 opacity-0"
          style={{ willChange: 'transform, opacity' }}
        >
          AI · Design · Engineering
        </div>

        {/* Progress block */}
        <div
          ref={progressBarRef}
          className="mt-10 w-56 sm:w-72 opacity-0"
          style={{ willChange: 'transform, opacity' }}
        >
          <div className="flex items-center justify-between mb-2 text-[10px] tracking-[0.3em] uppercase text-muted-foreground/60 font-mono">
            <span>Booting Experience</span>
            <span>
              <span ref={progressTextRef}>000</span>
              <span className="ml-0.5">%</span>
            </span>
          </div>
          <div className="relative h-[2px] bg-white/[0.06] rounded-full overflow-hidden">
            <div
              ref={progressFillRef}
              className="absolute inset-y-0 left-0 right-0 origin-left rounded-full"
              style={{
                transform: 'scaleX(0)',
                background:
                  'linear-gradient(90deg, rgba(255,110,30,0.4) 0%, rgba(255,140,60,1) 50%, rgba(255,200,120,1) 100%)',
                boxShadow: '0 0 12px rgba(255,110,30,0.6)',
                willChange: 'transform',
              }}
            />
          </div>
        </div>
      </div>

      {/* Corner brackets */}
      <CornerBrackets />
    </div>
  );
}

function CornerBrackets() {
  const stroke = 'rgba(255,255,255,0.18)';
  const size = 'w-10 h-10 sm:w-14 sm:h-14';
  return (
    <>
      <div className={`absolute top-6 left-6 ${size} border-l border-t pointer-events-none`} style={{ borderColor: stroke }} />
      <div className={`absolute top-6 right-6 ${size} border-r border-t pointer-events-none`} style={{ borderColor: stroke }} />
      <div className={`absolute bottom-6 left-6 ${size} border-l border-b pointer-events-none`} style={{ borderColor: stroke }} />
      <div className={`absolute bottom-6 right-6 ${size} border-r border-b pointer-events-none`} style={{ borderColor: stroke }} />
    </>
  );
}

export default LoadingScreen;
