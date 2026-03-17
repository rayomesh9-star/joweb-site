// PostgreSQL-based data store
const { Pool } = require('pg');

// Create connection pool - uses environment variables or defaults
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 
    'postgresql://postgres:postgres@localhost:5432/joweb',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

let isInitialized = false;

// Initialize database tables
async function init() {
  if (isInitialized) return;
  
  try {
    // Create contacts table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS contacts (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        message TEXT,
        ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create quotes table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS quotes (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        service VARCHAR(255),
        details TEXT,
        budget VARCHAR(100),
        ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    isInitialized = true;
    console.log('PostgreSQL database initialized');
  } catch (err) {
    console.error('Database initialization error:', err.message);
  }
}

async function insertContact(entry) {
  const result = await pool.query(
    'INSERT INTO contacts (name, email, message) VALUES ($1, $2, $3) RETURNING *',
    [entry.name, entry.email, entry.message]
  );
  return result.rows[0];
}

async function insertQuote(entry) {
  const result = await pool.query(
    'INSERT INTO quotes (name, email, service, details, budget) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [entry.name, entry.email, entry.service, entry.details, entry.budget || '']
  );
  return result.rows[0];
}

async function getContacts() {
  const result = await pool.query('SELECT * FROM contacts ORDER BY id DESC');
  return result.rows;
}

async function getQuotes() {
  const result = await pool.query('SELECT * FROM quotes ORDER BY id DESC');
  return result.rows;
}

module.exports = {
  init,
  insertContact,
  insertQuote,
  getContacts,
  getQuotes
};
