# Base React e integración en Astro

No existía un proyecto Pp1/Auth del alumno que pudiera migrarse. Por ello se creó una base nueva llamada Nodo, con una entrada React/Vite y otra entrada Astro. Esta documentación no afirma que el blog anterior incluyera una tienda o un sistema de autenticación.

La estructura general del ejemplo de clase sirvió como referencia: separar frontend y backend, exponer GraphQL y usar Prisma. El código, contenido, interfaz y datos de Nodo se elaboraron para esta base. Se eligió SQLite en lugar de MongoDB para facilitar la ejecución presencial sin una cuenta externa.

## Comparación verificable

1. `base-react/src/main.jsx` monta la aplicación con React. Esta entrada usa Vite y sirve como base de comparación.
2. `front/src/pages/index.astro` incorpora la misma aplicación como una isla con `client:load`. Astro proporciona el documento y genera la página; React gestiona la interacción.
3. Ambas entradas comparten `front/src/App.jsx`, componentes, estilos y cliente GraphQL. No son dos copias que haya que mantener por separado.
4. La API NestJS permanece independiente. Cambiar el contenedor del frontend no modifica las reglas de registro, roles, inventario o pedidos.
5. Se comprueban las dos compilaciones con `npm run build` y `npm run build:base`.

La aplicación usa una sola página y vistas controladas por React; no se han convertido todas las pantallas en rutas Astro. El propósito de esta base es demostrar la integración de una aplicación interactiva y su autenticación con Astro.

## Decisiones de autenticación

Las contraseñas se almacenan con bcrypt. El servidor emite JWT con vencimiento y comprueba una sesión persistida para poder revocarla al cerrar sesión. El registro siempre asigna CLIENTE. Los permisos administrativos se validan en el servidor; ocultar botones no es el control de seguridad.

Los pedidos obtienen el usuario del token y consultan los precios en la base. La operación descuenta inventario y crea el pedido dentro de una transacción. Una clave de solicitud evita duplicar una compra reenviada. El historial conserva nombres y precios incluso si se elimina el producto.

## Alcance

No incluye cobros, envíos, recuperación de contraseña, verificación de correo ni un despliegue público ya configurado. Esas funciones no deben presentarse como realizadas.
