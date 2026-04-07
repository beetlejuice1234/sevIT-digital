import { useEffect, useRef, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  Star,
  ChevronLeft,
  ChevronRight
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
 * Mobile Swipeable Card Stack Component
 * Tinder-style 3D card deck with spring physics
 */
function MobileCardStack() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const navigate = useNavigate();
  
  // Touch/drag state refs for 60FPS performance
  const dragStartX = useRef(0);
  const dragCurrentX = useRef(0);
  const dragStartY = useRef(0);
  const isSwipeValid = useRef(false);
  const rafId = useRef<number | null>(null);

  // Spring physics config
  const SPRING_CONFIG = { stiffness: 300, damping: 30, mass: 0.8 };
  const SWIPE_THRESHOLD = 80;
  const ROTATION_FACTOR = 0.08;

  // Get card indices for 3D stack (current + 2 behind)
  const getStackIndices = useCallback(() => {
    const indices = [];
    for (let i = 0; i < 3; i++) {
      const idx = (currentIndex + i) % services.length;
      indices.push(idx);
    }
    return indices;
  }, [currentIndex]);

  // Update card positions with 3D stack effect
  const updateCardPositions = useCallback((activeOffset: number = 0, activeRotation: number = 0) => {
    const indices = getStackIndices();
    
    indices.forEach((serviceIdx, stackPosition) => {
      const card = cardsRef.current[serviceIdx];
      if (!card) return;

      const isActive = stackPosition === 0;
      const depth = stackPosition; // 0 = front, 1 = middle, 2 = back

      if (isActive) {
        // Active card follows finger with rotation
        gsap.set(card, {
          x: activeOffset,
          rotation: activeRotation,
          scale: 1 - Math.abs(activeOffset) * 0.0003,
          zIndex: 30,
          opacity: 1,
          filter: 'brightness(1)',
        });
      } else {
        // Background cards show 3D depth
        const baseScale = 1 - depth * 0.06;
        const baseY = depth * 12;
        const baseBrightness = 1 - depth * 0.25;
        const progress = Math.min(Math.abs(activeOffset) / SWIPE_THRESHOLD, 1);
        
        gsap.to(card, {
          x: 0,
          y: baseY - progress * (depth * 8),
          rotation: 0,
          scale: baseScale + progress * 0.04,
          zIndex: 30 - depth * 10,
          opacity: 1,
          filter: `brightness(${baseBrightness + progress * 0.2})`,
          duration: 0.3,
          ease: 'power2.out',
          overwrite: true,
        });
      }
    });
  }, [getStackIndices]);

  // Handle swipe completion with spring physics
  const completeSwipe = useCallback((direction: 'left' | 'right') => {
    const activeCard = cardsRef.current[getStackIndices()[0]];
    if (!activeCard) return;

    const exitX = direction === 'right' ? window.innerWidth + 200 : -window.innerWidth - 200;
    const exitRotation = direction === 'right' ? 25 : -25;

    // Animate card out with spring physics
    gsap.to(activeCard, {
      x: exitX,
      rotation: exitRotation,
      opacity: 0,
      duration: 0.5,
      ease: 'power3.out',
      onComplete: () => {
        // Reset card position off-screen
        gsap.set(activeCard, { x: 0, rotation: 0, opacity: 1 });
        
        // Advance to next card
        setCurrentIndex((prev) => (prev + 1) % services.length);
      },
    });
  }, [getStackIndices]);

  // Snap back with spring if not swiped far enough
  const snapBack = useCallback(() => {
    const activeCard = cardsRef.current[getStackIndices()[0]];
    if (!activeCard) return;

    gsap.to(activeCard, {
      x: 0,
      rotation: 0,
      scale: 1,
      duration: 0.5,
      ease: 'elastic.out(1, 0.5)',
    });

    // Reset background cards
    getStackIndices().slice(1).forEach((serviceIdx, i) => {
      const card = cardsRef.current[serviceIdx];
      if (!card) return;
      const depth = i + 1;
      
      gsap.to(card, {
        y: depth * 12,
        scale: 1 - depth * 0.06,
        filter: `brightness(${1 - depth * 0.25})`,
        duration: 0.4,
        ease: 'power2.out',
      });
    });
  }, [getStackIndices]);

  // Touch/Mouse handlers
  const handleStart = useCallback((clientX: number, clientY: number) => {
    setIsDragging(true);
    dragStartX.current = clientX;
    dragStartY.current = clientY;
    dragCurrentX.current = clientX;
    isSwipeValid.current = true;

    // Kill any ongoing animations on active card
    const activeCard = cardsRef.current[getStackIndices()[0]];
    if (activeCard) {
      gsap.killTweensOf(activeCard);
    }
  }, [getStackIndices]);

  const handleMove = useCallback((clientX: number, clientY: number) => {
    if (!isDragging || !isSwipeValid.current) return;

    // Use requestAnimationFrame for 60FPS
    if (rafId.current) return;
    
    rafId.current = requestAnimationFrame(() => {
      dragCurrentX.current = clientX;
      
      const deltaX = clientX - dragStartX.current;
      const deltaY = clientY - dragStartY.current;
      
      // Check if scrolling vertically - disable horizontal swipe
      if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 10) {
        isSwipeValid.current = false;
        rafId.current = null;
        return;
      }

      const rotation = deltaX * ROTATION_FACTOR;
      updateCardPositions(deltaX, rotation);
      rafId.current = null;
    });
  }, [isDragging, updateCardPositions]);

  const handleEnd = useCallback(() => {
    if (!isDragging) return;
    
    setIsDragging(false);
    
    if (rafId.current) {
      cancelAnimationFrame(rafId.current);
      rafId.current = null;
    }

    if (!isSwipeValid.current) return;

    const deltaX = dragCurrentX.current - dragStartX.current;
    
    if (Math.abs(deltaX) > SWIPE_THRESHOLD) {
      completeSwipe(deltaX > 0 ? 'right' : 'left');
    } else {
      snapBack();
    }
  }, [isDragging, completeSwipe, snapBack]);

  // Touch events
  const onTouchStart = (e: React.TouchEvent) => {
    handleStart(e.touches[0].clientX, e.touches[0].clientY);
  };
  
  const onTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX, e.touches[0].clientY);
  };
  
  const onTouchEnd = () => handleEnd();

  // Mouse events
  const onMouseDown = (e: React.MouseEvent) => {
    handleStart(e.clientX, e.clientY);
  };
  
  const onMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      e.preventDefault();
      handleMove(e.clientX, e.clientY);
    }
  };
  
  const onMouseUp = () => handleEnd();
  const onMouseLeave = () => {
    if (isDragging) handleEnd();
  };

  // Navigate to service page
  const handleLearnMore = (link: string) => {
    navigate(link);
  };

  // Manual navigation buttons
  const goNext = () => completeSwipe('left');
  const goPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + services.length) % services.length);
  };

  // Initialize card positions
  useEffect(() => {
    updateCardPositions(0, 0);
  }, [currentIndex, updateCardPositions]);

  const stackIndices = getStackIndices();

  return (
    <div className="relative w-full max-w-sm mx-auto">
      {/* Card Stack Container */}
      <div
        ref={containerRef}
        className="relative h-[420px] touch-none select-none cursor-grab active:cursor-grabbing"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
        style={{ perspective: '1000px' }}
      >
        {/* Render cards in reverse order for proper z-indexing */}
        {[...stackIndices].reverse().map((serviceIdx) => {
          const service = services[serviceIdx];
          const Icon = service.icon;
          const stackPos = stackIndices.indexOf(serviceIdx);
          const isActive = stackPos === 0;

          return (
            <div
              key={service.id}
              ref={(el) => { cardsRef.current[serviceIdx] = el; }}
              className="absolute inset-0 will-change-transform"
              style={{
                transformStyle: 'preserve-3d',
                touchAction: isActive ? 'none' : 'auto',
              }}
            >
              <div 
                className="h-full w-full bg-surface/80 backdrop-blur-md rounded-3xl border border-border/60 overflow-hidden shadow-2xl"
                style={{
                  boxShadow: isActive 
                    ? `0 25px 50px -12px ${service.color}30, 0 0 0 1px ${service.color}20`
                    : '0 10px 30px -10px rgba(0,0,0,0.5)',
                }}
              >
                {/* Card Background Gradient */}
                <div 
                  className="absolute inset-0 opacity-30"
                  style={{
                    background: `radial-gradient(circle at 30% 20%, ${service.color}25, transparent 60%)`,
                  }}
                />

                {/* Card Content */}
                <div className="relative h-full flex flex-col p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div 
                      className="w-14 h-14 rounded-2xl flex items-center justify-center"
                      style={{ backgroundColor: `${service.color}20` }}
                    >
                      <Icon className="w-7 h-7" style={{ color: service.color }} />
                    </div>
                    <div 
                      className="text-xs font-bold px-3 py-1 rounded-full"
                      style={{ 
                        backgroundColor: `${service.color}15`,
                        color: service.color,
                      }}
                    >
                      {String(serviceIdx + 1).padStart(2, '0')}
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-2xl font-bold text-foreground mb-3">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4 flex-grow">
                    {service.description}
                  </p>

                  {/* Features */}
                  <div className="flex flex-wrap gap-2 mb-5">
                    {service.features.slice(0, 2).map((feature, i) => (
                      <span 
                        key={i}
                        className="text-xs px-3 py-1.5 rounded-full bg-foreground/5 text-muted-foreground border border-border/30"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLearnMore(service.link);
                    }}
                    className="w-full py-3.5 px-6 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all duration-200 active:scale-95"
                    style={{ 
                      backgroundColor: service.color,
                      color: '#fff',
                    }}
                  >
                    <span>Learn More</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Decorative corner element */}
                <div 
                  className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full opacity-20"
                  style={{
                    background: `radial-gradient(circle, ${service.color}, transparent 70%)`,
                  }}
                />
              </div>
            </div>
          );
        })}

        {/* Swipe hint overlay - shows on first interaction */}
        {!isDragging && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4 pointer-events-none opacity-50">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <ChevronLeft className="w-4 h-4" />
              <span>Swipe</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <span>Swipe</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        )}
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-center gap-4 mt-6">
        <button
          onClick={goPrev}
          className="w-12 h-12 rounded-full bg-surface/50 border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-all active:scale-95"
          aria-label="Previous service"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Progress dots */}
        <div className="flex items-center gap-2">
          {services.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                idx === currentIndex 
                  ? 'w-6 bg-accent' 
                  : 'bg-foreground/20 hover:bg-foreground/40'
              }`}
              aria-label={`Go to service ${idx + 1}`}
            />
          ))}
        </div>

        <button
          onClick={goNext}
          className="w-12 h-12 rounded-full bg-surface/50 border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-all active:scale-95"
          aria-label="Next service"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Card counter */}
      <div className="text-center mt-4">
        <span className="text-sm text-muted-foreground">
          {currentIndex + 1} <span className="text-foreground/40">/</span> {services.length}
        </span>
      </div>
    </div>
  );
}

/**
 * GPU-Optimized Services Section
 * 
 * Desktop: Grid layout with hover effects
 * Mobile: Tinder-style swipeable card stack
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

      // Cards staggered entrance - GPU accelerated (desktop only)
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
          <p className="max-w-md text-muted-foreground text-base sm:text-lg hidden sm:block">
            Six powerful services designed to launch your brand into the digital stratosphere.
          </p>
        </div>
      </div>

      {/* Mobile: Swipeable Card Stack (hidden on md+) */}
      <div className="md:hidden max-w-7xl mx-auto">
        <MobileCardStack />
      </div>

      {/* Desktop: Grid Layout (hidden on mobile) */}
      <div 
        ref={cardsContainerRef}
        className="hidden md:grid max-w-7xl mx-auto grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
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
        <p className="text-muted-foreground mb-4 hidden sm:block">
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
