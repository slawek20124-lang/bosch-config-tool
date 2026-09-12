import { CommandModule } from 'yargs';
import { USBDetector } from '../../lib/usb-detect';
import { BoschProtocol } from '../../lib/bosch-protocol';

export const detectCommand: CommandModule = {
  command: 'detect',
  describe: 'Detect Bosch devices connected via USB',
  builder: (yargs) =>
    yargs
      .option('test', {
        alias: 't',
        describe: 'Test connection to found device',
        type: 'boolean',
        default: false,
      })
      .option('debug', {
        alias: 'd',
        describe: 'Show all serial ports (debug mode)',
        type: 'boolean',
        default: false,
      }),
  handler: async (argv) => {
    try {
      if (argv.debug) {
        // Pokaż wszystkie porty
        await USBDetector.debugPorts();
        return;
      }

      console.log('\n🔍 Szukam urządzeń Bosch Performance Line...\n');

      // Szukaj urządzenia Bosch
      const boschDevice = await USBDetector.findBoschDevice();

      if (!boschDevice) {
        console.log('\n❌ Nie znaleziono urządzenia Bosch!');
        console.log('\n📝 Wskazówki:');
        console.log('  1. Sprawdź czy rower jest podłączony przez USB-C');
        console.log('  2. Sprawdź sterowniki USB');
        console.log('  3. Spróbuj inny kabel USB');
        console.log('  4. Uruchom z --debug aby zobaczyć wszystkie porty\n');
        process.exit(1);
      }

      // Wyświetl informacje
      console.log('\n✅ === ZNALEZIONE URZĄDZENIE ===\n');
      console.log(`📍 Port: ${boschDevice.port}`);
      console.log(`🏭 Producent: ${boschDevice.manufacturer}`);
      console.log(`📱 VID: ${boschDevice.vendorId}`);
      console.log(`📱 PID: ${boschDevice.productId}`);
      console.log(`🔢 Serial: ${boschDevice.serialNumber}\n`);

      // Test połączenia
      if (argv.test) {
        console.log('🧪 Testuję połączenie...\n');

        const protocol = new BoschProtocol(boschDevice.port);
        const connected = await protocol.connect();

        if (connected) {
          console.log('\n✅ Połączenie udane!');

          // Spróbuj ping
          const pong = await protocol.ping();
          if (pong) {
            console.log('✅ Ping: OK');
          } else {
            console.log('⚠️ Ping: Brak odpowiedzi (może być normalne)');
          }

          // Spróbuj odczytać status
          const status = await protocol.readStatus();
          if (status) {
            console.log('\n📊 Status urządzenia:');
            console.log(`  🔋 Bateria: ${status.battery}%`);
            console.log(`  ⚡ Moc silnika: ${status.motorPower}W`);
            console.log(`  🚴 Prędkość: ${status.speed} km/h`);
            console.log(`  📏 Dystans: ${status.distance} km`);
            console.log(`  🌡️ Temperatura: ${status.temperature}°C`);
            console.log(`  🎯 Tryb: ${status.mode}\n`);
          }

          await protocol.disconnect();
        } else {
          console.log('\n❌ Nie udało się połączyć!');
          console.log('⚠️ Urządzenie może wymagać specjalnego oprogramowania firmware\n');
        }
      } else {
        console.log('💡 Wskazówka: Użyj --test aby przetestować połączenie');
        console.log('Przykład: npm run cli detect --test\n');
      }
    } catch (error) {
      console.error(`\n❌ Błąd: ${error}\n`);
      process.exit(1);
    }
  },
};
