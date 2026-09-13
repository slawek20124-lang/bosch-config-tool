import { CommandModule } from 'yargs';
import { SmartSystem } from '../../lib/smart-system';

const smartSystem = new SmartSystem();

interface SmartCommandArgv {
  enable?: boolean;
  [key: string]: unknown;
}

export const smartCommand: CommandModule<unknown, SmartCommandArgv> = {
  command: 'smart',
  describe: 'Smart System management',
  builder: (yargs) => yargs,
  handler: async (argv: SmartCommandArgv): Promise<void> => {
    try {
      if (argv.enable) {
        smartSystem.enable();
      }
      smartSystem.showStatus();
    } catch (error) {
      console.error(`❌ Error: ${error}\n`);
      process.exit(1);
    }
  },
};
