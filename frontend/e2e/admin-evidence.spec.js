import { readFileSync } from 'node:fs'
import { expect, test } from '@playwright/test'

const { records } = JSON.parse(
  readFileSync(
    new URL('../public/assets/chapters/chapter1/evidence.json', import.meta.url),
    'utf8',
  ),
)
const canonicalRows = () =>
  records.map((record, index) => ({
    id: index + 1,
    chapterId: 1,
    evidenceCode: record.id,
    evidenceName: record.name,
    description: record.text,
    imageUrl: null,
  }))

// These UI tests isolate the existing API. They do not write to the user's database.
async function mockCatalog(page, rows = []) {
  await page.route('**/api/auth/session', (route) =>
    route.fulfill({
      json: {
        maintenance: {
          serverNow: new Date().toISOString(),
          active: false,
          scheduled: false,
          startsAt: null,
          message: '',
          revision: 0,
        },
      },
    }),
  )
  const state = {
    rows,
    calls: { create: 0, update: 0, remove: 0, seed: 0 },
    unavailable: false,
    deleteFails: false,
  }
  await page.addInitScript(() => {
    localStorage.setItem(
      'theUnspoken.auth.v1',
      JSON.stringify({
        token: 'evidence-ui-test',
        username: 'evidence-ui-test',
        role: 'ROLE_ADMIN',
      }),
    )
  })
  await page.route('**/api/admin/evidence**', async (route) => {
    const method = route.request().method()
    const pathname = new URL(route.request().url()).pathname
    const reply = (json, status = 200) => route.fulfill({ status, json })
    if (method === 'GET') {
      return state.unavailable ? reply({ message: 'Catalog unavailable' }, 503) : reply(state.rows)
    }
    if (method === 'POST' && pathname.endsWith('/seed-chapter1')) {
      state.calls.seed += 1
      const codes = new Set(state.rows.map((row) => row.evidenceCode))
      state.rows.push(...canonicalRows().filter((row) => !codes.has(row.evidenceCode)))
      return reply(state.rows)
    }
    if (method === 'POST') {
      state.calls.create += 1
      const row = { ...route.request().postDataJSON(), id: 100 + state.calls.create }
      state.rows.push(row)
      return reply(row, 201)
    }
    const id = Number(pathname.split('/').at(-1))
    if (method === 'PUT') {
      state.calls.update += 1
      const row = { ...route.request().postDataJSON(), id }
      state.rows = state.rows.map((item) => (item.id === id ? row : item))
      return reply(row)
    }
    if (method === 'DELETE') {
      state.calls.remove += 1
      if (state.deleteFails) return reply({ message: 'Delete unavailable' }, 503)
      state.rows = state.rows.filter((item) => item.id !== id)
      return reply({ message: 'Deleted' })
    }
    throw new Error(`Unexpected evidence request: ${method} ${pathname}`)
  })
  return state
}

async function decide(page, button, accept, expectedMessage) {
  const pending = page.waitForEvent('dialog')
  const click = button.click()
  const dialog = await pending
  const message = dialog.message()
  if (accept) await dialog.accept()
  else await dialog.dismiss()
  await click
  expect(message).toContain(expectedMessage)
}

test('evidence catalog confirms seed and delete and restores missing status after deletion', async ({
  page,
}, testInfo) => {
  const state = await mockCatalog(page)
  await page.goto('/admin/evidence')
  const status = page.getByRole('status')
  await expect(status).toHaveText('Chương 1: Chưa nạp (0/12)')
  await expect(page.getByRole('article')).toHaveCount(12)
  await expect(page.getByRole('button', { name: 'Xóa', exact: true })).toHaveCount(0)
  const seed = page.getByRole('button', { name: 'Nạp 12 chứng cứ còn thiếu', exact: true })
  await decide(page, seed, false, 'Nạp 12 chứng cứ chuẩn Chương 1')
  expect(state.calls.seed).toBe(0)
  await expect(status).toHaveText('Chương 1: Chưa nạp (0/12)')
  await decide(page, seed, true, 'Nạp 12 chứng cứ chuẩn Chương 1')
  await expect(status).toHaveText('Chương 1: Đã nạp đủ (12/12)')
  await expect(page.getByRole('button', { name: 'Đã nạp đủ 12/12', exact: true })).toBeDisabled()
  expect(state.calls.seed).toBe(1)

  const first = page.getByRole('article', { name: records[0].id, exact: true })
  const remove = first.getByRole('button', { name: 'Xóa', exact: true })
  await decide(page, remove, false, records[0].id)
  expect(state.calls.remove).toBe(0)
  state.deleteFails = true
  await decide(page, remove, true, records[0].id)
  await expect(page.getByRole('alert')).toHaveText('Delete unavailable')
  await expect(status).toHaveText('Chương 1: Đã nạp đủ (12/12)')
  state.deleteFails = false
  await decide(page, remove, true, records[0].id)
  await expect(status).toHaveText('Chương 1: Đã nạp một phần (11/12)')
  await expect(first.getByText('Chưa nạp', { exact: true })).toBeVisible()
  await expect(first.getByRole('button', { name: 'Xóa', exact: true })).toHaveCount(0)
  await page.reload()
  await expect(status).toHaveText('Chương 1: Đã nạp một phần (11/12)')
  await page.screenshot({ path: testInfo.outputPath('evidence-desktop.png'), fullPage: true })
  await page.setViewportSize({ width: 390, height: 844 })
  await expect(status).toBeVisible()
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  )
  await page.screenshot({ path: testInfo.outputPath('evidence-mobile.png'), fullPage: true })
})

