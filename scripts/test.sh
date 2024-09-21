#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

echo "Starting test suite for Microsoft Excel application..."

# Run unit tests
echo "Running unit tests..."
npm run test:unit

# Run integration tests
echo "Running integration tests..."
npm run test:integration

# Run end-to-end tests
echo "Running end-to-end tests..."
npm run test:e2e

# Generate code coverage report
echo "Generating code coverage report..."
npm run test:coverage

# Check code coverage thresholds
echo "Checking code coverage thresholds..."
npm run test:coverage:check

echo "All tests completed successfully."

# Display summary of test results
echo "Test Summary:"
npm run test:summary