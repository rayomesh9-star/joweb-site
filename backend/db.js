// SQLite via sql.js (WebAssembly) - pure JS, no native build required
// database file will be stored as data.sqlite in this directory
const fs = require('fs');
const path = require('path');
const initSqlJs = require('sql.js');

const dbPath = path.join(__dirname, 'data.sqlite');
let db;

// Initialize database, returning a promise that resolves when ready
async function init() {
  const SQL = await initSqlJs({ locateFile: file => path.join(__dirname, 'node_modules', 'sql.js', 'dist', file) });
  if (fs.existsSync(dbPath)) {
    const filebuffer = fs.readFileSync(dbPath);
    db = new SQL.Database(filebuffer);
  } else {
    db = new SQL.Database();
    db.run(`
      CREATE TABLE contacts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        message TEXT NOT NULL,
        ts TEXT NOT NULL
      );
      CREATE TABLE quotes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        service TEXT,
        details TEXT,
        budget TEXT,
        ts TEXT NOT NULL
      );
    `);
    save();
  }
}

function save() {
  if (!db) return;
  const data = db.export();
  fs.writeFileSync(dbPath, Buffer.from(data));
}

function insertContact(entry) {
  if (!db) return;
  const stmt = db.prepare('INSERT INTO contacts (name,email,message,ts) VALUES (?,?,?,?)');
  stmt.run([entry.name, entry.email, entry.message, entry.ts]);
  save();
}

function insertQuote(entry) {
  if (!db) return;
  const stmt = db.prepare('INSERT INTO quotes (name,email,service,details,budget,ts) VALUES (?,?,?,?,?,?)');
  stmt.run([entry.name, entry.email, entry.service || '', entry.details || '', entry.budget || '', entry.ts]);
  save();
}

function getContacts() {
  if (!db) return [];
  const stmt = db.prepare('SELECT id,name,email,message,ts FROM contacts ORDER BY id DESC');
  const arr = [];
  while (stmt.step()) {
    arr.push(stmt.getAsObject());
  }
  return arr;
}

function getQuotes() {
  if (!db) return [];
  const stmt = db.prepare('SELECT id,name,email,service,details,budget,ts FROM quotes ORDER BY id DESC');
  const arr = [];
  while (stmt.step()) {
    arr.push(stmt.getAsObject());
  }
  return arr;
}

module.exports = {
  init,
  insertContact,
  insertQuote,
  getContacts,
  getQuotes
};
