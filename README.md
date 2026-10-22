# Nodo — Astro + Auth System

Base propia de una tienda de accesorios tecnológicos. Usa Astro y React en la interfaz, NestJS y GraphQL en la API, Prisma y SQLite para persistir datos. Es una aplicación de demostración: los pedidos no cobran dinero.

## Iniciar en Windows

Instala Node.js 24. Abre una terminal en esta carpeta (la que contiene este README) y ejecuta:

```sh
npm ci
npm run setup
npm run dev
```

Abre http://localhost:4321. Mantén la terminal abierta. Para detener ambos servidores pulsa Ctrl+C.

`setup` genera la base SQLite, los productos iniciales y una cuenta administradora. El correo y la contraseña están en `ACCESOS_LOCALES.txt`, generado en esta carpeta. No publiques ese archivo ni los archivos `.env`. Un cliente se crea desde la pantalla de registro. Ejecutar setup de nuevo conserva las credenciales existentes.

## Funciones

- Catálogo con búsqueda, categorías, disponibilidad y detalles.
- Registro, inicio y cierre de sesión; roles CLIENTE y ADMIN.
- Carrito persistente en este navegador y pedidos asociados al usuario autenticado.
- Historial personal; precios calculados en servidor y descuento transaccional de existencias.
- Administración de productos con validación de permisos en la API.

El token se conserva únicamente en memoria: al recargar la página se requiere iniciar sesión otra vez. Caduca después de 30 minutos. El carrito conserva solo identificadores y cantidades en localStorage.

## Estructura

| Carpeta | Responsabilidad |
| --- | --- |
| front | Página Astro, isla React y estilos |
| back | API NestJS, autenticación, productos, pedidos y esquema Prisma |
| base-react | Entrada React/Vite de referencia para comparar la integración en Astro |
| scripts | Preparación de variables y base local |
| tests | Pruebas de integración contra una base temporal independiente |

## Verificar

```sh
npm run check
npm run build
npm test
npm run build:base
```

Las pruebas levantan su propia API en el puerto 3301. Los servidores normales utilizan 3000 y 4321. Si un puerto está ocupado, detén la instancia anterior antes de iniciar otra.

Con la API encendida, `npm run dev -w base-react` permite abrir la entrada React en http://localhost:5173. Consulta MIGRACION.md para entender la diferencia entre las dos entradas.

Consulta GUIA_DEMOSTRACION.md para la presentación y DEPLOY.md para publicar. Esta entrega de código funciona localmente; la URL pública de esta aplicación todavía debe configurarse y verificarse. El blog anterior es un proyecto distinto.
