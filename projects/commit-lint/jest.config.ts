/* eslint-dis/* eslint-disable */
export default {
  displayName: 'projects-commit-lint',
  preset: '../../jest.preset.cjs',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/projects/commit-lint',
};
