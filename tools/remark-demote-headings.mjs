import { visit } from "unist-util-visit";
import { toString } from "mdast-util-to-string";

export default function remarkDemoteHeadings() {
  return tree => {
    let firstHeadingSeen = false;

    visit(tree, "heading", node => {
      const text = toString(node).trim();

      if (node.depth === 1) {
        if (firstHeadingSeen) {
          node.depth = 2;
        } else {
          firstHeadingSeen = true;
        }
      }

      if (text.toLowerCase() === "table of contents") {
        node.depth = Math.max(node.depth, 3);
        node.data ??= {};
        node.data.hProperties ??= {};
        node.data.hProperties["data-heading-role"] = "table-of-contents";
      }
    });
  };
}
