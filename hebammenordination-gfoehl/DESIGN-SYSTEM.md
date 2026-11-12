# Design-System – Hebammenordination Gföhl (v1.0)

Live-Styleguide: `design-system.html`. Quelle der Wahrheit: `assets/css/tokens.css` (Werte) und `assets/css/components.css` (Bausteine). Komponenten verwenden nur Tokens, keine freien Hex-Werte oder Abstände.

## Tokens

| Kategorie | Tokens | Hinweis |
|---|---|---|
| Farbe Marke | `--rose-50/100/200/300/400/600/700`, `--plum-900/700/500` | Text & Buttons nur `--rose-600` (5.6:1 auf Weiß). `--rose-400` nur Deko. |
| Farbe Semantik | `--color-bg`, `--color-surface(-alt)`, `--color-text(-muted/-meta)`, `--color-accent(-hover)`, `--color-inverse-*` | In Komponenten bevorzugt verwenden |
| Typografie | `--font-display` Fraunces, `--font-body` Nunito Sans, `--text-xs … --text-3xl` (fluid) | Fonts selbst gehostet in `assets/fonts/` |
| Abstand | `--space-1 … --space-9` (4er-Raster, `--space-9` fluid für Sektionen) | |
| Radius | `--radius-sm 10`, `-md 20`, `-lg 28`, `-pill`, `-arch` | Bogen nur für Porträts |
| Schatten | `--shadow-1` (Linie), `--shadow-2` (Dropdown/Panel) | |
| Bewegung | `--duration-fast 150ms`, `--duration-base 250ms`, `--ease` | `prefers-reduced-motion` setzt auf 0 |

## Komponenten

| Komponente | Klasse | Varianten / States | Barrierefreiheit |
|---|---|---|---|
| Button | `.btn` | `--primary`, `--secondary`, `--light`, `--ghost`; hover, focus-visible | min. 44px, `<a>`/`<button>` |
| Textlink mit Pfeil | `.link-arrow` | – | Pfeil per CSS, nicht vorgelesen |
| Eyebrow | `.eyebrow` | auf Dunkel automatisch `--rose-300` | – |
| Badge / Chip | `.badge`, `.chip-list > .chip` | – | Chips als `<ul>` |
| Header & Navigation | `.site-header`, `.nav`, `.nav__drop`, `.mobile-nav` | Dropdown & Mobilmenü per `<details>` (ohne JS) | `aria-current="page"`, Skip-Link |
| Hero mit Bogen | `.hero`, `.arch` | – | Alt-Text Pflicht |
| Seitenkopf | `.page-hero`, `.breadcrumb` | – | Brotkrumen als `<nav><ol>` |
| Vertrauensleiste | `.trust` | – | Icons `aria-hidden` |
| Phasen-Schritt | `.step`, `.step__num` | – | – |
| Karte | `.card`, `.card__media`, `.card__body` | – | – |
| Leistungs-Index | `.index-list > li > a.index-row` | hover: Titel hellrosa | ganze Zeile klickbar |
| Zitat | `figure.quote` | – | `<blockquote>` + `<figcaption>` |
| Fließtext | `.prose` | – | – |
| Checkliste | `.checklist`, `--2col` | – | echte `<ul>` |
| Infobox | `.infobox`, `--alt` | – | – |
| Detail-Layout | `.detail`, `__main`, `__aside` | Seitenleiste sticky ab 960px | – |
| Galerie | `.gallery` | – | `figcaption` |
| Kontakt | `.contact-grid`, `.contact-item` | – | `tel:` / `mailto:` |
| CTA-Band | `.cta-band` | – | – |
| Footer | `.site-footer` | – | – |

## Pflege

- Neue Seite: in `build/build.py` ergänzen und `python3 build/build.py .` ausführen – Header, Navigation und Footer entstehen automatisch.
- Neue Farbe/Größe: zuerst als Token anlegen, dann verwenden.
- Bilder: `assets/img/`, Alt-Text immer beschreibend. Die Bestandsfotos sind niedrig aufgelöst (ca. 300 px) – für den Livegang neue Fotos in mind. 1600 px Breite empfohlen.
