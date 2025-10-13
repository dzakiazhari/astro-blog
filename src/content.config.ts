import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";
import { SITE } from "@/config";
import { BLOG_PATH } from "@/utils/blogPath";
import { parsePostDate } from "@/utils/normalizePostDate";

const blog = defineCollection({
  loader: glob({ pattern: "**/[^_]*.md", base: `./${BLOG_PATH}` }),
  schema: ({ image }) =>
    z
      .object({
        author: z.string().default(SITE.author),
        pubDatetime: z.union([z.string(), z.date()]),
        modDatetime: z.union([z.string(), z.date()]).optional().nullable(),
        title: z.string(),
        featured: z.boolean().optional(),
        draft: z.boolean().optional(),
        tags: z.array(z.string()).default(["others"]),
        ogImage: image().or(z.string()).optional(),
        description: z.string(),
        canonicalURL: z.string().optional(),
        hideEditPost: z.boolean().optional(),
        timezone: z.string().optional(),
      })
      .transform((entry, ctx) => {
        const pubDatetime = parsePostDate(entry.pubDatetime, entry.timezone);

        if (Number.isNaN(pubDatetime.getTime())) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message:
              "Unable to parse pubDatetime. Ensure it is an ISO-8601 string.",
            path: ["pubDatetime"],
          });
        }

        const modDatetime =
          entry.modDatetime === undefined || entry.modDatetime === null
            ? entry.modDatetime
            : parsePostDate(entry.modDatetime, entry.timezone);

        if (
          modDatetime instanceof Date &&
          Number.isNaN(modDatetime.getTime())
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message:
              "Unable to parse modDatetime. Ensure it is an ISO-8601 string.",
            path: ["modDatetime"],
          });
        }

        return {
          ...entry,
          pubDatetime,
          modDatetime,
        };
      }),
});

export const collections = { blog };
export { BLOG_PATH };
