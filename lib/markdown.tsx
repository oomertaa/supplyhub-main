import React from "react";

/**
 * Randeaza un subset de markdown pentru textele introduse in Supabase:
 * paragrafe, titluri, liste, bold, italic si linkuri.
 * Nu compileaza JSX si nu insereaza HTML brut, deci un `<` ratacit intr-o
 * descriere nu poate strica build-ul si nu poate injecta markup.
 */

function inline(text: string, keyPrefix: string): React.ReactNode[] {
  const pattern = /(\[[^\]]+\]\([^)\s]+\))|(\*\*[^*]+\*\*)|(\*[^*]+\*)/g;
  const nodes: React.ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;

  while ((m = pattern.exec(text)) !== null) {
    if (m.index > last) nodes.push(text.slice(last, m.index));
    const token = m[0];
    const key = `${keyPrefix}-${i++}`;

    if (token.startsWith("[")) {
      const link = /^\[([^\]]+)\]\(([^)\s]+)\)$/.exec(token);
      if (link) {
        const href = link[2];
        const external = /^https?:\/\//.test(href);
        nodes.push(
          <a
            key={key}
            href={href}
            {...(external ? { target: "_blank", rel: "noopener nofollow" } : {})}
          >
            {link[1]}
          </a>,
        );
      } else {
        nodes.push(token);
      }
    } else if (token.startsWith("**")) {
      nodes.push(<strong key={key}>{token.slice(2, -2)}</strong>);
    } else {
      nodes.push(<em key={key}>{token.slice(1, -1)}</em>);
    }
    last = m.index + token.length;
  }

  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

export function Markdown({ text }: { text: string }) {
  const blocks = text.replace(/\r\n/g, "\n").split(/\n{2,}/);

  return (
    <>
      {blocks.map((raw, bi) => {
        const block = raw.trim();
        if (!block) return null;

        const heading = /^(#{2,4})\s+(.*)$/.exec(block);
        if (heading) {
          const Tag = (`h${Math.min(heading[1].length + 1, 5)}` as "h3" | "h4" | "h5");
          return <Tag key={bi}>{inline(heading[2], `h${bi}`)}</Tag>;
        }

        const lines = block.split("\n");
        if (lines.every((l) => /^\s*[-*]\s+/.test(l))) {
          return (
            <ul key={bi}>
              {lines.map((l, li) => (
                <li key={li}>{inline(l.replace(/^\s*[-*]\s+/, ""), `u${bi}-${li}`)}</li>
              ))}
            </ul>
          );
        }
        if (lines.every((l) => /^\s*\d+[.)]\s+/.test(l))) {
          return (
            <ol key={bi}>
              {lines.map((l, li) => (
                <li key={li}>{inline(l.replace(/^\s*\d+[.)]\s+/, ""), `o${bi}-${li}`)}</li>
              ))}
            </ol>
          );
        }

        return <p key={bi}>{inline(lines.join(" "), `p${bi}`)}</p>;
      })}
    </>
  );
}
