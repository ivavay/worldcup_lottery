import Database from "better-sqlite3";
import bcrypt from "bcryptjs";
import fs from "node:fs";
import path from "node:path";
import type { PrizeTier, TeamPrizeMapping } from "./prize";

export const dbDir = path.join(process.cwd(), "db");
export const dbPath = path.join(dbDir, "database.sqlite");
const globalForDb = globalThis as typeof globalThis & { __worldCupDb?: Database.Database };

function createDatabase() {
  fs.mkdirSync(dbDir, { recursive: true });
  return new Database(dbPath);
}

export type PrizePoolRow = {
  id: number;
  first_prize_total: number;
  second_prize_total: number;
  third_prize_total: number;
  first_prize_remaining: number;
  second_prize_remaining: number;
  third_prize_remaining: number;
  team_mapping: string | null;
  is_configured: number;
  created_at: string;
  updated_at: string;
};

export type SpinSessionRow = {
  id: number;
  session_id: string;
  spin_count: number;
  has_won: number;
  prize_tier: PrizeTier | null;
};

export function getDb() {
  if (!globalForDb.__worldCupDb) {
    globalForDb.__worldCupDb = createDatabase();
    globalForDb.__worldCupDb.pragma("journal_mode = WAL");
    initializeDb(globalForDb.__worldCupDb);
  }
  return globalForDb.__worldCupDb;
}

export function initializeDb(db?: Database.Database) {
  const database = db ?? createDatabase();

  database.exec(`
    CREATE TABLE IF NOT EXISTS admins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS prize_pool (
      id INTEGER PRIMARY KEY DEFAULT 1,
      first_prize_total INTEGER NOT NULL DEFAULT 0,
      second_prize_total INTEGER NOT NULL DEFAULT 0,
      third_prize_total INTEGER NOT NULL DEFAULT 0,
      first_prize_remaining INTEGER NOT NULL DEFAULT 0,
      second_prize_remaining INTEGER NOT NULL DEFAULT 0,
      third_prize_remaining INTEGER NOT NULL DEFAULT 0,
      team_mapping TEXT,
      is_configured INTEGER NOT NULL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS spin_sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id TEXT NOT NULL UNIQUE,
      spin_count INTEGER NOT NULL DEFAULT 0,
      has_won INTEGER NOT NULL DEFAULT 0,
      prize_tier TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  const admin = database.prepare("SELECT id FROM admins WHERE username = ?").get("admin");
  if (!admin) {
    database.prepare("INSERT INTO admins (username, password_hash) VALUES (?, ?)").run(
      "admin",
      bcrypt.hashSync("admin", 10),
    );
  }

  database.prepare("INSERT OR IGNORE INTO prize_pool (id, is_configured, team_mapping) VALUES (1, 0, NULL)").run();

  if (!db) {
    database.close();
  }
}

export function getPrizePool() {
  return getDb().prepare("SELECT * FROM prize_pool WHERE id = 1").get() as PrizePoolRow;
}

export function parseTeamMapping(row: PrizePoolRow) {
  if (!row.team_mapping) return [] as TeamPrizeMapping[];
  return JSON.parse(row.team_mapping) as TeamPrizeMapping[];
}

export function getOrCreateSpinSession(sessionId: string) {
  const db = getDb();
  db.prepare("INSERT OR IGNORE INTO spin_sessions (session_id) VALUES (?)").run(sessionId);
  return db.prepare("SELECT * FROM spin_sessions WHERE session_id = ?").get(sessionId) as SpinSessionRow;
}
