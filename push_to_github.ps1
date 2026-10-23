Write-Host "====================================================" -ForegroundColor Cyan
Write-Host "  FuturePath AI - Upload to GitHub (ayeshikaict-gif) " -ForegroundColor Cyan
Write-Host "====================================================" -ForegroundColor Cyan
Write-Host ""

$defaultRepo = "FuturePath-AI"
$repoName = Read-Host "Enter repository name [Press Enter for default: $defaultRepo]"
if ([string]::IsNullOrWhiteSpace($repoName)) {
    $repoName = $defaultRepo
}

$repoUrl = "https://github.com/ayeshikaict-gif/$repoName.git"
Write-Host ""
Write-Host "Target GitHub URL: $repoUrl" -ForegroundColor Yellow
Write-Host ""
Write-Host "Step 1: Make sure you created the empty repository on GitHub first:" -ForegroundColor White
Write-Host "  https://github.com/new" -ForegroundColor Cyan
Write-Host "  (Repository name: $repoName, leave 'Add a README' unchecked)" -ForegroundColor Gray
Write-Host ""
Read-Host "Press Enter once you have created the repository on GitHub..."

# Add git executable to current path if needed
$env:Path += ";$env:LOCALAPPDATA\Programs\Git\cmd"

& git remote remove origin 2>$null
& git remote add origin $repoUrl
& git branch -M main

Write-Host ""
Write-Host "Pushing main branch to $repoUrl ..." -ForegroundColor Green
Write-Host "(A browser window will appear asking you to Sign In to GitHub)" -ForegroundColor Yellow
Write-Host ""

& git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "====================================================" -ForegroundColor Green
    Write-Host "  SUCCESS! Project uploaded to GitHub:" -ForegroundColor Green
    Write-Host "  https://github.com/ayeshikaict-gif/$repoName" -ForegroundColor Cyan
    Write-Host "====================================================" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "Push failed. Please ensure the repository is created at https://github.com/new" -ForegroundColor Red
}
