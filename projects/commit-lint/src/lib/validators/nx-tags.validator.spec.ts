import { Linter } from '../resources/enums/linter.enum';
import { validateNxTags } from './nx-tags.validator';

const nxJson = {
  projects: {
    'pet-shop-e2e': {
      tags: [],
    },
    'pet-shop': {
      tags: [],
    },
    'shared-data-access': {
      tags: ['scope:shared', 'type:data-access'],
    },
    'shared-resource': {
      tags: ['scope:shared', 'type:resource'],
    },
    'shared-ui-avatar': {
      tags: ['scope:shared', 'type:ui'],
    },
  },
};
const nxJsonWithAdditionalDeclarations = {
  projects: {
    'pet-shop-e2e': {
      tags: [],
    },
    'pet-shop': {
      tags: [],
    },
    'dashboard-feature': {
      tags: ['scope:dashboard', 'type:feature'],
    },
    'dashboard-filter-feature': {
      tags: ['scope:dashboard-filter', 'type:feature'],
    },
    'dashboard-filter-data-access': {
      tags: ['scope:dashboard-filter', 'type:data-access'],
    },
    'dashboard-filter-ui': {
      tags: ['scope:dashboard-filter', 'type:ui'],
    },
    'dashboard-filter-util': {
      tags: ['scope:dashboard-filter', 'type:util'],
    },
    'dashboard-filter-resource': {
      tags: ['scope:dashboard-filter', 'type:resource'],
    },
    'dashboard-shared-data-access': {
      tags: ['scope:dashboard-shared', 'type:data-access'],
    },
    'dashboard-shared-summary-resource': {
      tags: ['scope:dashboard-shared', 'type:resource'],
    },
    'dashboard-shared-summary-ui': {
      tags: ['scope:dashboard-shared', 'type:ui'],
    },
    'shared-data-access': {
      tags: ['scope:shared', 'type:data-access'],
    },
    'shared-resource': {
      tags: ['scope:shared', 'type:resource'],
    },
    'shared-ui-avatar': {
      tags: ['scope:shared', 'type:ui'],
    },
  },
};
const tslintJson = {
  rules: {
    'nx-enforce-module-boundaries': [
      true,
      {
        allow: [],
        depConstraints: [
          {
            sourceTag: 'type:feature',
            onlyDependOnLibsWithTags: ['*'],
          },
          {
            sourceTag: 'type:util',
            onlyDependOnLibsWithTags: ['type:util', 'type:resource'],
          },
          {
            sourceTag: 'type:ui',
            onlyDependOnLibsWithTags: ['type:ui', 'type:util', 'type:resource'],
          },
          {
            sourceTag: 'type:resource',
            onlyDependOnLibsWithTags: ['type:resource'],
          },
          {
            sourceTag: 'type:data-access',
            onlyDependOnLibsWithTags: [
              'type:data-access',
              'type:util',
              'type:resource',
            ],
          },
          {
            sourceTag: 'scope:shared',
            onlyDependOnLibsWithTags: ['scope:shared'],
          },
        ],
      },
    ],
  },
};
const tslintJsonWithAdditionalDeclarations = {
  rules: {
    'nx-enforce-module-boundaries': [
      true,
      {
        allow: [],
        depConstraints: [
          {
            sourceTag: 'type:feature',
            onlyDependOnLibsWithTags: ['*'],
          },
          {
            sourceTag: 'type:util',
            onlyDependOnLibsWithTags: ['type:util', 'type:resource'],
          },
          {
            sourceTag: 'type:ui',
            onlyDependOnLibsWithTags: ['type:ui', 'type:util', 'type:resource'],
          },
          {
            sourceTag: 'type:resource',
            onlyDependOnLibsWithTags: ['type:resource'],
          },
          {
            sourceTag: 'type:data-access',
            onlyDependOnLibsWithTags: [
              'type:data-access',
              'type:util',
              'type:resource',
            ],
          },
          {
            sourceTag: 'scope:shared',
            onlyDependOnLibsWithTags: ['scope:shared'],
          },
          {
            sourceTag: 'scope:test',
            onlyDependOnLibsWithTags: ['*'],
          },
        ],
      },
    ],
  },
};

