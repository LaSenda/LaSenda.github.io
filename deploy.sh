#!/bin/bash

echo "🛠️ Generando el sitio con Eleventy..."
npx eleventy

echo "🚀 Cambiando a la rama gh-pages..."
git checkout gh-pages

echo "🧹 Limpiando archivos anteriores..."
git rm -rf .

echo "📦 Copiando contenido de _site..."
rsync -av --delete ../_site/ .

echo "📄 Añadiendo .nojekyll..."
touch .nojekyll

echo "📤 Haciendo commit y push..."
git add .
git commit -m "Deploy automático con script"
git push origin gh-pages

echo "🔙 Volviendo a la rama main..."
git checkout main

echo "✅ ¡Despliegue completo!"
