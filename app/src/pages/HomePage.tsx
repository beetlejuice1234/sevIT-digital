import { useEffect, Suspense, lazy } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Import sections directly (no lazy loading)
import Hero from '../components/sections/Hero';
import Manifesto from '../components/sections/Manifesto';
import Services from '../components/sections/Services';
import Process from '../components/sections/Process';
import ChatSection from '../components/sections/ChatSection';
import Testimonials from '../components/sections/Testimonials';
import CTABanner from '../components/sections/CTABanner';
import Footer from '../components/sections/Footer';
import InView from '../components/InView';

// Lazy load heavy components
const NeuralBackground = lazy(() => import('../components/effects/NeuralBackground'));

gsap.registerPlugin(ScrollTrigger);

// Minimal fallback for NeuralBackground
const NeuralFallback = () => (
  <div 
    className="fixed inset-0 z-0 pointer-events-none"
    style={{
      background: 'radial-gradient(ellipse at 50% 50%, rgba(59, 130, 246, 0.03) 0%, transparent 70%)',
    }}
  />
);

function HomePage() {
  useEffect(() => {
    // Refresh ScrollTrigger when page mounts
    ScrollTrigger.refresh();
    
    return () => {
      // Kill all ScrollTriggers when unmounting
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, []);

  return (
    <>
      {/* Neural Background - Lazy loaded with fallback */}
      <Suspense fallback={<NeuralFallback />}>
        <NeuralBackground />
      </Suspense>

      <Hero />
      <Manifesto />
      <Services />
      <Process />
      <ChatSection />
      
      {/* Testimonials - Lazy loaded when in view */}
      <InView 
        rootMargin="200px" 
        fallback={
          <div className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto text-center">
              <div className="h-8 w-32 bg-accent/10 rounded-full mx-auto mb-6" />
              <div className="h-12 w-64 bg-foreground/10 rounded-lg mx-auto" />
            </div>
          </div>
        }
      >
        <Testimonials />
      </InView>
      
      <CTABanner />
      <Footer />
    </>
  );
}

export default HomePage;
