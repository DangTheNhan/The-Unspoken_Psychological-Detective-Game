import { mkdirSync, writeFileSync } from 'node:fs'
import { expect, test } from '@playwright/test'

test.setTimeout(60_000)
const stage = process.env.G5_QA_STAGE ?? 'calibrated'
const previewScale = Number(process.env.G5_PREVIEW_SCALE ?? 1)
const directory = 'node_modules/.cache/teets2-g5-qa'

async function setup(page) {
  const errors = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.addInitScript(() => {
    localStorage.setItem(
      'theUnspoken.auth.v1',
      JSON.stringify({ token: 'g5-fixture', username: 'g5-ui', role: 'ROLE_PLAYER' }),
    )
    localStorage.setItem('theUnspoken.settings.v1', JSON.stringify({ textSpeed: 'instant' }))
  })
  await page.route('**/api/**', (route) => {
    const url = new URL(route.request().url())
    if (!url.pathname.startsWith('/api/')) return route.continue()
    const system = {
      active: false,
      scheduled: false,
      revision: 0,
      startsAt: null,
      message: '',
      serverNow: new Date().toISOString(),
    }
    if (url.pathname.endsWith('/auth/session'))
      return route.fulfill({ json: { maintenance: system } })
    if (url.pathname.endsWith('/auth/config')) return route.fulfill({ json: {} })
    if (url.pathname.endsWith('/system/status')) return route.fulfill({ json: system })
    if (url.pathname.endsWith('/story-text'))
      return route.fulfill({
        json: {
          chapterId: 1,
          baseHash: url.searchParams.get('baseHash'),
          contractVersion: '2.0.0',
          allowlistVersion: 1,
          versionId: null,
          overrides: [],
        },
      })
    return route.fulfill({ status: 404, json: { message: 'No G5 fixture data' } })
  })
  await page.goto('/play')
  await page.waitForFunction(() => window.__THE_UNSPOKEN__?.game.scene.isActive('MainMenuScene'))
  await page.keyboard.press('Enter')
  await page.waitForFunction(() =>
    window.__THE_UNSPOKEN__?.game.scene.isActive('RoomInvestigationScene'),
  )
  if (previewScale !== 1) {
    await page.evaluate(async (factor) => {
      const { ROOM_204 } = await import('/src/game/data/rooms/room204.js')
      ROOM_204.depth = {
        ...ROOM_204.depth,
        farHeight: ROOM_204.depth.farHeight * factor,
        nearHeight: ROOM_204.depth.nearHeight * factor,
      }
    }, previewScale)
  }
  return errors
}

/** Technical scene fixture for scale/collision QA; never writes a server or changes runtime JSON. */
async function room(page, id, { x, y }, variant = 'crime') {
  await page.evaluate(
    ({ id, x, y, variant }) => {
      const { runtime, game } = window.__THE_UNSPOKEN__
      const graph = game.cache.json.get('chapter1-graph')
      const state = structuredClone(game.cache.json.get('chapter1-state').initialState)
      if (id === 'room204') {
        state.current_node = variant === 'opening' ? 'P1_ROOM_204_VIEW' : 'P2_ROOM_UI'
        state.current_phase = variant === 'opening' ? 1 : 2
        state.flags.inspect_permission = variant !== 'opening'
        state.flags.samples_submitted = variant === 'empty'
      }
      state.scene_location = id
      runtime.startNewGame(state, { graph, versionId: null, status: 'base' })
      runtime.session.tutorial = { step: null, status: 'skipped' }
      runtime.session.player = { roomId: id, x, y, face: 'down' }
      if (id === 'room204') runtime.startStory(graph)
      const scene = game.scene.getScene('RoomInvestigationScene')
      scene.__g5PreviousPlayer = scene.player
      scene.scene.restart({ chapter: 1, roomId: id })
    },
    { id, x, y, variant },
  )
  await page.waitForFunction((id) => {
    const scene = window.__THE_UNSPOKEN__.game.scene.getScene('RoomInvestigationScene')
    return (
      scene.roomId === id &&
      scene.sys.isActive() &&
      scene.player &&
      scene.player !== scene.__g5PreviousPlayer &&
      !scene.cameras.main.fadeEffect.isRunning
    )
  }, id)
  await page.evaluate(() => new Promise(requestAnimationFrame))
}

