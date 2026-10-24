"""
Dựng asset hành lang tầng 2 (T-024) từ ảnh gốc người dùng gửi 24/10/2026 (1672x940, không có dấu ✦).

Việc làm:
  1. Xuất nền hallway.webp giữ nguyên độ phân giải gốc (không phóng to giả).
  2. Cắt 3 lớp che (RGBA WebP) để nhân vật đi SAU chúng trông đúng chiều sâu:
     - lan can (lan can sau + đoạn lan can trái gần góc): luôn vẽ đè nhân vật (nhân vật không bao giờ
       đứng trước lan can);
     - chậu cây nhỏ cạnh góc lan can, chậu cây lớn sát lan can: xếp theo đáy chậu (baseY).
  Mặt nạ lan can = hình học (vị trí song chắn đo tay) + tách màu (lan can xám, nền tường/sàn ấm).
  Mặt nạ cây = lá xanh + viền tối sát lá + chậu (xám) trong khung chậu, cắt bỏ phần lan can.

Cách chạy (một lần, khi đổi ảnh gốc):
  python scripts/art/build_hallway_assets.py <ảnh gốc hallway.png> <thư mục ra>
Cần: Python 3.10+, Pillow, numpy, scipy, opencv-python.
In ra khung (x, y, w, h) của từng lớp che theo ảnh gốc -> đổi sang khung 1280x720 ghi vào
frontend/src/game/data/rooms/hallway.js. Mọi số đo theo ảnh gốc 24/10 — ảnh khác phải đo lại.
"""
import sys
from pathlib import Path

import cv2
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage

# Song chắn dọc của lan can sau (x0, x1) — đo trên ảnh gốc
BACK_BARS = [
    (707, 714), (740, 746), (775, 782), (811, 819), (848, 855), (883, 891), (920, 927), (956, 964),
    (994, 1001), (1030, 1037), (1063, 1072), (1098, 1103), (1134, 1139), (1165, 1170), (1197, 1202),
    (1231, 1236), (1266, 1270), (1294, 1310),
]


def polygon_mask(shape, polygons):
    h, w = shape
    layer = Image.new('L', (w, h), 0)
    draw = ImageDraw.Draw(layer)
    for points in polygons:
        draw.polygon(points, fill=255)
    return np.array(layer) > 0


def keep_large(mask, min_size):
    labels, count = ndimage.label(mask)
    if count == 0:
        return mask
    sizes = ndimage.sum(mask, labels, range(1, count + 1))
    return np.isin(labels, [i + 1 for i, s in enumerate(sizes) if s > min_size])


def build_masks(bgr):
    rgb = cv2.cvtColor(bgr, cv2.COLOR_BGR2RGB).astype(int)
    hsv = cv2.cvtColor(bgr, cv2.COLOR_BGR2HSV).astype(int)
    h, w = rgb.shape[:2]
    r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]
    yy, xx = np.mgrid[0:h, 0:w]
    green = (hsv[..., 0] > 30) & (hsv[..., 0] < 95) & (hsv[..., 1] > 55) & (g > r)
    warm = r - b > 22

    # --- Lan can ---
    rail = np.zeros((h, w), bool)
    for x0, x1 in BACK_BARS:
        rail[476:628, x0 - 1:x1 + 2] = True
    rail[468:491, 705:1312] = True  # tay vịn trên
    rail[614:627, 705:1305] = True  # thanh dưới
    left_edge = 617 + np.clip(690 - yy, 0, None) * 0.42 - 6
    roi = (xx >= left_edge) & (xx < 716) & (yy >= 462) & (yy < 648)
    left = ndimage.binary_closing(~warm & ~green & roi, iterations=2)
    rail |= keep_large(left, 150)
    rail = ndimage.binary_dilation(rail, iterations=1)
    rail |= polygon_mask(
        (h, w),
        [
            [(697, 466), (716, 464), (716, 480), (654, 648), (631, 648)],  # ống tay vịn lan can trái
            [(631, 646), (656, 646), (634, 706), (612, 706)],
            [(612, 700), (633, 700), (633, 830), (612, 830)],  # cột trước lan can trái
        ],
    )

    # --- Cây ---
    dark = rgb.max(2) < 75
    grayish = (np.abs(r - b) < 28) & (r < 150)
    rail_left = xx < 617 + np.clip(690 - yy, 0, None) * 0.42

    def plant(box, pot_box):
        x0, y0, x1, y1 = box
        inside = (xx >= x0) & (xx < x1) & (yy >= y0) & (yy < y1) & rail_left
        leaves = ndimage.binary_closing(green & inside, iterations=2)
        near = ndimage.binary_dilation(leaves, iterations=3)
        mask = leaves | (dark & near & inside)
        px0, py0, px1, py1 = pot_box
        pot = (xx >= px0) & (xx < px1) & (yy >= py0) & (yy < py1) & (grayish | dark | green)
        mask |= pot & rail_left
        mask = ndimage.binary_fill_holes(ndimage.binary_closing(mask, iterations=2))
        return keep_large(mask, 60) & inside

    plant_big = plant((522, 662, 628, 908), (550, 820, 625, 906))
    plant_small = plant((578, 592, 662, 700), (598, 640, 648, 694)) & ~plant_big
    return {'railing': rail, 'plant-a': plant_small, 'plant-b': plant_big}


def export_layer(rgb, mask, path):
    ys, xs = np.where(mask)
    x0, y0, x1, y1 = xs.min(), ys.min(), xs.max() + 1, ys.max() + 1
    alpha = cv2.GaussianBlur(mask.astype(np.float32), (0, 0), 0.7)
    alpha = np.maximum(alpha, mask * 1.0)  # mép mềm ra ngoài, lõi giữ đặc
    rgba = np.dstack([rgb, (alpha * 255).clip(0, 255).astype(np.uint8)])[y0:y1, x0:x1]
    Image.fromarray(rgba, 'RGBA').save(path, 'WEBP', lossless=True)
    return int(x0), int(y0), int(x1 - x0), int(y1 - y0)


def main(src, out_dir):
    out = Path(out_dir)
    out.mkdir(parents=True, exist_ok=True)
    bgr = cv2.imread(str(src))
    rgb = cv2.cvtColor(bgr, cv2.COLOR_BGR2RGB)
    Image.fromarray(rgb).save(out / 'hallway.webp', 'WEBP', quality=90, method=6)
    for name, mask in build_masks(bgr).items():
        box = export_layer(rgb, mask, out / f'hallway-occ-{name}.webp')
        print(name, 'x,y,w,h =', box)


if __name__ == '__main__':
    if len(sys.argv) != 3:
        sys.exit('python scripts/art/build_hallway_assets.py <hallway.png> <out_dir>')
    main(sys.argv[1], sys.argv[2])
