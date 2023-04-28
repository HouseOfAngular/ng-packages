import {
  LintOutcome,
  LintRuleOutcome,
  QualifiedRules,
} from '@commitlint/types';
import commitlint from '@commitlint/lint';

export interface ValidatedCommit {
  errors: string;
  message: string;
  valid: boolean;
  warnings: string;
}

function getMessages(arr: LintRuleOutcome[]): string {
  let msg = '';

  arr.forEach((c) => {
    msg += `* ${c.message}\n`;
  });

  return msg;
}

export function validateCommit(
  commitMessage: string,
  config: QualifiedRules
): Promise<ValidatedCommit> {
  return new Promise<ValidatedCommit>((resolve) => {
    commitlint(commitMessage, config).then((result: LintOutcome) => {
      const errors = getMessages(result.errors);
      const warnings = getMessages(result.warnings);
      resolve({
        errors: errors ? ` => ERRORS:\n${errors}` : '',
        warnings: warnings ? ` => ERRORS:\n${warnings}` : '',
        message: commitMessage,
        valid: result.valid,
      });
    });
  });
}
