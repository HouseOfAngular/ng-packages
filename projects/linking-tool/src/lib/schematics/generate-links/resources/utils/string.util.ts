import { Node } from 'ts-morph';

export class StringUtil {
  getStringArgumentValue(node: Node): string {
    return node.getText().slice(1, -1);
  }
}
