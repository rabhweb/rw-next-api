export function Params(param: string) {
  return function (target: any, propertyKey: string, parameterIndex: number) {
    const existingParams =
      Reflect.getMetadata('arguments', target, propertyKey) || [];
    existingParams.push({
      index: parameterIndex,
      source: 'param',
      name: param,
    });
    Reflect.defineMetadata('arguments', existingParams, target, propertyKey);
  };
}
