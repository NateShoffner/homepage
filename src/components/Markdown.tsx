import ReactMarkdown from "react-markdown";
import remarkDirective from "remark-directive";
import { visit } from "unist-util-visit";
import AmazonLink from "@components/AmazonLink";

// A tiny remark plugin to turn {% amazon asin="..." text="..." %} into an HTML node we can map:
function remarkAmazonShortcode() {
  return (tree: any) => {
    visit(tree, "text", (node: any, index: number, parent: any) => {
      const regex =
        /\{\%\s*amazon\s+asin="([^"]+)"(?:\s+text="([^"]*)")?\s*\%\}/g;
      const value: string = node.value;
      if (!regex.test(value)) return;

      const parts: any[] = [];
      let lastIndex = 0;
      regex.lastIndex = 0;
      value.replace(regex, (match, asin, text, offset) => {
        if (offset > lastIndex)
          parts.push({ type: "text", value: value.slice(lastIndex, offset) });
        parts.push({
          type: "amazonLink",
          data: { hName: "amazon-link", hProperties: { asin, text } },
        });
        lastIndex = offset + match.length;
        return match;
      });
      if (lastIndex < value.length)
        parts.push({ type: "text", value: value.slice(lastIndex) });

      // Replace the single text node with the new nodes
      parent.children.splice(index, 1, ...parts);
      // Prevent further processing of the replaced nodes
      return [visit.SKIP, index + parts.length];
    });
  };
}

export default function Markdown({ children }: { children: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkDirective, remarkAmazonShortcode]}
      // Map our synthetic "amazon-link" to the real component:
      components={{
        // @ts-ignore
        "amazon-link": ({ node, ...props }) => {
          const asin = node?.properties?.asin as string;
          const text = (node?.properties?.text as string) || undefined;
          return <AmazonLink asin={asin} text={text} />;
        },
      }}
    >
      {children}
    </ReactMarkdown>
  );
}
