import { readFileSync, writeFileSync } from 'fs';
import { EOL } from 'os';
import * as readline from 'readline';
import pkg from 'glob';
const { glob } = pkg;
import { packages } from './config';
import { createBuilder } from './utils';

const [newVersion] = process.argv.slice(2);

const packagesName = '@house-of-angular';

if (newVersion) {
  updateVersions(newVersion);
} else {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question(`What's the new version? `, (version) => {
    rl.close();
    updateVersions(version);
  });
}

function updateVersions(version: string) {
  const publishNext = createBuilder([
    ['Update package.json', createPackageJsonBuilder(version)],
  ]);

  publishNext({
    scope: packagesName,
    packages,
  }).catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

/**
 * Updates package versions in package.json files
 * Updates peerDependencies versions of house-of-angular packages in package.json files
 */
function createPackageJsonBuilder(version: string) {
  return async () => {
    glob
      .sync('**/package.json', { ignore: '**/node_modules/**' })
      .map((file: any) => {
        const content = readFileSync(file, 'utf-8');
        const pkg = JSON.parse(content);
        let saveFile = false;

        if (pkg?.version && pkg?.name?.startsWith(packagesName)) {
          pkg.version = version;
          saveFile = true;
        }

        if (pkg?.peerDependencies) {
          Object.keys(pkg.peerDependencies).forEach((key) => {
            if (key.startsWith(packagesName)) {
              pkg.peerDependencies[key] = version;
              saveFile = true;
            }
          });
        }
        if (saveFile) {
          writeAsJson(file, pkg);
        }
      });
  };
}

function writeAsJson(path: string, json: object) {
  const content = JSON.stringify(json, null, 2);
  writeFileSync(path, `${content}${EOL}`);
}
