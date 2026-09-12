import { CommandModule } from 'yargs';
import fs from 'fs';
import { USBManager } from '../../lib/usb';

export const writeCommand: CommandModule = {
  command: 'write',
  describe: 'Write configuration to Bosch eBike',
  builder: (yargs) =>
    yargs
      .option('device', {
        alias: 'd',
        describe: 'USB device path',
        type: 'string',
        demandOption: true,
      })
      .option('config', {
        alias: 'c',
        describe: 'Configuration file path',
        type: 'string',
        demandOption: true,
      }),
  handler: (argv) => {
    try {
      const usb = new USBManager(argv.device as string);

      if (!usb.isConnected()) {
        console.error(`❌ Device not found: ${argv.device}`);
        process.exit(1);
      }

      const buffer = fs.readFileSync(argv.config as string);
      usb.writeConfig(buffer);

      console.log('✅ Configuration written successfully!');
    } catch (error) {
      console.error(`❌ Error: ${error}`);
      process.exit(1);
    }
  },
};
