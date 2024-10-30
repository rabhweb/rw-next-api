import { IBody } from '../decorators/Body';

import { NextRequest } from 'next/server';
import { pathToRegexp } from 'path-to-regexp';

export class HandlerArgumentParser {
  constructor(
    private readonly routePath: string,
    private readonly req: NextRequest,
    private readonly argsMetadata: any,
    private readonly methodKey: string
  ) {}

  params(name: string) {
    const { regexp, keys } = pathToRegexp(this.routePath);
    const url = new URL(this.req.url || '');
    const match = regexp.exec(url.pathname);
    const paramValue = match
      ? match[keys.findIndex((k) => k.name === name) + 1]
      : undefined;

    return paramValue !== undefined
      ? Number(paramValue) || paramValue
      : undefined;
  }

  query(name: string) {
    const url = new URL(this.req.url || '');
    return name ? url.searchParams.get(name) : undefined;
  }

  body(): IBody {
    return {
      json: this.req.json,
      text: this.req.text,
      formData: this.req.formData,
    };
  }

  request() {
    return this.req;
  }

  parse(): any[] {
    return this.argsMetadata.map(
      ({
        index,
        source,
        name,
      }: {
        index: number;
        source: string;
        name?: string;
      }) => {
        switch (source) {
          case 'param':
            return this.params(name as string);

          case 'query':
            return this.query(name as string);

          case 'body':
            return this.body();

          case 'request':
            return this.request();

          default:
            return undefined;
        }
      }
    );
  }
}
