import { useState, useRef, useEffect } from 'react';

interface LazyVideoProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
  src: string;
  poster?: string;
  className?: string;
}

export default function LazyVideo({ src, poster, className = '', ...props }: LazyVideoProps) {
  const [isInView, setIsInView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      {isInView ? (
        <video
          src={src}
          poster={poster}
          className="w-full h-full object-cover"
          {...props}
        />
      ) : (
        poster && (
          <img
            src={poster}
            className="w-full h-full object-cover opacity-60 filter blur-[2px]"
            alt="Video preview loading..."
            draggable={false}
          />
        )
      )}
    </div>
  );
}
