// SPDX-License-Identifier: LicenseRef-AllRightsReserved
// SPDX-FileCopyrightText: 2026 Elija Samuel Friedrich-Ulrich
// Verwaltung für Thiemo: Anmeldung mit Passkey, Bestellungen, Sortiment, Zahlung am Mollie-Gerät.

import {
  generateRegistrationOptions, verifyRegistrationResponse,
  generateAuthenticationOptions, verifyAuthenticationResponse,
} from '@simplewebauthn/server';
import { isoBase64URL } from '@simplewebauthn/server/helpers';
import { json, fehler, zufall, sha256, cookie, leseJson, bestellnummer } from './util.js';
import { abgleichen, sortiment } from './bestellung.js';
import { zahlungAnlegen, zahlungAbbrechen, geraeteListe, testmodus, MollieFehler } from './mollie.js';

const SITZUNG = 'gr_sitzung';
const SITZUNG_TAGE = 30;
const RP_NAME = 'Imkerei Grassler';
const NUTZER_ID = new TextEncoder().encode('imkerei-grassler-verwaltung');

const rp = (request) => {
  const u = new URL(request.url);
  return { id: u.hostname, origin: u.origin };
};

async function challengeMerken(env, challenge, art) {
  await env.DB.prepare('DELETE FROM challenges WHERE ablauf < ?').bind(Date.now()).run();
  await env.DB.prepare('INSERT INTO challenges (challenge, art, ablauf) VALUES (?,?,?)').bind(challenge, art, Date.now() + 5 * 60e3).run();
}
const challengePruefer = (env, art) => async (c) => {
  const r = await env.DB.prepare('DELETE FROM challenges WHERE challenge=? AND art=? AND ablauf>=?').bind(c, art, Date.now()).run();
  return r.meta.changes === 1;
};

async function sitzungAnlegen(env, passkeyId) {
  const token = zufall(32);
  const ablauf = Date.now() + SITZUNG_TAGE * 864e5;
  await env.DB.prepare('DELETE FROM sitzungen WHERE ablauf < ?').bind(Date.now()).run();
  await env.DB.prepare('INSERT INTO sitzungen (hash, passkey_id, ablauf) VALUES (?,?,?)').bind(await sha256(token), passkeyId, ablauf).run();
  return `${SITZUNG}=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${SITZUNG_TAGE * 86400}`;
}

export async function angemeldet(request, env) {
  const token = cookie(request, SITZUNG);
  if (!token || token.length !== 64) return null;
  return env.DB.prepare('SELECT * FROM sitzungen WHERE hash=? AND ablauf>?').bind(await sha256(token), Date.now()).first();
}

const anzahlPasskeys = async (env) => (await env.DB.prepare('SELECT COUNT(*) AS n FROM passkeys').first()).n;

// Schutz gegen Durchprobieren des Einrichtungscodes
async function gesperrt(env, schluessel) {
  const r = await env.DB.prepare('SELECT anzahl, bis FROM fehlversuche WHERE schluessel=?').bind(schluessel).first();
  return r && r.bis > Date.now() && r.anzahl >= 5;
}
async function fehlversuch(env, schluessel) {
  await env.DB.prepare(`INSERT INTO fehlversuche (schluessel, anzahl, bis) VALUES (?1,1,?2)
    ON CONFLICT(schluessel) DO UPDATE SET anzahl = CASE WHEN bis < ?3 THEN 1 ELSE anzahl + 1 END, bis = ?2`)
    .bind(schluessel, Date.now() + 15 * 60e3, Date.now()).run();
}

function codeGleich(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false;
  let d = 0;
  for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return d === 0;
}

// Erster Passkey nur mit Einrichtungscode, weitere nur angemeldet
async function darfRegistrieren(request, env, code) {
  if (await angemeldet(request, env)) return true;
  if ((await anzahlPasskeys(env)) > 0) return false;
  const ip = request.headers.get('cf-connecting-ip') || 'lokal';
  if (await gesperrt(env, 'code:' + ip)) return 'gesperrt';
  if (env.EINRICHTUNGSCODE && env.EINRICHTUNGSCODE.length >= 12 && codeGleich(String(code || '').trim(), env.EINRICHTUNGSCODE)) return true;
  await fehlversuch(env, 'code:' + ip);
  return false;
}

