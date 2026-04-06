import { useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';

interface LoadingScreenProps {
  onComplete: () => void;
}

/**
 * GPU-Optimized Loading Screen
 * 
 * Uses requestAnimationFrame instead of setInterval for smooth 60FPS progress updates.
 * All animations use transform and opacity only for hardware acceleration.
 */
function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const progressFillRef = useRef<HTMLDivElement>(null);
  const progressTextRef = useRef<HTMLSpanElement>(null);
  
  // Use refs for animation state to avoid React re-renders
  const progressRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const isCompleteRef = useRef(false);

  // Smooth progress animation using RAF
  const animateProgress = useCallback(() => {
    if (isCompleteRef.current) return;

    // Increment progress with easing
    const remaining = 100 - progressRef.current;
    const increment = remaining * 0.03 + Math.random() * 2;
    progressRef.current = Math.min(progressRef.current + increment, 100);

    // Update DOM directly - no React state!
    if (progressFillRef.current) {
      progressFillRef.current.style.transform = `scaleX(${progressRef.current / 100})`;
    }
    if (progressTextRef.current) {
      progressTextRef.current.textContent = `${Math.round(progressRef.current)}%`;
    }

    // Check for completion
    if (progressRef.current >= 100) {
      isCompleteRef.current = true;
      
      // Exit animation timeline
      const exitTl = gsap.timeline({
        onComplete: () => {
          onComplete();
        },
      });

      exitTl.to(logoRef.current, {
        opacity: 0,
        y: -20,
        duration: 0.4,
        ease: 'power2.in',
      });

      exitTl.to(
        progressBarRef.current,
        {
          opacity: 0,
          duration: 0.3,
        },
        '-=0.25'
      );

      exitTl.to(
        containerRef.current,
        {
          opacity: 0,
          duration: 0.5,
          ease: 'power2.inOut',
        },
        '-=0.2'
      );
      
      return;
    }

    // Continue animation
    rafRef.current = requestAnimationFrame(animateProgress);
  }, [onComplete]);

  useEffect(() => {
    // Entry animation
    const entryTl = gsap.timeline();
    
    entryTl.fromTo(
      logoRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
    );
    
    entryTl.fromTo(
      progressBarRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' },
      '-=0.3'
    );

    // Start progress animation after entry
    entryTl.add(() => {
      rafRef.current = requestAnimationFrame(animateProgress);
    });

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [animateProgress]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[200] bg-background flex flex-col items-center justify-center"
      style={{
        backfaceVisibility: 'hidden',
        transform: 'translateZ(0)',
      }}
    >
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, rgba(59, 130, 246, 0.03) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 flex flex-col items-center">
        {/* Logo */}
        <div 
          ref={logoRef} 
          className="mb-8 opacity-0"
          style={{
            willChange: 'transform, opacity',
            transform: 'translateZ(0)',
          }}
        >
          <span className="text-5xl sm:text-6xl font-bold tracking-tight">
            <span className="text-foreground">sev</span>
            <span className="text-red-500">IT</span>
          </span>
        </div>

        {/* Progress Bar */}
        <div 
          ref={progressBarRef}
          className="w-48 sm:w-56 opacity-0"
          style={{
            willChange: 'transform, opacity',
            transform: 'translateZ(0)',
          }}
        >
          {/* Track */}
          <div className="h-[2px] bg-border/50 rounded-full overflow-hidden">
            {/* Fill - uses transform scaleX for GPU acceleration */}
            <div
              ref={progressFillRef}
              className="h-full bg-red-500 rounded-full origin-left"
              style={{
                transform: 'scaleX(0)',
                willChange: 'transform',
              }}
            />
          </div>
          
          {/* Percentage Text */}
          <div className="mt-3 text-center">
            <span 
              ref={progressTextRef}
              className="text-xs text-muted-foreground tracking-widest uppercase"
            >
              0%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoadingScreen;
