import { useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Globe, 
  Palette, 
  TrendingUp, 
  Box, 
  Megaphone, 
  Sparkles,
  ArrowRight,
  Star
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    id: 1,
    title: 'Web Design',
    description: 'Stunning, responsive websites that captivate visitors and convert them into customers.',
    icon: Globe,
    color: '#EF4444',
    features: ['React & Next.js', 'SEO Optimized', 'Lightning Fast'],
    link: '/services/web-design',
  },
  {
    id: 2,
    title: 'Branding',
    description: 'Complete visual identity systems that make your brand unforgettable.',
    icon: Palette,
    color: '#EC4899',
    features: ['Logo Design', 'Style Guides', 'Brand Strategy'],
    link: '/services/branding',
  },
  {
    id: 3,
    title: '3D Rendering',
    description: 'Photorealistic 3D visuals that bring your products and ideas to life.',
    icon: Box,
    color: '#8B5CF6',
    features: ['Product Visualization', 'Architectural Renders', 'Animations'],
    link: '/services/3d-rendering',
  },
  {
    id: 4,
    title: 'Advertising',
    description: 'Data-driven ad campaigns that reach the right audience at the right time.',
    icon: Megaphone,
    color: '#F59E0B',
    features: ['Google Ads', 'Social Media', 'Retargeting'],
    link: '/services/advertising',
  },
  {
    id: 5,
    title: 'Growth Marketing',
    description: 'Strategic marketing that scales your business and maximizes ROI.',
    icon: TrendingUp,
    color: '#10B981',
    features: ['SEO & Content', 'Email Campaigns', 'Analytics'],
    link: '/services/marketing',
  },
  {
    id: 6,
    title: 'AI Solutions',
    description: 'Cutting-edge AI integrations that automate and elevate your operations.',
    icon: Sparkles,
    color: '#06B6D4',
    features: ['Chatbots', 'Automation', 'Content Generation'],
    link: '/services/ai-solutions',
  },
];

/**
 * GPU-Optimized Services Section
 * 
 * All card animations use transform and opacity only.
 * Hover effects use CSS transitions for smooth 60FPS.
 */
function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const [activeCard, setActiveCard] = useState<number | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header entrance - GPU accelerated
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            once: true,
          },
        }
      );

      // Cards staggered entrance - GPU accelerated
      const cards = cardsContainerRef.current?.querySelectorAll('.service-card');
      if (cards) {
        gsap.fromTo(
          cards,
          { opacity: 0, y: 60, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            stagger: 0.08,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: cardsContainerRef.current,
              start: 'top 85%',
              once: true,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Memoized hover handlers to prevent unnecessary re-renders
  const handleMouseEnter = useCallback((id: number) => {
    setActiveCard(id);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setActiveCard(null);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="services"
      className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 z-30"
    >
      {/* Floating stars decoration - CSS animations */}
      <div className="absolute top-20 left-10 text-accent/20">
        <Star className="w-4 h-4 animate-pulse" style={{ animationDelay: '0s' }} />
      </div>
      <div className="absolute top-40 right-20 text-accent/10">
        <Star className="w-6 h-6 animate-pulse" style={{ animationDelay: '0.5s' }} />
      </div>
      <div className="absolute bottom-40 left-1/4 text-accent/15">
        <Star className="w-3 h-3 animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Section Header - GPU accelerated */}
      <div 
        ref={headerRef} 
        className="max-w-7xl mx-auto mb-12 sm:mb-16"
        style={{
          willChange: 'transform, opacity',
          transform: 'translateZ(0)',
        }}
      >
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/10 rounded-full mb-4">
              <Sparkles className="w-3 h-3 text-accent" />
              <span className="text-xs font-medium text-accent uppercase tracking-wider">Our Services</span>
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground">
              What We Do
            </h2>
          </div>
          <p className="max-w-md text-muted-foreground text-base sm:text-lg">
            Six powerful services designed to launch your brand into the digital stratosphere.
          </p>
        </div>
      </div>

      {/* Services Grid - GPU accelerated cards */}
      <div 
        ref={cardsContainerRef}
        className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
      >
        {services.map((service) => {
          const Icon = service.icon;
          const isActive = activeCard === service.id;
          
          return (
            <Link
              key={service.id}
              to={service.link}
              className="service-card group relative block"
              onMouseEnter={() => handleMouseEnter(service.id)}
              onMouseLeave={handleMouseLeave}
              style={{
                willChange: 'transform',
                transform: 'translateZ(0)',
              }}
            >
              <div 
                className={`relative h-full bg-surface/50 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border transition-all duration-500 overflow-hidden ${
                  isActive 
                    ? 'border-red-500/50' 
                    : 'border-border/50 hover:border-foreground/20'
                }`}
                style={{
                  boxShadow: isActive 
                    ? `0 0 40px -10px ${service.color}40` 
                    : 'none',
                  transform: isActive ? 'scale(1.02)' : 'scale(1)',
                  willChange: 'transform, box-shadow',
                }}
              >
                {/* Orbital ring decoration - CSS transform only */}
                <div 
                  className={`absolute -right-8 -top-8 w-24 h-24 rounded-full border border-dashed transition-all duration-700 ${
                    isActive ? 'border-red-500/30' : 'border-foreground/5'
                  }`}
                  style={{
                    transform: isActive ? 'rotate(180deg)' : 'rotate(0deg)',
                    willChange: 'transform',
                  }}
                />
                
                {/* Icon - GPU accelerated */}
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-transform duration-300"
                  style={{ 
                    backgroundColor: `${service.color}15`,
                    transform: isActive ? 'scale(1.1)' : 'scale(1)',
                    willChange: 'transform',
                  }}
                >
                  <Icon className="w-6 h-6" style={{ color: service.color }} />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-red-500 transition-colors">
                  {service.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  {service.description}
                </p>

                {/* Features */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {service.features.map((feature, i) => (
                    <span 
                      key={i}
                      className="text-xs px-2 py-1 rounded-full bg-foreground/5 text-muted-foreground"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                {/* Learn more link */}
                <div className="flex items-center gap-2 text-sm font-medium" style={{ color: service.color }}>
                  <span>Learn more</span>
                  <ArrowRight 
                    className="w-4 h-4 transition-transform duration-300" 
                    style={{ transform: isActive ? 'translateX(4px)' : 'translateX(0)' }}
                  />
                </div>

                {/* Glow effect on hover - opacity transition */}
                <div 
                  className={`absolute inset-0 rounded-2xl transition-opacity duration-500 pointer-events-none ${
                    isActive ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{
                    background: `radial-gradient(circle at 30% 30%, ${service.color}10, transparent 70%)`,
                    willChange: 'opacity',
                  }}
                />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Bottom CTA */}
      <div className="max-w-7xl mx-auto mt-12 text-center">
        <p className="text-muted-foreground mb-4">
          Need something custom? We tailor solutions to your unique needs.
        </p>
        <a 
          href="#chat"
          className="inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background rounded-full font-medium hover:bg-accent transition-colors duration-300"
          style={{
            willChange: 'transform',
            transform: 'translateZ(0)',
          }}
        >
          <span>Let's Discuss Your Project</span>
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </section>
  );
}

export default Services;
