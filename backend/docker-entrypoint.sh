#!/bin/bash
if [ -z "$APP" ]; then
  echo "The APP environment variable is not set."
  exit 1
fi

echo "Cd into /app"
cd /app

echo "Running migrations for ${APP}"
npm run typeorm:${APP} migration:run;

echo "Starting the application ${APP}"
npm run start:${APP}