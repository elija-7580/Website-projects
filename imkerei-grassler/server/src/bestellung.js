// SPDX-License-Identifier: LicenseRef-AllRightsReserved
// SPDX-FileCopyrightText: 2026 Elija Samuel Friedrich-Ulrich
// Öffentliche Schnittstelle: Sortiment, Bezahlung starten, Mollie-Webhook, Bestellstatus.

import { json, fehler, bestellnummer, zufall, leseJson, basisUrl, euro } from './util.js';
import { zahlungAnlegen, zahlungHolen, statusAusMollie, MollieFehler } from './mollie.js';
import { bestellungBestaetigen, imkereiBenachrichtigen, widerrufBestaetigen } from './mail.js';

export const VERSAND = { mindestCent: 1000, freiAbCent: 5000, kostenCent: 460 };
const MINDEST_WOLFSHOF_CENT = 100;
const MAX_ETIKETT_CENT = 20000;

export async function sortiment(env) {
  const { results } = await env.DB.prepare(
    'SELECT id,name,groesse,kategorie,preis_cent,lager,aktiv,online FROM produkte ORDER BY sortierung'
  ).all();
  return results;
}

export async function produkteOeffentlich(env) {
  const liste = (await sortiment(env)).filter((p) => p.aktiv).map((p) => ({
    id: p.id, name: p.name, groesse: p.groesse, kategorie: p.kategorie, preis_cent: p.preis_cent, online: !!p.online,
    ausverkauft: p.lager !== null && p.lager <= 0,
    nur_noch: p.lager !== null && p.lager > 0 && p.lager <= 3 ? p.lager : null,
  }));
  return json({ produkte: liste, versand: VERSAND }, 200, { 'cache-control': 'public, max-age=30' });
}

// Prüft Warenkorb gegen die Datenbank; Preise kommen nie vom Browser
export async function warenkorbPruefen(env, positionen, kanal) {
  if (!Array.isArray(positionen) || positionen.length > 40) throw new Eingabefehler('Ungültiger Warenkorb');
  const alle = Object.fromEntries((await sortiment(env)).map((p) => [p.id, p]));
  const zeilen = [];
  let summe = 0;
  for (const { id, menge } of positionen) {
    const m = Number(menge);
    if (!Number.isInteger(m) || m < 1 || m > 50) throw new Eingabefehler('Ungültige Menge');
    const p = alle[id];
    if (!p || !p.aktiv || p.preis_cent === null) throw new Eingabefehler(`Produkt nicht verfügbar: ${id}`);
    if (kanal === 'online' && !p.online) throw new Eingabefehler(`${p.name} (${p.groesse}) gibt’s nur vor Ort`);
    if (p.lager !== null && m > p.lager) throw new Eingabefehler(`Von ${p.name} ${p.groesse} sind nur noch ${Math.max(0, p.lager)} da`, { produkt: id });
    zeilen.push({ id, name: p.name, groesse: p.groesse, menge: m, preis_cent: p.preis_cent });
    summe += m * p.preis_cent;
  }
  return { zeilen, summe };
}

export class Eingabefehler extends Error {
  constructor(m, extra = {}) { super(m); this.extra = extra; }
}

function kundePruefen(k) {
  const t = (v, max = 120) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
  const kunde = { name: t(k?.name), email: t(k?.email, 200), telefon: t(k?.telefon, 40), strasse: t(k?.strasse), plz: t(k?.plz, 10), ort: t(k?.ort), notiz: t(k?.notiz, 500), land: 'AT' };
  if (!kunde.name || !kunde.strasse || !kunde.ort) throw new Eingabefehler('Bitte Name und Lieferadresse angeben');
  if (!/^\d{4}$/.test(kunde.plz)) throw new Eingabefehler('Bitte eine österreichische Postleitzahl angeben (4 Ziffern)');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(kunde.email)) throw new Eingabefehler('Bitte eine gültige E-Mail-Adresse angeben');
  return kunde;
}

