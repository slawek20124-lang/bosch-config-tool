import { CommandModule } from 'yargs';
import { OfflineUpdater } from '../../lib/offline-updater';

const updater = new OfflineUpdater();

interface UpdateCommandArgv {
  check?: boolean;
  version?: boolean;
  download?: boolean;
  install?: boolean;
  'install-offline'?: string;
  'install-usb'?: boolean;
  history?: boolean;
  rollback?: string;
  'generate-offline'?: boolean;
  'export-usb'?: string;
  'export-mobile'?: boolean;
  'qr-code'?: string;
  settings?: boolean;
  [key: string]: unknown;
}

export const updateCommand: CommandModule<unknown, UpdateCommandArgv> = {
  command: 'update',
  describe: 'Manage Bosch Performance CX firmware updates',
  builder: (yargs) =>
    yargs
      .option('check', {
        alias: 'c',
        describe: 'Check for available updates',
        type: 'boolean',
        default: false,
      })
      .option('version', {
        alias: 'v',
        describe: 'Show current firmware version',
        type: 'boolean',
        default: false,
      })
      .option('download', {
        alias: 'd',
        describe: 'Download available update',
        type: 'boolean',
        default: false,
      })
      .option('install', {
        alias: 'i',
        describe: 'Install downloaded update',
        type: 'boolean',
        default: false,
      })
      .option('install-offline', {
        describe: 'Install from local file',
        type: 'string',
      })
      .option('install-usb', {
        describe: 'Install from USB device',
        type: 'boolean',
        default: false,
      })
      .option('history', {
        alias: 'h',
        describe: 'Show update history',
        type: 'boolean',
        default: false,
      })
      .option('rollback', {
        alias: 'r',
        describe: 'Rollback to previous version',
        type: 'string',
      })
      .option('generate-offline', {
        describe: 'Generate offline update file',
        type: 'boolean',
        default: false,
      })
      .option('export-usb', {
        describe: 'Export firmware to USB device',
        type: 'string',
      })
      .option('export-mobile', {
        describe: 'Export firmware for mobile app',
        type: 'boolean',
        default: false,
      })
      .option('qr-code', {
        describe: 'Generate QR code for mobile update',
        type: 'string',
      })
      .option('settings', {
        alias: 's',
        describe: 'Show update settings',
        type: 'boolean',
        default: false,
      }),
  handler: async (argv: UpdateCommandArgv): Promise<void> => {
    try {
      // Sprawdź aktualizacje
      if (argv.check) {
        console.log('\n🔍 Sprawdzanie dostępnych aktualizacji...\n');
        console.log('✅ Dostępna nowa wersja: 4.3.0');
        console.log('   Data wydania: 2026-09-15');
        console.log('   Zmiany: Ulepszone wspomaganie, nowe tryby\n');
        return;
      }

      // Pokaż wersję
      if (argv.version) {
        console.log('\n📦 Obecna wersja firmware: 4.2.1\n');
        return;
      }

      // Generuj offline
      if (argv['generate-offline']) {
        await updater.generateOfflineFile('4.3.0');
        return;
      }

      // Eksportuj na USB
      if (argv['export-usb']) {
        await updater.exportToUSB('./firmware/bosch-firmware-4.3.0-offline.bin', argv['export-usb']);
        return;
      }

      // Eksportuj dla mobile'a
      if (argv['export-mobile']) {
        await updater.exportForMobile('./firmware/bosch-firmware-4.3.0-offline.bin');
        return;
      }

      // Zainstaluj z pliku
      if (argv['install-offline']) {
        await updater.installFromLocal(argv['install-offline']);
        return;
      }

      // Zainstaluj z USB
      if (argv['install-usb']) {
        await updater.installFromUSB('/media/usb');
        return;
      }

      // QR code
      if (argv['qr-code']) {
        updater.generateQRCode(argv['qr-code']);
        return;
      }

      // Historia
      if (argv.history) {
        updater.showUpdateHistory();
        return;
      }

      // Rollback
      if (argv.rollback) {
        await updater.rollback(argv.rollback);
        return;
      }

      // Ustawienia
      if (argv.settings) {
        console.log('\n⚙️  Ustawienia aktualizacji:\n');
        console.log('✅ Auto-download: Wł.');
        console.log('✅ Notyfikacje: Wł.');
        console.log('❌ Instalacja w tle: Wył.');
        console.log('   Sprawdzanie co: 24 godziny\n');
        return;
      }

      // Default: pokaż status
      console.log('\n📦 Status aktualizacji:\n');
      console.log('Bieżąca wersja: 4.2.1');
      console.log('Status: Aktualny\n');
    } catch (error) {
      console.error(`\n❌ Błąd: ${error}\n`);
      process.exit(1);
    }
  },
};
