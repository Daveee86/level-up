#!/usr/bin/env python3
"""Wereldkaarten maken voor Level-UP (assets/maps/wereld2.png en wereld3.png).
Ook de eventkaarten: wereld2-sint.png, wereld2-kerst.png, enz. (zie THEMAS onderaan).

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
# ---- Kleine pixel-plaatjes voor events: elke letter is een kleur, '.' is doorzichtig. ----
def sprite(rows, pal, scale=2):
    h=len(rows); w=max(len(r) for r in rows); im=Image.new('RGBA',(w,h),(0,0,0,0)); q=im.load()
    for y,r in enumerate(rows):
        for x,c in enumerate(r):
            if c!='.': q[x,y]=pal[c]+(255,)
    return im.resize((w*scale,h*scale),Image.NEAREST)
PAKJE=['..Y.Y..','...Y...','RRRYRRR','RRRYRRR','YYYYYYY','RRRYRRR','RRRYRRR']
def pakje(kleur): return sprite(PAKJE,{'R':kleur,'Y':(255,206,60)})
BOOT=['................F.........','................FFF.......','................F..CC.....','................F..CC.....','........WWWWWWWWW..KK.....','........WbWbWbWbW..KK.....','....WWWWWWWWWWWWWWWWWWW...','RRRRRRRRRRRRRRRRRRRRRRRRRR','.NNNNNNNNNNNNNNNNNNNNNNNN.','..NNNNNNNNNNNNNNNNNNNNNN..']
KERSTBOOM=['.......S.......','......SSS......','.......G.......','......GGG......','.....GGRGG.....','......GGG......','.....GGGGG.....','....GGYGGGG....','...GGGGGGBGG...','.....GGGGG.....','....GGRGGGG....','...GGGGGGGYG...','..GGBGGGGGGGG..','.GGGGGGGRGGGGG.','......TTT......','......TTT......']
SNEEUWPOP=['...KKK...','...KKK...','..KKKKK..','...WWW...','..WKWKW..','..WWOWW..','...WWW...','..WWWWW..','.WWWKWWW.','.WWWWWWW.','.WWWKWWW.','..WWWWW..']
def gen(world, seed=7, thema=None):
    rnd=random.Random(seed)
    if world==1: g1,g2,g3=(126,206,110),(112,192,98),(150,222,128)
    else: g1,g2,g3=(104,184,80),(92,168,70),(130,204,96)
    if thema=='kerst': g1,g2,g3=(232,240,250),(214,226,242),(250,252,255)
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
    if thema=='kerst': water,water2=(170,212,236),(214,238,252)   # bevroren vijver
    if world==1:
        # ocean along bottom-left with beach
        pts=[(0,H)]+[(x, 400+int(28*math.sin(x/70))+ (x//4)) for x in range(0,560,8)]+[(560,H)]
        d.polygon([(x,y-18) for x,y in pts[1:-1]]+[(560,H),(0,H)],fill=sand)
        d.polygon(pts,fill=water)
        for x in range(0,560,16):
            y=400+int(28*math.sin(x/70))+(x//4); d.line((x,y,x+8,y),fill=foam,width=2)
    else:
        d.ellipse((470,395,610,470),fill=water,outline=(52,120,180) if thema!='kerst' else (120,170,210),width=3)
        d.ellipse((500,410,560,430),fill=water2)
    # paths
    path=(222,196,140); edge=(186,156,100)
    if thema=='kerst': path,edge=(206,200,196),(170,164,160)   # vastgelopen sneeuwpad
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
        if thema=='kerst':
            d.ellipse((x-9,y-30,x+7,y-21),fill=(244,248,255)); d.ellipse((x-5,y-31,x+3,y-25),fill=(255,255,255))
            if rnd.random()<0.45:
                for _ in range(4): d.rectangle((x+rnd.randint(-8,8),y+rnd.randint(-20,-9))*2,fill=rnd.choice([(255,70,70),(255,210,60),(80,170,255)]))
    # shadows + buildings sorted by bottom
    items=[('t',t[0],t[1]) for t in trees]+[('b',k,PLACE[k]) for k in PLACE]
    items.sort(key=lambda it: it[2] if it[0]=='t' else it[2][2])
    for it in items:
        if it[0]=='t': tree(it[1],it[2])
        else:
            bk,cx,by=it[2]; b=B[bk]
            sh=Image.new('RGBA',(b.width+16,14),(0,0,0,0)); ImageDraw.Draw(sh).ellipse((0,0,b.width+16,14),fill=(0,0,0,60))
            im.alpha_composite(sh,(cx-b.width//2-8,by-8))
            if thema=='kerst': b=sneeuwdak(b)
            im.alpha_composite(b,(cx-b.width//2,by-b.height))
    if thema and thema!='maarten': versier(im, d, thema, routes, rnd)
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
    if thema=='maarten': im=lampionnen(im, world, routes, occupied)
    return im
def sneeuwdak(b):
    # Bovenste pixels van elk gebouw wit maken: sneeuw op het dak.
    b=b.copy(); q=b.load()
    for x in range(b.width):
        for y in range(int(b.height*0.6)):
            if q[x,y][3]>0:
                for k in range(4):
                    if y+k<b.height and q[x,y+k][3]>0: q[x,y+k]=((250,252,255) if k<3 else (200,216,236))+(255,)
                break
    return b
def versier(im, d, thema, routes, rnd):
    if thema=='sint':
        boot=sprite(BOOT,{'F':(214,40,50),'W':(250,250,250),'b':(70,110,170),'C':(214,40,50),'K':(30,30,40),'R':(214,40,50),'N':(40,60,110)},3)
        im.alpha_composite(boot,(545-boot.width//2,462-boot.height))
        # vlaggetjes langs het pad naar de Kampioen en over het plein
        for (x1,y1),(x2,y2) in [((250,425),(352,425)),((452,425),(540,425))]:
            n=int(math.hypot(x2-x1,y2-y1)//12)
            for j in range(n):
                x=x1+(x2-x1)*j/n; y=y1+(y2-y1)*j/n
                col=[(214,40,50),(250,250,250),(255,200,40)][j%3]
                if x1==x2: d.polygon([(x+10,y),(x+10,y+9),(x+18,y+4)],fill=col)
                else: d.polygon([(x,y-26),(x+9,y-26),(x+4,y-17)],fill=col)
            if x1!=x2: d.line([(x1,y1-26),(x2,y2-26)],fill=(90,70,50),width=1)
        for k,(bk,cx,by) in PLACE.items():
            if k=='topo': continue
            b=B[bk]; im.alpha_composite(pakje(rnd.choice([(214,40,50),(60,120,220),(40,150,80),(150,70,200)])),(cx+b.width//2-6,by-14))
    if thema=='kerst':
        boom=sprite(KERSTBOOM,{'S':(255,214,40),'G':(30,120,60),'R':(230,40,50),'Y':(255,214,40),'B':(70,150,255),'T':(110,72,40)},3)
        bx,byy=300,412; im.alpha_composite(boom,(bx-boom.width//2,byy-boom.height))
        for i,c in enumerate([(214,40,50),(60,120,220),(40,150,80)]): im.alpha_composite(pakje(c),(bx-34+i*24,byy-12))
        pop=sprite(SNEEUWPOP,{'K':(30,30,40),'W':(252,252,255),'O':(255,140,30)},3)
        im.alpha_composite(pop,(262,450))
hot={k:{'x':round(cx/W*100,1),'y':round((by-B[bk].height/2)/H*100,1),'w':round(B[bk].width/W*100,1),'h':round(B[bk].height/H*100,1),'by':round(by/H*100,1)} for k,(bk,cx,by) in PLACE.items()}
LAMPION=['..K..','..K..','.OOO.','OYYYO','OYYYO','OYYYO','.OOO.']
def lampionnen(im, world, routes, occupied):
    # Sint Maarten: avondlucht en een rij gloeiende lampionnen langs de paden.
    if world!=3:
        im=ImageEnhance.Brightness(im).enhance(0.58)
        im.alpha_composite(Image.new('RGBA',(W,H),(40,24,90,70)))
    kleuren=[(255,140,30),(255,200,40),(240,70,60),(120,200,255)]
    lp=[]; n=0
    for r in routes:
        for i in range(len(r)-1):
            (x1,y1),(x2,y2)=r[i],r[i+1]; k=max(1,int(math.hypot(x2-x1,y2-y1)//26))
            for j in range(k+1):
                x=x1+(x2-x1)*j/k-12; y=y1+(y2-y1)*j/k-6
                if any(a<x<c and b_<y<e-14 for (a,b_,c,e) in occupied) or any(abs(x-lx)<20 and abs(y-ly)<20 for lx,ly in lp): continue
                lp.append((x,y)); col=kleuren[n%4]; n+=1
                glow=Image.new('RGBA',(40,40),(0,0,0,0)); gd=ImageDraw.Draw(glow)
                for rr,a in ((20,55),(12,90)): gd.ellipse((20-rr,20-rr,20+rr,20+rr),fill=col+(a,))
                im.alpha_composite(glow,(int(x)-20,int(y)-20))
                l=sprite(LAMPION,{'K':(60,40,30),'O':col,'Y':(255,240,170)},3)
                im.alpha_composite(l,(int(x)-l.width//2,int(y)-l.height//2-6))
    return im
THEMAS=[None,'sint','kerst','maarten']   # nieuw event? Voeg een naam toe en teken het in versier()
for w in (2,3):
    for t in THEMAS: gen(w,thema=t).save(os.path.join(HERE,'..','assets','maps',f'wereld{w}'+(f'-{t}' if t else '')+'.png'),optimize=True)
print('Plak dit in data/werelden.js als KAART_PLEKKEN:'); print(json.dumps({k:{'x':v['x'],'by':v['by'],'w':v['w'],'h':v['h']} for k,v in hot.items()}, indent=1))

# Vallende plaatjes voor events (assets/events/)
EV=os.path.join(HERE,'..','assets','events'); os.makedirs(EV,exist_ok=True)
sprite(['.BBB.','BbBBB','BBBbB','BBBBB','.BBB.'],{'B':(150,92,44),'b':(110,64,28)},3).save(os.path.join(EV,'pepernoot.png'))
sprite(['..W..','W.W.W','.WWW.','WWWWW','.WWW.','W.W.W','..W..'],{'W':(255,255,255)},2).save(os.path.join(EV,'sneeuw.png'))
pakje((214,40,50)).save(os.path.join(EV,'pakje.png'))
sprite(LAMPION,{'K':(60,40,30),'O':(255,140,30),'Y':(255,240,170)},4).save(os.path.join(EV,'lampion.png'))
sprite(['.RRR.','RRWRR','RRRRR','RRRRR','.RRR.','..R..','..K..','..K..','..K..'],{'R':(240,70,90),'W':(255,200,210),'K':(90,90,90)},2).save(os.path.join(EV,'ballon.png'))
sprite(['.Y.Y.Y.','.R.R.R.','PPPPPPP','PWPWPWP','PPPPPPP','BBBBBBB','BWBWBWB','BBBBBBB'],{'Y':(255,214,40),'R':(240,70,60),'P':(255,170,200),'W':(255,255,255),'B':(150,92,44)},4).save(os.path.join(EV,'taart.png'))
sprite(['...Y...','..RRR..','.RRYRR.','.RYYYR.','RRRYRRR','RRRRRRR','YYYYYYY'],{'R':(214,40,50),'Y':(255,206,60)},3).save(os.path.join(EV,'mijter.png'))
sprite(['.......S.......','......SSS......','......GGG......','.....GGRGG.....','....GGGGGGG....','...GGYGGGBGG...','....GGGGGGG....','...GGRGGGGGG...','..GGGGGGYGGGG..','.GGBGGGGGGGRGG.','......TTT......'],{'S':(255,214,40),'G':(30,120,60),'R':(230,40,50),'Y':(255,214,40),'B':(70,150,255),'T':(110,72,40)},3).save(os.path.join(EV,'kerstboom.png'))
