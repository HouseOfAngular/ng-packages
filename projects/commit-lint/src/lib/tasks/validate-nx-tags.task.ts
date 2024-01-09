import * as fs from 'fs';
import * as path from 'path';
import { Linter } from '../resources/enums/linter.enum';
import { ValidateNxTagsOptions } from '../resources/interfaces/validate-nx-tags-options.interface';
import { errorWithExit } from '../utils/error-with-exit.util';
import { validateNxTags } from '../validators/nx-tags.validator';
//TODO Delete file
function resolveLinterConfig(options: ValidateNxTagsOptions): {
  linterConfigFilePath: string;
  linter: Linter;
} {
  if (options.configFile) {
    const configFilePath = path.join(process.cwd(), options.configFile);
    if (!fs.existsSync(configFilePath)) {
      errorWithExit(`${options.configFile} doesn't exist.`);
    }

    return {
      linterConfigFilePath: configFilePath,
      linter: options.configFile.includes('tslint')
        ? Linter.TsLint
        : Linter.EsLint,
    };
  }

  const tslintJson = path.join(process.cwd(), 'tslint.json');
  const eslintRc = path.join(process.cwd(), '.eslintrc');
  const eslintJson = path.join(process.cwd(), '.eslintrc.json');

  if (fs.existsSync(tslintJson)) {
    return { linter: Linter.TsLint, linterConfigFilePath: tslintJson };
  } else if (fs.existsSync(eslintRc)) {
    return { linter: Linter.EsLint, linterConfigFilePath: eslintRc };
  } else if (fs.existsSync(eslintJson)) {
    return { linter: Linter.EsLint, linterConfigFilePath: eslintJson };
  } else {
    errorWithExit(
      `${tslintJson} and ${eslintRc} and ${eslintJson} don't exist.`
    );
  }

  throw new Error();
}

export function validateNxTagsTask(options: ValidateNxTagsOptions) {
  const nx = path.join(process.cwd(), 'nx.json');

  if (!fs.existsSync(nx)) {
    errorWithExit(`${nx} does not exist.`);
  }

  const { linter, linterConfigFilePath } = resolveLinterConfig(options);

  const linterConfig = JSON.parse(
    fs.readFileSync(linterConfigFilePath, { encoding: 'utf-8' })
  );

  try {
    validateNxTags(linterConfig, linter);
  } catch (e: any) {
    errorWithExit(e.message);
  }

  console.log('NxTags are valid.');
  process.exit(0);
}
