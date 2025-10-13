import test from "node:test";
import assert from "node:assert/strict";

import {
  normalizePostDateInput,
  parsePostDate,
} from "@/utils/normalizePostDate";

test("normalises Pages CMS Z-suffixed timestamps to the declared timezone", () => {
  const raw = "2025-10-13T17:25:00Z";
  const result = parsePostDate(raw, "Asia/Tokyo");

  assert.equal(result.toISOString(), "2025-10-13T08:25:00.000Z");
});

test("honours timezone hints when parsing Date instances", () => {
  const raw = new Date("2025-10-13T17:25:00Z");
  const result = parsePostDate(raw, "Asia/Tokyo");

  assert.equal(result.toISOString(), "2025-10-13T08:25:00.000Z");
});

test("reformats compact numeric offsets", () => {
  const raw = "2025-10-13T17:25:00+0900";
  const normalised = normalizePostDateInput(raw, "Asia/Tokyo");

  assert.equal(normalised, "2025-10-13T17:25:00+09:00");
});

test("treats offset-free timestamps as belonging to the declared timezone", () => {
  const raw = "2025-10-13 17:25:00";
  const normalised = normalizePostDateInput(raw, "Asia/Tokyo");

  assert.equal(normalised, "2025-10-13T17:25:00+09:00");
});

test("keeps explicit offsets intact", () => {
  const raw = "2025-10-13T17:25:00+09:00";
  const normalised = normalizePostDateInput(raw, "Asia/Tokyo");

  assert.equal(normalised, raw);
});

test("returns the input when no timezone is provided", () => {
  const raw = "2025-10-13T17:25:00Z";
  const normalised = normalizePostDateInput(raw);

  assert.equal(normalised, raw);
});
