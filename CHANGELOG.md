#### 17.0.0 (2024-01-08)

##### Build System / Dependencies

- **commit-lint:** fix building commit-lint (c5134cfd)
- preinstall script for forbidding usage different package manage (d8810523)
- update angular to 16 (8104bd82)

##### Chores

- **release:**
  - 16.0.0 (a4bf8748)
  - 15.0.1 (ae9150b6)
  - 15.0.0 (f990be2c)
- **typed-urls:**
  - add repo information to project file (16de03b5)
  - include readme and license file in built libraries (d1adf994)

##### Documentation Changes

- add information about (2f9d4964)
- add versions with links in readme (d4a1a075)
- create readme files (7ab3fa02)
- **validation-messages:**
  - remove typo (0486d0f1)
  - update readme (f3fa2610)

##### New Features

- fix lint (82de64a7)
- fix tests, bug with defining error messages + update more packages (bb0de65a)
- fix ci (762179f7)
- update workspace to v17 (66a9f65b)
- add possibility to update package in publish packages workflow (d1732a19)
- add github action for publishing to npm (22154d56)
- create example application for typed urls (7583a278)
- add script for publishing latest, built packages (ee7987e0)
- **hoa:** auto-generate changelog on update libs versions (ffb21595)
- **ng-forms:** allow to use plain string value for patter error message (fc120e26)
- **validation-messages:**
  - update example app (f16351f4)
  - add support for specifying validation messages locally (7072219c)
  - read from control from host component (1fb418ec)
  - add ApiErrorMessages type and ad matInputControl getters (38bc702c)
  - add support for controlName input (8e42d761)
  - support multiple interpolate parameters (e2954419)
  - angular material config (9c015d94)
  - example app config (3603f156)
  - validation messages lib migration (b2b51134)
- **packages:**
  - resolve peer dependencies conflicts (abb14cc0)
  - ci setup (c0dc830b)
- **validation-message:** onpush change detection strategy (26f7faf5)
- **commit-lint:** create commit lint lib and move from "dev" repository (ddff8d85)
- **typed-urls:** typed-urls migration (d938a953)
- **linking-tool:** linking-tool migration & validation-messages lib config (45703d23)
- **config:**
  - standard version (14c11554)
  - hasky commit lint (5e5196a2)

##### Bug Fixes

- **commit-lint:** make control container optional (f1f60e14)
- fix types of form (269e7ac0)
- fix publish packages.yml misspell (37bd0e26)
- fix import and publish command (1702d037)
- **validation-messages:**
  - add optional decorator to MatFormField dependency (58b27f46)
  - update control input type to AbstractControl (53c032ac)
  - export utils from library, add merge config messages util to index.ts (4670f1a9)
  - mark component for check after updating the messages (510645bb)
  - remove white space between error and input caused by block elements (8cdec93e)
  - execute cdr#markForCheck on valueChanges (cbdc42e4)
- **typed-urls:** Fix bug where passing urls with multiple params resulted in Record<string, string> type (3fce4c8a)

##### Other Changes

- add script for updating packages' versions (9ea38e0e)

##### Refactors

- **validation-messages:**
  - refactor code using signals (11ed7215)
  - implement review suggestions in validation-messages.component.ts (22479005)
  - rename validationMessages input to errorMessages (8adc7f1d)
- change npm to pnpm commands in publish packages action (5cc611ed)

##### Code Style Changes

- **validation-messages:** format code with prettier, remove commented code related to memoization (7506d49c)

##### Tests

- **validation-messages:** fix validation-messages unit test (a10cabdf)

#### 16.0.0 (2023-10-04)

##### Build System / Dependencies

- **commit-lint:** fix building commit-lint (c5134cfd)
- preinstall script for forbidding usage different package manage (d8810523)
- update angular to 16 (8104bd82)

##### Chores

- **release:**
  - 16.0.0 (a4bf8748)
  - 15.0.1 (ae9150b6)
  - 15.0.0 (f990be2c)
- **typed-urls:**
  - add repo information to project file (16de03b5)
  - include readme and license file in built libraries (d1adf994)

##### Documentation Changes

- add information about (2f9d4964)
- add versions with links in readme (d4a1a075)
- create readme files (7ab3fa02)
- **validation-messages:**
  - remove typo (0486d0f1)
  - update readme (f3fa2610)

##### New Features

- **ng-forms:** allow to use plain string value for patter error message (fc120e26)
- add possibility to update package in publish packages workflow (d1732a19)
- add github action for publishing to npm (22154d56)
- create example application for typed urls (7583a278)
- add script for publishing latest, built packages (ee7987e0)
- **validation-messages:**
  - update example app (f16351f4)
  - add support for specifying validation messages locally (7072219c)
  - read from control from host component (1fb418ec)
  - add ApiErrorMessages type and ad matInputControl getters (38bc702c)
  - add support for controlName input (8e42d761)
  - support multiple interpolate parameters (e2954419)
  - angular material config (9c015d94)
  - example app config (3603f156)
  - validation messages lib migration (b2b51134)
- **packages:**
  - resolve peer dependencies conflicts (abb14cc0)
  - ci setup (c0dc830b)
- **validation-message:** onpush change detection strategy (26f7faf5)
- **commit-lint:** create commit lint lib and move from "dev" repository (ddff8d85)
- **typed-urls:** typed-urls migration (d938a953)
- **linking-tool:** linking-tool migration & validation-messages lib config (45703d23)
- **config:**
  - standard version (14c11554)
  - hasky commit lint (5e5196a2)

##### Bug Fixes

- **commit-lint:** make control container optional (f1f60e14)
- fix types of form (269e7ac0)
- fix publish packages.yml misspell (37bd0e26)
- fix import and publish command (1702d037)
- **validation-messages:**
  - add optional decorator to MatFormField dependency (58b27f46)
  - update control input type to AbstractControl (53c032ac)
  - export utils from library, add merge config messages util to index.ts (4670f1a9)
  - mark component for check after updating the messages (510645bb)
  - remove white space between error and input caused by block elements (8cdec93e)
  - execute cdr#markForCheck on valueChanges (cbdc42e4)
- **typed-urls:** Fix bug where passing urls with multiple params resulted in Record<string, string> type (3fce4c8a)

##### Other Changes

- add script for updating packages' versions (9ea38e0e)

##### Refactors

- **validation-messages:**
  - refactor code using signals (11ed7215)
  - implement review suggestions in validation-messages.component.ts (22479005)
  - rename validationMessages input to errorMessages (8adc7f1d)
- change npm to pnpm commands in publish packages action (5cc611ed)

##### Code Style Changes

- **validation-messages:** format code with prettier, remove commented code related to memoization (7506d49c)

##### Tests

- **validation-messages:** fix validation-messages unit test (a10cabdf)
