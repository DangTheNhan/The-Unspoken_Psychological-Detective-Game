import { readFile } from 'node:fs/promises'
import { expect, test } from '@playwright/test'

const api = process.env.ACCOUNT_TEST_API
test.skip(!api, 'Requires the isolated account/operations QA backend and local SMTP capture.')
const adminUser = process.env.ACCOUNT_ADMIN_USER ?? 't062-admin'
const adminPassword = process.env.ACCOUNT_ADMIN_PASSWORD ?? 'T062AdminPass_2026'
const prefix = `ui062_${Date.now().toString(36)}`
const password = 'UiOriginalPass_2026'

async function login(page, username, pass = password) {
  page.setDefaultTimeout(20000)
  await page.goto('/login')
  await page.getByLabel('Tên đăng nhập', { exact: true }).fill(username)
  await page.getByLabel('Mật khẩu', { exact: true }).fill(pass)
  await page.getByRole('button', { name: 'Đăng nhập', exact: true }).click()
  await expect(page).toHaveURL(username === adminUser ? /\/admin$/ : /\/play$/)
}
async function register(request, suffix) {
  const username = `${prefix}_${suffix}`
  const response = await request.post(`${api}/auth/register`, {
    data: { username, email: `${username}@example.test`, password },
  })
  expect(response.status()).toBe(201)
  return username
}
async function scene(page, key) {
  await page.waitForFunction((name) => window.__THE_UNSPOKEN__?.game?.scene?.isActive(name), key)
}
async function decide(page, button, accepted) {
  const pending = page.waitForEvent('dialog')
  const clicked = button.click()
  const dialog = await pending
  if (accepted) await dialog.accept()
  else await dialog.dismiss()
  await clicked
}
async function current(page) {
  return page.evaluate(() => JSON.parse(localStorage.getItem('theUnspoken.auth.v1')))
}
async function apiFor(page, request, path, method = 'get', data) {
  const session = await current(page)
  return request[method](`${api}${path}`, {
    headers: { Authorization: `Bearer ${session.token}` },
    ...(data === undefined ? {} : { data }),
  })
}
async function opening(page) {
  await scene(page, 'MainMenuScene')
  await page.keyboard.press('Enter')
  await scene(page, 'RoomInvestigationScene')
  await page.keyboard.press('Escape')
  await page.keyboard.press('Enter')
  await scene(page, 'StoryScene')
}
async function snapshot(page) {
  return page.evaluate(() => JSON.stringify(window.__THE_UNSPOKEN__.runtime.story.state))
}
async function clickCanvas(page, x, y) {
  const bounds = await page.locator('canvas').boundingBox()
  await page.mouse.click(bounds.x + (x * bounds.width) / 1280, bounds.y + (y * bounds.height) / 720)
}

test('twenty Admin round trips and logout login cycles retain a single working game', async ({
  page,
}) => {
  const errors = []
  page.on('pageerror', (error) => errors.push(error.message))
  page.on('console', (message) => {
    if (message.type() === 'error' && message.text().includes('drawImage'))
      errors.push(message.text())
  })
  await login(page, adminUser, adminPassword)
  for (let index = 0; index < 20; index++) {
    await page.getByRole('link', { name: '← Quay lại trò chơi' }).click()
    await scene(page, 'MainMenuScene')
    await expect(page.locator('canvas')).toHaveCount(1)
    await page.getByRole('link', { name: 'HỒ SƠ QUẢN TRỊ →' }).click()
    await expect(
      page.getByRole('heading', { name: 'Tổng quan Hệ thống & Phân tích Người chơi' }),
    ).toBeVisible()
    const logout = page.getByRole('button', { name: 'Đăng xuất', exact: true })
    if (index === 0) {
      await decide(page, logout, false)
      await expect(page).toHaveURL(/\/admin$/)
    }
    await decide(page, logout, true)
    await expect(page).toHaveURL(/\/login$/)
    await login(page, adminUser, adminPassword)
  }
  expect(errors).toEqual([])
})

