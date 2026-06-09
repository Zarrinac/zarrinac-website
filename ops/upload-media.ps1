# Upload local media -> server, then mirror it into the live dir with correct perms.
# Runs on the Windows dev PC. Uses Windows OpenSSH (ssh/scp) with key auth — no
# password prompt — so it can run unattended (e.g. driven by an agent).
#
# Auth: the nexzarrin_ed25519 key must be in the server's ~/.ssh/authorized_keys
# for $ServerUser. Verify once with:
#   ssh -i $HOME\.ssh\nexzarrin_ed25519 -o BatchMode=yes reza@172.17.0.10 hostname
#
# One-time server setup (see ops/README.md): install sync-media.sh to /usr/local/bin
# and add the NOPASSWD sudoers rule, so the final step runs unattended.
#
# TIP: optimize images first (the upload mirrors with --delete on the server):
#   node ops/optimize-media.mjs --apply
#
# Usage (from the repo root or anywhere):
#   pwsh ops/upload-media.ps1
# ---------------------------------------------------------------------------------

# ===== CONFIG =====
$LocalMedia = "C:\Users\r.saberifard\Documents\IT-Hisense\HIsense-Website\media"
$ServerUser = "reza"
$ServerHost = "172.17.0.10"   # reachable from this PC (Tailscale/WireGuard internal IP)
$ServerPort = "22"
$KeyFile    = Join-Path $HOME ".ssh\nexzarrin_ed25519"
# ==================

$ErrorActionPreference = "Stop"
$target = "${ServerUser}@${ServerHost}"
$staging = "/home/$ServerUser/media"

if (-not (Test-Path $LocalMedia)) { throw "Local media folder not found: $LocalMedia" }
if (-not (Test-Path $KeyFile))    { throw "SSH key not found: $KeyFile" }
foreach ($cmd in @("ssh", "scp")) {
  if (-not (Get-Command $cmd -ErrorAction SilentlyContinue)) {
    throw "$cmd not found on PATH (install Windows OpenSSH Client)."
  }
}

# Shared SSH options: key auth only, never prompt (fail fast if auth breaks),
# auto-trust a new host key, bounded connect timeout. ssh uses -p, scp uses -P.
$sshOpts = @(
  "-i", $KeyFile,
  "-o", "BatchMode=yes",
  "-o", "StrictHostKeyChecking=accept-new",
  "-o", "ConnectTimeout=15"
)

Write-Host "1/3  Clearing server staging ($staging)..." -ForegroundColor Cyan
& ssh @sshOpts -p $ServerPort $target "rm -rf '$staging'"
if ($LASTEXITCODE -ne 0) { throw "ssh (clear staging) failed with exit $LASTEXITCODE" }

Write-Host "2/3  Uploading media (full copy; may take a while)..." -ForegroundColor Cyan
& scp @sshOpts -P $ServerPort -r "$LocalMedia" "${target}:/home/$ServerUser/"
if ($LASTEXITCODE -ne 0) { throw "scp upload failed with exit $LASTEXITCODE — live media NOT touched." }

Write-Host "3/3  Mirroring to live dir + fixing permissions..." -ForegroundColor Cyan
& ssh @sshOpts -p $ServerPort $target "sudo /usr/local/bin/sync-media.sh"
if ($LASTEXITCODE -ne 0) { throw "remote sync-media.sh failed with exit $LASTEXITCODE" }

Write-Host "Media sync complete." -ForegroundColor Green
Write-Host "Note: replaced (same-name) images may be cached by Next's optimizer; new files appear immediately."