test('evidence catalog confirms create and update and sends the selected image only on save', async ({
  page,
}) => {
  const state = await mockCatalog(page)
  await page.goto('/admin/evidence')
  await page.getByRole('button', { name: '+ Thêm vật chứng mới', exact: true }).click()
  const form = page.getByRole('form', { name: 'Thêm vật chứng mới vào hệ thống' })
  await form.getByLabel('Mã định danh', { exact: false }).fill(records[0].id)
  await form.getByLabel('Tên hiển thị vật chứng').fill(records[0].name)
  await form.getByLabel('Mô tả chi tiết vật chứng').fill(records[0].text)
  await form.getByLabel('Chọn tệp ảnh vật chứng').setInputFiles({
    name: 'test-image.png',
    mimeType: 'image/png',
    buffer: Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=',
      'base64',
    ),
  })
  await expect(form.getByAltText('Xem trước vật chứng')).toHaveAttribute(
    'src',
    /^data:image\/webp;/,
  )
  expect(state.calls.create).toBe(0)
  const create = form.getByRole('button', { name: 'Tạo vật chứng', exact: true })
  await decide(page, create, false, `Thêm vật chứng "${records[0].name}"`)
  expect(state.calls.create).toBe(0)
  await expect(form).toBeVisible()
  await decide(page, create, true, records[0].id)
  await expect(page.getByRole('status')).toHaveText('Chương 1: Đã nạp một phần (1/12)')
  expect(state.calls.create).toBe(1)
  expect(state.rows[0].imageUrl).toMatch(/^data:image\/webp;/)
  await page.reload()
  const first = page.getByRole('article', { name: records[0].id, exact: true })
  await expect(first.getByRole('img', { name: records[0].name })).toHaveAttribute(
    'src',
    state.rows[0].imageUrl,
  )
  await first.getByRole('button', { name: 'Chỉnh sửa / Đổi ảnh' }).click()
  const editForm = page.getByRole('form', { name: 'Chỉnh sửa thông tin vật chứng' })
  await editForm.getByRole('button', { name: 'Gỡ ảnh', exact: true }).click()
  const save = editForm.getByRole('button', { name: 'Lưu thay đổi', exact: true })
  await decide(page, save, false, 'Cập nhật vật chứng')
  expect(state.calls.update).toBe(0)
  expect(state.rows[0].imageUrl).toMatch(/^data:image\/webp;/)
  await decide(page, save, true, records[0].id)
  await expect(first.getByText('Chưa có ảnh', { exact: true })).toBeVisible()
  expect(state.calls.update).toBe(1)
  expect(state.rows[0].imageUrl).toBeNull()
})

test('evidence catalog distinguishes connection or canonical catalog failure from an empty database', async ({
  page,
}) => {
  const state = await mockCatalog(page)
  state.unavailable = true
  await page.goto('/admin/evidence')
  await expect(page.getByRole('status')).toHaveText('Chưa kiểm tra được trạng thái nạp')
  await expect(page.getByRole('article')).toHaveCount(0)
  await expect(
    page.getByRole('button', { name: 'Nạp chứng cứ Chương 1', exact: true }),
  ).toBeDisabled()
  state.unavailable = false
  await page.getByRole('button', { name: 'Làm mới trạng thái' }).click()
  await expect(page.getByRole('status')).toHaveText('Chương 1: Chưa nạp (0/12)')
  await page.route('**/assets/chapters/chapter1/evidence.json', (route) =>
    route.fulfill({ json: { records: [] } }),
  )
  await page.getByRole('button', { name: 'Làm mới trạng thái' }).click()
  await expect(page.getByRole('status')).toHaveText('Chưa kiểm tra được trạng thái nạp')
  await expect(page.getByRole('article')).toHaveCount(0)
})
