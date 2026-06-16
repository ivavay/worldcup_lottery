import { dbPath, initializeDb } from "../src/lib/db";

initializeDb();
console.log(`SQLite database initialized at ${dbPath}`);
