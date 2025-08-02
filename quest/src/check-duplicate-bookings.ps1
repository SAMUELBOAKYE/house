Write-Host "`n🔍 Scanning for duplicate 'bookings.js' files..." -ForegroundColor Cyan

# Search recursively for any file named 'bookings.js'
$matches = Get-ChildItem -Path . -Recurse -Filter "bookings.js"

if ($matches.Count -eq 0) {
    Write-Host "❌ No bookings.js file found!" -ForegroundColor Red
} elseif ($matches.Count -eq 1) {
    Write-Host "✅ Only one bookings.js file found:" -ForegroundColor Green
    $matches.FullName
} else {
    Write-Host "⚠️ Multiple bookings.js files found!" -ForegroundColor Yellow
    $matches.FullName
}

Write-Host "`n✅ Press any key to exit..." -ForegroundColor Yellow
$Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown") > $null
