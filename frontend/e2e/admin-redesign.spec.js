import { mkdirSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { expect, test } from '@playwright/test'
import { storyTextFields } from '../src/game/narrative/storyText.js'

// Isolated API fixtures only. The application still uses its real API adapters and data fields.
const readAsset = (path) => JSON.parse(readFileSync(new URL(path, import.meta.url), 'utf8'))
const graph = readAsset('../public/assets/chapters/chapter1/chapter1.json')
const manifest = readAsset('../public/assets/chapters/story-content-manifest.json').chapters[0]
const evidence = readAsset('../public/assets/chapters/chapter1/evidence.json').records.map(
  (record, index) => ({
    id: index + 1,
    chapterId: 1,
    evidenceCode: record.id,
    evidenceName: record.name,
    description: record.text,
    imageUrl: null,
  }),
)
const nodes = graph.nodes.map((node) => ({
  nodeId: node.id,
  type: node.type,
  speaker: node.speaker ?? '',
  automaticallySkipped: ['action', 'narration'].includes(node.type),
  fields: storyTextFields(node),
}))
const shots = resolve('node_modules/.cache/admin-redesign-qa')
mkdirSync(shots, { recursive: true })
test.setTimeout(60_000)

async function setup(page, role = 'ROLE_ADMIN') {
  const state = {
    reads: {},
    patches: [],
    maintenanceDeletes: 0,
    unavailable: new Set(),
    usersPending: null,
    invalidSave: false,
    reports: [
      {
        id: 3,
        userId: 7,
        username: 'qa-player',
        reportContent: 'Kiểm thử báo lỗi giao diện',
        status: 'PENDING',
        createdAt: '2026-11-17T08:00:00',
      },
      {
        id: 4,
        userId: 8,
        username: 'qa-new-player',
        reportContent: 'Kiểm thử phản hồi đã xử lý',
        status: 'RESOLVED',
        createdAt: '2026-11-17T08:00:00',
      },
    ],
    maintenance: { active: false, scheduled: false, startsAt: null, message: '', revision: 0 },
    errors: [],
  }
  page.on('pageerror', (error) => state.errors.push(error.message))
  await page.addInitScript((role) => {
    if (role)
      localStorage.setItem(
        'theUnspoken.auth.v1',
        JSON.stringify({ token: 'admin-design-fixture', username: 'qa-admin', role, userId: 7 }),
      )
  }, role)
  const maintenance = () => ({ ...state.maintenance, serverNow: new Date().toISOString() })
  await page.route('**/api/**', async (route) => {
    const url = new URL(route.request().url())
    const path = url.pathname
    if (!path.startsWith('/api/')) return route.continue()
    const method = route.request().method()
    const reply = (json, status = 200) => route.fulfill({ json, status })
    state.reads[path] = (state.reads[path] || 0) + 1
    if (state.unavailable.has(path))
      return reply({ message: 'QA: máy chủ tạm thời không khả dụng' }, 503)
    if (path === '/api/auth/session') return reply({ maintenance: maintenance() })
    if (path === '/api/auth/config') return reply({})
    if (path === '/api/auth/logout') return reply({ message: 'Logged out' })
    if (path === '/api/system/status') return reply(maintenance())
    if (path === '/api/game/load/7') return reply(null)
    if (path === '/api/admin/online')
      return reply({
        onlineCount: 1,
        players: [
          { userId: 7, username: 'qa-player', area: 'PLAY', lastSeenAt: new Date().toISOString() },
        ],
      })
    if (path === '/api/admin/maintenance') {
      if (method === 'DELETE') {
        state.maintenanceDeletes++
        state.maintenance = {
          ...state.maintenance,
          active: false,
          scheduled: false,
          revision: state.maintenance.revision + 1,
        }
      }
      return reply(maintenance())
    }
    if (path === '/api/admin/overview')
      return reply({
        totalPlayers: 24,
        activePlayers: 18,
        averageCredibility: 86,
        lowCredibilityCount: 2,
        pendingBugReports: 1,
        resolvedBugReports: 1,
        totalEvidenceMaster: evidence.length,
        chapterStats: [1, 2, 3, 4, 5].map((chapter) => ({
          chapter,
          title: `Chương ${chapter}`,
          reachedCount: 18,
          completedCount: 12,
          reachedPercentage: 75,
          completedPercentage: 50,
        })),
      })
    if (path === '/api/admin/evidence') return reply(evidence)
    if (path === '/api/admin/users') {
      if (state.usersPending) await state.usersPending
      return reply([
        {
          id: 7,
          username: 'qa-player',
          email: 'player@example.test',
          role: 'ROLE_PLAYER',
          hasSave: true,
          currentChapter: 1,
          credibilityScore: 86,
          lastSavedAt: '2026-11-17T08:00:00',
        },
        {
          id: 8,
          username: 'qa-new-player',
          email: 'new@example.test',
          role: 'ROLE_PLAYER',
          hasSave: false,
          currentChapter: null,
          credibilityScore: null,
          lastSavedAt: null,
        },
      ])
    }
    if (path === '/api/admin/users/7/save')
      return reply({
        userId: 7,
        username: 'qa-player',
        email: 'player@example.test',
        saveId: 9,
        currentChapter: 1,
        credibilityScore: 86,
        updatedAt: '2026-11-17T08:00:00',
        saveDataJson: state.invalidSave
          ? '{invalid'
          : JSON.stringify({
              state: {
                notebook: {
                  evidence: [evidence[0].evidenceCode],
                  people: [],
                  timeline: [],
                  statements: [],
                },
              },
            }),
      })
    if (path === '/api/admin/reports/bugs')
      return reply(
        state.reports.filter(
          (item) =>
            !url.searchParams.has('status') || item.status === url.searchParams.get('status'),
        ),
      )
    if (/\/reports\/bugs\/\d+\/status$/.test(path)) {
      const body = route.request().postDataJSON()
      const id = Number(path.split('/').at(-2))
      state.patches.push({ id, body, method })
      const item = state.reports.find((item) => item.id === id)
      Object.assign(item, body)
      return reply(item)
    }
    if (path === '/api/admin/story/chapters') return reply([manifest])
    if (path.endsWith('/nodes')) return reply(nodes)
    if (path.endsWith('/draft'))
      return reply({
        ...manifest,
        draftRevision: 0,
        publishedVersionId: null,
        overrides: [],
        updatedBy: null,
        updatedAt: null,
        validationFingerprint: null,
        previewFingerprint: null,
      })
    if (path.endsWith('/versions')) return reply([])
    return reply({ message: 'No Admin design fixture data' }, 404)
  })
  return state
}

const pages = [
  ['/admin', 'overview', 'Tổng quan Hệ thống & Phân tích Người chơi'],
  ['/admin/users', 'users', 'Danh sách Thám tử & Tiến trình Điều tra'],
  ['/admin/bugs', 'bugs', 'Quản lý Phản hồi Lỗi từ Người chơi'],
  ['/admin/evidence', 'evidence', 'Quản lý Danh mục Chứng cứ Toàn hệ thống'],
  ['/admin/story-content', 'story', 'Nội dung kịch bản'],
  ['/admin/operations', 'operations', 'Kết nối & Bảo trì'],
]

for (const width of [1440, 1024, 768, 390, 320]) {
  test(`all six admin pages fit ${width}px and retain their controls`, async ({ page }) => {
    const state = await setup(page)
    const heights = { 1440: 900, 1024: 768, 768: 1024, 390: 844, 320: 844 }
    await page.setViewportSize({ width, height: heights[width] })
    for (const [route, key, title] of pages) {
      await page.goto(route)
      await expect(page.getByRole('heading', { level: 1, name: title, exact: true })).toBeVisible()
      if (key === 'overview') await expect(page.locator('.admin-stat')).toHaveCount(4)
      if (key === 'users')
        await expect(page.getByRole('button', { name: 'Xem sổ tay', exact: true })).toBeVisible()
      if (key === 'bugs')
        await expect(
          page.getByRole('button', { name: '✓ Đánh dấu đã sửa', exact: true }),
        ).toBeAttached()
      if (key === 'evidence') await expect(page.getByRole('article')).toHaveCount(evidence.length)
      if (key === 'story') await expect(page.locator('.story-node').first()).toBeVisible()
      if (key === 'operations')
        await expect(
          page.getByRole('button', { name: 'Công bố lịch bảo trì', exact: true }),
        ).toBeVisible()
      await page.evaluate(() => document.fonts.ready)
      const overflow = await page.evaluate(() => ({
        width: innerWidth,
        scroll: document.documentElement.scrollWidth,
      }))
      expect(overflow.scroll, `${route} at ${width}px`).toBeLessThanOrEqual(overflow.width)
      if (width !== 320)
        await page.screenshot({
          path: `${shots}/${key}-${width}.png`,
          fullPage: true,
          animations: 'disabled',
        })
    }
    expect(state.errors).toEqual([])
  })
}

test('users search, loading/error recovery, save modes, focus trap, Escape and invalid JSON', async ({
  page,
}) => {
  const state = await setup(page)
  let ready
  state.usersPending = new Promise((resolve) => {
    ready = resolve
  })
  await page.goto('/admin/users')
  await expect(page.getByText('Đang tải danh sách tài khoản…')).toBeVisible()
  ready()
  state.usersPending = null
  const search = page.getByRole('searchbox')
  await expect(page.getByText('Chưa có dữ liệu', { exact: true })).toBeVisible()
  await search.fill('not-found')
  await expect(page.getByText('Không tìm thấy tài khoản phù hợp.')).toBeVisible()
  await search.fill('player@example.test')
  const open = page.getByRole('button', { name: 'Xem sổ tay', exact: true })
  await open.click()
  const modal = page.getByRole('dialog')
  await expect(modal).toBeVisible()
  await expect(modal.getByRole('button', { name: 'Đóng', exact: true })).toBeFocused()
  await expect(modal).toContainText(evidence[0].evidenceName)
  for (let i = 0; i < 8; i++) {
    await page.keyboard.press('Tab')
    expect(await modal.evaluate((node) => node.contains(document.activeElement))).toBe(true)
  }
  await modal.getByRole('button', { name: 'Chi tiết kỹ thuật', exact: true }).click()
  await expect(modal.locator('pre')).toContainText(evidence[0].evidenceCode)
  await page.setViewportSize({ width: 390, height: 844 })
  await expect(modal).toBeVisible()
  expect(await modal.evaluate((node) => node.scrollWidth <= node.clientWidth)).toBe(true)
  await page.screenshot({ path: `${shots}/save-mobile.png`, animations: 'disabled' })
  await page.keyboard.press('Escape')
  await expect(modal).toHaveCount(0)
  await expect(open).toBeFocused()
  state.invalidSave = true
  await open.click()
  await expect(modal).toContainText('Không thể đọc dữ liệu sổ tay:')
  await modal.getByRole('button', { name: 'Đóng', exact: true }).click()
  state.unavailable.add('/api/admin/users')
  await page.getByRole('button', { name: '↻ Làm mới danh sách', exact: true }).click()
  await expect(page.getByText('QA: máy chủ tạm thời không khả dụng')).toBeVisible()
  state.unavailable.clear()
  await page.getByRole('button', { name: '↻ Làm mới danh sách', exact: true }).click()
  await expect(page.getByText('QA: máy chủ tạm thời không khả dụng')).toHaveCount(0)
  expect(state.errors).toEqual([])
})

test('bug filters, live polling switch and both status actions keep API payloads', async ({
  page,
}) => {
  const state = await setup(page)
  await page.goto('/admin/bugs')
  const poll = page.getByRole('button', { name: 'Tự động cập nhật: Bật', exact: true })
  await poll.click()
  await expect(
    page.getByRole('button', { name: 'Tự động cập nhật: Tắt', exact: true }),
  ).toHaveAttribute('aria-pressed', 'false')
  await page.getByRole('button', { name: 'Chờ xử lý', exact: true }).click()
  await expect(page.getByRole('row')).toHaveCount(2)
  await page.getByRole('button', { name: '✓ Đánh dấu đã sửa', exact: true }).click()
  await expect(page.getByRole('button', { name: '↺ Mở lại báo cáo', exact: true })).toBeVisible()
  await page.getByRole('button', { name: '↺ Mở lại báo cáo', exact: true }).click()
  await expect(page.getByRole('button', { name: '✓ Đánh dấu đã sửa', exact: true })).toBeVisible()
  expect(state.patches).toEqual([
    { id: 3, method: 'PATCH', body: { status: 'RESOLVED' } },
    { id: 3, method: 'PATCH', body: { status: 'PENDING' } },
  ])
  await page.getByRole('button', { name: 'Đã khắc phục', exact: true }).click()
  await expect(page.getByRole('row')).toHaveCount(2)
  await expect(page.getByRole('row').last()).toContainText('qa-new-player')
  state.reports = []
  await page.getByRole('button', { name: '↻ Làm mới ngay', exact: true }).click()
  await expect(page.getByRole('row').last()).toContainText('Chưa có báo cáo lỗi nào trong mục này.')
  expect(state.errors).toEqual([])
})

test('mobile navigation, skip link, maintenance end/cancel and logout remain reachable', async ({
  page,
}) => {
  const state = await setup(page)
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/admin')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  await page.keyboard.press('Tab')
  await expect(page.getByRole('link', { name: 'Đến nội dung chính', exact: true })).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page.locator('#admin-main')).toBeFocused()
  const nav = page.getByRole('navigation', { name: 'Điều hướng quản trị', exact: true })
  for (const [route] of pages) {
    await page.getByRole('button', { name: 'Mở điều hướng quản trị', exact: true }).click()
    await expect(nav.getByRole('link')).toHaveCount(6)
    await nav.locator(`a[href="${route}"]`).click()
    await expect(page).toHaveURL(new RegExp(`${route}$`))
    await expect(
      page.getByRole('button', { name: 'Mở điều hướng quản trị', exact: true }),
    ).toBeFocused()
  }
  state.maintenance = {
    active: false,
    scheduled: true,
    startsAt: '2030-11-16T18:00:00Z',
    message: 'Kiểm thử lịch bảo trì',
    revision: 1,
  }
  await page.getByRole('button', { name: 'Làm mới', exact: true }).click()
  page.once('dialog', (dialog) => dialog.dismiss())
  await page.getByRole('button', { name: 'Hủy lịch bảo trì', exact: true }).click()
  expect(state.maintenanceDeletes).toBe(0)
  page.once('dialog', (dialog) => dialog.accept())
  await page.getByRole('button', { name: 'Hủy lịch bảo trì', exact: true }).click()
  await expect(page.getByText('Đã mở lại hệ thống.', { exact: true })).toBeVisible()
  state.maintenance = { ...state.maintenance, active: true, scheduled: false, revision: 3 }
  await page.getByRole('button', { name: 'Làm mới', exact: true }).click()
  page.once('dialog', (dialog) => dialog.accept())
  await page.getByRole('button', { name: 'Kết thúc bảo trì', exact: true }).click()
  await expect(
    page.getByRole('button', { name: 'Công bố lịch bảo trì', exact: true }),
  ).toBeVisible()
  expect(state.maintenanceDeletes).toBe(2)
  await expect(
    page.getByRole('link', { name: '← Quay lại trò chơi', exact: true }),
  ).toHaveAttribute('href', '/play')
  page.once('dialog', (dialog) => dialog.dismiss())
  await page.getByRole('button', { name: 'Đăng xuất', exact: true }).click()
  await expect(page).toHaveURL(/\/admin\/operations$/)
  page.once('dialog', (dialog) => dialog.accept())
  await page.getByRole('button', { name: 'Đăng xuất', exact: true }).click()
  await expect(page).toHaveURL(/\/login$/)
  expect(state.errors).toEqual([])
})

