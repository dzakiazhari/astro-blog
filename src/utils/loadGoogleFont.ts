import { Buffer } from "node:buffer";

import { IBM_PLEX_MONO_BASE64 } from "@/assets/fonts/ibmPlexMonoBase64";

const FONT_CONFIG = [
  {
    name: "IBM Plex Mono",
    googleId: "IBM+Plex+Mono",
    weight: 400,
    style: "normal",
  },
  {
    name: "IBM Plex Mono",
    googleId: "IBM+Plex+Mono",
    weight: 700,
    style: "bold",
  },
] as const;

type FontConfig = (typeof FONT_CONFIG)[number];

type LoadedFont = {
  name: string;
  data: ArrayBuffer;
  weight: number;
  style: string;
};

const fontDataCache = new Map<string, Promise<ArrayBuffer>>();

const decodeEmbeddedFont = (weight: number) => {
  const cacheKey = `embedded:${weight}`;
  const existing = fontDataCache.get(cacheKey);
  if (existing) {
    return existing;
  }

  const loader = (async () => {
    const base64 = IBM_PLEX_MONO_BASE64[weight as keyof typeof IBM_PLEX_MONO_BASE64];

    if (!base64) {
      throw new Error("Embedded font payload missing");
    }

    const buffer = Buffer.from(base64, "base64");
    return buffer.buffer.slice(
      buffer.byteOffset,
      buffer.byteOffset + buffer.byteLength
    ) as ArrayBuffer;
  })();

  fontDataCache.set(cacheKey, loader);
  return loader;
};

const fetchFontSubset = (font: string, text: string, weight: number) => {
  const cacheKey = `remote:${font}:${weight}:${text}`;
  const existing = fontDataCache.get(cacheKey);
  if (existing) {
    return existing;
  }

  const loader = (async () => {
    const API = `https://fonts.googleapis.com/css2?family=${font}:wght@${weight}&text=${encodeURIComponent(text)}`;

    const cssResponse = await fetch(API, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; de-at) AppleWebKit/533.21.1 (KHTML, like Gecko) Version/5.0.5 Safari/533.21.1",
      },
    });

    if (!cssResponse.ok) {
      throw new Error(`Failed to download dynamic font CSS. Status: ${cssResponse.status}`);
    }

    const css = await cssResponse.text();
    const resource = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/);

    if (!resource) {
      throw new Error("Failed to locate downloadable font source");
    }

    const fontResponse = await fetch(resource[1]);

    if (!fontResponse.ok) {
      throw new Error(`Failed to download dynamic font. Status: ${fontResponse.status}`);
    }

    return fontResponse.arrayBuffer();
  })();

  fontDataCache.set(cacheKey, loader);
  return loader;
};

const resolveFont = async (config: FontConfig, text: string): Promise<LoadedFont | null> => {
  try {
    const data = await decodeEmbeddedFont(config.weight);
    return {
      name: config.name,
      data,
      weight: config.weight,
      style: config.style,
    } satisfies LoadedFont;
  } catch {
    try {
      const data = await fetchFontSubset(config.googleId, text, config.weight);
      return {
        name: config.name,
        data,
        weight: config.weight,
        style: config.style,
      } satisfies LoadedFont;
    } catch {
      return null;
    }
  }
};

async function loadGoogleFonts(text: string): Promise<LoadedFont[]> {
  const fonts = await Promise.all(
    FONT_CONFIG.map(config => resolveFont(config, text))
  );

  return fonts.filter((font): font is LoadedFont => font !== null);
}

export default loadGoogleFonts;
