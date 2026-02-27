# Joweb Graphics — Local run & host mapping

This repository contains the front-end (in `Front end/`) and a simple Node/Express backend (in `backend/`).

If you want to access the site locally using the hostname `jowebgraphics` (instead of `localhost`), follow the instructions below.

## 1) Make the name `jowebgraphics` resolve to this machine

### On Windows (single-machine development)
1. Open Notepad as Administrator.
2. Open the file `C:\Windows\System32\drivers\etc\hosts`.
3. Add this line at the end of the file and save:

```
127.0.0.1   jowebgraphics
```

Now `http://jowebgraphics:3000` will point to your local machine.

### On another device in your LAN
1. Find your machine IP (e.g., `192.168.1.42`).
2. Add the mapping on the client device's hosts file:

```
192.168.1.42   jowebgraphics
```

Or create a DNS record for `jowebgraphics` on your local DNS server.

## 2) Install backend dependencies (one-time)
Open PowerShell and run:

```powershell
cd "c:\Users\Administrator\Joweb-webites\backend"
npm.cmd install
```

## 3) Start the backend using the provided helper script
The repository includes `start-local.ps1` which starts the backend in a new PowerShell window with environment variables set so the server logs the public host as `jowebgraphics`.

From the repo root run (PowerShell):

```powershell
.\start-local.ps1
```

Or run the commands manually:

```powershell
$env:HOST='0.0.0.0'
$env:PUBLIC_HOST='jowebgraphics'
$env:PORT='3000'
node .\backend\server.js
```

## 4) Open the site

Visit `http://jowebgraphics:3000` in your browser. The front-end uses relative API paths (`/api/contact`, `/api/quote`), so it will talk to the backend on the same origin.

## Notes
- If you want the site to be available without a port number, run on port `80` (may require elevated privileges) or put a reverse proxy (nginx/Caddy) in front.
- For production, create a real DNS A record pointing to your public IP and set `PUBLIC_HOST` to the real domain.

If you want, I can also add a `.bat` variant or a `start-local` npm script — tell me which you prefer.
