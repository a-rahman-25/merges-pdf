#!/usr/bin/env bash
# Idempotent dependency setup for MergesPDF Cloud Agents.
# Bootstraps Bun (the repository's pinned package manager via bun.lock) if it is
# missing, then installs dependencies from the frozen lockfile.
set -euo pipefail

export BUN_INSTALL="${BUN_INSTALL:-$HOME/.bun}"
export PATH="$BUN_INSTALL/bin:$PATH"

if ! command -v bun >/dev/null 2>&1; then
  echo "Bun not found; installing..."
  curl -fsSL https://bun.sh/install | bash
fi

bun --version
bun install --frozen-lockfile
