/**
 * Lời thoại DEMO chỉ để xem thử nhân vật nửa thân + nhép miệng (DebugScene, phím F9).
 * KHÔNG phải kịch bản — lời thoại thật nằm trong public/assets/dialogues/ (chờ ISS-07).
 * Định dạng câu thoại: xem data/characters.js.
 */
export const PORTRAIT_DEMO_LINES = Object.freeze([
  {
    speaker: 'Ông chủ trọ',
    text: 'Nhân vật xuất hiện ở phía bên phải màn hình, nhép miệng theo lời thoại.',
    character: 'landlord',
    expression: 'smirk',
    talk: 'smug',
    position: 'right',
  },
  {
    speaker: 'Thám tử',
    text: 'sau đó duy cởi quần còn hoàng thì cởi áo, 2 đứa đỗi cho nhau nhau, tình anh em nghĩa hi',
  },
  {
    speaker: 'Ông chủ trọ',
    text: 'Nhân vật chuyển sang phía bên trái màn hình, đứng yên, không nhép miệng.',
    character: 'landlord',
    expression: 'stern',
    talk: 'normal',
    position: 'left',
  },
  {
    speaker: 'Ông chủ trọ',
    text: 'Khi không dùng biến talk do phaser hỗ trợ nhân vật sẽ đứng yên, không nhép miệng. Khi dùng biến talk, nhân vật sẽ nhép miệng theo lời thoại.',
    character: 'landlord',
    expression: 'smirk',
    position: 'left',
  },
])
