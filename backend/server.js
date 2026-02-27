const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
// Bind host for the Express server. Set HOST to the hostname/interface to bind to (e.g. '0.0.0.0' or '127.0.0.1').
const HOST = process.env.HOST || '0.0.0.0';
// PUBLIC_HOST is only used for logging/URLs. Set it to the public hostname you want displayed (e.g. 'jowebgraphics').
const PUBLIC_HOST = process.env.PUBLIC_HOST || 'joewebgraphics';

app.use(express.json());

// Serve static front-end files from the Front end folder
const staticDir = path.join(__dirname, '../Front end');
app.use(express.static(staticDir));

// Helpers to append entries to log files (non-blocking)
function appendEntry(file, entry) {
  const line = JSON.stringify(entry) + '\n';
  fs.appendFile(file, line, (err) => {
    if (err) console.error('Failed to write to', file, err);
  });
}

// Contact endpoint - respond immediately, write async
app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email and message are required.' });
  }
  // Respond immediately
  res.json({ status: 'ok' });
  // Write to file in background (non-blocking)
  const entry = { name, email, message, ts: new Date().toISOString() };
  appendEntry(path.join(__dirname, 'contacts.log'), entry);
});

// Quote endpoint - respond immediately, write async
app.post('/api/quote', (req, res) => {
  const { name, email, service, details, budget } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required.' });
  }
  // Respond immediately
  res.json({ status: 'ok' });
  // Write to file in background (non-blocking)
  const entry = { name, email, service, details, budget, ts: new Date().toISOString() };
  appendEntry(path.join(__dirname, 'quotes.log'), entry);
});

// Fallback to index.html for SPA-like routing
app.get('*', (req, res) => {
  res.sendFile(path.join(staticDir, 'index.html'));
});

app.listen(PORT, HOST, () => {
  console.log(`Backend server running at http://${PUBLIC_HOST}:${PORT}`);
});