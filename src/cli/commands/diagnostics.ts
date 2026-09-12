import { CommandModule } from 'yargs';
import { Diagnostics } from '../../lib/diagnostics';

const diagnostics = new Diagnostics();

interface DiagnosticsCommandArgv {
  logs?: boolean;
  errors?: boolean;
  report?: boolean;
  'export-logs'?: string;
  clear?: boolean;
  [key: string]: unknown;
}

export const diagnosticsCommand: CommandModule<unknown, DiagnosticsCommandArgv> = {
  command: 'diagnostics',
  describe: 'View diagnostics and logs',
  builder: (yargs) =>
    yargs
      .option('logs', {
        alias: 'l',
        describe: 'Show recent logs',
        type: 'boolean',
        default: false,
      })
      .option('errors', {
        alias: 'e',
        describe: 'Show errors',
        type: 'boolean',
        default: false,
      })
      .option('report', {
        alias: 'r',
        describe: 'Generate diagnostic report',
        type: 'boolean',
        default: false,
      })
      .option('export-logs', {
        describe: 'Export logs to file (json|csv)',
        type: 'string',
      })
      .option('clear', {
        describe: 'Clear all logs',
        type: 'boolean',
        default: false,
      }),
  handler: async (argv: DiagnosticsCommandArgv): Promise<void> => {
    try {
      // Dodaj przykładowe logi
      diagnostics.log('INFO', 'SYSTEM', 'System uruchomiony');
      diagnostics.log('INFO', 'CONNECTION', 'Połączono z e-bikiem');

      if (argv.logs) {
        diagnostics.showLogs({ limit: 20 });
        return;
      }

      if (argv.errors) {
        diagnostics.showErrors();
        return;
      }

      if (argv.report) {
        diagnostics.showReport();
        return;
      }

      if (argv['export-logs']) {
        const format = argv['export-logs'] as 'json' | 'csv';
        const exported = diagnostics.exportLogs(format);
        console.log(`\n📤 Export (${format.toUpperCase()}):\n`);
        console.log(exported);
        console.log();
        return;
      }

      if (argv.clear) {
        diagnostics.clearLogs();
        return;
      }

      // Default
      diagnostics.showReport();
    } catch (error) {
      console.error(`\n❌ Błąd: ${error}\n`);
      process.exit(1);
    }
  },
};
