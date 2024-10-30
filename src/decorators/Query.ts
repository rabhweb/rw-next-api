// decorators/query.ts
export function Query(param: string) {
  return function (target: any, propertyKey: string, parameterIndex: number) {
    const existingParams =
      Reflect.getMetadata('arguments', target, propertyKey) || [];
    existingParams.push({
      index: parameterIndex,
      source: 'query',
      name: param,
    });
    Reflect.defineMetadata('arguments', existingParams, target, propertyKey);
  };
}
