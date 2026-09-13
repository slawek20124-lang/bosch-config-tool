#!/bin/bash
# Complete Installation and Build Script
# Pełny skrypt instalacji i kompilacji

set -e

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║   BOSCH eBIKE CONFIG TOOL - COMPLETE INSTALLATION              ║"
echo "║   Cube Stereo 140 2023 + Bosch Performance CX Gen 4             ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Step 1: Check Node.js
echo "📋 Step 1: Checking Node.js installation..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed!"
    echo "Please install Node.js 14+ from https://nodejs.org/"
    exit 1
fi
echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"
echo ""

# Step 2: Clean previous build
echo "🧹 Step 2: Cleaning previous build..."
rm -rf dist node_modules package-lock.json 2>/dev/null || true
echo "✅ Cleaned old files"
echo ""

# Step 3: npm install
echo "📦 Step 3: Installing dependencies (npm install)..."
echo "⏳ This may take a few minutes..."
echo ""
npm install
echo ""
echo "✅ Dependencies installed successfully!"
echo ""

# Step 4: Build
echo "🔨 Step 4: Building project (npm run build)..."
npm run build
echo ""
echo "✅ Build completed successfully!"
echo ""

# Step 5: Verify build
echo "🔍 Step 5: Verifying build..."
if [ -d "dist" ]; then
    echo "✅ Build directory exists"
    echo "   Files: $(find dist -type f | wc -l) files"
else
    echo "❌ Build directory not found!"
    exit 1
fi
echo ""

# Step 6: Display ready message
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                    ✅ INSTALLATION COMPLETE!                    ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo "🚀 Your application is ready to run!"
echo ""
echo "📖 Usage:"
echo ""
echo "   Development mode:"
echo "   $ npm run dev"
echo ""
echo "   CLI Commands:"
echo "   $ npm run cli bike-info --spec"
echo "   $ npm run cli tuning --list"
echo "   $ npm run cli smart-system --analyze"
echo ""
echo "   Production:"
echo "   $ npm start"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📚 Documentation:"
echo "   - README.md: Project overview"
echo "   - SETUP.md: Detailed setup guide"
echo "   - TUNING_GUIDE.md: Cube Stereo 140 + Bosch Gen 4 guide"
echo ""
echo "🧠 Smart System Features:"
echo "   ✅ AI-Powered Assistance"
echo "   ✅ Pre-trained ML Models (92%+ accuracy)"
echo "   ✅ Real-time Predictions"
echo "   ✅ Offline Ready (No Internet Required)"
echo ""
echo "🚲 Bike & Motor Support:"
echo "   ✅ Cube Stereo 140 2023"
echo "   ✅ Bosch Performance CX Gen 4"
echo "   ✅ 4 Tuning Profiles (ECO, TOUR, SPORT, TURBO)"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "✨ Happy Riding! 🚴"
echo ""
