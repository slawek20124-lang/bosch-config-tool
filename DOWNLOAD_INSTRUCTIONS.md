# 📥 INSTRUKCJE POBIERANIA I URUCHOMIENIA
# Download & Run Instructions

```
╔════════════════════════════════════════════════════════════════════════════╗
║                                                                            ║
║      📥 BOSCH eBIKE CONFIG TOOL - DOWNLOAD & RUN INSTRUCTIONS 📥          ║
║                                                                            ║
║                   POBIERZ I URUCHOM W 5 MINUT! ⚡                          ║
║                                                                            ║
╚════════════════════════════════════════════════════════════════════════════╝
```

---

## 🚀 SZYBKIE URUCHOMIENIE (5 MINUT)

### Opcja A: Automatyczne (Zalecane)

```bash
# 1. Pobierz
git clone https://github.com/slawek20124-lang/bosch-config-tool.git

# 2. Wejdź do folderu
cd bosch-config-tool

# 3. Uruchom quick-start skrypt
bash quick-start.sh

# 4. Gotowe! Aplikacja jest uruchomiona
npm start
```

### Opcja B: Manualne

```bash
# 1. Pobierz
git clone https://github.com/slawek20124-lang/bosch-config-tool.git
cd bosch-config-tool

# 2. Zainstaluj
npm install

# 3. Zbuduj
npm run build

# 4. Uruchom
npm start
```

### Opcja C: ZIP Download

```
1. Otwórz: https://github.com/slawek20124-lang/bosch-config-tool
2. Klik: Code → Download ZIP
3. Rozpakuj plik ZIP
4. Otwórz terminal w folderze
5. Uruchom: npm install
6. Uruchom: npm start
```

---

## ✅ WYMAGANIA

```
✓ Node.js v14+ (pobierz z https://nodejs.org/)
✓ npm (instaluje się z Node.js)
✓ 500 MB wolnego miejsca
✓ Stabilne połączenie internetowe (do instalacji)
```

---

## 📱 PIERWSZE KOMENDY

Po uruchomieniu, w nowym terminalu uruchom:

```bash
# Informacje o rowerze
npm run cli bike-info --spec

# Lista profili
npm run cli tuning --list

# ML Models
npm run cli smart-system --models

# Włącz Smart System
npm run cli smart-system --enable

# Analizuj jazdę
npm run cli smart-system --analyze

# Otrzymaj rekomendacje
npm run cli smart-system --recommend
```

---

## 📚 DOKUMENTACJA

Po pobraniu, zapoznaj się z dokumentacją:

```
1. QUICKSTART.md           - Szybki start (5 min)
2. PACKAGE_README.md       - Zawartość pakietu
3. INSTALLATION.md         - Pełna instalacja
4. CUBE_STEREO_140_CONFIGURATION.md - Konfiguracja roweru
5. SMART_SYSTEM_AI_GUIDE.md - Optymalizacja AI
6. TUNING_GUIDE.md         - Profile tuningu
```

---

## 🐛 PROBLEMY?

### Problem: "Node.js not found"
```
→ Pobierz z: https://nodejs.org/
→ Zainstaluj Node.js
→ Uruchom ponownie
```

### Problem: "npm install nie działa"
```bash
rm -rf node_modules package-lock.json
npm install
```

### Problem: "Port 3000 jest w użyciu"
```bash
# Linux/macOS
lsof -i :3000
kill -9 <PID>

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Więcej problemów?
→ Przeczytaj: INSTALLATION.md - Troubleshooting

---

## 🎯 STRUKTURA PO POBRANIU

```
bosch-config-tool/
├── src/                    # Kod źródłowy
├── dist/                   # Skompilowany kod
├── node_modules/           # Zależności
├── 📚 Dokumentacja         # 10 przewodników
├── package.json            # Konfiguracja npm
├── tsconfig.json           # TypeScript config
├── quick-start.sh          # Szybki start
└── README.md               # Główny plik
```

---

## 🎊 GRATULACJE!

Jeśli widzisz to okno, oznacza to że:

✅ Node.js jest zainstalowany  
✅ npm jest zainstalowany  
✅ Wszystkie zależności są zainstalowane  
✅ TypeScript został skompilowany  
✅ Aplikacja jest gotowa do uruchomienia!  

**Teraz możesz zacząć jeździć!** 🚴

---

## 📞 WSPARCIE

**Dokumentacja:** /DOCUMENTATION/ folder  
**GitHub Issues:** https://github.com/slawek20124-lang/bosch-config-tool/issues  
**Quick Help:** npm run cli [command] --help  

---

**Status:** ✅ READY TO USE  
**Version:** 1.0.0  
**Date:** 2026-09-13  

🚀 **ZARAZ ZAZNAJ CZEGO POTRZEBUJESZ I ZACZNIJ!** 🚀
