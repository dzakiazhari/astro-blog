/* eslint-disable no-console */

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = fileURLToPath(new URL("../..", import.meta.url));
const distDir = join(rootDir, "dist");

if (!existsSync(distDir)) {
  console.error("dist/ directory not found. Run `pnpm run build` before collecting metrics.");
  process.exit(1);
}

function collectHtmlFiles(dir, bucket) {
  const entries = readdirSync(dir);

  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const stats = statSync(fullPath);

    if (stats.isDirectory()) {
      collectHtmlFiles(fullPath, bucket);
    } else if (stats.isFile() && entry.endsWith(".html")) {
      bucket.push(fullPath);
    }
  }

  return bucket;
}

const allHtmlFiles = collectHtmlFiles(distDir, []).sort((a, b) => a.localeCompare(b));
const relativeHtml = allHtmlFiles.map(file => relative(distDir, file));

const prioritizedMatchers = [
  path => path === "index.html",
  path => path === "posts/index.html",
  path => path === "tags/index.html",
  path => path === "archives/index.html",
  path => /^posts\/\d{4}\/[^/]+\/index\.html$/.test(path),
];

const sampledRelative = [];

function selectPath(predicate) {
  const match = relativeHtml.find(predicate);

  if (match && !sampledRelative.includes(match)) {
    sampledRelative.push(match);
  }
}

for (const matcher of prioritizedMatchers) {
  selectPath(matcher);
}

for (const path of relativeHtml) {
  if (sampledRelative.length >= 5) {
    break;
  }

  if (!sampledRelative.includes(path)) {
    sampledRelative.push(path);
  }
}

const sampled = sampledRelative.map(path => join(distDir, path));

if (sampled.length < 5) {
  console.warn(`Only found ${sampled.length} HTML files. Metrics will use the available files.`);
}

const rows = sampled.map(file => {
  const contents = readFileSync(file, "utf8");
  const anchorMatches = contents.match(/<a\b/gi) ?? [];
  const attrMatches = [
    ...contents.matchAll(/data-astro-prefetch(?:=(?:\"([^\"]*)\"|'([^']*)'|([^\s>]+)))?/gi),
  ];

  const enabledPrefetch = attrMatches.filter(match => {
    const raw = match[1] ?? match[2] ?? match[3] ?? "";
    const value = raw.trim().toLowerCase();

    return value !== "false";
  }).length;

  return {
    file: relative(distDir, file),
    anchors: anchorMatches.length,
    prefetchEnabled: enabledPrefetch,
    missingPrefetch: anchorMatches.length - enabledPrefetch,
    coverage: anchorMatches.length
      ? Number((enabledPrefetch / anchorMatches.length).toFixed(3))
      : 0,
  };
});

const totalAnchors = rows.reduce((sum, row) => sum + row.anchors, 0);
const totalPrefetch = rows.reduce((sum, row) => sum + row.prefetchEnabled, 0);
const totalMissing = rows.reduce((sum, row) => sum + row.missingPrefetch, 0);
const averageCoverage = rows.length
  ? Number((rows.reduce((sum, row) => sum + row.coverage, 0) / rows.length).toFixed(3))
  : 0;

console.log("Prefetch coverage across sampled HTML files:");
for (const row of rows) {
  console.log(
    `- ${row.file}: ${row.prefetchEnabled}/${row.anchors} anchors with prefetch (coverage ${row.coverage})`,
  );
}
console.log(
  `Aggregate: ${totalPrefetch}/${totalAnchors} anchors instrumented, ${totalMissing} missing prefetch, average coverage ${averageCoverage}`,
);
