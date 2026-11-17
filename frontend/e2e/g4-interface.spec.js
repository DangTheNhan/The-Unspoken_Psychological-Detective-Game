import { readFileSync } from 'node:fs'
import { expect, test } from '@playwright/test'
import { storyTextFields } from '../src/game/narrative/storyText.js'

const graph = JSON.parse(
  readFileSync(
    new URL('../public/assets/chapters/chapter1/chapter1.json', import.meta.url),
    'utf8',
  ),
)
const manifest = JSON.parse(
  readFileSync(
    new URL('../public/assets/chapters/story-content-manifest.json', import.meta.url),
    'utf8',
  ),
).chapters[0]
const nodes = graph.nodes.map((n) => ({
  nodeId: n.id,
  type: n.type,
  speaker: n.speaker ?? '',
  automaticallySkipped: ['action', 'narration'].includes(n.type),
  fields: storyTextFields(n),
}))
const first = nodes.find((n) => n.type === 'dialogue')
const firstText = first.fields[0].baseText
const changedText = firstText + '\n'
const edit = { nodeId: first.nodeId, field: 'text', value: changedText }
test.setTimeout(45_000)

async function setup(page, role = 'ROLE_ADMIN', mode = 'base') {
  const errors = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.addInitScript((role) => {
    localStorage.setItem(
      'theUnspoken.auth.v1',
      JSON.stringify({ token: 'g4-fixture', role, userId: 68, username: 'g4-ui' }),
    )
  }, role)
  const maintenance = () => ({
    active: false,
    scheduled: false,
    revision: 0,
    startsAt: null,
    message: '',
    serverNow: new Date().toISOString(),
  })
  const state = {
    nodes,
    mode,
    errors,
    saveFails: false,
    reportReads: 0,
    draft: {
      ...manifest,
      publishedVersionId: null,
      draftRevision: 0,
      overrides: [],
      updatedBy: null,
      updatedAt: null,
      validationFingerprint: null,
      previewFingerprint: null,
    },
    versions: [],
    saved: [],
    published: [],
    restored: [],
    failSave: false,
  }
  await page.route('**/api/**', (route) => {
    const path = new URL(route.request().url()).pathname
    if (!path.startsWith('/api/')) return route.continue()
    const method = route.request().method()
    const reply = (json, status = 200) => route.fulfill({ status, json })
    if (path.endsWith('/auth/session')) return reply({ maintenance: maintenance() })
    if (path.endsWith('/auth/config')) return reply({})
    if (path.endsWith('/system/status') || path === '/api/admin/maintenance')
      return reply(maintenance())
    if (path === '/api/admin/online') return reply({ onlineCount: 0, players: [] })
    if (path === '/api/admin/reports/bugs') {
      state.reportReads++
      return reply([])
    }
    if (path.endsWith('/game/save'))
      return state.saveFails
        ? reply({ message: 'G4 fixture save failure' }, 400)
        : reply({ message: 'Saved', updatedAt: new Date().toISOString() })
    if (path.endsWith('/story-text')) {
      if (state.mode === 'offline') return reply({ message: 'G4 fixture offline' }, 503)
      return reply({
        chapterId: 1,
        baseHash:
          state.mode === 'rejected'
            ? 'incompatible-fixture'
            : new URL(route.request().url()).searchParams.get('baseHash'),
        contractVersion: graph.contractVersion,
        allowlistVersion: 1,
        versionId: state.mode === 'base' ? null : 1,
        overrides: state.mode === 'base' ? [] : [edit],
      })
    }
    if (path === '/api/admin/story/chapters') return reply([manifest])
    if (path.endsWith('/nodes')) return reply(state.nodes)
    if (path.endsWith('/draft')) {
      if (method === 'PUT') {
        if (state.failSave) return reply({ message: 'G4 fixture save rejected' }, 409)
        const body = route.request().postDataJSON()
        state.saved.push(body)
        state.draft = {
          ...state.draft,
          overrides: body.overrides,
          draftRevision: state.draft.draftRevision + 1,
          updatedBy: 'g4-ui',
          updatedAt: '2026-11-17T01:00:00',
          validationFingerprint: null,
          previewFingerprint: null,
        }
      }
      return reply(state.draft)
    }
    if (path.endsWith('/draft/validate')) {
      state.draft.validationFingerprint = 'g4-validation'
      return reply({
        valid: true,
        errors: [],
        warnings: [],
        validationFingerprint: 'g4-validation',
      })
    }
    if (path.endsWith('/draft/preview')) {
      state.draft.previewFingerprint = 'g4-preview'
      return reply({
        draftRevision: state.draft.draftRevision,
        previewFingerprint: 'g4-preview',
        lines: state.draft.overrides.map((e) => ({
          ...e,
          type: first.type,
          baseText: firstText,
          speaker: first.speaker,
        })),
      })
    }
    if (path.endsWith('/publish')) {
      const body = route.request().postDataJSON()
      state.published.push(body)
      const version = {
        ...manifest,
        versionId: state.versions.length + 1,
        draftRevision: state.draft.draftRevision,
        overrides: structuredClone(state.draft.overrides),
        changedFieldCount: state.draft.overrides.length,
        publishedBy: 'g4-ui',
        publishedAt: '2026-11-17T01:00:00',
      }
      state.versions.unshift(version)
      state.draft.publishedVersionId = version.versionId
      return reply(version, 201)
    }
    if (path.endsWith('/versions')) return reply(state.versions)
    if (/\/versions\/\d+$/.test(path))
      return reply(state.versions.find((v) => v.versionId === Number(path.split('/').at(-1))))
    if (path.endsWith('/restore-draft')) {
      state.restored.push(route.request().postDataJSON())
      const id = Number(path.split('/').at(-2))
      state.draft = {
        ...state.draft,
        overrides: structuredClone(state.versions.find((v) => v.versionId === id).overrides),
        draftRevision: state.draft.draftRevision + 1,
        validationFingerprint: null,
        previewFingerprint: null,
      }
      return reply(state.draft)
    }
    return reply({ message: 'No G4 fixture data' }, 404)
  })
  return state
}

