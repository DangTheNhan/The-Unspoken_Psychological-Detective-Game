import { expect, it } from 'vitest'
import { filterStoryNodes, storyNodeTypes } from './storyContentFilters'
import { storyTextKey } from '@/game/narrative/storyText'

const field = { field: 'text', baseText: 'base-fixture' }
const nodes = [
  { nodeId: 'editable', type: 'dialogue', speaker: 'fixture', fields: [field] },
  { nodeId: 'readonly', type: 'router', fields: [] },
  { nodeId: 'empty-dialogue', type: 'dialogue', fields: [] },
]
const options = { editableOnly: true, type: '', query: '', edits: {} }

it('offers only types with permitted fields by default, including future server-provided types', () => {
  expect(storyNodeTypes(nodes)).toEqual(['dialogue'])
  expect(storyNodeTypes(nodes, false)).toEqual(['router', 'dialogue'])
  expect(storyNodeTypes([{ type: 'future-type', fields: [field] }])).toEqual(['future-type'])
  expect(storyNodeTypes()).toEqual([])
})
it('searches Vietnamese labels and unsaved text without changing fields or node identities', () => {
  const edits = { [storyTextKey({ nodeId: 'editable', ...field })]: { value: 'draft-fixture' } }
  for (const query of ['Hội thoại', 'dialogue', 'draft-fixture', 'editable']) {
    expect(filterStoryNodes(nodes, { ...options, query, edits })).toEqual([nodes[0]])
  }
  expect(nodes[0].fields[0].baseText).toBe('base-fixture')
  expect(edits[storyTextKey({ nodeId: 'editable', ...field })].value).toBe('draft-fixture')
})
it('keeps read-only records searchable only in the expanded scope', () => {
  expect(filterStoryNodes(nodes, { ...options, query: 'readonly' })).toEqual([])
  expect(filterStoryNodes(nodes, { ...options, editableOnly: false, query: 'readonly' })).toEqual([
    nodes[1],
  ])
  expect(filterStoryNodes(nodes, { ...options, editableOnly: false, type: 'dialogue' })).toEqual([
    nodes[0],
    nodes[2],
  ])
})
