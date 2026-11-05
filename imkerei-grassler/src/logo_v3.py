# Fassung 03 – Honigglas-G in Honiggold, Bienenwachs und Waldhonig
import json,itertools
from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.svgLib.path import parse_path
R=Path(__file__).resolve().parents[1];B=R/'marke';A=R/'website/assets';FONTS=R/'marke/schriften'
GOLD='#EFA51A';WAX='#F6ECCB';BROWN='#3A2410'
YS=str(FONTS/'YoungSerif-Regular.ttf');BR=str(FONTS/'BricolageGrotesque-Regular.ttf')
def textpath(text,size,x,y,font,track=0):
 f=TTFont(font);g=f.getGlyphSet();c=f.getBestCmap();s=size/f['head'].unitsPerEm;o=[]
 for ch in text:
  n=c.get(ord(ch),'space');p=SVGPathPen(g);g[n].draw(p)
  if p.getCommands():o.append(f'<path d="{p.getCommands()}" transform="translate({x:.3f},{y}) scale({s:.6f},-{s:.6f})"/>')
  x+=g[n].width*s+track
 return ''.join(o),x
_f=TTFont(YS);_g=_f.getGlyphSet();_p=SVGPathPen(_g);_g[_f.getBestCmap()[ord('G')]].draw(_p);GLYPH=_p.getCommands()
DROP='M590 230 L590 -40 C590 -70 548 -100 548 -160 C548 -203 583 -238 626 -238 C669 -238 704 -203 704 -160 C704 -100 662 -70 662 -40 L662 230 Z'
def _tf(d,S=.081,TX=31.0,TY=115.0):
 p=SVGPathPen(None);parse_path(d,TransformPen(p,(S,0,0,-S,TX,TY)));return p.getCommands()
GL,DR=_tf(GLYPH),_tf(DROP)
LID='M24 4 H96 Q101 4 101 9 V19 Q101 24 96 24 H24 Q19 24 19 19 V9 Q19 4 24 4 Z'
BODY='M27 29 H93 V35 C93 41 112 43 112 63 V128 Q112 146 94 146 H26 Q8 146 8 128 V63 C8 43 27 41 27 35 Z'
SHINE='M15.5 66 Q15.5 63 18 63 Q20.5 63 20.5 66 V104 Q20.5 107 18 107 Q15.5 107 15.5 104 Z'
_ids=itertools.count(1)
def mark(color=None,lid=BROWN,body=GOLD,letter=BROWN,shine=WAX):
 """Full-colour mark; with color= a one-colour mark with knocked-out G and glass light."""
 if color:
  u=f'gm{next(_ids)}'
  return f'<defs><mask id="{u}" maskUnits="userSpaceOnUse" x="0" y="0" width="120" height="150"><rect width="120" height="150" fill="#fff"/><path d="{SHINE}"/><path d="{GL}"/><path d="{DR}"/></mask></defs><path fill="{color}" d="{LID}"/><path fill="{color}" mask="url(#{u})" d="{BODY}"/>'
 return f'<path fill="{lid}" d="{LID}"/><path fill="{body}" d="{BODY}"/><path fill="{shine}" d="{SHINE}"/><path fill="{letter}" d="{GL}"/><path fill="{letter}" d="{DR}"/>'
def svg(body,box,label='Imkerei Grassler'):
 return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{box}" role="img" aria-label="{label}"><title>{label}</title>{body}</svg>'
WORD,_=textpath('Grassler',86,150,104,YS,-.6)
SUB,_=textpath('Imkerei in Krems und Umgebung',17,153,138,BR,.2)
LOCK_W,LOCK_H=540,156
def lockup(m,letters):
 return svg(f'<g transform="translate(6 4)">{m}</g><g fill="{letters}">{WORD}{SUB}</g>',f'0 0 {LOCK_W} {LOCK_H}','Imkerei Grassler – Honig aus Krems und Umgebung')
WORD_S,_=textpath('Grassler',90,150,113,YS,-.6)
def short(m,letters):
 return svg(f'<g transform="translate(6 4)">{m}</g><g fill="{letters}">{WORD_S}</g>',f'0 0 {LOCK_W} {LOCK_H}','Imkerei Grassler')
for k,v in {'logo-kurz':short(mark(),BROWN),'logo-kurz-dark':short(mark(lid=WAX),WAX)}.items():(B/f'{k}.svg').write_text(v);(A/f'{k}.svg').write_text(v)
for old in ['logo-blau.svg','logo-schwarz.svg']:
 for d in (B,A):
  if (d/old).exists():(d/old).unlink()
logos={'logo':lockup(mark(),BROWN),'logo-dark':lockup(mark(lid=WAX),WAX),'logo-hell':lockup(mark(lid=WAX),WAX),
       'logo-monochrom':lockup(mark(BROWN),BROWN),'logo-negativ':lockup(mark(WAX),WAX)}
for k,v in logos.items():
 (B/f'{k}.svg').write_text(v)
 if k in ('logo','logo-dark','logo-hell'):(A/f'{k}.svg').write_text(v)
for d in (A,):
 for k in ('logo-monochrom.svg','logo-negativ.svg'):
  if (d/k).exists():(d/k).unlink()
BOX='0 0 120 150'
for k,m in {'bildmarke':mark(),'bildmarke-dark':mark(lid=WAX),'bildmarke-monochrom':mark(BROWN),'bildmarke-hell':mark(WAX)}.items():
 (B/f'{k}.svg').write_text(svg(m,BOX,'Grassler – Honigglas-G'))
fav=svg(f'<rect width="128" height="128" rx="26" fill="{WAX}"/><g transform="translate(19 5) scale(.75 .79)">{mark()}</g>','0 0 128 128','Grassler')
(B/'favicon.svg').write_text(fav);(A/'favicon.svg').write_text(fav)
sw,swe=textpath('Grassler',80,0,0,YS,-.6);s2,s2e=textpath('Imkerei in Krems und Umgebung',16,0,0,BR,.2)
(B/'logo-kompakt.svg').write_text(svg(f'<g transform="translate(100 10) scale(1.5)">{mark()}</g><g fill="{BROWN}" transform="translate({(380-swe)/2:.2f} 316)">{sw}</g><g fill="{BROWN}" transform="translate({(380-s2e)/2:.2f} 352)">{s2}</g>','0 0 380 372'))
(B/'farben.json').write_text(json.dumps({'Honiggold':GOLD,'Bienenwachs':WAX,'Waldhonig':BROWN},ensure_ascii=False,indent=2))
print('Logo family 03: honey-jar G, Young Serif wordmark, Honiggold/Bienenwachs/Waldhonig')
