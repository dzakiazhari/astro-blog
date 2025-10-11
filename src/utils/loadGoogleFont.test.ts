import test from "node:test";
import assert from "node:assert/strict";

import loadGoogleFonts, { __resetFontCaches } from "./loadGoogleFont";

const FONT_API = "https://fonts.googleapis.com/css2";

function getUrl(input: RequestInfo | URL) {
  if (typeof input === "string") return input;
  if (input instanceof URL) return input.toString();
  return input.url;
}

test("requests a single CSS payload for both weights and caches responses", async () => {
  __resetFontCaches();

  const originalFetch = globalThis.fetch;
  const cssCalls: string[] = [];
  const binaryCalls: string[] = [];

  const woff2Regular = Uint8Array.from([1, 2, 3, 4]);
  const woff2Bold = Uint8Array.from([5, 6, 7, 8]);

  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = getUrl(input);

    if (url.startsWith(FONT_API)) {
      cssCalls.push(url);

      const search = new URL(url).searchParams;
      assert.equal(
        search.get("family"),
        "IBM+Plex+Mono:wght@400;700",
        "family query should request both weights"
      );
      assert.equal(search.get("display"), "swap");
      assert.equal(search.get("subset"), "latin");
      assert.equal(search.get("text"), "Astro Blog");

      const headers = new Headers(init?.headers);
      assert.equal(
        headers.get("User-Agent"),
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
      );

      return new Response(
        "" +
          "@font-face { font-family: 'IBM Plex Mono'; font-style: normal; font-weight: 400; src: url('https://example.test/ibm-regular.woff2') format('woff2'); }" +
          "@font-face { font-family: 'IBM Plex Mono'; font-style: bold; font-weight: 700; src: url('https://example.test/ibm-bold.woff2') format('woff2'); }"
      );
    }

    if (url === "https://example.test/ibm-regular.woff2") {
      binaryCalls.push(url);
      return new Response(woff2Regular.slice(), {
        headers: { "content-type": "font/woff2" },
      });
    }

    if (url === "https://example.test/ibm-bold.woff2") {
      binaryCalls.push(url);
      return new Response(woff2Bold.slice(), {
        headers: { "content-type": "font/woff2" },
      });
    }

    throw new Error(`Unexpected fetch for ${url}`);
  }) as typeof globalThis.fetch;

  try {
    const first = await loadGoogleFonts("Astro Blog");
    const second = await loadGoogleFonts("Astro Blog");

    assert.equal(first.length, 2);
    assert.equal(second.length, 2);
    assert.equal(cssCalls.length, 1, "CSS request should be deduplicated");
    assert.equal(binaryCalls.length, 2, "Each weight fetches once");

    for (const font of first) {
      const repeat = second.find(item => item.weight === font.weight);
      assert.ok(repeat, "fonts should be cached by weight");
      assert.equal(font.data, repeat.data);
    }

    const regular = first.find(font => font.weight === 400);
    const bold = first.find(font => font.weight === 700);

    assert.equal(regular?.style, "normal");
    assert.equal(bold?.style, "bold");
    assert.equal(regular?.data.byteLength, woff2Regular.byteLength);
    assert.equal(bold?.data.byteLength, woff2Bold.byteLength);
  } finally {
    globalThis.fetch = originalFetch;
    __resetFontCaches();
  }
});

test("throws when Google Fonts CSS omits downloadable sources", async () => {
  __resetFontCaches();

  const originalFetch = globalThis.fetch;

  globalThis.fetch = (async (input: RequestInfo | URL) => {
    const url = getUrl(input);

    if (url.startsWith(FONT_API)) {
      return new Response(
        "@font-face { font-family: 'IBM Plex Mono'; font-style: normal; font-weight: 400; }"
      );
    }

    throw new Error(`Unexpected request for ${url}`);
  }) as typeof globalThis.fetch;

  await assert.rejects(() => loadGoogleFonts("Astro Blog"), {
    message: /Failed to parse font sources/,
  });

  globalThis.fetch = originalFetch;
  __resetFontCaches();
});