async function registrierenOptionen(request, env) {
  const e = await leseJson(request);
  const ok = await darfRegistrieren(request, env, e.code);
  if (ok === 'gesperrt') return fehler(429, 'Zu viele Versuche. Bitte in 15 Minuten nochmal.');
  if (!ok) return fehler(403, 'Einrichtungscode stimmt nicht');
  const { results } = await env.DB.prepare('SELECT id, transports FROM passkeys').all();
  const optionen = await generateRegistrationOptions({
    rpName: RP_NAME, rpID: rp(request).id, userName: 'Imkerei Grassler', userDisplayName: 'Imkerei Grassler',
    userID: NUTZER_ID, attestationType: 'none',
    excludeCredentials: results.map((p) => ({ id: p.id, transports: p.transports ? JSON.parse(p.transports) : undefined })),
    authenticatorSelection: { residentKey: 'required', userVerification: 'preferred' },
  });
  await challengeMerken(env, optionen.challenge, 'reg');
  return json(optionen);
}

async function registrierenPruefen(request, env) {
  const e = await leseJson(request, 60000);
  const ok = await darfRegistrieren(request, env, e.code);
  if (ok !== true) return fehler(403, 'Nicht erlaubt');
  const { id: rpID, origin } = rp(request);
  let v;
  try {
    v = await verifyRegistrationResponse({ response: e.antwort, expectedChallenge: challengePruefer(env, 'reg'), expectedOrigin: origin, expectedRPID: rpID, requireUserVerification: false });
  } catch (err) { return fehler(400, 'Passkey konnte nicht geprüft werden: ' + err.message); }
  if (!v.verified) return fehler(400, 'Passkey nicht bestätigt');
  const c = v.registrationInfo.credential;
  const name = (typeof e.name === 'string' && e.name.trim().slice(0, 60)) || 'Passkey';
  await env.DB.prepare('INSERT INTO passkeys (id, public_key, zaehler, transports, name) VALUES (?,?,?,?,?)')
    .bind(c.id, isoBase64URL.fromBuffer(c.publicKey), c.counter, JSON.stringify(c.transports || []), name).run();
  const schon = await angemeldet(request, env);
  return json({ ok: true }, 200, schon ? {} : { 'set-cookie': await sitzungAnlegen(env, c.id) });
}

async function anmeldenOptionen(request, env) {
  const optionen = await generateAuthenticationOptions({ rpID: rp(request).id, userVerification: 'preferred' });
  await challengeMerken(env, optionen.challenge, 'auth');
  return json(optionen);
}

async function anmeldenPruefen(request, env) {
  const e = await leseJson(request, 60000);
  const pk = e.antwort?.id && await env.DB.prepare('SELECT * FROM passkeys WHERE id=?').bind(e.antwort.id).first();
  if (!pk) return fehler(401, 'Diesen Passkey kennt die Verwaltung nicht');
  const { id: rpID, origin } = rp(request);
  let v;
  try {
    v = await verifyAuthenticationResponse({
      response: e.antwort, expectedChallenge: challengePruefer(env, 'auth'), expectedOrigin: origin, expectedRPID: rpID, requireUserVerification: false,
      credential: { id: pk.id, publicKey: isoBase64URL.toBuffer(pk.public_key), counter: pk.zaehler, transports: pk.transports ? JSON.parse(pk.transports) : undefined },
    });
  } catch (err) { return fehler(401, 'Anmeldung fehlgeschlagen: ' + err.message); }
  if (!v.verified) return fehler(401, 'Anmeldung fehlgeschlagen');
  await env.DB.prepare("UPDATE passkeys SET zaehler=?, zuletzt=datetime('now') WHERE id=?").bind(v.authenticationInfo.newCounter, pk.id).run();
  return json({ ok: true }, 200, { 'set-cookie': await sitzungAnlegen(env, pk.id) });
}

async function abmelden(request, env) {
  const token = cookie(request, SITZUNG);
  if (token) await env.DB.prepare('DELETE FROM sitzungen WHERE hash=?').bind(await sha256(token)).run();
  return json({ ok: true }, 200, { 'set-cookie': `${SITZUNG}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0` });
}

// ---------- geschützte Bereiche ----------

