// @ts-check
import { defineConfig, passthroughImageService } from 'astro/config';

import sitemap from '@astrojs/sitemap';

// Single source of truth for the domain and every other site constant.
// Editing SITE_URL in site.config.mjs propagates to canonical, og:url,
// og:image, JSON-LD, and the generated sitemap. The only place that still
// needs a manual edit is the `Sitemap:` line in public/robots.txt.
import { SITE_URL } from './site.config.mjs';

// https://astro.build/config
export default defineConfig({
  site: SITE_URL,
  // Thai is the default locale AND the fallback, and `prefixDefaultLocale:
  // false` is what keeps every existing Thai URL exactly where it was: the
  // Thai edition stays at the site root and only English gains the /en/
  // prefix. Changing this flag would move every Thai page and break every
  // link that already points at the site.
  i18n: {
    defaultLocale: 'th',
    locales: ['th', 'en'],
    routing: { prefixDefaultLocale: false },
  },
  image: {
    service: passthroughImageService(),
  },
  // The sitemap integration takes its locales as a MAP of path segment to
  // language tag, which is a different shape from the string array above.
  // With it, @astrojs/sitemap emits xhtml:link alternates for each URL so a
  // crawler sees the Thai and English versions as one page in two languages.
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'th',
        locales: { th: 'th-TH', en: 'en-US' },
      },
    }),
  ],
});
