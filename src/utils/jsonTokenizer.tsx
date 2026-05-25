export type TokenType = "key" | "string" | "number" | "boolean" | "null" | "punctuation" | "whitespace";

export interface Token {
  text: string;
  type: TokenType;
}

export function tokenizeJson(json: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;

  while (i < json.length) {
    if (/\s/.test(json[i])) {
      let ws = "";
      while (i < json.length && /\s/.test(json[i])) ws += json[i++];
      tokens.push({ text: ws, type: "whitespace" });
      continue;
    }

    if (json[i] === '"') {
      let str = '"';
      i++;
      while (i < json.length) {
        if (json[i] === "\\") { str += json[i] + json[i + 1]; i += 2; }
        else if (json[i] === '"') { str += '"'; i++; break; }
        else { str += json[i++]; }
      }
      let j = i;
      while (j < json.length && /\s/.test(json[j])) j++;
      tokens.push({ text: str, type: j < json.length && json[j] === ":" ? "key" : "string" });
      continue;
    }

    if (/[-\d]/.test(json[i])) {
      let num = "";
      while (i < json.length && /[-\d.eE+]/.test(json[i])) num += json[i++];
      tokens.push({ text: num, type: "number" });
      continue;
    }

    if (json.startsWith("true", i))  { tokens.push({ text: "true",  type: "boolean" }); i += 4; continue; }
    if (json.startsWith("false", i)) { tokens.push({ text: "false", type: "boolean" }); i += 5; continue; }
    if (json.startsWith("null", i))  { tokens.push({ text: "null",  type: "null"    }); i += 4; continue; }

    tokens.push({ text: json[i], type: "punctuation" });
    i++;
  }

  return tokens;
}

export function renderTokens(tokens: Token[], charLimit: number): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  let rendered = 0;

  for (let i = 0; i < tokens.length; i++) {
    if (rendered >= charLimit) break;
    const { text, type } = tokens[i];
    const slice = text.slice(0, charLimit - rendered);
    rendered += slice.length;
    nodes.push(<span key={i} className={`json-token-${type}`}>{slice}</span>);
    if (rendered >= charLimit) break;
  }

  return nodes;
}
