import { SITE } from '@/lib/site';

const abs = (p: string) => (p.startsWith('http') ? p : `${SITE.url}${p}`);

export const organizationLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  '@id': `${SITE.url}/#organization`,
  name: SITE.name,
  alternateName: 'sevIT',
  url: SITE.url,
  logo: `${SITE.url}/images/sevIT_horizontal_logo_transparent.png`,
  image: `${SITE.url}/og-image.png`,
  email: SITE.email,
  telephone: SITE.phone,
  address: { '@type': 'PostalAddress', addressCountry: 'LK' },
  areaServed: ['LK', 'Worldwide'],
  sameAs: [SITE.instagram],
  knowsAbout: [
    'Web design',
    'Web development',
    'POS systems',
    'Custom business software',
    'AI automation',
    '3D product rendering',
    'Branding',
    'Digital advertising',
    'SEO',
  ],
};

export const serviceLd = (name: string, path: string, description: string) => ({
  '@context': 'https://schema.org',
  '@type': 'Service',
  name,
  description,
  url: abs(path),
  provider: { '@id': `${SITE.url}/#organization` },
  areaServed: ['LK', 'Worldwide'],
});

export const faqLd = (faqs: { q: string; a: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
});
