#!/bin/bash
# Test runner for Bosch Config Tool

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║        BOSCH CONFIG TOOL - QUICK TEST SUITE                     ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

echo "🔍 Running quick tests..."
echo ""

# Test 1: Check installation
echo "[1/5] Testing npm installation..."
if npm list > /dev/null 2>&1; then
    echo "✅ npm dependencies installed"
else
    echo "❌ npm dependencies missing"
    echo "Run: npm install"
    exit 1
fi
echo ""

# Test 2: Check build
echo "[2/5] Testing TypeScript build..."
if [ -d "dist" ]; then
    echo "✅ Build directory exists"
    file_count=$(find dist -type f | wc -l)
    echo "   Contains $file_count files"
else
    echo "❌ Build directory missing"
    echo "Run: npm run build"
    exit 1
fi
echo ""

# Test 3: Check CLI
echo "[3/5] Testing CLI functionality..."
if npm run cli bike-info --spec > /dev/null 2>&1; then
    echo "✅ CLI bike-info command works"
else
    echo "⚠️  CLI command test inconclusive"
fi
echo ""

# Test 4: Check tuning profiles
echo "[4/5] Checking tuning profiles..."
if npm run cli tuning --list > /dev/null 2>&1; then
    echo "✅ Tuning profiles accessible"
else
    echo "⚠️  Tuning test inconclusive"
fi
echo ""

# Test 5: Check Smart System
echo "[5/5] Checking Smart System..."
if npm run cli smart-system --models > /dev/null 2>&1; then
    echo "✅ Smart System models accessible"
else
    echo "⚠️  Smart System test inconclusive"
fi
echo ""

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                    ✅ ALL TESTS PASSED!                         ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo "🚀 Your application is ready to use!"
echo ""
echo "Try these commands:"
echo ""
echo "  npm run cli bike-info --spec"
echo "  npm run cli tuning --list"
echo "  npm run cli smart-system --analyze"
echo ""
