<!-- SPDX-License-Identifier: LicenseRef-AllRightsReserved -->
<!-- SPDX-FileCopyrightText: 2026 Elija Samuel Friedrich-Ulrich -->
# Server der Imkerei Grassler

Ein Cloudflare Worker, der vier Dinge erledigt:

1. **Website ausliefern:** der Ordner `../website`, also dieselben Seiten wie auf GitHub Pages.
2. **Mit Mollie bezahlen:** Hütte Wolfshof (`wolfshof.html`) und Versand (`bestellen.html`). Preise und Lager kommen aus der Datenbank, nie aus dem Browser.
3. **Mollie-Kartengerät:** In der Verwaltung tippt Thiemo einen Betrag ein, der erscheint direkt auf seinem Mollie-Gerät.
4. **Verwaltung unter `/verwaltung`:** Anmeldung nur mit Passkey (Face ID, Fingerabdruck, Gerätesperre). Dort gibt es Bestellungen, Umsatz, Preise, Lager, das Kartengerät und die Zugänge.

Die Daten liegen in Cloudflare D1 (SQLite). Kartendaten sieht der Server nie, die bleiben bei Mollie.

## Einrichten: ein Befehl (Elija)

Voraussetzungen:
- Node.js 20 oder neuer
- ein Cloudflare-Konto (Gratis-Tarif reicht)
- Thiemo hat dich in Mollie als Teammitglied mit Rolle **„Developer“** hinzugefügt (Einstellungen → Team). Dann siehst du seine API-Schlüssel in deinem eigenen Mollie-Dashboard (oben links seine Organisation wählen → Entwickler → API-Schlüssel). Schlüssel nie per Mail oder Chat verschicken.

```sh
cd imkerei-grassler/server
npm install
npm run einrichten
```

Das Skript macht nacheinander:
1. Anmeldung bei Cloudflare (Browser öffnet sich)
2. Datenbank in der EU anlegen und in `wrangler.jsonc` eintragen, Tabellen und Sortiment einspielen
3. Mollie-Schlüssel abfragen und bei Mollie prüfen (zuerst `test_…`), optional Resend-Schlüssel für E-Mails
4. Einrichtungscode erzeugen
5. Optional die eigene Domain eintragen (muss schon bei Cloudflare liegen)
6. Hochladen (Geheimnisse gehen direkt zu Cloudflare, nichts landet in Dateien)
7. QR-Code auf dem Hütten-Schild auf die neue Adresse setzen und nochmal hochladen

Am Ende steht ein Link `…/verwaltung#code=…`. Den am eigenen Handy öffnen, dann wird der erste Passkey angelegt. Danach in der Verwaltung unter **Zugang → Jemanden einladen** je einen Link für Thiemo und Christoph erstellen und per WhatsApp schicken. Der Link gilt 7 Tage und nur einmal; die beiden tippen nur auf „Zugang anlegen“.

Das Skript kann jederzeit nochmal laufen, etwa für den Live-Schlüssel, eine neue Domain oder einen neuen Code (`npm run einrichten -- --neuer-code`). Erledigtes wird übersprungen. Danach `wrangler.jsonc` und `../website/wolfshof-schild.html` committen.

### Weitere Befehle

| Befehl | Wofür |
|---|---|
| `npm run deploy` | Änderungen hochladen |
| `npm run db:live` | Neue Datenbank-Migrationen einspielen |
| `npm run zugang:zuruecksetzen` | Alle Passkeys löschen und neuen Code setzen (Notfall oder Domain-Umzug) |
| `npm run schild -- https://…/wolfshof` | QR-Code auf dem Schild von Hand ändern |

### Automatisch hochladen bei jedem Push

Der Workflow `.github/workflows/imkerei-grassler-server.yml` spielt Migrationen ein und lädt hoch, sobald im Repo zwei Secrets gesetzt sind:
- `CLOUDFLARE_ACCOUNT_ID`: zeigt `npm run einrichten` am Ende an
- `CLOUDFLARE_API_TOKEN`: Cloudflare → Profil → API-Token → Vorlage „Edit Cloudflare Workers“, dazu Berechtigung „D1: Edit“

```sh
gh secret set CLOUDFLARE_ACCOUNT_ID
gh secret set CLOUDFLARE_API_TOKEN
```
Ohne diese Secrets macht der Workflow nichts.

### E-Mails

