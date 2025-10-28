import type { APIRoute } from 'astro'
import { getAllPostsAndSubposts } from '@/lib/data-utils'

type MarkdownProps = {
  body?: string
  title?: string
  id?: string
  slug?: string
}

const toSafeFileName = (props: MarkdownProps): string => {
  const candidates = [
    props.title,
    props.slug?.split('/').pop(),
    props.id?.split('/').pop(),
  ].filter((value): value is string => Boolean(value && value.length > 0))

  const raw = candidates[0] ?? 'post'

  const sanitized = raw
    .normalize('NFKD')
    .replace(/[^\w\s-]+/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .toLowerCase()

  const fileName = sanitized.length > 0 ? sanitized : 'post'

  return `${fileName}.md`
}

export async function getStaticPaths() {
  const posts = await getAllPostsAndSubposts()
  return posts.map((post) => ({
    params: { id: post.id },
    props: {
      body: post.body ?? '',
      title: post.data.title ?? '',
      id: post.id,
      slug: post.slug ?? '',
    },
  }))
}

export const GET: APIRoute = async ({ props }) => {
  const markdownProps = (props ?? {}) as MarkdownProps
  const body = markdownProps.body ?? ''
  const fileName = toSafeFileName(markdownProps)

  return new Response(body, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Content-Disposition': `inline; filename="${fileName}"; filename*=UTF-8''${encodeURIComponent(fileName)}`,
    },
  })
}
