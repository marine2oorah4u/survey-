// Minimal static server for dist, shared by the playthrough test and `npm start`.
import {createServer} from 'node:http';
import {createReadStream} from 'node:fs';
import {stat} from 'node:fs/promises';
import {extname, join, normalize} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = fileURLToPath(new URL('../dist/', import.meta.url));
const types = {'.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.webp': 'image/webp', '.txt': 'text/plain'};

export function serve(port = 0) {
  const server = createServer(async (req, res) => {
    const path = normalize(decodeURIComponent(new URL(req.url, 'http://localhost').pathname)).replace(/^(\.\.[/\\])+/, '');
    const file = join(root, path === '/' ? 'index.html' : path);
    if (!file.startsWith(root)) { res.writeHead(403).end('forbidden'); return; }
    try {
      await stat(file);
      res.writeHead(200, {'content-type': types[extname(file)] ?? 'application/octet-stream', 'cache-control': 'no-store'});
      createReadStream(file).pipe(res);
    } catch { res.writeHead(404).end('not found'); }
  });
  return new Promise(resolve => server.listen(port, '127.0.0.1', () => resolve({server, port: server.address().port})));
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const {port} = await serve(Number(process.env.PORT) || 8080);
  console.log(`Field Survey running at http://localhost:${port}`);
}