test('editor scopes its type list, preserves drafts and searches Vietnamese labels and read-only IDs', async ({
  page,
}, info) => {
  const state = await setup(page)
  await page.goto('/admin/story-content')
  await page.getByLabel('Tìm phân đoạn', { exact: true }).fill(first.nodeId)
  await page.locator('.story-node').filter({ hasText: first.nodeId }).first().click()
  await page.getByLabel('Tìm phân đoạn', { exact: true }).clear()
  const types = page.getByLabel('Loại phân đoạn', { exact: true })
  const manuscript = page.getByRole('region', { name: 'Biên tập phân đoạn' })
  const draft = page.getByRole('textbox', { name: 'Nội dung bản nháp', exact: true })
  await expect(types.locator('option')).toHaveCount(9)
  await expect(types.locator('option[value="router"]')).toHaveCount(0)
  await expect(types.locator('option[value="dialogue"]')).toHaveText('Hội thoại')
  await draft.fill(changedText)
  await expect(page.getByText('Có thay đổi chưa lưu', { exact: true })).toBeVisible()
  await types.selectOption('choice')
  await expect(manuscript).toContainText('Lựa chọn')
  await types.selectOption('dialogue')
  await page.getByLabel('Tìm phân đoạn', { exact: true }).fill(first.nodeId)
  await expect(draft).toHaveValue(changedText)
  await page.getByLabel('Tìm phân đoạn', { exact: true }).fill('Hội thoại')
  await expect(page.locator('.story-node')).toHaveCount(542)
  await page.getByLabel('Tìm phân đoạn', { exact: true }).clear()
  await page.getByText('Tra cứu nâng cao', { exact: true }).click()
  const scope = page.getByRole('checkbox', { name: 'Chỉ hiện phân đoạn có chữ được sửa' })
  await scope.uncheck()
  await expect(types.locator('option')).toHaveCount(17)
  await types.selectOption('router')
  const router = nodes.find((n) => n.type === 'router')
  await page.getByLabel('Tìm phân đoạn', { exact: true }).fill(router.nodeId)
  await expect(manuscript).toContainText('Phân đoạn chỉ đọc.')
  await expect(manuscript.getByRole('textbox')).toHaveCount(0)
  await page.getByLabel('Tìm phân đoạn', { exact: true }).clear()
  await scope.check()
  await expect(types).toHaveValue('')
  await expect(types.locator('option')).toHaveCount(9)
  await expect(draft).toHaveValue(changedText)
  await page.getByText('Tra cứu nâng cao', { exact: true }).click()
  await page.screenshot({ path: info.outputPath('g4-editor-desktop.png'), fullPage: true })
  await page.setViewportSize({ width: 390, height: 844 })
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  await page.screenshot({ path: info.outputPath('g4-editor-mobile.png'), fullPage: true })
  await page.setViewportSize({ width: 1280, height: 800 })
  await types.selectOption('choice')
  await page.getByRole('button', { name: 'Lưu bản nháp', exact: true }).click()
  state.nodes = nodes.filter((n) => n.type === 'dialogue')
  await page.getByRole('button', { name: 'Tải lại', exact: true }).click()
  await expect(types).toHaveValue('')
  await expect(manuscript).toContainText(first.nodeId)
  expect(state.saved[0].overrides).toEqual([edit])
  expect(state.errors).toEqual([])
})

