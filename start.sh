#!/bin/bash
# Inicia el servidor de Eleventy y abre la página en el navegador.

echo "Iniciando el servidor local de Eleventy..."

# Inicia el servidor en segundo plano
npx eleventy --serve &

# Espera 3 segundos para que el servidor esté listo
echo "Esperando a que el servidor arranque..."
sleep 3

# Abre la página en el navegador (para Windows)
echo "Abriendo la página en el navegador..."
start http://localhost:8080
