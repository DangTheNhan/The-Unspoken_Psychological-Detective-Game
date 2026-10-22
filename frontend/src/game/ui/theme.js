/**
 * Bảng màu + kiểu chữ dùng trong canvas. Đổi giao diện game = sửa file này.
 * (Giá trị kỹ thuật tạm — tài liệu chưa quy định art direction.)
 */
export const COLORS = Object.freeze({
  background: 0x17151b,
  panel: 0x241f2b,
  panelBorder: 0x5c5266,
  accent: 0xf2b84b,
  danger: 0xd9534f,
  textHex: '#f4efe6',
  mutedHex: '#a89f94',
  accentHex: '#f2b84b',
})

/**
 * Màu phụ của menu & cài đặt (bản thiết kế đã chốt — DEC-012). Giá trị kỹ thuật, không có trong nguồn.
 */
export const MENU_COLORS = Object.freeze({
  overlay: 0x0f0e12, // nền tối phủ sau bảng Cài đặt / hộp xác nhận
  divider: 0x3d3546, // vạch dưới tab, trên chân bảng
  rowDivider: 0x2f2937, // vạch giữa các dòng thiết lập
  hover: 0x2f2937, // nền nút khi rê chuột
  track: 0x3a3342, // rãnh thanh trượt / công tắc
  muted: 0xa89f94, // = COLORS.mutedHex dạng số (núm công tắc khi tắt)
  accentHover: 0xf6c76b, // nút chính khi rê chuột
  disabledHex: '#6f6874', // chữ mục bị khóa (vd chưa có bản lưu)
  plateHex: '#c9b48a', // số phòng 204 trên cảnh nền
  darkTextHex: '#17151b', // chữ trên nền hổ phách
})

export const FONT_FAMILY = 'system-ui, "Segoe UI", Roboto, sans-serif'

/**
 * 3 họ chữ của menu (DEC-012) — đều có đủ dấu tiếng Việt, giấy phép OFL, khai báo @font-face trong
 * src/styles/index.css, file đặt ở public/assets/fonts/. Thiếu file -> trình duyệt dùng font kế tiếp.
 */
export const FONTS = Object.freeze({
  display: '"Playfair Display", Georgia, "Times New Roman", serif', // tiêu đề
  body: '"Be Vietnam Pro", system-ui, "Segoe UI", Roboto, sans-serif', // chữ thường, nút
  mono: '"JetBrains Mono", Consolas, "Courier New", monospace', // nhãn nhỏ kiểu đánh máy
})

/** Vẽ chữ ở độ phân giải gấp đôi để không nhòe khi Scale.FIT phóng to canvas trên màn hình lớn. */
export const TEXT_RESOLUTION = 2

export const TEXT_STYLES = Object.freeze({
  title: { fontFamily: FONT_FAMILY, fontSize: '56px', color: COLORS.textHex },
  heading: { fontFamily: FONT_FAMILY, fontSize: '28px', color: COLORS.textHex },
  body: { fontFamily: FONT_FAMILY, fontSize: '22px', color: COLORS.textHex },
  small: { fontFamily: FONT_FAMILY, fontSize: '16px', color: COLORS.mutedHex },
  button: { fontFamily: FONT_FAMILY, fontSize: '28px', color: COLORS.textHex },
})

/** Thứ tự lớp vẽ (depth) — tránh số cứng rải rác. */
export const DEPTH = Object.freeze({
  BACKGROUND: 0,
  HOTSPOT: 10,
  HUD: 100,
  CHARACTER: 150, // nhân vật nửa thân (CharacterStage) — sau khung thoại
  OVERLAY: 200,
  DEBUG: 1000,
})

/**
 * Kiểu chữ cho menu/cài đặt (DEC-012). padding dọc chừa chỗ cho dấu tiếng Việt chồng tầng (ệ, ỗ, Ữ).
 * @param {{ font?: keyof FONTS, size: number, color?: string, weight?: string|number,
 *           letterSpacing?: number, align?: string, wrapWidth?: number }} options
 */
export function menuTextStyle({
  font = 'body',
  size,
  color = COLORS.textHex,
  weight = 'normal',
  letterSpacing = 0,
  align = 'left',
  wrapWidth,
}) {
  return {
    fontFamily: FONTS[font],
    fontSize: `${size}px`,
    fontStyle: String(weight),
    color,
    letterSpacing,
    align,
    resolution: TEXT_RESOLUTION,
    padding: { x: 0, y: Math.ceil(size * 0.15) },
    ...(wrapWidth ? { wordWrap: { width: wrapWidth, useAdvancedWrap: true } } : {}),
  }
}
