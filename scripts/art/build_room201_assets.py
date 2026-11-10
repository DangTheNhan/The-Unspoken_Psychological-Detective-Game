"""
Dựng asset phòng 201 + nhân vật thám tử (T-022, DEC-013) từ ảnh gốc người dùng gửi 22/10/2026.

Việc làm:
  1. Xóa dấu ✦ của công cụ tạo ảnh ở góc ảnh (DEC-013 Q-R8): đảo phép trộn alpha của dấu.
  2. Tách nền be của 3 tấm nhân vật, cắt từng hình theo vùng liền khối, chuẩn hóa cùng tỉ lệ +
     căn tâm thân + chân chạm đáy ô, ghép atlas (Phaser JSON hash).
  3. Xuất nền phòng 1920x1080 WebP + lớp che góc dưới phải.

Cách chạy (một lần, khi đổi ảnh gốc):
  python scripts/art/build_room201_assets.py <thư mục chứa 4 ảnh gốc> <thư mục ra tạm>
  Ảnh gốc: room.png, walk_left.png, walk_right.png, turnaround.png
Cần: Python 3.10+, Pillow, numpy, scipy, opencv-python (chỉ để làm mịn vùng đã xóa dấu).
Kết quả chép tay vào frontend/public/assets/images/{backgrounds,characters}/ và art-source/.
Mọi tọa độ dấu ✦ / lớp che đo trên ảnh gốc 22/10 — ảnh khác phải đo lại.
"""
import json
import sys
from pathlib import Path

import cv2
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage

# ---------- 1. Xóa dấu ✦ ----------
WM_CENTER = {'room': (1424, 2618), 'walk_left': (1424, 112), 'walk_right': (1424, 2640), 'turnaround': (1424, 2640)}
SHEET_BG = np.array([236.0, 216.0, 191.0])


def watermark_alpha(turnaround):
    """Ước lượng độ trong suốt của dấu trên nền phẳng (tấm 4 góc), làm đối xứng 4 phía để bỏ nhiễu."""
    cy, cx = WM_CENTER['turnaround']
    r = 54
    reg = turnaround[cy - r:cy + r, cx - r:cx + r]
    a = ((reg - SHEET_BG) / (255 - SHEET_BG)).mean(axis=2).clip(0, 1)
    a = np.minimum.reduce([a, np.fliplr(a), np.flipud(a), np.flipud(np.fliplr(a))])
    a[a < 0.03] = 0
    return a


def _edge(a0):
    return ndimage.binary_dilation(a0 > 0.05, iterations=2) & ~ndimage.binary_erosion(a0 > 0.05, iterations=2)


def _grad(ch, mask):
    gx = np.abs(np.diff(ch, axis=1))[:-1, :]
    gy = np.abs(np.diff(ch, axis=0))[:, :-1]
    return ((gx + gy) * mask[:-1, :-1]).sum()


