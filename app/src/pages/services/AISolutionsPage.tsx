import { Bot, FileSearch, Workflow, Sparkles } from 'lucide-react';
import ServiceLayout, { StepsSection } from '@/components/service/ServiceLayout';
import SevAI from '@/components/service/SevAI';
import { SectionHeader } from '@/components/kit';

const FLOWS = [
  {
    title: 'Answering customer enquiries',
    steps: ['A customer messages on WhatsApp or your website', 'The assistant answers and asks the right questions', 'It books a slot or takes the order', 'The lead lands in your CRM or sheet, with a summary'],
  },
  {
    title: 'Handling paperwork',
    steps: ['An invoice or form arrives by email', 'AI reads the PDF, even scanned ones', 'The numbers go straight into your system', 'Anything unusual gets flagged for a person'],
  },
];

function Flows() {
  return (
    <section id="work" className="relative scroll-mt-24 border-t border-white/[0.06] py-24 sm:py-32">
      <div className="container-x">
        <SectionHeader eyebrow="Examples" title="Two automations we build a lot" intro="Two examples of the kind of flows we build. Each one runs quietly in the background and hands off to a human when it should." />
        <div className="grid gap-10 lg:grid-cols-2">
          {FLOWS.map((f) => (
            <div key={f.title} className="border-t border-white/15 pt-6">
              <h3 className="text-2xl font-bold">{f.title}</h3>
              <ol className="mt-6 space-y-0">
                {f.steps.map((t, i) => (
                  <li key={t} className="grid grid-cols-[2rem_1fr] gap-3 border-b border-white/10 py-3.5 text-white/75">
                    <span className="tabular-nums text-a3">{i + 1}</span>
                    {t}
                  </li>
                ))}
              </ol>
            </div>
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
          AI assistants for the repetitive parts of your business.
        </>
      }
      intro="Custom chatbots, assistants and automations that answer customers around the clock, read the paperwork and keep your tools in sync, so your team can focus on the work that needs a human."
      heroVisual={
        <div id="sevai" className="scroll-mt-28">
          <SevAI />
        </div>
      }
      heroNote={<p className="flex items-center gap-2 font-mono text-xs text-white/40"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" /> sevAI is live on this page, say hi.</p>}
      offeringsTitle="Useful AI, set up for how your business works."
      offerings={[
        { icon: Bot, title: 'AI chatbots', text: 'Assistants for your website and WhatsApp that know your products and hand off to staff when needed.' },
        { icon: FileSearch, title: 'Document processing', text: 'Pull data out of invoices, forms, receipts and emails automatically, with checks for anything unusual.' },
        { icon: Workflow, title: 'Workflow automation', text: 'Connect the apps you already use so leads, orders and updates move without copy-paste.' },
        { icon: Sparkles, title: 'Custom AI tools', text: 'Internal assistants for writing, research, reporting and support, trained on your own knowledge.' },
      ]}
      faqs={[
        { q: 'Will the chatbot say wrong things to my customers?', a: 'We ground it in your own information, limit what it can talk about and add a clear hand-off to a human. We test it on real questions before it goes live.' },
        { q: 'Which AI models do you use?', a: 'We pick the model for the job, from leading hosted models to open-source ones, based on quality, speed, cost and where your data needs to stay.' },
        { q: 'Does it work with WhatsApp?', a: 'Yes. WhatsApp Business is usually the first channel our Sri Lankan clients want, and we can connect it alongside your website chat.' },
        { q: 'What about my data and privacy?', a: 'Your data is only used for your solution. We keep access tight, use reputable providers and can discuss self-hosted options when needed.' },
      ]}
    >
      <Flows />
      <StepsSection
        title="From a repetitive task to a working assistant"
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
