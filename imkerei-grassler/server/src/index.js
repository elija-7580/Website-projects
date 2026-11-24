// SPDX-License-Identifier: LicenseRef-AllRightsReserved
// SPDX-FileCopyrightText: 2026 Elija Samuel Friedrich-Ulrich
// Einstieg: /api/* für Website und Verwaltung, /verwaltung für Thiemo, alles andere ist die statische Website.

import { json, fehler, cors } from './util.js';
import { produkteOeffentlich, zahlungStarten, webhook, bestellStatus, widerrufEinreichen } from './bestellung.js';
import { verwaltungApi } from './verwaltung.js';
import seite from './static/verwaltung.html';
import app from './static/verwaltung.app.txt';
import webauthnBrowser from '../node_modules/@simplewebauthn/browser/dist/bundle/index.umd.min.js';

const SICHERHEIT = {
  'x-content-type-options': 'nosniff',
  'referrer-policy': 'same-origin',
  'x-frame-options': 'DENY',
  'permissions-policy': 'camera=(), microphone=(), geolocation=()',
};
const CSP_VERWALTUNG = "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'";

function mitKopf(antwort, kopf) {
  const r = new Response(antwort.body, antwort);
  for (const [k, v] of Object.entries(kopf)) r.headers.set(k, v);
  return r;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const p = url.pathname;
    try {
      if (p === '/verwaltung' || p === '/verwaltung/') {
        return new Response(seite, { headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store', 'content-security-policy': CSP_VERWALTUNG, ...SICHERHEIT } });
      }
      if (p === '/verwaltung/app.js') return new Response(app, { headers: { 'content-type': 'text/javascript; charset=utf-8', 'cache-control': 'no-store', ...SICHERHEIT } });
      if (p === '/verwaltung/webauthn.js') return new Response(webauthnBrowser, { headers: { 'content-type': 'text/javascript; charset=utf-8', 'cache-control': 'public, max-age=86400', ...SICHERHEIT } });

      if (p.startsWith('/api/verwaltung/')) return mitKopf(await verwaltungApi(request, env, p.slice('/api/verwaltung/'.length)), SICHERHEIT);

      if (p.startsWith('/api/')) {
        const c = cors(request, env);
        if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: { ...c, 'access-control-max-age': '86400' } });
        let antwort;
        if (p === '/api/produkte' && request.method === 'GET') antwort = await produkteOeffentlich(env);
        else if (p === '/api/zahlung' && request.method === 'POST') antwort = await zahlungStarten(request, env);
        else if (p === '/api/bestellung' && request.method === 'GET') antwort = await bestellStatus(request, env);
        else if (p === '/api/mollie/webhook' && request.method === 'POST') return await webhook(request, env);
        else if (p === '/api/widerruf' && request.method === 'POST') antwort = await widerrufEinreichen(request, env);
        else if (p === '/api/gesund') antwort = json({ ok: true });
        else antwort = fehler(404, 'Nicht gefunden');
        return mitKopf(antwort, { ...c, ...SICHERHEIT });
      }
      return env.ASSETS.fetch(request);
    } catch (err) {
      console.error(err);
      return fehler(500, 'Da ist etwas schiefgelaufen');
    }
  },
};
