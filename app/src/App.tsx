import { useEffect, useLayoutEffect, Suspense, lazy } from 'react';
import { applyTheme, themeFor } from './lib/theme';
import { BrowserRouter, Routes, Route, useLocation, useNavigationType } from 'react-router-dom';
import Lenis from 'lenis';
import { getLenis, setLenis } from './lib/lenis';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import FloatingWhatsApp from './components/layout/FloatingWhatsApp';
import Cursor from './components/kit/Cursor';
import ErrorBoundary from './components/ui/ErrorBoundary';
import SkipToContent from './components/ui/SkipToContent';

const HomePage = lazy(() => import('./pages/HomePage'));
const WebDesignPage = lazy(() => import('./pages/services/WebDesignPage'));
const SoftwarePage = lazy(() => import('./pages/services/SoftwarePage'));
const AISolutionsPage = lazy(() => import('./pages/services/AISolutionsPage'));
const RenderingPage = lazy(() => import('./pages/services/RenderingPage'));
const BrandingPage = lazy(() => import('./pages/services/BrandingPage'));
const AdvertisingPage = lazy(() => import('./pages/services/AdvertisingPage'));
const MarketingPage = lazy(() => import('./pages/services/MarketingPage'));
const CareersPage = lazy(() => import('./pages/CareersPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

/** Scroll to top on navigation, to #hash targets when present, and keep native restoration on back/forward. */
function ScrollManager() {
  const { pathname, hash } = useLocation();
  const nav = useNavigationType();

  useEffect(() => {
    if (hash) {
      const id = decodeURIComponent(hash.slice(1));
      let tries = 0;
      // the target may live in a lazily loaded page; retry briefly
      const go = () => {
        const el = document.getElementById(id);
        if (el) {
          const lenis = getLenis();
          if (lenis) lenis.scrollTo(el, { offset: -24 });
          else el.scrollIntoView({ behavior: 'smooth' });
        } else if (tries++ < 20) window.setTimeout(go, 60);
      };
      go();
      return;
    }
    if (nav !== 'POP') {
      getLenis()?.scrollTo(0, { immediate: true });
      window.scrollTo(0, 0);
    }
  }, [pathname, hash, nav]);

  return null;
}

/** Sets the page accent colour (CSS variables) for the current route. */
function ThemeManager() {
  const { pathname } = useLocation();
  useLayoutEffect(() => applyTheme(themeFor(pathname)), [pathname]);
  return null;
}

function PageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center" role="status" aria-label="Loading">
      <span className="h-6 w-6 animate-spin rounded-full border-2 border-a2 border-t-transparent" />
    </div>
  );
}

export default function App() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true, autoRaf: true });
    setLenis(lenis);
    return () => {
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <div className="grain relative min-h-screen overflow-x-clip bg-background text-foreground">
          <SkipToContent />
          <ThemeManager />
          <ScrollManager />
          <Navbar />
          <main id="main-content" className="relative">
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/services/web-design" element={<WebDesignPage />} />
                <Route path="/services/software-pos" element={<SoftwarePage />} />
                <Route path="/services/ai-solutions" element={<AISolutionsPage />} />
                <Route path="/services/3d-rendering" element={<RenderingPage />} />
                <Route path="/services/branding" element={<BrandingPage />} />
                <Route path="/services/advertising" element={<AdvertisingPage />} />
                <Route path="/services/marketing" element={<MarketingPage />} />
                <Route path="/careers" element={<CareersPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
          <FloatingWhatsApp />
          <Cursor />
        </div>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
