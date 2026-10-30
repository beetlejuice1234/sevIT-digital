import { useState, type FormEvent } from 'react';
import { ArrowUpRight, Globe, Zap, Heart, Rocket, Mail, Check } from 'lucide-react';
import Seo from '@/components/Seo';
import ShaderBackdrop from '@/components/kit/ShaderBackdrop';
import { Reveal, SectionHeader, SpotlightCard } from '@/components/kit';
import { SITE } from '@/lib/site';
import { cn } from '@/lib/utils';

const ROLES = [
  { title: 'Senior UI/UX Designer', type: 'Full-time · Remote', team: 'Design', text: 'Lead the visual direction of websites, apps and brand systems — from wireframe to polished prototype.' },
  { title: 'Frontend Engineer (React)', type: 'Full-time · Remote', team: 'Engineering', text: 'Build fast, animation-rich sites and web apps with React, TypeScript and Tailwind.' },
  { title: 'AI Automation Specialist', type: 'Project-based · Remote', team: 'AI', text: 'Design and deploy chatbots, document pipelines and automations for real businesses.' },
  { title: '3D Render Artist', type: 'Project-based · Remote', team: 'Creative', text: 'Create photoreal product renders and short CGI ad films for brands.' },
];

const PERKS = [
  { icon: Globe, title: 'Remote-first', text: 'Work from anywhere. We care about output, not office hours.' },
  { icon: Zap, title: 'Modern tools', text: 'The latest frameworks, AI tools and 3D software — and time to learn them.' },
  { icon: Heart, title: 'Real ownership', text: 'Small team, no red tape. Your work ships and clients see your name on it.' },
  { icon: Rocket, title: 'Grow fast', text: 'Work across web, software, AI and CGI. You’ll learn more in a year than most do in three.' },
];

