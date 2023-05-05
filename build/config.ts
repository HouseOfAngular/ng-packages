import * as fs from 'fs';

export interface PackageDescription {
  name: string;
}
export interface Config {
  packages: PackageDescription[];
  scope: string;
}

export const projectsDir = './projects/';
const distProjectsDir = './dist/projects/';
export const packages: PackageDescription[] = fs
  .readdirSync(projectsDir)
  .filter((path) => {
    const stat = fs.statSync(`${projectsDir}${path}`);
    const isDir = stat.isDirectory();

    if (!isDir) {
      return false;
    }

    const hasBuild = fs.existsSync(`${distProjectsDir}${path}`);

    return hasBuild;
  })
  .map((pkg) => ({ name: pkg }));
