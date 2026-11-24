// SPDX-License-Identifier: LicenseRef-AllRightsReserved
// SPDX-FileCopyrightText: 2026 Elija Samuel Friedrich-Ulrich
// Notfall oder Domain-Umzug: löscht alle Passkeys und Sitzungen und setzt einen neuen Einrichtungscode.
// Aufruf: npm run zugang:zuruecksetzen

import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomBytes } from 'node:crypto';
import readline from 'node:readline/promises';

const SERVER = join(dirname(fileURLToPath(import.meta.url)), '..');
const w = (args, input) => spawnSync('npx', ['wrangler', ...args], { cwd: SERVER, encoding: 'utf8', input, stdio: input !== undefined ? ['pipe', 'pipe', 'pipe'] : 'inherit' });

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const ja = (await rl.question('Alle Passkeys löschen? Danach kann sich niemand mehr anmelden, bis neu eingerichtet ist. (ja/nein) ')).trim().toLowerCase();
rl.close();
if (ja !== 'ja') { console.log('Abgebrochen.'); process.exit(0); }

const sql = w(['d1', 'execute', 'DB', '--remote', '--command', 'DELETE FROM passkeys; DELETE FROM sitzungen; DELETE FROM einladungen; DELETE FROM fehlversuche;']);
if (sql.status !== 0) process.exit(1);
const code = randomBytes(15).toString('base64url');
const s = w(['secret', 'put', 'EINRICHTUNGSCODE'], code + '\n');
if (s.status !== 0) { console.error(s.stdout + s.stderr); process.exit(1); }
const cfg = readFileSync(join(SERVER, 'wrangler.jsonc'), 'utf8');
const url = cfg.match(/"OEFFENTLICHE_URL":\s*"([^"]+)"/)?.[1] || 'https://<deine-adresse>.workers.dev';
console.log(`\nErledigt. Ersten Passkey neu anlegen:\n  ${url}/verwaltung#code=${code}\n`);
