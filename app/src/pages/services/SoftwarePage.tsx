import { useMemo, useState } from 'react';
import {
  Receipt,
  Boxes,
  BarChart3,
  Building2,
  Plug,
  CloudOff,
  Minus,
  Plus,
  Check,
  RotateCcw,
} from 'lucide-react';
import ServiceLayout, { StepsSection, HeroCtas } from '@/components/service/ServiceLayout';
import { Reveal, SectionHeader } from '@/components/kit';
import { cn } from '@/lib/utils';

/* ─── Interactive POS demo ───────────────────────────────────────────── */
type Item = { id: string; name: string; price: number; cat: string; hue: number; stock: number };
const MENU: Item[] = [
  { id: 'esp', name: 'Espresso', price: 650, cat: 'Coffee', hue: 25, stock: 42 },
  { id: 'lat', name: 'Iced latte', price: 850, cat: 'Coffee', hue: 30, stock: 30 },
  { id: 'cap', name: 'Cappuccino', price: 800, cat: 'Coffee', hue: 20, stock: 36 },
  { id: 'tea', name: 'Ceylon tea', price: 450, cat: 'Tea', hue: 5, stock: 60 },
  { id: 'gtea', name: 'Ginger tea', price: 500, cat: 'Tea', hue: 45, stock: 24 },
  { id: 'cro', name: 'Croissant', price: 950, cat: 'Food', hue: 38, stock: 12 },
  { id: 'san', name: 'Club sandwich', price: 1450, cat: 'Food', hue: 0, stock: 9 },
  { id: 'cake', name: 'Choc cake', price: 1100, cat: 'Food', hue: 15, stock: 6 },
  { id: 'jui', name: 'Mango juice', price: 900, cat: 'Cold', hue: 40, stock: 18 },
];
const CATS = ['All', 'Coffee', 'Tea', 'Food', 'Cold'];
const fmt = (n: number) => n.toLocaleString('en-LK');

