import { readFileSync, existsSync } from 'node:fs';
import { createInterface } from 'node:readline/promises';
import { spawnSync } from 'node:child_process';
const terminal = createInterface({ input: process.stdin, output: process.stdout });
const input = process.argv[2] || await terminal.question('Pega la URL HTTPS de tu página en Netlify: ');
terminal.close();
let origin;
try {
  const url = new URL(input.trim());
  if (url.protocol !== 'https:' || !url.hostname.endsWith('.netlify.app') || url.username || url.password) throw new Error();
  origin = url.origin;
} catch { console.error('Usa la dirección https://nombre.netlify.app de tu proyecto.'); process.exit(1); }
if (!existsSync('back/.env')) { console.error('Primero ejecuta npm run setup.'); process.exit(1); }
if (!existsSync('back/dist/main.js')) { console.error('Primero ejecuta npm run build -w back.'); process.exit(1); }
console.log(`Abre ${origin} en esta computadora. Mantén esta terminal abierta. Si el navegador pide acceso a la red local para tu sitio, permítelo.`);
const result = spawnSync(process.execPath, ['--env-file=.env', 'dist/main.js'], {
  cwd: 'back', stdio: 'inherit', env: { ...process.env, HOST: '127.0.0.1', FRONTEND_ORIGIN: `${origin},http://localhost:4321,http://127.0.0.1:4321,http://localhost:5173` }
});
process.exitCode = result.status ?? 1;
