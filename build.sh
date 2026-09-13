#!/bin/bash
# Build script for Bosch Config Tool

echo "Building Bosch Config Tool..."

# Clean old build
rm -rf dist/

# Install dependencies
echo "Installing dependencies..."
npm install

# Build TypeScript
echo "Building TypeScript..."
npm run build

echo "Build complete! Run 'npm start' to run the application."
