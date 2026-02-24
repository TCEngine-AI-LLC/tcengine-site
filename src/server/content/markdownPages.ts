import path from "node:path";
import { promises as fs } from "node:fs";
import { cache } from "react";
import { marked } from "marked";

export type MarkdownPage = {
  slug: string[];
  href: string;
  title: string;
  description: string;
  html: string;
};

type MarkdownPageIndexItem = Omit<MarkdownPage, "html"> & { filePath: string; order: number | null };

const MARKDOWN_DIR = path.join(process.cwd(), "markdowns");

function toPosix(p: string) {
  return p.split(path.sep).join("/");
}

const MERMAID_DIRECTIVES = new Set([
  "flowchart",
  "graph",
  "sequenceDiagram",
  "classDiagram",
  "stateDiagram",
  "stateDiagram-v2",
  "erDiagram",
  "journey",
  "gantt",
  "pie",
  "mindmap",
  "timeline",
  "requirementDiagram",
  "gitGraph",
  "quadrantChart",
  "sankey-beta",
  "xychart-beta",
  "block-beta",
]);

function isMermaidDirective(meta: string) {
  const m = (meta || "").trim();
  if (!m) return false;
  const first = m.split(/\s+/)[0] ?? "";
  return MERMAID_DIRECTIVES.has(first);
}

function resolveDiagramId(meta: string, slugBase: string, index: number) {
  const m = (meta || "").trim();
  if (m && !isMermaidDirective(m) && isValidDiagramId(m)) return m;
  return `${slugBase}--m${index}`;
}

function isValidDiagramId(id: string) {
  return /^[A-Za-z0-9][A-Za-z0-9._-]{0,120}$/.test(id);
}

function slugFromMarkdownPath(filePath: string): string[] {
  const rel = toPosix(path.relative(MARKDOWN_DIR, filePath));
  const noExt = rel.replace(/\.(md|mdx)$/, "");
  const parts = noExt.split("/").filter(Boolean);

  if (parts.length === 0) return [];

  // If file is named like "12-platform", strip "12-" so route becomes "/platform".
  const last = parts[parts.length - 1]!;
  const stripped = last.replace(/^\d+-/, "");
  parts[parts.length - 1] = stripped || last; // safety: don’t turn into empty

  if (parts[parts.length - 1] === "index") parts.pop();
  return parts;
}

function extractOrderPrefix(filePath: string): number | null {
  const base = path.basename(filePath).replace(/\.(md|mdx)$/, "");
  const m = base.match(/^(\d+)-/);
  if (!m) return null;
  const n = Number(m[1]);
  return Number.isFinite(n) ? n : null;
}

function slugBaseFromSlug(slug: string[]) {
  return slug.length ? slug.join("--") : "root";
}

function extractMermaidBlocks(mdText: string) {
  const re = /```mermaid(?:\s+([^\n\r]*))?[\r\n]+([\s\S]*?)```/g;
  const blocks: Array<{ index: number; meta: string; code: string; fullMatch: string }> = [];
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(mdText))) {
    i += 1;
    blocks.push({
      index: i,
      meta: (m[1] || "").trim(),
      code: (m[2] || "").trimEnd() + "\n",
      fullMatch: m[0],
    });
  }
  return blocks;
}

function replaceMermaidWithImages(markdown: string, slugBase: string) {
  const blocks = extractMermaidBlocks(markdown);
  if (blocks.length === 0) return markdown;

  let out = markdown;
  for (const b of blocks) {
    // If meta is a valid id, use it. Otherwise auto-id.
    // If meta has spaces (e.g. "flowchart TD"), it is NOT a valid id and will be auto-id.
    const diagramId = resolveDiagramId(b.meta, slugBase, b.index);

    // Replace the entire block with an image reference.
    // This relies on `npm run render:mermaid` to have created `public/diagrams/${diagramId}.svg`.
    const replacement = `![${diagramId}](/diagrams/${diagramId}.svg)\n`;
    out = out.replace(b.fullMatch, replacement);
  }

  return out;
}

function parseFrontmatter(md: string): { title?: string; description?: string; body: string } {
  // Minimal frontmatter parser:
  // ---
  // title: Something
  // description: Something
  // ---
  const fmRe = /^---\s*[\r\n]+([\s\S]*?)\r?\n---\s*[\r\n]+/;
  const m = md.match(fmRe);
  if (!m) return { body: md };

  const raw = m[1] ?? "";
  const body = md.slice(m[0].length);

  const out: { title?: string; description?: string } = {};
  for (const line of raw.split(/\r?\n/)) {
    const mm = line.match(/^([A-Za-z0-9_-]+)\s*:\s*(.*)\s*$/);
    if (!mm) continue;
    const key = mm[1];
    let val = mm[2] ?? "";
    val = val.replace(/^"(.*)"$/, "$1").replace(/^'(.*)'$/, "$1");
    if (key === "title") out.title = val;
    if (key === "description") out.description = val;
  }

  return { ...out, body };
}

