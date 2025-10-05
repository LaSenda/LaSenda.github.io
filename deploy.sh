#!/usr/bin/env bash
set -euo pipefail
IFS=$'\n\t'

# Config
BUILD_DIR="_site"
BRANCH="gh-pages"
COMMIT_MSG="${1:-Deploy site $(date -u +"%Y-%m-%d %H:%M:%SZ")}"

# 0) Comprobar repo y origen
if ! git rev-parse --git-dir > /dev/null 2>&1; then
  echo "❌ Esto no parece un repositorio git. Ejecuta desde la raíz del repo."
  exit 1
fi

REPO_URL=$(git config --get remote.origin.url || true)
if [ -z "$REPO_URL" ]; then
  echo "❌ No encuentro remote 'origin'. Configura remote antes."
  exit 2
fi

# 1) Comprobar working tree limpio
if [ -n "$(git status --porcelain)" ]; then
  echo "⚠️ Tienes cambios sin commitear. Haz commit o stash antes de desplegar."
  git status --porcelain
  exit 3
fi

# 2) Build
echo "🔧 Generando sitio con Eleventy..."
npx eleventy || { echo "❌ Build falló. Revisa errores de Eleventy."; exit 4; }

if [ ! -d "$BUILD_DIR" ] || [ -z "$(ls -A "$BUILD_DIR")" ]; then
  echo "❌ $BUILD_DIR está vacío o no existe. Abortando."
  exit 5
fi

# 3) Crear clone temporal seguro
TMP_DIR=$(mktemp -d -t deploy-XXXXXXXX) || { echo "❌ No se pudo crear temp dir"; exit 6; }
echo "📁 Clonando repo en temporal: $TMP_DIR ..."
git clone --depth 1 "$REPO_URL" "$TMP_DIR"

pushd "$TMP_DIR" > /dev/null

# 4) Comprobar si gh-pages existe en remoto
if git ls-remote --heads origin "$BRANCH" | grep -q "$BRANCH"; then
  git fetch origin "$BRANCH"
  git checkout "$BRANCH"
else
  echo "ℹ️ La rama $BRANCH no existe. Creando rama orphan $BRANCH ..."
  git checkout --orphan "$BRANCH"
  # limpiar cualquier fichero (pero preservar .git)
  git rm -rf --ignore-unmatch .
  # dejar índice vacío
  git clean -fdx || true
fi

# 5) Sincronizar (rsync seguro: contenido de BUILD_DIR -> TMP_DIR)
rsync -av --delete --exclude='.git' "../$BUILD_DIR"/ ./  # nota las ../ para apuntar al build correcto

# Asegurar .nojekyll
touch .nojekyll

# Copiar CNAME si existe en repo raíz original
ROOT_CNAME="../CNAME"
if [ -f "$ROOT_CNAME" ]; then
  cp "$ROOT_CNAME" ./CNAME
fi

# 6) Commit & push (usar --force-with-lease para seguridad)
git add -A
if git diff --cached --quiet; then
  echo "ℹ️ No hay cambios para commitear en $BRANCH."
else
  git commit -m "$COMMIT_MSG"
  # Si la rama es nueva, pushear con upstream; si existe, usar force-with-lease
  if git rev-parse --verify --quiet "$BRANCH" >/dev/null; then
    git push origin "$BRANCH" --force-with-lease
  else
    git push -u origin "$BRANCH"
  fi
fi

popd > /dev/null

# 7) Limpiar
rm -rf "$TMP_DIR"
echo "✅ Deploy completado: $COMMIT_MSG"
