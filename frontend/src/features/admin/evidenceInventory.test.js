import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { evidenceInventory } from './evidenceInventory'

const { records } = JSON.parse(
  readFileSync(
    new URL('../../../public/assets/chapters/chapter1/evidence.json', import.meta.url),
    'utf8',
  ),
)
const databaseRow = (record, index) => ({
  id: index + 1,
  chapterId: 1,
  evidenceCode: record.id,
  evidenceName: record.name,
  description: record.text,
  imageUrl: null,
})

describe('Admin evidence database inventory', () => {
  it('shows the supplied canonical records as missing when the database is empty', () => {
    const inventory = evidenceInventory([], records)
    expect(inventory).toMatchObject({ expectedCount: 12, loadedCount: 0, missingCount: 12 })
    expect(inventory.rows.map((row) => row.evidenceCode)).toEqual(
      records.map((record) => record.id),
    )
    expect(inventory.rows.every((row) => !row.loaded)).toBe(true)
    expect(inventory.rows[0].description).toBe(records[0].text)
  })

  it('counts canonical codes rather than the total number of database rows', () => {
    const otherRows = records.map((record, index) => ({
      ...databaseRow(record, index),
      evidenceCode: `test_${record.id}`,
    }))
    const inventory = evidenceInventory(otherRows, records)
    expect(inventory).toMatchObject({ loadedCount: 0, missingCount: 12 })
    expect(inventory.rows.filter((row) => row.loaded)).toHaveLength(12)
    expect(inventory.rows).toHaveLength(24)
  })

  it('uses global unique codes like the existing seed and preserves database values', () => {
    const row = { ...databaseRow(records[0], 0), chapterId: 2, imageUrl: '/test-image.webp' }
    const inventory = evidenceInventory([row], records)
    expect(inventory).toMatchObject({ loadedCount: 1, missingCount: 11 })
    expect(inventory.rows[0]).toEqual({ ...row, loaded: true })
    expect(inventory.rows.filter((item) => item.evidenceCode === row.evidenceCode)).toHaveLength(1)
    expect(row).not.toHaveProperty('loaded')
  })

  it('recalculates missing records after deletion without changing the canonical catalog', () => {
    const original = JSON.stringify(records)
    const rows = records.map(databaseRow)
    expect(evidenceInventory(rows, records)).toMatchObject({ loadedCount: 12, missingCount: 0 })
    const inventory = evidenceInventory(rows.slice(1), records)
    expect(inventory).toMatchObject({ loadedCount: 11, missingCount: 1 })
    expect(inventory.rows.find((row) => !row.loaded).evidenceCode).toBe(records[0].id)
    expect(JSON.stringify(records)).toBe(original)
  })
})
