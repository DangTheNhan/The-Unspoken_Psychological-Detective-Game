import { readFileSync } from 'node:fs'
import { expect, test } from '@playwright/test'

const { contractVersion } = JSON.parse(
  readFileSync(
    new URL('../public/assets/chapters/chapter1/chapter1.json', import.meta.url),
    'utf8',
  ),
)

test.setTimeout(45_000)

async function frame(page) {
  await page.evaluate(() => new Promise(requestAnimationFrame))
}
async function key(page, value) {
  await page.keyboard.press(value)
  await frame(page)
}
async function scene(page, name) {
  await page.waitForFunction((key) => window.__THE_UNSPOKEN__?.game.scene.isActive(key), name)
  await frame(page)
}
const pause = (page) => page.getByRole('dialog', { name: 'Tạm dừng điều tra', exact: true })
async function progress(page) {
  return page.evaluate(() => {
    const { game, runtime } = window.__THE_UNSPOKEN__
    const player = game.scene.getScene('RoomInvestigationScene').player
    return {
      state: runtime.session.story,
      tutorial: runtime.session.tutorial,
      position: player && [player.x, player.y],
    }
  })
}
async function start(page) {
  const requests = []
  const errors = []
  const status = { active: false, scheduled: false, revision: 0, startsAt: null, message: '' }
  const maintenance = () => ({ ...status, serverNow: new Date().toISOString() })
  page.on('pageerror', (error) => errors.push(error.message))
  // Isolated browser/API fixture: real React/Phaser and DOM keyboard events, no DB writes.
  await page.route('**/api/**', (route) => {
    const path = new URL(route.request().url()).pathname
    if (!path.startsWith('/api/')) return route.continue()
    if (path.endsWith('/auth/session'))
      return route.fulfill({ json: { maintenance: maintenance() } })
    if (path.endsWith('/system/status')) return route.fulfill({ json: maintenance() })
    if (path.endsWith('/auth/config')) return route.fulfill({ json: {} })
    if (path.endsWith('/story-text'))
      return route.fulfill({
        json: {
          chapterId: 1,
          contractVersion,
          baseHash: new URL(route.request().url()).searchParams.get('baseHash'),
          allowlistVersion: 1,
          versionId: null,
          overrides: [],
        },
      })
    if (path.endsWith('/reports/bug')) {
      requests.push(route.request().postDataJSON())
      return route.fulfill({ status: 201, json: { message: 'Bug report submitted' } })
    }
    return route.fulfill({ status: 404, json: { message: 'No fixture data' } })
  })
  await page.addInitScript(() => {
    localStorage.setItem(
      'theUnspoken.auth.v1',
      JSON.stringify({
        token: 'pause-ui-fixture',
        userId: 65,
        username: 'pause-ui',
        role: 'ROLE_PLAYER',
      }),
    )
    localStorage.setItem('theUnspoken.settings.v1', JSON.stringify({ textSpeed: 'slow' }))
  })
  await page.goto('/play')
  await scene(page, 'MainMenuScene')
  await expect(page.getByRole('button', { name: 'Menu', exact: true })).toHaveCount(0)
  await key(page, 'Enter')
  await scene(page, 'RoomInvestigationScene')
  return { requests, errors, status }
}

test('ESC pauses real gameplay; report accepts WASD, editing and Vietnamese without moving the player', async ({
  page,
}, info) => {
  const { requests, errors } = await start(page)
  await page.keyboard.down('w')
  await frame(page)
  await key(page, 'Escape')
  await expect(pause(page)).toBeVisible()
  await page.keyboard.up('w')
  const before = await progress(page)
  await page.screenshot({ path: info.outputPath('pause-menu.png') })
  await page.getByRole('button', { name: 'Báo lỗi', exact: true }).click()
  const input = page.getByRole('textbox', { name: 'Nội dung báo lỗi', exact: true })
  await expect(input).toBeFocused()
  await input.pressSequentially('awds WASD')
  await expect(input).toHaveValue('awds WASD')
  await input.press('Control+a')
  await input.press('Backspace')
  const content = 'awds WASD - Điều tra phòng 204'
  await input.pressSequentially(content)
  await input.press('Enter')
  await input.pressSequentially('wasd')
  await input.press('Backspace')
  const expected = `${content}\nwas`
  await expect(input).toHaveValue(expected)
  expect(await progress(page)).toEqual(before)
  expect(await page.evaluate(() => window.__THE_UNSPOKEN__.game.input.keyboard.enabled)).toBe(false)
  await page.screenshot({ path: info.outputPath('report-keyboard.png') })
  await page.getByRole('button', { name: 'Gửi báo lỗi', exact: true }).click()
  await expect(page.getByText('Đã gửi báo lỗi tới quản trị viên.')).toBeVisible()
  expect(requests).toEqual([{ userId: 65, reportContent: expected }])
  await page.getByRole('button', { name: 'Đóng', exact: true }).click()
  await expect(pause(page)).toBeVisible()
  expect(await progress(page)).toEqual(before)
  await page.getByRole('button', { name: 'Báo lỗi', exact: true }).click()
  await input.pressSequentially('awds')
  await page.keyboard.down('w')
  await key(page, 'Escape')
  await expect(pause(page)).toBeVisible()
  expect(requests).toHaveLength(1)
  expect(await progress(page)).toEqual(before)
  await key(page, 'Escape')
  await expect(pause(page)).toHaveCount(0)
  await scene(page, 'RoomInvestigationScene')
  expect(await progress(page)).toEqual(before)
  expect(await page.evaluate(() => window.__THE_UNSPOKEN__.game.input.keyboard.enabled)).toBe(true)
  await page.keyboard.down('w')
  await frame(page)
  await frame(page)
  expect((await progress(page)).position).toEqual(before.position)
  await page.keyboard.up('w')
  await page.keyboard.down('d')
  await expect
    .poll(async () => (await progress(page)).position[0])
    .toBeGreaterThan(before.position[0])
  await page.keyboard.up('d')
  await frame(page)
  const stopped = (await progress(page)).position
  await frame(page)
  await frame(page)
  expect((await progress(page)).position).toEqual(stopped)
  expect(errors).toEqual([])
})

