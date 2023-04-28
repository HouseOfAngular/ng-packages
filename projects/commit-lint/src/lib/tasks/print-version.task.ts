import { gitDescribeSync } from 'git-describe';
import { errorWithExit } from '../utils/error-with-exit.util';
import { requireFromCwd } from '../utils/require-from-cwd.util';

export function printVersionTask(): void {
  try {
    const { version } = requireFromCwd('package.json');

    const gitInfo = gitDescribeSync({
      dirtyMark: 'false',
      dirtySemver: false,
    });

    console.log(`v${version}-${gitInfo.hash}`);
    process.exit(0);
  } catch (e: any) {
    errorWithExit(e.message);
  }
}
