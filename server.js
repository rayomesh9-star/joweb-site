const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
// Bind host for the Express server. Set HOST to the hostname/interface to bind to (e.g. '0.0.0.0' or '127.0.0.1').
const HOST = process.env.HOST || '0.0.0.0';
// PUBLIC_HOST is only used for logging/URLs. Set it to the public hostname you want displayed (e.g. 'jowebgraphics').
const PUBLIC_HOST = process.env.PUBLIC_HOST || 'jowebgraphics';

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

// Admin endpoint: GET /api/logs - return contacts and quotes as JSON
app.get('/api/logs', (req, res) => {
  const contactsFile = path.join(__dirname, 'contacts.log');
  const quotesFile = path.join(__dirname, 'quotes.log');
  
  const readLog = (file) => {
    if (!fs.existsSync(file)) return [];
    return fs.readFileSync(file, 'utf-8')
      .split('\n')
      .filter(line => line.trim())
      .map(line => JSON.parse(line));
  };
  
  res.json({
    contacts: readLog(contactsFile),
    quotes: readLog(quotesFile),
    total: {
      contacts: readLog(contactsFile).length,
      quotes: readLog(quotesFile).length
    }
  });
});

// Admin endpoint: GET /api/logs/export/contacts - download contacts as CSV
app.get('/api/logs/export/contacts', (req, res) => {
  const contactsFile = path.join(__dirname, 'contacts.log');
  if (!fs.existsSync(contactsFile)) {
    return res.status(404).json({ error: 'No contact logs found' });
  }
  
  const entries = fs.readFileSync(contactsFile, 'utf-8')
    .split('\n')
    .filter(line => line.trim())
    .map(line => JSON.parse(line));
  
  if (entries.length === 0) {
    return res.status(404).json({ error: 'No contact entries' });
  }
  
  // Convert to CSV
  const headers = ['name', 'email', 'message', 'timestamp'];
  const rows = entries.map(e => [e.name, e.email, `"${e.message.replace(/"/g, '""')}"`, e.ts]);
  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=contacts.csv');
  res.send(csv);
});

// Admin endpoint: GET /api/logs/export/quotes - download quotes as CSV
app.get('/api/logs/export/quotes', (req, res) => {
  const quotesFile = path.join(__dirname, 'quotes.log');
  if (!fs.existsSync(quotesFile)) {
    return res.status(404).json({ error: 'No quote logs found' });
  }
  
  const entries = fs.readFileSync(quotesFile, 'utf-8')
    .split('\n')
    .filter(line => line.trim())
    .map(line => JSON.parse(line));
  
  if (entries.length === 0) {
    return res.status(404).json({ error: 'No quote entries' });
  }
  
  // Convert to CSV
  const headers = ['name', 'email', 'service', 'details', 'budget', 'timestamp'];
  const rows = entries.map(e => [e.name, e.email, e.service || '', `"${(e.details || '').replace(/"/g, '""')}"`, e.budget || '', e.ts]);
  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=quotes.csv');
  res.send(csv);
});

