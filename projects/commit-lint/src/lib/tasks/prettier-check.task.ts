import * as fs from 'fs';
import * as prettier from 'prettier';
import { getConfig } from '../utils/get-config.util';

export async function prettierCheckTask(paths: string): Promise<boolean> {
  const options = await prettier.resolveConfig(process.cwd());
  return new Promise<boolean>((resolve, reject) => {
    const extensionsToCheck = getConfig().prettier.extensionsToCheck;

    const filePathsToCheck = paths
      .split(',')
      .filter((filePath) =>
        extensionsToCheck.some((ext) => filePath.endsWith(ext))
      )
      .filter((filePath) => fs.existsSync(filePath));

    const invalidFiles = filePathsToCheck.filter((filePath) => {
      const file = fs.readFileSync(filePath).toString();

      return !prettier.check(file, {
        ...options,
        filepath: filePath,
      });
    });

    if (invalidFiles.length === 0) {
      resolve(true);
      return;
    }

    reject(invalidFiles);
  });
}
