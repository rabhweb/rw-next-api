// decorators/request.ts
export function Request() {
  return function (target: any, propertyKey: string, parameterIndex: number) {
    const existingParams =
      Reflect.getMetadata('arguments', target, propertyKey) || [];
    existingParams.push({ index: parameterIndex, source: 'request' });
    Reflect.defineMetadata('arguments', existingParams, target, propertyKey);
  };
}
