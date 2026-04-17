#!/bin/bash
set -e

VERSION=$(node -e "console.log(require('./package.json').version)")
TAG="v${VERSION}"

echo "Releasing tag: ${TAG}"

git tag "${TAG}"
git push origin "${TAG}"

echo "✅ Pushed ${TAG} — the GitHub Actions release workflow will start shortly."
