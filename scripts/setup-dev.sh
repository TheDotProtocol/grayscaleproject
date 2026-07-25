#!/usr/bin/env bash
# Project Grayscale — one-command local dev setup
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

FRESH=false
if [[ "${1:-}" == "--fresh" ]]; then
  FRESH=true
fi

if [[ "$FRESH" == true ]]; then
  echo "▸ Fresh setup — removing Docker volumes (wipes local DB)..."
  docker compose down -v
fi

echo "▸ Starting Postgres + Redis (Docker)..."
docker compose up -d

echo "▸ Waiting for Postgres..."
for i in {1..30}; do
  if docker compose exec -T postgres pg_isready -U grayscale >/dev/null 2>&1; then
    break
  fi
  sleep 1
done

echo "▸ Applying database migrations..."
pnpm db:migrate

echo "▸ Seeding test founder account..."
pnpm db:seed

echo ""
echo "✓ Setup complete."
echo ""
echo "  Test login:"
echo "    Email:    akumartrabaajo@gmail.com"
echo "    Password: Ak1233@@5"
echo ""
echo "  Start dev servers:"
echo "    pnpm dev          # web :3000 + api :4000"
echo "    pnpm dev:web      # web only"
echo "    pnpm dev:api      # api only"
echo ""
