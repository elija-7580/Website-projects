# Fassung 03 – Markenhandbuch, Logo-Präsentation und Etikettmuster
from pathlib import Path
import base64,json
R=Path(__file__).resolve().parents[1];B=R/'marke';A=R/'website/assets'
exec((R/'src/logo_v3.py').read_text(),globals())
def uri(name,folder=B):
 p=folder/name;mime={'.svg':'image/svg+xml','.webp':'image/webp','.woff':'font/woff'}[p.suffix]
 return f'data:{mime};base64,'+base64.b64encode(p.read_bytes()).decode()
css=(A/'site.css').read_text().replace('url(young-serif.woff)',f'url({uri("young-serif.woff",A)})')
G,W,BR_='#EFA51A','#F6ECCB','#3A2410'
extra='''
body{background:#F6ECCB;color:#3A2410}
.hb-top{display:flex;justify-content:space-between;gap:20px;padding:28px 0;border-bottom:1px solid var(--line);font-size:15px}
.hb-hero{display:grid;grid-template-columns:1.35fr 1fr;gap:0;margin-top:40px;min-height:380px}
.hb-hero>div{display:flex;flex-direction:column;justify-content:center;padding:48px 40px}
.hb-hero .lock{width:100%;max-width:560px}
.gold{background:#EFA51A;color:#3A2410;align-items:center;text-align:center}
.gold img{width:132px;height:165px}.gold p{font:28px/1.25 Young Serif,Georgia,serif;margin-top:24px}
.hb-sec{padding:56px 0;border-bottom:1px solid var(--line)}
.hb-sec h2{margin-bottom:20px}.hb-sec>p,.hb-intro{max-width:62ch}.hb-sec p+p{margin-top:14px}
.anatomy{display:grid;grid-template-columns:260px 1fr;gap:48px;align-items:center;margin-top:32px}
.anatomy img{width:220px;height:275px}
.anatomy dl{display:grid;gap:18px;margin:0}.anatomy dt{font-weight:600;font-size:16px;color:inherit}.anatomy dd{margin:2px 0 0;font-size:16px;max-width:52ch}
.swatches{display:grid;grid-template-columns:1.5fr 1fr 1fr;gap:16px;margin-top:32px}
.swatch{min-height:220px;padding:24px;display:flex;flex-direction:column;justify-content:space-between;font-size:15px;border-radius:10px}
.swatch b{font:400 32px/1.1 Young Serif,Georgia,serif}
.swatch.wax{border:1px solid #3A2410}
.rules{list-style:none;padding:0;margin:28px 0 0;display:grid;grid-template-columns:repeat(3,1fr);gap:24px}
.rules li{border-top:2px solid #3A2410;padding-top:14px;font-size:16px}
.rules b{display:block;margin-bottom:4px}
.versions{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:32px}
.version{min-height:200px;display:flex;align-items:center;justify-content:center;padding:32px;border-radius:10px;background-size:cover;background-position:center}
.version img{width:100%;max-width:360px}
.version.light{border:1px solid var(--line)}
.vcap{font-size:14px;margin-top:8px}
.types{display:grid;grid-template-columns:1.3fr 1fr;gap:48px;margin-top:28px}
.ys{font:400 64px/1.05 Young Serif,Georgia,serif;letter-spacing:-.015em;margin:12px 0 16px}
.sys{font-size:28px;line-height:1.3;margin:12px 0 16px}
.voice{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:28px}
.voice>div{padding:28px;border:1px solid var(--line);border-radius:10px}
.voice .now{background:#EFA51A;border-color:#EFA51A}
.voice h3{font-size:22px;margin-bottom:12px}
.apps{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:32px}
.app{min-height:380px;display:flex;align-items:center;justify-content:center;border-radius:10px;padding:32px}
.app.dark{background:#3A2410}.app.goldbg{background:#EFA51A}
.card{width:340px;max-width:100%;aspect-ratio:85/55;background:#3A2410;color:#F6ECCB;padding:26px;display:flex;flex-direction:column;justify-content:space-between;border-radius:6px;box-shadow:0 0 0 1px rgba(246,236,203,.25)}
.card img{width:230px;max-width:100%}.card span{font-size:14px;line-height:1.45}
.label-img{width:220px;max-width:100%;border-radius:4px}
.apps>div,.versions>div,.types>div,.anatomy>*{min-width:0}.hb-foot{font-size:14px;padding:32px 0 56px;max-width:80ch}
.board{max-width:1200px;margin:auto;padding:56px}
.board .lock{width:min(720px,100%);margin:40px 0 28px}
.board .tag{font:400 28px/1.25 Young Serif,Georgia,serif;margin-bottom:40px}
.tiles{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}
.tiles div{height:220px;border-radius:10px;display:flex;align-items:center;justify-content:center}
.tiles img{width:96px;height:120px}
.chips{display:flex;gap:28px;margin-top:32px;font-size:15px;flex-wrap:wrap}
.chips span{display:flex;align-items:center;gap:10px}.chips i{width:28px;height:28px;border-radius:50%;display:inline-block}
@media(prefers-color-scheme:dark){body{background:#F6ECCB;color:#3A2410}:root{--line:color-mix(in srgb,#3A2410 25%,transparent)}}
@media(max-width:800px){.hb-top{display:block}.hb-top span{display:block;margin-top:4px}.hb-hero{grid-template-columns:1fr}.hb-hero>div{padding:32px 0}.hb-hero .gold{padding:40px 24px}
.anatomy,.types,.voice,.apps,.versions{grid-template-columns:1fr;gap:24px}.anatomy img{width:160px;height:200px}.swatches{grid-template-columns:1fr}.swatch{min-height:150px}.rules{grid-template-columns:1fr}
.ys{font-size:46px}.app{min-height:300px;padding:24px}.board{padding:32px 20px}.tiles{grid-template-columns:1fr 1fr}.tiles div{height:150px}.tiles img{width:72px;height:90px}.board .tag{font-size:28px}}
'''
# Front label as pure paths (no font dependency)
lw,lwe=textpath('Grassler',46,0,0,YS,-.3);ls,lse=textpath('Waldhonig',30,0,0,YS,0)
lk,lke=textpath('Krems und Umgebung',15,0,0,BR,.2);lg,lge=textpath('500 g',22,0,0,BR,0)
label=f'<svg xmlns="http://www.w3.org/2000/svg" width="70mm" height="95mm" viewBox="0 0 280 380"><title>Vorderetikett, Gestaltungsmuster, nicht druckfertig</title><rect width="280" height="380" fill="{W}"/><rect x="0" y="0" width="280" height="16" fill="{G}"/><g transform="translate(102 40) scale(.63)">{mark()}</g><g fill="{BR_}"><g transform="translate({(280-lwe)/2:.2f} 186)">{lw}</g><g transform="translate({(280-lse)/2:.2f} 236)">{ls}</g><path d="M40 270H240" stroke="{BR_}" stroke-width="1.5" fill="none"/><g transform="translate({(280-lke)/2:.2f} 304)">{lk}</g><g transform="translate({(280-lge)/2:.2f} 342)">{lg}</g></g></svg>'
(B/'vorderetikett-gestaltungsentwurf.svg').write_text(label)
head='<!doctype html><html lang="de-AT"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><meta name="theme-color" content="#F6ECCB">'
page=f'''{head}<title>Grassler — Markenhandbuch 03</title><style>{css}{extra}</style></head><body><main class="wrap">
<header class="hb-top"><b>Imkerei Grassler</b><span>Markenhandbuch, Fassung 03 · Entwurf zur Freigabe</span></header>
<section class="hb-hero"><div><img class="lock" src="{uri('logo.svg')}" alt="Imkerei Grassler – Honigglas-G mit Wortmarke"></div><div class="gold"><img src="{uri('bildmarke-monochrom.svg')}" alt="Honigglas-G in Waldhonig auf Honiggold"><p>Ein bisserl Krems<br>fürs Butterbrot</p></div></section>
<section class="hb-sec"><h1>Ein Glas, das nach Honig aussieht</h1><p class="hb-intro" style="margin-top:20px">Das Honigglas bleibt, die Farben kommen jetzt direkt aus dem Glas: leuchtendes Honiggold, blasses Bienenwachs und dunkler Waldhonig. Das G sitzt wie ein Etikettbuchstabe im Honig und lässt rechts einen Tropfen fallen.</p>
<div class="anatomy"><img src="{uri('bildmarke.svg')}" alt="Bildmarke: Honigglas mit G und Tropfen"><dl><div><dt>Deckel</dt><dd>Waldhonig, mit weich gerundeten Ecken. Auf dunklem Grund wird er wachshell.</dd></div><div><dt>Glas</dt><dd>Volle Fläche in Honiggold, mit breiten Schultern wie ein klassisches Imkerglas.</dd></div><div><dt>Das G mit Tropfen</dt><dd>Gezeichnet aus der Young Serif. Der Sporn läuft als Honigtropfen nach unten aus und verbindet Buchstabe und Produkt.</dd></div><div><dt>Glanzlicht</dt><dd>Ein schmaler Streifen Bienenwachs an der linken Kante lässt das Glas glänzen, ohne Schatten oder Verlauf.</dd></div></dl></div></section>
<section class="hb-sec"><h2>Drei Farben aus einem Glas</h2><p>Eine ausgefallene, zwei fade: Honiggold darf leuchten, Bienenwachs und Waldhonig tragen alles andere.</p>
<div class="swatches"><div class="swatch" style="background:{G};color:{BR_}"><b>Honiggold</b><span>{G}<br>Glas, Buttons, große Flächen</span></div><div class="swatch wax" style="background:{W};color:{BR_}"><b>Bienenwachs</b><span>{W}<br>Hintergrund und helle Schrift</span></div><div class="swatch" style="background:{BR_};color:{W}"><b>Waldhonig</b><span>{BR_}<br>Schrift, Deckel, dunkle Flächen</span></div></div>
<ul class="rules"><li><b>Waldhonig auf Bienenwachs</b>12,4 : 1 – für jede Schriftgröße</li><li><b>Waldhonig auf Honiggold</b>7,0 : 1 – Buttons und Farbflächen</li><li><b>Honiggold nie als Schrift auf Hell</b>1,8 : 1 – nur als Fläche oder im Zeichen verwenden</li></ul></section>
<section class="hb-sec"><h2>Für jeden Untergrund die passende Version</h2><div class="versions"><div><div class="version light" style="background:{W}"><img src="{uri('logo.svg')}" alt="Hauptlogo auf Bienenwachs"></div><p class="vcap">Hauptlogo auf Bienenwachs</p></div><div><div class="version" style="background:{BR_}"><img src="{uri('logo-dark.svg')}" alt="Logo für dunkle Flächen"></div><p class="vcap">Auf Waldhonig: Deckel und Schrift wachshell</p></div><div><div class="version" style="background:{G}"><img src="{uri('logo-monochrom.svg')}" alt="Einfarbiges Logo in Waldhonig auf Honiggold"></div><p class="vcap">Einfarbig in Waldhonig, auch auf Honiggold und für Stempel</p></div><div><div class="version" style="background-image:linear-gradient(rgba(58,36,16,.45),rgba(58,36,16,.45)),url({uri('honig.webp',A)})"><img src="{uri('logo-negativ.svg')}" alt="Negativlogo in Bienenwachs auf Foto"></div><p class="vcap">Negativ in Bienenwachs auf abgedunkelten Fotos</p></div></div>
<p style="margin-top:28px">Rundherum mindestens eine Deckelhöhe Abstand lassen. Das ganze Logo digital ab 180 px Breite, die Bildmarke ab 32 px verwenden. Nicht verzerren, nicht umfärben, keine Schatten.</p></section>
<section class="hb-sec"><h2>Schrift mit weichen Kanten</h2><div class="types"><div><p>Young Serif · Wortmarke und Überschriften</p><p class="ys">Ein bisserl Krems fürs Butterbrot</p><p class="caption">Rund, warm und ein wenig zähflüssig. Frei lizenziert (SIL Open Font License), auf der Website lokal eingebunden.</p></div><div><p>Systemschrift · Inhalt und Bedienung</p><p class="sys">Auf einen Sprung zum Honig</p><p class="caption">Für Größen, Anfragen und längere Texte schlicht und gut lesbar. Fließtext ab 16 px. Die Bricolage Grotesque steckt nur in der Logozeile „Imkerei in Krems und Umgebung“.</p></div></div></section>
<section class="hb-sec"><h2>Mehr Jause, weniger Produktprospekt</h2><div class="voice"><div><h3>Vorher</h3><p>Fein gerührt und mild im Geschmack. Lässt sich gut aufs Brot streichen.</p></div><div class="now"><h3>Jetzt</h3><p>Fein gerührter, milder Honig für alle, die beim Frühstück gern dicker auftragen</p></div></div>
<ul class="rules"><li><b>Schmäh statt Satzstakkato</b>Eine fließende Aussage mit einer Idee. Überschriften ohne Schlusspunkt.</li><li><b>Österreichisch ohne Tracht</b>Jause, Semmerl, ein bisserl – sparsam und nicht in jedem Satz.</li><li><b>Witz mit klaren Fakten</b>Preise, Größen und Lieferung bleiben eindeutig. Nichts erfinden.</li></ul></section>
<section class="hb-sec"><h2>Vom Etikett bis zur Kontaktkarte</h2><div class="apps"><div><div class="app goldbg"><img class="label-img" src="data:image/svg+xml;base64,{base64.b64encode(label.encode()).decode()}" alt="Vorderetikett Waldhonig 500 g"></div><p class="vcap">Vorderetikett als Gestaltungsmuster, keine lebensmittelrechtlich vollständige Druckdatei</p></div><div><div class="app dark"><div class="card"><img src="{uri('logo-dark.svg')}" alt="Kontaktkarte mit Logo"><span>Ein bisserl Krems fürs Butterbrot<br>Thiemo Grassler</span></div></div><p class="vcap">Kontaktkarte, Vorderseite; die Rückseite wartet auf bestätigte Kontaktdaten</p></div></div></section>
<footer class="hb-foot">Fassung 03 ersetzt Ultramarin, Haferpapier und Graphit durch Honiggold, Bienenwachs und Waldhonig und zeichnet das Honigglas-G neu. Symbolfotos bleiben als solche gekennzeichnet; Betriebsdaten, Rechtstexte und Veröffentlichung brauchen weiterhin Freigabe. Keine Markenrecherche oder Schutzfähigkeitsprüfung enthalten.</footer></main></body></html>'''
(R/'Grassler-Markenhandbuch.html').write_text(page)
board=f'''{head}<title>Grassler — Logo 03</title><style>{css}{extra}</style></head><body><main class="board"><p>Imkerei Grassler · Logo, Fassung 03</p><img class="lock" src="{uri('logo.svg')}" alt="Imkerei Grassler – Honigglas-G mit Wortmarke"><p class="tag">Ein bisserl Krems fürs Butterbrot</p><div class="tiles"><div style="border:1px solid {BR_}"><img src="{uri('bildmarke.svg')}" alt="Bildmarke auf Bienenwachs"></div><div style="background:{BR_}"><img src="{uri('bildmarke-dark.svg')}" alt="Bildmarke auf Waldhonig"></div><div style="background:{G}"><img src="{uri('bildmarke-monochrom.svg')}" alt="Einfarbige Bildmarke auf Honiggold"></div><div style="background:{BR_}"><img src="{uri('bildmarke-hell.svg')}" alt="Negative Bildmarke in Bienenwachs"></div></div><div class="chips"><span><i style="background:{G}"></i>Honiggold {G}</span><span><i style="background:{W};box-shadow:inset 0 0 0 1px {BR_}"></i>Bienenwachs {W}</span><span><i style="background:{BR_}"></i>Waldhonig {BR_}</span></div></main></body></html>'''
(R/'Grassler-Logo.html').write_text(board)
print('Brand handbook 03, logo board and label built.')
