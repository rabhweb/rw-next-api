export function Body() {
  return function (target: any, propertyKey: string, parameterIndex: number) {
    const existingParams =
      Reflect.getMetadata('arguments', target, propertyKey) || [];
    existingParams.push({ index: parameterIndex, source: 'body' });
    Reflect.defineMetadata('arguments', existingParams, target, propertyKey);
  };
}

export interface IBody {
  json: () => Promise<any>;
  text: () => Promise<any>;
  formData: () => Promise<any>;
}
