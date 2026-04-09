import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Calendar, Zap, TrendingUp, Clock, Rocket, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

gsap.registerPlugin(ScrollTrigger);

const benefits = [
  {
    icon: Zap,
    text: 'Free 30-minute consultation',
  },
  {
    icon: TrendingUp,
    text: 'Custom growth strategy',
  },
  {
    icon: Clock,
    text: 'Same-week availability',
  },
];

function CTABanner() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Card scale animation
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, scale: 0.95, y: 40 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
          },
        }
      );

      // Content stagger animation
      const elements = contentRef.current?.children;
      if (elements) {
        gsap.fromTo(
          elements,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 60%',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="booking"
      className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 z-50"
    >
      {/* Space decorations */}
      <div className="absolute top-10 left-10 text-accent/20">
        <Star className="w-5 h-5 animate-pulse" />
      </div>
      <div className="absolute bottom-20 right-20 text-accent/15">
        <Rocket className="w-8 h-8 animate-pulse" style={{ animationDelay: '0.5s' }} />
      </div>
      <div className="max-w-5xl mx-auto">
        <div
          ref={cardRef}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-accent/20 via-accent/10 to-background border border-accent/20"
        >
          {/* Background glow */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-accent/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-accent/5 rounded-full blur-3xl" />
          </div>

          {/* Content */}
          <div ref={contentRef} className="relative z-10 px-6 sm:px-12 lg:px-16 py-10 sm:py-16 lg:py-20 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full mb-6">
              <Calendar className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium text-accent">Book Your Session</span>
            </div>

            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Ready to Launch?
            </h2>

            <p className="max-w-2xl mx-auto text-muted-foreground text-sm sm:text-base lg:text-lg mb-8 sm:mb-10">
              Schedule a free discovery call and let's discuss how we can 
              elevate your brand into the digital stratosphere.
            </p>

            {/* Benefits */}
            <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-6 mb-8 sm:mb-10">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <div
                    key={index}
                    className="flex items-center justify-center gap-2 text-sm text-muted-foreground"
                  >
                    <Icon className="w-4 h-4 text-accent flex-shrink-0" />
                    <span>{benefit.text}</span>
                  </div>
                );
              })}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="px-8 py-6 text-base font-medium bg-foreground text-background rounded-full hover:bg-accent hover:text-white transition-all duration-300 hover:scale-105"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Schedule Discovery Call
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="px-8 py-6 text-base font-medium border-border/50 text-foreground rounded-full hover:bg-surface transition-all duration-300"
              >
                View Our Work
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CTABanner;
