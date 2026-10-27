#!/usr/bin/env python3
"""Monster-plaatjes uit Tuxemon halen voor Level-UP.

Gebruik:
  git clone --depth 1 https://github.com/Tuxemon/Tuxemon tuxemon
  python3 tools/sprites.py tuxemon agnite agnidon agnigon

Per monster maakt het assets/monsters/<naam>.png (voorkant) en <naam>-back.png (achterkant).
Heeft Tuxemon geen bruikbare achterkant, dan wordt de voorkant gespiegeld.
Daarna print het een regel die je in data/monsters.js kunt plakken (pas prijs/tier zelf aan).
Vereist: pip install pillow (en pyyaml voor de evolutie-info).
"""
import sys, os
from PIL import Image, ImageOps

def main():
    if len(sys.argv) < 3:
        print(__doc__); sys.exit(1)
    root, slugs = sys.argv[1], sys.argv[2:]
    src = os.path.join(root, 'mods', 'tuxemon', 'gfx', 'sprites', 'battle')
    out = os.path.join(os.path.dirname(__file__), '..', 'assets', 'monsters')
    os.makedirs(out, exist_ok=True)
    for s in slugs:
        sheet = Image.open(os.path.join(src, f'{s}-sheet.png')).convert('RGBA')
        front, back = sheet.crop((0, 0, 64, 64)), sheet.crop((64, 0, 128, 64))
        bb = back.getchannel('A').getbbox()
        if not bb or bb[2] - bb[0] < 26:
            back = ImageOps.mirror(front)
        front.save(os.path.join(out, f'{s}.png'), optimize=True)
        back.save(os.path.join(out, f'{s}-back.png'), optimize=True)
        print('opgeslagen:', s)
    names = [s.replace('_', ' ').title() for s in slugs]
    print("\nRegel voor data/monsters.js:")
    print(f"  {{id:'{slugs[0]}', names:{names}, spr:{slugs}, el:'?', tier:'common', price:120, req:1}},".replace('"', "'"))

if __name__ == '__main__':
    main()
