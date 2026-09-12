import { CommandModule } from 'yargs';
import { BluetoothEBikeManager } from '../../lib/bluetooth-ebike';

const manager = new BluetoothEBikeManager();

interface BluetoothCommandArgv {
  'scan-ebike'?: boolean;
  'connect-ebike'?: string;
  'disconnect-ebike'?: boolean;
  'list-ebike'?: boolean;
  status?: boolean;
  'send-command'?: string;
  'lock'?: boolean;
  'unlock'?: boolean;
  [key: string]: unknown;
}

export const bluetoothCommand: CommandModule<unknown, BluetoothCommandArgv> = {
  command: 'bluetooth',
  describe: 'Manage Bluetooth connection with eBike',
  builder: (yargs) =>
    yargs
      .option('scan-ebike', {
        describe: 'Scan for nearby Bosch eBikes',
        type: 'boolean',
        default: false,
      })
      .option('connect-ebike', {
        describe: 'Connect to eBike by MAC address',
        type: 'string',
      })
      .option('disconnect-ebike', {
        describe: 'Disconnect from eBike',
        type: 'boolean',
        default: false,
      })
      .option('list-ebike', {
        describe: 'List paired eBikes',
        type: 'boolean',
        default: false,
      })
      .option('status', {
        describe: 'Show connection status',
        type: 'boolean',
        default: false,
      })
      .option('send-command', {
        describe: 'Send command to eBike',
        type: 'string',
      })
      .option('lock', {
        describe: 'Lock the eBike',
        type: 'boolean',
        default: false,
      })
      .option('unlock', {
        describe: 'Unlock the eBike',
        type: 'boolean',
        default: false,
      }),
  handler: async (argv: BluetoothCommandArgv): Promise<void> => {
    try {
      // Skanuj e-bike'i
      if (argv['scan-ebike']) {
        await manager.scanForEBikes();
        return;
      }

      // Połącz z rowerem
      if (argv['connect-ebike']) {
        const success = await manager.connectToBike(argv['connect-ebike']);
        if (!success) {
          process.exit(1);
        }
        
        // Pobierz status po połączeniu
        const status = await manager.getStatus();
        if (status) {
          console.log('📊 Status roweru:');
          console.log(`   🔋 Bateria: ${status.battery}%`);
          console.log(`   ⚡ Moc silnika: ${status.motorPower}W`);
          console.log(`   🚴 Prędkość: ${status.speed} km/h`);
          console.log(`   📍 Dystans: ${status.distance} km`);
          console.log(`   🌡️  Temperatura: ${status.temperature}°C`);
          console.log(`   🎮 Tryb: ${status.mode}\n`);
        }
        return;
      }

      // Rozłącz
      if (argv['disconnect-ebike']) {
        await manager.disconnect();
        return;
      }

      // Lista parowanych urządzeń
      if (argv['list-ebike']) {
        manager.listScannedDevices();
        return;
      }

      // Status połączenia
      if (argv.status) {
        manager.showConnectionStatus();
        return;
      }

      // Wyślij komendę
      if (argv['send-command']) {
        await manager.sendCommand(argv['send-command']);
        return;
      }

      // Zablokuj
      if (argv.lock) {
        await manager.lockBike();
        return;
      }

      // Odblokuj
      if (argv.unlock) {
        await manager.unlockBike();
        return;
      }

      // Default: pokaż status
      manager.showConnectionStatus();
    } catch (error) {
      console.error(`\n❌ Błąd: ${error}\n`);
      process.exit(1);
    }
  },
};
