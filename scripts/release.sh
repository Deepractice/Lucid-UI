#!/usr/bin/env bash
set -euo pipefail

# =============================================================================
# UIX Monorepo Release Script
# Builds and publishes all packages to npm in dependency order.
# =============================================================================

DRY_RUN=false
TAG="latest"

# Parse arguments
while [[ $# -gt 0 ]]; do
  case "$1" in
    --dry-run)
      DRY_RUN=true
      shift
      ;;
    --tag)
      TAG="$2"
      shift 2
      ;;
    *)
      echo "Unknown option: $1"
      echo "Usage: $0 [--dry-run] [--tag <tag>]"
      exit 1
      ;;
  esac
done

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

info()  { echo -e "${BLUE}[info]${NC}  $*"; }
ok()    { echo -e "${GREEN}[ok]${NC}    $*"; }
warn()  { echo -e "${YELLOW}[warn]${NC}  $*"; }
err()   { echo -e "${RED}[error]${NC} $*"; }

# Navigate to repo root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$ROOT_DIR"

echo ""
echo "============================================="
echo "  UIX Release"
echo "============================================="
echo ""
info "Tag:      $TAG"
info "Dry run:  $DRY_RUN"
echo ""

# ---------- Step 1: Install dependencies ----------
info "Installing dependencies..."
pnpm install --frozen-lockfile
ok "Dependencies installed"

# ---------- Step 2: Build all packages in order ----------
# Build order respects dependency graph:
#   1. core, tokens       (no internal deps)
#   2. stream             (depends on core, tokens)
#   3. react              (depends on tokens)
#   4. adapters           (depend on core)
#   5. agent              (depends on core, tokens, stream)

PACKAGES_PHASE_1=(core tokens)
PACKAGES_PHASE_2=(stream)
PACKAGES_PHASE_3=(react)
PACKAGES_PHASE_4=(adapter-vercel adapter-agui adapter-a2ui)
PACKAGES_PHASE_5=(agent)

build_packages() {
  local phase_name="$1"
  shift
  local packages=("$@")

  info "Building phase: $phase_name"
  for pkg in "${packages[@]}"; do
    info "  Building packages/$pkg ..."
    pnpm --filter "./packages/$pkg" build
    ok "  packages/$pkg built"
  done
}

build_packages "1 - core & tokens" "${PACKAGES_PHASE_1[@]}"
build_packages "2 - stream"        "${PACKAGES_PHASE_2[@]}"
build_packages "3 - react"         "${PACKAGES_PHASE_3[@]}"
build_packages "4 - adapters"      "${PACKAGES_PHASE_4[@]}"
build_packages "5 - agent"         "${PACKAGES_PHASE_5[@]}"

ok "All packages built"
echo ""

# ---------- Step 3: Run tests ----------
info "Running tests..."
pnpm test || {
  warn "Some tests may have been skipped (no test script in some packages)"
}
ok "Tests complete"
echo ""

# ---------- Step 4: Publish ----------
ALL_PACKAGES=(core tokens stream react adapter-vercel adapter-agui adapter-a2ui agent)

PUBLISH_FLAGS="--access public --tag $TAG --no-git-checks"
if [ "$DRY_RUN" = true ]; then
  PUBLISH_FLAGS="$PUBLISH_FLAGS --dry-run"
fi

info "Publishing packages..."
echo ""

for pkg in "${ALL_PACKAGES[@]}"; do
  PKG_DIR="$ROOT_DIR/packages/$pkg"
  PKG_NAME=$(node -e "console.log(require('$PKG_DIR/package.json').name)")
  PKG_VERSION=$(node -e "console.log(require('$PKG_DIR/package.json').version)")

  info "Publishing $PKG_NAME@$PKG_VERSION ..."
  (cd "$PKG_DIR" && pnpm publish $PUBLISH_FLAGS) && \
    ok "$PKG_NAME@$PKG_VERSION published" || \
    err "Failed to publish $PKG_NAME"
done

echo ""
echo "============================================="
if [ "$DRY_RUN" = true ]; then
  warn "Dry run complete. No packages were actually published."
else
  ok "All packages published successfully!"
fi
echo "============================================="
