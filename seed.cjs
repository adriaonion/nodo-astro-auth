const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const db = new PrismaClient();
async function main() {
  const password = process.env.ADMIN_PASSWORD;
  if (!password || Buffer.byteLength(password) < 12 || Buffer.byteLength(password) > 72) throw new Error('Configura ADMIN_PASSWORD con 12 a 72 bytes.');
  await db.user.upsert({ where: { email: process.env.ADMIN_EMAIL || 'admin@nodo.test' }, update: {}, create: { name: 'Administrador local', email: process.env.ADMIN_EMAIL || 'admin@nodo.test', passwordHash: await bcrypt.hash(password, 12), role: 'ADMIN' } });
  const entries = [
    ['Escritorio', [['Teclado compacto', 'Formato de 75 teclas, conexión USB y perfil bajo para el escritorio.', 89900, 15], ['Mouse ergonómico', 'Sensor óptico, conexión inalámbrica y diseño para uso diario.', 44900, 20], ['Soporte para laptop', 'Aluminio plegable con altura ajustable y base antideslizante.', 59900, 12]]],
    ['Conectividad', [['Hub USB-C', 'Expande tu equipo con cuatro puertos USB para periféricos.', 39900, 18], ['Cable USB-C', 'Cable de dos metros para cargar y transferir archivos.', 17900, 30], ['Adaptador de red', 'Conexión Ethernet por USB para un escritorio conectado.', 34900, 8]]],
    ['Audio', [['Audífonos de estudio', 'Diseño cerrado y cable desmontable para escuchar con detalle.', 129900, 10], ['Micrófono USB', 'Micrófono de escritorio con botón de silencio y soporte.', 99900, 7], ['Bocina compacta', 'Altavoz portátil con conexión Bluetooth para el día a día.', 69900, 0]]]
  ];
  for (const [name, products] of entries) {
    const category = await db.category.upsert({where:{name},update:{},create:{name}});
    for (const [title, description, priceCents, stock] of products) {
      // No sobrescribir datos editados ni recuperar stock al ejecutar setup otra vez.
      if (!await db.product.findFirst({where:{name:title,categoryId:category.id}})) await db.product.create({data:{name:title,description,priceCents,stock,categoryId:category.id}});
    }
  }
  console.log('Datos iniciales disponibles: 3 categorías y catálogo de ejemplo.');
}
main().catch(e=>{console.error(e.message);process.exitCode=1}).finally(()=>db.$disconnect());