// Admin dashboard: GET /admin/logs - serve a simple HTML dashboard
app.get('/admin/logs', (req, res) => {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Admin Dashboard — Joeweb Graphics</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #f5f5f5;
      padding: 20px;
    }
    .container { max-width: 1200px; margin: 0 auto; }
    h1 { margin-bottom: 30px; color: #333; }
    .controls { margin-bottom: 20px; display: flex; gap: 10px; flex-wrap: wrap; }
    button {
      padding: 10px 15px;
      background: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
    }
    button:hover { background: #0056b3; }
    button.secondary {
      background: #6c757d;
    }
    button.secondary:hover {
      background: #5a6268;
    }
    .tabs {
      display: flex;
      gap: 10px;
      margin-bottom: 20px;
      border-bottom: 2px solid #ddd;
    }
    .tab-btn {
      padding: 10px 20px;
      background: none;
      border: none;
      cursor: pointer;
      font-size: 16px;
      border-bottom: 3px solid transparent;
      margin-bottom: -2px;
    }
    .tab-btn.active {
      border-bottom-color: #007bff;
      color: #007bff;
    }
    .tab-content { display: none; }
    .tab-content.active { display: block; }
    table {
      width: 100%;
      background: white;
      border-collapse: collapse;
      margin-top: 20px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    th, td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }
    th {
      background: #f8f9fa;
      font-weight: 600;
      color: #333;
    }
    tr:hover { background: #f9f9f9; }
    .empty { text-align: center; padding: 40px 20px; color: #999; }
    .stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }
    .stat-box {
      background: white;
      padding: 20px;
      border-radius: 4px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    .stat-value { font-size: 32px; font-weight: bold; color: #007bff; }
    .stat-label { color: #666; font-size: 14px; margin-top: 5px; }
  </style>
</head>
<body>
  <div class="container">
    <h1>📋 Admin Dashboard — Submissions</h1>
    
    <div class="stats">
      <div class="stat-box">
        <div class="stat-value" id="contactCount">—</div>
        <div class="stat-label">Contact Submissions</div>
      </div>
      <div class="stat-box">
        <div class="stat-value" id="quoteCount">—</div>
        <div class="stat-label">Quote Requests</div>
      </div>
    </div>
    
    <div class="controls">
      <button onclick="loadData()">🔄 Refresh</button>
      <button class="secondary" onclick="exportData('contacts')">📥 Export Contacts (CSV)</button>
      <button class="secondary" onclick="exportData('quotes')">📥 Export Quotes (CSV)</button>
    </div>
    
    <div class="tabs">
      <button class="tab-btn active" onclick="switchTab('contacts')">Contacts</button>
      <button class="tab-btn" onclick="switchTab('quotes')">Quotes</button>
    </div>
    
    <div id="contacts" class="tab-content active">
      <table id="contactsTable">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Message</th>
            <th>Submitted</th>
          </tr>
        </thead>
        <tbody id="contactsBody"></tbody>
      </table>
    </div>
    
    <div id="quotes" class="tab-content">
      <table id="quotesTable">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Service</th>
            <th>Details</th>
            <th>Budget</th>
            <th>Submitted</th>
          </tr>
        </thead>
        <tbody id="quotesBody"></tbody>
      </table>
    </div>
  </div>
  
  <script>
    async function loadData() {
      try {
        const res = await fetch('/api/logs');
        const data = await res.json();
        
        // Update stats
        document.getElementById('contactCount').textContent = data.total.contacts;
        document.getElementById('quoteCount').textContent = data.total.quotes;
        
        // Populate contacts table
        const contactsBody = document.getElementById('contactsBody');
        contactsBody.innerHTML = '';
        if (data.contacts.length === 0) {
          contactsBody.innerHTML = '<tr><td colspan="4" class="empty">No contact submissions yet.</td></tr>';
        } else {
          data.contacts.forEach(c => {
            const row = contactsBody.insertRow();
            row.innerHTML = \`<td>\${c.name}</td><td>\${c.email}</td><td>\${c.message.substring(0, 100)}\${c.message.length > 100 ? '...' : ''}</td><td>\${new Date(c.ts).toLocaleString()}</td>\`;
          });
        }
        
        // Populate quotes table
        const quotesBody = document.getElementById('quotesBody');
        quotesBody.innerHTML = '';
        if (data.quotes.length === 0) {
          quotesBody.innerHTML = '<tr><td colspan="6" class="empty">No quote requests yet.</td></tr>';
        } else {
          data.quotes.forEach(q => {
            const row = quotesBody.insertRow();
            row.innerHTML = \`<td>\${q.name}</td><td>\${q.email}</td><td>\${q.service || '—'}</td><td>\${(q.details || '').substring(0, 50)}\${(q.details || '').length > 50 ? '...' : ''}</td><td>\${q.budget || '—'}</td><td>\${new Date(q.ts).toLocaleString()}</td>\`;
          });
        }
      } catch (err) {
        console.error('Failed to load data:', err);
        alert('Error loading data. See console for details.');
      }
    }
    
    function switchTab(tab) {
      document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
      document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
      document.getElementById(tab).classList.add('active');
      event.target.classList.add('active');
    }
    
    async function exportData(type) {
      const url = \`/api/logs/export/\${type}\`;
      const a = document.createElement('a');
      a.href = url;
      a.click();
    }
    
    // Load on page open
    loadData();
  </script>
</body>
</html>
  `;
  res.send(html);
});

// Fallback to index.html for SPA-like routing
app.get('*', (req, res) => {
  res.sendFile(path.join(staticDir, 'index.html'));
});

app.listen(PORT, HOST, () => {
  console.log(`Backend server running at http://${PUBLIC_HOST}:${PORT}`);
});