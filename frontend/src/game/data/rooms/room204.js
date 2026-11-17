import { ROOM_201 } from './room201'

// Vùng sàn và điểm đứng đo trên nền hiện có theo khung logic 1280 × 720.
// T-070 / DEC-034: giữ nhịp phối cảnh của 201, căn riêng 204 theo cửa và chiều dài Tùng.
// +25% so với T-069: ở cửa ~377/454px; cạnh Tùng ~384px. Ảnh/vật chứng giữ nguyên.
const CHARACTER_SCALE = 1.25
export const ROOM_204 = {
  id: 'room204',
  background: { key: 'bg-room204', url: 'assets/images/backgrounds/room204.webp' },
  backgroundWithTung: {
    key: 'bg-room204-tung',
    url: 'assets/images/characters/Tunginroom.png',
  },
  occluders: [],
  walkArea: [
    // Cắt đa giác sàn cũ tại y=615: giao cạnh trái/phải ≈129/1145; không sao chép sàn 201.
    [129, 615],
    [315, 532],
    [952, 532],
    [1145, 615],
  ],
  // Phần thân, tay và chân nằm trong dải sàn đi lại của cảnh khám hiện trường.
  obstacles: [
    [
      [552, 484],
      [642, 478],
      [726, 495],
      [818, 509],
      [893, 536],
      [891, 557],
      [846, 558],
      [774, 548],
      [684, 539],
      [615, 544],
      [586, 561],
      [555, 559],
      [557, 543],
      [575, 529],
      [551, 507],
    ],
  ],
  spawn: { x: 225, y: 600, face: 'up' },
  depth: {
    ...ROOM_201.depth,
    farHeight: ROOM_201.depth.farHeight * CHARACTER_SCALE,
    nearHeight: ROOM_201.depth.nearHeight * CHARACTER_SCALE,
  },
  hotspots: [],
}

export const ROOM_204_NECK_PHOTO = {
  key: 'room204-neck-photo',
  url: 'assets/images/characters/Tung.png',
  frame: 'neck-and-collar',
  crop: [28, 75, 630, 420],
}

// Khung và điểm đứng theo nền Tunginroom.png.
export const ROOM_204_HOTSPOTS = {
  HP_LOCK: { rect: [152, 340, 45, 130], stand: [255, 580] },
  HP_SINK: { rect: [1172, 304, 108, 125], stand: [1042, 593] },
  HP_NECK: { rect: [550, 481, 96, 55], stand: [582, 587] },
  HP_INHALER: { rect: [381, 319, 40, 41], stand: [359, 560] },
  HP_TRASH: { rect: [502, 408, 55, 73], stand: [511, 575] },
  HP_RECEIPT: { rect: [486, 334, 73, 45], stand: [449, 559] },
  HP_DUST: { rect: [645, 368, 79, 39], stand: [688, 586] },
  HP_BED: { rect: [725, 333, 230, 157], stand: [806, 588] },
  HP_BOARD: { rect: [565, 210, 160, 112], stand: [623, 587] },
  P2_EXIT_CHECK: { rect: [35, 128, 114, 454], stand: [207, 600] },
}