def remove_watermark(img, center, a0, name):
    r = a0.shape[0] // 2
    y, x = center
    p = img[y - r:y + r, x - r:x + r].copy()
    edge = _edge(a0)
    if name == 'room':
        # Trên nền gỗ: dò cả màu (C) lẫn độ đậm (k) của dấu
        best = None
        ring = ndimage.binary_dilation(a0 > 0.02, iterations=6) & ~(a0 > 0.02)
        for c in range(150, 256, 5):
            for k in np.arange(0.3, 1.0, 0.02):
                al = np.clip(a0 * k, 0, 0.95)[..., None]
                rec = ((p - al * c) / (1 - al)).clip(0, 255)
                sat = rec.max(2) - rec.min(2)
                s = _grad(rec.mean(axis=2), edge) + 50 * abs(sat[a0 > 0.3].mean() - sat[ring].mean()) * a0.size / 1000
                if best is None or s < best[0]:
                    best = (s, c, k)
        _, c, k = best
        al = np.clip(a0 * k, 0, 0.95)[..., None]
        rec = ((p - al * c) / (1 - al)).clip(0, 255).astype(np.uint8)
        rec = np.where((a0 > 0.03)[..., None], cv2.bilateralFilter(rec, 7, 30, 5), rec).astype(float)
    else:
        # Trên nền be: dò độ đậm từng kênh màu
        ks = []
        for ch in range(3):
            best = None
            for k in np.arange(0.3, 1.3, 0.01):
                al = np.clip(a0 * k, 0, 0.97)
                s = _grad(((p[..., ch] - al * 255) / (1 - al)).clip(0, 255), edge)
                if best is None or s < best[0]:
                    best = (s, k)
            ks.append(best[1])
        rec = np.stack([(p[..., ch] - np.clip(a0 * ks[ch], 0, 0.97) * 255) / (1 - np.clip(a0 * ks[ch], 0, 0.97)) for ch in range(3)], axis=2).clip(0, 255)
        sat = rec.max(2) - rec.min(2)
        bad = (a0 > 0.05) & (sat > (p.max(2) - p.min(2)) + 25)  # dây giày trắng: tránh ám màu
        rec = np.where(bad[..., None], rec.mean(axis=2, keepdims=True), rec)
    ring = ndimage.binary_dilation(a0 > 0.02, iterations=2) & ~ndimage.binary_erosion(a0 > 0.02, iterations=3)
    rec = np.where(ring[..., None], ndimage.median_filter(rec, size=(5, 5, 1)), rec)
    out = img.copy()
    out[y - r:y + r, x - r:x + r] = rec
    return out


# ---------- 2. Tách nền + atlas ----------
SCALE = 0.42
CELL_W, CELL_H = 264, 604


def remove_bg(rgb, wm_center):
    rgb = rgb.copy()
    cy, cx = wm_center
    reg = rgb[cy - 60:cy + 60, max(0, cx - 60):cx + 60].astype(int)
    bgc = np.array([237, 217, 189])
    light = reg.mean(axis=2) > bgc.mean() - 25
    reg[(np.abs(reg - bgc).sum(axis=2) < 110) & light] = bgc
    rgb[cy - 60:cy + 60, max(0, cx - 60):cx + 60] = reg.astype(np.uint8)
    rgbi = rgb.astype(int)
    border = np.concatenate([rgbi[0], rgbi[-1], rgbi[:, 0], rgbi[:, -1]])
    near = np.abs(rgbi - np.median(border, axis=0)).sum(axis=2) < 34
    lab, n = ndimage.label(near)
    edge_labels = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
    bgmask = np.isin(lab, list(edge_labels))
    for label in range(1, n + 1):
        if label not in edge_labels and (lab == label).sum() > 1500:
            bgmask |= lab == label
    fg = ndimage.binary_erosion(~bgmask, iterations=2)
    lab2, n2 = ndimage.label(fg)
    if n2:
        sizes = ndimage.sum(np.ones_like(lab2), lab2, range(1, n2 + 1))
        fg &= ~np.isin(lab2, [i + 1 for i, v in enumerate(sizes) if v < 400])
    alpha = np.where(fg, 255, 0).astype(np.uint8)
    alpha = np.minimum(alpha, ndimage.uniform_filter(alpha.astype(float), 3).astype(np.uint8))
    return np.dstack([rgb, alpha])


def figures(rgba, minsize=20000):
    lab, n = ndimage.label(rgba[:, :, 3] > 128)
    sizes = ndimage.sum(np.ones_like(lab), lab, range(1, n + 1))
    out = []
    for i, s in enumerate(sizes):
        if s < minsize:
            continue
        ys, xs = np.where(lab == i + 1)
        x0, x1, y0, y1 = xs.min(), xs.max() + 1, ys.min(), ys.max() + 1
        crop = rgba[y0:y1, x0:x1].copy()
        mask = lab[y0:y1, x0:x1] == i + 1
        crop[:, :, 3] = np.where(mask, crop[:, :, 3], 0)
        cx = np.median(np.where(mask[: int((y1 - y0) * 0.35)])[1])
        out.append({'x0': x0, 'img': crop, 'cx': cx})
    return sorted(out, key=lambda f: f['x0'])


