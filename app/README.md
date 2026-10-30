# sevIT Digital — website

Marketing site for [sevitdigital.com](https://sevitdigital.com): a Vite + React 19 + TypeScript + Tailwind single-page app deployed on Vercel.

## Run it

```bash
cd app
npm install
npm run dev        # http://localhost:3000
npm run dev:all    # also starts local-server.js so /api/ai and /api/tts work locally (needs .env)
npm run build      # type-check, build, then scripts/postbuild.mjs
npm run preview
```

## How it's put together

| Path | What lives there |
|---|---|
| `src/lib/site.ts` | Company details (email, WhatsApp, socials), the list of services and testimonials. **Edit copy/contacts here first.** |
| `src/seo/routes.json` | Title + description for every route. Used by `<Seo>` at runtime *and* by the build script. |
| `src/seo/schema.ts` | JSON-LD helpers (Organization, Service, FAQ). |
| `src/components/kit/` | Shared UI: `Reveal`, `SectionHeader`, `SpotlightCard`, `Marquee`, `ButtonLink`, frames, `ShaderBackdrop` (WebGL hero), `VideoCard`. |
| `src/components/layout/` | Navbar (with services mega menu), Footer, ContactSection (enquiry form → WhatsApp/email), floating WhatsApp button. |
| `src/components/home/` | Home page sections. |
| `src/components/service/ServiceLayout.tsx` | Template every service page uses: hero, offerings, FAQ (+FAQ schema), related services, contact. |
| `src/pages/services/*` | One file per service, each with its own showcase (POS demo, render gallery, sevAI chat, etc.). |
| `api/` | Vercel functions: `ai.js` (Groq chat for sevAI, needs `GROQ_API_KEY`) and `tts.js` (ElevenLabs voice). |
| `scripts/postbuild.mjs` | Writes `dist/<route>/index.html` with route-specific meta so link previews and crawlers see the right title/description, and generates `sitemap.xml`. |

### Adding a page

1. Add the route to `src/seo/routes.json`.
2. Add the `<Route>` in `src/App.tsx`.
3. If it's a service, add it to `SERVICES` in `src/lib/site.ts` (nav, footer, home bento and the contact form pick it up automatically).

### Routing

Clean URLs (`/services/web-design`) via `BrowserRouter`; `vercel.json` rewrites unknown paths to `index.html`. Old `/#/…` links are redirected to the clean path in `src/main.tsx`.

### Media

- Full-size renders live in `public/images/renders/`; 720px versions used in grids are in `public/images/renders/sm/`.
- Videos are web-optimised MP4s in `public/images/video/` (with `.webp` posters).
