#!/usr/bin/env pwsh
# View backend submission logs with options to format, search, and export

param(
    [ValidateSet('contacts', 'quotes', 'all')]
    [string]$Type = 'all',
    
    [int]$Last = 0,  # 0 = show all, > 0 = show last N entries
    
    [string]$Search = '',  # Search for a string in the logs
    
    [ValidateSet('table', 'json', 'list')]
    [string]$Format = 'table',
    
    [switch]$ExportCsv  # Export to CSV file
)

$contactsFile = "$PSScriptRoot\backend\contacts.log"
$quotesFile = "$PSScriptRoot\backend\quotes.log"

function Read-LogFile {
    param([string]$FilePath)
    
    if (-not (Test-Path $FilePath)) {
        return @()
    }
    
    $lines = @(Get-Content $FilePath)
    $entries = $lines | Where-Object { $_ -match '\S' } | ForEach-Object { ConvertFrom-Json -InputObject $_ }
    return $entries
}

function Show-Entries {
    param(
        [object[]]$Entries,
        [string]$Label
    )
    
    if ($Entries.Count -eq 0) {
        Write-Host "`n[$Label] No entries found.`n" -ForegroundColor Yellow
        return
    }
    
    Write-Host "`n=== $Label ($($Entries.Count) total) ===`n" -ForegroundColor Cyan
    
    if ($Search) {
        $Entries = $Entries | Where-Object { $_ | ConvertTo-Json | Select-String $Search }
        if ($Entries.Count -eq 0) {
            Write-Host "No matching entries for search: '$Search'" -ForegroundColor Yellow
            return
        }
        Write-Host "(Filtered by: '$Search')`n" -ForegroundColor Gray
    }
    
    if ($Last -gt 0) {
        $Entries = $Entries | Select-Object -Last $Last
    }
    
    switch ($Format) {
        'table' {
            $Entries | Format-Table -AutoSize
        }
        'json' {
            $Entries | ConvertTo-Json -Depth 10 | Write-Host
        }
        'list' {
            $Entries | Format-List
        }
    }
}

function Export-ToCsv {
    param(
        [object[]]$Entries,
        [string]$Type
    )
    
    if ($Entries.Count -eq 0) {
        Write-Host "No entries to export." -ForegroundColor Yellow
        return
    }
    
    $timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
    $fileName = "$PSScriptRoot\${Type}_export_${timestamp}.csv"
    
    $Entries | Export-Csv -Path $fileName -NoTypeInformation
    Write-Host "`nExported to: $fileName" -ForegroundColor Green
}

# Main logic
$contacts = Read-LogFile $contactsFile
$quotes = Read-LogFile $quotesFile

if ($Type -eq 'contacts' -or $Type -eq 'all') {
    Show-Entries $contacts "CONTACTS"
    if ($ExportCsv -and $contacts.Count -gt 0) {
        Export-ToCsv $contacts 'contacts'
    }
}

if ($Type -eq 'quotes' -or $Type -eq 'all') {
    Show-Entries $quotes "QUOTES"
    if ($ExportCsv -and $quotes.Count -gt 0) {
        Export-ToCsv $quotes 'quotes'
    }
}

Write-Host "`nUsage examples:" -ForegroundColor Green
Write-Host "  .\view-logs.ps1 -Type contacts                     # Show all contacts"
Write-Host "  .\view-logs.ps1 -Last 5 -Type quotes               # Show last 5 quotes"
Write-Host "  .\view-logs.ps1 -Search 'gmail.com'                # Search for gmail in all logs"
Write-Host "  .\view-logs.ps1 -Type contacts -ExportCsv          # Export contacts to CSV"
Write-Host "  .\view-logs.ps1 -Format json                       # Show all logs as JSON`n"
