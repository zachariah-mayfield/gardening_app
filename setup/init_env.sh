#!/usr/bin/env bash

# Navigate to project root from setup/
cd "$(dirname "$0")/.."

ENV_FILE=".env"

# Default values
POSTGRES_USER="postgres"
POSTGRES_PASSWORD="password"
POSTGRES_DB="postgres"
DATABASE_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@db:5432/${POSTGRES_DB}"

echo "🔍 Checking .env file..."

# Create the .env file if it doesn't exist
if [ ! -f "$ENV_FILE" ]; then
    echo "📝 Creating $ENV_FILE with default values..."
    {
        echo "POSTGRES_USER=$POSTGRES_USER"
        echo "POSTGRES_PASSWORD=$POSTGRES_PASSWORD"
        echo "POSTGRES_DB=$POSTGRES_DB"
        echo "DATABASE_URL=$DATABASE_URL"
    } > "$ENV_FILE"
    echo "✅ .env created."
else
    echo "✅ $ENV_FILE already exists."

    # Ensure each variable is present and correctly set
    grep -q "^POSTGRES_USER=" "$ENV_FILE" || echo "POSTGRES_USER=$POSTGRES_USER" >> "$ENV_FILE"
    grep -q "^POSTGRES_PASSWORD=" "$ENV_FILE" || echo "POSTGRES_PASSWORD=$POSTGRES_PASSWORD" >> "$ENV_FILE"
    grep -q "^POSTGRES_DB=" "$ENV_FILE" || echo "POSTGRES_DB=$POSTGRES_DB" >> "$ENV_FILE"

    if grep -q "^DATABASE_URL=$" "$ENV_FILE"; then
        echo "✏️ Setting default value for empty DATABASE_URL..."
        sed -i 's/^DATABASE_URL=$/DATABASE_URL='"$DATABASE_URL"'/' "$ENV_FILE"
    elif ! grep -q "^DATABASE_URL=" "$ENV_FILE"; then
        echo "➕ Adding DATABASE_URL..."
        echo "DATABASE_URL=$DATABASE_URL" >> "$ENV_FILE"
    else
        echo "✅ DATABASE_URL already set."
    fi
fi
