import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import TextScramble from '../effects/TextScramble';

gsap.registerPlugin(ScrollTrigger);

function Manifesto() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0.3, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            end: 'top 30%',
            scrub: 1,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="manifesto"
      className="relative py-32 sm:py-40 lg:py-48 px-4 sm:px-6 lg:px-8 z-20"
    >
      <div
        ref={contentRef}
        className="max-w-4xl mx-auto text-center"
      >
        <p className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-medium leading-tight text-foreground">
          <TextScramble 
            text="We don't just build websites. We launch brands into the digital cosmos."
            triggerPoint="top 75%"
          />
        </p>
      </div>
    </section>
  );
}

export default Manifesto;
