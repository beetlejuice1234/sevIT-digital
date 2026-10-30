import { Bot, FileSearch, Workflow, Sparkles } from 'lucide-react';
import ServiceLayout, { StepsSection, HeroCtas } from '@/components/service/ServiceLayout';
import SevAI from '@/components/service/SevAI';
import { SectionHeader, Sparkle } from '@/components/kit';
import useTyped from '@/lib/useTyped';

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

const HEADLINE = 'Yes. We build AI assistants for the repetitive parts of your business.';

/** Hero: a conversation. The question is the visitor's, the headline is sevAI's answer. */
function Hero() {
  const { typed, done } = useTyped(HEADLINE, 32, 900);
  return (
    <div className="container-x pb-16">
      <div className="mx-auto max-w-4xl">
        <p className="ml-auto w-fit max-w-[80%] rounded-3xl rounded-br-md bg-white px-5 py-3 text-lg text-black [animation:svc-in_.6s_var(--ease-out)_both]">
          Can AI actually help a business like mine?
        </p>
        <div className="mt-8 flex gap-4 sm:gap-5">
          <span className="mt-2 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-a2 sm:h-12 sm:w-12">
            <Sparkle tone="black" className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <h1 className="display relative text-[clamp(2.2rem,5vw,4.4rem)]" aria-label={HEADLINE}>
              <span aria-hidden className="invisible">{HEADLINE}</span>
              <span aria-hidden className="absolute inset-0">
                {typed}
                <span className={done ? 'hidden' : 'ml-1 inline-block h-[0.8em] w-[3px] animate-pulse bg-a2 align-baseline'} />
              </span>
            </h1>
            <div className="[animation:svc-in_.8s_var(--ease-out)_1.6s_both]">
              <p className="mt-6 max-w-[52ch] text-lg leading-relaxed text-white/65">
                Chatbots that answer customers at 2am, tools that read invoices for you, and automations that keep your apps in sync. You keep the work that needs a human.
              </p>
              <HeroCtas className="mt-8" />
            </div>
          </div>
        </div>
      </div>

      <div id="sevai" className="mx-auto mt-20 max-w-3xl scroll-mt-28">
        <p className="mb-4 flex items-center gap-2 text-[15px] text-white/55">
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" /> sevAI is live. Ask it something real.
        </p>
        <SevAI />
      </div>
    </div>
  );
}


export default function AISolutionsPage() {
  return (
    <ServiceLayout
      slug="ai-solutions"
      hero={<Hero />}
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
