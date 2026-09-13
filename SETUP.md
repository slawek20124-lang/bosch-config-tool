# Bosch eBike Configuration Tool

## Project Structure

```
src/
├── cli/
│   ├── commands/
│   │   ├── motor.ts
│   │   └── smart.ts
│   └── index.ts
└── lib/
    ├── motor-generation.ts
    └── smart-system.ts
```

## 🚀 Getting Started

### Prerequisites
- Node.js 14+
- npm or yarn

### Installation

```bash
git clone <repo>
cd bosch-config-tool
npm install
```

### Development

```bash
npm run dev
```

### Production Build

```bash
npm run build
npm start
```

## 📊 Commands

### Motor Commands
```bash
npm run cli motor --info      # Show motor info
npm run cli motor --detect    # Detect motor
```

### Smart System Commands
```bash
npm run cli smart --enable    # Enable Smart System
npm run cli smart --status    # Show status
```

## 🔌 Offline Mode

This application works completely offline:
- 💾 All data stored locally
- 🔐 No internet connection required
- 🌟 Self-contained modules
- ⚡ Fast performance

## 🔐 Security & Privacy

- 🔒 End-to-end encryption
- 🔗 No cloud sync
- 🔌 No telemetry
- 🔓 Local configuration only

## 🧐 Smart System Features

- 🤖 AI-powered assistance
- 🌲 Weather adaptation
- 🖭 Terrain detection
- 📚 Machine learning
- ⚡ Energy optimization

## 🔘 Motor Support

- Bosch Performance CX Gen 4 (Primary)
- Performance Line Gen 1-3
- Active Line Gen 1-2
- Other Bosch motor generations

## 💁 Support

For issues or questions, please contact the developer.

## 📝 License

MIT License - See LICENSE file
