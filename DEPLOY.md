# Publicación pendiente

El frontend Astro y el backend necesitan direcciones públicas accesibles entre sí. Subir únicamente el frontend a Netlify no publica la API ni SQLite.

## Backend

Utiliza un entorno que ejecute Node.js y conserve un disco persistente. Instala con `npm ci` y compila con `npm run build -w back`.

Configura las variables del ejemplo `back/.env.example` mediante el proveedor: DATABASE_URL debe apuntar a un archivo SQLite en el disco persistente; JWT_SECRET y ADMIN_PASSWORD deben ser nuevos, aleatorios y privados; FRONTEND_ORIGIN debe contener el origen HTTPS del frontend; PORT debe ser el requerido por el servidor. No publiques las credenciales locales.

Con el almacenamiento preparado, aplica el esquema con `npm run db:push -w back` y crea los datos iniciales con `npm run seed:prod -w back`. Inicia mediante `npm run start:prod -w back`. Estos comandos de producción leen las variables del proceso, sin exigir un archivo .env.

Mantén una única instancia para esta base SQLite y realiza copias de seguridad del disco. Un entorno efímero o varias instancias sin almacenamiento compartido requieren cambiar la estrategia de persistencia.

## Frontend

La configuración netlify.toml indica la compilación del workspace front y su salida front/dist. Antes de compilar, configura PUBLIC_API_URL con la dirección HTTPS de la API, terminada en `/graphql`. Si cambia la dirección, reconstruye el frontend.

## Verificación antes de entregar

Desde una ventana privada, registra una cuenta, inicia sesión, crea un pedido, cierra sesión y vuelve a consultar el historial. Comprueba que el cliente no pueda administrar y que las operaciones administrativas funcionen con la cuenta correspondiente. Repite después de reiniciar el backend para verificar persistencia.

Solo después de estas comprobaciones sustituye el campo pendiente del reporte por el enlace público de Nodo. El enlace del blog anterior no demuestra el funcionamiento de esta aplicación.
