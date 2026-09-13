import { CommandModule } from 'yargs';
import { BikeDatabase } from '../../../lib/bike-database';

const bikeDb = new BikeDatabase();

interface BikeInfoCommandArgv {
  spec?: boolean;
  geometry?: boolean;
  components?: boolean;
  compatibility?: boolean;
  [key: string]: unknown;
}

export const bikeInfoCommand: CommandModule<unknown, BikeInfoCommandArgv> = {
  command: 'bike-info',
  describe: 'Get bike information - Cube Stereo 140 2023',
  builder: (yargs) =>
    yargs
      .option('spec', {
        alias: 's',
        describe: 'Show bike specifications',
        type: 'boolean',
        default: false,
      })
      .option('geometry', {
        alias: 'g',
        describe: 'Show bike geometry',
        type: 'boolean',
        default: false,
      })
      .option('components', {
        alias: 'c',
        describe: 'Show components',
        type: 'boolean',
        default: false,
      })
      .option('compatibility', {
        alias: 'co',
        describe: 'Show compatibility',
        type: 'boolean',
        default: false,
      }),
  handler: async (argv: BikeInfoCommandArgv): Promise<void> => {
    try {
      if (argv.spec) {
        bikeDb.showBikeInfo('cube-stereo-140-2023');
        return;
      }

      if (argv.geometry) {
        bikeDb.showGeometry('cube-stereo-140-2023');
        return;
      }

      // Default
      bikeDb.showBikeInfo('cube-stereo-140-2023');
    } catch (error) {
      console.error(`\n❌ Error: ${error}\n`);
      process.exit(1);
    }
  },
};
