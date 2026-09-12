import { CommandModule } from 'yargs';
import fs from 'fs';
import { BinaryParser } from '../../lib/binary';

export const importCommand: CommandModule = {
  command: 'import',
  describe: 'Import JSON configuration to binary',
  builder: (yargs) =>
    yargs
      .option('json', {
        alias: 'j',
        describe: 'JSON config file path',
        type: 'string',
        demandOption: true,
      })
      .option('output', {
        alias: 'o',
        describe: 'Output binary file path',
        type: 'string',
        demandOption: true,
      }),
  handler: (argv) => {
    try {
      const jsonData = JSON.parse(fs.readFileSync(argv.json as string, 'utf-8'));
      const buffer = BinaryParser.serialize(jsonData);

      fs.writeFileSync(argv.output as string, buffer);
      console.log(`✅ Imported to: ${argv.output}`);
    } catch (error) {
      console.error(`❌ Error: ${error}`);
      process.exit(1);
    }
  },
};
