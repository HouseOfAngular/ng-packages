export class ArrayUtil {
  joinToTitleCase(arr: string[]): string {
    return arr
      .map((w) => w[0].toUpperCase() + w.substr(1).toLowerCase())
      .join('');
  }
}
