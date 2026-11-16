import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { applyStoryText, storyTextBaseHash, storyTextFields } from './storyText'

const raw = readFileSync(
  new URL('../../../public/assets/chapters/chapter1/chapter1.json', import.meta.url),
  'utf8',
)
const graph = JSON.parse(raw)
const manifest = JSON.parse(
  readFileSync(
    new URL('../../../public/assets/chapters/story-content-manifest.json', import.meta.url),
    'utf8',
  ),
)
const dialogue = graph.nodes.find((n) => n.type === 'dialogue')
const edit = { nodeId: dialogue.id, field: 'text', value: dialogue.text + '\n' }

describe('story text preserves the exact shipped graph', () => {
  it('identifies 813 fields, excluding hotspots and notebook updates', async () => {
    expect(graph.nodes.flatMap(storyTextFields)).toHaveLength(813)
    expect(storyTextFields(graph.nodes.find((n) => n.type === 'notebook_update'))).toEqual([])
    expect(await storyTextBaseHash(raw)).toBe(manifest.chapters[0].baseHash)
  })
  it('changes only existing allowed strings and never mutates base or earlier session copies', () => {
    const original = JSON.stringify(graph)
    const merged = applyStoryText(graph, [edit])
    expect(merged.nodes.find((n) => n.id === dialogue.id).text).toBe(edit.value)
    merged.nodes.find((n) => n.id === dialogue.id).text = dialogue.text
    expect(merged).toEqual(graph)
    expect(JSON.stringify(graph)).toBe(original)
    const session = applyStoryText(graph, [edit])
    applyStoryText(graph, [])
    expect(session.nodes.find((n) => n.id === dialogue.id).text).toBe(edit.value)
  })
  it.each([
    { ...edit, effects: [] },
    { ...edit, field: 'speaker' },
    { ...edit, nodeId: 'unknown' },
    { ...edit, field: 'choiceText', choiceIndex: 0 },
    { ...edit, choiceIndex: 0 },
    { ...edit, value: null },
    { ...edit, value: '  ' },
    { ...edit, value: 'a'.repeat(4001) },
    { ...edit, field: 'hotspotText', choiceIndex: 0 },
  ])('rejects malformed or forbidden edits atomically: %j', (bad) => {
    const original = JSON.stringify(graph)
    expect(() => applyStoryText(graph, [edit, bad])).toThrow()
    expect(JSON.stringify(graph)).toBe(original)
  })
  it('rejects duplicate targets and handles choice labels without changing routes', () => {
    expect(() => applyStoryText(graph, [edit, edit])).toThrow()
    const node = graph.nodes.find((n) => n.type === 'choice')
    const patched = applyStoryText(graph, [
      { nodeId: node.id, field: 'choiceText', choiceIndex: 0, value: node.choices[0].text + '\n' },
    ])
    expect(patched.nodes.find((n) => n.id === node.id).choices[0].targetNode).toBe(
      node.choices[0].targetNode,
    )
    expect(() =>
      applyStoryText(graph, [
        { nodeId: node.id, field: 'choiceText', choiceIndex: 999, value: 'invalid' },
      ]),
    ).toThrow()
  })
})
