#!/usr/bin/env python3
"""Build favicon assets from the FULL journal cover (not the globe crop).

Candidates:
  crop120 / crop180 / crop240 : 1087x1087 square crops starting at that y offset
  fit                         : whole cover letterboxed onto a square canvas

Usage:
  python3 make-favicon-cover.py candidates   # 420px previews for review
  python3 make-favicon-cover.py final <name> # emit favicon.ico/icon.png/apple-icon.png
"""
import sys
from PIL import Image

SRC = '/home/z/my-project/upload/Iran Journal of Computer Science Cover.png'
OUT_APP = '/home/z/my-project/src/app'
W, H = 1087, 1447

def square(name):
    im = Image.open(SRC).convert('RGB')
    if name == 'fit':
        # whole cover on a square canvas padded with a cover-sampled blue
        pad = im.getpixel((6, 6))
        canvas = Image.new('RGB', (H, H), pad)
        cover = im.resize((W, H)) if im.size == (W, H) else im
        inner_w = round(W * H / H)  # cover width when scaled to square height H
        inner_w = round(W * (H / H))
        # scale cover to height H keeping aspect: width = W * H / H_orig
        iw = round(im.width * (H / im.height))
        cover = im.resize((iw, H), Image.LANCZOS)
        canvas.paste(cover, ((H - iw) // 2, 0))
        return canvas
    off = int(name.replace('crop', ''))
    return im.crop((0, off, W, off + W))

if __name__ == '__main__':
    mode = sys.argv[1] if len(sys.argv) > 1 else 'candidates'
    if mode == 'candidates':
        for n in ['crop120', 'crop180', 'crop240', 'fit']:
            sq = square(n).resize((420, 420), Image.LANCZOS)
            sq.save(f'/home/z/my-project/scripts/fav-{n}.png')
            print(f'fav-{n}.png')
    else:
        name = sys.argv[2]
        sq = square(name).convert('RGBA')
        sq.resize((512, 512), Image.LANCZOS).save(f'{OUT_APP}/icon.png', optimize=True)
        sq.resize((180, 180), Image.LANCZOS).save(f'{OUT_APP}/apple-icon.png', optimize=True)
        sq.save(f'{OUT_APP}/favicon.ico', sizes=[(16, 16), (32, 32), (48, 48)])
        # small-size previews to judge legibility
        sq.resize((48, 48), Image.LANCZOS).resize((192, 192), Image.NEAREST).save(
            '/home/z/my-project/scripts/fav-48px-preview.png')
        import os
        for p in ['favicon.ico', 'icon.png', 'apple-icon.png']:
            print(p, os.path.getsize(f'{OUT_APP}/{p}'), 'bytes')
