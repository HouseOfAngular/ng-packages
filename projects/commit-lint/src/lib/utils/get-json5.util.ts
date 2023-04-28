import * as fs from 'fs';
import * as json5 from 'json5';
import * as path from 'path';
import { errorWithExit } from './error-with-exit.util';

export function getJSON5File(filePath: string): any {
  const p = path.join(process.cwd(), path.normalize(filePath));

  if (!fs.existsSync(p)) {
    errorWithExit(`${p} does not exists.`);
  }

  return json5.parse(fs.readFileSync(p).toString());
}