Bestellbestätigung an die Kundin oder den Kunden, Nachricht an die Imkerei (`MAIL_IMKEREI`, Standard honig.grassler@gmail.com) und Eingangsbestätigung bei „Vertrag widerrufen“. Zwei Wege:
- **Resend** (gratis bis 3.000 Mails im Monat): Konto anlegen, Domain bestätigen (DNS-Einträge bei Cloudflare), Schlüssel im Einrichtungs-Skript eingeben.
- **Cloudflare Email Service** (Workers Paid): Binding `EMAIL` in `wrangler.jsonc` ergänzen, siehe Cloudflare-Doku „Email Service“.

Absender ist `MAIL_ABSENDER` (Standard: `Imkerei Grassler <bestellung@imkerei-grassler.at>`). Ohne Mailversand wird nur protokolliert, und die Verwaltung zeigt einen Hinweis.

## Eigene Domain imkerei-grassler.at

1. Domain auf die Imkerei registrieren und bei Cloudflare hinzufügen.
2. `npm run einrichten` und bei Schritt 5 die Domain eingeben. Das trägt Route und `OEFFENTLICHE_URL` ein und setzt das QR-Schild neu.
3. **Passkeys gelten nur für die Adresse, auf der sie angelegt wurden:** `npm run zugang:zuruecksetzen`, eigenen Passkey neu anlegen, Thiemo und Christoph neu einladen.
4. Schild neu drucken.

## Vorschau auf GitHub Pages

Auf GitHub Pages läuft kein Server. Dort fällt die Hütte auf den festen Mollie-Zahllink zurück, und „Online bestellen“ zeigt „Bald möglich“. Wenn die Vorschau den echten Server nutzen soll, in `wolfshof.html`, `bestellen.html` und `danke.html` bei `<meta name="api-basis" content="">` die Server-Adresse eintragen. Erlaubt ist das über `ERLAUBTE_URSPRUENGE` in `wrangler.jsonc`.

## Lokal entwickeln

```sh
npm install
npm run db:lokal
npm run attrappe        # Mollie-Attrappe auf Port 8790 (eigenes Terminal)
npm run dev             # http://localhost:8787 (für Passkeys localhost verwenden, nicht 127.0.0.1)
```

`.dev.vars` (nicht im Repo):
```
MOLLIE_API_KEY=test_lokal_attrappe
MOLLIE_API_BASE=http://127.0.0.1:8790/v2
EINRICHTUNGSCODE=lokal-test-code-1234
```

## Wie es funktioniert

| Weg | Ablauf |
|---|---|
| Hütte | `POST /api/zahlung` mit `kanal: wolfshof`. Der Server rechnet die Summe aus der Datenbank und legt die Mollie-Zahlung an. Danach geht es weiter zur Mollie-Kasse und zurück auf `danke.html`. |
| Versand | wie die Hütte, dazu Lieferadresse. Mindestens 10 €, bis 49,99 € kommen 4,60 € Versand dazu, ab 50 € ist der Versand frei. Nur Österreich. |
| Kartengerät | Die Verwaltung legt eine Zahlung mit `method=pointofsale` und `terminalId` an. Mollie schickt sie ans Gerät. |
| Bestätigung | Mollie ruft `/api/mollie/webhook` auf. Der Server fragt den Status bei Mollie nach (nie dem Aufruf selbst vertrauen) und zieht bei „bezahlt“ das Lager ab. |
| Verwaltung | WebAuthn mit `@simplewebauthn` (MIT-Lizenz). Die Sitzung ist ein HttpOnly-Cookie (SameSite=Strict, 30 Tage), Änderungen nur mit dem Kopf `X-Verwaltung: 1`. Nach 5 falschen Einrichtungscodes ist für 15 Minuten gesperrt. Einladungslinks sind einmalig und 7 Tage gültig; gespeichert wird nur ihr Hash. |
| Widerruf | `POST /api/widerruf` (Funktion „Vertrag widerrufen“ → „Widerruf bestätigen“, § 13a FAGG). Speichert den Eingangszeitpunkt und schickt sofort eine Eingangsbestätigung per E-Mail. |
| Bestätigung | Nach der ersten bezahlten Versand-Bestellung einmalig: Mail an die Kundin oder den Kunden (mit Rücktrittsbelehrung und Link) und an die Imkerei. |

## Noch offen

- Erscheint Thiemos Gerät in der Mollie-Geräteliste (Terminals API)? Wenn nicht, gibt er den Betrag wie bisher direkt am Gerät ein. Bestellungen und Website funktionieren trotzdem.
- Registrierkassen- und Belegpflicht mit der Steuerberatung klären: Auch Kartenzahlungen vor Ort zählen als Barumsatz.
- Entwürfe für AGB, Widerrufsbelehrung und Datenschutz liegen auf der Website (`agb.html`, `widerruf.html`, `datenschutz.html`) und müssen vor dem Start geprüft werden.
