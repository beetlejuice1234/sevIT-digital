import { useState, type FormEvent } from 'react';
import { ArrowUpRight, Mail, MessageCircle, Instagram, Check } from 'lucide-react';
import { Reveal, SpotlightCard } from '@/components/kit';
import ShaderBackdrop from '@/components/kit/ShaderBackdrop';
import { SERVICES, SITE, waLink } from '@/lib/site';
import { cn } from '@/lib/utils';

/**
 * Project enquiry block shown at the bottom of every page.
 * No backend: the form composes a WhatsApp message (or an email) so
 * enquiries land straight in the team's inbox.
 */
export default function ContactSection({ defaultService }: { defaultService?: string }) {
  const [picked, setPicked] = useState<string[]>(defaultService ? [defaultService] : []);
  const [name, setName] = useState('');
  const [business, setBusiness] = useState('');
  const [message, setMessage] = useState('');

  const toggle = (s: string) => setPicked((p) => (p.includes(s) ? p.filter((x) => x !== s) : [...p, s]));

  const body = () =>
    [
      `Hi sevIT! I'm ${name || '—'}${business ? ` from ${business}` : ''}.`,
      picked.length ? `I'm interested in: ${picked.join(', ')}.` : '',
      message,
    ]
      .filter(Boolean)
      .join('\n\n');

  const submit = (e: FormEvent) => {
    e.preventDefault();
    window.open(waLink(body()), '_blank', 'noopener');
  };

  const mailto = () =>
    `mailto:${SITE.email}?subject=${encodeURIComponent(`Project enquiry${business ? ` — ${business}` : ''}`)}&body=${encodeURIComponent(body())}`;

  return (
    <section id="contact" className="relative scroll-mt-24 overflow-hidden py-24 sm:py-32">
      <ShaderBackdrop className="opacity-60 [mask-image:linear-gradient(to_bottom,transparent,#000_30%,#000_70%,transparent)]" intensity={0.8} />
      <div className="container-x relative">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
          <div className="flex flex-col">
            <Reveal className="eyebrow mb-6">Start a project</Reveal>
            <Reveal as="h2" delay={80} className="display text-balance text-5xl sm:text-6xl lg:text-7xl xl:text-8xl">
              Let's build <span className="text-gradient">something</span> worth talking about.
            </Reveal>
            <Reveal as="p" delay={160} className="mt-6 max-w-md text-lg leading-relaxed text-white/60">
              Tell us what you're working on. You'll hear back from one of the founders — usually the same day.
            </Reveal>

            <Reveal delay={240} className="mt-10 grid gap-3 sm:grid-cols-3 lg:mt-auto">
              {[
                { icon: MessageCircle, label: 'WhatsApp', value: SITE.phoneDisplay, href: SITE.whatsapp },
                { icon: Mail, label: 'Email', value: SITE.email, href: `mailto:${SITE.email}` },
                { icon: Instagram, label: 'Instagram', value: '@sevitdigital', href: SITE.instagram },
              ].map((c) => (
                <a
                  key={c.label}
                  href={c.href}
                  target={c.href.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  className="group rounded-2xl border border-white/10 bg-black/40 p-4 backdrop-blur transition-colors hover:border-orange-400/40"
                >
                  <c.icon className="h-4 w-4 text-orange-300" />
                  <p className="mt-3 text-xs text-white/45">{c.label}</p>
                  <p className="mt-0.5 flex items-center gap-1 truncate text-sm font-medium">
                    <span className="truncate">{c.value}</span>
                    <ArrowUpRight className="h-3.5 w-3.5 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
                  </p>
                </a>
              ))}
            </Reveal>
          </div>

          <Reveal delay={120}>
            <SpotlightCard as="form" onSubmit={submit} className="bg-black/50 p-6 backdrop-blur-xl sm:p-8">
              <fieldset>
                <legend className="mb-3 text-sm font-medium text-white/80">What do you need?</legend>
                <div className="flex flex-wrap gap-2">
                  {SERVICES.map((s) => {
                    const on = picked.includes(s.short);
                    return (
                      <button
                        type="button"
                        key={s.slug}
                        onClick={() => toggle(s.short)}
                        aria-pressed={on}
                        className={cn(
                          'flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm transition-all duration-300',
                          on
                            ? 'border-orange-400/70 bg-orange-500/15 text-white'
                            : 'border-white/10 bg-white/[0.03] text-white/60 hover:border-white/25 hover:text-white',
                        )}
                      >
                        {on && <Check className="h-3.5 w-3.5 text-orange-300" />}
                        {s.short}
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              <div className="mt-7 grid gap-4 sm:grid-cols-2">
                <Field label="Your name" value={name} onChange={setName} autoComplete="name" required />
                <Field label="Business (optional)" value={business} onChange={setBusiness} autoComplete="organization" />
              </div>
              <label className="mt-4 block">
                <span className="mb-2 block text-sm text-white/60">Tell us a little about the project</span>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  placeholder="Goals, timeline, links to anything you like…"
                  className="w-full resize-none rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-base text-white placeholder:text-white/25 focus:border-orange-400/60 focus:outline-none sm:text-sm"
                />
              </label>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button type="submit" className="btn btn-accent flex-1 !py-4">
                  <MessageCircle className="h-4 w-4" /> Send on WhatsApp
                </button>
                <a href={mailto()} className="btn btn-ghost flex-1 !py-4">
                  <Mail className="h-4 w-4" /> Send by email
                </a>
              </div>
              <p className="mt-4 text-center text-xs text-white/35">Opens WhatsApp or your mail app with your message ready to send.</p>
            </SpotlightCard>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  ...rest
}: { label: string; value: string; onChange: (v: string) => void } & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'>) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm text-white/60">{label}</span>
      <input
        {...rest}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-base text-white placeholder:text-white/25 focus:border-orange-400/60 focus:outline-none sm:text-sm"
      />
    </label>
  );
}
