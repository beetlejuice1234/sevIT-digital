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
 * Tinder-style 3D card deck with cyclical behavior
 */
function MobileCardStack() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const navigate = useNavigate();
  
  // Touch/drag state refs
  const dragStartX = useRef(0);
  const dragCurrentX = useRef(0);
  const dragStartY = useRef(0);
  const isSwipeValid = useRef(false);
  const rafId = useRef<number | null>(null);
  const isAnimating = useRef(false);

  const SWIPE_THRESHOLD = 60;
  const ROTATION_FACTOR = 0.05;

  // Get ordered indices for the stack (current, next, next+1)
  const getStackOrder = useCallback(() => {
    const order = [];
    for (let i = 0; i < Math.min(3, services.length); i++) {
      order.push((currentIndex + i) % services.length);
    }
    return order;
  }, [currentIndex]);

  // Initialize card positions - 3D stack effect
  const initializeStack = useCallback(() => {
    const order = getStackOrder();
    
    order.forEach((serviceIdx, stackPos) => {
      const card = cardsRef.current[serviceIdx];
      if (!card) return;

      const isTop = stackPos === 0;
      
      if (isTop) {
        // Top card - fully visible, no transform
        gsap.set(card, {
          x: 0,
          y: 0,
          scale: 1,
          rotation: 0,
          opacity: 1,
          zIndex: 30,
          filter: 'brightness(1)',
        });
      } else {
        // Background cards - visible but scaled down and darker
        const depth = stackPos;
        gsap.set(card, {
          x: 0,
          y: depth * 8,
          scale: 1 - depth * 0.05,
          rotation: 0,
          opacity: 1,
          zIndex: 30 - depth * 10,
          filter: `brightness(${0.6 - depth * 0.15})`,
        });
      }
    });

    // Hide other cards
    services.forEach((_, idx) => {
      if (!order.includes(idx)) {
        const card = cardsRef.current[idx];
        if (card) {
          gsap.set(card, { opacity: 0, zIndex: 0 });
        }
      }
    });
  }, [getStackOrder]);

  // Handle drag during swipe
  const updateDragPosition = useCallback((deltaX: number) => {
    const order = getStackOrder();
    const topCard = cardsRef.current[order[0]];
    const secondCard = cardsRef.current[order[1]];
    
    if (!topCard) return;

    const rotation = deltaX * ROTATION_FACTOR;
    const progress = Math.min(Math.abs(deltaX) / 150, 1);

    // Top card follows finger
    gsap.set(topCard, {
      x: deltaX,
      rotation: rotation,
      scale: 1 - progress * 0.02,
    });

    // Second card scales up as top card moves
    if (secondCard) {
      gsap.set(secondCard, {
        scale: 0.95 + progress * 0.05,
        y: 8 - progress * 8,
        filter: `brightness(${0.6 + progress * 0.4})`,
        zIndex: 30 - Math.sign(progress) * 5,
      });
    }
  }, [getStackOrder]);

  // Complete swipe to NEXT (right swipe)
  const swipeNext = useCallback(() => {
    if (isAnimating.current) return;
    isAnimating.current = true;

    const order = getStackOrder();
    const topCard = cardsRef.current[order[0]];
    const secondCard = cardsRef.current[order[1]];
    const thirdCard = cardsRef.current[order[2]];

    if (!topCard) {
      isAnimating.current = false;
      return;
    }

    // Animate top card out to the right
    gsap.to(topCard, {
      x: window.innerWidth,
      rotation: 15,
      opacity: 0,
      duration: 0.4,
      ease: 'power3.out',
    });

    // Second card scales up to become top
    if (secondCard) {
      gsap.to(secondCard, {
        scale: 1,
        y: 0,
        filter: 'brightness(1)',
        zIndex: 30,
        duration: 0.4,
        ease: 'power3.out',
      });
    }

    // Third card becomes visible as second
    if (thirdCard) {
      gsap.to(thirdCard, {
        scale: 0.95,
        y: 8,
        opacity: 1,
        filter: 'brightness(0.6)',
        zIndex: 20,
        duration: 0.4,
        ease: 'power3.out',
      });
    }

    // Advance index after animation
    setTimeout(() => {
      gsap.set(topCard, { x: 0, rotation: 0, opacity: 0 });
      setCurrentIndex((prev) => (prev + 1) % services.length);
      isAnimating.current = false;
    }, 400);
  }, [getStackOrder]);

  // Complete swipe to PREV (left swipe) - cyclical
  const swipePrev = useCallback(() => {
    if (isAnimating.current) return;
    isAnimating.current = true;

    const prevIndex = (currentIndex - 1 + services.length) % services.length;
    const order = getStackOrder();
    const topCard = cardsRef.current[order[0]];
    const prevCard = cardsRef.current[prevIndex];

    if (!topCard || !prevCard) {
      isAnimating.current = false;
      return;
    }

    // Position prev card off-screen left
    gsap.set(prevCard, {
      x: -window.innerWidth,
      opacity: 0,
      scale: 1,
      y: 0,
      zIndex: 35,
      filter: 'brightness(1)',
    });

    // Animate prev card in from left to become top
    gsap.to(prevCard, {
      x: 0,
      opacity: 1,
      duration: 0.4,
      ease: 'power3.out',
    });

    // Current top card scales down and becomes second
    gsap.to(topCard, {
      scale: 0.95,
      y: 8,
      filter: 'brightness(0.6)',
      zIndex: 20,
      duration: 0.4,
      ease: 'power3.out',
    });

    // Update index
    setTimeout(() => {
      setCurrentIndex(prevIndex);
      isAnimating.current = false;
      setDirection(null);
    }, 400);
  }, [currentIndex, getStackOrder]);

  // Snap back if not swiped far enough
  const snapBack = useCallback(() => {
    const order = getStackOrder();
    const topCard = cardsRef.current[order[0]];
    const secondCard = cardsRef.current[order[1]];

    if (topCard) {
      gsap.to(topCard, {
        x: 0,
        rotation: 0,
        scale: 1,
        duration: 0.5,
        ease: 'elastic.out(1, 0.6)',
      });
    }

    if (secondCard) {
      gsap.to(secondCard, {
        scale: 0.95,
        y: 8,
        filter: 'brightness(0.6)',
        duration: 0.4,
        ease: 'power3.out',
      });
    }
  }, [getStackOrder]);

  // Touch/Mouse handlers
  const handleStart = useCallback((clientX: number, clientY: number) => {
    if (isAnimating.current) return;
    
    setIsDragging(true);
    dragStartX.current = clientX;
    dragStartY.current = clientY;
    dragCurrentX.current = clientX;
    isSwipeValid.current = true;

    const topCard = cardsRef.current[getStackOrder()[0]];
    if (topCard) {
      gsap.killTweensOf(topCard);
    }
  }, [getStackOrder]);

  const handleMove = useCallback((clientX: number, clientY: number) => {
    if (!isDragging || !isSwipeValid.current || isAnimating.current) return;

    if (rafId.current) return;
    
    rafId.current = requestAnimationFrame(() => {
      dragCurrentX.current = clientX;
      
      const deltaX = clientX - dragStartX.current;
      const deltaY = clientY - dragStartY.current;
      
      // Check for vertical scroll
      if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 10) {
        isSwipeValid.current = false;
        rafId.current = null;
        return;
      }

      updateDragPosition(deltaX);
      rafId.current = null;
    });
  }, [isDragging, updateDragPosition]);

  const handleEnd = useCallback(() => {
    if (!isDragging) return;
    
    setIsDragging(false);
    
    if (rafId.current) {
      cancelAnimationFrame(rafId.current);
      rafId.current = null;
    }

    if (!isSwipeValid.current || isAnimating.current) return;

    const deltaX = dragCurrentX.current - dragStartX.current;
    
    if (Math.abs(deltaX) > SWIPE_THRESHOLD) {
      if (deltaX > 0) {
        swipeNext(); // Swipe right = next
      } else {
        swipePrev(); // Swipe left = prev
      }
    } else {
      snapBack();
    }
  }, [isDragging, swipeNext, swipePrev, snapBack]);

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

  // Initialize positions on mount and index change
  useEffect(() => {
    initializeStack();
  }, [currentIndex, initializeStack]);

  const stackOrder = getStackOrder();

  return (
    <div className="relative w-full px-4">
      {/* Card Stack Container - Centered with breathing room */}
      <div className="relative mx-auto" style={{ maxWidth: '340px' }}>
        {/* Cards Container */}
        <div
          ref={containerRef}
          className="relative h-[480px] touch-none select-none cursor-grab active:cursor-grabbing"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseLeave}
          style={{ perspective: '1000px' }}
        >
          {/* Render all cards - stack order determines visibility */}
          {services.map((service, idx) => {
            const isInStack = stackOrder.includes(idx);
            const stackPos = stackOrder.indexOf(idx);
            const isTop = stackPos === 0;
            const Icon = service.icon;

            return (
              <div
                key={service.id}
                ref={(el) => { cardsRef.current[idx] = el; }}
                className="absolute inset-0 will-change-transform"
                style={{
                  transformStyle: 'preserve-3d',
                  opacity: isInStack ? 1 : 0,
                  pointerEvents: isTop ? 'auto' : 'none',
                }}
              >
                {/* Card Shell */}
                <div 
                  className="h-full w-full rounded-3xl overflow-hidden shadow-2xl"
                  style={{
                    backgroundColor: 'rgba(30, 30, 35, 0.95)',
                    border: `1px solid ${service.color}30`,
                    boxShadow: isTop 
                      ? `0 25px 60px -15px ${service.color}40, 0 0 0 1px ${service.color}20`
                      : `0 10px 30px -10px rgba(0,0,0,0.8)`,
                  }}
                >
                  {/* Only render full content for top card */}
                  {isTop ? (
                    <div className="relative h-full flex flex-col">
                      {/* Card Background Gradient */}
                      <div 
                        className="absolute inset-0 opacity-40"
                        style={{
                          background: `radial-gradient(circle at 30% 20%, ${service.color}30, transparent 60%)`,
                        }}
                      />

                      {/* Card Content */}
                      <div className="relative h-full flex flex-col p-6">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-5">
                          <div 
                            className="w-14 h-14 rounded-2xl flex items-center justify-center"
                            style={{ backgroundColor: `${service.color}20` }}
                          >
                            <Icon className="w-7 h-7" style={{ color: service.color }} />
                          </div>
                          <div 
                            className="text-xs font-bold px-3 py-1.5 rounded-full"
                            style={{ 
                              backgroundColor: `${service.color}15`,
                              color: service.color,
                            }}
                          >
                            {String(idx + 1).padStart(2, '0')}
                          </div>
                        </div>

                        {/* Title & Description */}
                        <h3 className="text-2xl font-bold text-foreground mb-3">
                          {service.title}
                        </h3>
                        <p className="text-muted-foreground text-sm leading-relaxed mb-5 flex-grow">
                          {service.description}
                        </p>

                        {/* Features */}
                        <div className="flex flex-wrap gap-2 mb-6">
                          {service.features.map((feature, i) => (
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
                          className="w-full py-4 px-6 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 active:scale-95"
                          style={{ 
                            backgroundColor: service.color,
                            color: '#fff',
                          }}
                        >
                          <span>Learn More</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Decorative corner */}
                      <div 
                        className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full opacity-20"
                        style={{
                          background: `radial-gradient(circle, ${service.color}, transparent 70%)`,
                        }}
                      />
                    </div>
                  ) : (
                    /* Background cards - just color indicator */
                    <div className="h-full w-full flex items-center justify-center">
                      <div 
                        className="w-16 h-16 rounded-2xl flex items-center justify-center opacity-30"
                        style={{ backgroundColor: `${service.color}30` }}
                      >
                        <Icon className="w-8 h-8" style={{ color: service.color }} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Swipe Controls - BELOW the card stack, never covered */}
        <div className="flex items-center justify-between mt-6 px-2">
          {/* Swipe Left: Prev */}
          <button
            onClick={swipePrev}
            disabled={isAnimating.current}
            className="flex items-center gap-2 px-4 py-3 rounded-full bg-surface/60 border border-border/40 text-muted-foreground hover:text-foreground hover:border-foreground/30 active:scale-95 transition-all disabled:opacity-50"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Prev</span>
          </button>

          {/* Progress Indicator */}
          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-1.5">
              {services.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    if (!isAnimating.current && idx !== currentIndex) {
                      const diff = idx - currentIndex;
                      if (diff > 0 || (diff < 0 && Math.abs(diff) > services.length / 2)) {
                        setCurrentIndex(idx);
                      } else {
                        setCurrentIndex(idx);
                      }
                    }
                  }}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === currentIndex 
                      ? 'w-6 bg-accent' 
                      : 'w-1.5 bg-foreground/20 hover:bg-foreground/40'
                  }`}
                  aria-label={`Go to service ${idx + 1}`}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground mt-1">
              {currentIndex + 1} / {services.length}
            </span>
          </div>

          {/* Swipe Right: Next */}
          <button
            onClick={swipeNext}
            disabled={isAnimating.current}
            className="flex items-center gap-2 px-4 py-3 rounded-full bg-surface/60 border border-border/40 text-muted-foreground hover:text-foreground hover:border-foreground/30 active:scale-95 transition-all disabled:opacity-50"
          >
            <span className="text-sm font-medium">Next</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Swipe hint text */}
        <div className="flex items-center justify-center gap-8 mt-4 text-xs text-muted-foreground/60">
          <span className="flex items-center gap-1">
            <ChevronLeft className="w-3 h-3" />
            Swipe Left
          </span>
          <span className="flex items-center gap-1">
            Swipe Right
            <ChevronRight className="w-3 h-3" />
          </span>
        </div>
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
      // Header entrance
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

      // Desktop cards staggered entrance
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
      {/* Floating stars decoration */}
      <div className="absolute top-20 left-10 text-accent/20">
        <Star className="w-4 h-4 animate-pulse" style={{ animationDelay: '0s' }} />
      </div>
      <div className="absolute top-40 right-20 text-accent/10">
        <Star className="w-6 h-6 animate-pulse" style={{ animationDelay: '0.5s' }} />
      </div>
      <div className="absolute bottom-40 left-1/4 text-accent/15">
        <Star className="w-3 h-3 animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Section Header */}
      <div 
        ref={headerRef} 
        className="max-w-7xl mx-auto mb-12 sm:mb-16"
        style={{ willChange: 'transform, opacity' }}
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

      {/* Mobile: Swipeable Card Stack */}
      <div className="md:hidden max-w-7xl mx-auto">
        <MobileCardStack />
      </div>

      {/* Desktop: Grid Layout */}
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
              style={{ willChange: 'transform' }}
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
                }}
              >
                {/* Orbital ring decoration */}
                <div 
                  className={`absolute -right-8 -top-8 w-24 h-24 rounded-full border border-dashed transition-all duration-700 ${
                    isActive ? 'border-red-500/30' : 'border-foreground/5'
                  }`}
                  style={{ transform: isActive ? 'rotate(180deg)' : 'rotate(0deg)' }}
                />
                
                {/* Icon */}
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-transform duration-300"
                  style={{ 
                    backgroundColor: `${service.color}15`,
                    transform: isActive ? 'scale(1.1)' : 'scale(1)',
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

                {/* Glow effect */}
                <div 
                  className={`absolute inset-0 rounded-2xl transition-opacity duration-500 pointer-events-none ${
                    isActive ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{
                    background: `radial-gradient(circle at 30% 30%, ${service.color}10, transparent 70%)`,
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
        >
          <span>Let's Discuss Your Project</span>
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </section>
  );
}

export default Services;
