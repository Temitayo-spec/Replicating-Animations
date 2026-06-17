import fs from "node:fs";
import path from "node:path";

export type SourceFile = {
  /** Label shown on the tab / header, e.g. "Gallery.tsx". */
  filename: string;
  /** The file's source, trimmed. */
  code: string;
  /** Prism language id for highlighting. */
  language: string;
};

/**
 * Read a project source file (relative to the repo root) for display in the
 * CodeShowcase "View source" panel. Pass a `label` to override the tab name
 * (handy for `index.tsx` files, e.g. readSource(".../Gallery/index.tsx", "Gallery.tsx")).
 */
export function readSource(
  relPath: string,
  label?: string,
  language = "tsx",
): SourceFile {
  return {
    filename: label ?? relPath.split("/").pop() ?? relPath,
    code: fs.readFileSync(path.join(process.cwd(), relPath), "utf8").trim(),
    language,
  };
}
