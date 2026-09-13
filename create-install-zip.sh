#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd -P)"
cd "$ROOT_DIR"

VERSION="$(node -p "require('./package.json').version")"
PACKAGE_NAME="bosch-config-tool-install-v${VERSION}"
RELEASE_DIR="${ROOT_DIR}/release"
ZIP_PATH="${RELEASE_DIR}/${PACKAGE_NAME}.zip"
STAGING_PARENT="$(mktemp -d)"
STAGING_DIR="${STAGING_PARENT}/${PACKAGE_NAME}"

cleanup() {
  rm -rf "$STAGING_PARENT"
}
trap cleanup EXIT

if ! command -v zip >/dev/null 2>&1; then
  echo "❌ Missing 'zip' tool. Install it and run again."
  exit 1
fi

if [ "${SKIP_BUILD:-false}" = "true" ]; then
  echo "⏭️ Skipping build (SKIP_BUILD=true)."
elif npm run build; then
  echo "✅ Build completed successfully."
else
  if [ "${ALLOW_STALE_DIST:-false}" = "true" ] && [ -d "dist" ]; then
    echo "⚠️ Build failed. Using existing dist/ because ALLOW_STALE_DIST=true."
  else
    echo "❌ Build failed. ZIP package was not created."
    echo "   If you really need to use existing dist/, run with ALLOW_STALE_DIST=true."
    exit 1
  fi
fi

echo "📦 Preparing package..."
mkdir -p "$STAGING_DIR" "$RELEASE_DIR"
rm -f "$ZIP_PATH"

if [ ! -d "dist" ]; then
  echo "❌ Missing dist/ directory. Build first or use a valid prebuilt dist/."
  exit 1
fi

REQUIRED_ITEMS=(
  "dist"
  "package.json"
  "README.md"
  "INSTALLATION.md"
  "QUICKSTART.md"
  "DOWNLOAD_INSTRUCTIONS.md"
  "install.sh"
  "verify-installation.sh"
  "quick-start.sh"
  "run.sh"
)

OPTIONAL_ITEMS=(
  "package-lock.json"
)

for item in "${REQUIRED_ITEMS[@]}"; do
  if [ ! -e "$item" ]; then
    echo "❌ Missing required item: $item"
    exit 1
  fi
  cp -r "$item" "$STAGING_DIR/"
done

for item in "${OPTIONAL_ITEMS[@]}"; do
  if [ -e "$item" ]; then
    cp -r "$item" "$STAGING_DIR/"
  fi
done

echo "🗜️ Creating ZIP: ${ZIP_PATH}"
(cd "$STAGING_PARENT" && zip -r "$ZIP_PATH" "$PACKAGE_NAME" -x "node_modules/*" "*/node_modules/*" >/dev/null)

echo "✅ Done: ${ZIP_PATH}"