async function bestellungenListe(request, env) {
  const filter = new URL(request.url).searchParams.get('status');
  const erlaubt = ['offen', 'bezahlt', 'abgebrochen', 'versendet', 'erledigt'];
  const q = erlaubt.includes(filter)
    ? env.DB.prepare('SELECT * FROM bestellungen WHERE status=? ORDER BY erstellt DESC LIMIT 200').bind(filter)
    : env.DB.prepare("SELECT * FROM bestellungen WHERE status!='abgebrochen' OR erstellt > datetime('now','-2 days') ORDER BY erstellt DESC LIMIT 200");
  const { results } = await q.all();
  const umsatz = await env.DB.prepare(`SELECT
      COALESCE(SUM(CASE WHEN date(bezahlt_am)=date('now') THEN summe_cent END),0) AS heute,
      COALESCE(SUM(CASE WHEN strftime('%Y-%m',bezahlt_am)=strftime('%Y-%m','now') THEN summe_cent END),0) AS monat
    FROM bestellungen WHERE status IN ('bezahlt','versendet','erledigt')`).first();
  return json({
    bestellungen: results.map((b) => ({ ...b, token: undefined, positionen: JSON.parse(b.positionen), kunde: b.kunde ? JSON.parse(b.kunde) : null })),
    umsatz, testmodus: testmodus(env),
  });
}

async function bestellungAendern(request, env, id) {
  const e = await leseJson(request);
  const b = await env.DB.prepare('SELECT * FROM bestellungen WHERE id=?').bind(id).first();
  if (!b) return fehler(404, 'Bestellung nicht gefunden');
  if (e.status !== undefined) {
    if (!['versendet', 'erledigt', 'bezahlt'].includes(e.status)) return fehler(400, 'Status nicht erlaubt');
    if (b.status === 'offen' || b.status === 'abgebrochen') return fehler(400, 'Nur bezahlte Bestellungen können weitergesetzt werden');
    await env.DB.prepare('UPDATE bestellungen SET status=? WHERE id=?').bind(e.status, id).run();
  }
  if (typeof e.notiz === 'string') await env.DB.prepare('UPDATE bestellungen SET notiz=? WHERE id=?').bind(e.notiz.slice(0, 1000), id).run();
  return json({ ok: true });
}

async function bestellungAktualisieren(env, id) {
  const b = await env.DB.prepare('SELECT * FROM bestellungen WHERE id=?').bind(id).first();
  if (!b) return fehler(404, 'Bestellung nicht gefunden');
  const neu = await abgleichen(env, b);
  return json({ id: neu.id, status: neu.status });
}

async function produktAendern(request, env, id) {
  const e = await leseJson(request);
  const p = await env.DB.prepare('SELECT * FROM produkte WHERE id=?').bind(id).first();
  if (!p) return fehler(404, 'Produkt nicht gefunden');
  const zahl = (v, max) => v === null || v === '' ? null : (Number.isInteger(Number(v)) && Number(v) >= 0 && Number(v) <= max ? Number(v) : NaN);
  const preis = 'preis_cent' in e ? zahl(e.preis_cent, 100000) : p.preis_cent;
  const lager = 'lager' in e ? zahl(e.lager, 100000) : p.lager;
  if (Number.isNaN(preis) || Number.isNaN(lager)) return fehler(400, 'Ungültige Zahl');
  if (p.preis_cent !== null && preis === null) return fehler(400, 'Preis fehlt');
  const aktiv = 'aktiv' in e ? (e.aktiv ? 1 : 0) : p.aktiv;
  const online = 'online' in e ? (e.online ? 1 : 0) : p.online;
  await env.DB.prepare('UPDATE produkte SET preis_cent=?, lager=?, aktiv=?, online=? WHERE id=?').bind(preis, lager, aktiv, online, id).run();
  return json({ ok: true });
}

async function geraetZahlung(request, env) {
  const e = await leseJson(request);
  const betrag = Math.round(Number(e.betrag_cent));
  if (!Number.isInteger(betrag) || betrag < 50 || betrag > 500000) return fehler(400, 'Ungültiger Betrag');
  if (typeof e.terminal_id !== 'string' || !/^term_\w+$/.test(e.terminal_id)) return fehler(400, 'Gerät fehlt');
  const beschreibung = (typeof e.beschreibung === 'string' && e.beschreibung.trim().slice(0, 120)) || 'Verkauf vor Ort';
  const id = bestellnummer();
  await env.DB.prepare('INSERT INTO bestellungen (id,token,kanal,status,summe_cent,positionen,terminal_id) VALUES (?,?,?,?,?,?,?)')
    .bind(id, zufall(16), 'vor-ort', 'offen', betrag, JSON.stringify([{ id: 'vor-ort', name: beschreibung, groesse: '', menge: 1, preis_cent: betrag }]), e.terminal_id).run();
  try {
    const z = await zahlungAnlegen(env, { betragCent: betrag, beschreibung: `Imkerei Grassler ${id}`, webhookUrl: `${new URL(request.url).origin}/api/mollie/webhook`, bestellung: id, terminalId: e.terminal_id });
    await env.DB.prepare('UPDATE bestellungen SET mollie_id=? WHERE id=?').bind(z.id, id).run();
    return json({ bestellung: id, test_status_url: z._links?.changePaymentState?.href || null });
  } catch (err) {
    await env.DB.prepare("UPDATE bestellungen SET status='abgebrochen' WHERE id=?").bind(id).run();
    if (err instanceof MollieFehler) return fehler(502, 'Mollie: ' + err.message);
    throw err;
  }
}