export async function zahlungStarten(request, env) {
  let e;
  try { e = await leseJson(request); } catch { return fehler(400, 'Ungültige Anfrage'); }
  const kanal = e.kanal;
  if (!['wolfshof', 'online'].includes(kanal)) return fehler(400, 'Unbekannter Kanal');
  try {
    const { zeilen, summe: warenSumme } = await warenkorbPruefen(env, e.positionen || [], kanal);
    let summe = warenSumme, versand = 0, kunde = null;
    if (kanal === 'wolfshof') {
      const etikett = Math.round(Number(e.etikett_cent || 0));
      if (!Number.isFinite(etikett) || etikett < 0 || etikett > MAX_ETIKETT_CENT) throw new Eingabefehler('Ungültiger Betrag laut Etikett');
      if (etikett > 0) { zeilen.push({ id: 'etikett', name: 'Laut Etikett', groesse: '', menge: 1, preis_cent: etikett }); summe += etikett; }
      if (summe < MINDEST_WOLFSHOF_CENT) throw new Eingabefehler('Bitte zuerst auswählen, was du mitnimmst');
    } else {
      kunde = kundePruefen(e.kunde);
      if (warenSumme < VERSAND.mindestCent) throw new Eingabefehler(`Der Mindestbestellwert ist ${euro(VERSAND.mindestCent).replace('.', ',')} €`);
      versand = warenSumme >= VERSAND.freiAbCent ? 0 : VERSAND.kostenCent;
      summe += versand;
    }
    const id = bestellnummer(), token = zufall(16);
    await env.DB.prepare('INSERT INTO bestellungen (id,token,kanal,status,summe_cent,versand_cent,positionen,kunde) VALUES (?,?,?,?,?,?,?,?)')
      .bind(id, token, kanal, 'offen', summe, versand, JSON.stringify(zeilen), kunde ? JSON.stringify(kunde) : null).run();
    const basis = basisUrl(request, env);
    const zahlung = await zahlungAnlegen(env, {
      betragCent: summe,
      beschreibung: `Imkerei Grassler ${id}${kanal === 'wolfshof' ? ' Wolfshof' : ''}`,
      rueckUrl: `${basis}/danke.html?b=${id}&t=${token}`,
      webhookUrl: `${basis}/api/mollie/webhook`,
      bestellung: id,
    });
    await env.DB.prepare('UPDATE bestellungen SET mollie_id=? WHERE id=?').bind(zahlung.id, id).run();
    return json({ bestellung: id, checkout: zahlung._links?.checkout?.href, summe_cent: summe });
  } catch (err) {
    if (err instanceof Eingabefehler) return fehler(400, err.message, err.extra);
    if (err instanceof MollieFehler) { console.error('Mollie', err.status, err.daten); return fehler(502, 'Die Bezahlung konnte gerade nicht gestartet werden. Bitte später nochmal probieren.'); }
    throw err;
  }
}

// Status einer Bestellung mit Mollie abgleichen; zieht beim ersten "bezahlt" das Lager ab
export async function abgleichen(env, bestellung, basis) {
  if (!bestellung?.mollie_id) return bestellung;
  const zahlung = await zahlungHolen(env, bestellung.mollie_id);
  const neu = statusAusMollie(zahlung.status);
  // Spätere Bearbeitungsstände (versendet, erledigt) nicht zurücksetzen
  if (bestellung.status === 'offen' || (bestellung.status === 'abgebrochen' && neu === 'bezahlt')) {
    if (neu !== bestellung.status) {
      await env.DB.prepare("UPDATE bestellungen SET status=?, bezahlt_am=CASE WHEN ?='bezahlt' THEN datetime('now') ELSE bezahlt_am END WHERE id=?")
        .bind(neu, neu, bestellung.id).run();
      bestellung.status = neu;
    }
  }
  if (bestellung.status !== 'offen' && bestellung.status !== 'abgebrochen' && !bestellung.lager_abgezogen) {
    const r = await env.DB.prepare('UPDATE bestellungen SET lager_abgezogen=1 WHERE id=? AND lager_abgezogen=0').bind(bestellung.id).run();
    if (r.meta.changes === 1) {
      const zeilen = JSON.parse(bestellung.positionen);
      const befehle = zeilen.filter((z) => z.id !== 'etikett').map((z) =>
        env.DB.prepare('UPDATE produkte SET lager = lager - ? WHERE id=? AND lager IS NOT NULL').bind(z.menge, z.id));
      if (befehle.length) await env.DB.batch(befehle);
      bestellung.lager_abgezogen = 1;
    }
  }
  // Einmalig: Bestätigung an Kundin/Kunden und Nachricht an die Imkerei (nur Versand)
  if (basis && bestellung.kanal === 'online' && bestellung.status === 'bezahlt' && !bestellung.bestaetigt) {
    const r = await env.DB.prepare('UPDATE bestellungen SET bestaetigt=1 WHERE id=? AND bestaetigt=0').bind(bestellung.id).run();
    if (r.meta.changes === 1) {
      bestellung.bestaetigt = 1;
      await bestellungBestaetigen(env, bestellung, basis);
      await imkereiBenachrichtigen(env, bestellung, basis);
    }
  }
  return bestellung;
}

