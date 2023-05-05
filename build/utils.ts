import { Config } from './config';
import ora from 'ora';

export type RunnerFn = (config: Config) => Promise<any>;
export type TaskDef = [string, RunnerFn];

async function runTask(name: string, taskFn: () => Promise<any>) {
  const spinner = ora(name);

  try {
    spinner.start();

    await taskFn();

    spinner.succeed();
  } catch (e) {
    spinner.fail();

    throw e;
  }
}
export function createBuilder(tasks: TaskDef[]) {
  return async function (config: Config) {
    for (let [name, runner] of tasks) {
      await runTask(name, () => runner(config));
    }
  };
}