test('pause settings memory resume reports online save and scheduled maintenance work through the real API', async ({
  page,
  browser,
  request,
}, testInfo) => {
  const username = await register(request, 'game')
  await login(page, username)
  await opening(page)
  const original = await snapshot(page)
  await page.getByRole('button', { name: 'Menu', exact: true }).click()
  await expect(page.getByRole('dialog', { name: 'Tạm dừng điều tra' })).toBeVisible()
  await page.getByRole('button', { name: 'Cài đặt', exact: true }).click()
  await scene(page, 'SettingsScene')
  await page.keyboard.press('Escape')
  await page.getByRole('button', { name: 'Tiếp tục chơi', exact: true }).click()
  await scene(page, 'StoryScene')
  expect(await snapshot(page)).toBe(original)
  await page.getByRole('button', { name: 'Menu', exact: true }).click()
  await page.getByRole('button', { name: 'Về menu chính', exact: true }).click()
  await scene(page, 'MainMenuScene')
  const resumeBounds = await page.evaluate(() => {
    const bounds = window.__THE_UNSPOKEN__.game.scene.getScene('MainMenuScene').items[1].getBounds()
    return { x: bounds.centerX, y: bounds.centerY }
  })
  await clickCanvas(page, resumeBounds.x, resumeBounds.y)
  await scene(page, 'StoryScene')
  expect(await snapshot(page)).toBe(original)

  await page.getByRole('button', { name: 'Menu', exact: true }).click()
  await page.getByRole('button', { name: 'Báo lỗi', exact: true }).click()
  await page.getByLabel('Nội dung báo lỗi').fill(`T062 browser report ${username}`)
  await page.getByRole('button', { name: 'Gửi báo lỗi', exact: true }).click()
  await expect(page.getByText('Đã gửi báo lỗi tới quản trị viên.')).toBeVisible()
  await page.getByRole('button', { name: 'Đóng', exact: true }).click()
  await scene(page, 'StoryScene')
  await page.keyboard.press('n')
  await scene(page, 'NotebookScene')
  await clickCanvas(page, 150, 630)
  await expect(page.getByText('Đã lưu tiến trình lên máy chủ.', { exact: true })).toBeVisible()
  await page.keyboard.press('n')
  await scene(page, 'StoryScene')
  expect((await apiFor(page, request, `/game/load/${(await current(page)).userId}`)).status()).toBe(
    200,
  )

  await page.getByRole('button', { name: 'Menu', exact: true }).click()
  await page.getByRole('button', { name: 'Về menu chính', exact: true }).click()
  await scene(page, 'MainMenuScene')
  const menuClick = async (index) => {
    const bounds = await page.evaluate((value) => {
      const item = window.__THE_UNSPOKEN__.game.scene
        .getScene('MainMenuScene')
        .items[value].getBounds()
      return { x: item.centerX, y: item.centerY }
    }, index)
    await clickCanvas(page, bounds.x, bounds.y)
  }
  await menuClick(0)
  await page.waitForFunction(() =>
    Boolean(window.__THE_UNSPOKEN__.game.scene.getScene('MainMenuScene').dialog),
  )
  expect(
    await page.evaluate(
      () =>
        document.fonts.check('700 26px "Playfair Display"', 'Bắt đầu ván mới?') &&
        document.fonts.check('400 16px "Be Vietnam Pro"', 'ệ ỗ ữ'),
    ),
  ).toBe(true)
  await page.screenshot({ path: testInfo.outputPath('new-game-confirm-fonts.png'), fullPage: true })
  await page.keyboard.press('Escape')
  await menuClick(1)
  await scene(page, 'StoryScene')
  expect(await snapshot(page)).toBe(original)

  const adminContext = await browser.newContext()
  const admin = await adminContext.newPage()
  try {
    await login(admin, adminUser, adminPassword)
    await admin.getByRole('link', { name: /Phản hồi & Báo lỗi/ }).click()
    await expect(admin.getByText(`T062 browser report ${username}`, { exact: true })).toBeVisible()
    await admin.getByRole('link', { name: /Kết nối & Bảo trì/ }).click()
    await expect(admin.getByText(username, { exact: true })).toBeVisible()
    await admin.screenshot({ path: testInfo.outputPath('operations-desktop.png'), fullPage: true })
    await admin.setViewportSize({ width: 390, height: 844 })
    expect(await admin.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    )
    await admin.screenshot({ path: testInfo.outputPath('operations-mobile.png'), fullPage: true })
    await admin.setViewportSize({ width: 1280, height: 800 })
    const localTime = await admin.evaluate(() => {
      const time = new Date(Date.now() + 24000)
      return new Date(time.getTime() - time.getTimezoneOffset() * 60000).toISOString().slice(0, 19)
    })
    await admin.getByLabel('Thời điểm bắt đầu').fill(localTime)
    await admin
      .getByLabel('Thông báo cho người chơi')
      .fill('Bảo trì kiểm thử T062: game tự dừng theo lịch.')
    await decide(
      admin,
      admin.getByRole('button', { name: 'Công bố lịch bảo trì', exact: true }),
      true,
    )
    await expect(admin.getByText('Đã công bố lịch và thông báo bảo trì.')).toBeVisible()
    await expect(page.getByText(/Game sẽ tự dừng khi đến giờ/)).toBeVisible({ timeout: 20000 })
    const beforeStop = await snapshot(page)
    await expect(page.getByRole('heading', { name: 'Game tạm dừng để bảo trì' })).toBeVisible({
      timeout: 30000,
    })
    await page.waitForFunction(() =>
      window.__THE_UNSPOKEN__.game.scene
        .getScenes(true)
        .every((scene) => scene.scene.key === 'DebugScene'),
    )
    await page.keyboard.press('Enter')
    expect(await snapshot(page)).toBe(beforeStop)
    const backup = await page.evaluate(
      (name) =>
        JSON.parse(localStorage.getItem(`theUnspoken.save.backup.v1.${encodeURIComponent(name)}`)),
      username,
    )
    expect(backup.reason).toBe('maintenance')
    expect(
      (await apiFor(page, request, `/game/load/${(await current(page)).userId}`)).status(),
    ).toBe(503)
    await page.screenshot({
      path: testInfo.outputPath('scheduled-maintenance.png'),
      fullPage: true,
    })
    await decide(admin, admin.getByRole('button', { name: 'Kết thúc bảo trì', exact: true }), true)
    await expect(page.getByRole('heading', { name: 'Game tạm dừng để bảo trì' })).toHaveCount(0, {
      timeout: 20000,
    })
    await scene(page, 'StoryScene')
    expect(await snapshot(page)).toBe(beforeStop)
  } finally {
    await apiFor(admin, request, '/admin/maintenance', 'delete').catch(() => {})
    await adminContext.close()
  }
})

