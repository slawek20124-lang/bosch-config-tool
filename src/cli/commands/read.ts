import { CommandModule } from 'yargs';
import { USBManager } from '../../lib/usb';
import { BinaryParser } from '../../lib/binary';

export const readCommand: CommandModule = {
  command: 'read',
  describe: 'Read configuration from Bosch eBike',
  builder: (yargs) =>
    yargs
      .option('device', {
        alias: 'd',
        describe: 'USB device path',
        type: 'string',
        demandOption: true,
      })
      .option('output', {
        alias: 'o',
        describe: 'Output file path',
        type: 'string',
      }),
  handler: (argv) => {
    try {
      const usb = new USBManager(argv.device as string);

      if (!usb.isConnected()) {
        console.error(`❌ Device not found: ${argv.device}`);
        process.exit(1);
      }

      const buffer = usb.readConfig();
      const config = BinaryParser.parse(buffer);

      console.log('✅ Configuration read successfully:');
      console.log(JSON.stringify(config, null, 2));

      if (argv.output) {
        // Save to file if output specified
        require('fs').writeFileSync(argv.output as string, buffer);
        console.log(`📁 Saved to: ${argv.output}`);
      }
    } catch (error) {
      console.error(`❌ Error: ${error}`);
      process.exit(1);
    }
  },
};
