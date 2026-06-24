import { useState, useRef, useEffect, memo } from 'react';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  objectClass?: string;
  placeholderColor?: string;
  loading?: 'eager' | 'lazy';
  onLoad?: () => void;
  /** When true + object-contain, renders a blurred scaled-up copy behind the image to fill letterbox bars */
  blurFill?: boolean;
}

/**
 * Performance-Optimized Lazy Image Component
 * 
 * Uses IntersectionObserver to load images only when they enter viewport.
 * Implements blur-up placeholder effect for perceived performance.
 * GPU-accelerated transitions for smooth fade-in.
 * Optional blurFill mode: fills letterbox/pillarbox bars with a blurred
 * color-bleed of the image itself (like Instagram/YouTube).
 */
const LazyImage = memo(function LazyImage({
  src,
  alt,
  className = '',
  objectClass = 'object-cover',
  placeholderColor = '#0a0a0a',
  loading = 'lazy',
  onLoad,
  blurFill = false,
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(loading === 'eager');
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const showBlurBg = blurFill && objectClass === 'object-contain';

  useEffect(() => {
    if (loading === 'eager') return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '200px', // Start loading 200px before entering viewport
        threshold: 0.01,
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [loading]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{
        backgroundColor: placeholderColor,
        willChange: 'contents',
      }}
    >
      {/* Placeholder / Skeleton */}
      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{
          opacity: isLoaded ? 0 : 1,
          background: `linear-gradient(90deg, ${placeholderColor} 25%, ${placeholderColor}dd 50%, ${placeholderColor} 75%)`,
          backgroundSize: '200% 100%',
          animation: isInView && !isLoaded ? 'shimmer 1.5s infinite' : 'none',
        }}
      />

      {/* Blurred background fill — scaled-up, blurred copy to replace black bars */}
      {showBlurBg && isInView && (
        <img
          src={src}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            opacity: isLoaded ? 0.55 : 0,
            transform: 'scale(1.3)',
            filter: 'blur(50px) saturate(1.4)',
            transition: 'opacity 0.6s ease-out',
            pointerEvents: 'none',
          }}
          loading={loading}
          decoding="async"
        />
      )}

      {/* Actual Image */}
      {isInView && (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          onLoad={handleLoad}
          className={`w-full h-full ${objectClass}`}
          style={{
            opacity: isLoaded ? 1 : 0,
            transform: isLoaded ? 'scale(1)' : 'scale(1.05)',
            transition: 'opacity 0.6s ease-out, transform 0.8s ease-out',
            willChange: 'opacity, transform',
            position: 'relative',
            zIndex: 1,
          }}
          loading={loading}
          decoding="async"
        />
      )}

      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
});

export default LazyImage;
