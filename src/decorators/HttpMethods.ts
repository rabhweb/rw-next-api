// decorators/HttpMethods.ts
import 'reflect-metadata';

const createRouteDecorator = (method: string) => {
  return (path: string): MethodDecorator => {
    return (target, propertyKey) => {
      Reflect.defineMetadata('method', method, target, propertyKey);
      Reflect.defineMetadata('path', path, target, propertyKey);
    };
  };
};

export const Get = createRouteDecorator('GET');
export const Post = createRouteDecorator('POST');
export const Put = createRouteDecorator('PUT');
export const Delete = createRouteDecorator('DELETE');
