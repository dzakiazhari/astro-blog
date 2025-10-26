import { glob } from 'astro/loaders'
import { defineCollection, z } from 'astro:content'
import kebabCase from 'lodash.kebabcase'

import { SITE } from '@/consts'
import { parsePostDate } from '@/lib/normalizePostDate'

const blog = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/blog' }),
  schema: ({ image }) =>
    z
      .object({
        title: z.string(),
        description: z.string(),
        pubDatetime: z.union([z.string(), z.date()]),
        modDatetime: z.union([z.string(), z.date()]).optional().nullable(),
        author: z.string().default(SITE.author),
        authors: z.array(z.string()).optional(),
        tags: z.array(z.string()).default(['others']),
        draft: z.boolean().optional(),
        ogImage: image().or(z.string()).optional(),
        canonicalURL: z.string().optional(),
        timezone: z.string().optional(),
        order: z.number().optional(),
        image: image().optional(),
      })
      .transform((entry, ctx) => {
        const timezone = entry.timezone ?? SITE.timezone
        const pubDatetime = parsePostDate(entry.pubDatetime, timezone)

        if (Number.isNaN(pubDatetime.getTime())) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message:
              'Unable to parse pubDatetime. Ensure it is an ISO-8601 string.',
            path: ['pubDatetime'],
          })
        }

        const modDatetimeRaw =
          entry.modDatetime === undefined || entry.modDatetime === null
            ? entry.modDatetime
            : parsePostDate(entry.modDatetime, timezone)

        if (
          modDatetimeRaw instanceof Date &&
          Number.isNaN(modDatetimeRaw.getTime())
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message:
              'Unable to parse modDatetime. Ensure it is an ISO-8601 string.',
            path: ['modDatetime'],
          })
        }

        const authorName = entry.author ?? SITE.author
        const resolvedAuthors =
          entry.authors && entry.authors.length > 0
            ? entry.authors
            : [kebabCase(authorName)]

        return {
          ...entry,
          author: authorName,
          authors: resolvedAuthors,
          timezone,
          pubDatetime,
          modDatetime: modDatetimeRaw ?? null,
          date: pubDatetime,
          updatedAt:
            modDatetimeRaw instanceof Date ? modDatetimeRaw : undefined,
        }
      }),
})

const authors = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/authors' }),
  schema: z.object({
    name: z.string(),
    pronouns: z.string().optional(),
    avatar: z.string().url().or(z.string().startsWith('/')),
    bio: z.string().optional(),
    mail: z.string().email().optional(),
    website: z.string().url().optional(),
    twitter: z.string().url().optional(),
    github: z.string().url().optional(),
    linkedin: z.string().url().optional(),
    bluesky: z.string().url().optional(),
  }),
})

export const collections = { blog, authors }
