import * as shelljs from 'shelljs';
import { errorWithExit } from '../utils/error-with-exit.util';
import { getConfig } from '../utils/get-config.util';
import {
  validateCommit,
  ValidatedCommit,
} from '../validators/commit.validator';

const COMMIT_SEPARATOR = '\n-----------\n';

export function validateCommitTask(branch: string): void {
  if (!branch) {
    errorWithExit(`Please provide branch name.`);
  }

  const opts = getConfig().commitlint;

  if (!opts) {
    errorWithExit(
      `Please provide 'commitlint' options in houseofangular-commit-lint.json5 file.`
    );
  }

  shelljs.set('-e'); // Break on error.

  // We need to fetch origin explicitly because it might be stale.
  // I couldn't find a reliable way to do this without fetch.
  const result = shelljs.exec(
    `git log --reverse --pretty=format:"%B${COMMIT_SEPARATOR}" ${branch}..HEAD`
  );

  if (result.code) {
    errorWithExit(`Failed to fetch commits: ${result.stderr}`);
  }

  const commits = result
    .split(COMMIT_SEPARATOR)
    .filter((line) => line !== '')
    .map((commit) => commit.trim());

  console.log(
    `Examining ${commits.length} commit(s) between ${branch} and HEAD\n`
  );

  if (commits.length === 0) {
    console.log(`There are zero new commits between ${branch} and HEAD`);
  }

  Promise.all(
    commits.map((commitMessage) => validateCommit(commitMessage, opts))
  ).then((res) => {
    let someCommitsInvalid = false;

    res.forEach((vc: ValidatedCommit) => {
      if (vc.errors || vc.warnings) {
        console.log(
          `=> Detected problems in commit:\n${vc.message}\n\n ${vc.warnings}${vc.errors} \n--------`
        );
      }

      if (!vc.valid) {
        someCommitsInvalid = true;
      }
    });

    if (someCommitsInvalid) {
      errorWithExit(
        'Please fix the failing commit messages before continuing...\n'
      );
    }
  });
}