function inferTitleAndDescription(mdBody: string): { title: string; description: string } {
  const h1 = mdBody.match(/^\s*#\s+(.+)\s*$/m);
  const title = (h1?.[1] ?? "").trim() || "TC Engine";

  // First non-empty paragraph-ish line that isn't a heading or list
  const lines = mdBody.split(/\r?\n/).map((l) => l.trim());
  const descLine =
    lines.find((l) => l && !l.startsWith("#") && !l.startsWith("-") && !l.startsWith("*")) ?? "";
  const description = descLine.slice(0, 200) || title;

  return { title, description };
}

async function walk(dir: string): Promise<string[]> {
  const out: string[] = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const ent of entries) {
    if (ent.name.startsWith(".") || ent.name.startsWith("_")) continue;
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) out.push(...(await walk(full)));
    else if (ent.isFile() && (ent.name.endsWith(".md") || ent.name.endsWith(".mdx"))) out.push(full);
  }
  return out;
}

const getIndex = cache(async (): Promise<Map<string, MarkdownPageIndexItem>> => {
  const idx = new Map<string, MarkdownPageIndexItem>();

  // If folder doesn't exist, return empty (route will 404).
  const exists = await fs
    .stat(MARKDOWN_DIR)
    .then(() => true)
    .catch(() => false);

  if (!exists) return idx;

  const files = await walk(MARKDOWN_DIR);

  for (const filePath of files) {
    const slug = slugFromMarkdownPath(filePath);
    const href = "/" + slug.join("/");

    const raw = await fs.readFile(filePath, "utf8");
    const { title: fmTitle, description: fmDesc, body } = parseFrontmatter(raw);
    const inferred = inferTitleAndDescription(body);

    const title = fmTitle ?? inferred.title;
    const description = fmDesc ?? inferred.description;

    const order = extractOrderPrefix(filePath);
    idx.set(href, { filePath, slug, href, title, description, order });
  }

  return idx;
});

export const listMarkdownPages = cache(async () => {
  const idx = await getIndex();
  return Array.from(idx.values()).sort((a, b) => {
    const ao = a.order;
    const bo = b.order;

    // both numbered: higher number first
    if (ao !== null && bo !== null) {
      if (bo !== ao) return bo - ao;
      return a.href.localeCompare(b.href);
    }

    // one numbered: numbered first
    if (ao !== null) return -1;
    if (bo !== null) return 1;

    // neither numbered: stable alphabetical
    return a.href.localeCompare(b.href);
  });
});

export const getMarkdownPage = cache(async (slug: string[]): Promise<MarkdownPage | null> => {
  const href = "/" + slug.join("/");
  const idx = await getIndex();
  const item = idx.get(href);
  if (!item) return null;

  const raw = await fs.readFile(item.filePath, "utf8");
  const { body } = parseFrontmatter(raw);

  const slugBase = slugBaseFromSlug(item.slug);
  const mdWithDiagrams = replaceMermaidWithImages(body, slugBase);

  // GFM tables/lists supported by marked reasonably well
  const html = await Promise.resolve(marked.parse(mdWithDiagrams));

  return {
    slug: item.slug,
    href: item.href,
    title: item.title,
    description: item.description,
    html,
  };
});

export type RenderedMarkdown = {
  title?: string;
  description?: string;
  html: string;
};

function resolveMarkdownRelPath(relPath: string): string {
  // Explicit + safe: prevent path traversal
  if (!relPath || relPath.includes("..") || relPath.startsWith("/") || relPath.startsWith("\\")) {
    throw new Error(`[markdown] invalid relPath "${relPath}"`);
  }

  const full = path.resolve(MARKDOWN_DIR, relPath);
  const root = path.resolve(MARKDOWN_DIR);

  if (!full.startsWith(root + path.sep) && full !== root) {
    throw new Error(`[markdown] relPath escapes markdown root: "${relPath}"`);
  }

  return full;
}

export const renderMarkdownFile = cache(async (relPath: string): Promise<RenderedMarkdown | null> => {
  const filePath = resolveMarkdownRelPath(relPath);

  const exists = await fs
    .stat(filePath)
    .then(() => true)
    .catch(() => false);

  if (!exists) return null;

  const raw = await fs.readFile(filePath, "utf8");
  const { title, description, body } = parseFrontmatter(raw);

  const slug = slugFromMarkdownPath(filePath);
  const slugBase = slugBaseFromSlug(slug);

  const mdWithDiagrams = replaceMermaidWithImages(body, slugBase);
  const html = await Promise.resolve(marked.parse(mdWithDiagrams));

  return { title, description, html };
});