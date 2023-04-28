import { getJSON5File } from './get-json5.util';

let config: ConfigSchema;

export interface ConfigSchema {
  branch: {
    pattern: string;
    types: string[];
  };
  change: {
    maxAdditions: number;
    maxDeletions: number;
    maxFiles: number;
  };
  commitlint: object;
  nxTagsValidator: {
    ignore: string[];
  };
  prettier: {
    extensionsToCheck: string[];
  };
}

export function getConfig(): ConfigSchema {
  if (config) {
    return config;
  }

  config = getJSON5File('projects/commit-lint/houseofangular-commit-lint.json5');

  // defaults
  config.change = {
    ...config.change,
    maxAdditions: -1,
    maxDeletions: -1,
    maxFiles: -1,
  };

  return config;
}
