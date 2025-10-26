import { readFile } from 'node:fs/promises'
import { createRequire } from 'node:module'

class GoogleFontsResponseError extends Error {
  status: number

  constructor(baseMessage: string, status: number) {
    super(`${baseMessage}. Status: ${status}`)
    this.name = 'GoogleFontsResponseError'
    this.status = status
  }
}

const require = createRequire(import.meta.url)

async function loadGoogleFonts(
  text: string,
): Promise<
  Array<{ name: string; data: ArrayBuffer; weight: number; style: string }>
> {
  const fontsConfig = [
    {
      name: 'IBM Plex Mono',
      weight: 400,
      style: 'normal' as const,
    },
    {
      name: 'IBM Plex Mono',
      weight: 700,
      style: 'bold' as const,
    },
  ]

  const weights = fontsConfig.map((item) => item.weight)

  try {
    const fontFaceMapPromise = getFontFaceMap(text, weights)

    const results = await Promise.all(
      fontsConfig.map(async ({ name, weight, style }) => {
        const fontFaceMap = await fontFaceMapPromise
        const source = fontFaceMap.get(weight)

        if (!source) {
          throw new Error(`Font source missing for weight ${weight}`)
        }

        const data = await fetchFontBuffer(source.url)

        return { name, data, weight, style }
      }),
    )

    return results
  } catch (error) {
    if (isNetworkError(error) || error instanceof GoogleFontsResponseError) {
      return Promise.all(
        fontsConfig.map(async ({ name, weight, style }) => {
          const data = await loadLocalFont(weight)

          return { name, data, weight, style }
        }),
      )
    }

    throw error
  }
}

export default loadGoogleFonts

export function __resetFontCaches() {
  fontFaceCache.clear()
  fontBufferCache.clear()
  localFontCache.clear()
}

const GOOGLE_FONTS_ENDPOINT = 'https://fonts.googleapis.com/css2'
const USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
const MAX_TEXT_LENGTH = 200

const fontFaceCache = new Map<
  string,
  Promise<Map<number, { style: string; url: string }>>
>()
const fontBufferCache = new Map<string, Promise<ArrayBuffer>>()
const localFontCache = new Map<number, Promise<ArrayBuffer>>()

const LOCAL_FONT_PATHS: Record<number, string> = {
  400: '@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-400-normal.woff',
  700: '@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-700-normal.woff',
}

function normaliseText(input: string) {
  if (!input) {
    return ''
  }

  const unique: string[] = []
  const seen = new Set<string>()

  for (const char of Array.from(input.normalize('NFC'))) {
    if (seen.has(char)) {
      continue
    }

    seen.add(char)
    unique.push(char)

    if (unique.length >= MAX_TEXT_LENGTH) {
      break
    }
  }

  return unique.join('')
}

function buildRequestConfig(text: string, weights: number[]) {
  const params = new URLSearchParams({
    family: `IBM+Plex+Mono:wght@${weights.join(';')}`,
    display: 'swap',
  })

  const normalised = normaliseText(text)

  if (normalised) {
    params.set('text', normalised)
  }

  return {
    url: `${GOOGLE_FONTS_ENDPOINT}?${params.toString()}`,
    headers: {
      'User-Agent': USER_AGENT,
      Accept: 'text/css,*/*;q=0.1',
    },
  }
}

function stripQuotes(value: string) {
  return value.replace(/^['"]|['"]$/g, '')
}

async function getFontFaceMap(text: string, weights: number[]) {
  const cacheKey = `${weights.join(',')}::${text}`
  const cached = fontFaceCache.get(cacheKey)

  if (cached) {
    return cached
  }

  const promise = (async () => {
    const { url, headers } = buildRequestConfig(text, weights)
    const response = await fetch(url, { headers })

    if (!response.ok) {
      throw new GoogleFontsResponseError(
        'Failed to download Google Fonts stylesheet',
        response.status,
      )
    }

    const css = await response.text()
    const blocks = css
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .split('@font-face')
      .map((block) => block.trim())
      .filter(Boolean)

    const fontFaceMap = new Map<number, { style: string; url: string }>()

    for (const block of blocks) {
      const weightMatch = block.match(/font-weight:\s*(\d+)/)
      const styleMatch = block.match(/font-style:\s*([^;]+)/)

      if (!weightMatch || !styleMatch) {
        continue
      }

      const weight = Number.parseInt(weightMatch[1], 10)

      if (!weights.includes(weight) || fontFaceMap.has(weight)) {
        continue
      }

      const srcMatches = [
        ...block.matchAll(/url\(([^)]+)\)\s*format\('([^']+)'\)/g),
      ]

      if (srcMatches.length === 0) {
        continue
      }

      const woffMatch = srcMatches.find(([, , format]) => format === 'woff')
      const opentypeMatch = srcMatches.find(
        ([, , format]) => format === 'opentype' || format === 'truetype',
      )
      const woff2Match = srcMatches.find(([, , format]) => format === 'woff2')
      const chosen = woff2Match ?? woffMatch ?? opentypeMatch ?? srcMatches[0]
      const url = stripQuotes(chosen[1])

      fontFaceMap.set(weight, { style: styleMatch[1], url })
    }

    if (fontFaceMap.size === 0) {
      throw new Error('Failed to parse font sources from Google Fonts CSS')
    }

    return fontFaceMap
  })()

  fontFaceCache.set(cacheKey, promise)
  try {
    return await promise
  } catch (error) {
    fontFaceCache.delete(cacheKey)
    throw error
  }
}

async function fetchFontBuffer(url: string) {
  const cached = fontBufferCache.get(url)

  if (cached) {
    return cached
  }

  const promise = (async () => {
    const response = await fetch(url)

    if (!response.ok) {
      throw new GoogleFontsResponseError(
        'Failed to download font binary',
        response.status,
      )
    }

    return response.arrayBuffer()
  })()

  fontBufferCache.set(url, promise)

  try {
    return await promise
  } catch (error) {
    fontBufferCache.delete(url)
    throw error
  }
}

async function loadLocalFont(weight: number) {
  const cached = localFontCache.get(weight)

  if (cached) {
    return cached
  }

  const path = LOCAL_FONT_PATHS[weight]

  if (!path) {
    throw new Error(`No local fallback configured for weight ${weight}`)
  }

  const promise = readFile(require.resolve(path)).then((buffer) => {
    const view = buffer.buffer.slice(
      buffer.byteOffset,
      buffer.byteOffset + buffer.byteLength,
    )

    return view as ArrayBuffer
  })

  localFontCache.set(weight, promise)

  try {
    return await promise
  } catch (error) {
    localFontCache.delete(weight)
    throw error
  }
}

function isNetworkError(error: unknown) {
  if (!(error instanceof Error)) {
    return false
  }

  if (error.message.includes('fetch failed')) {
    return true
  }

  const cause = (error as { cause?: unknown }).cause

  if (cause && typeof cause === 'object') {
    const code = (cause as { code?: unknown }).code

    if (typeof code === 'string' && code.startsWith('ENET')) {
      return true
    }
  }

  return false
}
