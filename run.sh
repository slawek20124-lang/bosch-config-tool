#!/bin/bash
# Run Bosch Config Tool

echo "Bosch eBike Config Tool (Offline Mode)"
echo "========================================"
echo ""

if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
fi

echo "Starting application..."
npm start