test('admin guard still redirects logged-out and player sessions', async ({ browser, baseURL }) => {
  for (const role of [null, 'ROLE_PLAYER']) {
    const context = await browser.newContext({ baseURL })
    try {
      const page = await context.newPage()
      const state = await setup(page, role)
      await page.goto('/admin/evidence')
      await expect(page).toHaveURL(role ? /\/play$/ : /\/login$/)
      await expect(page.locator('.admin-shell')).toHaveCount(0)
      expect(state.reads['/api/admin/evidence'] || 0).toBe(0)
    } finally {
      await context.close()
    }
  }
})

test('mobile evidence form keeps validation, image upload/removal and cancel accessible', async ({
  page,
}) => {
  const state = await setup(page)
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/admin/evidence')
  await page.getByRole('button', { name: '+ Thêm vật chứng mới', exact: true }).click()
  const form = page.getByRole('form', { name: 'Thêm vật chứng mới vào hệ thống' })
  expect(await form.evaluate((element) => element.checkValidity())).toBe(false)
  const code = form.getByLabel('Mã định danh', { exact: false })
  const name = form.getByLabel('Tên hiển thị vật chứng')
  await expect(code).toHaveAttribute('maxlength', '50')
  await expect(name).toHaveAttribute('maxlength', '100')
  await code.fill(evidence[0].evidenceCode)
  await name.fill(evidence[0].evidenceName)
  await form.getByLabel('Mô tả chi tiết vật chứng').fill(evidence[0].description)
  await form.getByLabel('Chọn tệp ảnh vật chứng').setInputFiles({
    name: 'test.png',
    mimeType: 'image/png',
    buffer: Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=',
      'base64',
    ),
  })
  await expect(form.getByAltText('Xem trước vật chứng')).toHaveAttribute(
    'src',
    /^data:image\/webp;base64,/,
  )
  expect(await form.evaluate((element) => element.checkValidity())).toBe(true)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  await page.screenshot({
    path: `${shots}/evidence-form-mobile.png`,
    fullPage: true,
    animations: 'disabled',
  })
  await form.getByRole('button', { name: 'Gỡ ảnh', exact: true }).click()
  await expect(form.getByAltText('Xem trước vật chứng')).toHaveCount(0)
  await form.getByRole('button', { name: 'Hủy', exact: true }).click()
  await expect(form).toHaveCount(0)
  expect(state.errors).toEqual([])
})