const eslintrc = {
  rules: {
    'nx-enforce-module-boundaries': [
      'error',
      {
        enforceBuildableLibDependency: true,
        allow: [],
        depConstraints: [
          {
            sourceTag: 'type:feature',
            onlyDependOnLibsWithTags: ['*'],
          },
          {
            sourceTag: 'type:util',
            onlyDependOnLibsWithTags: ['type:util', 'type:resource'],
          },
          {
            sourceTag: 'type:ui',
            onlyDependOnLibsWithTags: ['type:ui', 'type:util', 'type:resource'],
          },
          {
            sourceTag: 'type:resource',
            onlyDependOnLibsWithTags: ['type:resource'],
          },
          {
            sourceTag: 'type:data-access',
            onlyDependOnLibsWithTags: [
              'type:data-access',
              'type:util',
              'type:resource',
            ],
          },
          {
            sourceTag: 'scope:shared',
            onlyDependOnLibsWithTags: ['scope:shared'],
          },
        ],
      },
    ],
  },
};
const eslintrcWithAdditionalDeclarations = {
  rules: {
    '@nrwl/nx/enforce-module-boundaries': [
      'error',
      {
        enforceBuildableLibDependency: true,
        allow: [],
        depConstraints: [
          {
            sourceTag: 'type:feature',
            onlyDependOnLibsWithTags: ['*'],
          },
          {
            sourceTag: 'type:util',
            onlyDependOnLibsWithTags: ['type:util', 'type:resource'],
          },
          {
            sourceTag: 'type:ui',
            onlyDependOnLibsWithTags: ['type:ui', 'type:util', 'type:resource'],
          },
          {
            sourceTag: 'type:resource',
            onlyDependOnLibsWithTags: ['type:resource'],
          },
          {
            sourceTag: 'type:data-access',
            onlyDependOnLibsWithTags: [
              'type:data-access',
              'type:util',
              'type:resource',
            ],
          },
          {
            sourceTag: 'scope:shared',
            onlyDependOnLibsWithTags: ['scope:shared'],
          },
          {
            sourceTag: 'scope:test',
            onlyDependOnLibsWithTags: ['*'],
          },
        ],
      },
    ],
  },
};
const eslintjson = {
  rules: {},
  overrides: [
    {
      files: ['*.ts', '*.tsx', '*.js', '*.jsx'],
      rules: {
        '@nrwl/nx/enforce-module-boundaries': [
          'error',
          {
            enforceBuildableLibDependency: true,
            allow: [],
            depConstraints: [
              {
                sourceTag: 'type:feature',
                onlyDependOnLibsWithTags: ['*'],
              },
              {
                sourceTag: 'type:util',
                onlyDependOnLibsWithTags: ['type:util', 'type:resource'],
              },
              {
                sourceTag: 'type:ui',
                onlyDependOnLibsWithTags: [
                  'type:ui',
                  'type:util',
                  'type:resource',
                ],
              },
              {
                sourceTag: 'type:resource',
                onlyDependOnLibsWithTags: ['type:resource'],
              },
              {
                sourceTag: 'type:data-access',
                onlyDependOnLibsWithTags: [
                  'type:data-access',
                  'type:util',
                  'type:resource',
                ],
              },
              {
                sourceTag: 'scope:shared',
                onlyDependOnLibsWithTags: ['scope:shared'],
              },
            ],
          },
        ],
      },
    },
  ],
};

describe('validateNxTags', () => {
  it('should not throw error with valid tslint config', () => {
    expect(() =>
      validateNxTags(nxJson, tslintJson, Linter.TsLint)
    ).not.toThrowError();
  });

  it('should throw error with invalid tslint config', () => {
    expect(() =>
      validateNxTags(
        nxJsonWithAdditionalDeclarations,
        tslintJsonWithAdditionalDeclarations,
        Linter.TsLint
      )
    ).toThrowError();
  });

  it('should not throw error with valid eslintrc config', () => {
    expect(() =>
      validateNxTags(nxJson, eslintrc, Linter.TsLint)
    ).not.toThrowError();
  });

  it('should not throw error with valid eslintjson config', () => {
    expect(() =>
      validateNxTags(nxJson, eslintjson, Linter.EsLint)
    ).not.toThrowError();
  });

  it('should throw error with invalid eslintrc config', () => {
    expect(() =>
      validateNxTags(
        nxJsonWithAdditionalDeclarations,
        eslintrcWithAdditionalDeclarations,
        Linter.EsLint
      )
    ).toThrowError();
  });
});
