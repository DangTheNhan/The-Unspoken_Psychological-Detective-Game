import { httpClient } from '@/shared/api/httpClient'
import { ENDPOINTS } from '@/shared/api/endpoints'

export async function fetchChapters() {
  return (await httpClient.get(ENDPOINTS.admin.storyChapters)).data
}
export async function fetchNodes(id) {
  return (await httpClient.get(ENDPOINTS.admin.storyNodes(id))).data
}
export async function fetchDraft(id) {
  return (await httpClient.get(ENDPOINTS.admin.storyDraft(id))).data
}
export async function saveDraft(id, body) {
  return (await httpClient.put(ENDPOINTS.admin.storyDraft(id), body)).data
}
export async function validateDraft(id, body) {
  return (await httpClient.post(ENDPOINTS.admin.storyValidate(id), body)).data
}
export async function previewDraft(id, body) {
  return (await httpClient.post(ENDPOINTS.admin.storyPreview(id), body)).data
}
export async function publishDraft(id, body) {
  return (await httpClient.post(ENDPOINTS.admin.storyPublish(id), body)).data
}
export async function fetchVersions(id) {
  return (await httpClient.get(ENDPOINTS.admin.storyVersions(id))).data
}
export async function fetchVersion(id, version) {
  return (await httpClient.get(ENDPOINTS.admin.storyVersion(id, version))).data
}
export async function restoreVersion(id, version, body) {
  return (await httpClient.post(ENDPOINTS.admin.storyRestore(id, version), body)).data
}
