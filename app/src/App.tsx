import { useState, useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Components
import Navbar from './components/Navbar';
import LoadingScreen from './components/effects/LoadingScreen';

// Pages - import directly
import HomePage from './pages/HomePage';
import WebDesignPage from './pages/services/WebDesignPage';
import BrandingPage from './pages/services/BrandingPage';
import RenderingPage from './pages/services/RenderingPage';
import AdvertisingPage from './pages/services/AdvertisingPage';
import MarketingPage from './pages/services/MarketingPage';
import AISolutionsPage from './pages/services/AISolutionsPage';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Setup smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';

    // Refresh ScrollTrigger on resize
    const handleResize = () => {
      ScrollTrigger.refresh();
    };

    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleLoadingComplete = () => {
    setIsLoading(false);
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Loading Screen */}
      {isLoading && <LoadingScreen onComplete={handleLoadingComplete} />}

      <HashRouter>
        {/* Navigation */}
        <Navbar />

        {/* Main Content */}
        <main className="relative z-10">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/services/web-design" element={<WebDesignPage />} />
            <Route path="/services/branding" element={<BrandingPage />} />
            <Route path="/services/3d-rendering" element={<RenderingPage />} />
            <Route path="/services/advertising" element={<AdvertisingPage />} />
            <Route path="/services/marketing" element={<MarketingPage />} />
            <Route path="/services/ai-solutions" element={<AISolutionsPage />} />
          </Routes>
        </main>
      </HashRouter>
    </div>
  );
}

export default App;
