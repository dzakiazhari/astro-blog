import type { APIRoute } from 'astro'
import type { CollectionEntry } from 'astro:content'

import { SITE } from '@/consts'
import { getAllPostsAndSubposts } from '@/lib/data-utils'
import { generateOgImageForPost } from '@/lib/generateOgImages'

export async function getStaticPaths() {
  if (!SITE.dynamicOgImage) {
    return []
  }

  const posts = await getAllPostsAndSubposts()
  return posts
    .filter((post) => !post.data.ogImage)
    .map((post) => ({
      params: { id: post.id },
      props: post,
    }))
}

export const GET: APIRoute = async ({ props }) => {
  if (!SITE.dynamicOgImage || !props) {
    return new Response(null, {
      status: 404,
      statusText: 'Not found',
    })
  }

  const post = props as CollectionEntry<'blog'>
  const buffer = await generateOgImageForPost(post)
  return new Response(new Uint8Array(buffer), {
    headers: { 'Content-Type': 'image/png' },
  })
}
