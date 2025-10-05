#!/usr/bin/env bash
set -euo pipefail
IFS=$'\n\t'

# Defaults
BUILD_DIR="_site"
BRANCH="gh-pages"
DRY_RUN=0
KEEP_TMP=0
COMMIT_MSG="Deploy site $(date -u +"%Y-%m-%d %H:%M:%SZ")"

# Parse args
while [[ $# -gt 0 ]]; do
  case "$1" in
    --dry-run) DRY_RUN=1; shift ;;
    --keep-tmp) KEEP_TMP=1; shift ;;
    --msg) shift; COMMIT_MSG="${1:-$COMMIT_MSG}"; shift ;;
    --help) echo "Usage: $0 [--dry-run] [--keep-tmp] [--msg \"message\"]"; exit 0 ;;
    *) COMMIT_MSG="$1"; shift ;;
  esac
done

echo "DRY_RUN=$DRY_RUN, KEEP_TMP=$KEEP_TMP, COMMIT_MSG='$COMMIT_MSG'"

# 0) Repo check
if ! git rev-parse --git-dir > /dev/null 2>&1; then
  echo "❌ No estás en un repositorio git. Ejecuta desde la raíz del repo."
  exit 1
fi

# 1) Working tree limpio
if [ -n "$(git status --porcelain)" ]; then
  echo "⚠️ Tienes cambios sin commitear. Haz commit o stash antes de desplegar."
  git status --porcelain
  exit 2
fi

# 2) Build
echo "🔧 Generando sitio (preferente: npm run build)..."
if [ -f package.json ]; then
  if node -e "process.exit((require('./package.json').scripts && require('./package.json').scripts.build)?0:1)" 2>/dev/null; then
    npm run build 2>&1 | tee .deploy-build.log || { echo "❌ Build falló. Revisa .deploy-build.log"; tail -n 80 .deploy-build.log; exit 3; }
  else
    echo "ℹ️ No hay script 'build'. Intentando npx @11ty/eleventy ..."
    npx --yes @11ty/eleventy 2>&1 | tee .deploy-build.log || { echo "❌ npx eleventy falló. Revisa .deploy-build.log"; tail -n 80 .deploy-build.log; exit 4; }
  fi
else
  echo "ℹ️ No hay package.json; intentando npx @11ty/eleventy ..."
  npx --yes @11ty/eleventy 2>&1 | tee .deploy-build.log || { echo "❌ npx eleventy falló. Revisa .deploy-build.log"; tail -n 80 .deploy-build.log; exit 5; }
fi

# 3) Comprobar BUILD_DIR
if [ ! -d "$BUILD_DIR" ] || [ -z "$(ls -A "$BUILD_DIR")" ]; then
  echo "❌ $BUILD_DIR está vacío o no existe. Abortando."
  exit 6
fi

# 4) Preparar clone temporal
REPO_URL=$(git config --get remote.origin.url || true)
if [ -z "$REPO_URL" ]; then echo "❌ No hay remote origin."; exit 7; fi

TMP_DIR=$(mktemp -d -t deploy-XXXXXXXX) || { echo "❌ No se creó temp dir"; exit 8; }
echo "📁 Clonando repo en: $TMP_DIR"
git clone --depth 1 "$REPO_URL" "$TMP_DIR"

pushd "$TMP_DIR" > /dev/null

# 5) Checkout / crear gh-pages
if git ls-remote --heads origin "$BRANCH" | grep -q "$BRANCH"; then
  git fetch origin "$BRANCH"
  git checkout "$BRANCH"
else
  echo "ℹ️ La rama $BRANCH no existe. Creando orphan $BRANCH ..."
  git checkout --orphan "$BRANCH"
  git rm -rf --ignore-unmatch .
  git clean -fdx || true
fi

# 6) Sincronizar (en dry-run usa rsync --dry-run)
if [ "$DRY_RUN" -eq 1 ]; then
  echo "🔎 DRY RUN: rsync --dry-run mostrando cambios que se aplicarían..."
  rsync -av --delete --exclude='.git' --dry-run "../$BUILD_DIR"/ ./
  echo "🔍 DRY RUN completado. (no se han aplicado cambios ni se ha hecho push)"
else
  echo "🔁 Sincronizando _site -> $TMP_DIR ..."
  rsync -av --delete --exclude='.git' "../$BUILD_DIR"/ ./
  touch .nojekyll
  if [ -f "../CNAME" ]; then cp ../CNAME ./CNAME; fi

  git add -A
  if git diff --cached --quiet; then
    echo "ℹ️ No hay cambios que commitear en $BRANCH."
  else
    git commit -m "$COMMIT_MSG"
    echo "🚀 Pushing $BRANCH -> origin (usando --force-with-lease)"
    git push origin "$BRANCH" --force-with-lease
  fi
fi

popd > /dev/null

if [ "$DRY_RUN" -eq 1 ] && [ "$KEEP_TMP" -eq 1 ]; then
  echo "🔔 DRY RUN con KEEP_TMP: el clone temporal permanece en: $TMP_DIR"
  echo "Inspección manual recomendada: cd $TMP_DIR  (no se borrará automáticamente)"
else
  rm -rf "$TMP_DIR"
  echo "🧹 Limpieza del temporal completada."
fi

echo "✅ Script finalizado. DRY_RUN=$DRY_RUN"