export default function CareersPage() {
  const [role, setRole] = useState('');
  const [name, setName] = useState('');
  const [link, setLink] = useState('');
  const [note, setNote] = useState('');
  const [opened, setOpened] = useState(false);

  const apply = (r: string) => {
    setRole(r);
    document.getElementById('apply')?.scrollIntoView({ behavior: 'smooth' });
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const body = [`Name: ${name}`, `Role: ${role || 'General application'}`, link ? `Portfolio / LinkedIn: ${link}` : null, '', note, '', '(CV attached)'].filter((x) => x !== null).join('\n');
    window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(`Application — ${role || 'General'} — ${name}`)}&body=${encodeURIComponent(body)}`;
    setOpened(true);
  };

  return (
    <>
      <Seo path="/careers" breadcrumbs={[{ name: 'Careers', path: '/careers' }]} />

      <section className="relative overflow-hidden pb-20 pt-36 sm:pt-44">
        <ShaderBackdrop intensity={0.7} />
        <div className="grid-bg pointer-events-none absolute inset-0 opacity-50" aria-hidden />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" aria-hidden />
        <div className="container-x relative">
          <Reveal className="eyebrow mb-7">Careers at sevIT</Reveal>
          <Reveal as="h1" delay={80} className="display max-w-5xl text-balance text-[clamp(3rem,8vw,7rem)]">
            Do the best work of <span className="text-gradient">your career.</span>
          </Reveal>
          <Reveal as="p" delay={160} className="mt-7 max-w-xl text-lg leading-relaxed text-white/60">
            We’re a small studio that takes on big, varied projects — websites, software, AI and CGI. If you love shipping things you’re proud of, we should talk.
          </Reveal>
          <Reveal delay={240} className="mt-10">
            <a href="#roles" className="btn btn-accent">See open roles <ArrowUpRight className="h-4 w-4" /></a>
          </Reveal>
        </div>
      </section>

      <section className="py-16">
        <div className="container-x grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PERKS.map((p, i) => (
            <Reveal key={p.title} delay={i * 70}>
              <SpotlightCard className="h-full p-6">
                <p.icon className="h-5 w-5 text-a3" />
                <h3 className="mt-6 font-display text-lg font-bold">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/55">{p.text}</p>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="roles" className="scroll-mt-24 py-20 sm:py-28">
        <div className="container-x">
          <SectionHeader eyebrow="Open roles" title={<>Find your <span className="text-white/40">seat.</span></>} />
          <ul className="border-t border-white/[0.08]">
            {ROLES.map((r, i) => (
              <Reveal as="li" key={r.title} delay={i * 50} className="border-b border-white/[0.08]">
                <button type="button" onClick={() => apply(r.title)} className="group grid w-full items-center gap-3 py-7 text-left sm:grid-cols-[1fr_auto_auto] sm:gap-8">
                  <span>
                    <span className="block font-display text-2xl font-bold transition-colors group-hover:text-a3 sm:text-3xl">{r.title}</span>
                    <span className="mt-1.5 block max-w-xl text-sm text-white/50">{r.text}</span>
                  </span>
                  <span className="flex gap-2 text-xs">
                    <span className="rounded-full border border-white/10 px-3 py-1 text-white/60">{r.team}</span>
                    <span className="rounded-full border border-white/10 px-3 py-1 text-white/60">{r.type}</span>
                  </span>
                  <span className="hidden h-12 w-12 items-center justify-center rounded-full border border-white/15 transition-all duration-500 group-hover:rotate-45 group-hover:border-transparent group-hover:bg-white group-hover:text-black sm:flex">
                    <ArrowUpRight className="h-5 w-5" />
                  </span>
                </button>
              </Reveal>
            ))}
          </ul>
          <p className="mt-6 text-sm text-white/45">Don’t see your role? Apply anyway — we read every message.</p>
        </div>
      </section>

      <section id="apply" className="scroll-mt-24 border-t border-white/[0.06] py-24 sm:py-32">
        <div className="container-x grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <SectionHeader className="!mb-0" eyebrow="Apply" title={<>Introduce <span className="text-white/40">yourself.</span></>} intro="Fill this in and we’ll open an email to the team with your details. Attach your CV or portfolio PDF and hit send." />
          <Reveal>
            <SpotlightCard as="form" onSubmit={submit} className="space-y-5 p-6 sm:p-8">
              <div>
                <p className="mb-2 text-sm text-white/60">Role</p>
                <div className="flex flex-wrap gap-2">
                  {[...ROLES.map((r) => r.title), 'General application'].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      aria-pressed={role === r}
                      className={cn('rounded-full border px-3.5 py-2 text-xs transition-colors', role === r ? 'border-a2/70 bg-a2/15 text-white' : 'border-white/10 text-white/55 hover:text-white')}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
              {[
                { l: 'Full name', v: name, s: setName, req: true, ac: 'name' },
                { l: 'Portfolio, GitHub or LinkedIn', v: link, s: setLink, req: false, ac: 'url' },
              ].map((f) => (
                <label key={f.l} className="block">
                  <span className="mb-2 block text-sm text-white/60">{f.l}</span>
                  <input required={f.req} autoComplete={f.ac} value={f.v} onChange={(e) => f.s(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-base focus:border-a2/60 focus:outline-none sm:text-sm" />
                </label>
              ))}
              <label className="block">
                <span className="mb-2 block text-sm text-white/60">Why sevIT? (optional)</span>
                <textarea rows={4} value={note} onChange={(e) => setNote(e.target.value)} className="w-full resize-none rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-base focus:border-a2/60 focus:outline-none sm:text-sm" />
              </label>
              <button type="submit" className="btn btn-accent w-full !py-4">
                {opened ? <Check className="h-4 w-4" /> : <Mail className="h-4 w-4" />}
                {opened ? 'Email opened — attach your CV and send' : 'Continue in email'}
              </button>
              <p className="text-center text-xs text-white/35">
                Or email us directly at <a className="underline" href={`mailto:${SITE.email}`}>{SITE.email}</a>
              </p>
            </SpotlightCard>
          </Reveal>
        </div>
      </section>
    </>
  );
}
