#!/usr/bin/env bash
# Para jugar Cortocircuito en Linux o macOS: ./jugar.sh  (o ./jugar.sh 8080 para otro puerto)
set -e
cd "$(dirname "$0")"
PUERTO="${1:-8000}"

if ! command -v python3 >/dev/null 2>&1; then
  echo "Hace falta python3 para levantar el servidor local." >&2
  exit 1
fi

URL="http://localhost:$PUERTO/"
echo
echo "  CORTOCIRCUITO - servidor local"
echo "  El juego está en: $URL"
echo "  Para cerrarlo, apretá Ctrl + C."
echo

# Abre el navegador un segundo después, cuando el servidor ya está escuchando
( sleep 1; (xdg-open "$URL" || open "$URL") >/dev/null 2>&1 || true ) &
exec python3 -m http.server "$PUERTO" --bind 127.0.0.1
