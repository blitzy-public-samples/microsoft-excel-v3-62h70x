#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Check if the environment argument is provided
if [ -z "$1" ]; then
    echo "Usage: ./deploy.sh <environment>"
    exit 1
fi

ENVIRONMENT=$1

echo "Starting deployment process for Microsoft Excel application to $ENVIRONMENT environment..."

# Load environment-specific variables
source .env.$ENVIRONMENT

# Build the application
npm run build

# Run database migrations
npm run migrate

# Deploy to Azure App Service
az webapp deployment source config-zip --resource-group $RESOURCE_GROUP --name $APP_SERVICE_NAME --src dist.zip

# Invalidate CDN cache if applicable
if [ -n "$CDN_ENDPOINT" ]; then
    az cdn endpoint purge --content-paths '/*' --profile-name $CDN_PROFILE --name $CDN_ENDPOINT --resource-group $RESOURCE_GROUP
fi

# Run post-deployment tests
npm run test:smoke

echo "Deployment to $ENVIRONMENT completed successfully."

# Send notification of successful deployment
./scripts/notify_deployment.sh $ENVIRONMENT success