async function details(page) {
  return page.evaluate(() => {
    const { player, room, hotspots } =
      window.__THE_UNSPOKEN__.game.scene.getScene('RoomInvestigationScene')
    const frame = player.sprite.frame
    const canvas = document.createElement('canvas')
    canvas.width = frame.cutWidth
    canvas.height = frame.cutHeight
    const context = canvas.getContext('2d')
    context.drawImage(
      player.sprite.texture.getSourceImage(),
      frame.cutX,
      frame.cutY,
      frame.cutWidth,
      frame.cutHeight,
      0,
      0,
      frame.cutWidth,
      frame.cutHeight,
    )
    const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data
    let top = canvas.height,
      bottom = -1
    for (let y = 0; y < canvas.height; y++)
      for (let x = 0; x < canvas.width; x++) {
        if (pixels[(y * canvas.width + x) * 4 + 3] >= 128) {
          top = Math.min(top, y)
          bottom = Math.max(bottom, y)
        }
      }
    return {
      roomId: room.id,
      x: player.x,
      y: player.y,
      height: player.y - player.headY,
      visibleHeight: (bottom - top + 1) * Math.abs(player.sprite.scaleY),
      depth: room.depth,
      hotspots: hotspots.map(({ id, stand, rect }) => ({ id, stand, rect })),
    }
  })
}

test('room 201 reference and room 204 at three depths with both backgrounds', async ({ page }) => {
  mkdirSync(directory, { recursive: true })
  const errors = await setup(page)
  const measurements = []
  for (const id of ['room201', 'room204']) {
    for (const [pose, y] of [
      ['far', 550],
      ['middle', 587],
      ['near', 605],
    ]) {
      await room(page, id, { x: id === 'room201' ? 640 : 400, y })
      measurements.push({ pose, ...(await details(page)) })
      await page.locator('canvas').screenshot({ path: `${directory}/${stage}-${id}-${pose}.png` })
    }
  }
  await room(page, 'room204', { x: 400, y: 587 }, 'empty')
  await expect
    .poll(() =>
      page.evaluate(() =>
        window.__THE_UNSPOKEN__.game.scene
          .getScene('RoomInvestigationScene')
          .children.list.some((child) => child.texture?.key === 'bg-room204'),
      ),
    )
    .toBe(true)
  await page.locator('canvas').screenshot({ path: `${directory}/${stage}-room204-empty.png` })
  for (const [name, position] of [
    ['door', { x: 255, y: 580 }],
    ['body', { x: 582, y: 587 }],
  ]) {
    await room(page, 'room204', position)
    measurements.push({ pose: name, ...(await details(page)) })
    await page.locator('canvas').screenshot({ path: `${directory}/${stage}-room204-${name}.png` })
  }
  writeFileSync(`${directory}/${stage}-measurements.json`, JSON.stringify(measurements, null, 2))
  if (stage === 'calibrated' && previewScale === 1) {
    for (const pose of ['far', 'middle', 'near']) {
      const reference = measurements.find((m) => m.roomId === 'room201' && m.pose === pose)
      const adjusted = measurements.find((m) => m.roomId === 'room204' && m.pose === pose)
      expect(adjusted.visibleHeight).toBeGreaterThan(reference.visibleHeight * 1.2)
      expect(adjusted.visibleHeight).toBeLessThan(reference.visibleHeight * 1.3)
      expect(adjusted.y).toBeLessThanOrEqual(615)
    }
    const door = measurements.find((m) => m.pose === 'door')
    const doorway = door.hotspots.find((h) => h.id === 'P2_EXIT_CHECK')
    expect(door.visibleHeight / doorway.rect[3]).toBeGreaterThan(0.8)
    expect(door.visibleHeight / doorway.rect[3]).toBeLessThan(0.9)
    const besideBody = measurements.find((m) => m.pose === 'body')
    expect(besideBody.visibleHeight).toBeGreaterThan(350)
    expect(besideBody.visibleHeight).toBeLessThan(405)
  }
  expect(errors).toEqual([])
})

async function click(page, x, y) {
  const box = await page.locator('canvas').boundingBox()
  await page.mouse.click(box.x + (x * box.width) / 1280, box.y + (y * box.height) / 720)
}
async function floorIsClear(page) {
  return page.evaluate(async () => {
    const { isFootClear } = await import('/src/game/systems/walkArea.js')
    const { footAt } = await import('/src/game/systems/depthScale.js')
    const { player, room } = window.__THE_UNSPOKEN__.game.scene.getScene('RoomInvestigationScene')
    return isFootClear(room, [player.x, player.y], footAt(room.depth, player.y))
  })
}

