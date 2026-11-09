
const Database = require("better-sqlite3");
const path = require("path");

const db = new Database(
    path.join(__dirname, "zyra-tech.db")
);

db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

// REVIEWS TABLE
db.exec(`
    CREATE TABLE IF NOT EXISTS reviews (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        company TEXT,
        designation TEXT,
        rating INTEGER NOT NULL CHECK(rating BETWEEN 1 AND 5),
        review TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
`);

// CONTACT INQUIRIES TABLE
db.exec(`
    CREATE TABLE IF NOT EXISTS contacts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        service TEXT NOT NULL,
        budget TEXT,
        details TEXT NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
`);

// FREELANCER APPLICATIONS TABLE
db.exec(`
    CREATE TABLE IF NOT EXISTS freelancers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        full_name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT NOT NULL,
        location TEXT,
        profile_photo TEXT,
        profession TEXT NOT NULL,
        experience TEXT,
        skills TEXT NOT NULL,
        bio TEXT NOT NULL,
        portfolio TEXT,
        github TEXT,
        linkedin TEXT,
        work_samples TEXT,
        availability TEXT,
        work_mode TEXT,
        status TEXT NOT NULL DEFAULT 'pending',
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
`);

module.exports = db;
