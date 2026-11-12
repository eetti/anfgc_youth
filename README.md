# All Nations Youth

A lightweight, responsive website for the youth community of All Nations Full Gospel Church Halifax. Built with semantic HTML, CSS, JavaScript, and Vite. No backend or externally hosted fonts required. The interactive OpenStreetMap map needs no access token.

## Local development

Use Node.js 22.12+ (validated with Node 24) and npm.

```sh
npm ci
npm run dev
```

Build and serve the production output:

```sh
npm run build
npm run preview -- --port 4173
```

## Cloudflare Pages

1. Push this project to the intended branch of `eetti/anfgc_youth`.
2. In Cloudflare, create a Pages project and connect that GitHub repository.
3. Choose the branch containing the site as the production branch. Set build command to `npm run build`, output directory to `dist`, and root directory to the repository root. Set the build environment variable `NODE_VERSION` to `24`.
4. Deploy and check the generated Pages address. Verify the mobile menu, FAQ panels, navigation, and church links.
5. Under the Pages project's **Custom domains**, add the desired subdomain (for example, `youth.anfgchalifax.com`, subject to the church's approval).
6. Follow Cloudflare's DNS instructions. If DNS is managed elsewhere, add the CNAME Cloudflare supplies at that provider after adding the domain to Pages. Avoid changing existing church website or mail records.
7. Wait for domain verification and TLS activation, then check the site over HTTPS at the chosen subdomain.

Cloudflare serves `public/_headers` from the build output to apply security headers and immutable caching to hashed assets. No Cloudflare API token is required for local development or dashboard-based deployment. This repository has not been deployed automatically.

## Content and launch review

The supplied Framer reference and church pages were blocked by the cloud environment's network policy during creation. This design is an original provisional direction, not a verified reproduction of the reference. The ministry wording is draft copy requiring church review.

Before public launch:

- Review the design against https://adriancole.framer.ai/ once accessible.
- Verify ministry details against https://www.anfgchalifax.com/ and obtain approval for the copy.
- Confirm the preferred ministry name and branding, audience ages, venue, contact method, and any approved photos. The current draft deliberately uses church links instead of unverified details or a nonfunctional contact form.
- Choose and authorize the production subdomain. Add canonical and social-sharing URLs once the actual domain is known.

## Editing

- `index.html`: page content, sections, links, and metadata.
- `src/style.css`: responsive layout, palette, and original CSS artwork.
- `src/main.js`: accessible mobile navigation and current copyright year.
- `public/`: favicon and Cloudflare response headers.

The mobile menu supports Escape and exposes its expanded state. FAQ sections use native disclosure elements. The page includes a skip link, keyboard focus styles, and reduced-motion support.

## Official social account

Instagram: https://www.instagram.com/any.hfx/ (provided by the project owner). Linked in the contact section and footer. Instagram posts are not embedded or copied.

## Meeting schedule

Saturdays, 4–6 pm (Halifax local time), provided by the project owner. Displayed in the contact section and meeting FAQ. Venue: 2010 Purcells Cove Road, Halifax, Nova Scotia.

## Color palette

User-selected Coolors palette: `#000000` (black), `#AB9865` (gold), `#DAD2BC` (sand), `#388659` (green), `#26619C` (blue). Source: https://coolors.co/000000-ab9865-dad2bc-388659-26619c

## Events

Edit `src/events.json` to add or update events. Each entry needs a unique URL-safe `slug`, `title`, `schedule`, `timezone`, `address`, `summary`, `description`, and `note`. The homepage lists these events; `npm run build` generates a separate static details page at `/events/<slug>.html`. `npm run dev` generates these pages before starting; restart it after adding new event slugs. Do not edit generated files under `events/` or `dist/`. Commit the data changes and redeploy to publish updates. Use an explicit date in `schedule` for one-off events; remove past entries when appropriate.

## Leaflet + OpenStreetMap map

No access token or environment variable is needed. On both the homepage and event pages, **Show interactive map** looks up the address using OpenStreetMap's Nominatim service and displays OpenStreetMap tiles through Leaflet. The map includes contributor attribution. Successful address lookups are cached in the browser for 30 days; requests are serialized and spaced by at least 1.1 seconds. No automatic geocoding or autocomplete requests are made.

The site needs access to `nominatim.openstreetmap.org` and `tile.openstreetmap.org`. Security headers permit only these map services. The address and directions link remain available if either service fails. Public OSM services have usage limits; review their policies and use a dedicated provider if traffic grows. For a fixed venue, verified coordinates can replace geocoding in a future update. Do not guess coordinates.

Live address lookup was blocked by the development environment's network policy during this change. Browser checks use controlled responses to verify map rendering, caching, and failure handling; they do not establish the real venue's coordinates or live tile availability.

## Design direction

The current layout adapts the user-provided screenshot of https://bio.framer.media/: compact navigation, spacious editorial typography, black introduction and community panels, a centered event listing, and a blue footer. It retains the selected palette, worship photo, event pages, and OpenStreetMap integration.
