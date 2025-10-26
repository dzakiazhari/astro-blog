import { Resvg } from '@resvg/resvg-js'
import { type CollectionEntry } from 'astro:content'

import { SITE } from '@/consts'

import loadGoogleFonts from './loadGoogleFont'
import postOgTemplate from './og-templates/post'
import siteOgTemplate from './og-templates/site'

function svgBufferToPngBuffer(svg: string) {
  const resvg = new Resvg(svg)
  const pngData = resvg.render()
  return pngData.asPng()
}

export async function generateOgImageForPost(post: CollectionEntry<'blog'>) {
  const fonts = await loadGoogleFonts(
    `${post.data.title}${SITE.title}${SITE.author}`,
  )
  const svg = await postOgTemplate(post, fonts)
  return svgBufferToPngBuffer(svg)
}

export async function generateOgImageForSite() {
  const fonts = await loadGoogleFonts(`${SITE.title}${SITE.description}`)
  const svg = await siteOgTemplate(fonts)
  return svgBufferToPngBuffer(svg)
}
