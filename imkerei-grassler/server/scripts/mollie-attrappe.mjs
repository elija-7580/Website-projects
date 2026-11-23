// SPDX-License-Identifier: LicenseRef-AllRightsReserved
// SPDX-FileCopyrightText: 2026 Elija Samuel Friedrich-Ulrich
// Nur für lokale Tests: tut so, als wäre es die Mollie-Schnittstelle.
import http from 'node:http';
const zahlungen = new Map();
let n = 0;
const port = Number(process.env.PORT || 8790);
let m0;
http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://127.0.0.1:${port}`);
  const body = await new Promise((r) => { let d = ''; req.on('data', (c) => (d += c)); req.on('end', () => r(d)); });
  const send = (s, o) => { res.writeHead(s, { 'content-type': 'application/json' }); res.end(JSON.stringify(o)); };
  if (url.pathname === '/__status') { const z = zahlungen.get(url.searchParams.get('id')); if (z) z.status = url.searchParams.get('s'); return send(200, z || {}); }
  if ((m0 = url.pathname.match(/^\/kasse\/(tr_\w+)$/))) { const z = zahlungen.get(m0[1]); if (!z) return send(404, {}); if (url.searchParams.get('s')) { z.status = url.searchParams.get('s'); res.writeHead(302, { location: z.redirectUrl || '/' }); return res.end(); } res.writeHead(200, { 'content-type': 'text/html' }); return res.end(`<h1>Mollie-Testkasse</h1><p>${z.amount.value} EUR · ${z.description}</p><a id="bezahlt" href="?s=paid">Bezahlt</a> <a id="abbruch" href="?s=canceled">Abbrechen</a>`); }
  if (!String(req.headers.authorization || '').startsWith('Bearer test_')) return send(401, { title: 'Unauthorized', detail: 'Missing auth' });
  if (req.method === 'POST' && url.pathname === '/v2/payments') {
    const d = JSON.parse(body);
    if (!d.amount?.value || !d.description) return send(422, { detail: 'amount fehlt' });
    const id = 'tr_test' + (++n);
    const z = { resource: 'payment', id, status: 'open', amount: d.amount, description: d.description, method: d.method || null, metadata: d.metadata, redirectUrl: d.redirectUrl,
      _links: { checkout: d.method === 'pointofsale' ? undefined : { href: `http://127.0.0.1:${port}/kasse/${id}` }, changePaymentState: d.method === 'pointofsale' ? { href: `http://127.0.0.1:${port}/kasse/${id}` } : undefined } };
    zahlungen.set(id, z); console.log('ANGELEGT', id, d.amount.value, d.description, d.method || '', d.terminalId || ''); return send(201, z);
  }
  let m;
  if ((m = url.pathname.match(/^\/v2\/payments\/(tr_\w+)$/))) {
    const z = zahlungen.get(m[1]); if (!z) return send(404, { detail: 'nicht gefunden' });
    if (req.method === 'DELETE') { z.status = 'canceled'; return send(200, z); }
    return send(200, z);
  }
  if (url.pathname === '/v2/terminals') return send(200, { count: 1, _embedded: { terminals: [{ id: 'term_test1', description: 'Mollie Tap (Test)', status: 'active', brand: 'Mollie', model: 'Tap' }] } });
  send(404, { detail: 'unbekannt' });
}).listen(port, () => console.log('Mollie-Attrappe auf', port));
