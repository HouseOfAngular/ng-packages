import * as chalk from 'chalk';
import * as fs from 'fs';
import * as glob from 'glob';
import * as path from 'path';
import * as shelljs from 'shelljs';
import * as symlink from 'symlink-or-copy';
import { errorWithExit } from '../utils/error-with-exit.util';
import { getAngularJson } from '../utils/get-angular-json.util';
import { requireFromCwd } from '../utils/require-from-cwd.util';

interface Library {
  architect: any;
  name: string;
  prefix: string;
  projectType: 'library' | 'application';
  root: string;
  sourceRoot: string;
  stylePaths: string[];
}

function getLibs(): Library[] {
  const schema = getAngularJson();
  const projects = schema.projects;

  if (!projects) {
    return [];
  }

  return Object.keys(projects)
    .filter((project) => projects[project].projectType === 'library')
    .map((project) => {
      const lib = projects[project];
      const searchPattern = path.join(lib.root, '**/+(_*|*.theme).scss');
      return { ...lib, name: project, stylePaths: glob.sync(searchPattern) };
    })
    .filter((library) => library.stylePaths.length);
}

function createSymlinks(library: Library, nodeModulesPath: string): string {
  const filePaths = library.stylePaths;
  let createdSymlinks = '';

  filePaths.forEach((filePath) => {
    const filePathParts = filePath
      .split(path.sep)
      .filter((p) => !['lib', 'src'].includes(p));
    const fileName = filePathParts[filePathParts.length - 1];
    const symlinkDirPath = path.join(
      nodeModulesPath,
      filePathParts.slice(1, filePathParts.length - 2).join(path.sep)
    );
    const symlinkPath = path.join(symlinkDirPath, fileName);

    if (!fs.existsSync(symlinkDirPath)) {
      shelljs.mkdir('-p', symlinkDirPath);
    }

    if (!fs.existsSync(symlinkPath)) {
      createdSymlinks += `${filePath} -> ${symlinkPath}\n`;
      symlink.sync(filePath, symlinkPath);
    }
  });

  // remove symlinks
  glob.sync(path.join(nodeModulesPath, '**/*.scss')).forEach((s: string) => {
    if (fs.lstatSync(path.resolve(s)).isSymbolicLink()) {
      const realPath = fs.readlinkSync(s);
      if (!fs.existsSync(realPath)) {
        try {
          fs.unlinkSync(s);
        } catch (e: any) {
          console.error(e.message);
        }
      }
    }
  });

  return createdSymlinks;
}
export function themesSymlinksTask(): void {
  try {
    const npmScope = '@' + requireFromCwd('nx.json').npmScope;
    const rootScopePath = path.join('node_modules', npmScope);
    let createdSymlinks = '';

    shelljs.mkdir('-p', rootScopePath);

    getLibs().forEach((lib) => {
      createdSymlinks += createSymlinks(lib, rootScopePath);
    });

    if (createdSymlinks) {
      console.info(chalk.green('Created symlinks:'));
      console.info(chalk.blue(createdSymlinks));
    } else {
      console.info(
        chalk.gray(`There is nothing to change in styles symlinks.`)
      );
    }
  } catch (e: any) {
    errorWithExit(e);
  }

  process.exit(0);
}
