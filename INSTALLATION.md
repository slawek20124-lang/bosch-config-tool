# Complete Installation Instructions
# Pełne instrukcje instalacji - Bosch eBike Config Tool

## 📋 System Requirements

- **Node.js**: 14.0.0 or higher
- **npm**: 6.0.0 or higher
- **RAM**: 512 MB minimum
- **Disk Space**: ~200 MB
- **OS**: Windows, macOS, or Linux

---

## 🚀 Quick Start (Recommended)

### Option 1: Automatic Installation Script

```bash
# 1. Clone or download the repository
git clone https://github.com/slawek20124-lang/bosch-config-tool.git
cd bosch-config-tool

# 2. Make script executable (Linux/macOS)
chmod +x install.sh

# 3. Run automatic installation
./install.sh
```

This single script will:
- ✅ Check Node.js installation
- ✅ Clean previous builds
- ✅ Run `npm install`
- ✅ Run `npm run build`
- ✅ Verify installation

---

### Option 2: Manual Step-by-Step Installation

```bash
# Step 1: Navigate to project directory
cd bosch-config-tool

# Step 2: Install dependencies
npm install

# Expected output:
# added XXX packages in XX.Xs

# Step 3: Build the project
npm run build

# Expected output:
# Successfully compiled TypeScript
# Created dist/ directory

# Step 4: Run the application
npm start

# Or for development:
npm run dev
```

---

## ✅ Verification

After installation, verify everything works:

```bash
# Make test script executable (Linux/macOS)
chmod +x test.sh

# Run tests
./test.sh
```

Or test manually:

```bash
# Test 1: Show bike info
npm run cli bike-info --spec

# Test 2: List tuning profiles
npm run cli tuning --list

# Test 3: Show ML models
npm run cli smart-system --models

# Test 4: Get AI recommendations
npm run cli smart-system --recommend
```

---

## 📦 What Gets Installed

### Dependencies (Production)

```json
{
  "yargs": "^17.7.2",           // CLI argument parsing
  "chalk": "^4.1.2",            // Terminal colors
  "serialport": "^9.2.8",       // USB communication
  "crypto": "^1.0.1"            // Encryption
}
```

### Dev Dependencies

```json
{
  "@types/node": "^20.3.1",
  "@types/yargs": "^17.0.24",
  "typescript": "^5.1.3",
  "ts-node": "^10.9.1",
  "jest": "^29.5.0",
  "@types/jest": "^29.5.2",
  "eslint": "^8.43.0",
  "@typescript-eslint/eslint-plugin": "^5.59.11",
  "@typescript-eslint/parser": "^5.59.11"
}
```

---

## 🔧 Build Process

### What `npm run build` does:

1. **Compiles TypeScript**
   - Converts all `.ts` files to `.js`
   - Performs type checking
   - Generates source maps for debugging

2. **Creates dist/ directory**
   ```
   dist/
   ├── cli/
   │   ├── commands/
   │   │   ├── bike-info.js
   │   │   ├── tuning.js
   │   │   ├── smart-system.js
   │   │   └── ...
   │   └── index.js
   └── lib/
       ├── motor-generation.js
       ├── smart-system-core.js
       ├── ml-models.js
       ├── ai-predictor.js
       └── ...
   ```

3. **Validates TypeScript**
   - No type errors
   - All imports resolved
   - Strict mode enabled

---

## 🎯 Available Commands After Installation

### Development
```bash
npm run dev         # Run in development mode (ts-node)
npm run build       # Build TypeScript to JavaScript
npm start           # Run production build
npm run lint        # Check code style
npm run test        # Run Jest tests
clean               # Remove build files
```

### CLI Commands
```bash
# Bike Info
npm run cli bike-info --spec
npm run cli bike-info --geometry

# Tuning
npm run cli tuning --list
npm run cli tuning --preset SPORT
npm run cli tuning --apply
npm run cli tuning --status

# Smart System
npm run cli smart-system --analyze
npm run cli smart-system --predict
npm run cli smart-system --models
npm run cli smart-system --recommend

# And many more...
```

---

## 🐛 Troubleshooting

### Issue: "node: command not found"

```bash
# Install Node.js
# Option 1: From official website
https://nodejs.org/

# Option 2: Using package manager
brew install node          # macOS
sudo apt install nodejs    # Ubuntu/Debian
choco install nodejs       # Windows (with Chocolatey)
```

### Issue: "npm ERR! 404 Not Found"

```bash
# Clear npm cache
npm cache clean --force

# Try installation again
rm -rf node_modules package-lock.json
npm install
```

### Issue: "TypeScript compilation failed"

```bash
# Clean and rebuild
rm -rf dist/
npm run build

# Check for type errors
npm run lint
```

### Issue: "Port already in use"

```bash
# Kill process on port 3000 (if using Electron)
# Linux/macOS:
lsof -i :3000
kill -9 <PID>

# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

---

## 📊 Installation Checklist

- [ ] Node.js 14+ installed
- [ ] npm 6+ installed
- [ ] Repository cloned/downloaded
- [ ] `cd bosch-config-tool`
- [ ] `npm install` completed
- [ ] `npm run build` completed successfully
- [ ] `dist/` directory created
- [ ] CLI commands work (`npm run cli bike-info --spec`)
- [ ] All tests pass (`./test.sh`)

---

## 🎓 Next Steps

1. ✅ Complete installation
2. ✅ Verify with test commands
3. ✅ Read **TUNING_GUIDE.md** for Cube Stereo 140 setup
4. ✅ Read **SETUP.md** for configuration options
5. ✅ Use CLI commands to manage your eBike
6. ✅ Configure tuning profiles as needed

---

## 📚 Documentation Files

- **README.md** - Project overview
- **QUICKSTART.md** - Quick start guide
- **SETUP.md** - Detailed configuration
- **TUNING_GUIDE.md** - Cube Stereo 140 2023 + Bosch Gen 4
- **INSTALLATION_GUIDE.ts** - Installation code examples

---

## ✨ Complete!

Your Bosch eBike Configuration Tool is installed and ready! 🎉

```
╔════════════════════════════════════════════╗
║  ✅ INSTALLATION COMPLETE!                 ║
║  🚀 Ready to configure your eBike          ║
║  🧠 Smart System AI enabled                ║
║  🚲 Cube Stereo 140 2023 supported         ║
╚════════════════════════════════════════════╝
```

Happy riding! 🚴
