import * as fs from 'fs';
import * as path from 'path';
import { errorWithExit } from './error-with-exit.util';

export function requireFromCwd(file: string): any {
  const p = path.join(process.cwd(), path.normalize(file));

  if (!fs.existsSync(p)) {
    errorWithExit(`${p} does not exists.`);
  }

  return require(p);
}
