import { useEffect, useRef, useState } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { cn } from '@/lib/utils';

/** Video tile that autoplays muted when visible, with play/pause and sound toggles. */
export default function VideoCard({ src, poster, title, tag, className, aspect = 'aspect-video' }: { src: string; poster: string; title: string; tag: string; className?: string; aspect?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) v.play().then(() => setPlaying(true)).catch(() => {});
      else {
        v.pause();
        setPlaying(false);
      }
    }, { threshold: 0.4 });
    io.observe(v);
    return () => io.disconnect();
  }, []);
  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) v.play().then(() => setPlaying(true));
    else {
      v.pause();
      setPlaying(false);
    }
  };
  return (
    <div className={cn('group relative overflow-hidden rounded-[1.6rem] border border-white/10 bg-black', aspect, className)}>
      <video ref={ref} src={src} poster={poster} muted={muted} loop playsInline preload="none" className="absolute inset-0 h-full w-full object-cover" aria-label={title} />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-wider text-orange-300">{tag}</p>
          <p className="mt-1 font-display text-xl font-bold">{title}</p>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => setMuted((m) => !m)} className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/50 backdrop-blur hover:bg-white/10" aria-label={muted ? 'Unmute' : 'Mute'}>
            {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>
          <button type="button" onClick={toggle} className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black" aria-label={playing ? 'Pause' : 'Play'}>
            {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 translate-x-px" />}
          </button>
        </div>
      </div>
    </div>
  );
}

