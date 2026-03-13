#!/usr/bin/env pwsh
# Start the backend in production mode with www.joewebgraphics.com

Write-Host "🚀 Starting Joweb PRODUCTION server..."
Write-Host "Domain: www.joewebgraphics.com"
Write-Host ""

# Kill any existing node processes
taskkill /IM node.exe /F 2>$null
Start-Sleep -Milliseconds 500

# Start the server with production settings
$env:HOST='0.0.0.0'
$env:PUBLIC_HOST='www.joewebgraphics.com'
$env:PORT='3000'
Write-Host "Starting Node.js server..."
Write-Host "Press Ctrl+C to stop the server"
Write-Host ""

# Navigate to the backend directory before starting the server
Set-Location -Path "C:\Users\Administrator\Joweb-webites\backend"

# Start the server
node server.js
