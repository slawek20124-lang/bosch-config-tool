import { CommandModule } from 'yargs';
import { ProfileManager } from '../../lib/profiles';

const profileManager = new ProfileManager();

interface ProfileCommandArgv {
  list?: boolean;
  create?: string;
  switch?: string;
  delete?: string;
  current?: boolean;
  export?: boolean;
  import?: string;
  [key: string]: unknown;
}

export const profileCommand: CommandModule<unknown, ProfileCommandArgv> = {
  command: 'profile',
  describe: 'Manage eBike configuration profiles',
  builder: (yargs) =>
    yargs
      .option('list', {
        alias: 'l',
        describe: 'List all profiles',
        type: 'boolean',
        default: false,
      })
      .option('create', {
        alias: 'c',
        describe: 'Create new profile',
        type: 'string',
      })
      .option('switch', {
        alias: 's',
        describe: 'Switch to profile',
        type: 'string',
      })
      .option('delete', {
        alias: 'd',
        describe: 'Delete profile',
        type: 'string',
      })
      .option('current', {
        describe: 'Show current profile',
        type: 'boolean',
        default: false,
      })
      .option('export', {
        alias: 'e',
        describe: 'Export profiles',
        type: 'boolean',
        default: false,
      })
      .option('import', {
        alias: 'i',
        describe: 'Import profiles from file',
        type: 'string',
      }),
  handler: async (argv: ProfileCommandArgv): Promise<void> => {
    try {
      if (argv.list) {
        profileManager.listProfiles();
        return;
      }

      if (argv.create) {
        const success = profileManager.createProfile(argv.create);
        if (!success) {
          process.exit(1);
        }
        return;
      }

      if (argv.switch) {
        const success = profileManager.switchProfile(argv.switch);
        if (!success) {
          process.exit(1);
        }
        return;
      }

      if (argv.delete) {
        const success = profileManager.deleteProfile(argv.delete);
        if (!success) {
          process.exit(1);
        }
        return;
      }

      if (argv.export) {
        const exported = profileManager.exportProfiles();
        console.log('\n📤 Eksport profili:\n');
        console.log(exported);
        console.log();
        return;
      }

      if (argv.import) {
        const fs = require('fs');
        const fileContent = fs.readFileSync(argv.import, 'utf-8');
        const success = profileManager.importProfiles(fileContent);
        if (!success) {
          process.exit(1);
        }
        return;
      }

      if (argv.current) {
        profileManager.showCurrentProfile();
        return;
      }

      // Default
      profileManager.listProfiles();
    } catch (error) {
      console.error(`\n❌ Błąd: ${error}\n`);
      process.exit(1);
    }
  },
};
