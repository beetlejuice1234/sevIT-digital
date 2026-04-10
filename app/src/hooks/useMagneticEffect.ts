import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface MagneticOptions {
  /** How far (in px) the cursor must be to start pulling the element */
  radius?: number;
  /** Strength of the pull — 0.3 feels heavy/premium, 1 feels floaty */
  strength?: number;
  /** Spring ease used on departure */
  ease?: string;
}

/**
 * useMagneticEffect
 *
 * Attaches a GSAP-driven magnetic pull to the returned `ref`.
 * The element gravitates toward the cursor when within `radius` px,
 * then springs back with heavy damping so it feels premium, not floaty.
 *
 * Usage:
 *   const ref = useMagneticEffect<HTMLAnchorElement>();
 *   return <a ref={ref} ...>CTA</a>;
 */
export function useMagneticEffect<T extends HTMLElement>(
  options: MagneticOptions = {}
) {
  const { radius = 50, strength = 0.35, ease = 'power4.out' } = options;
  const elementRef = useRef<T | null>(null);

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    // Only on non-touch devices
    if (window.matchMedia('(hover: none)').matches) return;

    let bounds: DOMRect;

    const onMouseMove = (e: MouseEvent) => {
      bounds = el.getBoundingClientRect();
      const centerX = bounds.left + bounds.width / 2;
      const centerY = bounds.top + bounds.height / 2;
      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < radius) {
        const pull = (radius - distance) / radius; // 0→1 as cursor gets closer
        gsap.to(el, {
          x: dx * strength * pull,
          y: dy * strength * pull,
          duration: 0.6,
          ease: 'power3.out',
          overwrite: true,
        });
      } else {
        // Snap back with heavy spring feel
        gsap.to(el, {
          x: 0,
          y: 0,
          duration: 0.9,
          ease,
          overwrite: true,
        });
      }
    };

    const onMouseLeave = () => {
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 1.1,
        ease,
        overwrite: true,
      });
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    el.addEventListener('mouseleave', onMouseLeave);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      el.removeEventListener('mouseleave', onMouseLeave);
      gsap.killTweensOf(el);
      gsap.set(el, { x: 0, y: 0 });
    };
  }, [radius, strength, ease]);

  return elementRef;
}
