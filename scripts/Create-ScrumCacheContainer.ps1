<#
.SYNOPSIS
    Creates the scrum-cache Cosmos DB container required by scrum.py (PROJECT-39 WI-0).

.DESCRIPTION
    Provisions the `scrum-cache` container in the eva-foundation database with a
    /sprint_key partition key and 24-hour TTL so scrum.py can cache ADO responses
    without hammering the ADO API on every portal load.

    Prerequisite: az CLI logged in and targeting the correct subscription.
        az login
        az account set --subscription "<subscription-id>"

.NOTES
    After creation, populate COSMOS_ENDPOINT and COSMOS_KEY in
    33-eva-brain-v2/.env.ado  (see .env.ado.example for exact var names).

.EXAMPLE
    .\scripts\Create-ScrumCacheContainer.ps1
    .\scripts\Create-ScrumCacheContainer.ps1 -WhatIf
#>

[CmdletBinding(SupportsShouldProcess)]
param(
    [string]$AccountName   = "marco-sandbox-cosmos",
    [string]$ResourceGroup = "EsDAICoE-Sandbox",
    [string]$DatabaseName  = "eva-foundation",
    [string]$ContainerName = "scrum-cache",
    [string]$PartitionKey  = "/sprint_key",
    [int]   $TtlSeconds    = 86400      # 24 h
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

# ── 1. Verify az CLI is available and logged in ─────────────────────────────────
Write-Host "`n[1/5] Checking az CLI login..." -ForegroundColor Cyan
try {
    $account = az account show --query "name" -o tsv 2>$null
    if (-not $account) { throw "Not logged in" }
    Write-Host "  OK — subscription: $account" -ForegroundColor Green
} catch {
    Write-Error "Run 'az login' then 'az account set --subscription <id>' first."
    exit 1
}

# ── 2. Verify Cosmos account exists ─────────────────────────────────────────────
Write-Host "[2/5] Verifying Cosmos account '$AccountName'..." -ForegroundColor Cyan
$acctJson = az cosmosdb show --name $AccountName --resource-group $ResourceGroup 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Error "Cosmos account '$AccountName' not found in '$ResourceGroup'. Check names and subscription."
    exit 1
}
Write-Host "  OK" -ForegroundColor Green

# ── 3. Verify database exists ────────────────────────────────────────────────────
Write-Host "[3/5] Verifying database '$DatabaseName'..." -ForegroundColor Cyan
$dbJson = az cosmosdb sql database show `
    --account-name $AccountName `
    --resource-group $ResourceGroup `
    --name $DatabaseName 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Error "Database '$DatabaseName' not found. Create it first or check the name."
    exit 1
}
Write-Host "  OK" -ForegroundColor Green

# ── 4. Check if container already exists ────────────────────────────────────────
Write-Host "[4/5] Checking for existing container '$ContainerName'..." -ForegroundColor Cyan
$existingJson = az cosmosdb sql container show `
    --account-name $AccountName `
    --resource-group $ResourceGroup `
    --database-name $DatabaseName `
    --name $ContainerName 2>$null

if ($LASTEXITCODE -eq 0) {
    Write-Host "  Container already exists — nothing to do." -ForegroundColor Yellow
    Write-Host ""
    & "$PSScriptRoot\Print-EnvVars.ps1" -AccountName $AccountName -ResourceGroup $ResourceGroup -Silent 2>$null
    Write-EnvBlock -AccountName $AccountName -ResourceGroup $ResourceGroup
    exit 0
}
Write-Host "  Not found — will create." -ForegroundColor Green

# ── 5. Create container ──────────────────────────────────────────────────────────
Write-Host "[5/5] Creating container '$ContainerName'..." -ForegroundColor Cyan
$params = @(
    "cosmosdb", "sql", "container", "create",
    "--account-name",   $AccountName,
    "--resource-group", $ResourceGroup,
    "--database-name",  $DatabaseName,
    "--name",           $ContainerName,
    "--partition-key-path", $PartitionKey,
    "--ttl",            $TtlSeconds
)

if ($WhatIfPreference) {
    Write-Host "  WhatIf: az $($params -join ' ')" -ForegroundColor Magenta
} else {
    az @params
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Container creation failed. See az output above."
        exit 1
    }
    Write-Host "  Created OK" -ForegroundColor Green
}

# ── Print env var block for copy/paste ──────────────────────────────────────────
Write-Host ""
Write-Host "─────────────────────────────────────────────────────────────" -ForegroundColor DarkGray
Write-Host " Add these to  33-eva-brain-v2/.env.ado  (never commit!)" -ForegroundColor Yellow
Write-Host "─────────────────────────────────────────────────────────────" -ForegroundColor DarkGray

$endpoint = az cosmosdb show `
    --name $AccountName `
    --resource-group $ResourceGroup `
    --query "documentEndpoint" -o tsv

$key = az cosmosdb keys list `
    --name $AccountName `
    --resource-group $ResourceGroup `
    --query "primaryMasterKey" -o tsv

Write-Host ""
Write-Host "COSMOS_ENDPOINT=$endpoint"
Write-Host "COSMOS_KEY=$key"
Write-Host "COSMOS_DATABASE=$DatabaseName"
Write-Host ""
Write-Host "─────────────────────────────────────────────────────────────" -ForegroundColor DarkGray
Write-Host " Done. Next: re-deploy eva-brain-v2 (WI-7) then register" -ForegroundColor Cyan
Write-Host " APIM routes (WI-1): GET /v1/scrum/summary, /v1/scrum/dashboard" -ForegroundColor Cyan
Write-Host "─────────────────────────────────────────────────────────────" -ForegroundColor DarkGray
