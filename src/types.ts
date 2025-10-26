export type Site = {
  title: string
  description: string
  href: string
  author: string
  locale: string
  featuredPostCount: number
  postsPerPage: number
  timezone: string
  scheduledPostMargin: number
  notesUrl?: string
  showArchives?: boolean
  dynamicOgImage?: boolean
  ogImage?: string
}

export type SocialLink = {
  href: string
  label: string
}

export type IconMap = {
  [key: string]: string
}
