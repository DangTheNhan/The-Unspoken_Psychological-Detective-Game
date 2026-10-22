/**
 * Phòng 201 — phòng của thám tử, nơi New Game bắt đầu (Bible 1.3 A3; P1_001) — DEC-013.
 * Map đầu tiên sau intro, có tutorial (di chuyển, tương tác, Sổ tay).
 *
 * MỌI tọa độ theo khung logic 1280×720 (gameConfig). Số đo đo trên ảnh nền gốc 2730×1536 (TẠM —
 * chỉnh bằng overlay debug: bật env.debug, phím F8, bấm chuột để in tọa độ ra console).
 *
 * - walkArea: đa giác SÀN đi được (theo chiều kim đồng hồ không bắt buộc). Mép trên đặt ở mép trước
 *   đồ đạc (y≈474) nên nhân vật không chui vào khe giữa bàn và giường.
 * - obstacles: đa giác CHÂN đồ đạc nằm trong vùng sàn (nhân vật không đi xuyên).
 * - occluders: ảnh cắt từ nền, vẽ ĐÈ lên nhân vật khi nhân vật đứng phía sau đồ vật.
 * - hotspots: rect = vùng bấm chuột trên ảnh; stand = điểm chân nhân vật đứng khi tương tác;
 *   face = hướng quay mặt; textKey = khóa nội dung khi xem — null = CHƯA CÓ (DEC-013 Q-R3: để trống,
 *   bổ sung khi người dùng yêu cầu).
 * - depth: chiều cao nhân vật (px) theo y chân — nội suy tuyến tính giữa 2 mốc (phối cảnh).
 */
export const ROOM_201 = Object.freeze({
  id: 'room201',
  background: { key: 'bg-room201', url: 'assets/images/backgrounds/room201.webp' },
  occluders: Object.freeze([
    Object.freeze({
      key: 'occ-room201-corner',
      url: 'assets/images/backgrounds/room201-occluder.webp',
      // Góc trên-trái và kích thước của ảnh lớp che trong khung 1280×720
      x: 1110,
      y: 555.33,
      width: 170,
      height: 164.67,
    }),
  ]),
  walkArea: Object.freeze([
    [0, 720],
    [0, 642],
    [35, 600],
    [165, 530],
    [268, 492],
    [268, 474],
    [428, 474],
    [428, 490],
    [522, 490],
    [522, 474],
    [930, 474],
    [930, 543],
    [1030, 543],
    [1030, 550],
    [1135, 553],
    [1195, 560],
    [1195, 652],
    [1167, 653],
    [1110, 661],
    [1110, 720],
  ]),
  // Chân đồ đạc nằm giữa sàn (đồ sát tường đã được loại khỏi walkArea). Phòng 201 hiện không có.
  obstacles: Object.freeze([]),
  spawn: Object.freeze({ x: 640, y: 600, face: 'down' }),
  depth: Object.freeze({ nearY: 690, nearHeight: 560, farY: 474, farHeight: 245 }),
  hotspots: Object.freeze([
    Object.freeze({
      id: 'R201_DOOR',
      nameKey: 'room201.door',
      rect: [30, 72, 122, 525],
      stand: [190, 585],
      face: 'left',
      action: 'exit',
      textKey: null,
    }),
    Object.freeze({
      id: 'R201_BOARD',
      nameKey: 'room201.board',
      rect: [332, 168, 236, 150],
      stand: [470, 500],
      face: 'up',
      action: 'inspect',
      textKey: null,
    }),
    Object.freeze({
      id: 'R201_DESK',
      nameKey: 'room201.desk',
      rect: [328, 322, 100, 58],
      stand: [370, 485],
      face: 'up',
      action: 'inspect',
      textKey: null,
    }),
    Object.freeze({
      id: 'R201_CALENDAR',
      nameKey: 'room201.calendar',
      rect: [605, 182, 50, 70],
      stand: [630, 486],
      face: 'up',
      action: 'inspect',
      textKey: null,
    }),
    Object.freeze({
      id: 'R201_COATS',
      nameKey: 'room201.coats',
      rect: [850, 236, 85, 120],
      stand: [880, 486],
      face: 'up',
      action: 'inspect',
      textKey: null,
    }),
    Object.freeze({
      id: 'R201_WINDOW',
      nameKey: 'room201.window',
      rect: [955, 105, 90, 215],
      stand: [915, 556],
      face: 'right',
      action: 'inspect',
      textKey: null,
    }),
  ]),
  // Vòng sáng bước 1 của tutorial (đi tới đây)
  tutorialMarker: Object.freeze({ x: 760, y: 560 }),
})
