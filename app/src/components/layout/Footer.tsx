import { Link } from 'react-router-dom';
import { ArrowUp } from 'lucide-react';
import { SERVICES, SITE } from '@/lib/site';
import { Logo } from './Navbar';
import useLocalTime from '@/lib/useLocalTime';

export default function Footer() {
  const time = useLocalTime();
  return (
    <footer className="relative overflow-hidden border-t border-white/[0.06] pt-20">
      <div className="container-x">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Logo className="h-8" />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/50">
              A small studio from Sri Lanka. Websites, POS and business software, AI tools, brands and 3D ads, all made in-house.
            </p>
            <a href={`mailto:${SITE.email}`} className="mt-6 inline-block text-lg font-medium underline decoration-white/20 underline-offset-8 transition-colors hover:decoration-a2">
              {SITE.email}
            </a>
          </div>

          <FooterCol title="Services">
            {SERVICES.map((s) => (
              <li key={s.slug}>
                <Link to={s.path}>{s.name}</Link>
              </li>
            ))}
          </FooterCol>

          <FooterCol title="Studio">
            <li><Link to="/#work">Selected work</Link></li>
            <li><Link to="/#process">How we work</Link></li>
            <li><Link to="/#testimonials">Client stories</Link></li>
            <li><Link to="/careers">Careers</Link></li>
            <li><Link to="/#contact">Contact</Link></li>
          </FooterCol>

          <FooterCol title="Connect">
            <li><a href={SITE.whatsapp} target="_blank" rel="noopener noreferrer">WhatsApp</a></li>
            <li><a href={SITE.instagram} target="_blank" rel="noopener noreferrer">Instagram</a></li>
            <li><a href={`tel:${SITE.phone}`}>{SITE.phoneDisplay}</a></li>
            <li className="text-white/40">{time} in Sri Lanka right now</li>
          </FooterCol>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-white/[0.06] py-6 text-xs text-white/35 sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} sevIT Digital. All rights reserved.</p>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2 transition-colors hover:text-white"
          >
            Back to top <ArrowUp className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div aria-hidden className="pointer-events-none select-none overflow-hidden">
        <p className="display -mb-[0.18em] whitespace-nowrap text-center text-[24vw] leading-none tracking-[-0.04em] text-outline [font-stretch:100%]">sevIT</p>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-5 text-[15px] font-medium text-white/40">{title}</p>
      <ul className="space-y-3 text-sm text-white/65 [&_a:hover]:text-white [&_a]:transition-colors">{children}</ul>
    </div>
  );
}
