import { CommandModule } from 'yargs';
import { AssistModesManager } from '../../lib/assist-modes';

const manager = new AssistModesManager();

interface AssistCommandArgv {
  list?: boolean;
  set?: string;
  current?: boolean;
  custom?: boolean;
  name?: string;
  power?: number;
  delete?: string;
  export?: boolean;
  e?: boolean;
  import?: string;
  i?: string;
  [key: string]: unknown;
}

export const assistCommand: CommandModule<unknown, AssistCommandArgv> = {
  command: 'assist',
  describe: 'Manage Bosch eBike assist modes',
  builder: (yargs) =>
    yargs
      .option('list', {
        alias: 'l',
        describe: 'List all assist modes',
        type: 'boolean',
        default: false,
      })
      .option('set', {
        alias: 's',
        describe: 'Set assist mode (OFF, ECO, TOUR, SPORT, TURBO)',
        type: 'string',
      })
      .option('current', {
        alias: 'c',
        describe: 'Show current assist mode',
        type: 'boolean',
        default: false,
      })
      .option('custom', {
        describe: 'Create custom assist mode',
        type: 'boolean',
        default: false,
      })
      .option('name', {
        describe: 'Custom mode name',
        type: 'string',
      })
      .option('power', {
        describe: 'Custom mode power (0-200%)',
        type: 'number',
      })
      .option('delete', {
        alias: 'd',
        describe: 'Delete custom mode by ID',
        type: 'string',
      })
      .option('export', {
        alias: 'e',
        describe: 'Export assist modes configuration',
        type: 'boolean',
        default: false,
      })
      .option('import', {
        alias: 'i',
        describe: 'Import assist modes configuration',
        type: 'string',
      }),
  handler: async (argv: AssistCommandArgv): Promise<void> => {
    try {
      // Lista wszystkich trybów
      if (argv.list) {
        manager.listAllModes();
        return;
      }

      // Ustaw tryb
      if (argv.set) {
        const success = manager.setMode(argv.set.toUpperCase());
        if (!success) {
          process.exit(1);
        }
      }

      // Utwórz custom tryb
      if (argv.custom) {
        if (!argv.name || argv.power === undefined) {
          console.error('❌ Wymagane: --name i --power');
          process.exit(1);
        }
        const success = manager.createCustomMode(argv.name, argv.power);
        if (!success) {
          process.exit(1);
        }
      }

      // Usuń custom tryb
      if (argv.delete) {
        const success = manager.deleteCustomMode(argv.delete);
        if (!success) {
          process.exit(1);
        }
      }

      // Wyeksportuj
      if (argv.export) {
        const json = manager.export();
        console.log('\n📦 Konfiguracja trybów (JSON):\n');
        console.log(json);
        console.log();
      }

      // Importuj
      if (argv.import) {
        const fs = require('fs');
        const fileContent = fs.readFileSync(argv.import, 'utf-8');
        const success = manager.import(fileContent);
        if (!success) {
          process.exit(1);
        }
      }

      // Pokaż obecny tryb
      if (argv.current || (!argv.list && !argv.set && !argv.custom && !argv.delete && !argv.export && !argv.import)) {
        manager.showCurrent();
      }
    } catch (error) {
      console.error(`\n❌ Błąd: ${error}\n`);
      process.exit(1);
    }
  },
};
