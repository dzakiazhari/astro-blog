import { visit } from "unist-util-visit";

export default function remarkDemoteHeadings() {
  return tree => {
    let firstHeadingSeen = false;

    visit(tree, "heading", node => {
      if (node.depth === 1) {
        if (firstHeadingSeen) {
          node.depth = 2;
        } else {
          firstHeadingSeen = true;
        }
      }
    });
  };
}
