// SPDX-License-Identifier: LicenseRef-AllRightsReserved
// SPDX-FileCopyrightText: 2026 Elija Samuel Friedrich-Ulrich
// E-Mails: Bestellbestätigung, Nachricht an die Imkerei, Eingangsbestätigung für Widerrufe.
// Versandweg: Cloudflare Email Service (Binding EMAIL) oder Resend (RESEND_API_KEY). Ohne beides wird nur protokolliert.

import { euro } from './util.js';

const absender = (env) => env.MAIL_ABSENDER || 'Imkerei Grassler <bestellung@imkerei-grassler.at>';
export const imkereiAdresse = (env) => env.MAIL_IMKEREI || 'honig.grassler@gmail.com';
const betrag = (c) => euro(c).replace('.', ',') + ' €';

function zerlege(adresse) {
  const m = String(adresse).match(/^\s*(.*?)\s*<([^>]+)>\s*$/);
  return m ? { name: m[1], email: m[2] } : { name: '', email: String(adresse).trim() };
}

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
function alsHtml(text) {
  return `<!doctype html><html lang="de"><body style="font-family:Georgia,serif;color:#3a2410;background:#f6eccb;padding:24px">
<div style="max-width:560px;margin:0 auto;background:#fffaf0;padding:28px;border-top:6px solid #efa51a">
${text.split('\n\n').map((absatz) => `<p style="font-size:16px;line-height:1.5;margin:0 0 14px">${esc(absatz).replace(/\n/g, '<br>')}</p>`).join('')}
</div></body></html>`;
}

export async function senden(env, { art, an, betreff, text, antwortAn }) {
  let ok = false, fehler = null;
  try {
    const von = zerlege(absender(env));
    if (env.EMAIL?.send) {
      await env.EMAIL.send({ to: [{ email: an }], from: von, subject: betreff, text, html: alsHtml(text) });
      ok = true;
    } else if (env.RESEND_API_KEY) {
      const r = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { authorization: `Bearer ${env.RESEND_API_KEY}`, 'content-type': 'application/json' },
        body: JSON.stringify({ from: absender(env), to: [an], subject: betreff, text, html: alsHtml(text), ...(antwortAn ? { reply_to: antwortAn } : {}) }),
      });
      ok = r.ok;
      if (!ok) fehler = `Resend ${r.status}: ${(await r.text()).slice(0, 200)}`;
    } else {
      fehler = 'Kein Mailversand eingerichtet';
      console.log('MAIL (nicht verschickt)', an, betreff, '\n' + text);
    }
  } catch (err) { fehler = String(err?.message || err).slice(0, 200); }
  await env.DB.prepare('INSERT INTO mails (art, an, betreff, ok, fehler) VALUES (?,?,?,?,?)').bind(art, an, betreff, ok ? 1 : 0, fehler).run();
  return ok;
}

const positionenText = (b) => JSON.parse(b.positionen).map((p) => `${p.menge} × ${p.name}${p.groesse ? ' ' + p.groesse : ''} à ${betrag(p.preis_cent)}`).join('\n');

export async function bestellungBestaetigen(env, b, basis) {
  const k = JSON.parse(b.kunde || '{}');
  const text = `Servus ${k.name || ''},

danke für deine Bestellung bei der Imkerei Grassler! Die Zahlung ist bei uns angekommen.

Bestellnummer: ${b.id}

${positionenText(b)}
Versand: ${b.versand_cent ? betrag(b.versand_cent) : 'gratis'}
Gesamt: ${betrag(b.summe_cent)}

Lieferadresse:
${k.name}
${k.strasse}
${k.plz} ${k.ort}

Wir packen deinen Honig ein und schicken ihn dir per Post.

Rücktrittsrecht: Du kannst innerhalb von 14 Tagen ab Erhalt der Ware ohne Angabe von Gründen vom Vertrag zurücktreten. Am einfachsten geht das online über „Vertrag widerrufen“: ${basis}/widerruf.html?b=${b.id}
Die vollständige Widerrufsbelehrung und das Muster-Widerrufsformular findest du unter ${basis}/widerruf.html, unsere AGB unter ${basis}/agb.html.

Imkerei Grassler · Thiemo und Christoph Grassler
Am Mühlkamp 30, 3492 Walkersdorf am Kamp
honig.grassler@gmail.com · 0677 627 518 13`;
  return senden(env, { art: 'bestellung', an: k.email, betreff: `Deine Bestellung ${b.id} bei der Imkerei Grassler`, text, antwortAn: imkereiAdresse(env) });
}

export async function imkereiBenachrichtigen(env, b, basis) {
  const k = b.kunde ? JSON.parse(b.kunde) : null;
  const text = `Neue bezahlte Bestellung ${b.id} (${b.kanal === 'online' ? 'Versand' : b.kanal}).

${positionenText(b)}
${b.versand_cent ? 'Versand: ' + betrag(b.versand_cent) + '\n' : ''}Gesamt: ${betrag(b.summe_cent)}
${k ? `\nSchicken an:\n${k.name}\n${k.strasse}\n${k.plz} ${k.ort}\n${k.email}${k.telefon ? ' · ' + k.telefon : ''}${k.notiz ? '\nAnmerkung: ' + k.notiz : ''}\n` : ''}
Alle Bestellungen: ${basis}/verwaltung`;
  return senden(env, { art: 'imkerei', an: imkereiAdresse(env), betreff: `Neue Bestellung ${b.id} · ${betrag(b.summe_cent)}`, text, antwortAn: k?.email });
}

export async function widerrufBestaetigen(env, w, basis) {
  const zeit = new Date(w.eingang).toLocaleString('de-AT', { timeZone: 'Europe/Vienna', dateStyle: 'long', timeStyle: 'medium' });
  const text = `Servus ${w.name},

wir haben deinen Widerruf erhalten.

Eingegangen am: ${zeit} (österreichische Zeit)
Bestellnummer: ${w.bestellung}
Umfang: ${w.umfang === 'teil' ? 'Teilweiser Widerruf' : 'Ganze Bestellung'}
${w.text ? 'Deine Angaben: ' + w.text + '\n' : ''}
Wir melden uns bei dir, wie die Rücksendung abläuft. Das Geld bekommst du spätestens 14 Tage nach Eingang deines Widerrufs zurück, wir dürfen damit aber warten, bis die Ware wieder bei uns ist oder du die Rücksendung nachgewiesen hast.

Imkerei Grassler · Am Mühlkamp 30, 3492 Walkersdorf am Kamp · honig.grassler@gmail.com
${basis}`;
  const ok = await senden(env, { art: 'widerruf', an: w.email, betreff: `Eingangsbestätigung Widerruf ${w.bestellung}`, text, antwortAn: imkereiAdresse(env) });
  await senden(env, { art: 'imkerei', an: imkereiAdresse(env), betreff: `Widerruf zu ${w.bestellung}`, text: `Widerruf eingegangen (${zeit}).\n\nName: ${w.name}\nE-Mail: ${w.email}\nBestellung: ${w.bestellung}\nUmfang: ${w.umfang}\n${w.text || ''}\n\n${basis}/verwaltung`, antwortAn: w.email });
  return ok;
}
