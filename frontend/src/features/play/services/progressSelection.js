/** Compare content, not timestamps: different progress always requires a human choice. */
export function progressCandidates(local, remote) {
  if (!local) return remote ? { snapshot: remote } : { snapshot: null }
  if (!remote) return { snapshot: local }
  if (
    local.currentChapter === remote.currentChapter &&
    local.credibilityScore === remote.credibilityScore &&
    local.saveDataJson === remote.saveDataJson
  )
    return { snapshot: local }
  return { conflict: { local, remote } }
}
