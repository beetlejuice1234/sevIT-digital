import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Star, Quote, Rocket, Sparkles } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    id: 1,
    name: 'Sarah Chen',
    role: 'CEO',
    company: 'TechFlow Solutions',
    content: 'sevIT completely transformed our digital presence. Our new website generates 3x more qualified leads and the 3D product visualizations they created are absolutely stunning.',
    rating: 5,
  },
  {
    id: 2,
    name: 'Marcus Johnson',
    role: 'Founder',
    company: 'GrowthLabs',
    content: 'The branding package from sevIT was exceptional. They captured our vision perfectly and delivered a cohesive identity that resonates with our target audience.',
    rating: 5,
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    role: 'Marketing Director',
    company: 'Elevate Brands',
    content: 'Our Google Ads campaigns now deliver 4x ROAS thanks to sevIT\'s data-driven approach. They truly understand digital marketing inside and out.',
    rating: 5,
  },
  {
    id: 4,
    name: 'David Park',
    role: 'CTO',
    company: 'DataSync Inc',
    content: 'Working with sevIT was seamless from start to finish. They built us a blazing-fast React application that our users absolutely love. Top-notch developers!',
    rating: 5,
  },
  {
    id: 5,
    name: 'Lisa Thompson',
    role: 'Owner',
    company: 'Bloom Boutique',
    content: 'From logo design to a stunning e-commerce site with 3D product views, sevIT handled everything. Our online sales have doubled in just three months!',
    rating: 5,
  },
  {
    id: 6,
    name: 'James Wilson',
    role: 'Operations Manager',
    company: 'ScaleUp Co',
    content: 'The SEO strategy sevIT implemented pushed us to page one for our key terms. Organic traffic is up 200% and still climbing. Incredible results!',
    rating: 5,
  },
];

// Split testimonials into 3 columns
const column1 = [testimonials[0], testimonials[3]];
const column2 = [testimonials[1], testimonials[4]];
const column3 = [testimonials[2], testimonials[5]];

/**
 * GPU-Optimized Testimonial Card
 * 
 * Hover effects use transform only for 60FPS.
 */
function TestimonialCard({ testimonial }: { testimonial: typeof testimonials[0] }) {
  return (
    <div 
      className="testimonial-card bg-surface rounded-3xl p-6 border border-border/50 mb-6 transition-all duration-300 hover:border-foreground/20"
      style={{
        willChange: 'transform',
        transform: 'translateZ(0)',
      }}
      onMouseEnter={(e) => {
        gsap.to(e.currentTarget, {
          scale: 1.02,
          duration: 0.3,
          ease: 'power2.out',
        });
      }}
      onMouseLeave={(e) => {
        gsap.to(e.currentTarget, {
          scale: 1,
          duration: 0.3,
          ease: 'power2.out',
        });
      }}
    >
      <div className="flex items-center gap-1 mb-4">
        {[...Array(testimonial.rating)].map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
        ))}
      </div>
      
      <div className="relative mb-4">
        <Quote className="absolute -top-2 -left-2 w-8 h-8 text-accent/20" />
        <p className="text-foreground leading-relaxed pl-4">
          {testimonial.content}
        </p>
      </div>
      
      <div className="flex items-center gap-3 pt-4 border-t border-border/50">
        <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
          <span className="text-sm font-semibold text-accent">
            {testimonial.name.split(' ').map(n => n[0]).join('')}
          </span>
        </div>
        <div>
          <p className="font-semibold text-foreground text-sm">{testimonial.name}</p>
          <p className="text-xs text-muted-foreground">
            {testimonial.role}, {testimonial.company}
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * GPU-Optimized Testimonials Section
 * 
 * Auto-scroll uses GSAP with transform only for smooth 60FPS.
 * All animations are GPU accelerated.
 */
