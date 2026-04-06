import { useState, useEffect, Suspense, lazy } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Eager-loaded critical components
import Navbar from './components/Navbar';
import LoadingScreen from './components/effects/LoadingScreen';
import Footer from './components/sections/Footer';
import RoutePrefetcher from './components/RoutePrefetcher';

// Lazy load pages for code splitting with prefetch hints
const HomePage = lazy(() => import('./pages/HomePage'));
const WebDesignPage = lazy(() => import('./pages/services/WebDesignPage'));
const BrandingPage = lazy(() => import('./pages/services/BrandingPage'));
const RenderingPage = lazy(() => import('./pages/services/RenderingPage'));
const AdvertisingPage = lazy(() => import('./pages/services/AdvertisingPage'));
const MarketingPage = lazy(() => import('./pages/services/MarketingPage'));
const AISolutionsPage = lazy(() => import('./pages/services/AISolutionsPage'));

/**
 * Custom Scroll Restoration Component
 * 
 * STRICT BEHAVIOR:
 * - Navigating TO home page (/): Restores saved scroll position from sessionStorage
 * - Navigating TO any sub-page (/services/*): Forces scroll to top (0,0)
 * - Saves home page scroll position to sessionStorage on every scroll
 */
function ScrollRestoration() {
  const { pathname } = useLocation();

  useEffect(() => {
    const isHomePage = pathname === '/';
    const isSubPage = pathname.startsWith('/services/');

    // Get saved scroll position from sessionStorage
    const savedPosition = sessionStorage.getItem('homeScrollPosition');
    const scrollY = savedPosition ? parseInt(savedPosition, 10) : 0;

    if (isHomePage) {
      // NAVIGATING TO HOME PAGE - Restore scroll position
      requestAnimationFrame(() => {
        window.scrollTo(0, scrollY);
        ScrollTrigger.refresh();
      });
    } else if (isSubPage) {
      // NAVIGATING TO SUB-PAGE - Force scroll to top
      window.scrollTo(0, 0);
      ScrollTrigger.refresh();
    }

    // Save scroll position when on home page
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

  return null;
}

// Page wrapper with footer for service pages
function ServicePageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Footer />
    </>
  );
}

// Minimal loading fallback - appears instantly
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div 
        className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full"
        style={{ animation: 'spin 0.6s linear infinite' }}
      />
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Setup smooth scroll behavior for anchor links only
    document.documentElement.style.scrollBehavior = 'smooth';

    // Refresh ScrollTrigger on resize - debounced
    let resizeTimeout: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 100);
    };

    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
    };
  }, []);

  const handleLoadingComplete = () => {
    setIsLoading(false);
    // Delay ScrollTrigger refresh to ensure DOM is ready
    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Loading Screen */}
      {isLoading && <LoadingScreen onComplete={handleLoadingComplete} />}

      <HashRouter>
        {/* Route Prefetcher - makes navigation instant */}
        <RoutePrefetcher />
        
        {/* Scroll Restoration - handles all scroll behavior */}
        <ScrollRestoration />
        
        {/* Navigation - fixed position */}
        <Navbar />

        {/* Main Content */}
        <main className="relative z-10">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/services/web-design" element={<ServicePageWrapper><WebDesignPage /></ServicePageWrapper>} />
              <Route path="/services/branding" element={<ServicePageWrapper><BrandingPage /></ServicePageWrapper>} />
              <Route path="/services/3d-rendering" element={<ServicePageWrapper><RenderingPage /></ServicePageWrapper>} />
              <Route path="/services/advertising" element={<ServicePageWrapper><AdvertisingPage /></ServicePageWrapper>} />
              <Route path="/services/marketing" element={<ServicePageWrapper><MarketingPage /></ServicePageWrapper>} />
              <Route path="/services/ai-solutions" element={<ServicePageWrapper><AISolutionsPage /></ServicePageWrapper>} />
            </Routes>
          </Suspense>
        </main>
      </HashRouter>
    </div>
  );
}

export default App;