function PosDemo() {
  const [cat, setCat] = useState('All');
  const [cart, setCart] = useState<Record<string, number>>({ lat: 2, cro: 1 });
  const [sales, setSales] = useState({ count: 47, total: 184250 });
  const [paid, setPaid] = useState<number | null>(null);
  const [stock, setStock] = useState<Record<string, number>>(Object.fromEntries(MENU.map((m) => [m.id, m.stock])));

  const lines = useMemo(() => MENU.filter((m) => cart[m.id]).map((m) => ({ ...m, qty: cart[m.id] })), [cart]);
  const subtotal = lines.reduce((s, l) => s + l.price * l.qty, 0);
  const service = Math.round(subtotal * 0.1);
  const total = subtotal + service;

  const add = (id: string, d: number) => {
    setPaid(null);
    setCart((c) => {
      const q = Math.max(0, Math.min(stock[id], (c[id] ?? 0) + d));
      const next = { ...c, [id]: q };
      if (!q) delete next[id];
      return next;
    });
  };

  const charge = () => {
    if (!total) return;
    setStock((s) => {
      const n = { ...s };
      lines.forEach((l) => (n[l.id] -= l.qty));
      return n;
    });
    setSales((s) => ({ count: s.count + 1, total: s.total + total }));
    setPaid(1000 + sales.count + 1);
    setCart({});
  };

  const low = MENU.filter((m) => stock[m.id] <= 8);

  return (
    <div className="grid gap-3 lg:grid-cols-[1fr_340px]">
      {/* products */}
      <div className="rounded-3xl border border-white/10 bg-[#0b0b0b] p-4 sm:p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="no-scrollbar flex gap-1.5 overflow-x-auto">
            {CATS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCat(c)}
                className={cn('shrink-0 rounded-full px-3.5 py-1.5 text-xs transition-colors', c === cat ? 'bg-white text-black' : 'bg-white/[0.05] text-white/60 hover:text-white')}
              >
                {c}
              </button>
            ))}
          </div>
          <span className="hidden items-center gap-1.5 text-[13px] text-emerald-400 sm:flex">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" /> Synced
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {MENU.filter((m) => cat === 'All' || m.cat === cat).map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => add(m.id, 1)}
              disabled={stock[m.id] - (cart[m.id] ?? 0) <= 0}
              className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.03] p-3 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-a2/40 active:scale-[0.97] disabled:opacity-40"
            >
              <span
                className="mb-6 block h-8 w-8 rounded-xl"
                style={{ background: `linear-gradient(135deg, hsl(${m.hue} 85% 60%), hsl(${m.hue + 20} 90% 45%))` }}
              />
              <span className="block text-sm font-medium">{m.name}</span>
              <span className="mt-0.5 flex items-center justify-between text-xs text-white/45">
                <span className="font-mono">Rs {fmt(m.price)}</span>
                <span className={cn(stock[m.id] <= 8 && 'text-amber-400')}>{stock[m.id]} left</span>
              </span>
              {cart[m.id] ? (
                <span className="absolute right-2 top-2 flex h-6 min-w-6 items-center justify-center rounded-full bg-a2 px-1.5 text-xs font-bold">{cart[m.id]}</span>
              ) : null}
            </button>
          ))}
        </div>
      </div>

      {/* ticket */}
      <div className="flex flex-col rounded-3xl border border-white/10 bg-[#0b0b0b] p-5">
        <div className="flex items-center justify-between">
          <p className="font-display text-lg font-bold">Current order</p>
          <button type="button" onClick={() => setCart({})} className="flex items-center gap-1 text-xs text-white/40 hover:text-white" aria-label="Clear order">
            <RotateCcw className="h-3.5 w-3.5" /> Clear
          </button>
        </div>
        <div className="mt-4 min-h-[150px] flex-1 space-y-2">
          {paid ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 py-6 text-center [animation:svc-in_.6s_var(--ease-out)_both]">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
                <Check className="h-6 w-6" />
              </span>
              <p className="font-medium">Payment received</p>
              <p className="font-mono text-xs text-white/40">Receipt #{paid} printed · stock updated</p>
            </div>
          ) : lines.length ? (
            lines.map((l) => (
              <div key={l.id} className="flex items-center justify-between gap-2 rounded-xl bg-white/[0.03] px-3 py-2 text-sm">
                <span className="truncate">{l.name}</span>
                <span className="flex items-center gap-2">
                  <button type="button" onClick={() => add(l.id, -1)} className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 hover:bg-white/20" aria-label={`Remove one ${l.name}`}>
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="w-4 text-center font-mono">{l.qty}</span>
                  <button type="button" onClick={() => add(l.id, 1)} className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 hover:bg-white/20" aria-label={`Add one ${l.name}`}>
                    <Plus className="h-3 w-3" />
                  </button>
                  <span className="w-14 text-right font-mono text-white/70">{fmt(l.price * l.qty)}</span>
                </span>
              </div>
            ))
          ) : (
            <p className="py-10 text-center text-sm text-white/35">Tap a product to add it</p>
          )}
        </div>
        <dl className="mt-4 space-y-1.5 border-t border-dashed border-white/15 pt-4 text-sm">
          <div className="flex justify-between text-white/55"><dt>Subtotal</dt><dd className="font-mono">{fmt(subtotal)}</dd></div>
          <div className="flex justify-between text-white/55"><dt>Service charge 10%</dt><dd className="font-mono">{fmt(service)}</dd></div>
          <div className="flex justify-between pt-1 text-lg font-bold"><dt>Total</dt><dd className="font-mono">Rs {fmt(total)}</dd></div>
        </dl>
        <button type="button" onClick={charge} disabled={!total} className="btn btn-accent mt-4 w-full !py-4 disabled:opacity-40">
          Charge Rs {fmt(total)}
        </button>
      </div>

      {/* live dashboard strip */}
      <div className="grid grid-cols-2 gap-3 lg:col-span-2 lg:grid-cols-4">
        {[
          { label: "Today's revenue", value: `Rs ${fmt(sales.total)}` },
          { label: 'Orders', value: String(sales.count) },
          { label: 'Avg. ticket', value: `Rs ${fmt(Math.round(sales.total / sales.count))}` },
          { label: 'Low stock', value: low.length ? low.map((l) => l.name).join(', ') : 'All good' },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-white/10 bg-[#0b0b0b] p-4">
            <p className="text-[13px] text-white/40">{s.label}</p>
            <p className="mt-1.5 truncate font-display text-lg font-bold sm:text-xl" key={s.value}>
              {s.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

const RECEIPT = [
  ['Fast checkout', 'yes'],
  ['Stock that updates itself', 'yes'],
  ['Daily sales on your phone', 'yes'],
  ['Staff logins and roles', 'yes'],
  ['Printed and WhatsApp bills', 'yes'],
  ['Keeps selling offline', 'yes'],
];

/** Hero: what you get, printed on a receipt. */
function Hero() {
  return (
    <div className="container-x pb-16">
      <h1 className="display max-w-[16ch] text-balance text-[clamp(2.8rem,6.4vw,6rem)]">POS and business software, built around how your shop runs.</h1>
      <div className="mt-12 grid items-start gap-10 lg:grid-cols-[1fr_auto_1fr] lg:gap-14">
        <div className="lg:pt-10">
          <p className="max-w-[40ch] text-lg leading-relaxed text-white/65">
            Billing, stock, staff and reports in one system, shaped around your counter instead of someone else’s template. It grows from one till to many branches.
          </p>
          <HeroCtas className="mt-8" />
        </div>

        <div className="receipt relative mx-auto w-[300px] origin-top -rotate-2 bg-[#f4f1ea] px-6 pb-10 pt-6 font-mono text-[12px] text-black shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)]">
          <p className="text-center text-base font-bold">YOUR SHOP</p>
          <p className="text-center text-black/50">powered by sevIT POS</p>
          <p className="mt-1 text-center text-black/50">Receipt #0001</p>
          <div className="my-3 border-t border-dashed border-black/40" />
          {RECEIPT.map(([k], i) => (
            <div key={k} className="receipt-line flex justify-between py-0.5" style={{ animationDelay: `${0.5 + i * 0.18}s` }}>
              <span>{k}</span>
              <span>✓</span>
            </div>
          ))}
          <div className="my-3 border-t border-dashed border-black/40" />
          <div className="flex justify-between text-sm font-bold">
            <span>TOTAL</span>
            <span>Built for you</span>
          </div>
          <div className="mt-4 h-10 bg-[repeating-linear-gradient(90deg,#000_0_2px,transparent_2px_4px,#000_4px_5px,transparent_5px_8px,#000_8px_11px,transparent_11px_12px)]" />
          <p className="mt-3 text-center text-black/60">Thank you, come again!</p>
          <div className="absolute inset-x-0 -bottom-3 h-3 bg-[linear-gradient(-45deg,transparent_6px,#f4f1ea_0),linear-gradient(45deg,transparent_6px,#f4f1ea_0)] bg-[length:12px_12px] bg-bottom" />
        </div>

        <div className="hidden lg:block lg:pt-24">
          <div className="rounded-2xl border border-white/10 bg-black/60 p-5 backdrop-blur">
            <p className="text-[13px] text-white/50">Sales this week, all branches</p>
            <p className="mt-1 font-display text-3xl font-bold">Rs 1,284,600</p>
            <svg viewBox="0 0 300 100" className="mt-4 h-24 w-full" preserveAspectRatio="none" aria-hidden>
              <path d="M0 80 L43 62 L86 70 L129 44 L172 52 L215 26 L258 34 L300 12" fill="none" style={{ stroke: 'rgb(var(--a2))' }} strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
            </svg>
            <p className="mt-3 flex items-center gap-2 text-[13px] text-white/60"><span className="h-2 w-2 rounded-full bg-amber-400" /> Low stock: Croissant (6 left)</p>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes print { from { clip-path: inset(0 0 100% 0); transform: translateY(-30px) rotate(-2deg) } to { clip-path: inset(0 0 -20px 0); transform: rotate(-2deg) } }
        .receipt { animation: print 1.6s var(--ease-out) both }
        @keyframes line-in { from { opacity: 0 } to { opacity: 1 } }
        .receipt-line { animation: line-in .3s ease both }
      `}</style>
    </div>
  );
}

const INDUSTRIES = ['Cafés & restaurants', 'Retail & fashion', 'Mobile & electronics shops', 'Pharmacies', 'Salons & spas', 'Gyms & studios', 'Hardware stores', 'Wholesale & distribution'];

export default function SoftwarePage() {
  return (
    <ServiceLayout
      slug="software-pos"
      hero={<Hero />}
      offeringsTitle="Everything behind the counter, and the office behind that."
      offerings={[
        { icon: Receipt, title: 'POS & billing', text: 'Fast checkout for shops and restaurants: barcode or tap-to-add, discounts, split bills, receipts and returns.' },
        { icon: Boxes, title: 'Inventory & stock', text: 'Live stock levels, low-stock alerts, suppliers, purchase orders and stock transfers between locations.' },
        { icon: BarChart3, title: 'Reports & dashboards', text: 'Daily sales, best sellers, staff performance and profit, on your phone, wherever you are.' },
        { icon: Building2, title: 'Custom business systems', text: 'Booking, job cards, customer records, quotations and invoicing, tailored software for workflows off-the-shelf tools miss.' },
        { icon: Plug, title: 'Hardware & integrations', text: 'Receipt printers, barcode scanners, cash drawers, card terminals, SMS and accounting exports.' },
        { icon: CloudOff, title: 'Cloud-synced, outage-ready', text: 'Data backed up to the cloud, with designs that keep selling through a bad connection or a power cut.' },
      ]}
      faqs={[
        { q: 'Is this an off-the-shelf POS or custom software?', a: 'Custom. We build around your products, pricing rules and workflow instead of forcing you into someone else’s. You get software that fits, and you’re not paying for features you’ll never use.' },
        { q: 'Will it work with my existing printer and scanner?', a: 'Most standard thermal receipt printers, USB/Bluetooth barcode scanners and cash drawers work. Tell us what you have and we’ll confirm before we start.' },
        { q: 'Can I see sales from more than one branch?', a: 'Yes. Multi-branch setups share one dashboard, with per-branch stock, staff and reports.' },
        { q: 'What happens if the internet goes down?', a: 'We design for Sri Lankan reality: the system keeps recording sales and syncs when the connection comes back.' },
        { q: 'Do you provide training and support?', a: 'Yes, we train your staff on-site or remotely and stay available for fixes, updates and new features after launch.' },
      ]}
    >
      <section id="work" className="relative scroll-mt-24 py-20 sm:py-28">
        <div className="container-x">
          <SectionHeader
            eyebrow="Live demo"
            title="Try ringing up an order."
            intro="A working mini-POS built for this page. Add items, charge the order and watch stock and the dashboard update. Imagine it shaped around your business."
          />
          <Reveal>
            <PosDemo />
          </Reveal>
        </div>
      </section>

      <section className="relative border-t border-white/[0.06] py-24 sm:py-32">
        <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
          <SectionHeader stacked className="!mb-0" eyebrow="Who it's for" title="Who we build it for" intro="If you sell, book, stock or invoice anything, there's probably a few hours a week we can give back to you." />
          <div>
            <div className="flex flex-wrap gap-2">
              {INDUSTRIES.map((x, i) => (
                <Reveal key={x} delay={i * 40} className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white/75">
                  {x}
                </Reveal>
              ))}
            </div>
            <p className="mt-8 max-w-[52ch] border-t border-white/10 pt-6 leading-relaxed text-white/60">
              Every system comes ready for barcode scanners, thermal receipt printers and cash drawers, with staff logins and roles so
              cashiers only see what they need.
            </p>
          </div>
        </div>
      </section>

      <StepsSection
        title="From a walkthrough of your shop to go-live"
        steps={[
          { title: 'Shadow your floor', text: 'We watch how sales, stock and staff actually flow today.' },
          { title: 'Prototype', text: 'Clickable screens your team can try before we build.' },
          { title: 'Build & connect', text: 'Software, hardware and data migration from your old system.' },
          { title: 'Train & support', text: 'On-site training, a soft launch and ongoing support.' },
        ]}
      />
    </ServiceLayout>
  );
}
