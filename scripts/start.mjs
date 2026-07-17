// Starts `next start` on the first available port.
// `next dev` finds a free port on its own, but `next start` does not —
// it just crashes with EADDRINUSE. This probes upward until one is free.

import net from 'net';
import { spawn } from 'child_process';

const START_PORT = Number(process.env.PORT) || 3000;
const MAX_PORT = START_PORT + 50;

function isFree(port) {
  return new Promise((resolve) => {
    const srv = net.createServer();
    srv.once('error', () => resolve(false));
    srv.once('listening', () => srv.close(() => resolve(true)));
    // No host: binds to :: (IPv6 dual-stack) exactly like `next start` does.
    // Probing 0.0.0.0 would miss a server already holding the IPv6 socket.
    srv.listen(port);
  });
}

async function findFreePort() {
  for (let p = START_PORT; p <= MAX_PORT; p++) {
    if (await isFree(p)) return p;
  }
  throw new Error(`No free port between ${START_PORT} and ${MAX_PORT}`);
}

const port = await findFreePort();
if (port !== START_PORT) {
  console.log(`⚠ Port ${START_PORT} is in use — using available port ${port} instead.`);
}

const child = spawn('next', ['start', '-p', String(port)], {
  stdio: 'inherit',
  shell: true,
});

child.on('exit', (code) => process.exit(code ?? 0));
