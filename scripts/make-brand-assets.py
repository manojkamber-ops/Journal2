#!/usr/bin/env python3
"""Generate web brand assets from the uploaded journal cover.

Produces (final mode):
  public/logo-mark.png      square globe crop, 256x256 (header/footer logo)
  src/app/favicon.ico       multi-size ICO 16/32/48
  src/app/icon.png          512x512 PNG (Next metadata convention)
  src/app/apple-icon.png    180x180 PNG
  public/cover-vol9.webp    full cover, 520px wide (homepage hero)

Usage:
  python3 make-brand-assets.py candidates        # dump crop candidates for review
  python3 make-brand-assets.py final A           # build final assets using globe crop A
  python3 make-brand-assets.py coverpreviews     # dump square cover-icon variants for review
  python3 make-brand-assets.py cover navy        # favicon/apple/icon from the FULL COVER (square, contained)
"""
import sys
from PIL import Image

SRC = '/home/z/my-project/upload/Iran Journal of Computer Science Cover.png'
OUT_PUBLIC = '/home/z/my-project/public'
OUT_APP = '/home/z/my-project/src/app'

# Candidate square crops (left, top, right, bottom) around the globe,
# chosen to avoid the Springer wordmark (top-right) and the title band (y >= ~480).
CROPS = {
    'A': (0, 0, 480, 480),
    'B': (30, 0, 560, 530),
    'C': (0, 40, 500, 540),
    'D': (60, 0, 620, 560),
    'E': (0, 0, 640, 640),  # likely too tall — includes title band, for comparison
}

def gen_candidates():
    im = Image.open(SRC).convert('RGB')
    for name, box in CROPS.items():
        c = im.crop(box).resize((420, 420), Image.LANCZOS)
        c.save(f'/home/z/my-project/scripts/crop-{name}.png')
        print(f'crop-{name}.png  box={box}')

def save_icon_set(rgba512):
    """Write favicon.ico (16/32/48), icon.png (512) and apple-icon.png (180) from a 512 RGBA source."""
    rgba512.save(f'{OUT_APP}/icon.png', optimize=True)                      # 512
    rgba512.resize((180, 180), Image.LANCZOS).save(f'{OUT_APP}/apple-icon.png', optimize=True)
    rgba512.save(f'{OUT_APP}/favicon.ico', sizes=[(16, 16), (32, 32), (48, 48)])

def cover_square(bg_rgb, pad=0.04):
    """Full cover contained in a square canvas, vertically near-full-bleed."""
    im = Image.open(SRC).convert('RGB')
    S = 512
    canvas = Image.new('RGBA', (S, S), tuple(bg_rgb) + (255,))
    h = int(S * (1 - pad * 2))
    w = round(im.width * h / im.height)          # ~0.751 * h
    c = im.resize((w, h), Image.LANCZOS)
    canvas.paste(c, ((S - w) // 2, (S - h) // 2))
    return canvas

# Backgrounds sampled to harmonise with the cover (navy = cover's own deep space blue)
COVER_BGS = {
    'navy': (7, 32, 66),
    'white': (255, 255, 255),
    'ink': (17, 24, 39),
}

def gen_cover_previews():
    for name, bg in COVER_BGS.items():
        cover_square(bg).resize((256, 256), Image.LANCZOS).save(f'/home/z/my-project/scripts/covericon-{name}.png')
        print(f'covericon-{name}.png  bg={bg}')

def build_cover(bg_name):
    icon = cover_square(COVER_BGS[bg_name]).convert('RGBA')  # RGBA required by Next ICO/PNG decoder
    save_icon_set(icon)
    import os
    for p in ['favicon.ico', 'icon.png', 'apple-icon.png']:
        print(p, os.path.getsize(os.path.join(OUT_APP, p)), 'bytes')

def build(name):
    box = CROPS[name]
    im = Image.open(SRC).convert('RGB')

    mark = im.crop(box).resize((512, 512), Image.LANCZOS)
    rgba = mark.convert('RGBA')  # Next.js ICO/PNG decoder requires RGBA

    # Logo mark for header/footer (256 px is plenty for a 52 px display @4x)
    rgba.resize((256, 256), Image.LANCZOS).save(f'{OUT_PUBLIC}/logo-mark.png', optimize=True)

    # Favicon + metadata icons
    save_icon_set(rgba)

    # Full cover for the homepage hero
    cover_w = 520
    cover = im.resize((cover_w, round(im.height * cover_w / im.width)), Image.LANCZOS)
    try:
        cover.save(f'{OUT_PUBLIC}/cover-vol9.webp', quality=88, method=6)
        cov_out = f'{OUT_PUBLIC}/cover-vol9.webp'
    except Exception as e:
        cover.save(f'{OUT_PUBLIC}/cover-vol9.jpg', quality=88)
        cov_out = f'{OUT_PUBLIC}/cover-vol9.jpg'
        print('webp failed, fell back to jpg:', e)

    import os
    for p in ['logo-mark.png', cov_out.split('/')[-1]]:
        print(p, os.path.getsize(os.path.join(OUT_PUBLIC, p)), 'bytes')
    for p in ['favicon.ico', 'icon.png', 'apple-icon.png']:
        print(p, os.path.getsize(os.path.join(OUT_APP, p)), 'bytes')

if __name__ == '__main__':
    mode = sys.argv[1] if len(sys.argv) > 1 else 'candidates'
    if mode == 'candidates':
        gen_candidates()
    elif mode == 'coverpreviews':
        gen_cover_previews()
    elif mode == 'cover':
        build_cover(sys.argv[2] if len(sys.argv) > 2 else 'navy')
    else:
        build(sys.argv[2] if len(sys.argv) > 2 else 'B')
