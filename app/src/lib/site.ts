import {
  Globe,
  Receipt,
  Bot,
  Box,
  PenTool,
  Megaphone,
  TrendingUp,
  type LucideIcon,
} from 'lucide-react';

export const SITE = {
  name: 'sevIT Digital',
  short: 'sevIT',
  url: 'https://sevitdigital.com',
  email: 'sevit@sevitdigital.com',
  phoneDisplay: '+94 76 110 7081',
  phone: '+94761107081',
  whatsapp: 'https://wa.me/94761107081',
  instagram: 'https://www.instagram.com/sevitdigital',
  location: 'Sri Lanka',
} as const;

export const waLink = (text: string) => `${SITE.whatsapp}?text=${encodeURIComponent(text)}`;

export type Service = {
  slug: string;
  path: string;
  name: string;
  short: string;
  blurb: string;
  icon: LucideIcon;
  image: string;
  tags: string[];
};

export const SERVICES: Service[] = [
  {
    slug: 'web-design',
    path: '/services/web-design',
    name: 'Web Design & Development',
    short: 'Websites',
    blurb: 'Fast, search-ready websites and web apps that turn visitors into customers.',
    icon: Globe,
    image: '/images/renders/sm/clickzone.webp',
    tags: ['React', 'E-commerce', 'SEO'],
  },
  {
    slug: 'software-pos',
    path: '/services/software-pos',
    name: 'Software & POS Systems',
    short: 'Software & POS',
    blurb: 'Point-of-sale, billing, inventory and custom business software built around how you work.',
    icon: Receipt,
    image: '',
    tags: ['POS', 'Inventory', 'Dashboards'],
  },
  {
    slug: 'ai-solutions',
    path: '/services/ai-solutions',
    name: 'AI & Automation',
    short: 'AI Solutions',
    blurb: 'Chatbots, assistants and automations that take repetitive work off your plate.',
    icon: Bot,
    image: '',
    tags: ['Chatbots', 'Workflows', 'Agents'],
  },
  {
    slug: '3d-rendering',
    path: '/services/3d-rendering',
    name: '3D Render & Virtual Ads',
    short: '3D & Virtual Ads',
    blurb: 'Photoreal product visuals and ad films, no camera crew, no studio hire.',
    icon: Box,
    image: '/images/renders/sm/saraperf.webp',
    tags: ['Product', 'Motion', 'CGI'],
  },
  {
    slug: 'branding',
    path: '/services/branding',
    name: 'Branding & Identity',
    short: 'Branding',
    blurb: 'Logos and identity systems that make you recognisable everywhere.',
    icon: PenTool,
    image: '/images/3dlogo.webp',
    tags: ['Logo', 'Guidelines', 'Packaging'],
  },
  {
    slug: 'advertising',
    path: '/services/advertising',
    name: 'Advertising',
    short: 'Advertising',
    blurb: 'Social and search campaigns with creative people actually stop for.',
    icon: Megaphone,
    image: '/images/video/chocolate.webp',
    tags: ['Meta', 'TikTok', 'Google'],
  },
  {
    slug: 'marketing',
    path: '/services/marketing',
    name: 'Growth Marketing',
    short: 'Marketing & SEO',
    blurb: 'SEO, conversion and email work that compounds month after month.',
    icon: TrendingUp,
    image: '',
    tags: ['SEO', 'CRO', 'Email'],
  },
];

export const serviceBySlug = (slug: string) => SERVICES.find((s) => s.slug === slug)!;

export const TESTIMONIALS = [
  {
    name: 'Akash Kavisekara',
    role: 'Owner, Clickzone Mobiles',
    quote:
      "sevIT completely transformed our mobile store's online presence. The new website and targeted ad campaigns brought in customers we'd never reached before. Our sales jumped within the first two months.",
  },
  {
    name: 'Sathira Dewmina',
    role: 'Founder, Threesara',
    quote:
      'Working with sevIT was seamless from start to finish. The branding captures our identity perfectly, and the website has become our strongest marketing tool.',
  },
  {
    name: 'Eshan',
    role: 'Gym Owner, Kandy',
    quote:
      'They built us a professional website and handled our social campaigns. Membership sign-ups have doubled since launch, and the 3D visuals for our promotions look next level.',
  },
  {
    name: 'Sajeewani Amarasinghe',
    role: 'Salon Owner, Kandy',
    quote:
      'The new website and Instagram campaigns brought in so many new clients. Bookings improved dramatically and everything looks exactly how I imagined.',
  },
];
