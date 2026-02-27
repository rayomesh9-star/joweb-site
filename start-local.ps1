#!/usr/bin/env pwsh
# Start the backend in a new PowerShell window with env vars set for local testing

# Adjust these values if needed
$hostBind = '0.0.0.0'
$publicHost = 'jowebgraphics'
$port = '3000'

Write-Host "Starting backend with PUBLIC_HOST=$publicHost on port $port (bind $hostBind)"

# Build the command string to run in the child PowerShell process. Use PSScriptRoot to resolve path.
$serverPath = "$PSScriptRoot\backend\server.js"
$command = "$env:HOST='$hostBind'; $env:PUBLIC_HOST='$publicHost'; $env:PORT='$port'; node \"$serverPath\""

Start-Process -FilePath 'powershell' -ArgumentList '-NoExit', '-Command', $command -WindowStyle Normal

Write-Host "Launched server in a new PowerShell window. Close that window to stop the server."
