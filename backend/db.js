// Simple JSON-based data store
// Data is saved to data.json on disk for persistence
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'data.json');

let data = {
  contacts: [],
  quotes: []
};

// Load data from file if it exists
function load() {
  if (fs.existsSync(dbPath)) {
    try {
      const fileContent = fs.readFileSync(dbPath, 'utf-8');
      data = JSON.parse(fileContent);
    } catch (err) {
      console.warn('Failed to load data.json:', err.message);
    }
  }
}

// Save data to file
function save() {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Failed to save data:', err);
  }
}

// Initialize (async but non-blocking)
async function init() {
  load();
  console.log('Data store initialized');
}

function insertContact(entry) {
  const contact = {
    id: data.contacts.length + 1,
    ...entry
  };
  data.contacts.push(contact);
  save();
  return contact;
}

function insertQuote(entry) {
  const quote = {
    id: data.quotes.length + 1,
    ...entry
  };
  data.quotes.push(quote);
  save();
  return quote;
}

function getContacts() {
  return data.contacts.slice().reverse();  // most recent first
}

function getQuotes() {
  return data.quotes.slice().reverse();  // most recent first
}

module.exports = {
  init,
  insertContact,
  insertQuote,
  getContacts,
  getQuotes
};