test('WASD/arrows respect the body and foreground; mouse paths go around the body', async ({
  page,
}) => {
  const errors = await setup(page)
  await room(page, 'room204', { x: 830, y: 600 })
  await page.keyboard.down('w')
  await page.waitForTimeout(850)
  await page.keyboard.up('w')
  const blocked = await details(page)
  expect(blocked.y).toBeGreaterThan(558)
  expect(blocked.y).toBeLessThan(590)
  expect(await floorIsClear(page)).toBe(true)
  await page.keyboard.down('ArrowDown')
  await page.waitForTimeout(650)
  await page.keyboard.up('ArrowDown')
  expect((await details(page)).y).toBeLessThanOrEqual(615)
  expect(await floorIsClear(page)).toBe(true)

  await room(page, 'room204', { x: 400, y: 550 })
  await page.evaluate(() => {
    const scene = window.__THE_UNSPOKEN__.game.scene.getScene('RoomInvestigationScene')
    const trail = []
    const sample = () => trail.push([scene.player.x, scene.player.y])
    window.__g5Trail = trail
    window.__g5StopSampling = () => scene.events.off('update', sample)
    scene.events.on('update', sample)
  })
  await click(page, 1000, 580)
  await page.waitForFunction(() => {
    const p = window.__THE_UNSPOKEN__.game.scene.getScene('RoomInvestigationScene').player
    return !p.path && Math.hypot(p.x - 1000, p.y - 580) < 3
  })
  expect(
    await page.evaluate(async () => {
      window.__g5StopSampling()
      const { isFootClear } = await import('/src/game/systems/walkArea.js')
      const { footAt } = await import('/src/game/systems/depthScale.js')
      const { room } = window.__THE_UNSPOKEN__.game.scene.getScene('RoomInvestigationScene')
      return (
        window.__g5Trail.length > 10 &&
        window.__g5Trail.every(([x, y]) => isFootClear(room, [x, y], footAt(room.depth, y)))
      )
    }),
  ).toBe(true)
  await page.keyboard.down('d')
  await page.waitForTimeout(200)
  await page.keyboard.up('d')
  expect((await details(page)).x).toBeGreaterThan(1000)
  expect(await floorIsClear(page)).toBe(true)
  expect(errors).toEqual([])
})

test('an old foreground save resumes safely and the Notebook saves/reloads the corrected position', async ({
  page,
}) => {
  const errors = await setup(page)
  await room(page, 'room204', { x: 400, y: 587 })
  const story = await page.evaluate(() => {
    const { runtime } = window.__THE_UNSPOKEN__
    const snapshot = runtime.session.toSaveSnapshot()
    const body = JSON.parse(snapshot.saveDataJson)
    body.player = { roomId: 'room204', x: 199, y: 624, face: 'up' }
    snapshot.saveDataJson = JSON.stringify(body)
    localStorage.setItem('theUnspoken.save.backup.v1.g5-ui', JSON.stringify(snapshot))
    return body.state
  })
  async function continueGame() {
    await page.reload()
    await page.waitForFunction(() => window.__THE_UNSPOKEN__?.game.scene.isActive('MainMenuScene'))
    await page.keyboard.press('ArrowDown')
    await page.evaluate(() => new Promise(requestAnimationFrame))
    await page.keyboard.press('Enter')
    await page.waitForFunction(() => {
      const scene = window.__THE_UNSPOKEN__?.game.scene.getScene('RoomInvestigationScene')
      return (
        scene?.sys.isActive() &&
        scene.roomId === 'room204' &&
        !scene.cameras.main.fadeEffect.isRunning
      )
    })
  }
  await continueGame()
  expect(await floorIsClear(page)).toBe(true)
  const corrected = await details(page)
  expect(corrected.y).toBeLessThan(615)
  expect(await page.evaluate(() => window.__THE_UNSPOKEN__.runtime.story.state)).toEqual(story)
  await page.keyboard.press('n')
  await page.waitForFunction(() => window.__THE_UNSPOKEN__.game.scene.isActive('NotebookScene'))
  const button = await page.evaluate(() => {
    const scene = window.__THE_UNSPOKEN__.game.scene.getScene('NotebookScene')
    const object = scene.children.list.find(
      (child) => child.text === 'Lưu tiến trình' || child.text?.text === 'Lưu tiến trình',
    )
    const bounds = object.getBounds()
    return [bounds.centerX, bounds.centerY]
  })
  await click(page, ...button)
  await page.waitForFunction(
    () =>
      JSON.parse(JSON.parse(localStorage.getItem('theUnspoken.save.backup.v1.g5-ui')).saveDataJson)
        .player.y < 615,
  )
  const saved = await page.evaluate(() =>
    JSON.parse(JSON.parse(localStorage.getItem('theUnspoken.save.backup.v1.g5-ui')).saveDataJson),
  )
  expect(saved.state).toEqual(story)
  expect(saved.player.x).toBeCloseTo(corrected.x)
  expect(saved.player.y).toBeCloseTo(corrected.y)
  await continueGame()
  const reloaded = await details(page)
  expect(reloaded.x).toBeCloseTo(saved.player.x)
  expect(reloaded.y).toBeCloseTo(saved.player.y)
  expect(await floorIsClear(page)).toBe(true)
  expect(errors).toEqual([])
})
