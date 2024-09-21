#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

echo "Setting up Microsoft Excel development environment..."

# Check if required tools are installed
command -v node >/dev/null 2>&1 || { echo >&2 "Node.js is required but not installed. Aborting."; exit 1; }
command -v npm >/dev/null 2>&1 || { echo >&2 "npm is required but not installed. Aborting."; exit 1; }
command -v psql >/dev/null 2>&1 || { echo >&2 "PostgreSQL is required but not installed. Aborting."; exit 1; }

# Install system dependencies
echo "Updating system and installing dependencies..."
sudo apt-get update
sudo apt-get install -y nodejs npm postgresql redis-server

# Install project dependencies
echo "Installing project dependencies..."
npm install

# Set up the database
echo "Setting up the database..."
sudo -u postgres psql -c "CREATE DATABASE excel_db;"
sudo -u postgres psql -c "CREATE USER excel_user WITH PASSWORD 'excel_password';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE excel_db TO excel_user;"

# Run database migrations
echo "Running database migrations..."
npm run migrate

# Seed the database with initial data
echo "Seeding the database..."
npm run seed

# Set up environment variables
echo "Setting up environment variables..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo "Please update the .env file with your local configuration."
else
    echo ".env file already exists. Please review it for any necessary updates."
fi

# Set up Git hooks
echo "Setting up Git hooks..."
if [ -d .git ]; then
    cp scripts/pre-commit.sh .git/hooks/pre-commit
    chmod +x .git/hooks/pre-commit
    echo "Git pre-commit hook installed."
else
    echo "Not a Git repository. Skipping Git hooks setup."
fi

# Start Redis server
echo "Starting Redis server..."
sudo systemctl start redis-server

echo "Setup complete. You can now start the development server with 'npm run dev'."

# Log setup completion
echo "$(date): Setup completed successfully" >> setup.log