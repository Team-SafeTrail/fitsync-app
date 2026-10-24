[CmdletBinding()]
param(
  [Parameter(Mandatory = $true)]
  [ValidatePattern('^[a-z]{20}$')]
  [string]$ProjectRef,

  [ValidatePattern('^[^@\s]+@[^@\s]+\.[^@\s]+$')]
  [string]$AdminEmail = 'admin@fitsync.vn'
)

$ErrorActionPreference = 'Stop'
$repoRoot = Split-Path -Parent $PSScriptRoot
$passwordPointer = [IntPtr]::Zero
$plainPassword = $null

function Invoke-SupabaseJson {
  param(
    [Parameter(Mandatory = $true)]
    [string[]]$CliArguments,

    [Parameter(Mandatory = $true)]
    [string]$FailureMessage
  )

  # Windows PowerShell 5 surfaces harmless native stderr notices as
  # NativeCommandError when ErrorActionPreference is Stop. Preserve the real
  # exit code while suppressing only CLI notices from the JSON capture.
  $previousErrorActionPreference = $ErrorActionPreference
  try {
    $ErrorActionPreference = 'Continue'
    $output = & npx.cmd supabase @CliArguments 2>$null
    $exitCode = $LASTEXITCODE
  }
  finally {
    $ErrorActionPreference = $previousErrorActionPreference
  }

  if ($exitCode -ne 0) {
    throw $FailureMessage
  }
  return ($output -join [Environment]::NewLine)
}

Push-Location -LiteralPath $repoRoot
try {
  $projectsJson = Invoke-SupabaseJson `
    -CliArguments @('projects', 'list', '-o', 'json') `
    -FailureMessage 'Could not list Supabase projects with the authenticated CLI session.'

  $projects = $projectsJson | ConvertFrom-Json
  $project = $projects | Where-Object { $_.ref -eq $ProjectRef } | Select-Object -First 1
  if (-not $project) {
    throw "Project ref $ProjectRef is not available to the authenticated Supabase account."
  }
  if ($project.name -ne 'fitsync-prod') {
    throw "Refusing to seed project '$($project.name)'; expected fitsync-prod."
  }
  if ($project.region -ne 'ap-southeast-1') {
    throw "Refusing to seed region '$($project.region)'; expected ap-southeast-1."
  }
  if ($project.status -ne 'ACTIVE_HEALTHY') {
    throw "Refusing to seed project status '$($project.status)'; expected ACTIVE_HEALTHY."
  }

  $keysJson = Invoke-SupabaseJson `
    -CliArguments @('projects', 'api-keys', '--project-ref', $ProjectRef, '-o', 'json') `
    -FailureMessage 'Could not read API key metadata from Supabase.'

  $keys = $keysJson | ConvertFrom-Json
  $serviceRole = $keys |
    Where-Object { $_.name -eq 'service_role' -and $_.type -eq 'legacy' } |
    Select-Object -First 1
  if (-not $serviceRole -or -not $serviceRole.api_key) {
    throw 'A legacy service_role key was not returned by Supabase CLI.'
  }

  $securePassword = Read-Host 'Enter a NEW OC2 demo admin password (input is hidden)' -AsSecureString
  $passwordPointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($securePassword)
  $plainPassword = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($passwordPointer)
  if ($plainPassword.Length -lt 12) {
    throw 'The OC2 demo admin password must contain at least 12 characters.'
  }

  $env:SUPABASE_URL = "https://$ProjectRef.supabase.co"
  $env:SUPABASE_SERVICE_ROLE_KEY = [string]$serviceRole.api_key
  $env:OC2_ADMIN_EMAIL = $AdminEmail
  $env:OC2_ADMIN_PASSWORD = $plainPassword
  $env:OC2_SEED_CONFIRM = 'synthetic-only'

  Write-Host "Applying synthetic OC2 seed to verified project $ProjectRef..."
  node scripts/seed-oc2-demo.mjs --apply
  if ($LASTEXITCODE -ne 0) {
    throw 'The OC2 seed command failed.'
  }
}
finally {
  Remove-Item Env:SUPABASE_URL -ErrorAction SilentlyContinue
  Remove-Item Env:SUPABASE_SERVICE_ROLE_KEY -ErrorAction SilentlyContinue
  Remove-Item Env:OC2_ADMIN_EMAIL -ErrorAction SilentlyContinue
  Remove-Item Env:OC2_ADMIN_PASSWORD -ErrorAction SilentlyContinue
  Remove-Item Env:OC2_SEED_CONFIRM -ErrorAction SilentlyContinue
  $plainPassword = $null
  if ($passwordPointer -ne [IntPtr]::Zero) {
    [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($passwordPointer)
  }
  Pop-Location
}
