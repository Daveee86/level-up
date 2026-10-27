#!/usr/bin/env python3
"""Wereldkaarten maken voor Level-UP (assets/maps/wereld2.png en wereld3.png).

Gebruik: python3 tools/kaart.py
De gebouwen staan in tools/kaart-gebouwen/ (uitgeknipt uit Tuxemon-tilesets, CC BY-SA 4.0).
Verplaats je een gebouw in PLACE hieronder, plak dan de uitvoer in data/werelden.js (KAART_PLEKKEN).
Vereist: pip install pillow
"""
import os
HERE = os.path.dirname(os.path.abspath(__file__))
from PIL import Image, ImageDraw, ImageEnhance
import random, json, math
W,H=800,520
B={k:Image.open(os.path.join(HERE,'kaart-gebouwen',f'b_{k}.png')).convert('RGBA') for k in ['reken','taal','engels','topo','team','shop','ruimte','kamp','ges']}
# key -> (building, centerX, bottomY)
PLACE={'rekenen':('reken',130,170),'taal':('taal',650,180),'kampioen':('kamp',400,166),'geschiedenis':('ges',120,352),
 'team':('team',400,362),'engels':('engels',560,335),'shop':('shop',170,505),'ruimte':('ruimte',420,500),'topo':('topo',712,512)}
PLAZA=(400,425)
def gen(world, seed=7):
    rnd=random.Random(seed)
    if world==1: g1,g2,g3=(126,206,110),(112,192,98),(150,222,128)
    else: g1,g2,g3=(104,184,80),(92,168,70),(130,204,96)
    im=Image.new('RGBA',(W,H),g1+(255,)); px=im.load()
    for y in range(0,H,2):
        for x in range(0,W,2):
            r=rnd.random()
            c=g2 if r<0.18 else (g3 if r<0.24 else None)
            if c:
                for dy in (0,1):
                    for dx in (0,1): px[x+dx,y+dy]=c+(255,)
    d=ImageDraw.Draw(im)
    # water
    sand=(236,214,150); sand2=(214,188,120); water=(76,160,220); water2=(110,190,240); foam=(235,248,255)
    if world==1:
        # ocean along bottom-left with beach
        pts=[(0,H)]+[(x, 400+int(28*math.sin(x/70))+ (x//4)) for x in range(0,560,8)]+[(560,H)]
        d.polygon([(x,y-18) for x,y in pts[1:-1]]+[(560,H),(0,H)],fill=sand)
        d.polygon(pts,fill=water)
        for x in range(0,560,16):
            y=400+int(28*math.sin(x/70))+(x//4); d.line((x,y,x+8,y),fill=foam,width=2)
    else:
        d.ellipse((470,395,610,470),fill=water,outline=(52,120,180),width=3)
        d.ellipse((500,410,560,430),fill=water2)
    # paths
    path=(222,196,140); edge=(186,156,100)
    def seg(a,b,w=16):
        d.line([a,b],fill=edge,width=w+4); 
    def seg2(a,b,w=16): d.line([a,b],fill=path,width=w)
    routes=[]
    for k,(bk,cx,by) in PLACE.items():
        door=(cx,by-2)
        corner=(cx,PLAZA[1]) if abs(by-PLAZA[1])>20 else (cx,by)
        routes.append([door,corner,PLAZA])
    for f in (seg,seg2):
        for r in routes:
            for i in range(len(r)-1): f(r[i],r[i+1])
    d.ellipse((PLAZA[0]-34,PLAZA[1]-20,PLAZA[0]+34,PLAZA[1]+20),fill=path,outline=edge,width=3)
    # trees (avoid buildings, paths, water)
    occupied=[]
    for k,(bk,cx,by) in PLACE.items():
        b=B[bk]; occupied.append((cx-b.width//2-10,by-b.height-6,cx+b.width//2+10,by+14))
    def free(x,y):
        for (a,b_,c,e) in occupied:
            if a<x<c and b_<y<e: return False
        if px[x,min(y,H-1)][:3] in (path,edge,water,water2,sand,foam): return False
        for r in routes:
            for i in range(len(r)-1):
                (x1,y1),(x2,y2)=r[i],r[i+1]
                if min(x1,x2)-18<x<max(x1,x2)+18 and min(y1,y2)-24<y<max(y1,y2)+10: return False
        return True
    trees=[]
    for _ in range(900):
        x,y=rnd.randint(8,W-8),rnd.randint(30,H-4)
        if free(x,y) and all(abs(x-a)>22 or abs(y-b)>18 for a,b in trees): trees.append((x,y))
        if len(trees)>46: break
    trees.sort(key=lambda t:t[1])
    def tree(x,y):
        d.ellipse((x-9,y-2,x+9,y+3),fill=(40,90,40,255))
        d.rectangle((x-2,y-8,x+2,y),fill=(110,72,40))
        for (ox,oy,r,c) in [(0,-18,11,(46,120,52)),(-4,-21,7,(62,148,64)),(3,-23,4,(96,180,86))]:
            d.ellipse((x+ox-r,y+oy-r,x+ox+r,y+oy+r),fill=c)
    # shadows + buildings sorted by bottom
    items=[('t',t[0],t[1]) for t in trees]+[('b',k,PLACE[k]) for k in PLACE]
    items.sort(key=lambda it: it[2] if it[0]=='t' else it[2][2])
    for it in items:
        if it[0]=='t': tree(it[1],it[2])
        else:
            bk,cx,by=it[2]; b=B[bk]
            sh=Image.new('RGBA',(b.width+16,14),(0,0,0,0)); ImageDraw.Draw(sh).ellipse((0,0,b.width+16,14),fill=(0,0,0,60))
            im.alpha_composite(sh,(cx-b.width//2-8,by-8))
            im.alpha_composite(b,(cx-b.width//2,by-b.height))
    if world==3:
        im=ImageEnhance.Brightness(im).enhance(0.62)
        im.alpha_composite(Image.new('RGBA',(W,H),(20,24,90,80)))
        dd=ImageDraw.Draw(im); lamps=[]
        for r in routes:
            for i in range(len(r)-1):
                (x1,y1),(x2,y2)=r[i],r[i+1]; n=max(1,int(math.hypot(x2-x1,y2-y1)//60))
                for j in range(n+1):
                    x=x1+(x2-x1)*j/n+10; y=y1+(y2-y1)*j/n
                    if any(a-14<x<c+14 and b_-14<y<e+14 for (a,b_,c,e) in occupied) or any(abs(x-lx)<40 and abs(y-ly)<40 for lx,ly in lamps): continue
                    lamps.append((x,y))
                    glow=Image.new('RGBA',(24,24),(0,0,0,0)); gd=ImageDraw.Draw(glow)
                    col=(45,226,230) if (j+i)%2==0 else (255,61,129)
                    gd.ellipse((0,0,24,24),fill=col+(50,)); gd.ellipse((8,8,16,16),fill=col+(255,))
                    im.alpha_composite(glow,(int(x)-12,int(y)-12))
    return im
hot={k:{'x':round(cx/W*100,1),'y':round((by-B[bk].height/2)/H*100,1),'w':round(B[bk].width/W*100,1),'h':round(B[bk].height/H*100,1),'by':round(by/H*100,1)} for k,(bk,cx,by) in PLACE.items()}
for w in (2,3): gen(w).save(os.path.join(HERE,'..','assets','maps',f'wereld{w}.png'),optimize=True)
print('Plak dit in data/werelden.js als KAART_PLEKKEN:'); print(json.dumps({k:{'x':v['x'],'by':v['by'],'w':v['w'],'h':v['h']} for k,v in hot.items()}, indent=1))
