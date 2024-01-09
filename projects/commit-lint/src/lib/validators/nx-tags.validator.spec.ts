import { Linter } from '../resources/enums/linter.enum';
import { validateNxTags } from './nx-tags.validator';

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
    expect(() => validateNxTags(tslintJson, Linter.TsLint)).not.toThrowError();
  });

  it('should throw error with invalid tslint config', () => {
    expect(() =>
      validateNxTags(tslintJsonWithAdditionalDeclarations, Linter.TsLint)
    ).toThrowError();
  });

  it('should not throw error with valid eslintrc config', () => {
    expect(() => validateNxTags(eslintrc, Linter.TsLint)).not.toThrowError();
  });

  it('should not throw error with valid eslintjson config', () => {
    expect(() => validateNxTags(eslintjson, Linter.EsLint)).not.toThrowError();
  });

  it('should throw error with invalid eslintrc config', () => {
    expect(() =>
      validateNxTags(eslintrcWithAdditionalDeclarations, Linter.EsLint)
    ).toThrowError();
  });
});
