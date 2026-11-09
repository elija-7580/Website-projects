# Imkerei Grassler — Branding & Website · Fassung 03

## Starten

- **Grassler-Logo.html** öffnen: Präsentation des Honigglas-G mit Wortmarke und Farbvarianten.
- **Grassler-Markenhandbuch.html** öffnen: Zeichen, Farben, Schriften, Sprachstil und Anwendungsbeispiele.
- **website/index.html** öffnen oder den Ordner `website` mit einem beliebigen lokalen statischen Server bereitstellen: acht echte HTML-Routen mit gemeinsamen CSS-, JS-, Schrift- und Bilddateien.

## Hinweis zu diesem Repository

Das Repository enthält nur Textdateien. Die beiden Symbolfotos liegen deshalb als SVG mit eingebettetem WebP vor (`website/assets/*-foto.svg`), die Young Serif ist direkt in `site.css` eingebettet. Transparente PNG-Logos, die Schriftdateien (TTF) für die Bauskripte und die eigenständige Website-Vorschau `Grassler-Website.html` liegen im Gesamtpaket Fassung 03 auf der Notion-Seite „07 — Branding & Website“.

## Status

Gestaltung und Frontend sind ausgearbeitet. Nicht veröffentlicht, nicht für den Livebetrieb freigegeben. Keine Zugangsdaten und keine privaten Kontaktdaten eingebaut. Kein Onlineshop, kein Zahlungsverkehr, kein E-Mail-Versand.

### Anfragefunktion

Größenauswahl wird ins Formular übernommen. Das Formular prüft Pflichtfelder und Rückkontakt, erstellt einen Text im Browser und bietet Kopieren bzw. Textdownload. Es verschickt nichts und speichert keine Angaben in Cookies oder Local Storage. Für den Livebetrieb muss ein tatsächlicher Zustellweg eingerichtet und Ende-zu-Ende getestet werden.

## Inhalt

- `website/`: statische Website, 5 Inhaltsseiten + Impressumsentwurf, Datenschutzentwurf, Freigabestand.
- `marke/`: Honigglas-G, horizontales, kurzes und kompaktes Logo als SVG-Pfade, Versionen für helle, dunkle und goldene Flächen, einfarbig und negativ, transparente PNGs, Favicon, Vorderetikett als Gestaltungsmuster, Farbwerte, Schriftdateien mit Lizenz.
- `dokumentation/`: Designphilosophie, Textüberarbeitung, Bildnachweise, QA und Freigabecheckliste.
- `src/`: optionale Bauskripte.

## Vor Veröffentlichung

1. Thiemos Namen, Betriebsangaben, Sortiment und Liefermöglichkeiten bestätigen.
2. Adresse, Telefon, E-Mail, Domain, Produktpreise und Verfügbarkeit übermitteln.
3. Impressum und Datenschutzhinweise fertigstellen und prüfen.
4. Kontaktversand einrichten und real testen.
5. Eigene Bilder einsetzen oder Stock-Symbolbilder freigeben.
6. Alle Angaben in `website/release-config.json` bestätigen und `python dokumentation/freigabepruefung.py` ausführen.
7. Erst nach ausdrücklicher Freigabe veröffentlichen; dann `noindex,nofollow` und `robots.txt` bewusst anpassen.

## Fassung 04 (Lebendigkeit)

Hellere Grundfläche mit warmem Lichtverlauf, Bienenwachs nur noch in getönten Abschnitten mit leichtem Wabenmuster. Fliegende Bienen in Hero und Seitenköpfen, wiegende Blüten am Hero-Bild, Honigtropfen an der Goldlinie, Einblenden beim Scrollen, Hover-Bewegungen. Auf der Startseite klettert ein eigener Bär im Markenstil (flach, nur Waldhonig, Bienenwachs und Gold, Honigglas wie im Logo) über den Gastronomie-Streifen, schaut zum Glas, rührt, schleckt die Tatze ab und kneift genüsslich die Augen zu; ein Tropfen fällt zurück ins Glas. Im Dark Mode kehren sich Fell und Akzent um („Nur zum Kosten …“). Alles reines CSS/SVG ohne Bibliotheken; bei „Bewegung reduzieren“ stehen Bienen, Tropfen und Bär still.

## Fassung 05 (neue Inhalte, mit Platzhaltern)

Neue Seiten **Standorte** (illustrierte Karte des Kamptals mit Stand Wolfshof und dem kommenden Stand bei Schönberg am Kamp, Einkaufsmöglichkeiten) und **Bienenstock-Partnerschaft** (Ablauf, drei Paketvorschläge). Honigseite um vier verfeinerte Sorten, Fotoplätze und Versand per Post erweitert; Anfrageformular mit Lieferart. Startseite mit Landschaftsband (Wiese, Wald, Bienenstöcke, Parallax beim Scrollen), Hügelkanten an getönten Abschnitten, Bienen, die beim Drüberfahren über Produktlinks ausfliegen, Honigtropfen auf Produktkarten. Fehlende Angaben sind auf der Website sichtbar als Platzhalter markiert und in `dokumentation/Offene-Punkte.md` gesammelt; Fotohinweise in `dokumentation/Fotoanleitung.md`.

## Gestaltung & Technik

Drei Markenfarben nach dem Prinzip eine ausgefallene, zwei fade: Honiggold #EFA51A, Bienenwachs #F6ECCB und Waldhonig #3A2410. Honiggold wird nur als Fläche verwendet, nie als Schrift auf hellem Grund. Wortmarke und Überschriften in Young Serif, Logozeile in Bricolage Grotesque (beide SIL Open Font License, aus dem Skill-Repository anthropics/skills). Die Website bindet Young Serif lokal als WOFF ein, ohne CDN; Fließtext in der Systemschrift. Keine Tracker, Cookies oder externen Bibliotheken. Helles und dunkles Farbschema, reduzierte Bewegung, sichtbare Tastaturfokusse und Mobilmenü.

Gestaltet nach den Skills `canvas-design` (Designphilosophie „Goldene Geduld“, Verfeinern statt Hinzufügen) und `frontend-design` (Farb- und Schrift-Tokens, Prüfung gegen generische Muster, Sichtkontrolle). Keine Marken- oder Schutzfähigkeitsrecherche vorgenommen. Das Vorderetikett ist keine lebensmittelrechtlich vollständige Druckdatei.

## Quellen und Erhaltung

Fassung 03 ersetzt Ultramarin, Haferpapier und Graphit durch die Honigpalette und zeichnet das Honigglas-G mit Tropfen neu. Texte bleiben aus Fassung 02. Frühere Fassungen bleiben in Notion erhalten.
