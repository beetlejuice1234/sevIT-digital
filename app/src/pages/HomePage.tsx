import Seo from '@/components/Seo';
import { organizationLd } from '@/seo/schema';
import Hero from '@/components/home/Hero';
import ServicesBento from '@/components/home/ServicesBento';
import SelectedWork from '@/components/home/SelectedWork';
import { Studio, Process, Testimonials, AITeaser } from '@/components/home/HomeSections';
import ContactSection from '@/components/layout/ContactSection';
import { SITE } from '@/lib/site';

export default function HomePage() {
  return (
    <>
      <Seo
        path="/"
        jsonLd={[
          organizationLd,
          {
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: SITE.name,
            url: SITE.url,
            publisher: { '@id': `${SITE.url}/#organization` },
          },
        ]}
      />
      <Hero />
      <ServicesBento />
      <SelectedWork />
      <Studio />
      <Process />
      <Testimonials />
      <AITeaser />
      <ContactSection />
    </>
  );
}
