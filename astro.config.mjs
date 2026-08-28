// @ts-check
import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';

// Single source of truth for the domain and every other site constant.
// Editing SITE_URL in site.config.mjs propagates to canonical, og:url,
// og:image, JSON-LD, and the generated sitemap. The only place that still
// needs a manual edit is the `Sitemap:` line in public/robots.txt.
import { SITE_URL } from './site.config.mjs';

// https://astro.build/config
export default defineConfig({
  site: SITE_URL,
  integrations: [sitemap()],
});
