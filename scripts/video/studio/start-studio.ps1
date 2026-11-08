[CmdletBinding()]
param([int]$Port=3117)
$ErrorActionPreference='Stop'
$videoRepoRoot=Split-Path -Parent (Split-Path -Parent (Split-Path -Parent $PSScriptRoot))
$videoNodeCommand=Get-Command node -ErrorAction SilentlyContinue
$videoNode=if($videoNodeCommand){$videoNodeCommand.Source}else{'D:\CodexArtifacts\fitsync-video-tools\node-v22.22.0-win-x64\node.exe'}
if(-not(Test-Path -LiteralPath $videoNode)){throw 'Không tìm thấy Node.js. Cần Node 22 trở lên để mở phòng thu.'}
Push-Location -LiteralPath $videoRepoRoot
try{ & $videoNode (Join-Path $PSScriptRoot 'server.mjs') --port $Port }
finally{Pop-Location}
