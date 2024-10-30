import { NextApiController } from '../controller/NextApiController';
import { NextApiResponse } from 'next';
import { NextRequest, NextResponse } from 'next/server';
import { match } from 'path-to-regexp';
import { HandlerArgumentParser } from './HandlerArgumentParser';

export type RouteHandler = (...args: any[]) => void;

export type Methods = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS';

export type RequestParams = string[];

export function controllerProcessor(controller: NextApiController) {
  return async (req: NextRequest, res: NextApiResponse) => {
    const reqMethod = req.method as string;

    const method: Methods = reqMethod as Methods;
    const url = new URL(req.url || '', req.nextUrl);

    const routeHandlers: Map<
      Methods,
      {
        handler: RouteHandler;
        params: RequestParams[];
      }
    > = new Map();

    // Retrieve all defined routes for this controller
    Object.getOwnPropertyNames(Object.getPrototypeOf(controller)).forEach(
      (key) => {
        const routeMethod: string = Reflect.getMetadata(
          'method',
          controller,
          key
        );

        const routePath: string = (
          controller.getPrefixRoute() +
          Reflect.getMetadata('path', controller, key)
        ).replace(/\/\//g, '/');
        const argsMetadata =
          Reflect.getMetadata('arguments', controller, key) || [];

        if (key === 'constructor') return;

        const matchRoute = match(routePath);

        // Match route based on HTTP method and path
        if (
          routeMethod &&
          routeMethod.toUpperCase() === method &&
          matchRoute(url.pathname)
        ) {
          const handlerArgumentParser = new HandlerArgumentParser(
            routePath,
            req,
            argsMetadata,
            method
          );
          const args = handlerArgumentParser.parse();

          routeHandlers.set(method, {
            handler: (controller as any)[key].bind(controller),
            params: args,
          });
        }
      }
    );

    let route = routeHandlers.get(method);

    if (route !== undefined && method) {
      return await route.handler(...route.params);
    } else {
      return NextResponse.json({ message: 'Route not found' }, { status: 404 });
    }
  };
}
