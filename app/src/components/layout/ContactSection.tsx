import { useState, type FormEvent } from 'react';
import { Mail, MessageCircle, Check } from 'lucide-react';
import { Reveal } from '@/components/kit';
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
    `mailto:${SITE.email}?subject=${encodeURIComponent(`Project enquiry${business ? `, ${business}` : ''}`)}&body=${encodeURIComponent(body())}`;

  return (
    <section id="contact" className="relative scroll-mt-24 overflow-hidden py-24 sm:py-32">
      <ShaderBackdrop className="opacity-60 [mask-image:linear-gradient(to_bottom,transparent,#000_30%,#000_70%,transparent)]" intensity={0.8} />
      <div className="container-x relative">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
          <div className="flex flex-col">
            <p className="eyebrow mb-6">Start a project</p>
            <h2 className="display text-balance text-[clamp(2.8rem,5.4vw,5.2rem)]">Tell us what you’re building.</h2>
            <p className="mt-6 max-w-[42ch] text-lg leading-relaxed text-white/60">
              A rough idea is enough. One of the three of us will reply, usually the same day.
            </p>

            <dl className="mt-12 grid gap-6 text-[15px] sm:grid-cols-2 lg:mt-auto">
              {[
                { label: 'WhatsApp', value: SITE.phoneDisplay, href: SITE.whatsapp },
                { label: 'Email', value: SITE.email, href: `mailto:${SITE.email}` },
                { label: 'Instagram', value: '@sevitdigital', href: SITE.instagram },
                { label: 'Based in', value: 'Sri Lanka, working with clients anywhere' },
              ].map((c) => (
                <div key={c.label} className="border-t border-white/15 pt-3">
                  <dt className="text-white/45">{c.label}</dt>
                  <dd className="mt-1 break-words text-lg">
                    {c.href ? (
                      <a href={c.href} target={c.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className="underline decoration-white/25 underline-offset-4 transition-colors hover:text-a3 hover:decoration-a2">
                        {c.value}
                      </a>
                    ) : (
                      c.value
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <Reveal delay={120}>
            <form onSubmit={submit} className="rounded-[2rem] border border-white/10 bg-black/60 p-6 backdrop-blur-xl sm:p-8">
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
                            ? 'border-a2/70 bg-a2/15 text-white'
                            : 'border-white/10 bg-white/[0.03] text-white/60 hover:border-white/25 hover:text-white',
                        )}
                      >
                        {on && <Check className="h-3.5 w-3.5 text-a3" />}
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
                  className="w-full resize-none rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-base text-white placeholder:text-white/25 focus:border-a2/60 focus:outline-none sm:text-sm"
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
              <p className="mt-4 text-center text-sm text-white/40">This opens WhatsApp or your mail app with the message filled in.</p>
            </form>
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
        className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-base text-white placeholder:text-white/25 focus:border-a2/60 focus:outline-none sm:text-sm"
      />
    </label>
  );
}
