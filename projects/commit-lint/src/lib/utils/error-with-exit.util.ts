export function errorWithExit(msg = ''): void {
  console.error(msg);
  process.exit(1);
}
