import { readFileSync } from 'node:fs'
import { expect, test } from '@playwright/test'

// Run against an isolated MySQL-backed backend, never require it for the canvas-only tests.
const api = process.env.STORY_TEST_API
const graph = JSON.parse(
  readFileSync(
    new URL('../public/assets/chapters/chapter1/chapter1.json', import.meta.url),
    'utf8',
  ),
)
const firstLine = graph.nodes.find((n) => n.type === 'dialogue')

test('Admin drafts, reviews, publishes and restores; players see only published text', async ({
  page,
  request,
}) => {
  test.skip(!api, 'Set STORY_TEST_API to the isolated backend URL')
  test.setTimeout(90_000)
  page.setDefaultTimeout(15_000)
  const errors = []
  page.on('pageerror', (e) => errors.push(e.message))
  const login = await request.post(`${api}/auth/login`, {
    data: {
      username: process.env.ADMIN_USERNAME || 'admin',
      password: process.env.ADMIN_PASSWORD || 'admin123',
    },
  })
  expect(login.ok()).toBe(true)
  const admin = await login.json()
  expect(admin.role).toBe('ROLE_ADMIN')
  const username = `story_test_${Date.now()}`
  expect(
    (
      await request.post(`${api}/auth/register`, {
        data: { username, email: `${username}@test.local`, password: 'Story-Test-Only-2026' },
      })
    ).status(),
  ).toBe(201)
  const player = await (
    await request.post(`${api}/auth/login`, {
      data: { username, password: 'Story-Test-Only-2026' },
    })
  ).json()
  const ah = { Authorization: `Bearer ${admin.token}` }
  const ph = { Authorization: `Bearer ${player.token}` }
  const chapter = (
    await (await request.get(`${api}/admin/story/chapters`, { headers: ah })).json()
  )[0]
  expect(chapter.editableFieldCount).toBe(813)
  // The explicitly supplied backend is disposable; start every run from a published baseline.
  const draftUrl = `${api}/admin/story/chapters/1`
  const initialDraft = await (await request.get(`${draftUrl}/draft`, { headers: ah })).json()
  const cleared = await (
    await request.put(`${draftUrl}/draft`, {
      headers: ah,
      data: {
        baseHash: chapter.baseHash,
        expectedDraftRevision: initialDraft.draftRevision,
        overrides: [],
      },
    })
  ).json()
  const checkBody = { baseHash: chapter.baseHash, draftRevision: cleared.draftRevision }
  const validation = await (
    await request.post(`${draftUrl}/draft/validate`, { headers: ah, data: checkBody })
  ).json()
  const preview = await (
    await request.post(`${draftUrl}/draft/preview`, { headers: ah, data: checkBody })
  ).json()
  expect(
    (
      await request.post(`${draftUrl}/publish`, {
        headers: ah,
        data: {
          ...checkBody,
          expectedPublishedVersionId: cleared.publishedVersionId,
          validationFingerprint: validation.validationFingerprint,
          previewFingerprint: preview.previewFingerprint,
        },
      })
    ).ok(),
  ).toBe(true)

  expect((await request.get(`${api}/admin/story/chapters`, { headers: ph })).status()).toBe(403)
  expect((await request.get(`${api}/admin/story/chapters`)).status()).toBe(401)
  expect(
    (await request.put(`${api}/admin/story/chapters/1/draft`, { headers: ph, data: {} })).status(),
  ).toBe(403)
  const bad = await request.put(`${api}/admin/story/chapters/1/draft`, {
    headers: ah,
    data: {
      baseHash: chapter.baseHash,
      expectedDraftRevision: 0,
      overrides: [
        { nodeId: firstLine.id, field: 'text', value: firstLine.text, next: 'CH2_ENTRY' },
      ],
    },
  })
  expect(bad.status()).toBe(400)
  const published = async () =>
    (
      await request.get(`${api}/game/chapters/1/story-text?baseHash=${chapter.baseHash}`, {
        headers: ph,
      })
    ).json()
  expect((await published()).overrides).toEqual([])
  await page.addInitScript((session) => {
    localStorage.setItem('theUnspoken.auth.v1', JSON.stringify(session))
    localStorage.setItem('theUnspoken.settings.v1', JSON.stringify({ textSpeed: 'instant' }))
  }, admin)
  await page.goto('/admin/story-content')
  const selectLine = async () => {
    await page.getByRole('searchbox', { name: 'Tìm phân đoạn' }).fill(firstLine.id)
    await page.getByRole('button', { name: new RegExp(firstLine.id) }).click()
  }
  await selectLine()
  const text = page.getByRole('textbox', { name: 'Nội dung bản nháp' })
  await expect(text).toHaveValue(firstLine.text)
  await text.fill(firstLine.text + '\n')
  await page.getByRole('button', { name: 'Lưu bản nháp', exact: true }).click()
  await expect(page.getByText('Đã lưu bản nháp. Nội dung đang dùng chưa thay đổi.')).toBeVisible()
  expect((await published()).overrides).toEqual([])
  await page.reload()
  await selectLine()
  await expect(text).toHaveValue(firstLine.text + '\n')
  const stale = await request.put(`${api}/admin/story/chapters/1/draft`, {
    headers: ah,
    data: { baseHash: chapter.baseHash, expectedDraftRevision: 0, overrides: [] },
  })
  expect(stale.status()).toBe(409)
  await page.getByRole('button', { name: 'Kiểm tra', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'Bản nháp hợp lệ' })).toBeVisible()
  await page.getByRole('button', { name: 'Xem trước', exact: true }).click()
  await page.getByRole('checkbox', { name: 'Tôi đã rà soát' }).check()
  await page.getByRole('button', { name: 'Xuất bản', exact: true }).click()
  await expect(page.getByText(/Đã xuất bản #/)).toBeVisible()
  const v1 = await published()
  expect(v1.overrides).toEqual([
    { nodeId: firstLine.id, field: 'text', value: firstLine.text + '\n' },
  ])
  expect(v1).not.toHaveProperty('draftRevision')
  await page.screenshot({ path: 'node_modules/.cache/story-content-desktop.png', fullPage: true })
  await page.setViewportSize({ width: 390, height: 844 })
  await expect(page.getByRole('button', { name: 'Lưu bản nháp', exact: true })).toBeVisible()
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  await page.screenshot({ path: 'node_modules/.cache/story-content-mobile.png', fullPage: true })
  await page.setViewportSize({ width: 1280, height: 800 })

  // A separate real player browser confirms session pinning and saved-game continuation.
  const context = await page
    .context()
    .browser()
    .newContext({ viewport: { width: 1280, height: 800 } })
  const game = await context.newPage()
  game.setDefaultTimeout(15_000)
  game.on('pageerror', (e) => errors.push(e.message))
  await game.addInitScript((session) => {
    localStorage.setItem('theUnspoken.auth.v1', JSON.stringify(session))
    localStorage.setItem('theUnspoken.settings.v1', JSON.stringify({ textSpeed: 'instant' }))
  }, player)
  await game.goto('/admin/story-content')
  await expect(game).toHaveURL(/\/play$/)
  await expect(game.getByRole('heading', { name: 'Nội dung kịch bản', exact: true })).toHaveCount(0)
  await game.waitForFunction(() => window.__THE_UNSPOKEN__?.game.scene.isActive('MainMenuScene'))
  await game.keyboard.press('Enter')
  await game.evaluate(() => new Promise(requestAnimationFrame))
  await game.waitForFunction(() =>
    window.__THE_UNSPOKEN__?.game.scene.isActive('RoomInvestigationScene'),
  )
  await game.keyboard.press('Escape')
  await game.evaluate(() => new Promise(requestAnimationFrame))
  await game.getByRole('button', { name: 'Bỏ qua hướng dẫn', exact: true }).click()
  await game.keyboard.press('Enter')
  await game.waitForFunction(() => window.__THE_UNSPOKEN__?.game.scene.isActive('StoryScene'))
  expect(await game.evaluate(() => window.__THE_UNSPOKEN__.runtime.story.node.text)).toBe(
    firstLine.text + '\n',
  )
  const save = await game.evaluate(() => window.__THE_UNSPOKEN__.runtime.session.toSaveSnapshot())

  page.once('dialog', (d) => d.accept())
  await page.getByRole('button', { name: 'Về chữ gốc', exact: true }).click()
  await page.getByRole('button', { name: 'Lưu bản nháp', exact: true }).click()
  await expect(page.getByText('Đã lưu bản nháp. Nội dung đang dùng chưa thay đổi.')).toBeVisible()
  await page.getByRole('button', { name: 'Kiểm tra', exact: true }).click()
  await page.getByRole('button', { name: 'Xem trước', exact: true }).click()
  await page.getByRole('checkbox', { name: 'Tôi đã rà soát' }).check()
  await page.getByRole('button', { name: 'Xuất bản', exact: true }).click()
  await expect(page.getByText(/Đã xuất bản #/)).toBeVisible()
  const v2 = await published()
  expect(v2.overrides).toEqual([])
  expect(v2.versionId).not.toBe(v1.versionId)
  expect(await game.evaluate(() => window.__THE_UNSPOKEN__.runtime.story.node.text)).toBe(
    firstLine.text + '\n',
  )

  await game.evaluate(
    ({ save, username }) =>
      localStorage.setItem(
        `theUnspoken.save.backup.v1.${encodeURIComponent(username)}`,
        JSON.stringify(save),
      ),
    { save, username },
  )
  await game.reload()
  await game.waitForFunction(() => window.__THE_UNSPOKEN__?.game.scene.isActive('MainMenuScene'))
  await game.keyboard.press('ArrowDown')
  await game.evaluate(() => new Promise(requestAnimationFrame))
  await game.keyboard.press('Enter')
  await game.waitForFunction(() => window.__THE_UNSPOKEN__?.game.scene.isActive('StoryScene'))
  expect(await game.evaluate(() => window.__THE_UNSPOKEN__.runtime.story.node.text)).toBe(
    firstLine.text,
  )
  expect(await game.evaluate(() => window.__THE_UNSPOKEN__.runtime.story.state.current_node)).toBe(
    firstLine.id,
  )
  await context.close()

  const rows = page.locator('.story-history-row')
  const firstVersion = rows.filter({ has: page.getByText(`#${v1.versionId}`, { exact: true }) })
  page.once('dialog', (d) => d.accept())
  await firstVersion.getByRole('button', { name: 'Khôi phục vào nháp', exact: true }).click()
  await expect(
    page.getByText('Đã khôi phục vào nháp. Hãy kiểm tra, xem trước và xuất bản để áp dụng.'),
  ).toBeVisible()
  expect((await published()).versionId).toBe(v2.versionId)
  const restored = await (
    await request.get(`${api}/admin/story/chapters/1/draft`, { headers: ah })
  ).json()
  expect(restored.overrides).toEqual(v1.overrides)
  expect(restored.validationFingerprint).toBeNull()
  expect(errors).toEqual([])
})
