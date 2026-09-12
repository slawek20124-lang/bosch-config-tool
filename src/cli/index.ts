#!/usr/bin/env node
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { readCommand } from './commands/read';
import { writeCommand } from './commands/write';
import { exportCommand } from './commands/export';
import { importCommand } from './commands/import';

yargs(hideBin(process.argv))
  .command('read', 'Read configuration from device', readCommand)
  .command('write', 'Write configuration to device', writeCommand)
  .command('export', 'Export binary config to JSON', exportCommand)
  .command('import', 'Import JSON config to binary', importCommand)
  .demandCommand(1)
  .strict()
  .help()
  .parse();
