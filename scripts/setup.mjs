import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { randomBytes } from 'node:crypto';
if (!existsSync('back/.env')) {
  const password = randomBytes(15).toString('base64url');
  const secret = randomBytes(48).toString('base64url');
  const template = readFileSync('back/.env.example', 'utf8');
  writeFileSync('back/.env', template.replace('JWT_SECRET=""', `JWT_SECRET="${secret}"`).replace('ADMIN_PASSWORD=""', `ADMIN_PASSWORD="${password}"`));
  writeFileSync('ACCESOS_LOCALES.txt', `Acceso de administrador generado para esta instalación local.\nCorreo: admin@nodo.test\nContraseña: ${password}\n\nNo subas este archivo ni back/.env a GitHub.\nPara demostrar un cliente, regístralo desde la aplicación.\n`);
  console.log('Configuración creada. Consulta ACCESOS_LOCALES.txt para el administrador.');
} else console.log('Se conserva back/.env existente.');
if (!existsSync('front/.env')) writeFileSync('front/.env', readFileSync('front/.env.example'));
// Prisma en Windows puede requerir que el archivo SQLite exista antes de db push.
if (!existsSync('back/prisma/dev.db')) writeFileSync('back/prisma/dev.db', '');
