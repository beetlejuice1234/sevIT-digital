import { useState, useRef, useEffect, type ReactNode } from 'react';

interface InViewProps {
  children: ReactNode;
  rootMargin?: string;
  threshold?: number;
  triggerOnce?: boolean;
  fallback?: ReactNode;
  className?: string;
}

/**
 * InView Component
 * 
 * Renders children only when they enter the viewport.
 * Perfect for lazy loading heavy sections, 3D components, and off-screen content.
 */
function InView({
  children,
  rootMargin = '100px',
  threshold = 0.01,
  triggerOnce = true,
  fallback = null,
  className = '',
}: InViewProps) {
  const [isInView, setIsInView] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (triggerOnce && hasTriggered) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            setHasTriggered(true);
            
            if (triggerOnce) {
              observer.disconnect();
            }
          } else if (!triggerOnce) {
            setIsInView(false);
          }
        });
      },
      {
        rootMargin,
        threshold,
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [rootMargin, threshold, triggerOnce, hasTriggered]);

  return (
    <div ref={ref} className={className}>
      {isInView ? children : fallback}
    </div>
  );
}

export default InView;
