import { readFileSync } from 'node:fs'
import { describe, expect, it, vi } from 'vitest'
import { loadStoryText } from './storyTextService'

const graph = JSON.parse(
  readFileSync(
    new URL('../../../../public/assets/chapters/chapter1/chapter1.json', import.meta.url),
    'utf8',
  ),
)
const node = graph.nodes.find((n) => n.type === 'dialogue')
const input = { chapterId: 1, baseHash: 'hash', contractVersion: '2.0.0', graph }
const published = {
  chapterId: 1,
  baseHash: 'hash',
  contractVersion: '2.0.0',
  allowlistVersion: 1,
  versionId: 1,
  overrides: [{ nodeId: node.id, field: 'text', value: node.text + '\n' }],
}
function memory() {
  const entries = new Map()
  return {
    get: (key) => entries.get(key),
    set: (key, value) => entries.set(key, value),
    remove: (key) => entries.delete(key),
  }
}
const offline = () => Promise.reject({ isNetworkError: true })

describe('published story text delivery', () => {
  it('loads only published text, caches it, and pins an independent graph per session', async () => {
    const cache = memory()
    const first = await loadStoryText(input, { cache, fetchBundle: async () => published })
    expect(first.status).toBe('published')
    const cached = await loadStoryText(input, { cache, fetchBundle: offline })
    expect(cached.status).toBe('cached')
    expect(cached.graph).toEqual(first.graph)
    await loadStoryText(input, {
      cache,
      fetchBundle: async () => ({ ...published, versionId: null, overrides: [] }),
    })
    expect(first.graph.nodes.find((n) => n.id === node.id).text).toBe(node.text + '\n')
    expect((await loadStoryText(input, { cache, fetchBundle: offline })).status).toBe('offlineBase')
  })
  it('does not reuse cached patches across graph hashes or allowlist versions', async () => {
    const cache = memory()
    await loadStoryText(input, { cache, fetchBundle: async () => published })
    const result = await loadStoryText(
      { ...input, baseHash: 'new-hash' },
      { cache, fetchBundle: offline },
    )
    expect(result.status).toBe('offlineBase')
    expect(result.graph).toEqual(graph)
  })
  it.each([
    { ...published, baseHash: 'stale' },
    { ...published, allowlistVersion: 2 },
    { ...published, versionId: null },
    { ...published, overrides: [{ ...published.overrides[0], next: 'bad' }] },
  ])('rejects invalid complete publications without partial application', async (bundle) => {
    const result = await loadStoryText(input, { cache: memory(), fetchBundle: async () => bundle })
    expect(result.status).toBe('rejected')
    expect(result.graph).toEqual(graph)
  })
  it('does not treat auth/hash rejection as offline permission to use cached content', async () => {
    const cache = memory()
    await loadStoryText(input, { cache, fetchBundle: async () => published })
    const fetchBundle = vi.fn().mockRejectedValue({ status: 409 })
    const result = await loadStoryText(input, { cache, fetchBundle })
    expect(result.status).toBe('rejected')
    expect(result.graph).toEqual(graph)
  })
})
