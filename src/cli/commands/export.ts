import { CommandModule } from 'yargs';
import fs from 'fs';
import { BinaryParser } from '../../lib/binary';

export const exportCommand: CommandModule = {
  command: 'export',
  describe: 'Export binary configuration to JSON',
  builder: (yargs) =>
    yargs
      .option('config', {
        alias: 'c',
        describe: 'Binary config file path',
        type: 'string',
        demandOption: true,
      })
      .option('output', {
        alias: 'o',
        describe: 'Output JSON file path',
        type: 'string',
        demandOption: true,
      }),
  handler: (argv) => {
    try {
      const buffer = fs.readFileSync(argv.config as string);
      const config = BinaryParser.parse(buffer);

      fs.writeFileSync(argv.output as string, JSON.stringify(config, null, 2));
      console.log(`✅ Exported to: ${argv.output}`);
    } catch (error) {
      console.error(`❌ Error: ${error}`);
      process.exit(1);
    }
  },
};
