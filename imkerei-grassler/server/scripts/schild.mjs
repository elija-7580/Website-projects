// SPDX-License-Identifier: LicenseRef-AllRightsReserved
// SPDX-FileCopyrightText: 2026 Elija Samuel Friedrich-Ulrich
// Setzt den QR-Code auf dem Hütten-Schild (website/wolfshof-schild.html) auf eine neue Adresse.
// Aufruf von Hand: node scripts/schild.mjs https://imkerei-grassler.at/wolfshof
// QR-Erzeugung mit „uqr“ (MIT-Lizenz, https://github.com/unjs/uqr).

import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { encode } from 'uqr';

const SCHILD = join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'website', 'wolfshof-schild.html');

export function qrSvg(text) {
  const { data, size } = encode(text, { ecc: 'M', border: 2 });
  let pfad = '';
  data.forEach((zeile, y) => zeile.forEach((an, x) => { if (an) pfad += `M${x} ${y}h1v1h-1z`; }));
  return `<svg class="qr" role="img" aria-label="QR-Code zur Bezahlseite" data-ziel="${text}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" shape-rendering="crispEdges"><rect width="${size}" height="${size}" fill="#fffaf0"/><path fill="#3a2410" d="${pfad}"/></svg>`;
}

export function schildAktualisieren(ziel) {
  const alt = readFileSync(SCHILD, 'utf8');
  if (alt.includes(`data-ziel="${ziel}"`)) return false;
  const neu = alt.replace(/<svg class="qr"[\s\S]*?<\/svg>/, qrSvg(ziel));
  if (neu === alt) throw new Error('QR-Code im Schild nicht gefunden');
  writeFileSync(SCHILD, neu);
  return true;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const ziel = process.argv[2];
  if (!/^https:\/\/\S+$/.test(ziel || '')) { console.error('Aufruf: node scripts/schild.mjs https://…/wolfshof'); process.exit(1); }
  console.log(schildAktualisieren(ziel) ? `QR-Code zeigt jetzt auf ${ziel}` : 'QR-Code war schon aktuell');
}
