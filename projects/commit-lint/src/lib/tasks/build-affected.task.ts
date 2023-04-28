import * as shelljs from 'shelljs';

export interface Config {
  base: string; // base commit or branch for finding affected apps
  buildFlags: string; // build flags eg. `--aot --build-optimizer=false`
  head: string; // head commit or branch for finding affected apps
  nodeFlags: string; // nodejs flags eg. `--max-old-space-size=6144`
  npmCommands: string; // additional npm commands to run before build separated with && eg. `build:ci:prepare && build:ci:notify`
}

export function buildAffectedTask(config: Config): void {
  try {
    const { base, buildFlags, head, nodeFlags, npmCommands } = config;
    shelljs.set('-e'); // Break on error.
    const result = shelljs.exec(
      `npm run affected:apps -- --base=${base} --head=${head}`
    );
    let apps: string[];
    const parts = result.stdout.split('\n');
    // try for @nrwl/nx
    apps = parts[parts.length - 2]
      .split(',')
      .map((app: string) => app.trim())
      .filter((p: string) => p !== '');

    // try for @nrwl/workspace
    if (!apps.length && parts.length > 6) {
      const nparts = parts.filter((p: string) => p !== '');
      nparts.splice(0, 3);
      apps = nparts.map((p: string) => p.trim().replace('- ', ''));
    }

    console.log(
      `Projects to build: ${apps.join(', ') || 'no projects to build!'}`
    );

    if (apps.length && npmCommands) {
      const commands = npmCommands.split('&&');

      commands.forEach((command) => {
        shelljs.exec(`npm run ${command}`);
      });
    }

    apps.forEach((app) => {
      const command = `node ${nodeFlags} ./node_modules/@angular/cli/bin/ng build --project=${app} ${buildFlags}`;

      console.log(`Building project: ${app}`);
      console.log(`Running command: ${command}`);
      shelljs.exec(command);
    });

    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}
