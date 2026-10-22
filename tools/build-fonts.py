import sys
from fontTools.ttLib import TTCollection
from fontTools import subset
def jis(rows):
    s=set()
    for r in rows:
        for c in range(1,95):
            try: ch=bytes([0xA0+r,0xA0+c]).decode('euc-jp')
            except: continue
            s.add(ord(ch))
    return s
base=set(range(0x20,0x7F))|set(range(0xA0,0x180))|set(range(0x2000,0x2070))|set(range(0x2100,0x2200))|set(range(0x2460,0x2500))|set(range(0x25A0,0x2700))|set(range(0x3000,0x3100))|set(range(0xFF00,0xFFF0))
allnonkanji=jis(range(1,16))
base|=allnonkanji
k1=jis(range(16,48)); k2=jis(range(48,85))
k1-=base; k2-=base
def ranges(cps):
    cps=sorted(cps); out=[]; s=p=cps[0]
    for c in cps[1:]:
        if c==p+1: p=c; continue
        out.append((s,p)); s=p=c
    out.append((s,p)); return out
def css_range(cps):
    return ','.join(f'U+{a:X}' if a==b else f'U+{a:X}-{b:X}' for a,b in ranges(cps))
kanji=sorted(k1|k2); N=10; per=-(-len(kanji)//N)
slices=[kanji[i:i+per] for i in range(0,len(kanji),per)]
# 範囲は前の切れ目から次の切れ目までを丸ごと指す（JIS 外の漢字は入れないが、範囲が重ならないので CSS が短い）
bounds=[]
for i,sl in enumerate(slices):
    lo=0x3400 if i==0 else slices[i][0]
    hi=0x9FFF if i==len(slices)-1 else slices[i+1][0]-1
    bounds.append((lo,hi,set(sl)))
import os
os.makedirs('out',exist_ok=True)
for f_ in os.listdir('out'): os.remove('out/'+f_)
css=[]
total={}
def build(w,name,part,cps,rng):
    opts=subset.Options(); opts.flavor='woff2'; opts.layout_features=['palt','kern','liga']; opts.name_IDs=['*']; opts.notdef_outline=True; opts.hinting=False; opts.desubroutinize=True
    f=subset.load_font(f'jp-{name}.otf',opts)
    sub=subset.Subsetter(opts); sub.populate(unicodes=cps); sub.subset(f)
    fn=f'out/noto-sans-jp-{w}-{part}.woff2'; subset.save_font(f,fn,opts)
    total[w]=total.get(w,0)+os.path.getsize(fn)
    css.append(f"@font-face{{font-family:'Noto Sans JP';font-style:normal;font-weight:{w};font-display:swap;src:url('../fonts/noto-sans-jp-{w}-{part}.woff2') format('woff2');unicode-range:{rng};}}")
for w,name in {300:'Light',400:'Regular',700:'Bold'}.items():
    if not os.path.exists(f'jp-{name}.otf'):
        col=TTCollection(f'/usr/share/fonts/opentype/noto/NotoSansCJK-{name}.ttc')
        [f for f in col.fonts if 'JP' in f['name'].getDebugName(1)][0].save(f'jp-{name}.otf')
    build(w,name,'base',base,css_range(base))
    if w==300: continue
    for i,(lo,hi,cps) in enumerate(bounds):
        build(w,name,f'k{i}',cps,f'U+{lo:X}-{hi:X}')
open('out/fonts.css','w').write('/* Noto Sans JP（Noto Sans CJK JP の日本語の字形を、かな・記号と JIS 第1・第2水準の漢字に絞って woff2 にしたもの）。SIL Open Font License 1.1（fonts/OFL.txt）\n   300 は英数字・かなだけ（大きな時計の数字用）。作り方は tools/README.md */\n'+'\n'.join(css)+'\n')
for w,t in total.items(): print(w, t//1024,'KB', file=sys.stderr)
print(len(open('out/fonts.css').read()),'bytes css', file=sys.stderr)
