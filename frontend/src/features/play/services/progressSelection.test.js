import { expect, it } from 'vitest'
import { progressCandidates } from './progressSelection'

const local = {
  currentChapter: 1,
  credibilityScore: 100,
  saveDataJson: '{"state":1}',
  savedAt: '2026-11-16T01:00:00Z',
}
it('never chooses between different local and server progress based on a clock', () => {
  const remote = { ...local, saveDataJson: '{"state":2}', updatedAt: '2026-11-17T01:00:00Z' }
  expect(progressCandidates(local, remote)).toEqual({ conflict: { local, remote } })
})
it('loads the single available copy without overwriting either store', () => {
  expect(progressCandidates(local, null)).toEqual({ snapshot: local })
  expect(progressCandidates(null, local)).toEqual({ snapshot: local })
  expect(progressCandidates(null, null)).toEqual({ snapshot: null })
})
it('does not ask for a choice when only timestamp metadata differs', () => {
  expect(progressCandidates(local, { ...local, updatedAt: '2026-11-15T01:00:00Z' })).toEqual({
    snapshot: local,
  })
})
