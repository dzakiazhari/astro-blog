import test from "node:test";
import assert from "node:assert/strict";

import postFilter from "./postFilter";
import { SITE } from "@/config";

type PostEntry = Parameters<typeof postFilter>[0];

const createEntry = (data: Partial<PostEntry["data"]> = {}): PostEntry =>
  ({
    data: {
      author: "Tester",
      description: "A test post",
      pubDatetime: new Date("2024-01-01T00:00:00.000Z"),
      title: "Test Post",
      tags: ["test"],
      draft: false,
      ...data,
    },
  } as unknown as PostEntry);

const now = Date.UTC(2024, 0, 1, 12, 0, 0);

test("excludes draft posts regardless of publish time", () => {
  const entry = createEntry({
    draft: true,
    pubDatetime: new Date(now - 86_400_000),
  });

  assert.equal(postFilter(entry, { now }), false);
});

test("shows posts that have passed their publish window", () => {
  const entry = createEntry({
    pubDatetime: new Date(now - 60_000),
  });

  assert.equal(postFilter(entry, { now }), true);
});

test("hides scheduled posts that are still outside the visibility margin", () => {
  const future = new Date(now + SITE.scheduledPostMargin + 60_000);
  const entry = createEntry({ pubDatetime: future });

  assert.equal(postFilter(entry, { now }), false);
});

test("shows scheduled posts that fall within the configured margin", () => {
  const withinMargin = new Date(now + SITE.scheduledPostMargin / 2);
  const entry = createEntry({ pubDatetime: withinMargin });

  assert.equal(postFilter(entry, { now }), true);
});

test("keeps scheduled posts visible while developing", () => {
  const future = new Date(now + SITE.scheduledPostMargin * 4);
  const entry = createEntry({ pubDatetime: future });

  assert.equal(postFilter(entry, { now, isDev: true }), true);
});
