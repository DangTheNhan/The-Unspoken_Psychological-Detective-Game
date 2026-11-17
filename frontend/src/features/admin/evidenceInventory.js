/** Catalog presence is independent from an individual player's collected evidence. */
export function evidenceInventory(databaseRows, chapter1Records) {
  const codes = new Set(databaseRows.map((item) => item.evidenceCode))
  const missing = chapter1Records.filter((record) => !codes.has(record.id))
  return {
    expectedCount: chapter1Records.length,
    loadedCount: chapter1Records.length - missing.length,
    missingCount: missing.length,
    rows: [
      ...databaseRows.map((item) => ({ ...item, loaded: true })),
      ...missing.map((record) => ({
        id: `missing:${record.id}`,
        chapterId: 1,
        evidenceCode: record.id,
        evidenceName: record.name ?? record.title ?? record.id,
        description: record.text ?? '',
        imageUrl: null,
        loaded: false,
      })),
    ],
  }
}
