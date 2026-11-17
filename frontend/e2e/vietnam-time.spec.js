import { expect, test } from '@playwright/test'

const now = '2026-11-16T18:00:00.000Z'
const local = '2026-11-17T01:00:00'
const shown = '17/11/2026 01:00:00'
test.setTimeout(45_000)

async function setup(page, role, state) {
  await page.clock.setFixedTime(new Date(now))
  await page.addInitScript((role) => {
    localStorage.setItem(
      'theUnspoken.auth.v1',
      JSON.stringify({
        token: 'timezone-ui-fixture',
        role,
        username: 'timezone-ui',
        userId: 7,
      }),
    )
  }, role)
  const maintenance = () => ({ serverNow: state.serverNow ?? now, ...state.maintenance })
  await page.route('**/api/**', (route) => {
    const path = new URL(route.request().url()).pathname
    if (!path.startsWith('/api/')) return route.continue()
    const reply = (json, status = 200) => route.fulfill({ status, json })
    if (path.endsWith('/auth/session')) return reply({ maintenance: maintenance() })
    if (path.endsWith('/auth/config')) return reply({})
    if (path.endsWith('/system/status')) return reply(maintenance())
    if (path === '/api/game/load/7') return reply(null)
    if (path === '/api/admin/users')
      return reply([
        {
          id: 7,
          username: 'time-player',
          email: 'time@example.test',
          role: 'ROLE_PLAYER',
          hasSave: true,
          currentChapter: 1,
          credibilityScore: 100,
          lastSavedAt: local,
        },
      ])
    if (path === '/api/admin/evidence') return reply([])
    if (path === '/api/admin/users/7/save')
      return reply({
        userId: 7,
        username: 'time-player',
        email: 'time@example.test',
        saveId: 9,
        currentChapter: 1,
        credibilityScore: 100,
        saveDataJson: '{}',
        updatedAt: `${local}+07:00`,
      })
    if (path === '/api/admin/reports/bugs')
      return reply([
        {
          id: 3,
          userId: 7,
          username: 'time-player',
          status: 'PENDING',
          reportContent: 'Kiểm thử hiển thị thời gian',
          createdAt: local,
        },
      ])
    if (path === '/api/admin/online')
      return reply({
        onlineCount: 1,
        players: [{ userId: 7, username: 'time-player', lastSeenAt: now, area: 'PLAY' }],
      })
    if (path === '/api/admin/maintenance') {
      if (route.request().method() === 'PUT') {
        const body = route.request().postDataJSON()
        state.schedules.push(body)
        state.maintenance = { active: false, scheduled: true, revision: 1, ...body }
      }
      return reply(maintenance())
    }
    if (path === '/api/admin/story/chapters')
      return reply([
        {
          chapterId: 1,
          baseHash: 'time-base',
          contractVersion: '2.0.0',
          allowlistVersion: 1,
          nodeCount: 1,
          editableFieldCount: 0,
        },
      ])
    if (path.endsWith('/nodes'))
      return reply([{ nodeId: 'time-fixture', type: 'technical', fields: [] }])
    if (path.endsWith('/draft'))
      return reply({
        baseHash: 'time-base',
        draftRevision: 1,
        publishedVersionId: null,
        overrides: [],
        updatedBy: 'time-admin',
        updatedAt: local,
      })
    if (path.endsWith('/versions'))
      return reply([
        {
          versionId: 1,
          changedFieldCount: 1,
          publishedBy: 'time-admin',
          publishedAt: now,
        },
      ])
    return reply({ message: 'No timezone fixture data' }, 404)
  })
}
const fixture = () => ({
  maintenance: { active: false, scheduled: false, revision: 0, startsAt: null, message: '' },
  schedules: [],
})

