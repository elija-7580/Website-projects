// SPDX-License-Identifier: LicenseRef-AllRightsReserved
// SPDX-FileCopyrightText: 2026 Elija Samuel Friedrich-Ulrich
// Richtet den Server der Imkerei Grassler in einem Durchgang ein: npm run einrichten
// Kann gefahrlos mehrmals laufen; bereits Erledigtes wird übersprungen.

import { spawnSync, spawn } from 'node:child_process';
import { readFileSync, writeFileSync, mkdtempSync, rmSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomBytes } from 'node:crypto';
import readline from 'node:readline';
import { schildAktualisieren } from './schild.mjs';

const SERVER = join(dirname(fileURLToPath(import.meta.url)), '..');
const CONFIG = join(SERVER, 'wrangler.jsonc');
const PLATZHALTER_ID = '00000000-0000-0000-0000-000000000000';
const WRANGLER = process.env.WRANGLER_BIN || 'npx';
const WARGS = process.env.WRANGLER_BIN ? [] : ['wrangler'];
const nurPruefen = process.argv.includes('--trocken');

const fett = (s) => `\x1b[1m${s}\x1b[0m`, gruen = (s) => `\x1b[32m${s}\x1b[0m`, gelb = (s) => `\x1b[33m${s}\x1b[0m`;
const schritt = (n, t) => console.log(`\n${fett(`[${n}] ${t}`)}`);

function wrangler(args, { still = false, eingabe } = {}) {
  const r = spawnSync(WRANGLER, [...WARGS, ...args], { cwd: SERVER, encoding: 'utf8', input: eingabe, stdio: still || eingabe !== undefined ? ['pipe', 'pipe', 'pipe'] : 'inherit', env: { ...process.env, WRANGLER_SEND_METRICS: 'false' } });
  return { ok: r.status === 0, aus: (r.stdout || '') + (r.stderr || '') };
}
function wranglerLive(args) {
  // Ausgabe anzeigen und gleichzeitig mitschreiben (für die Adresse nach dem Hochladen)
  return new Promise((fertig) => {
    let aus = '';
    const p = spawn(WRANGLER, [...WARGS, ...args], { cwd: SERVER, env: { ...process.env, WRANGLER_SEND_METRICS: 'false' } });
    p.stdout.on('data', (d) => { aus += d; process.stdout.write(d); });
    p.stderr.on('data', (d) => { aus += d; process.stderr.write(d); });
    p.on('close', (code) => fertig({ ok: code === 0, aus }));
  });
}

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const frage = (t) => new Promise((r) => rl.question(t, (a) => r(a.trim())));
function geheim(t) {
  // Eingabe nicht anzeigen (Mollie-Schlüssel)
  return new Promise((r) => {
    const aus = rl.output;
    rl._writeToOutput = (s) => { if (s.includes(t)) aus.write(s); else aus.write('*'.repeat(s.length ? 1 : 0)); };
    rl.question(t, (a) => { rl._writeToOutput = (s) => aus.write(s); aus.write('\n'); r(a.trim()); });
  });
}

async function mollieSchluesselPruefen(key) {
  if (process.env.EINRICHTEN_OHNE_MOLLIE_PRUEFUNG) return null;
  try {
    const r = await fetch('https://api.mollie.com/v2/methods', { headers: { authorization: `Bearer ${key}` } });
    return r.ok;
  } catch { return null; }
}

function konfigLesen() { return readFileSync(CONFIG, 'utf8'); }
function konfigSchreiben(s) { if (!nurPruefen) writeFileSync(CONFIG, s); }