function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const column1Ref = useRef<HTMLDivElement>(null);
  const column2Ref = useRef<HTMLDivElement>(null);
  const column3Ref = useRef<HTMLDivElement>(null);
  const tweensRef = useRef<gsap.core.Tween[]>([]);

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

      // Auto-scroll animations for all columns - GPU accelerated
      const setupAutoScroll = (
        ref: React.RefObject<HTMLDivElement | null>, 
        direction: 'up' | 'down', 
        duration: number
      ) => {
        if (!ref.current) return;
        
        const content = ref.current;
        // Duplicate content for seamless loop
        const originalContent = content.innerHTML;
        content.innerHTML = originalContent + originalContent;
        
        const scrollHeight = content.scrollHeight / 2;
        
        // Set initial position
        gsap.set(content, { 
          y: direction === 'up' ? 0 : -scrollHeight,
          willChange: 'transform',
        });
        
        // Create infinite scroll tween
        const tween = gsap.to(content, {
          y: direction === 'up' ? -scrollHeight : 0,
          duration: duration,
          ease: 'none',
          repeat: -1,
        });
        
        tweensRef.current.push(tween);
      };

      // Setup all three columns with different directions and speeds
      setupAutoScroll(column1Ref, 'down', 35);
      setupAutoScroll(column2Ref, 'up', 30);
      setupAutoScroll(column3Ref, 'down', 40);
    }, sectionRef);

    return () => {
      ctx.revert();
      // Kill all auto-scroll tweens
      tweensRef.current.forEach(tween => tween.kill());
      tweensRef.current = [];
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="testimonials"
      className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 z-40 overflow-hidden"
    >
      {/* Space decorations - CSS animations */}
      <div className="absolute top-20 left-20 text-accent/20">
        <Sparkles className="w-5 h-5 animate-pulse" />
      </div>
      <div className="absolute bottom-40 right-10 text-accent/15">
        <Rocket className="w-6 h-6 animate-pulse" style={{ animationDelay: '0.5s' }} />
      </div>

      {/* Section Header - GPU accelerated */}
      <div 
        ref={headerRef} 
        className="max-w-7xl mx-auto mb-16 sm:mb-20 text-center"
        style={{
          willChange: 'transform, opacity',
          transform: 'translateZ(0)',
        }}
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/10 rounded-full mb-4">
          <Sparkles className="w-3 h-3 text-accent" />
          <span className="text-xs font-medium text-accent uppercase tracking-wider">Testimonials</span>
        </div>
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
          Client Success Stories
        </h2>
        <p className="max-w-2xl mx-auto text-muted-foreground text-base sm:text-lg">
          See how we've helped brands elevate their digital presence 
          and reach for the stars.
        </p>
      </div>

      {/* Testimonials Grid with Auto-scroll */}
      <div className="max-w-7xl mx-auto relative">
        {/* Gradient masks */}
        <div 
          className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-background to-transparent z-10 pointer-events-none"
          style={{ willChange: 'opacity' }}
        />
        <div 
          className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none"
          style={{ willChange: 'opacity' }}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 h-[600px] overflow-hidden">
          {/* Column 1 - Scroll Down */}
          <div className="relative overflow-hidden">
            <div 
              ref={column1Ref} 
              className="space-y-6"
              style={{
                willChange: 'transform',
              }}
            >
              {column1.map((testimonial) => (
                <TestimonialCard key={`col1-${testimonial.id}`} testimonial={testimonial} />
              ))}
            </div>
          </div>

          {/* Column 2 - Scroll Up */}
          <div className="relative overflow-hidden hidden md:block">
            <div 
              ref={column2Ref} 
              className="space-y-6"
              style={{
                willChange: 'transform',
              }}
            >
              {column2.map((testimonial) => (
                <TestimonialCard key={`col2-${testimonial.id}`} testimonial={testimonial} />
              ))}
            </div>
          </div>

          {/* Column 3 - Scroll Down */}
          <div className="relative overflow-hidden hidden lg:block">
            <div 
              ref={column3Ref} 
              className="space-y-6"
              style={{
                willChange: 'transform',
              }}
            >
              {column3.map((testimonial) => (
                <TestimonialCard key={`col3-${testimonial.id}`} testimonial={testimonial} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
