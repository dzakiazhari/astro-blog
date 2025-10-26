import type { APIRoute } from 'astro'
import { getAllPostsAndSubposts } from '@/lib/data-utils'

export async function getStaticPaths() {
  const posts = await getAllPostsAndSubposts()
  return posts.map((post) => ({
    params: { id: post.id },
    props: { body: post.body ?? '' },
  }))
}

export const GET: APIRoute = async ({ props }) => {
  const body = (props?.body as string) ?? ''

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Content-Disposition': 'inline',
    },
  })
}
