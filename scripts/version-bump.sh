#!/usr/bin/env bash
set -euo pipefail

# =============================================================================
# UIX Monorepo Version Bump Script
# Bumps the version in all packages consistently.
# =============================================================================

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

info()  { echo -e "${BLUE}[info]${NC}  $*"; }
ok()    { echo -e "${GREEN}[ok]${NC}    $*"; }
err()   { echo -e "${RED}[error]${NC} $*"; exit 1; }

# Navigate to repo root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$ROOT_DIR"

# ---------- Parse arguments ----------
if [ $# -lt 1 ]; then
  echo "Usage: $0 <patch|minor|major|x.y.z>"
  echo ""
  echo "Examples:"
  echo "  $0 patch        # 0.0.1 -> 0.0.2"
  echo "  $0 minor        # 0.0.1 -> 0.1.0"
  echo "  $0 major        # 0.0.1 -> 1.0.0"
  echo "  $0 0.2.0        # set explicit version"
  exit 1
fi

VERSION_ARG="$1"

# ---------- Resolve version ----------
CURRENT_VERSION=$(node -e "console.log(require('./package.json').version)")
info "Current version: $CURRENT_VERSION"

if [[ "$VERSION_ARG" =~ ^[0-9]+\.[0-9]+\.[0-9]+(-.*)?$ ]]; then
  # Explicit version provided
  NEW_VERSION="$VERSION_ARG"
else
  # Compute from bump type
  IFS='.' read -r MAJOR MINOR PATCH <<< "${CURRENT_VERSION%%-*}"
  case "$VERSION_ARG" in
    patch) PATCH=$((PATCH + 1)) ;;
    minor) MINOR=$((MINOR + 1)); PATCH=0 ;;
    major) MAJOR=$((MAJOR + 1)); MINOR=0; PATCH=0 ;;
    *) err "Invalid version argument: $VERSION_ARG (use patch, minor, major, or x.y.z)" ;;
  esac
  NEW_VERSION="$MAJOR.$MINOR.$PATCH"
fi

info "New version:     $NEW_VERSION"
echo ""

# ---------- All package directories ----------
PACKAGES=(
  core
  tokens
  stream
  react
  adapter-vercel
  adapter-agui
  adapter-a2ui
  agent
)

# ---------- Update root package.json ----------
info "Updating root package.json ..."
node -e "
  const fs = require('fs');
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  pkg.version = '$NEW_VERSION';
  fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n');
"
ok "root package.json -> $NEW_VERSION"

# ---------- Update each package ----------
for pkgDir in "${PACKAGES[@]}"; do
  PKG_JSON="$ROOT_DIR/packages/$pkgDir/package.json"

  if [ ! -f "$PKG_JSON" ]; then
    echo "  [skip] packages/$pkgDir/package.json not found"
    continue
  fi

  info "Updating packages/$pkgDir/package.json ..."

  node -e "
    const fs = require('fs');
    const pkgPath = '$PKG_JSON';
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    const newVersion = '$NEW_VERSION';

    // Update package version
    pkg.version = newVersion;

    // Internal package names that should be updated if pinned (not workspace:*)
    const internalPkgs = [
      '@uix/core',
      '@uix/lucid-tokens',
      '@uix/lucid-react',
      '@uix/stream',
      '@uix/agent',
      '@uix/adapter-vercel',
      '@uix/adapter-agui',
      '@uix/adapter-a2ui'
    ];

    // Update dependencies that reference specific versions (not workspace:*)
    for (const depField of ['dependencies', 'devDependencies', 'peerDependencies']) {
      if (!pkg[depField]) continue;
      for (const name of internalPkgs) {
        if (pkg[depField][name] && !pkg[depField][name].startsWith('workspace:')) {
          pkg[depField][name] = newVersion;
        }
      }
    }

    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
  "
  ok "packages/$pkgDir -> $NEW_VERSION"
done

echo ""
echo "============================================="
ok "All packages bumped to $NEW_VERSION"
echo "============================================="
echo ""
info "Next steps:"
echo "  1. Review changes:  git diff"
echo "  2. Commit:          git add -A && git commit -m \"chore: bump version to $NEW_VERSION\""
echo "  3. Tag:             git tag v$NEW_VERSION"
echo "  4. Publish:         pnpm release"
