# Bosch eBike Configuration Tool - Quick Start Guide

## 🚀 Installation & Running

### Automatic Installation (Recommended)

```bash
# Make script executable
chmod +x install.sh

# Run complete installation
./install.sh
```

This will automatically:
1. ✅ Check Node.js installation
2. ✅ Clean previous builds
3. ✅ Install dependencies (`npm install`)
4. ✅ Build the project (`npm run build`)
5. ✅ Verify the installation

---

### Manual Installation

If you prefer to do it step by step:

#### Step 1: Install Dependencies
```bash
npm install
```

**What gets installed:**
- `yargs` - CLI argument parsing
- `chalk` - Terminal colors
- `serialport` - USB communication
- `typescript` - Type safety
- `ts-node` - TypeScript runtime
- `jest` - Testing framework
- `eslint` - Code linting

**Expected output:**
```
added XXX packages in XX.Xs
```

---

#### Step 2: Build the Project
```bash
npm run build
```

**What happens:**
- TypeScript compiles to JavaScript
- All `.ts` files → `.js` in `dist/` folder
- Type checking performed
- Source maps generated

**Expected output:**
```
✅ Build successful
Created dist/ directory with compiled files
```

---

#### Step 3: Run the Application
```bash
npm start
```

or for development:
```bash
npm run dev
```

---

## 📖 Available Commands

After installation, you can use these commands:

### Bike Information
```bash
npm run cli bike-info --spec       # Show Cube Stereo 140 specs
npm run cli bike-info --geometry   # Show bike geometry
```

### Tuning Profiles
```bash
npm run cli tuning --list          # List all profiles
npm run cli tuning --preset SPORT  # Show SPORT profile
npm run cli tuning --status        # System status
npm run cli tuning --optimize      # Auto-optimize
npm run cli tuning --export        # Export configuration
```

### Smart System
```bash
npm run cli smart-system --analyze     # Analyze ride
npm run cli smart-system --predict     # Make predictions
npm run cli smart-system --models      # Show ML models
npm run cli smart-system --recommend   # Get recommendations
```

### Assist Modes
```bash
npm run cli assist --list          # List assist modes
npm run cli assist --set SPORT     # Set assist mode
npm run cli assist --current       # Show current mode
```

### Speed Limits
```bash
npm run cli speed --show           # Show current limit
npm run cli speed --region PL      # Set region
npm run cli speed --unlimited      # Enable unlimited mode
```

---

## ✅ Verification Checklist

After installation, verify everything works:

```bash
# ✅ Check TypeScript compilation
npm run build

# ✅ Check linting
npm run lint

# ✅ Check basic functionality
npm run cli bike-info --spec

# ✅ Check tuning profiles
npm run cli tuning --list

# ✅ Check Smart System
npm run cli smart-system --models
```

---

## 🐛 Troubleshooting

### Node.js not found
```bash
# Install Node.js from https://nodejs.org/
# Or use package manager:
brew install node          # macOS
sudo apt install nodejs    # Ubuntu/Debian
choco install nodejs       # Windows
```

### Dependencies installation fails
```bash
# Clear npm cache
npm cache clean --force

# Remove lock files
rm -rf node_modules package-lock.json

# Retry installation
npm install
```

### Build fails
```bash
# Clean build
rm -rf dist/

# Rebuild
npm run build
```

### TypeScript errors
```bash
# Check TypeScript version
npm ls typescript

# Reinstall TypeScript
npm install typescript@latest
```

---

## 📊 System Requirements

- **Node.js**: 14.0.0 or higher
- **npm**: 6.0.0 or higher
- **RAM**: 512 MB minimum
- **Disk Space**: ~200 MB (including node_modules)
- **OS**: Windows, macOS, Linux

---

## 🎯 Next Steps

1. ✅ Run `./install.sh` or `npm install && npm run build`
2. ✅ Verify with test commands
3. ✅ Read TUNING_GUIDE.md for Cube Stereo 140 setup
4. ✅ Use CLI commands to manage your eBike
5. ✅ Configure tuning profiles as needed

---

## 📚 Documentation

- **README.md** - Project overview
- **TUNING_GUIDE.md** - Cube Stereo 140 2023 + Bosch Gen 4 guide
- **SETUP.md** - Detailed configuration
- **package.json** - Dependencies and scripts

---

## 🚀 Ready to Go!

Your Bosch eBike Configuration Tool is now installed and ready to use! 🎉

Happy riding! 🚴
