import type { ArtifactRow } from "@/lib/opentrust/artifacts";

export interface ArtifactGroup {
  key: string;
  label: string;
  description: string;
  items: ArtifactRow[];
}

const docsExt = new Set([
  "md",
  "mdx",
  "txt",
  "rtf",
  "pdf",
  "doc",
  "docx",
  "pages",
  "adoc",
]);

const imageExt = new Set(["png", "jpg", "jpeg", "gif", "webp", "svg", "avif", "ico"]);
const codeExt = new Set([
  "ts",
  "tsx",
  "js",
  "jsx",
  "mjs",
  "cjs",
  "py",
  "rs",
  "go",
  "java",
  "kt",
  "swift",
  "rb",
  "php",
  "c",
  "cc",
  "cpp",
  "h",
  "hpp",
  "cs",
  "sh",
  "bash",
  "zsh",
  "fish",
  "lua",
  "sql",
]);
const dataExt = new Set(["json", "jsonl", "yaml", "yml", "toml", "csv", "tsv", "xml"]);
const configNames = new Set([
  "package.json",
  "pnpm-lock.yaml",
  "tsconfig.json",
  "next.config.js",
  "next.config.ts",
  "eslint.config.js",
  "eslint.config.mjs",
  "tailwind.config.js",
  "tailwind.config.ts",
  "dockerfile",
  ".gitignore",
  ".env.example",
  ".env.local",
]);

function normalize(uri: string, title?: string | null) {
  const value = `${uri} ${title ?? ""}`.toLowerCase();
  return value;
}

function fileNameFromUri(uri: string) {
  const clean = uri.split("?")[0]?.split("#")[0] ?? uri;
  const segments = clean.split("/").filter(Boolean);
  return segments[segments.length - 1]?.toLowerCase() ?? clean.toLowerCase();
}

function extFromUri(uri: string) {
  const filename = fileNameFromUri(uri);
  const parts = filename.split(".");
  return parts.length > 1 ? parts.pop()?.toLowerCase() ?? "" : "";
}

function classifyArtifact(artifact: ArtifactRow) {
  const uri = artifact.uri.toLowerCase();
  const value = normalize(artifact.uri, artifact.title);
  const filename = fileNameFromUri(artifact.uri);
  const ext = extFromUri(artifact.uri);

  if (artifact.kind === "repo" || value.includes("github.com/") || value.includes("gitlab.com/") || value.includes("/repo/") || value.includes("/repositories/")) {
    return {
      key: "repo",
      label: "Repositories",
      description: "Source repos, repo links, and repository-level references.",
    };
  }

  if (
    value.includes("/docs/") ||
    value.includes("/documentation/") ||
    value.includes("readme") ||
    value.includes("changelog") ||
    docsExt.has(ext) ||
    artifact.kind === "doc"
  ) {
    return {
      key: "docs",
      label: "Docs",
      description: "Markdown, docs folders, READMEs, PDFs, and other written references.",
    };
  }

  if (
    value.includes("/images/") ||
    value.includes("/img/") ||
    value.includes("/screenshots/") ||
    value.includes("/assets/") ||
    imageExt.has(ext)
  ) {
    return {
      key: "images",
      label: "Images",
      description: "Screenshots, assets, diagrams, and other visual artifacts.",
    };
  }

  if (
    value.includes("/src/") ||
    value.includes("/app/") ||
    value.includes("/components/") ||
    value.includes("/lib/") ||
    value.includes("/scripts/") ||
    codeExt.has(ext)
  ) {
    return {
      key: "code",
      label: "Code",
      description: "Application source, components, scripts, and implementation files.",
    };
  }

  if (
    value.includes("/config/") ||
    value.includes("settings") ||
    configNames.has(filename)
  ) {
    return {
      key: "config",
      label: "Config",
      description: "Configuration, environment, build, and project setup files.",
    };
  }

  if (
    value.includes("/data/") ||
    value.includes("/exports/") ||
    value.includes("/fixtures/") ||
    dataExt.has(ext)
  ) {
    return {
      key: "data",
      label: "Data",
      description: "Structured data, exports, fixtures, and machine-readable records.",
    };
  }

  if (
    artifact.kind === "url" ||
    uri.startsWith("http://") ||
    uri.startsWith("https://")
  ) {
    return {
      key: "links",
      label: "Links",
      description: "General external URLs and references that are not clearly repo or docs scoped.",
    };
  }

  return {
    key: "other",
    label: "Other",
    description: "Artifacts that do not fit a stronger path-based grouping yet.",
  };
}

export function groupArtifactsByPath(artifacts: ArtifactRow[]): ArtifactGroup[] {
  const groups = new Map<string, ArtifactGroup>();

  for (const artifact of artifacts) {
    const groupMeta = classifyArtifact(artifact);
    const existing = groups.get(groupMeta.key);
    if (existing) {
      existing.items.push(artifact);
    } else {
      groups.set(groupMeta.key, {
        ...groupMeta,
        items: [artifact],
      });
    }
  }

  return Array.from(groups.values()).sort((a, b) => {
    if (b.items.length !== a.items.length) return b.items.length - a.items.length;
    return a.label.localeCompare(b.label);
  });
}