export async function webhook(request, env) {
  const form = await request.formData().catch(() => null);
  const id = form?.get('id');
  if (!id || !/^tr_\w+$/.test(id)) return new Response('', { status: 200 });
  const b = await env.DB.prepare('SELECT * FROM bestellungen WHERE mollie_id=?').bind(id).first();
  if (b) {
    try { await abgleichen(env, b, basisUrl(request, env)); } catch (err) { console.error('Webhook', err); return new Response('', { status: 500 }); }
  }
  return new Response('', { status: 200 });
}

export async function bestellStatus(request, env) {
  const url = new URL(request.url);
  const id = url.searchParams.get('b'), token = url.searchParams.get('t');
  if (!id || !token) return fehler(400, 'Bestellung fehlt');
  let b = await env.DB.prepare('SELECT * FROM bestellungen WHERE id=? AND token=?').bind(id, token).first();
  if (!b) return fehler(404, 'Bestellung nicht gefunden');
  if (b.status === 'offen') { try { b = await abgleichen(env, b, basisUrl(request, env)); } catch (err) { console.error(err); } }
  return json({
    bestellung: b.id, kanal: b.kanal, status: b.status, summe_cent: b.summe_cent, versand_cent: b.versand_cent,
    positionen: JSON.parse(b.positionen).map(({ name, groesse, menge, preis_cent }) => ({ name, groesse, menge, preis_cent })),
  });
}

// Rücktrittsfunktion nach § 13a FAGG („Vertrag widerrufen“ → „Widerruf bestätigen“)
export async function widerrufEinreichen(request, env) {
  let e;
  try { e = await leseJson(request); } catch { return fehler(400, 'Ungültige Anfrage'); }
  const t = (v, max) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
  const w = { name: t(e.name, 120), bestellung: t(e.bestellung, 20).toUpperCase(), email: t(e.email, 200), umfang: e.umfang === 'teil' ? 'teil' : 'ganz', text: t(e.text, 1000) };
  if (!w.name) return fehler(400, 'Bitte deinen Namen angeben');
  if (!w.bestellung) return fehler(400, 'Bitte die Bestellnummer angeben (steht in der Bestätigungs-E-Mail, z. B. GR-7K3M9Q)');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(w.email)) return fehler(400, 'Bitte eine gültige E-Mail-Adresse angeben, an die die Bestätigung gehen soll');
  if (w.umfang === 'teil' && !w.text) return fehler(400, 'Bitte angeben, welche Artikel du zurückgeben möchtest');
  const ip = request.headers.get('cf-connecting-ip') || 'lokal';
  const zaehler = await env.DB.prepare('SELECT anzahl, bis FROM fehlversuche WHERE schluessel=?').bind('widerruf:' + ip).first();
  if (zaehler && zaehler.bis > Date.now() && zaehler.anzahl >= 10) return fehler(429, 'Zu viele Anfragen. Bitte schreib uns an honig.grassler@gmail.com.');
  await env.DB.prepare(`INSERT INTO fehlversuche (schluessel, anzahl, bis) VALUES (?1,1,?2)
    ON CONFLICT(schluessel) DO UPDATE SET anzahl = CASE WHEN bis < ?3 THEN 1 ELSE anzahl + 1 END, bis = CASE WHEN bis < ?3 THEN ?2 ELSE bis END`)
    .bind('widerruf:' + ip, Date.now() + 3600e3, Date.now()).run();
  w.eingang = new Date().toISOString();
  const r = await env.DB.prepare('INSERT INTO widerrufe (name, bestellung, email, umfang, text, eingang) VALUES (?,?,?,?,?,?)')
    .bind(w.name, w.bestellung, w.email, w.umfang, w.text || null, w.eingang).run();
  const ok = await widerrufBestaetigen(env, w, basisUrl(request, env));
  if (ok) await env.DB.prepare('UPDATE widerrufe SET bestaetigung_gesendet=1 WHERE id=?').bind(r.meta.last_row_id).run();
  return json({ ok: true, eingang: w.eingang, bestaetigung_gesendet: ok, ...w });
}
