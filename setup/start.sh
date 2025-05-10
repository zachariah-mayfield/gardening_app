#!/usr/bin/env bash

# Navigate to root directory
cd "$(dirname "$0")/.."

echo "🚀 Running init_env.sh..."
./setup/init_env.sh

echo "📦 Starting Docker Compose..."
docker-compose up -d --build

