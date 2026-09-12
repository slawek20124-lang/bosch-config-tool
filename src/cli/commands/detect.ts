import { CommandModule } from 'yargs';
import { USBDetector } from '../../lib/usb-detect';
import { BoschProtocol } from '../../lib/bosch-protocol';

export const detectCommand: CommandModule = {
  command: 'detect',
  describe: 'Detect and test Bosch eBike USB connection',
  builder: (yargs) =>
    yargs
      .option('list', {
        alias: 'l',
        describe: 'List all USB devices',
        type: 'boolean',
        default: false,
      })
      .option('test', {
        alias: 't',
        describe: 'Test connection to device',
        type: 'string',
        default: null,
      })
      .option('ping', {
        alias: 'p',
        describe: 'Send PING to Bosch device',
        type: 'boolean',
        default: false,
      }),
  handler: async (argv) => {
    try {
      // Opcja 1: Lista wszystkich urządzeń
      if (argv.list) {
        console.log('\n🔍 Skanowanie portów USB...\n');
        await USBDetector.listAllDevices();
        return;
      }

      // Opcja 2: Testuj konkretny port
      if (argv.test) {
        console.log(`\n🔗 Testowanie połączenia na porcie: ${argv.test}\n`);
        const connected = await USBDetector.testConnection(argv.test as string);
        if (connected) {
          console.log(`✅ Połączenie z portem ${argv.test} jest aktywne!`);
        } else {
          console.log(`❌ Nie udało się połączyć z portem ${argv.test}`);
        }
        return;
      }

      // Opcja 3: Testuj PING na znalezionym urządzeniu Bosch
      if (argv.ping) {
        console.log('\n📡 Szukanie urządzenia Bosch i wysyłanie PING...\n');
        const device = await USBDetector.findBoschDevice();
        
        if (!device) {
          console.error('❌ Brak urządzenia Bosch');
          process.exit(1);
        }

        const protocol = new BoschProtocol(device.port);
        const connected = await protocol.connect();

        if (!connected) {
          console.error('❌ Nie udało się połączyć z urządzeniem');
          process.exit(1);
        }

        const pingSuccess = await protocol.ping();
        await protocol.disconnect();

        if (pingSuccess) {
          console.log('\n✅ PING udany! Urządzenie Bosch odpowiada.');
        } else {
          console.log('\n❌ PING nieudany - urządzenie nie odpowiada.');
        }
        return;
      }

      // Domyślnie: Szukaj i wyświetl pierwsze znalezione urządzenie Bosch
      console.log('\n🔍 Szukanie urządzenia Bosch Performance Line...\n');
      const device = await USBDetector.findBoschDevice();

      if (device) {
        console.log('\n📋 Szczegóły urządzenia:');
        console.log(`   Port: ${device.port}`);
        console.log(`   Producent: ${device.manufacturer}`);
        console.log(`   Numer seryjny: ${device.serialNumber}`);
        console.log(`   Vendor ID: ${device.vendorId}`);
        console.log(`   Product ID: ${device.productId}`);
        console.log('\n💡 Użyj: npm run cli detect --test <port> aby testować połączenie');
        console.log('💡 Lub: npm run cli detect --ping aby wysłać PING');
      } else {
        console.log('\n❌ Urządzenie Bosch nie znalezione!');
        console.log('\n💡 Spróbuj:');
        console.log('   1. Upewnij się, że rower jest podłączony przez USB-C');
        console.log('   2. Sprawdź sterowniki USB');
        console.log('   3. Uruchom: npm run cli detect --list');
        process.exit(1);
      }
    } catch (error) {
      console.error(`❌ Błąd: ${error}`);
      process.exit(1);
    }
  },
};
