import { httpClient } from '@/shared/api/httpClient'
import { ENDPOINTS } from '@/shared/api/endpoints'
import { storage } from '@/shared/storage/storage'
import { STORAGE_KEYS } from '@/shared/storage/storageKeys'
import { applyStoryText, STORY_TEXT_ALLOWLIST_VERSION } from '@/game/narrative/storyText'

export async function fetchPublishedStoryText(chapterId, baseHash) {
  return (
    await httpClient.get(ENDPOINTS.game.storyText(chapterId), {
      params: { baseHash },
      timeout: 5000,
    })
  ).data
}

/** Isolated from saved progress. An explicit empty server release clears a stale cache. */
export async function loadStoryText(
  input,
  { fetchBundle = fetchPublishedStoryText, cache = storage } = {},
) {
  const { chapterId, baseHash, contractVersion, graph } = input
  const key = `${STORAGE_KEYS.STORY_TEXT_CACHE}.${chapterId}.${baseHash}.${STORY_TEXT_ALLOWLIST_VERSION}`
  function checked(bundle) {
    if (
      !bundle ||
      bundle.chapterId !== chapterId ||
      bundle.baseHash !== baseHash ||
      bundle.contractVersion !== contractVersion ||
      bundle.allowlistVersion !== STORY_TEXT_ALLOWLIST_VERSION ||
      !(
        bundle.versionId === null ||
        (Number.isSafeInteger(bundle.versionId) && bundle.versionId > 0)
      ) ||
      (bundle.versionId === null && bundle.overrides?.length !== 0)
    ) {
      throw new Error('Incompatible story publication')
    }
    return applyStoryText(graph, bundle.overrides)
  }
  let bundle
  try {
    bundle = await fetchBundle(chapterId, baseHash)
  } catch (error) {
    if (error.isNetworkError || error.status >= 500) {
      const cached = cache.get(key)
      if (cached) {
        try {
          return { graph: checked(cached), versionId: cached.versionId, status: 'cached' }
        } catch {
          cache.remove(key)
        }
      }
      return { graph: applyStoryText(graph, []), versionId: null, status: 'offlineBase' }
    }
    return { graph: applyStoryText(graph, []), versionId: null, status: 'rejected' }
  }
  try {
    const effective = checked(bundle)
    if (bundle.versionId === null) cache.remove(key)
    else cache.set(key, bundle)
    return {
      graph: effective,
      versionId: bundle.versionId,
      status: bundle.versionId === null ? 'base' : 'published',
    }
  } catch {
    cache.remove(key)
    return { graph: applyStoryText(graph, []), versionId: null, status: 'rejected' }
  }
}
