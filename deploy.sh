#!/bin/bash

# 1️⃣ Pedir mensaje de commit
echo "Introduce el mensaje del commit para gh-pages:"
read COMMIT_MSG

# 2️⃣ Generar el sitio con Eleventy
npx eleventy

# 3️⃣ Cambiar a la rama gh-pages (crear si no existe)
git checkout gh-pages 2>/dev/null || git checkout -b gh-pages

# 4️⃣ Copiar contenido de _site a la raíz de gh-pages
cp -r _site/* .

# 5️⃣ Añadir todos los archivos
git add .

# 6️⃣ Hacer commit con el mensaje dado por el usuario
git commit -m "$COMMIT_MSG"

# 7️⃣ Push a GitHub
git push origin gh-pages

# 8️⃣ Volver a main
git checkout main

echo "✅ Deploy completado con el mensaje: $COMMIT_MSG"

