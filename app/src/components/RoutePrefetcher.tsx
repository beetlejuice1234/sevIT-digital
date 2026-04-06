import { useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

// Route component map for prefetching
const routeComponents: Record<string, () => Promise<unknown>> = {
  '/services/web-design': () => import('../pages/services/WebDesignPage'),
  '/services/branding': () => import('../pages/services/BrandingPage'),
  '/services/3d-rendering': () => import('../pages/services/RenderingPage'),
  '/services/advertising': () => import('../pages/services/AdvertisingPage'),
  '/services/marketing': () => import('../pages/services/MarketingPage'),
  '/services/ai-solutions': () => import('../pages/services/AISolutionsPage'),
};

// Prefetch queue to manage concurrent prefetches
const prefetchQueue = new Set<string>();
const prefetchedRoutes = new Set<string>();

/**
 * Prefetch a route component
 */
const prefetchRoute = (path: string) => {
  if (prefetchedRoutes.has(path) || prefetchQueue.has(path)) return;
  
  const loader = routeComponents[path];
  if (!loader) return;

  prefetchQueue.add(path);
  
  // Use requestIdleCallback for non-critical prefetches
  const doPrefetch = () => {
    loader()
      .then(() => {
        prefetchedRoutes.add(path);
        prefetchQueue.delete(path);
      })
      .catch(() => {
        prefetchQueue.delete(path);
      });
  };

  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(doPrefetch, { timeout: 2000 });
  } else {
    setTimeout(doPrefetch, 100);
  }
};

/**
 * Route Prefetcher Component
 * 
 * Prefetches route components on hover and when browser is idle.
 * Makes navigation feel instant by loading components before user clicks.
 */
function RoutePrefetcher() {
  const location = useLocation();
  const observerRef = useRef<MutationObserver | null>(null);

  // Prefetch on link hover
  const handleMouseEnter = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const link = target.closest('a[href^="#/services/"]');
    
    if (link) {
      const href = link.getAttribute('href');
      if (href) {
        const path = href.replace('#', '');
        prefetchRoute(path);
      }
    }
  }, []);

  // Prefetch on touch start (for mobile)
  const handleTouchStart = useCallback((e: TouchEvent) => {
    const target = e.target as HTMLElement;
    const link = target.closest('a[href^="#/services/"]');
    
    if (link) {
      const href = link.getAttribute('href');
      if (href) {
        const path = href.replace('#', '');
        prefetchRoute(path);
      }
    }
  }, []);

  useEffect(() => {
    // Add event listeners for hover/touch prefetching
    document.addEventListener('mouseenter', handleMouseEnter, true);
    document.addEventListener('touchstart', handleTouchStart, true);

    // Prefetch visible links after initial load
    const prefetchVisibleLinks = () => {
      const links = document.querySelectorAll('a[href^="#/services/"]');
      links.forEach((link) => {
        const href = link.getAttribute('href');
        if (href) {
          const path = href.replace('#', '');
          // Prefetch links in viewport with lower priority
          const rect = link.getBoundingClientRect();
          if (rect.top < window.innerHeight && rect.bottom > 0) {
            if ('requestIdleCallback' in window) {
              window.requestIdleCallback(() => prefetchRoute(path), { timeout: 5000 });
            }
          }
        }
      });
    };

    // Delay prefetching visible links to not block initial render
    const timeoutId = setTimeout(prefetchVisibleLinks, 2000);

    // Watch for dynamically added links
    observerRef.current = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) {
            const links = node.querySelectorAll('a[href^="#/services/"]');
            links.forEach((link) => {
              const href = link.getAttribute('href');
              if (href) {
                const path = href.replace('#', '');
                prefetchRoute(path);
              }
            });
          }
        });
      });
    });

    observerRef.current.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      document.removeEventListener('mouseenter', handleMouseEnter, true);
      document.removeEventListener('touchstart', handleTouchStart, true);
      clearTimeout(timeoutId);
      observerRef.current?.disconnect();
    };
  }, [handleMouseEnter, handleTouchStart]);

  // Prefetch current route's adjacent routes
  useEffect(() => {
    const currentPath = location.pathname;
    const serviceRoutes = Object.keys(routeComponents);
    const currentIndex = serviceRoutes.indexOf(currentPath);
    
    if (currentIndex !== -1) {
      // Prefetch next and previous routes
      const nextRoute = serviceRoutes[currentIndex + 1];
      const prevRoute = serviceRoutes[currentIndex - 1];
      
      if (nextRoute) prefetchRoute(nextRoute);
      if (prevRoute) prefetchRoute(prevRoute);
    }
  }, [location.pathname]);

  return null;
}

export default RoutePrefetcher;
