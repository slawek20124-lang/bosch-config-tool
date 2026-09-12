import { CommandModule } from 'yargs';
import { Dashboard } from '../../lib/dashboard';

const dashboard = new Dashboard();

interface DashboardCommandArgv {
  watch?: boolean;
  metrics?: boolean;
  alerts?: boolean;
  export?: boolean;
  stop?: boolean;
  [key: string]: unknown;
}

export const dashboardCommand: CommandModule<unknown, DashboardCommandArgv> = {
  command: 'dashboard',
  describe: 'Monitor eBike in real-time',
  builder: (yargs) =>
    yargs
      .option('watch', {
        alias: 'w',
        describe: 'Enable real-time monitoring',
        type: 'boolean',
        default: false,
      })
      .option('metrics', {
        alias: 'm',
        describe: 'Show current metrics',
        type: 'boolean',
        default: false,
      })
      .option('alerts', {
        alias: 'a',
        describe: 'Show alerts',
        type: 'boolean',
        default: false,
      })
      .option('export', {
        alias: 'e',
        describe: 'Export statistics',
        type: 'boolean',
        default: false,
      })
      .option('stop', {
        describe: 'Stop monitoring',
        type: 'boolean',
        default: false,
      }),
  handler: async (argv: DashboardCommandArgv): Promise<void> => {
    try {
      if (argv.watch) {
        dashboard.startMonitoring();
        // Symuluj monitorowanie przez 30 sekund
        await new Promise((resolve) => setTimeout(resolve, 30000));
        dashboard.stopMonitoring();
        return;
      }

      if (argv.metrics) {
        dashboard.showMetrics();
        return;
      }

      if (argv.alerts) {
        dashboard.showAlerts();
        return;
      }

      if (argv.export) {
        const stats = dashboard.exportStats();
        console.log('\n📊 Statystyki:\n');
        console.log(stats);
        console.log();
        return;
      }

      if (argv.stop) {
        dashboard.stopMonitoring();
        return;
      }

      // Default: pokaż metryki
      dashboard.showMetrics();
    } catch (error) {
      console.error(`\n❌ Błąd: ${error}\n`);
      process.exit(1);
    }
  },
};
