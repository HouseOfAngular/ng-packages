# @house-of-angular Packages

A collection of packages, modules and utilities for Angular developers.

| Package                                                       | Description                                                                     | Version                                                                                                                                                   | Changelog                                                |
| ------------------------------------------------------------- | ------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| [Validation messages](projects/validation-messages/README.md) | Package for handling validation messages in Angular                             | [![version](https://img.shields.io/npm/v/@house-of-angular/validation-messages.svg)](https://www.npmjs.com/package/@house-of-angular/validation-messages) | [changelog](./packages/validation-messages/CHANGELOG.md) |
| [Commit lint](projects/commit-lint/README.md)                 | Package for handling validation of commits, nx tags, branch and code formatting | [![version](https://img.shields.io/npm/v/@house-of-angular/commit-lint.svg)](https://www.npmjs.com/package/@house-of-angular/commit-lint)                 | [changelog](./packages/commit-lint/CHANGELOG.md)         |
| [Typed Urls](projects/typed-urls/README.md)                   | Package for creating typed url addresses                                        | [![version](https://img.shields.io/npm/v/@house-of-angular/typed-urls.svg)](https://www.npmjs.com/package/@house-of-angular/typed-urls)                   | [changelog](./packages/commit-lint/CHANGELOG.md)         |

# Publish packages

### Github action (publishes chosen packages)

1. Navigate to Actions tab in github repospitory
2. Run manual "Publish Package" action by providing packages to publish and scope of new version (patch, minor, major).

### Scripts (publishes all packages)

1. Build all packages by running `pnpm run build`
2. Run `pnpm run update:versions` and provide newest version
3. Run `pnpm run publish:latest`
