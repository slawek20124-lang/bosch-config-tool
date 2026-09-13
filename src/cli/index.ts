import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { smartSystemCommand } from './commands/supported/smart-system';
import { bikeInfoCommand } from './commands/supported/bike-info';
import { tuningCommand } from './commands/supported/tuning';

const main = async () => {
  await yargs(hideBin(process.argv))
    .command(smartSystemCommand)
    .command(bikeInfoCommand)
    .command(tuningCommand)
    .demandCommand()
    .strict()
    .help()
    .argv;
};

main().catch(console.error);
