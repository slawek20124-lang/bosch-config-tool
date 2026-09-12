/**
 * Offline Firmware Updater for Bosch eBike
 * Aktualizacja firmware'u bez dostępu do internetu
 */

import * as fs from 'fs';
import * as path from 'path';

export interface FirmwareFile {
  name: string;
  version: string;
  size: number;
  checksum: string;
  releaseDate: Date;
  path: string;
}

export interface UpdateProgress {
  total: number;
  current: number;
  percentage: number;
  status: string;
}

export class OfflineUpdater {
  private firmwareDir: string = './firmware';
  private exportDir: string = './export';
  private mobileDir: string = './mobile-updates';

  constructor() {
    this.ensureDirectories();
  }

  /**
   * Upewnij się, że katalogi istnieją
   */
  private ensureDirectories(): void {
    const dirs = [this.firmwareDir, this.exportDir, this.mobileDir];
    dirs.forEach((dir) => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  }

  /**
   * Generuj plik aktualizacji offline
   */
  async generateOfflineFile(version: string): Promise<string> {
    console.log(`\n📦 Generowanie pliku aktualizacji offline...\n`);

    // Symulacja generowania
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const filename = `bosch-firmware-${version}-offline.bin`;
    const filepath = path.join(this.firmwareDir, filename);

    // Utwórz plik
    const mockData = Buffer.from(`Firmware ${version}`);
    fs.writeFileSync(filepath, mockData);

    console.log(`✅ Plik wygenerowany: ${filename}`);
    console.log(`   Rozmiar: ${(mockData.length / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   Ścieżka: ${filepath}\n`);

    return filepath;
  }

  /**
   * Wyeksportuj do USB
   */
  async exportToUSB(firmwarePath: string, usbPath: string): Promise<boolean> {
    console.log(`\n💾 Eksportowanie na USB...\n`);

    if (!fs.existsSync(firmwarePath)) {
      console.error('❌ Plik firmware nie istnieje');
      return false;
    }

    try {
      const filename = path.basename(firmwarePath);
      const destPath = path.join(usbPath, filename);

      fs.copyFileSync(firmwarePath, destPath);

      console.log(`✅ Plik skopiowany na USB`);
      console.log(`   Plik: ${filename}`);
      console.log(`   Ścieżka docelowa: ${destPath}\n`);

      return true;
    } catch (error) {
      console.error(`❌ Błąd exportu: ${error}\n`);
      return false;
    }
  }

  /**
   * Wyeksportuj dla mobile'a
   */
  async exportForMobile(firmwarePath: string): Promise<string> {
    console.log(`\n📱 Przygotowanie pliku dla mobile'a...\n`);

    if (!fs.existsSync(firmwarePath)) {
      console.error('❌ Plik firmware nie istnieje');
      return '';
    }

    const filename = path.basename(firmwarePath);
    const mobilePath = path.join(this.mobileDir, filename);

    fs.copyFileSync(firmwarePath, mobilePath);

    console.log(`✅ Plik przygotowany dla mobile'a`);
    console.log(`   Plik: ${filename}`);
    console.log(`   Ścieżka: ${mobilePath}\n`);

    return mobilePath;
  }

  /**
   * Zainstaluj z pliku lokalnego
   */
  async installFromLocal(filePath: string): Promise<boolean> {
    console.log(`\n⚙️  Instalacja z pliku lokalnego...\n`);

    if (!fs.existsSync(filePath)) {
      console.error('❌ Plik nie istnieje');
      return false;
    }

    const fileSize = fs.statSync(filePath).size;
    console.log(`📦 Plik: ${path.basename(filePath)}`);
    console.log(`   Rozmiar: ${(fileSize / 1024 / 1024).toFixed(2)} MB\n`);

    // Symulacja instalacji
    for (let i = 0; i <= 100; i += 10) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      console.log(`⏳ Postęp: ${i}%`);
    }

    console.log(`\n✅ Instalacja zakończona pomyślnie!`);
    console.log(`⚠️  Proszę nie przerywać zasilania urządzenia\n`);

    return true;
  }

  /**
   * Zainstaluj z USB
   */
  async installFromUSB(usbPath: string): Promise<boolean> {
    console.log(`\n💾 Instalacja z USB...\n`);
    console.log(`Skanowanie USB: ${usbPath}\n`);

    const files = fs.readdirSync(usbPath).filter((file) => file.endsWith('.bin'));

    if (files.length === 0) {
      console.error('❌ Brak pliku firmware na USB');
      return false;
    }

    const firmwareFile = files[0];
    const filePath = path.join(usbPath, firmwareFile);

    return this.installFromLocal(filePath);
  }

  /**
   * Generuj QR code dla mobile'a
   */
  generateQRCode(filePath: string): string {
    const filename = path.basename(filePath);
    const qrCode = `https://bosch-config-tool.local/update?file=${encodeURIComponent(filename)}`;

    console.log(`\n📲 QR Code dla mobile'a:\n`);
    console.log(qrCode);
    console.log(`\nZeskanuj QR code aplikacją mobilną aby pobrać plik firmware\n`);

    return qrCode;
  }

  /**
   * Pokaż historię aktualizacji
   */
  showUpdateHistory(): void {
    console.log(`\n📜 Historia aktualizacji:\n`);

    const mockHistory = [
      { version: '4.2.1', date: '2026-09-10', status: '✅ Pomyślnie' },
      { version: '4.2.0', date: '2026-08-15', status: '✅ Pomyślnie' },
      { version: '4.1.9', date: '2026-07-20', status: '✅ Pomyślnie' },
    ];

    mockHistory.forEach((update) => {
      console.log(`${update.status} Wersja ${update.version} (${update.date})`);
    });
    console.log();
  }

  /**
   * Przywróć poprzednią wersję
   */
  async rollback(version: string): Promise<boolean> {
    console.log(`\n⏮️  Przywracanie wersji ${version}...\n`);

    const backupPath = path.join(this.firmwareDir, `backup-${version}.bin`);

    if (!fs.existsSync(backupPath)) {
      console.error(`❌ Kopia zapasowa nie istnieje`);
      return false;
    }

    return this.installFromLocal(backupPath);
  }
}
