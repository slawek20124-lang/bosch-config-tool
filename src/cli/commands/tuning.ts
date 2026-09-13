import { CommandModule } from 'yargs';
import { TuningProfiles } from '../../lib/tuning-profiles';
import { SystemIntegration } from '../../lib/integration';

const tuningProfiles = new TuningProfiles();
const systemIntegration = new SystemIntegration();

interface TuningCommandArgv {
  preset?: string;
  list?: boolean;
  apply?: boolean;
  optimize?: boolean;
  export?: boolean;
  status?: boolean;
  [key: string]: unknown;
}

export const tuningCommand: CommandModule<unknown, TuningCommandArgv> = {
  command: 'tuning',
  describe: 'Tuning profiles for Cube Stereo 140 + Bosch Gen 4',
  builder: (yargs) =>
    yargs
      .option('preset', {
        alias: 'p',
        describe: 'Select tuning preset (ECO|TOUR|SPORT|TURBO)',
        type: 'string',
      })
      .option('list', {
        alias: 'l',
        describe: 'List all tuning profiles',
        type: 'boolean',
        default: false,
      })
      .option('apply', {
        alias: 'a',
        describe: 'Apply tuning profile',
        type: 'boolean',
        default: false,
      })
      .option('optimize', {
        alias: 'o',
        describe: 'Auto-optimize based on conditions',
        type: 'boolean',
        default: false,
      })
      .option('export', {
        alias: 'e',
        describe: 'Export configuration',
        type: 'boolean',
        default: false,
      })
      .option('status', {
        alias: 's',
        describe: 'Show system status',
        type: 'boolean',
        default: false,
      }),
  handler: async (argv: TuningCommandArgv): Promise<void> => {
    try {
      if (argv.list) {
        tuningProfiles.listProfiles();
        return;
      }

      if (argv.preset) {
        tuningProfiles.showProfile(argv.preset);
        if (argv.apply) {
          systemIntegration.configureSystem({
            bikeModel: 'cube-stereo-140-2023',
            motorType: 'PERFORMANCE_CX_GEN4',
            batteryCapacity: 625,
            tuningProfile: argv.preset,
            smartSystemEnabled: true,
          });
          console.log('✅ Profil zastosowany!\n');
        }
        return;
      }

      if (argv.status) {
        systemIntegration.configureSystem({
          bikeModel: 'cube-stereo-140-2023',
          motorType: 'PERFORMANCE_CX_GEN4',
          batteryCapacity: 625,
          tuningProfile: 'SPORT',
          smartSystemEnabled: true,
        });
        systemIntegration.showSystemStatus();
        return;
      }

      if (argv.optimize) {
        console.log('\n🔍 Auto-optimizing system...\n');
        systemIntegration.configureSystem({
          bikeModel: 'cube-stereo-140-2023',
          motorType: 'PERFORMANCE_CX_GEN4',
          batteryCapacity: 625,
          tuningProfile: 'SPORT',
          smartSystemEnabled: true,
        });
        console.log('✅ System optimized!\n');
        return;
      }

      if (argv.export) {
        systemIntegration.configureSystem({
          bikeModel: 'cube-stereo-140-2023',
          motorType: 'PERFORMANCE_CX_GEN4',
          batteryCapacity: 625,
          tuningProfile: 'SPORT',
          smartSystemEnabled: true,
        });
        const config = systemIntegration.exportConfig();
        console.log('\n📝 Configuration Export:\n');
        console.log(config);
        console.log();
        return;
      }

      // Default
      tuningProfiles.listProfiles();
    } catch (error) {
      console.error(`\n❌ Error: ${error}\n`);
      process.exit(1);
    }
  },
};