test('a second browser replaces the session and password recovery uses a real local SMTP email', async ({
  page,
  browser,
  request,
}) => {
  const username = await register(request, 'sessions')
  await login(page, username)
  await opening(page)
  const first = await current(page)
  const secondContext = await browser.newContext()
  const second = await secondContext.newPage()
  try {
    await login(second, username)
    await expect(page).toHaveURL(/\/login$/, { timeout: 20000 })
    await expect(page.getByText(/tài khoản đã đăng nhập ở nơi khác/)).toBeVisible()
    expect(
      (
        await request.post(`${api}/auth/session`, {
          headers: { Authorization: `Bearer ${first.token}` },
          data: { area: 'PLAY' },
        })
      ).status(),
    ).toBe(401)
    expect(
      (await apiFor(second, request, '/auth/session', 'post', { area: 'PLAY' })).status(),
    ).toBe(200)
    await page.getByRole('link', { name: 'Quên mật khẩu?' }).click()
    await page.getByLabel('Email đã đăng ký').fill(`${username}@example.test`)
    await page.getByRole('button', { name: 'Gửi liên kết khôi phục' }).click()
    await expect(page.getByText(/Nếu email thuộc một tài khoản/)).toBeVisible()
    const messages = JSON.parse(await readFile(process.env.SMTP_CAPTURE_PATH, 'utf8'))
    const token = messages
      .find((mail) => mail.to.includes(`${username}@example.test`))
      ?.body.match(/#token=([A-Za-z0-9_-]{43})/)?.[1]
    expect(Boolean(token)).toBe(true)
    await page.goto(`/reset-password#token=${token}`)
    await expect(page).toHaveURL(/\/reset-password$/)
    await page.getByLabel('Mật khẩu mới', { exact: true }).fill('UiNewStrongPass_2026')
    await page.getByLabel('Nhập lại mật khẩu mới', { exact: true }).fill('UiNewStrongPass_2026')
    await page.getByRole('button', { name: 'Lưu mật khẩu mới' }).click()
    await expect(page.getByText('Đã đổi mật khẩu. Hãy đăng nhập lại.')).toBeVisible()
    await expect(second).toHaveURL(/\/login$/, { timeout: 20000 })
    await login(page, username, 'UiNewStrongPass_2026')
    await page.goto('/login')
    await expect(page.getByText('Đăng nhập Google chưa được cấu hình trên máy chủ.')).toBeVisible()
  } finally {
    await secondContext.close()
  }
})
