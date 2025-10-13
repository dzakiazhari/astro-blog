import test from "node:test";
import assert from "node:assert/strict";

import getSortedPosts from "@/utils/getSortedPosts";
import { parsePostDate } from "@/utils/normalizePostDate";
import { SITE } from "@/config";

type PostEntry = Parameters<typeof getSortedPosts>[0][number];

const createEntry = (
  id: string,
  data: Partial<PostEntry["data"]> = {}
): PostEntry =>
  ({
    id,
    slug: id,
    collection: "blog",
    data: {
      author: "Tester",
      description: "A test post",
      pubDatetime: new Date("2024-01-01T00:00:00.000Z"),
      title: id,
      tags: ["test"],
      draft: false,
      featured: false,
      timezone: SITE.timezone,
      ...data,
    },
  }) as unknown as PostEntry;

test("sorts entries by last modified date, then publish time", () => {
  const older = createEntry("older", {
    pubDatetime: new Date("2024-01-01T00:00:00Z"),
  });
  const updated = createEntry("updated", {
    pubDatetime: new Date("2024-01-01T00:00:00Z"),
    modDatetime: new Date("2024-01-03T00:00:00Z"),
  });
  const recent = createEntry("recent", {
    pubDatetime: new Date("2024-01-02T00:00:00Z"),
  });

  const sorted = getSortedPosts([older, updated, recent]);

  assert.deepEqual(
    sorted.map(post => post.id),
    ["updated", "recent", "older"]
  );
});

test("filters out posts scheduled beyond the configured visibility margin", () => {
  const originalNow = Date.now;
  const now = Date.UTC(2024, 0, 1, 12, 0, 0);
  Date.now = () => now;

  try {
    const visible = createEntry("visible", {
      pubDatetime: new Date(now - 60_000),
    });
    const hidden = createEntry("hidden", {
      pubDatetime: new Date(now + SITE.scheduledPostMargin + 60_000),
    });

    const sorted = getSortedPosts([hidden, visible]);

    assert.deepEqual(
      sorted.map(post => post.id),
      ["visible"]
    );
  } finally {
    Date.now = originalNow;
  }
});

test("respects timezone hints when sorting featured posts", () => {
  const originalNow = Date.now;
  const now = Date.UTC(2024, 0, 1, 0, 20, 0);
  Date.now = () => now;

  try {
    const tokyoPublish = parsePostDate("2024-01-01T09:00:00Z", "Asia/Tokyo");
    const withinMargin = createEntry("tokyo", {
      featured: true,
      pubDatetime: tokyoPublish,
      timezone: "Asia/Tokyo",
    });

    const baseline = createEntry("baseline", {
      featured: true,
      pubDatetime: new Date(now - 3_600_000),
    });

    const sorted = getSortedPosts([withinMargin, baseline]);

    assert.deepEqual(
      sorted.map(post => post.id),
      ["tokyo", "baseline"]
    );
  } finally {
    Date.now = originalNow;
  }
});
