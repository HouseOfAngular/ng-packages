import { readFileSync } from 'fs';
import * as shelljs from 'shelljs';
import { packages } from './config';
import { createBuilder } from './utils';

interface PackageJson {
  name: string;
  version: string;
  private?: boolean;
}

export async function publishLatestToNpm() {
  const configJson = JSON.parse(readFileSync('./tsconfig.json').toString());
  const projects = configJson.compilerOptions.paths;
  const publishableProjects: any[] = [];

  for (const path in projects) {
    const packageJson = JSON.parse(
      readFileSync(`${projects[path][0]}/package.json`).toString()
    );
    if (
      !packageJson.hasOwnProperty('private') ||
      packageJson.private === false
    ) {
      publishableProjects.push(path);
    }
  }

  publishableProjects.forEach((pkg: PackageJson) => {
    console.log(`Publishing @house-of-angular/${pkg}`);

    const cmd = [
      'npm publish',
      `./dist/projects/${pkg}/package.json`,
      '--access=public',
      '--tag=latest',
    ];
    shelljs.exec(cmd.join(' '));
  });
}

const publishLatest = createBuilder([
  ['Publish packages on latest\n', publishLatestToNpm],
]);

publishLatest({
  scope: '@house-of-angular',
  packages,
}).catch((err) => {
  console.error(err);
  process.exit(1);
});
