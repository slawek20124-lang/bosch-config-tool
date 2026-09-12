import { CommandModule } from 'yargs';
import { SecurityManager } from '../../lib/security';

const security = new SecurityManager();

interface SecurityCommandArgv {
  init?: boolean;
  'set-pin'?: string;
  authenticate?: string;
  status?: boolean;
  logout?: boolean;
  [key: string]: unknown;
}

export const securityCommand: CommandModule<unknown, SecurityCommandArgv> = {
  command: 'security',
  describe: 'Manage security and authentication',
  builder: (yargs) =>
    yargs
      .option('init', {
        describe: 'Initialize security',
        type: 'boolean',
        default: false,
      })
      .option('set-pin', {
        describe: 'Set PIN (4-8 digits)',
        type: 'string',
      })
      .option('authenticate', {
        alias: 'auth',
        describe: 'Authenticate with PIN',
        type: 'string',
      })
      .option('status', {
        alias: 's',
        describe: 'Show security status',
        type: 'boolean',
        default: false,
      })
      .option('logout', {
        describe: 'Logout from session',
        type: 'boolean',
        default: false,
      }),
  handler: async (argv: SecurityCommandArgv): Promise<void> => {
    try {
      if (argv.init) {
        const deviceId = `EBIKE_${Date.now()}`;
        security.initialize(deviceId);
        return;
      }

      if (argv['set-pin']) {
        const success = security.setPin(argv['set-pin']);
        if (!success) {
          process.exit(1);
        }
        return;
      }

      if (argv.authenticate) {
        const success = security.authenticatePin(argv.authenticate);
        if (!success) {
          process.exit(1);
        }
        return;
      }

      if (argv.status) {
        security.showStatus();
        return;
      }

      if (argv.logout) {
        security.logout();
        return;
      }

      // Default
      security.showStatus();
    } catch (error) {
      console.error(`\n❌ Błąd: ${error}\n`);
      process.exit(1);
    }
  },
};