test('overview refresh recovers an API error and retains online shortcut and quick links', async ({
  page,
}) => {
  const state = await setup(page)
  state.unavailable.add('/api/admin/overview')
  await page.goto('/admin')
  await expect(page.getByText('QA: máy chủ tạm thời không khả dụng')).toBeVisible()
  await expect(page.getByText('Đang tải số liệu thống kê…')).toHaveCount(0)
  state.unavailable.clear()
  await page.getByRole('button', { name: '↻ Làm mới số liệu', exact: true }).click()
  await expect(page.locator('.admin-stat')).toHaveCount(4)
  await expect(page.getByText('QA: máy chủ tạm thời không khả dụng')).toHaveCount(0)
  await page.getByRole('link', { name: 'Xem danh sách thám tử →', exact: true }).click()
  await expect(page).toHaveURL(/\/admin\/users$/)
  expect(state.errors).toEqual([])
})

test('visible admin text contrast, control focus and reduced motion use the shared system', async ({
  page,
}) => {
  await setup(page)
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.setViewportSize({ width: 1440, height: 900 })
  const findings = []
  for (const [route] of pages) {
    await page.goto(route)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    const issues = await page.locator('.admin-shell').evaluate((root) => {
      const rgb = (value) => (value.match(/[\d.]+/g) || []).map(Number)
      const luminance = (values) =>
        values
          .slice(0, 3)
          .map((v) => {
            const s = v / 255
            return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
          })
          .reduce((sum, value, i) => sum + value * [0.2126, 0.7152, 0.0722][i], 0)
      const issues = []
      for (const element of root.querySelectorAll('*')) {
        if (
          !Array.from(element.childNodes).some(
            (n) => n.nodeType === Node.TEXT_NODE && n.textContent.trim(),
          )
        )
          continue
        if (element.closest('[disabled], [aria-hidden="true"]')) continue
        const box = element.getBoundingClientRect()
        if (
          !box.width ||
          !box.height ||
          box.bottom <= 0 ||
          box.top >= innerHeight ||
          box.right <= 0 ||
          box.left >= innerWidth
        )
          continue
        const style = getComputedStyle(element)
        if (style.visibility !== 'visible') continue
        let background = [255, 255, 255]
        for (let ancestor = element; ancestor; ancestor = ancestor.parentElement) {
          const color = rgb(getComputedStyle(ancestor).backgroundColor)
          if (color.length === 3 || color[3] === 1) {
            background = color
            break
          }
        }
        const fg = luminance(rgb(style.color))
        const bg = luminance(background)
        const ratio = (Math.max(fg, bg) + 0.05) / (Math.min(fg, bg) + 0.05)
        const large =
          parseFloat(style.fontSize) >= 24 ||
          (parseFloat(style.fontSize) >= 18.66 && Number(style.fontWeight) >= 700)
        if (ratio < (large ? 3 : 4.5))
          issues.push({
            text: element.textContent.trim().slice(0, 70),
            ratio: Number(ratio.toFixed(2)),
            color: style.color,
            background,
          })
      }
      return issues
    })
    findings.push(...issues.map((issue) => ({ route, ...issue })))
  }
  expect(findings).toEqual([])
  await page.getByLabel('Thời điểm bắt đầu', { exact: true }).focus()
  const focus = await page.getByLabel('Thời điểm bắt đầu', { exact: true }).evaluate((element) => {
    const style = getComputedStyle(element)
    return {
      outline: style.outlineStyle,
      width: parseFloat(style.outlineWidth),
      transition: style.transitionDuration,
    }
  })
  expect(focus.outline).toBe('solid')
  expect(focus.width).toBeGreaterThanOrEqual(2)
  expect(focus.transition).toBe('0s')
})