async function geraetZahlungAbbrechen(env, id) {
  const b = await env.DB.prepare("SELECT * FROM bestellungen WHERE id=? AND kanal='vor-ort'").bind(id).first();
  if (!b?.mollie_id) return fehler(404, 'Nicht gefunden');
  try { await zahlungAbbrechen(env, b.mollie_id); } catch (err) { if (err instanceof MollieFehler) return fehler(400, 'Mollie: ' + err.message); throw err; }
  return bestellungAktualisieren(env, id);
}

export async function verwaltungApi(request, env, pfad) {
  const m = request.method;
  // Einfacher Schutz gegen fremde Formulare: Änderungen nur mit eigenem Kopf
  if (m !== 'GET' && request.headers.get('x-verwaltung') !== '1') return fehler(403, 'Fehlender Kopf');
  try {
    if (pfad === 'status' && m === 'GET') {
      const s = await angemeldet(request, env);
      return json({ angemeldet: !!s, eingerichtet: (await anzahlPasskeys(env)) > 0, code_gesetzt: !!env.EINRICHTUNGSCODE, mollie: !!env.MOLLIE_API_KEY, testmodus: testmodus(env) });
    }
    if (pfad === 'registrieren/optionen' && m === 'POST') return registrierenOptionen(request, env);
    if (pfad === 'registrieren/pruefen' && m === 'POST') return registrierenPruefen(request, env);
    if (pfad === 'anmelden/optionen' && m === 'POST') return anmeldenOptionen(request, env);
    if (pfad === 'anmelden/pruefen' && m === 'POST') return anmeldenPruefen(request, env);
    if (pfad === 'abmelden' && m === 'POST') return abmelden(request, env);

    if (!(await angemeldet(request, env))) return fehler(401, 'Bitte anmelden');

    if (pfad === 'bestellungen' && m === 'GET') return bestellungenListe(request, env);
    let t;
    if ((t = pfad.match(/^bestellungen\/(GR-[A-Z0-9]{6})$/)) && m === 'PATCH') return bestellungAendern(request, env, t[1]);
    if ((t = pfad.match(/^bestellungen\/(GR-[A-Z0-9]{6})\/abgleichen$/)) && m === 'POST') return bestellungAktualisieren(env, t[1]);
    if (pfad === 'produkte' && m === 'GET') return json({ produkte: await sortiment(env) });
    if ((t = pfad.match(/^produkte\/([a-z0-9-]{2,40})$/)) && m === 'PATCH') return produktAendern(request, env, t[1]);
    if (pfad === 'geraete' && m === 'GET') {
      try { return json({ geraete: await geraeteListe(env) }); }
      catch (err) { if (err instanceof MollieFehler) return fehler(502, 'Mollie: ' + err.message); throw err; }
    }
    if (pfad === 'geraet-zahlung' && m === 'POST') return geraetZahlung(request, env);
    if ((t = pfad.match(/^geraet-zahlung\/(GR-[A-Z0-9]{6})\/abbrechen$/)) && m === 'POST') return geraetZahlungAbbrechen(env, t[1]);
    if (pfad === 'passkeys' && m === 'GET') {
      const { results } = await env.DB.prepare('SELECT id, name, erstellt, zuletzt FROM passkeys ORDER BY erstellt').all();
      return json({ passkeys: results });
    }
    if ((t = pfad.match(/^passkeys\/([\w-]{10,400})$/)) && m === 'DELETE') {
      if ((await anzahlPasskeys(env)) <= 1) return fehler(400, 'Der letzte Passkey kann nicht gelöscht werden');
      await env.DB.prepare('DELETE FROM passkeys WHERE id=?').bind(t[1]).run();
      await env.DB.prepare('DELETE FROM sitzungen WHERE passkey_id=?').bind(t[1]).run();
      return json({ ok: true });
    }
    return fehler(404, 'Nicht gefunden');
  } catch (err) {
    if (err.message === 'kein JSON' || err.message === 'zu gross') return fehler(400, 'Ungültige Anfrage');
    throw err;
  }
}
