import { useEffect, useRef } from 'react';
import gsap from 'gsap';

/**
 * useTextReveal
 *
 * Splits a container's direct children into "lines" and slides each
 * one up from opacity 0 → 1 as it enters the viewport.
 *
 * Fires ONCE per session via a sessionStorage flag keyed on the element ID.
 *
 * Usage:
 *   const ref = useTextReveal<HTMLParagraphElement>('hero-sub');
 *   return <p ref={ref} id="hero-sub">...</p>;
 *
 * For paragraphs with no child elements the whole element is treated as
 * one "line" and animated as a single unit.
 */
export function useTextReveal<T extends HTMLElement>(
  /** Unique ID used as the sessionStorage key to enforce once-per-session */
  sessionKey: string,
  options: {
    stagger?: number;
    duration?: number;
    y?: number;
    ease?: string;
    threshold?: number;
  } = {}
) {
  const {
    stagger = 0.12,
    duration = 0.75,
    y = 40,
    ease = 'power3.out',
    threshold = 0.2,
  } = options;
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const storageKey = `sevit-text-reveal-${sessionKey}`;
    const alreadyPlayed = sessionStorage.getItem(storageKey);
    if (alreadyPlayed) return; // respect once-per-session

    // Collect targets — direct children if any, else the element itself
    const children = Array.from(el.children) as HTMLElement[];
    const targets: HTMLElement[] = children.length > 0 ? children : [el];

    // Set initial state
    gsap.set(targets, { opacity: 0, y, willChange: 'transform, opacity' });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            gsap.to(targets, {
              opacity: 1,
              y: 0,
              duration,
              stagger,
              ease,
              onComplete: () => {
                sessionStorage.setItem(storageKey, '1');
                gsap.set(targets, { willChange: 'auto' });
              },
            });
            observer.disconnect();
          }
        });
      },
      { threshold }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      gsap.killTweensOf(targets);
    };
  }, [sessionKey, stagger, duration, y, ease, threshold]);

  return ref;
}
