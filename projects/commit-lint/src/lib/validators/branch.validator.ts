import { getConfig } from '../utils/get-config.util';

export function validateBranch(branchName: string): boolean {
  const { branch } = getConfig();

  const pattern = branch.pattern
    ? branch.pattern
    : `(${branch.types.join('|')})/(.*)`;

  const regExp = new RegExp(pattern, 'gm');
  const match = regExp.exec(branchName);

  if (!match) {
    const types = branch.types.map((b) => `${b}/*`);
    console.error(
      `ERROR: Branch '${branchName}' does not match any pattern: ${types.join(
        ', '
      )}`
    );
    return false;
  }

  console.log(`Branch '${branchName}' is named correctly.`);
  return true;
}