test('ESC respects Settings, Notebook and tutorial confirmation; menu memory keeps the same story view', async ({
  page,
}, info) => {
  const { errors } = await start(page)
  const original = await progress(page)
  await key(page, 'Escape')
  await page.getByRole('button', { name: 'Cài đặt', exact: true }).click()
  await scene(page, 'SettingsScene')
  await key(page, 'Escape')
  await expect(pause(page)).toBeVisible()
  await page.getByRole('button', { name: 'Tiếp tục chơi', exact: true }).click()
  await scene(page, 'RoomInvestigationScene')
  expect(await progress(page)).toEqual(original)
  await key(page, 'n')
  await scene(page, 'NotebookScene')
  await key(page, 'Escape')
  await scene(page, 'RoomInvestigationScene')
  await expect(pause(page)).toHaveCount(0)
  await key(page, 'Escape')
  await page.getByRole('button', { name: 'Bỏ qua hướng dẫn', exact: true }).click()
  await page.waitForFunction(() =>
    Boolean(window.__THE_UNSPOKEN__.game.scene.getScene('RoomInvestigationScene').dialog),
  )
  await key(page, 'Escape')
  expect(await page.evaluate(() => window.__THE_UNSPOKEN__.runtime.session.tutorial.status)).toBe(
    'active',
  )
  await expect(pause(page)).toHaveCount(0)
  await key(page, 'Escape')
  await page.getByRole('button', { name: 'Bỏ qua hướng dẫn', exact: true }).click()
  await page.waitForFunction(() =>
    Boolean(window.__THE_UNSPOKEN__.game.scene.getScene('RoomInvestigationScene').dialog),
  )
  await key(page, 'Enter')
  await scene(page, 'StoryScene')
  await page.waitForFunction(() =>
    window.__THE_UNSPOKEN__.game.scene
      .getScene('StoryScene')
      .view.some((item) => item.bodyText?.text.length > 4),
  )
  const view = () =>
    page.evaluate(() => {
      const { game, runtime } = window.__THE_UNSPOKEN__
      const box = game.scene.getScene('StoryScene').view.find((item) => item.bodyText)
      return { node: runtime.story.state.current_node, text: box?.bodyText.text }
    })
  for (let index = 0; index < 3; index++) {
    await key(page, 'Escape')
    const before = await view()
    await expect(pause(page)).toBeVisible()
    await page.getByRole('button', { name: 'Về menu chính', exact: true }).click()
    await scene(page, 'MainMenuScene')
    expect(
      await page.evaluate(
        () => window.__THE_UNSPOKEN__.game.scene.getScene('StoryScene').sys.settings.visible,
      ),
    ).toBe(false)
    if (index === 0) await page.screenshot({ path: info.outputPath('memory-main-menu.png') })
    const point = await page.evaluate(() => {
      const bounds = window.__THE_UNSPOKEN__.game.scene
        .getScene('MainMenuScene')
        .items[1].hitZone.getBounds()
      return [bounds.centerX, bounds.centerY]
    })
    const canvas = await page.locator('canvas').boundingBox()
    await page.mouse.click(
      canvas.x + (point[0] * canvas.width) / 1280,
      canvas.y + (point[1] * canvas.height) / 720,
    )
    await scene(page, 'StoryScene')
    const after = await view()
    expect(after.node).toBe(before.node)
    expect(after.text.startsWith(before.text)).toBe(true)
  }
  expect(errors).toEqual([])
})

test('closing a report and pressing Escape cannot resume gameplay during maintenance', async ({
  page,
}) => {
  const { status, errors } = await start(page)
  await key(page, 'Escape')
  await page.getByRole('button', { name: 'Báo lỗi', exact: true }).click()
  status.active = true
  status.message = 'Bảo trì fixture G1'
  status.revision = 1
  await page.waitForFunction(() => document.querySelector('div[inert]'), undefined, {
    timeout: 22000,
  })
  await key(page, 'Escape')
  await expect(page.getByRole('heading', { name: 'Game tạm dừng để bảo trì' })).toBeVisible()
  await expect(pause(page)).toHaveCount(0)
  await key(page, 'Escape')
  expect(
    await page.evaluate(() =>
      window.__THE_UNSPOKEN__.game.scene.isPaused('RoomInvestigationScene'),
    ),
  ).toBe(true)
  expect(await page.evaluate(() => window.__THE_UNSPOKEN__.game.input.keyboard.enabled)).toBe(false)
  expect(errors).toEqual([])
})
