# Offene Punkte · Fassung 12

Aufteilung: **Elija macht alles, was geht.** Thiemo und Christoph nur, was nur sie können (siehe `website/fuer-thiemo.html`).

## Ablauf für Elija (Reihenfolge)

1. [ ] Thiemo fügt Elija in Mollie als Teammitglied mit Rolle „Developer“ hinzu (Einstellungen → Team).
2. [ ] Cloudflare-Konto (Elija), dann im Ordner `server`: `npm install` und `npm run einrichten`.
       Fragt nach Mollie-Test-Schlüssel (in Mollie oben links Thiemos Organisation wählen), optional Resend-Schlüssel und Domain.
3. [ ] Den ausgegebenen Link `…/verwaltung#code=…` am eigenen Handy öffnen und den ersten Passkey anlegen.
4. [ ] Verwaltung → Zugang → „Jemanden einladen“: Links für Thiemo und Christoph erstellen und per WhatsApp schicken.
5. [ ] Testkäufe: Hütte (`/wolfshof`), Versand (`/bestellen`), Kartengerät (Verwaltung), Widerruf (`/widerruf`).
6. [ ] `server/wrangler.jsonc` und `website/wolfshof-schild.html` committen.
7. [ ] Optional: automatisches Hochladen bei jedem Push (Secrets `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`, siehe `server/README.md`).
8. [ ] Domain `imkerei-grassler.at` registrieren (auf die Imkerei), bei Cloudflare hinzufügen, `npm run einrichten` erneut (Domain eintragen),
       dann `npm run zugang:zuruecksetzen` und Passkeys neu anlegen (Passkeys hängen an der Adresse). Schild drucken und laminieren.
9. [ ] E-Mails: Resend-Konto (gratis) mit bestätigter Domain oder Cloudflare Email Service (Workers Paid). Testbestellung prüfen.
10. [ ] Live schalten: `npm run einrichten` mit dem Live-Schlüssel (`live_…`).

## Klären (Elija)

- [ ] Etiketten der Mischhonige als „Honig mit Zutaten“ (Zutatenverzeichnis, Allergene wie Haselnuss, Mengenangabe der Zutat).
- [ ] „Bio“ im Produktnamen: Nach EU-Bio-Recht darf ein nicht biozertifiziertes Produkt Bio-Zutaten in der Regel nur im Zutatenverzeichnis nennen. Bei Kontrollstelle oder Lebensmittelaufsicht nachfragen.
- [ ] AGB, Widerrufsbelehrung (inkl. Funktion „Vertrag widerrufen“ nach § 13a FAGG), Datenschutz und Impressum prüfen lassen, z. B. WKO-Beratung.
- [ ] Prüfen, ob Thiemos Mollie-Gerät in der Geräteliste (Terminals API) erscheint.

## Antworten von Thiemo (eine Nachricht)

- [ ] Cremehonig gestrichen, gleicher Preis für alle drei Sorten?
- [ ] Schreibweise „Waldviertler Mohn“ oder Marke „Wald4tler“?
- [ ] Schönberg: Adresse und Startdatum.
- [ ] Bargeld in der Hütte?
- [ ] Lieferzeit beim Versand.
- [ ] Betriebe: Muster, Rechnung/Zahlungsziel, Portionsgläser.
- [ ] Partner: Besuche am Stand?
- [ ] Bio-Nachweis des Beeren-Lieferanten.
- [ ] Rechtsform (Landwirtschaft oder Gewerbe), UID.
- [ ] Mit Steuerberatung: Registrierkasse/Belege, Umsatzsteuer (Kleinunternehmer?).
- [ ] Fotos (Anleitung auf `fuer-thiemo.html`).
- [ ] Freigabe zur Veröffentlichung.

## Erledigt

- [x] Alle Angaben von Thiemo (Fassung 09), Wolfshof 5 bestätigt.
- [x] Selbstbedienung Wolfshof mit QR-Schild (Fassung 10).
- [x] Server mit Mollie, Online-Bestellung, Kartengerät, Verwaltung mit Passkey (Fassung 11).
- [x] Einrichtungs-Skript, Einladungslinks, automatisches Hochladen, Bestätigungs-E-Mails, Widerrufsfunktion, Entwürfe für AGB/Widerruf/Datenschutz (Fassung 12).
