import { promises as fs } from "node:fs";
import path from "node:path";
import os from "node:os";
import { execFile } from "node:child_process";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const repoRoot = path.resolve(__dirname, "..");

// CEO-authored markdown pages
const markdownDir = path.join(repoRoot, "markdowns");

// Output location served by Next (public/)
const outDir = path.join(repoRoot, "public", "diagrams");

// SINGLE source of truth for mermaid rendering config
const mermaidConfig = path.join(repoRoot, "src", "customizations", "mermaid.mmdc.json");

function execFileAsync(cmd, args, opts = {}) {
  return new Promise((resolve, reject) => {
    execFile(cmd, args, opts, (err, stdout, stderr) => {
      if (err) reject(Object.assign(err, { stdout, stderr }));
      else resolve({ stdout, stderr });
    });
  });
}

async function exists(p) {
  return fs.stat(p).then(() => true).catch(() => false);
}

async function walk(dir, predicate) {
  const out = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const ent of entries) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) out.push(...(await walk(full, predicate)));
    else if (ent.isFile() && predicate(ent.name)) out.push(full);
  }
  return out;
}

function toPosix(p) {
  return p.split(path.sep).join("/");
}

function isValidDiagramId(id) {
  return /^[A-Za-z0-9][A-Za-z0-9._-]{0,120}$/.test(id);
}

// If the meta looks like a diagram directive, treat it as a header, NOT an id.
const MERMAID_DIRECTIVES = new Set([
  "flowchart",
  "graph",
  "sequencediagram",
  "classdiagram",
  "statediagram",
  "statediagram-v2",
  "erdiagram",
  "journey",
  "gantt",
  "pie",
  "mindmap",
  "timeline",
  "requirementdiagram",
  "gitgraph",
  "quadrantchart",
  "sankey-beta",
  "xychart-beta",
  "block-beta",
]);

function isMermaidDirective(meta) {
  const m = (meta || "").trim();
  if (!m) return false;
  const first = m.split(/\s+/)[0]?.toLowerCase();
  return MERMAID_DIRECTIVES.has(first);
}

function slugBaseFromMarkdownPath(filePath) {
  const rel = toPosix(path.relative(markdownDir, filePath));
  const noExt = rel.replace(/\.(md|mdx)$/, "");
  const parts = noExt.split("/").filter(Boolean);

  // Remove trailing "index"
  if (parts[parts.length - 1] === "index") parts.pop();

  // IMPORTANT: match app routing behavior
  // If last segment is "12-something", strip "12-" so diagrams become "something--m1.svg"
  if (parts.length > 0) {
    const last = parts[parts.length - 1];
    const stripped = last.replace(/^\d+-/, "");
    parts[parts.length - 1] = stripped || last; // safety
  }

  return parts.length ? parts.join("--") : "root";
}

function extractMermaidBlocks(mdText) {
  // ```mermaid <optional-meta>
  // ...content...
  // ```
  const re = /```mermaid(?:\s+([^\n\r]*))?[\r\n]+([\s\S]*?)```/g;
  const blocks = [];
  let m;
  let i = 0;
  while ((m = re.exec(mdText))) {
    i += 1;
    blocks.push({
      index: i,
      meta: (m[1] || "").trim(),
      code: (m[2] || "").trimEnd() + "\n",
    });
  }
  return blocks;
}

function resolveDiagramId(meta, base, index) {
  const m = (meta || "").trim();
  if (m && !isMermaidDirective(m) && isValidDiagramId(m)) return m;
  return `${base}--m${index}`;
}

function normalizeMermaidCode(meta, code) {
  const m = (meta || "").trim();
  if (!m) return code;

  // If meta is a directive (e.g. "flowchart TD"), prepend it so Mermaid can detect the type.
  if (isMermaidDirective(m)) {
    const trimmed = (code || "").trimStart();
    const first = trimmed.split(/\s+/)[0]?.toLowerCase();
    const alreadyHasDirective = MERMAID_DIRECTIVES.has(first);
    return alreadyHasDirective ? code : `${m}\n${code}`;
  }

  return code;
}

async function main() {
  const mmdc = path.join(
    repoRoot,
    "node_modules",
    ".bin",
    process.platform === "win32" ? "mmdc.cmd" : "mmdc"
  );

  if (!(await exists(markdownDir))) {
    console.log(`[render-mermaid] no /markdowns dir: ${markdownDir}`);
    return;
  }

  if (!(await exists(mmdc))) {
    throw new Error(`[render-mermaid] missing mmdc binary: ${mmdc}. Did you run npm install?`);
  }

  if (!(await exists(mermaidConfig))) {
    throw new Error(`[render-mermaid] missing config file: ${mermaidConfig}`);
  }

  await fs.mkdir(outDir, { recursive: true });

  const mdFiles = await walk(markdownDir, (name) => name.endsWith(".md") || name.endsWith(".mdx"));
  if (mdFiles.length === 0) {
    console.log("[render-mermaid] no markdown files found under /markdowns");
    return;
  }

  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "tcengine-mermaid-"));
  const outSeen = new Map(); // diagramId -> filePath

  for (const filePath of mdFiles) {
    const text = await fs.readFile(filePath, "utf8");
    const blocks = extractMermaidBlocks(text);
    if (blocks.length === 0) continue;

    const base = slugBaseFromMarkdownPath(filePath);

    for (const b of blocks) {
      const diagramId = resolveDiagramId(b.meta, base, b.index);

      if (outSeen.has(diagramId)) {
        throw new Error(
          `[render-mermaid] duplicate diagram id "${diagramId}". ` +
            `Already defined by ${outSeen.get(diagramId)} and also ${filePath}`
        );
      }
      outSeen.set(diagramId, filePath);

      const tmpInput = path.join(tmpDir, `${diagramId}.mmd`);
      const output = path.join(outDir, `${diagramId}.svg`);

      const code = normalizeMermaidCode(b.meta, b.code);
      await fs.writeFile(tmpInput, code, "utf8");

      await execFileAsync(mmdc, ["-i", tmpInput, "-o", output, "-c", mermaidConfig, "-b", "transparent"]);

      console.log(`[render-mermaid] ${path.relative(repoRoot, filePath)} -> public/diagrams/${diagramId}.svg`);
    }
  }
}

main().catch((e) => {
  console.error("[render-mermaid] failed", e);
  process.exit(1);
});