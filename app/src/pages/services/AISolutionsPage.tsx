import { Bot, FileSearch, Workflow, Sparkles, Mail, Calendar, Database, MessageCircle, FileText, ArrowRight } from 'lucide-react';
import ServiceLayout, { StepsSection } from '@/components/service/ServiceLayout';
import SevAI from '@/components/service/SevAI';
import { Reveal, SectionHeader, SpotlightCard } from '@/components/kit';

const FLOWS = [
  {
    title: 'Customer enquiries',
    steps: [
      { icon: MessageCircle, t: 'WhatsApp / web chat message' },
      { icon: Bot, t: 'AI answers & qualifies' },
      { icon: Calendar, t: 'Books a slot' },
      { icon: Database, t: 'Logs lead to your CRM' },
    ],
  },
  {
    title: 'Paperwork',
    steps: [
      { icon: Mail, t: 'Invoice arrives by email' },
      { icon: FileSearch, t: 'AI reads the PDF' },
      { icon: FileText, t: 'Fills your sheet / system' },
      { icon: MessageCircle, t: 'Flags anything odd' },
    ],
  },
];

function Flows() {
  return (
    <section id="work" className="relative scroll-mt-24 border-t border-white/[0.06] py-24 sm:py-32">
      <div className="container-x">
        <SectionHeader eyebrow="Automations" title={<>Busywork, <span className="text-white/40">handled.</span></>} intro="Two examples of the kind of flows we build. Each one runs quietly in the background and hands off to a human when it should." />
        <div className="grid gap-4 lg:grid-cols-2">
          {FLOWS.map((f, n) => (
            <Reveal key={f.title} delay={n * 100}>
              <SpotlightCard className="p-6 sm:p-8">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-a3">{f.title}</p>
                <ol className="mt-6 space-y-2">
                  {f.steps.map((s, i) => (
                    <li key={s.t} className="flex items-center gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
                        <s.icon className="h-4 w-4 text-white/70" />
                      </span>
                      <span className="flex-1 rounded-xl bg-white/[0.03] px-4 py-2.5 text-sm text-white/75">{s.t}</span>
                      {i < f.steps.length - 1 ? <ArrowRight className="h-4 w-4 rotate-90 text-white/20" /> : <span className="w-4" />}
                    </li>
                  ))}
                </ol>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function AISolutionsPage() {
  return (
    <ServiceLayout
      slug="ai-solutions"
      title={
        <>
          AI that does the <span className="text-gradient">busywork.</span>
        </>
      }
      intro="Custom chatbots, assistants and automations that answer customers around the clock, read the paperwork and keep your tools in sync — so your team can focus on the work that needs a human."
      heroVisual={
        <div id="sevai" className="scroll-mt-28">
          <SevAI />
        </div>
      }
      heroNote={<p className="flex items-center gap-2 font-mono text-xs text-white/40"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" /> sevAI is live on this page — say hi.</p>}
      offeringsTitle={<>Practical AI, <span className="text-white/40">not hype.</span></>}
      offerings={[
        { icon: Bot, title: 'AI chatbots', text: 'Assistants for your website and WhatsApp that know your products and hand off to staff when needed.' },
        { icon: FileSearch, title: 'Document processing', text: 'Pull data out of invoices, forms, receipts and emails automatically, with checks for anything unusual.' },
        { icon: Workflow, title: 'Workflow automation', text: 'Connect the apps you already use so leads, orders and updates move without copy-paste.' },
        { icon: Sparkles, title: 'Custom AI tools', text: 'Internal assistants for writing, research, reporting and support, trained on your own knowledge.' },
      ]}
      faqs={[
        { q: 'Will the chatbot say wrong things to my customers?', a: 'We ground it in your own information, limit what it can talk about and add a clear hand-off to a human. We test it on real questions before it goes live.' },
        { q: 'Which AI models do you use?', a: 'We pick the model for the job — from leading hosted models to open-source ones — based on quality, speed, cost and where your data needs to stay.' },
        { q: 'Does it work with WhatsApp?', a: 'Yes. WhatsApp Business is usually the first channel our Sri Lankan clients want, and we can connect it alongside your website chat.' },
        { q: 'What about my data and privacy?', a: 'Your data is only used for your solution. We keep access tight, use reputable providers and can discuss self-hosted options when needed.' },
      ]}
    >
      <Flows />
      <StepsSection
        title={<>From idea to <span className="text-white/40">assistant.</span></>}
        steps={[
          { title: 'Discovery', text: 'Find the repetitive tasks costing you the most time.' },
          { title: 'Design', text: 'Pick tools, data sources and where humans stay in the loop.' },
          { title: 'Build & train', text: 'Develop on your data, voice and business rules.' },
          { title: 'Launch & tune', text: 'Go live, monitor real conversations, keep improving.' },
        ]}
      />
    </ServiceLayout>
  );
}
