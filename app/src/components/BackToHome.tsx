import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ArrowLeft, Home } from 'lucide-react';

interface BackToHomeProps {
  accentColor?: string;
  variant?: 'floating' | 'inline';
}

function BackToHome({ accentColor = '#EF4444', variant = 'floating' }: BackToHomeProps) {
  const buttonRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Subtle entrance animation
      gsap.fromTo(
        buttonRef.current,
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.6, ease: 'power2.out', delay: 0.5 }
      );
    });

    return () => ctx.revert();
  }, []);

  if (variant === 'inline') {
    return (
      <Link
        ref={buttonRef}
        to="/"
        className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white transition-all duration-300 group opacity-0"
      >
        <span 
          className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center group-hover:border-white/50 transition-colors duration-300"
          style={{ '--accent-color': accentColor } as React.CSSProperties}
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform duration-300" />
        </span>
        <span>Back to Home</span>
      </Link>
    );
  }

  return (
    <Link
      ref={buttonRef}
      to="/"
      className="fixed top-24 left-6 z-50 group opacity-0 will-change-transform"
      aria-label="Back to Home"
    >
      <div 
        className="relative flex items-center gap-3 px-4 py-3 rounded-full transition-all duration-500 ease-out will-change-[background,transform]"
        style={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        {/* Glow effect on hover */}
        <div 
          className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `linear-gradient(135deg, ${accentColor}20, transparent)`,
            filter: 'blur(8px)',
          }}
        />
        
        {/* Icon container */}
        <div 
          className="relative w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110"
          style={{ background: `${accentColor}20` }}
        >
          <ArrowLeft 
            className="w-4 h-4 transition-all duration-300 group-hover:-translate-x-0.5" 
            style={{ color: accentColor }}
          />
        </div>
        
        {/* Text - expands on hover */}
        <span 
          className="relative text-sm font-medium text-white/70 group-hover:text-white transition-all duration-300 max-w-0 group-hover:max-w-[100px] overflow-hidden whitespace-nowrap"
        >
          Back to Home
        </span>
        
        {/* Home icon appears on hover */}
        <Home 
          className="relative w-4 h-4 opacity-0 group-hover:opacity-100 transition-all duration-300 -ml-2 group-hover:ml-0"
          style={{ color: accentColor }}
        />
      </div>
    </Link>
  );
}

export default BackToHome;
