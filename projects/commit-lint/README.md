# Commit Lint

Package for handling validation of commits, nx tags, branch and code formatting

## Installation

`npm install @house-of-angular/commit-lint --save-dev`

## Commands and usage

#### `print-version`

Print version based on package.json and git commit hash.

---

#### `validate-branch <branch>`

Check if branch is correctly named

---

#### `validate-nx-tags`

Check if all nx tags are valid.

---

#### `validate-commit <branch>`

Check if commit messages are correctly formatted.

---

#### `prettier-check <files>`

Check with prettier if files are correctly formatted.

---

#### `build-affected [options]`

Build affected apps.

Options:  
`--base <base>` - base commit or branch for finding affected apps

`--buildFlags <buildFlags>` - build flags eg. `--aot --build-optimizer=false` (default: "--aot --build-optimizer=false")

`--head <head>` - head commit or branch for finding affected apps

`--nodeFlags <nodeFlags>` - nodejs flags eg. `--max-old-space-size=6144` (default: "")

`--npmCommands <npmFlags>` - additional npm commands to run before build separated with `&&` eg. `build:ci:prepare && build:ci:notify` (default: "")

---

#### `themes-symlinks`

Create symlinks in `node_modules` for `_styles.scss` and `*.theme.scss`.

---

#### `validate-change-size [options]`

Check if merge request isn't too large.

Options:  
`--base <base>` - base commit or branch for diff

`--head <head>` - head commit or branch for diff

## Configuration

Create `houseofangular-commit-lint.json5` file in repository with the following content:

```json5
{
  branch: {
    // types of branches
    types: ['feature', 'bugfix', 'hotfix', 'release', 'refactor'],
    // RegExp that overrides "types" (types are ignored)
    pattern: '(.*)',
  },
  change: {
    // max number of added lines in change request, default: -1
    maxAdditions: -1,
    // max number of deleted lines in change request, default: -1
    maxDeletions: -1,
    // max number of edited files in change request, default: -1
    maxFiles: -1,
  },
  // all commitlint rules are supported
  // https://github.com/conventional-changelog/commitlint/blob/master/docs/reference-rules.md
  commitlint: {
    'body-leading-blank': [1, 'always'],
    'footer-leading-blank': [1, 'always'],
    'header-max-length': [2, 'always', 72],
    'body-max-line-length': [2, 'always', 72],
    'footer-max-line-length': [2, 'always', 72],
    'scope-case': [2, 'always', 'lower-case'],
    'subject-case': [2, 'never', ['sentence-case', 'start-case', 'pascal-case', 'upper-case']],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never'],
    'type-enum': [2, 'always', ['build', 'ci', 'docs', 'feat', 'fix', 'perf', 'refactor', 'release', 'style', 'test']],
    'scope-enum': [2, 'always', ['test', 'report', 'document']],
  },
  prettier: {
    // extensions to check with prettier
    extensionsToCheck: ['.json', '.ts', '.js', '.html', '.css', '.scss'],
  },
  nxTagsValidator: {
    // ignore default tags
    ignore: ['type:application', 'type:util', 'type:ui', 'type:data-access', 'type:resource', 'type:feature', 'scope:shared'],
  },
}
```
