export type Site = {
  title: string
  description: string
  href: string
  author: string
  locale: string
  homepagePostCount: number
  postsPerPage: number
  timezone: string
  scheduledPostMargin: number
  notesUrl?: string
  dynamicOgImage?: boolean
  ogImage?: string
  showDesktopTocProgress?: boolean
}

export type SocialLink = {
  href: string
  label: string
  icon?: string
}

export type IconMap = {
  [key: string]: string
}
