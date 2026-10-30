import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import Seo from '@/components/Seo';
import ShaderBackdrop from '@/components/kit/ShaderBackdrop';
import { SERVICES } from '@/lib/site';

export default function NotFoundPage() {
  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden py-32">
      <Seo path="/404" title="Page not found | sevIT Digital" description="This page doesn’t exist." noindex />
      <ShaderBackdrop intensity={0.6} />
      <div className="container-x relative">
        <p className="eyebrow mb-6">Error 404</p>
        <h1 className="display text-[clamp(6rem,22vw,18rem)] leading-[0.8]">
          <span className="text-outline">4</span>
          <span className="text-gradient">0</span>
          <span className="text-outline">4</span>
        </h1>
        <p className="mt-8 max-w-md text-lg text-white/60">This page wandered off. Let’s get you somewhere useful.</p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link to="/" className="btn btn-primary">Back home <ArrowUpRight className="h-4 w-4" /></Link>
          <Link to="/#contact" className="btn btn-ghost">Contact us</Link>
        </div>
        <div className="mt-14 flex flex-wrap gap-2">
          {SERVICES.map((s) => (
            <Link key={s.slug} to={s.path} className="rounded-full border border-white/10 bg-black/40 px-4 py-2 text-sm text-white/60 backdrop-blur transition-colors hover:border-orange-400/40 hover:text-white">
              {s.name}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
