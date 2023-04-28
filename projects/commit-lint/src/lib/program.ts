import * as commander from 'commander';
import { ValidateNxTagsOptions } from './resources/interfaces/validate-nx-tags-options.interface';
import {
  buildAffectedTask,
  Config as BuildAffectedTaskOptions,
} from './tasks/build-affected.task';
import { prettierCheckTask } from './tasks/prettier-check.task';
import { printVersionTask } from './tasks/print-version.task';
import { themesSymlinksTask } from './tasks/themes-symlinks.task';
import { validateBranchTask } from './tasks/validate-branch.task';
import {
  validateChangeSizeTask,
  ValidateChangeSizeTaskOpts,
} from './tasks/validate-change-size.task';
import { validateCommitTask } from './tasks/validate-commit.task';
import { validateNxTagsTask } from './tasks/validate-nx-tags.task';
import { errorWithExit } from './utils/error-with-exit.util';

export function run(): void {
  const program = new commander.Command();

  program
    .command(
      'print-version',
      'Print version based on package.json and git commit hash.'
    )
    .description('Print version based on package.json and git commit hash.')
    .action(() => printVersionTask());

  program
    .command('validate-branch <branch>')
    .description('Check if branch is correctly named')
    .action((branch: string) => validateBranchTask(branch));

  program
    .command('validate-nx-tags')
    .description('Check if all nx tags are valid.')
    .option('--configFile <name>', 'the name of the eslint/tslint config file')
    .action((commandObj: ValidateNxTagsOptions) => {
      return validateNxTagsTask({ configFile: commandObj.configFile });
    });

  program
    .command('validate-commit <branch>')
    .description('Check if commit messages are correctly formatted.')
    .action((branch: string) => validateCommitTask(branch));

  program
    .command('prettier-check <files>')
    .description('Check with prettier if files are correctly formatted.')
    .action((files: string) => {
      prettierCheckTask(files)
        .then(() => {
          process.exit(0);
        })
        .catch((err) => {
          errorWithExit(
            `Files are not correctly formatted:\n${err.join('\n')}\n`
          );
        });
    });

  program
    .command('themes-symlinks')
    .description(
      'create symlinks in node_modules for _styles.scss and *.theme.scss'
    )
    .action(() => themesSymlinksTask());

  program
    .command('build-affected')
    .option('--base <base>', 'base commit or branch for finding affected apps')
    .option(
      '--buildFlags <buildFlags>',
      'build flags eg. `--aot --build-optimizer=false`',
      '--aot --build-optimizer=false'
    )
    .option('--head <head>', 'head commit or branch for finding affected apps')
    .option(
      '--nodeFlags <nodeFlags>',
      'nodejs flags eg. `--max-old-space-size=6144`',
      ''
    )
    .option(
      '--npmCommands <npmFlags>',
      'additional npm commands to run before build separated with && eg. `build:ci:prepare && build:ci:notify`',
      ''
    )
    .description('Build affected apps.')
    .action((opts: BuildAffectedTaskOptions) => {
      if (!opts.head || !opts.base) {
        errorWithExit(`ERROR: --base and --head are required`);
      }

      buildAffectedTask(opts);
    });

  program
    .command('validate-change-size')
    .option('--base <base>', 'base commit or branch for diff')
    .option('--head <head>', 'head commit or branch for diff')
    .description('Check if change is not too large.')
    .action((opts: ValidateChangeSizeTaskOpts) => {
      if (!opts.head || !opts.base) {
        errorWithExit(`ERROR: --base and --head are required`);
      }

      validateChangeSizeTask(opts);
    });

  program.parse(process.argv);
}
