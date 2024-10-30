import 'reflect-metadata';

export class NextApiController implements NextApiController {
  constructor(private prefixRoute: string = '') {}

  public getPrefixRoute() {
    return this.prefixRoute;
  }
}
