import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import gsap from 'gsap';

/**
 * PageTransition
 *
 * Wraps page content in a container that cross-fades (opacity) on every route
 * change with a 0.4s cubic-bezier ease. The Navbar is rendered outside this
 * component and therefore remains fully stable.
 *
 * - Enter: opacity 0 → 1 with a slight upward y-translate
 * - Leave: handled by starting the enter before the old content disappears
 *   (instant swap since React unmounts the old route before mounting the new one)
 *
 * Usage — wrap the <main> content in App.tsx:
 *   <PageTransition>
 *     <Routes>...</Routes>
 *   </PageTransition>
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Kill any running tween first to prevent conflicts
    gsap.killTweensOf(el);

    gsap.fromTo(
      el,
      { opacity: 0, y: 16 },
      {
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: 'cubic-bezier(0.4,0,0.2,1)',
        clearProps: 'all',
      }
    );
  }, [location.pathname]);

  return (
    <div
      ref={containerRef}
      style={{ willChange: 'opacity, transform', minHeight: '100%' }}
    >
      {children}
    </div>
  );
}

export default PageTransition;
