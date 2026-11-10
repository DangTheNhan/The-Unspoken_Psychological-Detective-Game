// Vùng sàn và điểm đứng đo trên nền hiện có theo khung logic 1280 × 720.
export const ROOM_204 = {
  id: 'room204',
  background: { key: 'bg-room204', url: 'assets/images/backgrounds/room204.webp' },
  occluders: [],
  walkArea: [
    [90, 632],
    [315, 532],
    [952, 532],
    [1190, 634],
    [1190, 655],
    [90, 655],
  ],
  obstacles: [],
  spawn: { x: 199, y: 624, face: 'up' },
  depth: { nearY: 655, nearHeight: 315, farY: 532, farHeight: 216 },
  hotspots: [],
}

// Thi thể có hotspot riêng. Ảnh thi thể chờ quyết định TD-49.
export const ROOM_204_HOTSPOTS = {
  HP_LOCK: { rect: [152, 340, 45, 130], stand: [225, 601] },
  HP_SINK: { rect: [1172, 304, 108, 125], stand: [1042, 593] },
  HP_NECK: { rect: [921, 490, 78, 53], stand: [922, 565] },
  HP_INHALER: { rect: [381, 319, 40, 41], stand: [359, 560] },
  HP_TRASH: { rect: [502, 408, 55, 73], stand: [527, 559] },
  HP_RECEIPT: { rect: [486, 334, 73, 45], stand: [449, 559] },
  HP_DUST: { rect: [645, 368, 79, 39], stand: [688, 559] },
  HP_BED: { rect: [725, 333, 230, 157], stand: [806, 559] },
  HP_BOARD: { rect: [565, 210, 160, 112], stand: [617, 559] },
  P2_EXIT_CHECK: { rect: [35, 128, 114, 454], stand: [156, 630] },
}
