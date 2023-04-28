import * as shelljs from 'shelljs';
import { errorWithExit } from '../utils/error-with-exit.util';
import { getConfig } from '../utils/get-config.util';

export interface ValidateChangeSizeTaskOpts {
  base: string;
  head: string;
}

export function validateChangeSizeTask(opts: ValidateChangeSizeTaskOpts): void {
  const { base, head } = opts;
  const { maxAdditions, maxDeletions, maxFiles } = getConfig().change;

  shelljs.set('-e'); // Break on error.

  const result = shelljs.exec(`git diff --shortstat ${base}..${head}`);
  const changesParts = result.split(' ');
  const changes = {
    files: parseInt(changesParts[1], 10),
    additions: parseInt(changesParts[4], 10),
    deletions: parseInt(changesParts[6], 10),
  };

  if (maxAdditions > -1 && changes.additions > maxAdditions) {
    errorWithExit(
      `There is ${changes.additions} additions which is greater than ${maxAdditions} allowed.`
    );
  }

  if (maxDeletions > -1 && changes.deletions > maxDeletions) {
    errorWithExit(
      `There is ${changes.deletions} deletions which is greater than ${maxDeletions} allowed.`
    );
  }

  if (maxFiles > -1 && changes.files > maxFiles) {
    errorWithExit(
      `There is ${changes.files} changed files which is greater than ${maxFiles} allowed.`
    );
  }

  console.log('Change size is valid.');
  process.exit(0);
}
