#!/bin/bash
# Quick Start Script - Szybkie Uruchomienie
# Bosch eBike Config Tool - Complete Setup & Run

echo ""
echo "╔════════════════════════════════════════════════════════════════════════════╗"
echo "║                                                                            ║"
echo "║         🚀 BOSCH eBIKE CONFIG TOOL - QUICK START 🚀                        ║"
echo "║                                                                            ║"
echo "║              Cube Stereo 140 2023 + Bosch Performance CX Gen 4             ║"
echo "║                         Smart System AI Integrated                         ║"
echo "║                                                                            ║"
echo "╚════════════════════════════════════════════════════════════════════════════╝"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Step 1: Check Node.js
echo -e "${BLUE}[1/6] Checking Node.js installation...${NC}"
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✅ Node.js installed: $NODE_VERSION${NC}"
else
    echo -e "${YELLOW}❌ Node.js not found!${NC}"
    echo -e "${YELLOW}Please install Node.js from: https://nodejs.org/${NC}"
    exit 1
fi
echo ""

# Step 2: Check npm
echo -e "${BLUE}[2/6] Checking npm installation...${NC}"
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo -e "${GREEN}✅ npm installed: $NPM_VERSION${NC}"
else
    echo -e "${YELLOW}❌ npm not found!${NC}"
    exit 1
fi
echo ""

# Step 3: Install dependencies
echo -e "${BLUE}[3/6] Installing dependencies...${NC}"
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Installing npm packages...${NC}"
    npm install
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Dependencies installed successfully${NC}"
    else
        echo -e "${YELLOW}❌ Failed to install dependencies${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✅ Dependencies already installed${NC}"
fi
echo ""

# Step 4: Build TypeScript
echo -e "${BLUE}[4/6] Building TypeScript...${NC}"
npm run build
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Build successful${NC}"
else
    echo -e "${YELLOW}❌ Build failed${NC}"
    exit 1
fi
echo ""

# Step 5: Verify installation
echo -e "${BLUE}[5/6] Verifying installation...${NC}"
if [ -d "dist" ]; then
    echo -e "${GREEN}✅ Build directory verified${NC}"
else
    echo -e "${YELLOW}❌ Build directory not found${NC}"
    exit 1
fi
echo ""

# Step 6: Ready to start
echo -e "${BLUE}[6/6] Installation complete!${NC}"
echo ""
echo -e "${GREEN}╔════════════════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                                                                            ║${NC}"
echo -e "${GREEN}║  ✅ Installation Complete! Application is Ready to Run!                    ║${NC}"
echo -e "${GREEN}║                                                                            ║${NC}"
echo -e "${GREEN}║  📊 System Status:                                                        ║${NC}"
echo -e "${GREEN}║     • Node.js: $NODE_VERSION                                              ║${NC}"
echo -e "${GREEN}║     • npm: $NPM_VERSION                                                      ║${NC}"
echo -e "${GREEN}║     • TypeScript: Compiled ✅                                             ║${NC}"
echo -e "${GREEN}║     • Dependencies: Installed ✅                                          ║${NC}"
echo -e "${GREEN}║     • Build: Successful ✅                                                ║${NC}"
echo -e "${GREEN}║                                                                            ║${NC}"
echo -e "${GREEN}║  🚀 Ready to Start!                                                       ║${NC}"
echo -e "${GREEN}║                                                                            ║${NC}"
echo -e "${GREEN}║  Start the application with:                                              ║${NC}"
echo -e "${GREEN}║                                                                            ║${NC}"
echo -e "${GREEN}║     npm start                                                              ║${NC}"
echo -e "${GREEN}║                                                                            ║${NC}"
echo -e "${GREEN}║  Or try test commands:                                                    ║${NC}"
echo -e "${GREEN}║                                                                            ║${NC}"
echo -e "${GREEN}║     npm run cli bike-info --spec                                           ║${NC}"
echo -e "${GREEN}║     npm run cli tuning --list                                              ║${NC}"
echo -e "${GREEN}║     npm run cli smart-system --models                                      ║${NC}"
echo -e "${GREEN}║                                                                            ║${NC}"
echo -e "${GREEN}║  📖 Documentation:                                                        ║${NC}"
echo -e "${GREEN}║     • QUICKSTART.md - Start in 5 minutes                                  ║${NC}"
echo -e "${GREEN}║     • CUBE_STEREO_140_CONFIGURATION.md - Bike setup                       ║${NC}"
echo -e "${GREEN}║     • SMART_SYSTEM_AI_GUIDE.md - AI optimization                          ║${NC}"
echo -e "${GREEN}║     • DEPLOYMENT.md - Full deployment info                                ║${NC}"
echo -e "${GREEN}║                                                                            ║${NC}"
echo -e "${GREEN}║  Happy riding! 🚴💨                                                        ║${NC}"
echo -e "${GREEN}║                                                                            ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${YELLOW}Ready to run? Type: npm start${NC}"
echo ""
