import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Import sections directly (no lazy loading)
import NeuralBackground from '../components/effects/NeuralBackground';
import Hero from '../components/sections/Hero';
import Manifesto from '../components/sections/Manifesto';
import Services from '../components/sections/Services';
import Process from '../components/sections/Process';
import ChatSection from '../components/sections/ChatSection';
import Testimonials from '../components/sections/Testimonials';
import CTABanner from '../components/sections/CTABanner';
import Footer from '../components/sections/Footer';

gsap.registerPlugin(ScrollTrigger);

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
      {/* Neural Background */}
      <NeuralBackground />

      <Hero />
      <Manifesto />
      <Services />
      <Process />
      <ChatSection />
      <Testimonials />
      <CTABanner />
      <Footer />
    </>
  );
}

export default HomePage;
