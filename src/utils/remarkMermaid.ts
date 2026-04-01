type MarkdownNode = {
  type: string;
  lang?: string | null;
  value?: string;
  children?: MarkdownNode[];
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function visit(node: MarkdownNode) {
  if (node.type === "code" && node.lang === "mermaid" && typeof node.value === "string") {
    node.type = "html";
    node.value = `<div class="mermaid">${escapeHtml(node.value)}</div>`;
    delete node.lang;
    delete node.children;
    return;
  }

  node.children?.forEach(visit);
}

export default function remarkMermaid() {
  return (tree: MarkdownNode) => {
    visit(tree);
  };
}
