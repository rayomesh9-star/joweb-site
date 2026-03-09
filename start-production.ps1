#!/usr/bin/env pwsh
# Start the backend in production mode with www.joewebgraphics.com

Write-Host "🚀 Starting Joeweb Graphics PRODUCTION server..."
Write-Host "Domain: www.joewebgraphics.com:3000"
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

Set-Location "$PSScriptRoot\backend"
# build a path variable and use it when launching the server
node (Join-Path $PWD 'server.js')
