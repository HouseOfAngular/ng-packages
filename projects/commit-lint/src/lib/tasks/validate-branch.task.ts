import { validateBranch } from '../validators/branch.validator';

export function validateBranchTask(branch: string): void {
  if (validateBranch(branch)) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}
