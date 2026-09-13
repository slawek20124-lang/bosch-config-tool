import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { motorCommand } from './commands/motor';
import { smartCommand } from './commands/smart';

const main = async () => {
  await yargs(hideBin(process.argv))
    .command(motorCommand)
    .command(smartCommand)
    .demandCommand()
    .strict()
    .help()
    .argv;
};

main().catch(console.error);
