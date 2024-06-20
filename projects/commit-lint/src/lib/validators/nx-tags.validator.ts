import { Linter } from '../resources/enums/linter.enum';
import { getConfig } from '../utils/get-config.util';
import { readFileSync } from 'fs';
import { glob } from 'glob';

const tagsToIgnore = getConfig().nxTagsValidator.ignore;

function findInOverrides(eslintrc: any): any {
  if (!eslintrc['overrides']) {
    return null;
  }

  return eslintrc['overrides'].find((override: any) => {
    const overrideRules = override['rules'];
    return (
      !!Object.keys(overrideRules).length &&
      !!overrideRules['@nrwl/nx/enforce-module-boundaries'] &&
      !!overrideRules['@nrwl/nx/enforce-module-boundaries'].length
    );
  });
}

function isReservedTag(tag: string): boolean {
  return tagsToIgnore.indexOf(tag) !== -1;
}

function parseNxJson(): string[] {
  const declaredTags: string[] = [];
  glob.sync('**/project.json', { ignore: '**/node_modules/**' }).map((file) => {
    const content = readFileSync(file, 'utf-8');
    const projectJson = JSON.parse(content);

    projectJson.tags.forEach((tag: string) => {
      if (!isReservedTag(tag) && declaredTags.indexOf(tag) === -1) {
        declaredTags.push(tag);
      }
    });
  });

  return declaredTags;
}

function parseEslintJson(eslintrc: any): string[] {
  let nxRule = null;

  if (findInOverrides(eslintrc)) {
    nxRule =
      findInOverrides(eslintrc)['rules']['@nrwl/nx/enforce-module-boundaries'];
  } else if (eslintrc['rules']['@nrwl/nx/enforce-module-boundaries']) {
    nxRule = eslintrc['rules']['@nrwl/nx/enforce-module-boundaries'];
  }

  if (!nxRule) {
    throw new Error(
      `Rule '@nrwl/nx/enforce-module-boundaries' doesn't exist in .eslintrc or .eslintrc.json`
    );
  }

  return extractTagsFromDepConstraints(nxRule[1].depConstraints);
}

function parseTslintJson(tslintJson: any): string[] {
  if (!tslintJson['rules']['nx-enforce-module-boundaries']) {
    throw new Error(
      `Rule nx-enforce-module-boundaries doesn't exist in tslint.json`
    );
  }

  return extractTagsFromDepConstraints(
    tslintJson['rules']['nx-enforce-module-boundaries'][1].depConstraints
  );
}

function extractTagsFromDepConstraints(constraints: any[]): string[] {
  const usedTags: string[] = [];
  constraints.forEach((dc) => {
    if (
      !isReservedTag(dc.sourceTag) &&
      dc.sourceTag !== '*' &&
      usedTags.indexOf(dc.sourceTag) === -1
    ) {
      usedTags.push(dc.sourceTag);
    }

    dc.onlyDependOnLibsWithTags.forEach((tag: string) => {
      if (!isReservedTag(tag) && tag !== '*' && usedTags.indexOf(tag) === -1) {
        usedTags.push(tag);
      }
    });
  });

  return usedTags;
}

export function validateNxTags(lintJson: any, linter: Linter): void {
  const declaredTags = parseNxJson();
  let usedTags: string[] = [];

  switch (linter) {
    case Linter.TsLint: {
      usedTags = parseTslintJson(lintJson);
      break;
    }
    case Linter.EsLint: {
      usedTags = parseEslintJson(lintJson);
      break;
    }
    default: {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const exhaustCheck: never = linter;
    }
  }

  let error = '';
  const declaredButNotUsed = declaredTags.filter(
    (t) => usedTags.indexOf(t) === -1
  );
  const usedButNotDeclared = usedTags.filter(
    (t) => declaredTags.indexOf(t) === -1
  );

  if (declaredButNotUsed.length) {
    error = `ERROR: Tags:\n${declaredButNotUsed
      .map((t) => `• ${t}`)
      .join(
        ',\n'
      )}\nare declared in nx.json but never used in nx-enforce-module-boundaries tslint rule!\n`;
  }

  if (usedButNotDeclared.length) {
    error += `ERROR: Tags:\n${usedButNotDeclared
      .map((t) => `• ${t}`)
      .join(
        ',\n'
      )}\nare used in nx-enforce-module-boundaries rule but never declared in nx.json!`;
  }

  if (error !== '') {
    throw new Error(error);
  }
}
