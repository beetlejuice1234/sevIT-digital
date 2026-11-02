import { Helmet } from 'react-helmet-async';
import seo from '@/seo/routes.json';
import { SITE } from '@/lib/site';

type Crumb = { name: string; path: string };

type SeoProps = {
  path: string;
  title?: string;
  description?: string;
  image?: string;
  noindex?: boolean;
  breadcrumbs?: Crumb[];
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
};

const abs = (p: string) => (p.startsWith('http') ? p : `${seo.siteUrl}${p}`);

/**
 * Per-route <head> tags. Defaults come from src/seo/routes.json, which is also
 * used at build time to write static meta for each route (scripts/postbuild.mjs).
 */
export default function Seo({ path, title, description, image, noindex, breadcrumbs, jsonLd }: SeoProps) {
  const route = seo.routes.find((r) => r.path === path);
  const t = title ?? route?.title ?? seo.siteName;
  const d = description ?? route?.description ?? '';
  const img = abs(image ?? seo.defaultImage);
  const url = abs(path);

  const blocks: Record<string, unknown>[] = [];
  if (breadcrumbs?.length) {
    blocks.push({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [{ name: 'Home', path: '/' }, ...breadcrumbs].map((c, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: c.name,
        item: abs(c.path),
      })),
    });
  }
  if (jsonLd) blocks.push(...(Array.isArray(jsonLd) ? jsonLd : [jsonLd]));

  return (
    <Helmet>
      <title>{t}</title>
      <meta name="description" content={d} />
      <link rel="canonical" href={url} />
      {noindex && <meta name="robots" content="noindex, follow" />}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE.name} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={t} />
      <meta property="og:description" content={d} />
      <meta property="og:image" content={img} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={t} />
      <meta name="twitter:description" content={d} />
      <meta name="twitter:image" content={img} />
      {blocks.map((b, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(b)}
        </script>
      ))}
    </Helmet>
  );
}
