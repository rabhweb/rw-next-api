// example/server.ts
import next from 'next';
import { createServer } from 'http';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev, dir: './' });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => {
    handle(req, res);
  }).listen(3009, '127.0.0.1', () => {
    console.log('> Ready on http://127.0.0.1:3009');
  });
});
