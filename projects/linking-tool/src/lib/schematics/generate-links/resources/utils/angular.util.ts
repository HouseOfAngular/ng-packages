import { ArrowFunction, PropertyAccessExpression, SyntaxKind } from 'ts-morph';
import { TypescriptApiUtil } from './typescript-api.util';

export class AngularUtil {
  getLazyLoadedModuleName(loader: ArrowFunction): string {
    const loaderReturns =
      TypescriptApiUtil.getCallExpressionFromArrowFunction(loader);
    const moduleExtractionExpression = loaderReturns
      .getChildrenOfKind(SyntaxKind.ArrowFunction)[0]
      .getBody() as PropertyAccessExpression;

    return moduleExtractionExpression.getName();
  }
}
