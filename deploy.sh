#!/usr/bin/env bash
set -e

echo "🔨 Compilando con Eleventy..."
npx eleventy

echo "📦 Añadiendo cambios a Git..."
git add .

echo "✍️  Haciendo commit..."
git commit -m "chore: deploy $(date +'%Y-%m-%d %H:%M:%S')"

echo "🚀 Enviando a GitHub Pages..."
git push origin main
