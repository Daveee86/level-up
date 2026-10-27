#!/usr/bin/env python3
"""Maak een versie van Level-UP in één bestand: dist/level-up.html.

Handig om snel te delen of als voorbeeld te bekijken. Alle css, scripts en plaatjes zitten erin.
Voor de echte site gebruik je gewoon de map zelf (index.html + mappen).
Gebruik: python3 tools/bundle.py
"""
import os, re, base64, json

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')

def read(p):
    return open(os.path.join(ROOT, p), encoding='utf-8').read()

def main():
    html = read('index.html')
    html = re.sub(r'<link rel="stylesheet" href="(css/[^"]+)">', lambda m: '<style>\n' + read(m.group(1)) + '\n</style>', html)
    assets = {}
    for folder, _, files in os.walk(os.path.join(ROOT, 'assets')):
        for f in files:
            if f.endswith('.png'):
                full = os.path.join(folder, f)
                rel = os.path.relpath(full, ROOT).replace(os.sep, '/')
                assets[rel] = 'data:image/png;base64,' + base64.b64encode(open(full, 'rb').read()).decode()
    shim = '<script>window.ASSETS = ' + json.dumps(assets) + ';</script>\n'
    html = re.sub(r'<script src="([^"]+)"></script>', lambda m: '<script>\n' + read(m.group(1)) + '\n</script>', html)
    html = html.replace('<div id="app"></div>', '<div id="app"></div>\n' + shim, 1)
    os.makedirs(os.path.join(ROOT, 'dist'), exist_ok=True)
    out = os.path.join(ROOT, 'dist', 'level-up.html')
    open(out, 'w', encoding='utf-8').write(html)
    print('gemaakt:', os.path.relpath(out, ROOT), f'({len(html)//1024} KB, {len(assets)} plaatjes)')

if __name__ == '__main__':
    main()