async function main() {
  console.log(fett('\nImkerei Grassler · Server einrichten\n'));
  console.log('Du brauchst: ein Cloudflare-Konto und Zugang zu Thiemos Mollie-Konto (Rolle „Developer“).\nDer Ablauf dauert ein paar Minuten. Abbrechen jederzeit mit Strg+C, ein neuer Start macht dort weiter.\n');

  schritt(1, 'Bei Cloudflare anmelden');
  let wer = wrangler(['whoami', '--json'], { still: true });
  if (!wer.ok) { console.log('Es öffnet sich gleich der Browser zum Anmelden …'); wrangler(['login']); wer = wrangler(['whoami', '--json'], { still: true }); }
  if (!wer.ok) throw new Error('Anmeldung bei Cloudflare hat nicht geklappt.');
  let konto = null;
  try { const j = JSON.parse(wer.aus.slice(wer.aus.indexOf('{'))); konto = j.accounts?.[0] || null; console.log(gruen('✓ angemeldet' + (j.email ? ' als ' + j.email : ''))); } catch { console.log(gruen('✓ angemeldet')); }

  schritt(2, 'Datenbank (Cloudflare D1, Daten in der EU)');
  let cfg = konfigLesen();
  if (cfg.includes(PLATZHALTER_ID)) {
    let liste = wrangler(['d1', 'list', '--json'], { still: true });
    let db = null;
    try { db = JSON.parse(liste.aus.slice(liste.aus.indexOf('['))).find((d) => d.name === 'imkerei-grassler'); } catch {}
    if (!db) {
      const neu = wrangler(['d1', 'create', 'imkerei-grassler', '--jurisdiction', 'eu'], { still: true });
      if (!neu.ok) { console.log(neu.aus); throw new Error('Datenbank konnte nicht angelegt werden.'); }
      liste = wrangler(['d1', 'list', '--json'], { still: true });
      db = JSON.parse(liste.aus.slice(liste.aus.indexOf('['))).find((d) => d.name === 'imkerei-grassler');
    }
    const id = db?.uuid || db?.id;
    if (!id) throw new Error('Datenbank-ID nicht gefunden.');
    cfg = cfg.replace(PLATZHALTER_ID, id); konfigSchreiben(cfg);
    console.log(gruen(`✓ Datenbank ${id} in wrangler.jsonc eingetragen`));
  } else console.log(gruen('✓ Datenbank ist schon eingetragen'));
  const mig = wrangler(['d1', 'migrations', 'apply', 'DB', '--remote'], { still: true, eingabe: 'y\n' });
  if (!mig.ok) { console.log(mig.aus); throw new Error('Tabellen konnten nicht angelegt werden.'); }
  console.log(gruen('✓ Tabellen und Sortiment sind auf dem neuesten Stand'));

  schritt(3, 'Mollie-Schlüssel');
  console.log('Mollie-Dashboard → oben links Thiemos Organisation wählen → Entwickler → API-Schlüssel.\nZuerst den Test-Schlüssel (test_…) nehmen, später einfach mit dem Live-Schlüssel (live_…) nochmal laufen lassen.\nLeer lassen, wenn der Schlüssel schon gesetzt ist.');
  const geheimnisse = {};
  for (;;) {
    const key = await geheim('Mollie-Schlüssel: ');
    if (!key) break;
    if (!/^(test|live)_\w{20,}$/.test(key)) { console.log(gelb('Das sieht nicht nach einem Mollie-Schlüssel aus (test_… oder live_…).')); continue; }
    const ok = await mollieSchluesselPruefen(key);
    if (ok === false) { console.log(gelb('Mollie lehnt diesen Schlüssel ab. Bitte nochmal kopieren.')); continue; }
    geheimnisse.MOLLIE_API_KEY = key;
    console.log(gruen(`✓ ${key.startsWith('live_') ? 'Live' : 'Test'}-Schlüssel ${ok ? 'geprüft' : 'übernommen (Prüfung ohne Internet nicht möglich)'}`));
    break;
  }

  console.log('\nE-Mails (Bestellbestätigung, Nachricht an Thiemo): Schlüssel von resend.com (gratis, Domain muss dort bestätigt sein).\nLeer lassen, wenn schon gesetzt oder später.');
  for (;;) {
    const r = await geheim('Resend-Schlüssel (optional): ');
    if (!r) break;
    if (!/^re_\w{10,}$/.test(r)) { console.log(gelb('Das sieht nicht nach einem Resend-Schlüssel aus (re_…).')); continue; }
    geheimnisse.RESEND_API_KEY = r; console.log(gruen('✓ Resend-Schlüssel übernommen')); break;
  }

  schritt(4, 'Einrichtungscode für den ersten Passkey');
  const neuerCode = process.argv.includes('--neuer-code') || !existsSync(join(SERVER, '.einrichtung-erledigt'));
  let code = null;
  if (neuerCode) { code = randomBytes(15).toString('base64url'); geheimnisse.EINRICHTUNGSCODE = code; console.log(gruen('✓ neuer Code erzeugt')); }
  else console.log(gruen('✓ Code wurde schon gesetzt (neu mit: npm run einrichten -- --neuer-code)'));

  schritt(5, 'Eigene Domain (optional)');
  cfg = konfigLesen();
  if (!/"routes"\s*:/.test(cfg)) {
    const domain = (await frage('Domain, die schon bei Cloudflare liegt (z. B. imkerei-grassler.at), oder leer lassen: ')).toLowerCase();
    if (/^[a-z0-9-]+(\.[a-z0-9-]+)+$/.test(domain)) {
      cfg = cfg.replace('"observability"', `"routes": [{ "pattern": "${domain}", "custom_domain": true }],\n  "observability"`)
        .replace('"ERLAUBTE_URSPRUENGE": "', `"OEFFENTLICHE_URL": "https://${domain}",\n    "ERLAUBTE_URSPRUENGE": "`);
      konfigSchreiben(cfg); console.log(gruen(`✓ ${domain} eingetragen`));
    } else console.log('übersprungen, die workers.dev-Adresse reicht für den Anfang');
  } else console.log(gruen('✓ Domain ist schon eingetragen'));

  schritt(6, 'Hochladen');
  if (nurPruefen) { console.log(gelb('Trockenlauf: nichts hochgeladen.')); rl.close(); return; }
  const tmp = mkdtempSync(join(tmpdir(), 'grassler-'));
  const datei = join(tmp, 'geheim.env');
  writeFileSync(datei, Object.entries(geheimnisse).map(([k, v]) => `${k}=${v}`).join('\n') + '\n', { mode: 0o600 });
  let dep;
  try { dep = await wranglerLive(['deploy', ...(Object.keys(geheimnisse).length ? ['--secrets-file', datei] : [])]); }
  finally { rmSync(tmp, { recursive: true, force: true }); }
  if (!dep.ok) throw new Error('Hochladen hat nicht geklappt (Ausgabe oben).');
  const domainMatch = konfigLesen().match(/"OEFFENTLICHE_URL":\s*"([^"]+)"/);
  const workersUrl = (dep.aus.match(/https:\/\/[a-z0-9.-]+\.workers\.dev/) || [])[0];
  const url = domainMatch?.[1] || workersUrl;
  if (!url) throw new Error('Adresse nicht gefunden. Bitte in der Ausgabe oben nachsehen.');
  if (code) writeFileSync(join(SERVER, '.einrichtung-erledigt'), new Date().toISOString() + '\n');

  schritt(7, 'QR-Schild für die Hütte');
  if (schildAktualisieren(`${url}/wolfshof`)) {
    console.log(gruen(`✓ QR-Code zeigt jetzt auf ${url}/wolfshof`));
    const nochmal = await wranglerLive(['deploy']);
    if (!nochmal.ok) console.log(gelb('Schild lokal geändert, aber nicht hochgeladen. Später: npm run deploy'));
  } else console.log(gruen('✓ QR-Code war schon aktuell'));

  rl.close();
  console.log(`\n${fett('Fertig!')}\n
  Website:      ${url}
  Verwaltung:   ${url}/verwaltung
${code ? `\n  ${fett('Jetzt am eigenen Handy öffnen und den ersten Passkey anlegen:')}\n  ${url}/verwaltung#code=${code}\n  (Der Code gilt nur, solange es noch keinen Passkey gibt.)\n` : ''}
  Danach in der Verwaltung unter „Zugang“ → „Jemanden einladen“ einen Link für Thiemo
  und einen für Christoph erstellen und per WhatsApp schicken. Mehr müssen die beiden nicht tun.

  Bitte die geänderten Dateien committen: server/wrangler.jsonc und website/wolfshof-schild.html
  Schild drucken: ${url}/wolfshof-schild.html
${konto ? `\n  Für automatisches Hochladen bei jedem Push: CLOUDFLARE_ACCOUNT_ID = ${konto.id} (siehe server/README.md)` : ''}
`);
}

main().catch((e) => { rl.close(); console.error(`\n\x1b[31m✗ ${e.message}\x1b[0m\nEinfach nochmal starten: npm run einrichten`); process.exit(1); });
