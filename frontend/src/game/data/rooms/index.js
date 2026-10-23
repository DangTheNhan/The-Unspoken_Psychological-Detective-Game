import { ROOM_201 } from './room201'

/** Danh sách phòng 2.5D theo id (RoomInvestigationScene nạp theo data.roomId). Thêm phòng: thêm file + khai báo ở đây. */
export const ROOMS = Object.freeze({
  [ROOM_201.id]: ROOM_201,
})

/** Phòng mở đầu Chương 1 (Bible 1.3: New Game ở phòng 201) — DEC-013. */
export const FIRST_ROOM_ID = ROOM_201.id
