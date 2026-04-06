import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface TextScrambleProps {
  text: string;
  className?: string;
  triggerPoint?: string;
}

const chars = '!<>-_\\/[]{}—=+*^?#________';

function TextScramble({ text, className = '', triggerPoint = 'top 80%' }: TextScrambleProps) {
  const elementRef = useRef<HTMLSpanElement>(null);
  const [displayText, setDisplayText] = useState(text);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!elementRef.current) return;

    const trigger = ScrollTrigger.create({
      trigger: elementRef.current,
      start: triggerPoint,
      onEnter: () => {
        if (hasAnimated.current) return;
        hasAnimated.current = true;
        
        const originalText = text;
        const length = originalText.length;
        let iteration = 0;
        const maxIterations = length * 3;
        
        const interval = setInterval(() => {
          setDisplayText(
            originalText
              .split('')
              .map((char, index) => {
                if (char === ' ') return ' ';
                if (index < iteration / 2) {
                  return originalText[index];
                }
                return chars[Math.floor(Math.random() * chars.length)];
              })
              .join('')
          );
          
          iteration++;
          
          if (iteration >= maxIterations) {
            clearInterval(interval);
            setDisplayText(originalText);
          }
        }, 15);
      },
    });

    return () => {
      trigger.kill();
    };
  }, [text, triggerPoint]);

  return (
    <span ref={elementRef} className={className}>
      {displayText}
    </span>
  );
}

export default TextScramble;
