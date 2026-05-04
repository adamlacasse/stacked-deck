import katex from "katex";
import "katex/dist/katex.min.css";

type MathTextProps = { text: string };

export function MathText({ text }: MathTextProps) {
  const parts = text.split(/\$([^$]+)\$/g);
  // split with a capture group alternates: [plain, math, plain, math, ...]
  return (
    <>
      {parts.map((part, i) => {
        if (i % 2 === 1) {
          const html = katex.renderToString(part, { throwOnError: false });
          return <span key={i} dangerouslySetInnerHTML={{ __html: html }} />;
        }
        return part ? <span key={i}>{part}</span> : null;
      })}
    </>
  );
}
