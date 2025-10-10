import test from "node:test";
import assert from "node:assert/strict";

import { getPath } from "./getPath";

const BLOG_ROOT = "src/data/blog";

const createFilePath = (relativePath: string) => `${BLOG_ROOT}/${relativePath}`;

test("includes the /posts base by default", () => {
  const result = getPath("my-post", createFilePath("my-post.md"));

  assert.equal(result, "/posts/my-post");
});

test("omits the leading slash when includeBase is false", () => {
  const result = getPath("my-post", createFilePath("my-post.md"), false);

  assert.equal(result, "my-post");
});

test("preserves nested slug segments without a leading slash", () => {
  const result = getPath(
    "nested-path/my-post",
    createFilePath("Nested Path/My Post.md"),
    false
  );

  assert.equal(result, "nested-path/my-post");
});

test("includes base path for nested posts", () => {
  const result = getPath(
    "nested-path/my-post",
    createFilePath("Nested Path/My Post.md"),
    true
  );

  assert.equal(result, "/posts/nested-path/my-post");
});

test("excludes underscore-prefixed directories", () => {
  const result = getPath("my-post", createFilePath("_drafts/My Post.md"), true);

  assert.equal(result, "/posts/my-post");
});
