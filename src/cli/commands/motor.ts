import { CommandModule } from 'yargs';
import { MotorGeneration } from '../../lib/motor-generation';

const motorGen = new MotorGeneration();

interface MotorCommandArgv {
  info?: boolean;
  [key: string]: unknown;
}

export const motorCommand: CommandModule<unknown, MotorCommandArgv> = {
  command: 'motor',
  describe: 'Motor management',
  builder: (yargs) => yargs,
  handler: async (argv: MotorCommandArgv): Promise<void> => {
    try {
      motorGen.setMotor('PERFORMANCE_CX_GEN4');
      motorGen.showMotorInfo();
    } catch (error) {
      console.error(`❌ Error: ${error}\n`);
      process.exit(1);
    }
  },
};
