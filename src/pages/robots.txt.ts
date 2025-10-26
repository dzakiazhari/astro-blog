import type { APIRoute } from 'astro'

import { SITE } from '@/consts'

const getRobotsTxt = (sitemapURL: URL) => `
User-agent: *
Allow: /

Sitemap: ${sitemapURL.href}
`

export const GET: APIRoute = ({ site }) => {
  const base = site ?? SITE.href
  const sitemapURL = new URL('sitemap-index.xml', base)
  return new Response(getRobotsTxt(sitemapURL))
}
