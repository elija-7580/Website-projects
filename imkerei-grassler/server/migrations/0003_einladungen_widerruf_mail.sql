-- SPDX-License-Identifier: LicenseRef-AllRightsReserved
-- SPDX-FileCopyrightText: 2026 Elija Samuel Friedrich-Ulrich
-- Einladungslinks für Passkeys, Widerrufe nach § 13a FAGG, Protokoll der verschickten E-Mails.
CREATE TABLE einladungen (
  hash TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  ablauf INTEGER NOT NULL,
  erstellt TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE widerrufe (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  bestellung TEXT NOT NULL,
  email TEXT NOT NULL,
  umfang TEXT NOT NULL,             -- ganz | teil
  text TEXT,
  eingang TEXT NOT NULL,            -- ISO-Zeitpunkt (UTC)
  bestaetigung_gesendet INTEGER NOT NULL DEFAULT 0,
  bearbeitet INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE mails (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  art TEXT NOT NULL,
  an TEXT NOT NULL,
  betreff TEXT NOT NULL,
  ok INTEGER NOT NULL,
  fehler TEXT,
  erstellt TEXT NOT NULL DEFAULT (datetime('now'))
);
ALTER TABLE bestellungen ADD COLUMN bestaetigt INTEGER NOT NULL DEFAULT 0;
