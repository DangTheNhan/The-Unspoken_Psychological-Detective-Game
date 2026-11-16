/** DEC-026: exact existing fields only; graph/state semantics never come from an override. */
export const STORY_TEXT_ALLOWLIST_VERSION = 1
const TEXT_TYPES = new Set(['dialogue', 'narration', 'action', 'ui'])
const CHOICE_TYPES = new Set(['choice', 'investigation', 'cross_examination', 'deduction'])

export function storyTextKey({ nodeId, field, choiceIndex }) {
  return JSON.stringify([nodeId, field, choiceIndex ?? null])
}

export function storyTextFields(node) {
  const fields = []
  if (TEXT_TYPES.has(node.type) && typeof node.text === 'string') {
    fields.push({ field: 'text', baseText: node.text, limit: 4000 })
  }
  if (CHOICE_TYPES.has(node.type)) {
    for (const [choiceIndex, choice] of (node.choices ?? []).entries()) {
      if (typeof choice.text === 'string') {
        fields.push({ field: 'choiceText', choiceIndex, baseText: choice.text, limit: 500 })
      }
    }
  }
  return fields
}

/** A rejected bundle is never partially applied. The cached base is never modified. */
export function applyStoryText(graph, overrides) {
  if (!Array.isArray(overrides)) throw new Error('Invalid story text overrides')
  const copy = structuredClone(graph)
  const nodes = new Map(copy.nodes.map((node) => [node.id, node]))
  const seen = new Set()
  for (const entry of overrides) {
    if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
      throw new Error('Invalid story text entry')
    }
    const keys =
      entry.field === 'choiceText'
        ? ['nodeId', 'field', 'choiceIndex', 'value']
        : ['nodeId', 'field', 'value']
    if (Object.keys(entry).some((key) => !keys.includes(key))) {
      throw new Error('Story text contains a forbidden field')
    }
    const node = nodes.get(entry.nodeId)
    const target =
      node &&
      storyTextFields(node).find(
        (field) => field.field === entry.field && field.choiceIndex === entry.choiceIndex,
      )
    const key = storyTextKey(entry)
    if (!target || seen.has(key)) throw new Error('Unknown or duplicate story text target')
    if (
      typeof entry.value !== 'string' ||
      !entry.value.trim() ||
      [...entry.value].length > target.limit
    ) {
      throw new Error('Invalid story text value')
    }
    seen.add(key)
    if (entry.field === 'text') node.text = entry.value
    else node.choices[entry.choiceIndex].text = entry.value
  }
  return copy
}

export async function storyTextBaseHash(raw) {
  const hash = await globalThis.crypto.subtle.digest('SHA-256', new TextEncoder().encode(raw))
  return [...new Uint8Array(hash)].map((byte) => byte.toString(16).padStart(2, '0')).join('')
}
