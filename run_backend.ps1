Write-Host "Starting FuturePath AI FastAPI Backend on http://localhost:8000 ..." -ForegroundColor Cyan
Set-Location -Path "$PSScriptRoot\backend"
$env:PYTHONPATH = "."
& ".\venv\Scripts\python.exe" -m app.db.init_db
& ".\venv\Scripts\python.exe" -m uvicorn app.main:app --reload --port 8000
