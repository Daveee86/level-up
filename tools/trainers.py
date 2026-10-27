#!/usr/bin/env python3
"""Spelers- en trainerplaatjes uit Tuxemon halen voor Level-UP (assets/trainers/<key>.png, 64x64).

Gebruik: python3 tools/trainers.py <tuxemon-map>
Pas LOOKS hieronder aan: key in Level-UP -> naam van het plaatje in mods/tuxemon/gfx/sprites/player/.
Zet nieuwe keys daarna in SPELER_LOOKS in data/trainers.js.
"""
import sys, os
from PIL import Image
LOOKS = {
  'b1':'baller', 'b2':'coach', 'b3':'goalkeeper', 'b4':'pro',
  'b5':'adventurer_green', 'b6':'tennisplayer_alt1_black', 'b7':'yellowbelt', 'b8':'postboy', 'b9':'farmer', 'b10':'fisher_blue',
  'g1':'barmaid', 'g2':'florist', 'g3':'goth_rose', 'g4':'heroine_rose',
  'g5':'heroine_alt1_black', 'g6':'picnicker_alt1', 'g7':'nurse_blonde', 'g8':'catgirl_lapi', 'g9':'goth_alt1_brown', 'g10':'tennisplayer_alt1_rose',
}
def main():
    if len(sys.argv) < 2: print(__doc__); sys.exit(1)
    src = os.path.join(sys.argv[1], 'mods', 'tuxemon', 'gfx', 'sprites', 'player')
    out = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'assets', 'trainers')
    for key, name in LOOKS.items():
        im = Image.open(os.path.join(src, name + '.png')).convert('RGBA')
        im.crop((64, 0, 128, 64)).save(os.path.join(out, key + '.png'), optimize=True)   # rechter helft = vooraanzicht
        print(key, '<-', name)
if __name__ == '__main__': main()
