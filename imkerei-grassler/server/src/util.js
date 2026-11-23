// SPDX-License-Identifier: LicenseRef-AllRightsReserved
// SPDX-FileCopyrightText: 2026 Elija Samuel Friedrich-Ulrich
// Kleine Helfer für Antworten, Zufallswerte und Beträge.

export const json = (daten, status = 200, kopf = {}) =>
  new Response(JSON.stringify(daten), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...kopf },
  });

export const fehler = (status, meldung, extra = {}) => json({ fehler: meldung, ...extra }, status);

export function zufall(bytes = 32) {
  const a = crypto.getRandomValues(new Uint8Array(bytes));
  return [...a].map((b) => b.toString(16).padStart(2, '0')).join('');
}

// Bestellnummer wie GR-7K3M9Q (ohne leicht verwechselbare Zeichen)
export function bestellnummer() {
  const zeichen = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const a = crypto.getRandomValues(new Uint8Array(6));
  return 'GR-' + [...a].map((b) => zeichen[b % zeichen.length]).join('');
}

export async function sha256(text) {
  const d = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(d)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

export const euro = (cent) => (cent / 100).toFixed(2);

export function cookie(request, name) {
  const c = request.headers.get('cookie') || '';
  for (const teil of c.split(';')) {
    const [k, ...v] = teil.trim().split('=');
    if (k === name) return decodeURIComponent(v.join('='));
  }
  return null;
}

export async function leseJson(request, max = 20000) {
  const text = await request.text();
  if (text.length > max) throw new Error('zu gross');
  try { return JSON.parse(text || '{}'); } catch { throw new Error('kein JSON'); }
}

// Öffentliche Adresse des Servers (für Mollie-Rücksprung und Webhook)
export const basisUrl = (request, env) => (env.OEFFENTLICHE_URL || new URL(request.url).origin).replace(/\/$/, '');

export function cors(request, env) {
  const herkunft = request.headers.get('origin');
  if (!herkunft) return {};
  const erlaubt = (env.ERLAUBTE_URSPRUENGE || '').split(',').map((s) => s.trim()).filter(Boolean);
  if (herkunft === new URL(request.url).origin || erlaubt.includes(herkunft)) {
    return { 'access-control-allow-origin': herkunft, 'access-control-allow-methods': 'GET, POST, OPTIONS', 'access-control-allow-headers': 'content-type', vary: 'origin' };
  }
  return {};
}
