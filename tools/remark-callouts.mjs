// Minimal remark plugin to turn Obsidian-style callouts
//   > [!TYPE|Optional title]
// into blockquotes with Quartz-like callout classes/attributes.
// It preserves the remaining content and removes the directive marker.

import { visit } from "unist-util-visit";

const calloutMapping = {
  note: "note",
  abstract: "abstract",
  summary: "abstract",
  tldr: "abstract",
  info: "info",
  todo: "todo",
  tip: "tip",
  hint: "tip",
  important: "tip",
  success: "success",
  check: "success",
  done: "success",
  question: "question",
  help: "question",
  faq: "question",
  warning: "warning",
  attention: "warning",
  caution: "warning",
  failure: "failure",
  missing: "failure",
  fail: "failure",
  danger: "danger",
  error: "danger",
  bug: "bug",
  example: "example",
  quote: "quote",
  cite: "quote",
};

const calloutRegex = /^\[\!([\w-]+)\|?(.+?)?\]([+-]?)/;

function canonicalize(type) {
  const t = String(type || "").toLowerCase();
  return calloutMapping[t] || t || "note";
}

export default function remarkCallouts() {
  return (tree) => {
    visit(tree, "blockquote", (node) => {
      if (!node.children || node.children.length === 0) return;
      const first = node.children[0];
      if (first.type !== "paragraph" || !first.children || first.children.length === 0) return;
      const firstText = first.children.find((c) => c.type === "text");
      if (!firstText || typeof firstText.value !== "string") return;

      const match = firstText.value.match(calloutRegex);
      if (!match) return;

      const [, typeStr] = match;
      const calloutType = canonicalize(typeStr);

      // Strip the callout marker from the first text node
      firstText.value = firstText.value.slice(match[0].length).trimStart();

      // Attach class and data attributes
      const props = (node.data = node.data || {});
      const hProps = (props.hProperties = props.hProperties || {});
      const cls = new Set((hProps.className || "").toString().split(/\s+/).filter(Boolean));
      cls.add("callout");
      cls.add(calloutType);
      hProps.className = Array.from(cls).join(" ");
      hProps["data-callout"] = calloutType;
    });
  };
}

