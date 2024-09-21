#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

echo "Starting build process for Microsoft Excel application..."

# Install dependencies
npm ci

# Run linter
npm run lint

# Run unit tests
npm test

# Build the application
npm run build

# Run integration tests
npm run test:integration

# Generate documentation
npm run docs

# Create a distribution package
npm run package

echo "Build process completed successfully."