import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

interface LoadingScreenProps {
  onComplete: () => void;
}

function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.random() * 8;
      });
    }, 60);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const tl = gsap.timeline();
    
    tl.fromTo(
      logoRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
    );
    
    tl.fromTo(
      progressBarRef.current,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' },
      '-=0.3'
    );
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      const tl = gsap.timeline({
        onComplete: () => {
          onComplete();
        },
      });

      tl.to(logoRef.current, {
        opacity: 0,
        y: -15,
        duration: 0.3,
        ease: 'power2.in',
      });

      tl.to(
        progressBarRef.current,
        {
          opacity: 0,
          duration: 0.2,
        },
        '-=0.2'
      );

      tl.to(
        containerRef.current,
        {
          opacity: 0,
          duration: 0.4,
          ease: 'power2.inOut',
        },
        '-=0.1'
      );
    }
  }, [progress, onComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[200] bg-background flex flex-col items-center justify-center"
    >
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, rgba(59, 130, 246, 0.03) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 flex flex-col items-center">
        <div ref={logoRef} className="mb-8 opacity-0">
          <span className="text-5xl sm:text-6xl font-bold tracking-tight">
            <span className="text-foreground">sev</span>
            <span className="text-red-500">IT</span>
          </span>
        </div>

        <div 
          ref={progressBarRef}
          className="w-48 sm:w-56 opacity-0"
        >
          <div className="h-[2px] bg-border/50 rounded-full overflow-hidden">
            <div
              className="h-full bg-red-500 rounded-full transition-all duration-75 ease-out"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
          
          <div className="mt-3 text-center">
            <span className="text-xs text-muted-foreground tracking-widest uppercase">
              {Math.min(Math.round(progress), 100)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoadingScreen;
