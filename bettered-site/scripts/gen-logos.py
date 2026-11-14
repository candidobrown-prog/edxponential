# Regenerates the logo SVGs. Usage: python3 scripts/gen-logos.py src/assets /path/to/Arialbd.TTF  (Arial Bold is not stored in this repo; the logo lettering is outlined.)
import sys
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
A = sys.argv[1]
def text_path(font, s, size, x, y, track=0.0):
    t = TTFont(font if font.startswith('/') else f'{A}/fonts/{font}'); gs = t.getGlyphSet(); cmap = t.getBestCmap(); upm = t['head'].unitsPerEm
    k = size / upm; pen = SVGPathPen(gs); cx = x
    for ch in s:
        g = cmap[ord(ch)]
        gs[g].draw(TransformPen(pen, (k, 0, 0, -k, cx, y)))
        cx += gs[g].width * k + track * size
    return pen.getCommands(), cx - track * size
NAVY, GOLD, WHITE = '#0B1F3A', '#FFC20E', '#FFFFFF'
BOWLS = ['M208 0H236A64 72 0 0 1 236 144H208Z', 'M208 156H232A68 72 0 0 1 232 300H208Z']
def mark(ox, oy, fill, center=GOLD, scale=1):
    k = 44 / 300 * scale
    r = lambda x, y, f: f'<rect x="{x}" y="{y}" width="92" height="92" fill="{f}"/>'
    body = r(104, 0, fill) + r(0, 104, fill) + r(104, 208, fill) + ''.join(f'<path d="{d}" fill="{fill}"/>' for d in BOWLS) + r(104, 104, center)
    return f'<g transform="translate({ox:.2f},{oy:.2f}) scale({k:.5f})">{body}</g>'
wm, wend = text_path(sys.argv[2], 'BetterEd', 37, 58, 35.2, track=-0.012)
sub = ''
W = round(wend + 1, 1); H = 44
def lockup(text, blocks, bg=None, pad=0):
    w, h = W + 2*pad, H + 2*pad
    body = (f'<rect width="{w}" height="{h}" fill="{bg}"/>' if bg else '') + f'<g transform="translate({pad},{pad})">' + mark(0, 0, blocks) + f'<path d="{wm}" fill="{text}"/></g>'
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}" role="img" aria-label="BetterEd Solutions"><title>BetterEd Solutions</title>{body}</svg>\n'
open(f'{A}/logo-primary.svg','w').write(lockup(NAVY, NAVY))
open(f'{A}/logo-reversed.svg','w').write(lockup(WHITE, WHITE))
open(f'{A}/logo-reversed-panel.svg','w').write(lockup(WHITE, WHITE, bg=NAVY, pad=18))
def icon(size, r):
    sc = size*0.56/44; o = (size - 44*sc)/2
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {size} {size}" width="{size}" height="{size}"><rect width="{size}" height="{size}" rx="{r}" fill="{NAVY}"/>{mark(o, o, WHITE, scale=sc)}</svg>\n'
open(f'{A}/favicon.svg','w').write(icon(512, 112))
open(f'{A}/app-icon.svg','w').write(icon(512, 0))
print('W', W, 'H', H)
