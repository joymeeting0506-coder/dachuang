param(
    [string]$CommitMessage = "Update project files",
    [string]$Branch = "main",
    [string]$RemoteUrl = "https://github.com/joymeeting0506-coder/dachuang.git",
    [string[]]$ExtraPath,
    [switch]$SkipPull
)

$ErrorActionPreference = "Stop"

$gitCandidates = @(
    "git",
    "D:\tools\Git\cmd\git.exe",
    "D:\tools\Git\bin\git.exe",
    "E:\Git\cmd\git.exe",
    "E:\Git\bin\git.exe",
    "$env:ProgramFiles\Git\cmd\git.exe",
    "${env:ProgramFiles(x86)}\Git\cmd\git.exe",
    "$env:LOCALAPPDATA\Programs\Git\cmd\git.exe"
)

$script:GitCommand = $null
foreach ($candidate in $gitCandidates) {
    if ((Get-Command $candidate -ErrorAction SilentlyContinue) -or (Test-Path $candidate)) {
        $script:GitCommand = $candidate
        break
    }
}

function Invoke-Git {
    param([Parameter(ValueFromRemainingArguments = $true)][string[]]$GitArgs)

    & $script:GitCommand @GitArgs
    if ($LASTEXITCODE -ne 0) {
        throw "Git command failed: git $($GitArgs -join ' ')"
    }
}

function Invoke-GitNetwork {
    param([Parameter(ValueFromRemainingArguments = $true)][string[]]$GitArgs)

    $previousErrorActionPreference = $ErrorActionPreference
    $ErrorActionPreference = "Continue"
    & $script:GitCommand @GitArgs
    $exitCode = $LASTEXITCODE
    $ErrorActionPreference = $previousErrorActionPreference

    if ($exitCode -ne 0) {
        Write-Host "Git network command failed; retrying without configured HTTP proxy..."
        & $script:GitCommand -c http.proxy= @GitArgs
        $exitCode = $LASTEXITCODE
    }

    if ($exitCode -ne 0) {
        throw "Git command failed: git $($GitArgs -join ' ')"
    }
}

function Test-RemoteBranchExists {
    param([string]$BranchName)

    $previousErrorActionPreference = $ErrorActionPreference
    $ErrorActionPreference = "Continue"
    & $script:GitCommand ls-remote --exit-code --heads origin $BranchName *> $null
    $exitCode = $LASTEXITCODE

    if ($exitCode -ne 0 -and $exitCode -ne 2) {
        & $script:GitCommand -c http.proxy= ls-remote --exit-code --heads origin $BranchName *> $null
        $exitCode = $LASTEXITCODE
    }

    $ErrorActionPreference = $previousErrorActionPreference
    if ($exitCode -eq 0) {
        return $true
    }
    elseif ($exitCode -eq 2) {
        return $false
    }

    throw "Unable to check remote branch '$BranchName'."
}

Set-Location $PSScriptRoot

if (-not $script:GitCommand) {
    throw "Git was not found. Please install Git for Windows, then rerun this script."
}

$previousErrorActionPreference = $ErrorActionPreference
$ErrorActionPreference = "Continue"
& $script:GitCommand rev-parse --git-dir *> $null
$ErrorActionPreference = $previousErrorActionPreference
$isGitRepository = ($LASTEXITCODE -eq 0)

if (-not $isGitRepository) {
    Invoke-Git init
}

$currentBranch = (& $script:GitCommand branch --show-current).Trim()
if ([string]::IsNullOrWhiteSpace($currentBranch)) {
    Invoke-Git checkout -B $Branch
}
elseif ($currentBranch -ne $Branch) {
    Invoke-Git branch -M $Branch
}

$previousErrorActionPreference = $ErrorActionPreference
$ErrorActionPreference = "Continue"
$existingRemote = (& $script:GitCommand remote get-url origin 2>$null)
$ErrorActionPreference = $previousErrorActionPreference
if ($LASTEXITCODE -ne 0 -or [string]::IsNullOrWhiteSpace($existingRemote)) {
    Invoke-Git remote add origin $RemoteUrl
}
elseif ($existingRemote.Trim() -ne $RemoteUrl) {
    Invoke-Git remote set-url origin $RemoteUrl
}

function Add-PathIfExists {
    param([string]$Path)

    if (Test-Path $Path) {
        Invoke-Git add -- $Path
    }
}

$defaultPaths = @(
    ".gitignore",
    "README.md",
    "sync-github.ps1",
    "docs",
    "scripts",
    "backend",
    "frontend",
    "models\stylegan2",
    "models\sdxl_lora",
    "data\metadata"
)

foreach ($path in $defaultPaths) {
    Add-PathIfExists $path
}

foreach ($path in $ExtraPath) {
    Add-PathIfExists $path
}

$pendingChanges = (& $script:GitCommand status --porcelain)
if (-not [string]::IsNullOrWhiteSpace($pendingChanges)) {
    Invoke-Git commit -m $CommitMessage
}
else {
    Write-Host "No local changes to commit."
}

if (-not $SkipPull) {
    if (Test-RemoteBranchExists $Branch) {
        Invoke-GitNetwork pull --rebase origin $Branch
    }
    else {
        Write-Host "Remote branch '$Branch' does not exist yet; skipping pull."
    }
}

Invoke-GitNetwork push -u origin $Branch
Write-Host "Synced to $RemoteUrl on branch '$Branch'."
