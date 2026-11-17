// Read-only input, merged JSON on stdout. The Python wrapper owns the temporary output.
import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import {
  applyStoryText,
  STORY_TEXT_ALLOWLIST_VERSION,
} from "../../frontend/src/game/narrative/storyText.js";

const [graphFile, overridesFile] = process.argv.slice(2);
if (!graphFile || !overridesFile)
  throw new Error("Usage: merge-story-text.mjs graph.json overrides.json");
const raw = await readFile(graphFile);
const graph = JSON.parse(raw.toString("utf8"));
const input = JSON.parse(await readFile(overridesFile, "utf8"));
let entries = input;
if (!Array.isArray(input)) {
  if (
    input.chapterId !== graph.chapter ||
    input.contractVersion !== graph.contractVersion ||
    input.allowlistVersion !== STORY_TEXT_ALLOWLIST_VERSION ||
    input.baseHash !== createHash("sha256").update(raw).digest("hex")
  ) {
    throw new Error("Publication does not match this chapter baseline");
  }
  entries = input.overrides;
}
const merged = applyStoryText(graph, entries);
// Revert approved paths on another copy to prove the complete remaining structure matches.
const restored = structuredClone(merged);
for (const entry of entries) {
  const source = graph.nodes.find((n) => n.id === entry.nodeId);
  const node = restored.nodes.find((n) => n.id === entry.nodeId);
  if (entry.field === "text") node.text = source.text;
  else
    node.choices[entry.choiceIndex].text =
      source.choices[entry.choiceIndex].text;
}
if (JSON.stringify(restored) !== JSON.stringify(graph))
  throw new Error("Non-text graph change");
process.stdout.write(JSON.stringify(merged));