def to_cell(fig, extra=1.0):
    im = Image.fromarray(fig['img'])
    s = SCALE * extra
    im = im.resize((round(im.width * s), round(im.height * s)), Image.LANCZOS)
    cell = Image.new('RGBA', (CELL_W, CELL_H), (0, 0, 0, 0))
    cell.alpha_composite(im, (max(0, round(CELL_W / 2 - fig['cx'] * s)), CELL_H - im.height - 2))
    return cell


def build_atlas(walk_left, turnaround, out_dir):
    walk = figures(walk_left)
    turn = figures(turnaround)
    hw = np.median([f['img'].shape[0] for f in walk])
    ht = np.median([f['img'].shape[0] for f in turn])
    k = min(1.0, hw * 1.03 / ht)
    cells = {f'walk-side-{i}': to_cell(f) for i, f in enumerate(walk)}
    for name, f in zip(['idle-front', 'idle-left', 'idle-right', 'idle-back'], turn):
        cells[name] = to_cell(f, k)
    cols = 5
    names = list(cells)
    atlas = Image.new('RGBA', (cols * CELL_W, ((len(names) + cols - 1) // cols) * CELL_H), (0, 0, 0, 0))
    frames = {}
    for i, n in enumerate(names):
        x, y = (i % cols) * CELL_W, (i // cols) * CELL_H
        atlas.alpha_composite(cells[n], (x, y))
        frames[n] = {'frame': {'x': x, 'y': y, 'w': CELL_W, 'h': CELL_H}, 'rotated': False, 'trimmed': False,
                     'spriteSourceSize': {'x': 0, 'y': 0, 'w': CELL_W, 'h': CELL_H},
                     'sourceSize': {'w': CELL_W, 'h': CELL_H}}
    atlas.save(out_dir / 'detective.webp', quality=90, method=6)
    meta = {'app': 'The Unspoken — scripts/art/build_room201_assets.py', 'image': 'detective.webp',
            'size': {'w': atlas.width, 'h': atlas.height}, 'scale': '1',
            'note': 'Gốc ở giữa-đáy ô (setOrigin(0.5,1)). walk-side-* nhìn sang TRÁI; đi sang phải = flipX '
                    '(tấm đi phải gửi kèm là ảnh lật gương của tấm đi trái).'}
    (out_dir / 'detective.json').write_text(json.dumps({'frames': frames, 'meta': meta}, ensure_ascii=False, indent=1), encoding='utf-8')


# ---------- 3. Nền phòng + lớp che ----------
OCCLUDER_POLYGON = [(1195, 557), (1280, 555), (1280, 720), (1110, 720), (1110, 660), (1167, 651), (1195, 652)]


def build_room(room_rgb, out_dir):
    big = Image.fromarray(room_rgb).resize((1920, 1080), Image.LANCZOS)
    big.save(out_dir / 'room201.webp', quality=86, method=6)
    rgba = big.convert('RGBA')
    mask = Image.new('L', big.size, 0)
    ImageDraw.Draw(mask).polygon([(x * 1.5, y * 1.5) for x, y in OCCLUDER_POLYGON], fill=255)
    rgba.putalpha(mask)
    rgba.crop(mask.getbbox()).save(out_dir / 'room201-occluder.webp', quality=90, method=6)


def main(src_dir, out_dir):
    src, out = Path(src_dir), Path(out_dir)
    out.mkdir(parents=True, exist_ok=True)
    load = lambda n: np.asarray(Image.open(src / f'{n}.png').convert('RGB')).astype(float)
    raw = {n: load(n) for n in WM_CENTER}
    a0 = watermark_alpha(raw['turnaround'])
    clean = {n: remove_watermark(raw[n], WM_CENTER[n], a0, n).astype(np.uint8) for n in raw}
    for n, img in clean.items():
        Image.fromarray(img).save(out / f'{n}-clean.png')
    build_room(clean['room'], out)
    build_atlas(remove_bg(clean['walk_left'], WM_CENTER['walk_left']),
                remove_bg(clean['turnaround'], WM_CENTER['turnaround']), out)
    print('Xong:', out)


if __name__ == '__main__':
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    main(sys.argv[1], sys.argv[2])
