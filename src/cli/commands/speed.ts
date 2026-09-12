import { CommandModule } from 'yargs';
import * as fs from 'fs';
import { SpeedLimitsManager } from '../../lib/speed-limits';

const manager = new SpeedLimitsManager();

interface SpeedCommandArgv {
  show?: boolean;
  s?: boolean;
  region?: string;
  r?: string;
  unlimited?: boolean;
  u?: boolean;
  limit?: number;
  l?: number;
  default?: boolean;
  d?: boolean;
  regions?: boolean;
  export?: boolean;
  e?: boolean;
  import?: string;
  i?: string;
  [key: string]: unknown;
}

export const speedCommand: CommandModule<unknown, SpeedCommandArgv> = {
  command: 'speed',
  describe: 'Manage speed limits for Bosch eBike',
  builder: (yargs) =>
    yargs
      .option('show', {
        alias: 's',
        describe: 'Show current speed configuration',
        type: 'boolean',
        default: false,
      })
      .option('region', {
        alias: 'r',
        describe: 'Set region (DE, GB, FR, ES, IT, PL, NL, SE, CH, AT)',
        type: 'string',
      })
      .option('unlimited', {
        alias: 'u',
        describe: 'Enable unlimited mode (NO SPEED LIMIT)',
        type: 'boolean',
        default: false,
      })
      .option('limit', {
        alias: 'l',
        describe: 'Set custom speed limit (10-200 km/h)',
        type: 'number',
      })
      .option('default', {
        alias: 'd',
        describe: 'Reset to default speed limit',
        type: 'boolean',
        default: false,
      })
      .option('regions', {
        describe: 'List all available regions',
        type: 'boolean',
        default: false,
      })
      .option('export', {
        alias: 'e',
        describe: 'Export configuration to JSON',
        type: 'boolean',
        default: false,
      })
      .option('import', {
        alias: 'i',
        describe: 'Import configuration from JSON file',
        type: 'string',
      }),
  handler: async (argv: SpeedCommandArgv): Promise<void> => {
    try {
      // Pokaż listę regionów
      if (argv.regions) {
        console.log('\n🌍 Dostępne regiony:\n');
        const regions = SpeedLimitsManager.listRegions();
        regions.forEach((region) => {
          console.log(
            `${region.name.padEnd(20)} Domyślny: ${region.defaultLimit} km/h  Max: ${region.maxLimit} km/h`
          );
        });
        console.log();
        return;
      }

      // Zmień region
      if (argv.region) {
        const success = manager.setRegion(argv.region.toUpperCase());
        if (!success) {
          console.error('❌ Nieznany region');
          process.exit(1);
        }
      }

      // Włącz tryb bez limitu
      if (argv.unlimited) {
        const success = manager.enableUnlimited();
        if (!success) {
          process.exit(1);
        }
      }

      // Ustaw custom limit
      if (argv.limit !== undefined && argv.limit !== null) {
        const success = manager.setCustomLimit(argv.limit);
        if (!success) {
          process.exit(1);
        }
      }

      // Przywróć domyślny
      if (argv['default']) {
        const success = manager.disableUnlimited();
        if (!success) {
          process.exit(1);
        }
      }

      // Wyeksportuj
      if (argv.export) {
        const json = manager.export();
        console.log('\n📦 Konfiguracja (JSON):\n');
        console.log(json);
        console.log();
      }

      // Importuj
      if (argv.import) {
        const fileContent = fs.readFileSync(argv.import, 'utf-8');
        const success = manager.import(fileContent);
        if (!success) {
          process.exit(1);
        }
      }

      // Pokaż obecną konfigurację
      const showDefault =
        !argv.region &&
        !argv.unlimited &&
        (argv.limit === undefined || argv.limit === null) &&
        !argv['default'] &&
        !argv.export &&
        !argv.import &&
        !argv.regions;

      if (argv.show || showDefault) {
        manager.showCurrent();
      }
    } catch (error) {
      console.error(`\n❌ Błąd: ${error}\n`);
      process.exit(1);
    }
  },
};
