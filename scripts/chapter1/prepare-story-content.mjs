import { readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { CHAPTER_DATA } from "../../frontend/src/game/data/chapters.js";
import { storyTextFields } from "../../frontend/src/game/narrative/storyText.js";

const publicRoot = new URL("../../frontend/public/", import.meta.url);
const chapters = [];
for (const [id, entry] of Object.entries(CHAPTER_DATA)) {
  const raw = await readFile(
    new URL(entry.baseUrl + entry.files.graph.file, publicRoot),
  );
  const graph = JSON.parse(raw.toString("utf8"));
  chapters.push({
    chapterId: Number(id),
    contractVersion: entry.contractVersion,
    file: `${entry.baseUrl.replace("assets/chapters/", "")}${entry.files.graph.file}`,
    baseHash: createHash("sha256").update(raw).digest("hex"),
    nodeCount: graph.nodes.length,
    editableFieldCount: graph.nodes.flatMap(storyTextFields).length,
  });
}
const path = new URL("assets/chapters/story-content-manifest.json", publicRoot);
const data = JSON.stringify({ allowlistVersion: 1, chapters }, null, 2) + "\n";
if (process.argv.includes("--check")) {
  if ((await readFile(path, "utf8")) !== data)
    throw new Error("Stale story content manifest");
} else {
  // Avoid triggering a Vite full reload when dev/test/build share the same baseline.
  let previous = null;
  try {
    previous = await readFile(path, "utf8");
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
  if (previous !== data) await writeFile(path, data, "utf8");
}
console.log(
  `Story content manifest: ${chapters.length} chapter(s) — ${fileURLToPath(path)}`,
);
