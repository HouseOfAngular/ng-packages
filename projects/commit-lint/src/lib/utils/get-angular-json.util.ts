import * as fs from 'fs';
import * as path from 'path';
import { errorWithExit } from './error-with-exit.util';

export function getAngularJson(): any {
  const p = path.join(process.cwd(), 'angular.json');

  if (!fs.existsSync(p)) {
    errorWithExit(`${p} does not exists.`);
  }

  return JSON.parse(fs.readFileSync(p).toString());
}
