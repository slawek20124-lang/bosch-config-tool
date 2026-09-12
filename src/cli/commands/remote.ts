import { CommandModule } from 'yargs';
import { RemoteConnection } from '../../lib/remote-connection';

const remoteConnection = new RemoteConnection();

interface RemoteCommandArgv {
  scan?: boolean;
  connect?: string;
  disconnect?: string;
  'web-server'?: boolean;
  'web-stop'?: boolean;
  'show-ip'?: boolean;
  sessions?: boolean;
  [key: string]: unknown;
}

export const remoteCommand: CommandModule<unknown, RemoteCommandArgv> = {
  command: 'remote',
  describe: 'Manage remote connection to eBike',
  builder: (yargs) =>
    yargs
      .option('scan', {
        describe: 'Scan for local eBikes',
        type: 'boolean',
        default: false,
      })
      .option('connect', {
        alias: 'c',
        describe: 'Connect to device by ID',
        type: 'string',
      })
      .option('disconnect', {
        alias: 'd',
        describe: 'Disconnect from session',
        type: 'string',
      })
      .option('web-server', {
        describe: 'Start web server',
        type: 'boolean',
        default: false,
      })
      .option('web-stop', {
        describe: 'Stop web server',
        type: 'boolean',
        default: false,
      })
      .option('show-ip', {
        describe: 'Show local IP address',
        type: 'boolean',
        default: false,
      })
      .option('sessions', {
        alias: 's',
        describe: 'Show active sessions',
        type: 'boolean',
        default: false,
      }),
  handler: async (argv: RemoteCommandArgv): Promise<void> => {
    try {
      if (argv.scan) {
        await remoteConnection.scanLocalDevices();
        return;
      }

      if (argv.connect) {
        await remoteConnection.connectToDevice(argv.connect);
        return;
      }

      if (argv.disconnect) {
        await remoteConnection.disconnect(argv.disconnect);
        return;
      }

      if (argv['web-server']) {
        remoteConnection.startWebServer(8080);
        return;
      }

      if (argv['web-stop']) {
        remoteConnection.stopWebServer();
        return;
      }

      if (argv['show-ip']) {
        remoteConnection.showLocalIP();
        return;
      }

      if (argv.sessions) {
        remoteConnection.showActiveSessions();
        return;
      }

      // Default
      await remoteConnection.scanLocalDevices();
    } catch (error) {
      console.error(`\n❌ Błąd: ${error}\n`);
      process.exit(1);
    }
  },
};
