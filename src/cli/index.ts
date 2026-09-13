import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { smartSystemCommand } from './commands/smart-system';
import { bikeInfoCommand } from './commands/bike-info';
import { tuningCommand } from './commands/tuning';

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
