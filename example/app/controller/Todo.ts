'use strict';

import { Get, Post } from '../../../src/decorators/HttpMethods';
import { Params } from '../../../src/decorators/Params';
import { Body, IBody } from '../../../src/decorators/Body';
import { NextApiController } from '../../../src/controller/NextApiController';
import { NextResponse } from 'next/server';

export class Todo extends NextApiController {
  @Get('/:id')
  hello(@Params('id') id: number) {
    return NextResponse.json({ message: `ToDo`, id });
  }
  @Post('')
  async create(@Body() body: IBody) {
    const data = await body.json();
    return NextResponse.json({ data, message: 'ToDo created' });
  }
}
