#!/usr/bin/env bash
set -e
PORT=${1:-8000}

# fecha servidor antigo na porta
if command -v fuser >/dev/null 2>&1; then
  fuser -k "$PORT"/tcp >/dev/null 2>&1 || true
else
  PID=$(lsof -ti tcp:"$PORT" || true)
  if [ -n "$PID" ]; then kill -9 "$PID" || true; fi
fi

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$DIR"

python3 -m http.server "$PORT" &
SERVER_PID=$!
sleep 1
xdg-open "http://localhost:$PORT" >/dev/null 2>&1 || true
echo "Studio Alfa rodando em http://localhost:$PORT  (PID $SERVER_PID)"
trap "kill $SERVER_PID 2>/dev/null || true" EXIT
wait $SERVER_PID
