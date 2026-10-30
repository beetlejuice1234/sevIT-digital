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
  ScanBarcode,
  Printer,
  Users,
  RotateCcw,
} from 'lucide-react';
import ServiceLayout, { StepsSection } from '@/components/service/ServiceLayout';
import { Reveal, SectionHeader, SpotlightCard } from '@/components/kit';
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
          <span className="hidden items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-emerald-400 sm:flex">
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
              className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.03] p-3 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-orange-400/40 active:scale-[0.97] disabled:opacity-40"
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
                <span className="absolute right-2 top-2 flex h-6 min-w-6 items-center justify-center rounded-full bg-orange-500 px-1.5 text-xs font-bold">{cart[m.id]}</span>
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
            <p className="font-mono text-[10px] uppercase tracking-wider text-white/40">{s.label}</p>
            <p className="mt-1.5 truncate font-display text-lg font-bold sm:text-xl" key={s.value}>
              {s.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function HeroVisual() {
  return (
    <div className="relative mx-auto max-w-[520px]">
      <div className="float-slow rounded-[1.8rem] border border-white/10 bg-[#0b0b0b]/90 p-5 shadow-2xl backdrop-blur [--r:1.5deg]">
        <div className="flex items-center justify-between">
          <p className="font-mono text-[10px] uppercase tracking-wider text-white/40">Sales · this week</p>
          <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">Live</span>
        </div>
        <p className="mt-2 font-display text-3xl font-bold">Rs 1,284,600</p>
        <svg viewBox="0 0 300 100" className="mt-4 h-28 w-full" preserveAspectRatio="none" aria-hidden>
          <defs>
            <linearGradient id="sw-g" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="#f97316" stopOpacity=".4" />
              <stop offset="1" stopColor="#f97316" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d="M0 80 L43 62 L86 70 L129 44 L172 52 L215 26 L258 34 L300 12 L300 100 L0 100Z" fill="url(#sw-g)" />
          <path d="M0 80 L43 62 L86 70 L129 44 L172 52 L215 26 L258 34 L300 12" fill="none" stroke="#fb923c" strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
        </svg>
        <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
          {[
            ['312', 'Orders'],
            ['3', 'Branches'],
            ['98%', 'In stock'],
          ].map(([k, v]) => (
            <div key={v} className="rounded-xl bg-white/[0.04] py-3">
              <p className="font-display text-lg font-bold">{k}</p>
              <p className="text-white/40">{v}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="float-slow absolute -bottom-10 -left-6 w-52 rounded-2xl border border-white/10 bg-[#f5f1ea] p-4 font-mono text-[10px] text-black shadow-2xl [--r:-4deg] [animation-delay:-2s] sm:-left-12">
        <p className="text-center font-bold tracking-widest">GOLDEN HOUR</p>
        <p className="text-center text-black/50">Receipt #1048 · Kandy</p>
        <div className="my-2 border-t border-dashed border-black/30" />
        <div className="flex justify-between"><span>Iced latte x2</span><span>1,700</span></div>
        <div className="flex justify-between"><span>Croissant</span><span>950</span></div>
        <div className="flex justify-between"><span>Service 10%</span><span>265</span></div>
        <div className="my-2 border-t border-dashed border-black/30" />
        <div className="flex justify-between font-bold"><span>TOTAL</span><span>Rs 2,915</span></div>
        <div className="mt-2 h-6 bg-[repeating-linear-gradient(90deg,#000_0_2px,transparent_2px_4px,#000_4px_5px,transparent_5px_8px)]" />
      </div>
      <div className="float-slow absolute -right-4 -top-6 flex items-center gap-2 rounded-2xl border border-white/10 bg-black/80 px-3 py-2 text-xs shadow-2xl backdrop-blur [animation-delay:-4s] sm:-right-8">
        <span className="h-2 w-2 rounded-full bg-amber-400" /> Low stock: Croissant (6)
      </div>
    </div>
  );
}

const INDUSTRIES = ['Cafés & restaurants', 'Retail & fashion', 'Mobile & electronics shops', 'Pharmacies', 'Salons & spas', 'Gyms & studios', 'Hardware stores', 'Wholesale & distribution'];

export default function SoftwarePage() {
  return (
    <ServiceLayout
      slug="software-pos"
      title={
        <>
          Software that runs <span className="text-gradient">your business</span>, not the other way round.
        </>
      }
      intro="Point-of-sale, billing, inventory and custom business software — designed around how your team actually works, and built to grow from one counter to many branches."
      heroVisual={<HeroVisual />}
      offeringsTitle={<>Everything behind <span className="text-white/40">the counter.</span></>}
      offerings={[
        { icon: Receipt, title: 'POS & billing', text: 'Fast checkout for shops and restaurants: barcode or tap-to-add, discounts, split bills, receipts and returns.' },
        { icon: Boxes, title: 'Inventory & stock', text: 'Live stock levels, low-stock alerts, suppliers, purchase orders and stock transfers between locations.' },
        { icon: BarChart3, title: 'Reports & dashboards', text: 'Daily sales, best sellers, staff performance and profit — on your phone, wherever you are.' },
        { icon: Building2, title: 'Custom business systems', text: 'Booking, job cards, customer records, quotations and invoicing — tailored software for workflows off-the-shelf tools miss.' },
        { icon: Plug, title: 'Hardware & integrations', text: 'Receipt printers, barcode scanners, cash drawers, card terminals, SMS and accounting exports.' },
        { icon: CloudOff, title: 'Cloud-synced, outage-ready', text: 'Data backed up to the cloud, with designs that keep selling through a bad connection or a power cut.' },
      ]}
      faqs={[
        { q: 'Is this an off-the-shelf POS or custom software?', a: 'Custom. We build around your products, pricing rules and workflow instead of forcing you into someone else’s. You get software that fits — and you’re not paying for features you’ll never use.' },
        { q: 'Will it work with my existing printer and scanner?', a: 'Most standard thermal receipt printers, USB/Bluetooth barcode scanners and cash drawers work. Tell us what you have and we’ll confirm before we start.' },
        { q: 'Can I see sales from more than one branch?', a: 'Yes. Multi-branch setups share one dashboard, with per-branch stock, staff and reports.' },
        { q: 'What happens if the internet goes down?', a: 'We design for Sri Lankan reality: the system keeps recording sales and syncs when the connection comes back.' },
        { q: 'Do you provide training and support?', a: 'Yes — we train your staff on-site or remotely and stay available for fixes, updates and new features after launch.' },
      ]}
    >
      <section id="work" className="relative scroll-mt-24 py-20 sm:py-28">
        <div className="container-x">
          <SectionHeader
            eyebrow="Try it — live demo"
            title={<>Go on, <span className="text-gradient">ring something up.</span></>}
            intro="A working mini-POS built for this page. Add items, charge the order and watch stock and the dashboard update. Imagine it shaped around your business."
          />
          <Reveal>
            <PosDemo />
          </Reveal>
        </div>
      </section>

      <section className="relative border-t border-white/[0.06] py-24 sm:py-32">
        <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
          <SectionHeader className="!mb-0" eyebrow="Who it's for" title={<>Built for <span className="text-white/40">businesses like yours.</span></>} intro="If you sell, book, stock or invoice anything, there's probably a few hours a week we can give back to you." />
          <div>
            <div className="flex flex-wrap gap-2">
              {INDUSTRIES.map((x, i) => (
                <Reveal key={x} delay={i * 40} className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white/75">
                  {x}
                </Reveal>
              ))}
            </div>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {[
                { icon: ScanBarcode, t: 'Barcode-ready' },
                { icon: Printer, t: 'Thermal receipts' },
                { icon: Users, t: 'Staff roles & PINs' },
              ].map((f, i) => (
                <Reveal key={f.t} delay={i * 60}>
                  <SpotlightCard className="p-5">
                    <f.icon className="h-5 w-5 text-orange-300" />
                    <p className="mt-6 text-sm font-medium">{f.t}</p>
                  </SpotlightCard>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <StepsSection
        title={<>From walkthrough <span className="text-white/40">to go-live.</span></>}
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
