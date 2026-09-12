# Bosch e-Bike Configuration Tool

Electron GUI i Node.js CLI do zarządzania konfiguracją rowerów elektrycznych Bosch przez USB z obsługą formatu binarnego.

## 📋 Spis treści

- [Cechy](#cechy)
- [Wymagania](#wymagania)
- [Instalacja](#instalacja)
- [Użycie](#użycie)
  - [GUI (Electron)](#gui-electron)
  - [CLI (Node.js)](#cli-nodejs)
- [Architektura](#architektura)
- [API](#api)
- [Debugowanie](#debugowanie)
- [Struktura projektu](#struktura-projektu)
- [Licencja](#licencja)

---

## ✨ Cechy

- 🖥️ **GUI** - Nowoczesny interfejs Electron dla Windows, macOS, Linux
- 💻 **CLI** - Narzędzie wiersza poleceń do automatyzacji
- 📱 **USB Support** - Obsługa pamięci masowej USB (Hot-swap)
- 📦 **Binary Format** - Parser dla formatu binarnego Bosch
- 🔍 **Debugging** - Eksport do JSON dla ułatwienia debugowania
- ⚙️ **Cross-platform** - Uniwersalne dla wszystkich systemów
- 🔒 **Bezpieczny** - Context Isolation w Electron
- 📄 **TypeScript** - Całkowita typizacja kodu

---

## 📋 Wymagania

### Minimalne
- **Node.js** 16+ (https://nodejs.org/)
- **npm** lub **yarn**
- **Git**

### Do pracy z urządzeniem
- Rower Bosch eBike podłączony przez USB
- Sterowniki USB (zazwyczaj wbudowane w system)

### Do budowania aplikacji
- Python 3.7+ (dla electron-builder)
- Visual C++ Build Tools (Windows)
- Xcode Command Line Tools (macOS)

---

## 🚀 Instalacja

### 1. Klonowanie repozytorium

```bash
git clone https://github.com/slawek20124-lang/bosch-config-tool.git
cd bosch-config-tool
```

### 2. Instalacja zależności

```bash
npm install
```

### 3. Kompilacja TypeScript

```bash
npm run build
```

---

## 💻 Użycie

### GUI (Electron)

#### Uruchomienie w trybie development

```bash
npm run dev
```

Otwiera okno Electron z interfejsem graficznym. Automat reloaduje zmiany w kodzie.

#### Budowanie aplikacji

```bash
npm run build
```

Tworzy pliki instalacyjne dla:
- **Windows** (.exe)
- **macOS** (.dmg)
- **Linux** (.AppImage)

---

### CLI (Node.js)

#### 1. Read - Odczyt konfiguracji z urządzenia

```bash
npm run cli read --device /Volumes/BOSCH
```

**Parametry:**
- `--device, -d` (wymagany): Ścieżka do urządzenia USB
- `--output, -o` (opcjonalny): Plik do zapisania

**Przykłady:**

```bash
# macOS
npm run cli read --device /Volumes/BOSCH

# Linux
npm run cli read --device /mnt/bosch

# Windows
npm run cli read --device E:\

# Z zapisem do pliku
npm run cli read --device /Volumes/BOSCH --output config.bin
```

---

#### 2. Write - Zapis konfiguracji na urządzenie

```bash
npm run cli write --device /Volumes/BOSCH --config config.bin
```

**Parametry:**
- `--device, -d` (wymagany): Ścieżka do urządzenia USB
- `--config, -c` (wymagany): Plik konfiguracji binarnej

**Przykład:**

```bash
npm run cli write --device /Volumes/BOSCH --config backup.bin
```

⚠️ **OSTRZEŻENIE**: Operacja zapis jest nieodwracalna! Utwórz kopię zapasową przed zapisem.

---

#### 3. Export - Konwersja binary → JSON

```bash
npm run cli export --config config.bin --output config.json
```

**Parametry:**
- `--config, -c` (wymagany): Plik konfiguracji binarnej
- `--output, -o` (wymagany): Plik JSON

**Przykład:**

```bash
npm run cli export --config config.bin --output debug-config.json
```

Generuje plik JSON czytelny dla człowieka - idealny do debugowania.

---

#### 4. Import - Konwersja JSON → binary

```bash
npm run cli import --json config.json --output config.bin
```

**Parametry:**
- `--json, -j` (wymagany): Plik JSON
- `--output, -o` (wymagany): Wyjściowy plik binarny

**Przykład:**

```bash
npm run cli import --json modified-config.json --output new-config.bin
```

---

## 🏗️ Architektura

### Struktura warstw

```
┌─────────────────────────────────────┐
│   GUI (Electron + React)            │
│   src/renderer/                     │
└────────────┬────────────────────────┘
             │
┌────────────▼────────────────────────┐
│   Main Process (Electron)           │
│   src/electron/main.ts              │
└────────────┬────────────────────────┘
             │
┌────────────▼────────────────────────┐
│   Shared Libraries                  │
│   src/lib/                          │
│   - USBManager (usb.ts)             │
│   - BinaryParser (binary.ts)        │
└────────────┬────────────────────────┘
             │
┌────────────▼────────────────────────┐
│   CLI Commands                      │
│   src/cli/commands/                 │
│   - read.ts, write.ts               │
│   - export.ts, import.ts            │
└─────────────────────────────────────┘
```

### Komponenty

#### USB Manager (`src/lib/usb.ts`)

Zarządza dostępem do plików na urządzeniu USB.

```typescript
const usb = new USBManager('/Volumes/BOSCH');

// Sprawdzenie dostępu
if (usb.isConnected()) {
  // Odczyt konfiguracji
  const buffer = usb.readConfig('config.bin');
  
  // Zapis konfiguracji
  usb.writeConfig(buffer, 'config.bin');
  
  // Lista plików
  const files = usb.listFiles();
}
```

#### Binary Parser (`src/lib/binary.ts`)

Parsuje format binarny Bosch do obiektu JSON i odwrotnie.

```typescript
// Parse binary → JSON
const config = BinaryParser.parse(buffer);

// Serialize JSON → binary
const buffer = BinaryParser.serialize(config);
```

#### CLI (`src/cli/`)

Cztery główne komendy:
- `read` - Odczyt konfiguracji
- `write` - Zapis konfiguracji
- `export` - Konwersja do JSON
- `import` - Konwersja z JSON

---

## 📡 API

### Electron IPC (GUI ↔ Main Process)

```typescript
// W preload.ts
contextBridge.exposeInMainWorld('api', {
  readConfig: (devicePath: string) => ipcRenderer.invoke('read-config', devicePath),
  writeConfig: (devicePath, configPath) => ipcRenderer.invoke('write-config', devicePath, configPath),
  exportToJson: (configPath) => ipcRenderer.invoke('export-json', configPath),
  importFromJson: (jsonPath) => ipcRenderer.invoke('import-json', jsonPath),
});
```

### Użycie w React

```typescript
// W App.tsx
const result = await (window as any).api.readConfig('/Volumes/BOSCH');
console.log(result);
```

---

## 🔍 Debugowanie

### 1. Włączenie DevTools w Electron

```bash
npm run electron-dev
```

Otwiera debugger V8 na porcie 5858.

### 2. Eksport do JSON dla debugowania

```bash
npm run cli export --config config.bin --output debug.json
```

Następnie edytuj i przeimportuj:

```bash
npm run cli import --json debug.json --output config-modified.bin
```

### 3. Logi konsolowe

```typescript
console.log('Debug info:', data);
console.error('Error:', error);
```

W Electron: DevTools (Ctrl+Shift+I)
W CLI: Standardowy stderr

---

## 📁 Struktura projektu

```
bosch-config-tool/
├── src/
│   ├── electron/
│   │   ├── main.ts              # Główny proces Electron
│   │   └── preload.ts           # Preload script (bezpieczeństwo)
│   ├── renderer/
│   │   ├── App.tsx              # Główny komponent React
│   │   ├── App.css              # Style
│   │   └── index.tsx            # Entry point React
│   ├── cli/
│   │   ├── index.ts             # CLI router
│   │   └── commands/
│   │       ├── read.ts          # Komenda: read
│   │       ├── write.ts         # Komenda: write
│   │       ├── export.ts        # Komenda: export
│   │       └── import.ts        # Komenda: import
│   └── lib/
│       ├── usb.ts              # USB Manager
│       └── binary.ts           # Binary Parser
├── public/
│   └── index.html              # HTML template
├── dist/                       # Kompilowany kod (auto-generated)
├── build/                      # Aplikacja (auto-generated)
├── package.json                # Zależności i skrypty
├── tsconfig.json               # Konfiguracja TypeScript
├── .gitignore                  # Pliki Git do ignorowania
└── README.md                   # Ta dokumentacja
```

---

## 📝 Format binarny Bosch

### Struktura (placeholder)

| Offset | Rozmiar | Typ | Opis |
|--------|---------|-----|------|
| 0 | 1 byte | uint8 | Wersja |
| 1-9 | 9 bytes | string | ID urządzenia |
| 10 | 1 byte | uint8 | Maks. prędkość |
| 11 | 1 byte | uint8 | Poziom asystencji |
| 12 | 1 byte | uint8 | Jasność wyświetlacza |
| 13-17 | 5 bytes | string | Język |

⚠️ **UWAGA**: Aktualna implementacja jest placeholder'em. Zastąp rzeczywistą specyfikacją formatu Bosch.

---

## 🧪 Testy

```bash
# Uruchomienie testów
npm test

# Linting kodu
npm run lint
```

---

## 🐛 Rozwiązywanie problemów

### Problem: Device not found

```
❌ Device not found: /Volumes/BOSCH
```

**Rozwiązanie:**
1. Sprawdź, czy urządzenie jest podłączone
2. Sprawdź ścieżkę mountu: `mount` (Linux/macOS) lub `diskpart` (Windows)
3. Na Windows: Użyj litery dysku (np. `E:\`)

### Problem: Permission denied

```
❌ Error: EACCES: permission denied
```

**Rozwiązanie:**
1. Linux: `sudo chmod 755 /mnt/bosch`
2. Windows: Uruchom z uprawnieniami administratora
3. macOS: Sprawdź uprawnienia w System Preferences

### Problem: Cannot find module

```
❌ Cannot find module 'yargs'
```

**Rozwiązanie:**
```bash
npm install
npm run build
```

---

## 📦 Build i dystrybucja

### Budowanie instalatora

```bash
npm run build
```

Generuje:
- `dist/bosch-config-tool-1.0.0.exe` (Windows)
- `dist/bosch-config-tool-1.0.0.dmg` (macOS)
- `dist/bosch-config-tool-1.0.0.AppImage` (Linux)

### Konfiguracja electron-builder

Edytuj `package.json`:

```json
{
  "build": {
    "appId": "com.bosch-config-tool",
    "productName": "Bosch Config Tool",
    "directories": {
      "buildResources": "assets"
    }
  }
}
```

---

## 🤝 Wkład

Chcesz współtworzyć? Świetnie!

1. Fork repozytorium
2. Utwórz branch (`git checkout -b feature/amazing-feature`)
3. Commit zmiany (`git commit -m 'Add amazing feature'`)
4. Push do branch (`git push origin feature/amazing-feature`)
5. Otwórz Pull Request

---

## 📄 Licencja

MIT License - zobacz plik `LICENSE`

---

## 📞 Support

- 📧 Email: slawek2012_4@hotmail.com
- 🐛 Issues: https://github.com/slawek20124-lang/bosch-config-tool/issues
- 💬 Discussions: https://github.com/slawek20124-lang/bosch-config-tool/discussions

---

## 📚 Przydatne linki

- [Electron Docs](https://www.electronjs.org/docs)
- [React Docs](https://react.dev)
- [TypeScript Docs](https://www.typescriptlang.org/docs/)
- [Yargs CLI](https://yargs.js.org/)

---

**Ostatnia aktualizacja:** 2026-09-12  
**Wersja:** 1.0.0
