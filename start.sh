#!/bin/bash

echo "🟢 Iniciando servidor Eleventy..."
npx eleventy --serve &

# Esperar unos segundos para que el servidor arranque
sleep 3

start http://localhost:8080