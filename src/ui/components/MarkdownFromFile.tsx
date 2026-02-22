import MarkdownProse from "@/src/ui/components/MarkdownProse";
import { renderMarkdownFile } from "@/src/server/content/markdownPages";

export default async function MarkdownFromFile({ relPath }: { relPath: string }) {
  const rendered = await renderMarkdownFile(relPath);

  if (!rendered) {
    throw new Error(
      `[MarkdownFromFile] missing markdown file: markdowns/${relPath}\n` +
        `Create it or change the relPath passed to <MarkdownFromFile />.`
    );
  }

  return <MarkdownProse html={rendered.html} />;
}