for (const timezoneId of ['UTC', 'Asia/Ho_Chi_Minh', 'America/New_York']) {
  test(`Admin dates use Vietnam in browser ${timezoneId}`, async ({ browser, baseURL }, info) => {
    const context = await browser.newContext({ baseURL, timezoneId })
    const page = await context.newPage()
    const errors = []
    page.on('pageerror', (error) => errors.push(error.message))
    try {
      await setup(page, 'ROLE_ADMIN', fixture())
      await page.goto('/admin/users')
      await expect(page.getByRole('row').filter({ hasText: 'time-player' })).toContainText(shown)
      await expect(
        page.getByRole('columnheader', { name: 'Cập nhật gần nhất (giờ Việt Nam)' }),
      ).toBeVisible()
      await page.getByRole('button', { name: 'Xem sổ tay', exact: true }).click()
      await expect(page.getByRole('dialog').getByText(shown, { exact: true })).toBeVisible()
      if (timezoneId === 'UTC')
        await page.screenshot({ path: info.outputPath('save-time-vietnam.png') })
      await page.goto('/admin/bugs')
      await expect(
        page.getByRole('row').filter({ hasText: 'Kiểm thử hiển thị thời gian' }),
      ).toContainText(shown)
      await expect(page.getByText(/Đồng bộ lúc \(giờ Việt Nam\)/)).toContainText('01:00:00')
      await page.goto('/admin/story-content')
      await expect(page.getByText(/Lưu bởi time-admin lúc/)).toContainText(shown)
      await expect(page.getByRole('region', { name: 'Lịch sử xuất bản' })).toContainText(shown)
      expect(errors).toEqual([])
    } finally {
      await context.close()
    }
  })

  test(`Vietnam maintenance input sends the same UTC instant in browser ${timezoneId}`, async ({
    browser,
    baseURL,
  }, info) => {
    const context = await browser.newContext({ baseURL, timezoneId })
    const page = await context.newPage()
    const state = fixture()
    try {
      await setup(page, 'ROLE_ADMIN', state)
      await page.goto('/admin/operations')
      await expect(page.getByText('01:00:00 (giờ Việt Nam)', { exact: true })).toBeVisible()
      await page.getByLabel('Thời điểm bắt đầu', { exact: true }).fill('2030-11-17T01:00:00')
      await page.getByLabel('Thông báo cho người chơi', { exact: true }).fill('Kiểm thử múi giờ')
      const pending = page.waitForEvent('dialog')
      const clicked = page
        .getByRole('button', { name: 'Công bố lịch bảo trì', exact: true })
        .click()
      const dialog = await pending
      expect(dialog.message()).toContain('17/11/2030 01:00:00 (giờ Việt Nam)')
      await dialog.accept()
      await clicked
      await expect(page.getByText('Đã công bố lịch và thông báo bảo trì.')).toBeVisible()
      expect(state.schedules).toEqual([
        { startsAt: '2030-11-16T18:00:00.000Z', message: 'Kiểm thử múi giờ' },
      ])
      await expect(
        page.getByText('Đã lên lịch: 17/11/2030 01:00:00 (giờ Việt Nam)', { exact: true }),
      ).toBeVisible()
      if (timezoneId === 'UTC')
        await page.screenshot({ path: info.outputPath('maintenance-vietnam-input.png') })
      await page.close()
      const player = await context.newPage()
      await setup(player, 'ROLE_PLAYER', state)
      await player.goto('/play')
      await expect(
        player.getByText('Bảo trì lúc 17/11/2030 01:00:00 (giờ Việt Nam)', { exact: true }),
      ).toBeVisible()
      await player.waitForFunction(() =>
        window.__THE_UNSPOKEN__?.game?.scene.isActive('MainMenuScene'),
      )
      const blocked = player.getByRole('heading', { name: 'Game tạm dừng để bảo trì' })
      // Check the UTC deadline itself, while the server still reports scheduled/active=false.
      state.serverNow = '2030-11-16T17:59:59.000Z'
      await player.clock.setFixedTime(new Date(state.serverNow))
      await expect(player.getByText('Còn 1 giây. Game sẽ tự dừng khi đến giờ.')).toBeVisible()
      await expect(blocked).toHaveCount(0)
      state.serverNow = '2030-11-16T18:00:00.000Z'
      await player.clock.setFixedTime(new Date(state.serverNow))
      await expect(blocked).toBeVisible()
      await expect
        .poll(() => player.evaluate(() => window.__THE_UNSPOKEN__.game.input.keyboard.enabled))
        .toBe(false)
    } finally {
      await context.close()
    }
  })
}
