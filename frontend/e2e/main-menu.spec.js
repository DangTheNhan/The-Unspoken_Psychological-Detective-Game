import { readFileSync } from 'node:fs'
import { expect, test } from '@playwright/test'

test.setTimeout(25_000)

test.beforeEach(async ({ page }) => {
  await page.route('**/api/auth/logout', (route) => route.fulfill({ json: {} }))
  await page.route('**/api/auth/session', (route) =>
    route.fulfill({
      json: {
        maintenance: {
          serverNow: new Date().toISOString(),
          active: false,
          scheduled: false,
          revision: 0,
        },
      },
    }),
  )
})

const initialState = JSON.parse(
  readFileSync(
    new URL('../public/assets/chapters/chapter1/game-state.definitions.json', import.meta.url),
    'utf8',
  ),
).initialState
const saveKey = 'theUnspoken.save.backup.v1'
const snapshot = {
  currentChapter: 1,
  credibilityScore: 67,
  saveDataJson: JSON.stringify({
    state: { ...initialState, credibility: 67 },
    tutorial: { status: 'active', step: 'notebook' },
  }),
}

async function openMenu(page, username, saves = {}) {
  await page.addInitScript(
    ({ username, saves }) => {
      if (localStorage.getItem('theUnspoken.auth.v1')) return
      localStorage.setItem(
        'theUnspoken.auth.v1',
        JSON.stringify({ token: 'menu-playtest', username }),
      )
      for (const [key, value] of Object.entries(saves)) {
        localStorage.setItem(key, JSON.stringify(value))
      }
    },
    { username, saves },
  )
  await page.goto('/play')
  await waitForScene(page, 'MainMenuScene')
}

async function waitForScene(page, key) {
  await page.waitForFunction(
    (sceneKey) => window.__THE_UNSPOKEN__?.game.scene.isActive(sceneKey),
    key,
  )
}

async function press(page, key) {
  await page.keyboard.press(key)
  await page.evaluate(() => new Promise(requestAnimationFrame))
}

async function clickGame(page, [gameX, gameY]) {
  const canvas = await page.locator('canvas').boundingBox()
  const x = canvas.x + (gameX * canvas.width) / 1280
  const y = canvas.y + (gameY * canvas.height) / 720
  await page.mouse.move(x, y)
  await page.evaluate(() => new Promise(requestAnimationFrame))
  await page.mouse.click(x, y)
}

async function clickNewGame(page) {
  const point = await page.evaluate(() => {
    const button = window.__THE_UNSPOKEN__.game.scene.getScene('MainMenuScene').items[0]
    const bounds = button.hitZone.getBounds()
    return [bounds.centerX, bounds.centerY]
  })
  await clickGame(page, point)
}

function visibleItems(page) {
  return page.evaluate(() =>
    window.__THE_UNSPOKEN__.game.scene
      .getScene('MainMenuScene')
      .items.filter((item) => item.visible)
      .map((item) => ({ label: item.labelText.text, number: item.numberText.text, y: item.y })),
  )
}

test('tài khoản mới bỏ qua bản lưu chung và của người khác, vào chơi không hỏi ghi đè', async ({
  page,
}, info) => {
  await openMenu(page, 'new-player', {
    [saveKey]: snapshot,
    [`${saveKey}.returning-player`]: snapshot,
  })
  const items = await visibleItems(page)
  expect(items.map(({ label, number }) => [number, label])).toEqual([
    ['01', 'Ván mới'],
    ['02', 'Cài đặt'],
    ['03', 'Báo lỗi'],
  ])
  expect(items[1].y - items[0].y).toBe(54)
  await page.screenshot({ path: info.outputPath('new-player-menu.png') })
  // Phím xuống phải bỏ qua mục Tiếp tục đã ẩn.
  await press(page, 'ArrowDown')
  await press(page, 'Enter')
  await waitForScene(page, 'SettingsScene')
  await press(page, 'Escape')
  await page.waitForFunction(() => window.__THE_UNSPOKEN__.game.scene.isActive('MainMenuScene'))
  await press(page, 'ArrowUp')
  await clickNewGame(page)
  await waitForScene(page, 'RoomInvestigationScene')
  expect(await page.evaluate(() => window.__THE_UNSPOKEN__.runtime.session.tutorial.step)).toBe(
    'move',
  )
  expect(await page.evaluate(() => window.__THE_UNSPOKEN__.runtime.session.credibility)).toBe(100)
})

