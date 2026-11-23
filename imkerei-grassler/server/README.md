<!-- SPDX-License-Identifier: LicenseRef-AllRightsReserved -->
<!-- SPDX-FileCopyrightText: 2026 Elija Samuel Friedrich-Ulrich -->
# Server der Imkerei Grassler

Ein Cloudflare Worker, der vier Dinge erledigt:

1. **Website ausliefern:** der Ordner `../website`, also dieselben Seiten wie auf GitHub Pages.
2. **Mit Mollie bezahlen:** Hütte Wolfshof (`wolfshof.html`) und Versand (`bestellen.html`). Preise und Lager kommen aus der Datenbank, nie aus dem Browser.
3. **Mollie-Kartengerät:** In der Verwaltung tippt Thiemo einen Betrag ein, der erscheint direkt auf seinem Mollie-Gerät.
4. **Verwaltung unter `/verwaltung`:** Anmeldung nur mit Passkey (Face ID, Fingerabdruck, Gerätesperre). Dort gibt es Bestellungen, Umsatz, Preise, Lager, das Kartengerät und die Zugänge.

Die Daten liegen in Cloudflare D1 (SQLite). Kartendaten sieht der Server nie, die bleiben bei Mollie.

## Einrichten (einmalig, ca. 30 Minuten)

Voraussetzung ist Node.js 20 oder neuer auf dem Computer.

1. **Cloudflare-Konto** anlegen, am besten auf die Imkerei bzw. Thiemo, nicht privat auf Elija. Für diese Größe reicht der Gratis-Tarif.
2. Im Terminal:
   ```sh
   cd imkerei-grassler/server
   npm install
   npx wrangler login
   npx wrangler d1 create imkerei-grassler
   ```
   Die ausgegebene `database_id` in `wrangler.jsonc` eintragen.
3. Datenbank anlegen:
   ```sh
   npm run db:live
   ```
4. **Geheimnisse setzen.** Sie werden nur abgefragt, nie in Dateien geschrieben und nie in einen Chat kopiert:
   ```sh
   npx wrangler secret put MOLLIE_API_KEY      # zuerst den Test-Schlüssel (test_…) aus Mollie → Entwickler → API-Schlüssel
   npx wrangler secret put EINRICHTUNGSCODE    # langer Zufallscode, z. B. Ausgabe von: openssl rand -base64 18
   ```
5. Hochladen:
   ```sh
   npm run deploy
   ```
   Wrangler zeigt die Adresse, z. B. `https://imkerei-grassler.<konto>.workers.dev`.
6. **Ersten Passkey anlegen:** `…/verwaltung` am Handy öffnen, den Einrichtungscode eingeben, Passkey anlegen. Danach gleich unter „Zugang“ einen zweiten Passkey anlegen (Laptop oder Christoph). Sobald ein Passkey existiert, funktioniert der Einrichtungscode nicht mehr.
7. **Im Testmodus ausprobieren:** auf `wolfshof.html` und `bestellen.html` einkaufen. Mollie zeigt im Testmodus eine Testseite, auf der man „bezahlt“ wählt. In der Verwaltung unter „Kartengerät“ einen Betrag senden; im Testmodus erscheint ein Link, über den man die Zahlung bestätigt.
8. **Live schalten:** `npx wrangler secret put MOLLIE_API_KEY` mit dem Live-Schlüssel (`live_…`) wiederholen. Das Etikett „Testmodus“ in der Verwaltung verschwindet dann.

## Eigene Domain imkerei-grassler.at

- Domain bei Cloudflare hinzufügen und in `wrangler.jsonc` ergänzen: `"routes": [{ "pattern": "imkerei-grassler.at", "custom_domain": true }]`, dann `npm run deploy`.
- **Passkeys gelten nur für die Adresse, auf der sie angelegt wurden.** Nach dem Umzug auf die eigene Domain alte Passkeys löschen und mit dem Einrichtungscode neu anlegen:
  ```sh
  npx wrangler d1 execute DB --remote --command "DELETE FROM passkeys; DELETE FROM sitzungen;"
  ```
- Das QR-Schild (`website/wolfshof-schild.html`) auf die neue Adresse umstellen und neu drucken.

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
| Verwaltung | WebAuthn mit `@simplewebauthn` (MIT-Lizenz). Die Sitzung ist ein HttpOnly-Cookie (SameSite=Strict, 30 Tage), Änderungen nur mit dem Kopf `X-Verwaltung: 1`. Nach 5 falschen Einrichtungscodes ist für 15 Minuten gesperrt. |

## Noch offen

- Erscheint Thiemos Gerät in der Mollie-Geräteliste (Terminals API)? Wenn nicht, gibt er den Betrag wie bisher direkt am Gerät ein. Bestellungen und Website funktionieren trotzdem.
- Registrierkassen- und Belegpflicht mit der Steuerberatung klären: Auch Kartenzahlungen vor Ort zählen als Barumsatz.
- AGB und Widerrufsbelehrung vor dem Start der Online-Bestellung.
