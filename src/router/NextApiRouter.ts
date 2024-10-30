import { NextRequest, NextResponse } from 'next/server';
import { NextApiController } from '../controller/NextApiController';
import { NextApiResponse } from 'next';
import { controllerProcessor } from '../helpers/ControllerProcessor';

interface NextApiRoute {
  name: string;
  controller: typeof NextApiController;
}

export class NextApiRouter {
  constructor(private readonly apiPrefix: string) {}

  private routes: NextApiRoute[] = [];

  public addRoute(route: NextApiRoute) {
    this.routes.push(route);
  }

  public getRoutes() {
    return this.routes;
  }

  handler() {
    return async (req: NextRequest, res: NextApiResponse) => {
      const url = new URL(req.url || '', req.nextUrl);

      // Find the route that matches the request
      const route = this.getRoutes().find((route) => {
        const name = `${this.apiPrefix}${route.name}`;

        return url.pathname.startsWith(name);
      });

      if (route) {
        const controller = new route.controller(
          `${this.apiPrefix}${route.name}`
        );

        return await controllerProcessor(controller)(req, res);
      } else {
        return NextResponse.json(
          { message: 'Route not found' },
          { status: 404 }
        );
      }
    };
  }
}
