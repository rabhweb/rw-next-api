import { NextApiController } from '../../../../../src/controller/NextApiController';
import { NextApiRouter } from '../../../../../src/router/NextApiRouter';
import { NextRequest, NextResponse } from 'next/server';
import { NextApiResponse } from 'next';

import { Todo } from '../../../controller/Todo';

const router = new NextApiRouter('/api/v1');
router.addRoute({
  name: '/todo',
  controller: Todo,
});

const handler = router.handler();

export {
  handler as GET,
  handler as POST,
  handler as PUT,
  handler as DELETE,
  handler as OPTIONS,
};
