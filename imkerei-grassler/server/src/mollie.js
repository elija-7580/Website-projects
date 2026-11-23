// SPDX-License-Identifier: LicenseRef-AllRightsReserved
// SPDX-FileCopyrightText: 2026 Elija Samuel Friedrich-Ulrich
// Verbindung zur Mollie-Schnittstelle (Payments API v2, Terminals API).

const basis = (env) => (env.MOLLIE_API_BASE || 'https://api.mollie.com/v2').replace(/\/$/, '');

export class MollieFehler extends Error {
  constructor(status, daten) {
    super(daten?.detail || daten?.title || `Mollie antwortet mit ${status}`);
    this.status = status;
    this.daten = daten;
  }
}

async function anfrage(env, pfad, { methode = 'GET', daten } = {}) {
  if (!env.MOLLIE_API_KEY) throw new MollieFehler(503, { detail: 'Mollie-Schlüssel fehlt (MOLLIE_API_KEY)' });
  const antwort = await fetch(basis(env) + pfad, {
    method: methode,
    headers: { authorization: `Bearer ${env.MOLLIE_API_KEY}`, 'content-type': 'application/json' },
    body: daten ? JSON.stringify(daten) : undefined,
  });
  const text = await antwort.text();
  let inhalt = null;
  try { inhalt = text ? JSON.parse(text) : null; } catch { inhalt = { detail: text.slice(0, 200) }; }
  if (!antwort.ok) throw new MollieFehler(antwort.status, inhalt);
  return inhalt;
}

export const testmodus = (env) => String(env.MOLLIE_API_KEY || '').startsWith('test_');

export function zahlungAnlegen(env, { betragCent, beschreibung, rueckUrl, webhookUrl, bestellung, terminalId }) {
  const daten = {
    amount: { currency: 'EUR', value: (betragCent / 100).toFixed(2) },
    description: beschreibung.slice(0, 255),
    redirectUrl: rueckUrl,
    metadata: { bestellung },
    locale: 'de_AT',
  };
  // Mollie ruft den Webhook nur über das öffentliche Internet auf
  if (webhookUrl && !/\/\/(localhost|127\.|\[::1\])/.test(webhookUrl)) daten.webhookUrl = webhookUrl;
  if (terminalId) {
    daten.method = 'pointofsale';
    daten.terminalId = terminalId;
    delete daten.redirectUrl;
  }
  return anfrage(env, '/payments', { methode: 'POST', daten });
}

export const zahlungHolen = (env, id) => anfrage(env, `/payments/${encodeURIComponent(id)}`);

export const zahlungAbbrechen = (env, id) => anfrage(env, `/payments/${encodeURIComponent(id)}`, { methode: 'DELETE' });

export async function geraeteListe(env) {
  const r = await anfrage(env, '/terminals?limit=50');
  return (r?._embedded?.terminals || []).map((t) => ({
    id: t.id, beschreibung: t.description || t.serialNumber || t.id, status: t.status, marke: t.brand, modell: t.model,
  }));
}

// Mollie-Status in unseren Bestellstatus übersetzen
export function statusAusMollie(s) {
  if (s === 'paid' || s === 'authorized') return 'bezahlt';
  if (s === 'canceled' || s === 'expired' || s === 'failed') return 'abgebrochen';
  return 'offen';
}