test('editing still validates, reviews, publishes and restores with unchanged payloads and visible failures', async ({
  page,
}) => {
  const state = await setup(page)
  await page.goto('/admin/story-content')
  await page.getByLabel('Tìm phân đoạn', { exact: true }).fill(first.nodeId)
  await page.locator('.story-node').filter({ hasText: first.nodeId }).first().click()
  await page.getByLabel('Tìm phân đoạn', { exact: true }).clear()
  const draft = page.getByRole('textbox', { name: 'Nội dung bản nháp', exact: true })
  await draft.fill(changedText)
  state.failSave = true
  await page.getByRole('button', { name: 'Lưu bản nháp', exact: true }).click()
  await expect(page.getByRole('alert')).toContainText('G4 fixture save rejected')
  await expect(draft).toHaveValue(changedText)
  state.failSave = false
  await page.getByRole('button', { name: 'Lưu bản nháp', exact: true }).click()
  await expect(page.getByText('Đã lưu bản nháp. Nội dung đang dùng chưa thay đổi.')).toBeVisible()
  expect(state.saved).toEqual([
    { baseHash: manifest.baseHash, expectedDraftRevision: 0, overrides: [edit] },
  ])
  await expect(page.getByRole('button', { name: 'Xuất bản', exact: true })).toBeDisabled()
  await page.getByRole('button', { name: 'Kiểm tra', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'Bản nháp hợp lệ' })).toBeVisible()
  await page.getByRole('button', { name: 'Xem trước', exact: true }).click()
  await expect(page.getByRole('button', { name: 'Xuất bản', exact: true })).toBeDisabled()
  await page.getByRole('checkbox', { name: 'Tôi đã rà soát' }).check()
  await page.getByRole('button', { name: 'Xuất bản', exact: true }).click()
  await expect(page.getByText(/Đã xuất bản #1/)).toBeVisible()
  expect(state.published).toEqual([
    {
      baseHash: manifest.baseHash,
      draftRevision: 1,
      expectedPublishedVersionId: null,
      validationFingerprint: 'g4-validation',
      previewFingerprint: 'g4-preview',
    },
  ])
  page.once('dialog', (dialog) => dialog.accept())
  await page.getByRole('button', { name: 'Khôi phục vào nháp', exact: true }).click()
  await expect(
    page.getByText('Đã khôi phục vào nháp. Hãy kiểm tra, xem trước và xuất bản để áp dụng.'),
  ).toBeVisible()
  expect(state.restored).toEqual([{ baseHash: manifest.baseHash, expectedDraftRevision: 1 }])
  expect(state.draft.overrides).toEqual([edit])
  expect(state.draft.publishedVersionId).toBe(1)
  await expect(page.getByRole('button', { name: 'Xuất bản', exact: true })).toBeDisabled()
  expect(state.errors).toEqual([])
})

test('technical help collapses while refresh controls and online rules stay available', async ({
  page,
}, info) => {
  const state = await setup(page)
  await page.goto('/admin/bugs')
  await expect(
    page.getByRole('button', { name: 'Tự động cập nhật: Bật', exact: true }),
  ).toBeVisible()
  await expect(page.getByText('Khi bật, danh sách tự cập nhật mỗi 5 giây.')).toBeHidden()
  await page.getByText('Cách cập nhật báo lỗi', { exact: true }).click()
  await expect(page.getByText('Khi bật, danh sách tự cập nhật mỗi 5 giây.')).toBeVisible()
  await page.getByRole('button', { name: 'Tự động cập nhật: Bật', exact: true }).click()
  await expect(
    page.getByRole('button', { name: 'Tự động cập nhật: Tắt', exact: true }),
  ).toBeVisible()
  const reads = state.reportReads
  await page.getByRole('button', { name: 'Làm mới ngay' }).click()
  await expect.poll(() => state.reportReads).toBeGreaterThan(reads)
  await page.goto('/admin/operations')
  await expect(page.getByRole('heading', { name: 'Kết nối & Bảo trì', exact: true })).toBeVisible()
  const rules = page.getByText('Tự cập nhật mỗi 5 giây.', { exact: false })
  await expect(rules).toBeHidden()
  await page.screenshot({ path: info.outputPath('g4-operations-help.png'), fullPage: true })
  await page.getByText('Cách cập nhật trạng thái', { exact: true }).click()
  await expect(rules).toContainText('60 giây')
  await expect(rules).toBeVisible()
  await expect(page.getByLabel('Thời điểm bắt đầu', { exact: true })).toBeVisible()
  expect(state.errors).toEqual([])
})

async function emit(page, event, payload) {
  await page.evaluate(
    async ({ event, payload }) => {
      const { EventBus } = await import('/src/game/core/EventBus.js')
      EventBus.emit(event, payload)
    },
    { event, payload },
  )
}
async function changeLanguage(page, language) {
  await page.evaluate((language) => {
    const store = window.__THE_UNSPOKEN__.runtime.settings
    store.set({ ...store.get(), language })
  }, language)
}
async function startPlayer(page, mode) {
  const state = await setup(page, 'ROLE_PLAYER', mode)
  await page.goto('/play')
  await page.waitForFunction(() => window.__THE_UNSPOKEN__?.game.scene.isActive('MainMenuScene'))
  await page.keyboard.press('Enter')
  await page.waitForFunction(() =>
    window.__THE_UNSPOKEN__?.game.scene.isActive('RoomInvestigationScene'),
  )
  return state
}
const requestContent = (page) =>
  emit(page, 'story-text:requested', {
    requestId: 'g4-content-probe',
    chapterId: 1,
    baseHash: manifest.baseHash,
    contractVersion: graph.contractVersion,
    graph,
    language: 'vi',
  })
async function save(page) {
  await page.evaluate(async () => {
    const { EventBus } = await import('/src/game/core/EventBus.js')
    EventBus.emit('save:requested', {
      reason: 'g4-qa',
      snapshot: window.__THE_UNSPOKEN__.runtime.session.toSaveSnapshot(),
    })
  })
}

for (const mode of ['base', 'published']) {
  test(`successful ${mode} content stays loaded and pinned without a status banner or overwriting save feedback`, async ({
    page,
  }) => {
    const state = await startPlayer(page, mode)
    const actual = await page.evaluate((id) => {
      const content = window.__THE_UNSPOKEN__.runtime.storyContent
      return {
        status: content.status,
        version: content.versionId,
        text: content.graph.nodes.find((n) => n.id === id).text,
      }
    }, first.nodeId)
    expect(actual).toEqual({
      status: mode,
      version: mode === 'base' ? null : 1,
      text: mode === 'base' ? firstText : changedText,
    })
    await expect(
      page.getByText(/Đã nạp nội dung kịch bản|Đang dùng nội dung kịch bản gốc/),
    ).toHaveCount(0)
    await save(page)
    const saved = page.getByText('Đã lưu tiến trình lên máy chủ.', { exact: true })
    await expect(saved).toBeVisible()
    await changeLanguage(page, 'en')
    await expect(saved).toBeVisible()
    await expect(
      page.getByText(/Published story text loaded|Using the original story text/),
    ).toHaveCount(0)
    state.mode = 'base'
    await requestContent(page)
    await expect(saved).toBeVisible()
    expect(await page.evaluate(() => window.__THE_UNSPOKEN__.runtime.storyContent.versionId)).toBe(
      actual.version,
    )
    expect(state.errors).toEqual([])
  })
}

test('offline/incompatible warnings survive alongside save errors and translate independently', async ({
  page,
}, info) => {
  const state = await startPlayer(page, 'published')
  state.mode = 'offline'
  await requestContent(page)
  await expect(
    page.getByText('Mất kết nối: đang dùng bản nội dung đã lưu trên máy.', { exact: true }),
  ).toBeVisible()
  state.saveFails = true
  await save(page)
  const failed = page.getByText('Lưu thất bại: G4 fixture save failure', { exact: true })
  await expect(failed).toBeVisible()
  await changeLanguage(page, 'en')
  await expect(
    page.getByText('Offline: using previously saved published text.', { exact: true }),
  ).toBeVisible()
  await expect(failed).toBeVisible()
  state.mode = 'rejected'
  await requestContent(page)
  await expect(
    page.getByText('Không thể áp dụng bản cập nhật nội dung; đang dùng bản gốc.', { exact: true }),
  ).toBeVisible()
  await expect(failed).toBeVisible()
  state.mode = 'offline'
  await requestContent(page)
  await expect(
    page.getByText('Mất kết nối: đang dùng nội dung gốc của trò chơi.', { exact: true }),
  ).toBeVisible()
  await page.screenshot({ path: info.outputPath('g4-independent-warnings.png'), fullPage: true })
  expect(state.errors).toEqual([])
})
