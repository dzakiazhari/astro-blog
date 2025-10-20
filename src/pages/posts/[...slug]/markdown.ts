import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

import { getPath } from "@/utils/getPath";

export const GET: APIRoute = async ({ params }) => {
  const slugParam = params.slug;
  const slugSegments = Array.isArray(slugParam)
    ? slugParam
    : typeof slugParam === "string"
      ? slugParam.split("/")
      : [];
  const slug = slugSegments.filter(Boolean).join("/");

  if (!slug) {
    return new Response("Not found", { status: 404 });
  }

  const posts = await getCollection("blog", ({ data }) => !data.draft);
  const entry = posts.find(
    post => getPath(post.id, post.filePath, false) === slug
  );

  if (!entry) {
    return new Response("Not found", { status: 404 });
  }

  try {
    const absolutePath = resolve(process.cwd(), entry.filePath);
    const fileContents = await readFile(absolutePath, "utf-8");

    return new Response(fileContents, {
      status: 200,
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new Response(entry.body ?? "", {
      status: 200,
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
      },
    });
  }
};
