import type { IconMap, SocialLink, Site } from '@/types'

export const SITE: Site = {
  title: 'Unfold',
  description:
    'Thoughts, stories and ideas. A blog by Dzaki Azhari. Unfold a world of insights and growth on the blog.',
  href: 'https://dzakiazhari.com/',
  author: 'Dzaki Azhari',
  locale: 'en-US',
  homepagePostCount: 3,
  postsPerPage: 4,
  timezone: 'Asia/Tokyo',
  scheduledPostMargin: 15 * 60 * 1000,
  notesUrl: 'https://notes.dzakiazhari.com',
  dynamicOgImage: true,
  ogImage: '/astropaper-og.jpg',
  showDesktopTocProgress: false,
}

const baseNavLinks: SocialLink[] = [
  { href: '/posts', label: 'posts' },
  { href: '/tags', label: 'tags' },
  { href: '/about', label: 'about' },
]

if (SITE.notesUrl) {
  baseNavLinks.push({
    href: SITE.notesUrl,
    label: 'notes',
    icon: 'lucide:sticky-note',
  })
}

export const NAV_LINKS: SocialLink[] = baseNavLinks

export const SOCIAL_LINKS: SocialLink[] = [
  {
    href: 'https://github.com/dzakiazhari',
    label: 'GitHub',
  },
  {
    href: 'https://www.linkedin.com/in/dzakiazhari/',
    label: 'LinkedIn',
  },
  {
    href: '/rss.xml',
    label: 'RSS',
  },
]

export const ICON_MAP: IconMap = {
  Website: 'lucide:globe',
  GitHub: 'lucide:github',
  LinkedIn: 'lucide:linkedin',
  Twitter: 'lucide:twitter',
  RSS: 'lucide:rss',
}
