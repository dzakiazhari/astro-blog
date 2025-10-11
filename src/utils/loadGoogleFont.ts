async function loadGoogleFonts(
  text: string
): Promise<
  Array<{ name: string; data: ArrayBuffer; weight: number; style: string }>
> {
  const fontsConfig = [
    {
      name: "IBM Plex Mono",
      weight: 400,
      style: "normal" as const,
    },
    {
      name: "IBM Plex Mono",
      weight: 700,
      style: "bold" as const,
    },
  ];

  const weights = fontsConfig.map(item => item.weight);
  const fontFaceMapPromise = getFontFaceMap(text, weights);

  const results = await Promise.all(
    fontsConfig.map(async ({ name, weight, style }) => {
      const fontFaceMap = await fontFaceMapPromise;
      const source = fontFaceMap.get(weight);

      if (!source) {
        throw new Error(`Font source missing for weight ${weight}`);
      }

      const data = await fetchFontBuffer(source.url);

      return { name, data, weight, style };
    })
  );

  return results;
}

export default loadGoogleFonts;

export function __resetFontCaches() {
  fontFaceCache.clear();
  fontBufferCache.clear();
}

const GOOGLE_FONTS_ENDPOINT = "https://fonts.googleapis.com/css2";
const USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

const fontFaceCache = new Map<
  string,
  Promise<Map<number, { style: string; url: string }>>
>();
const fontBufferCache = new Map<string, Promise<ArrayBuffer>>();

function buildRequestUrl(text: string, weights: number[]) {
  const params = new URLSearchParams({
    family: `IBM+Plex+Mono:wght@${weights.join(";")}`,
    text,
    display: "swap",
    subset: "latin",
  });

  return `${GOOGLE_FONTS_ENDPOINT}?${params.toString()}`;
}

function stripQuotes(url: string) {
  return url.replace(/^['"]|['"]$/g, "");
}

async function getFontFaceMap(text: string, weights: number[]) {
  const cacheKey = `${text}:${weights.join(",")}`;
  const cached = fontFaceCache.get(cacheKey);

  if (cached) {
    return cached;
  }

  const promise = (async () => {
    const response = await fetch(buildRequestUrl(text, weights), {
      headers: {
        "User-Agent": USER_AGENT,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to download font CSS. Status: ${response.status}`
      );
    }

    const css = await response.text();
    const fontFaceMap = new Map<number, { style: string; url: string }>();

    const blockRegex = /@font-face\s*{([^}]+)}/g;
    let match: RegExpExecArray | null;

    while ((match = blockRegex.exec(css))) {
      const block = match[1];
      const weightMatch = block.match(/font-weight:\s*(\d+)/);
      const styleMatch = block.match(/font-style:\s*([a-zA-Z]+)/);

      if (!weightMatch || !styleMatch) {
        continue;
      }

      const weight = Number.parseInt(weightMatch[1], 10);

      if (!weights.includes(weight) || fontFaceMap.has(weight)) {
        continue;
      }

      const srcMatches = [
        ...block.matchAll(/url\(([^)]+)\)\s*format\('([^']+)'\)/g),
      ];

      if (srcMatches.length === 0) {
        continue;
      }

      const woff2Match = srcMatches.find(([, , format]) => format === "woff2");
      const chosen = woff2Match ?? srcMatches[0];
      const url = stripQuotes(chosen[1]);

      fontFaceMap.set(weight, { style: styleMatch[1], url });
    }

    if (fontFaceMap.size === 0) {
      throw new Error("Failed to parse font sources from Google Fonts CSS");
    }

    return fontFaceMap;
  })();

  fontFaceCache.set(cacheKey, promise);
  try {
    return await promise;
  } catch (error) {
    fontFaceCache.delete(cacheKey);
    throw error;
  }
}

async function fetchFontBuffer(url: string) {
  const cached = fontBufferCache.get(url);

  if (cached) {
    return cached;
  }

  const promise = (async () => {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `Failed to download font binary. Status: ${response.status}`
      );
    }

    return response.arrayBuffer();
  })();

  fontBufferCache.set(url, promise);

  try {
    return await promise;
  } catch (error) {
    fontBufferCache.delete(url);
    throw error;
  }
}
