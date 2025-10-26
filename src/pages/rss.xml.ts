import { SITE } from '@/consts'
import rss from '@astrojs/rss'
import type { APIContext } from 'astro'

import { getAllPosts, getPublishDate } from '@/lib/data-utils'

export async function GET(context: APIContext) {
  const posts = await getAllPosts()

  return rss({
    title: SITE.title,
    description: SITE.description,
    site: context.site ?? SITE.href,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: getPublishDate(post),
      link: `/posts/${post.id}/`,
    })),
  })
}
