import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Custom scroll restoration hook
 * 
 * Behavior:
 * - Navigating TO home page (/): Restores saved scroll position
 * - Navigating TO any sub-page: Forces scroll to top (0,0)
 * - Saves home page scroll position before leaving
 */
export function useScrollRestoration() {
  const { pathname } = useLocation();
  const isFirstMount = useRef(true);

  useEffect(() => {
    const isHomePage = pathname === '/';
    const isSubPage = pathname.startsWith('/services/');

    // Get saved scroll position from sessionStorage
    const savedPosition = sessionStorage.getItem('homeScrollPosition');
    const scrollY = savedPosition ? parseInt(savedPosition, 10) : 0;

    if (isHomePage) {
      // NAVIGATING TO HOME PAGE - Restore scroll position
      if (!isFirstMount.current) {
        // Use requestAnimationFrame to ensure DOM is ready
        requestAnimationFrame(() => {
          window.scrollTo(0, scrollY);
          // Refresh ScrollTrigger after restoring
          setTimeout(() => {
            ScrollTrigger.refresh();
          }, 50);
        });
      }
    } else if (isSubPage) {
      // NAVIGATING TO SUB-PAGE - Force scroll to top
      window.scrollTo(0, 0);
      ScrollTrigger.refresh();
    }

    // Update refs
    isFirstMount.current = false;

    // Save scroll position when LEAVING home page
    const handleScroll = () => {
      if (pathname === '/') {
        sessionStorage.setItem('homeScrollPosition', window.scrollY.toString());
      }
    };

    // Only attach scroll listener when on home page
    if (isHomePage) {
      window.addEventListener('scroll', handleScroll, { passive: true });
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [pathname]);
}
