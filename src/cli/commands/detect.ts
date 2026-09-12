import { CommandModule } from 'yargs';
import { USBDetector } from '../../lib/usb-detect';
import { BoschProtocol } from '../../lib/bosch-protocol';

export const detectCommand: CommandModule = {
  command: 'detect',
  describe: 'Detect Bosch eBike connected via USB-C',
  builder: (yargs) =>
    yargs
      .option('test', {
        alias: 't',
        describe: 'Test connection to detected device',
        type: 'boolean',
        default: false,
      })
      .option('list', {
        alias: 'l',
        describe: 'List all USB devices',
        type: 'boolean',
        default: false,
      }),
  handler: async (argv) => {
    try {
      if (argv.list) {
        // Wyświetl wszystkie urządzenia
        console.log('\n🔍 Skanowanie portów USB...\n');
        await USBDetector.listAllDevices();
        return;
      }

      // Szukaj Bosch Performance Line
      console.log('\n🔍 Szukanie urządzenia Bosch Performance Line...\n');
      const device = await USBDetector.findBoschDevice();

      if (!device) {
        console.log('\n💡 Wskazówki:');
        console.log('   1. Sprawdź, czy rower jest podłączony kablem USB-C');
        console.log('   2. Spróbuj inny port USB');
        console.log('   3. Zainstaluj sterowniki Bosch (Windows)');
        console.log('   4. Użyj --list aby zobaczyć wszystkie urządzenia\n');
        process.exit(1);
      }

      if (argv.test) {
        // Testuj połączenie
        console.log('\n🧪 Testowanie połączenia...\n');
        const connected = await USBDetector.testConnection(device.port);

        if (connected) {
          console.log('\n✅ Urządzenie odpowiada!');

          // Spróbuj pobrać status
          console.log('\n📊 Pobieranie statusu...\n');
          const protocol = new BoschProtocol(device.port);
          const connected_protocol = await protocol.connect();

          if (connected_protocol) {
            const status = await protocol.readStatus();
            if (status) {
              console.log('📊 Status urządzenia:');
              console.log(`   Bateria: ${status.battery}%`);
              console.log(`   Moc silnika: ${status.motorPower}W`);
              console.log(`   Prędkość: ${status.speed} km/h`);
              console.log(`   Dystans: ${status.distance} km`);
              console.log(`   Temperatura: ${status.temperature}°C`);
              console.log(`   Tryb: ${status.mode}\n`);
            }
            await protocol.disconnect();
          }
        } else {
          console.log('\n❌ Brak odpowiedzi z urządzenia');
          console.log('💡 Sprawdź kabel i spróbuj ponownie\n');
          process.exit(1);
        }
      } else {
        console.log('\n💡 Użyj --test aby przetestować połączenie\n');
      }
    } catch (error) {
      console.error(`\n❌ Błąd: ${error}\n`);
      process.exit(1);
    }
  },
};
