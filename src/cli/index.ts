import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { smartSystemCommand } from './commands/smart-system';

const main = async () => {
  await yargs(hideBin(process.argv))
    .command(smartSystemCommand)
    .demandCommand()
    .strict()
    .help()
    .argv;
};

main().catch(console.error);
