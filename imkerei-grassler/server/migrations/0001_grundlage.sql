-- SPDX-License-Identifier: LicenseRef-AllRightsReserved
-- SPDX-FileCopyrightText: 2026 Elija Samuel Friedrich-Ulrich
CREATE TABLE produkte (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  groesse TEXT NOT NULL,
  kategorie TEXT NOT NULL,          -- rein | waben | misch
  preis_cent INTEGER,               -- NULL = Preis laut Etikett (z. B. große Wabe)
  lager INTEGER,                    -- NULL = nicht mitgezählt
  aktiv INTEGER NOT NULL DEFAULT 1,
  online INTEGER NOT NULL DEFAULT 1, -- auch im Versand bestellbar
  sortierung INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE bestellungen (
  id TEXT PRIMARY KEY,
  token TEXT NOT NULL,
  kanal TEXT NOT NULL,              -- wolfshof | online | vor-ort
  status TEXT NOT NULL,             -- offen | bezahlt | abgebrochen | versendet | erledigt
  summe_cent INTEGER NOT NULL,
  versand_cent INTEGER NOT NULL DEFAULT 0,
  positionen TEXT NOT NULL,         -- JSON
  kunde TEXT,                       -- JSON, nur bei Versand
  mollie_id TEXT,
  terminal_id TEXT,
  notiz TEXT,
  lager_abgezogen INTEGER NOT NULL DEFAULT 0,
  erstellt TEXT NOT NULL DEFAULT (datetime('now')),
  bezahlt_am TEXT
);
CREATE INDEX bestellungen_mollie ON bestellungen(mollie_id);
CREATE INDEX bestellungen_erstellt ON bestellungen(erstellt);
CREATE TABLE passkeys (
  id TEXT PRIMARY KEY,
  public_key TEXT NOT NULL,         -- base64url
  zaehler INTEGER NOT NULL DEFAULT 0,
  transports TEXT,
  name TEXT NOT NULL,
  erstellt TEXT NOT NULL DEFAULT (datetime('now')),
  zuletzt TEXT
);
CREATE TABLE sitzungen (
  hash TEXT PRIMARY KEY,
  passkey_id TEXT,
  ablauf INTEGER NOT NULL
);
CREATE TABLE challenges (
  challenge TEXT PRIMARY KEY,
  art TEXT NOT NULL,
  ablauf INTEGER NOT NULL
);
CREATE TABLE fehlversuche (
  schluessel TEXT PRIMARY KEY,
  anzahl INTEGER NOT NULL,
  bis INTEGER NOT NULL
);