test('người đã lưu có thể tiếp tục đúng tiến trình của mình', async ({ page }) => {
  await openMenu(page, 'returning-player', { [`${saveKey}.returning-player`]: snapshot })
  expect((await visibleItems(page)).map(({ label }) => label)).toEqual([
    'Ván mới',
    'Tiếp tục điều tra',
    'Cài đặt',
    'Báo lỗi',
  ])
  await press(page, 'ArrowDown')
  await press(page, 'Enter')
  await waitForScene(page, 'RoomInvestigationScene')
  expect(await page.evaluate(() => window.__THE_UNSPOKEN__.runtime.session.tutorial.step)).toBe(
    'notebook',
  )
  expect(await page.evaluate(() => window.__THE_UNSPOKEN__.runtime.session.credibility)).toBe(67)
})

test('chỉ người có bản lưu nhận cảnh báo ván mới; hủy giữ nguyên dữ liệu', async ({
  page,
}, info) => {
  const errors = []
  page.on('pageerror', (error) => errors.push(error.message))
  await openMenu(page, 'returning-player', { [`${saveKey}.returning-player`]: snapshot })
  await press(page, 'Enter')
  await page.waitForFunction(
    () => window.__THE_UNSPOKEN__.game.scene.getScene('MainMenuScene').dialog,
  )
  await page.screenshot({ path: info.outputPath('new-game-confirmation.png') })
  await press(page, 'Escape')
  expect(
    await page.evaluate(() => window.__THE_UNSPOKEN__.game.scene.getScene('MainMenuScene').dialog),
  ).toBeNull()
  expect(
    await page.evaluate(
      (key) => JSON.parse(localStorage.getItem(key)),
      `${saveKey}.returning-player`,
    ),
  ).toEqual(snapshot)
  await press(page, 'Enter')
  // Enter đầu chỉ mở hộp hỏi, chưa được bắt đầu hoặc xác nhận cùng một lần nhấn.
  expect(
    await page.evaluate(() => window.__THE_UNSPOKEN__.game.scene.isActive('MainMenuScene')),
  ).toBe(true)
  await press(page, 'Enter')
  await waitForScene(page, 'RoomInvestigationScene')
  expect(await page.evaluate(() => window.__THE_UNSPOKEN__.runtime.session.credibility)).toBe(100)
  expect(errors).toEqual([])
})

test('đổi tài khoản trong cùng trình duyệt không mang theo tiến trình người trước', async ({
  page,
}) => {
  await openMenu(page, 'returning-player', { [`${saveKey}.returning-player`]: snapshot })
  page.once('dialog', (dialog) => dialog.accept())
  await page.getByRole('button', { name: 'Đăng xuất' }).click()
  await expect(page).toHaveURL(/\/login$/)
  await page.evaluate(() => {
    localStorage.setItem(
      'theUnspoken.auth.v1',
      JSON.stringify({ token: 'menu-playtest', username: 'second-player' }),
    )
  })
  await page.goto('/play')
  await waitForScene(page, 'MainMenuScene')
  expect((await visibleItems(page)).map(({ label }) => label)).toEqual([
    'Ván mới',
    'Cài đặt',
    'Báo lỗi',
  ])
  await clickNewGame(page)
  await waitForScene(page, 'RoomInvestigationScene')
  // Lưu qua giao diện thật, sau đó tải lại menu.
  await press(page, 'n')
  await waitForScene(page, 'NotebookScene')
  const savePoint = await page.evaluate(() => {
    const button = window.__THE_UNSPOKEN__.game.scene
      .getScene('NotebookScene')
      .children.list.find((item) => item.text?.text === 'Lưu tiến trình')
    return [button.x + button.width / 2, button.y + button.height / 2]
  })
  await clickGame(page, savePoint)
  await expect(page.getByRole('status')).toContainText('Đã lưu')
  await page.reload()
  await waitForScene(page, 'MainMenuScene')
  expect((await visibleItems(page)).map(({ label }) => label)).toContain('Tiếp tục điều tra')
  expect(
    await page.evaluate(
      (key) => JSON.parse(localStorage.getItem(key)),
      `${saveKey}.returning-player`,
    ),
  ).toEqual(snapshot)
})
