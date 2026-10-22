Nodo

Base React + Auth System integrada en Astro

Adrian Israel Aguirre Castillo
Registro: 23300645 · Grupo: 7F
22 de octubre de 2026

BORRADOR - publicación pendiente. La implementación y las pruebas descritas corresponden a la ejecución local. Falta desplegar frontend y API y añadir el enlace público de esta aplicación.

URL pública: pendiente de configurar y verificar.
Acceso local: <link href="http://localhost:4321" color="#1748cd">http://localhost:4321</link> (solo en el equipo con ambos servidores activos).

Objetivo y alcance

Desarrollar una tienda de accesorios tecnológicos con catálogo, autenticación, roles y pedidos, y mostrar su integración en Astro. Como no se contaba con un Pp1/Auth anterior, se creó una base nueva con entradas React/Vite y Astro. No se presenta como una migración histórica del blog anterior.

El frontend usa Astro y una isla React. La API utiliza NestJS y GraphQL. Prisma gestiona SQLite para permitir una demostración local sin servicios externos. Las carpetas front, back y base-react separan estas responsabilidades.

Figura 1. Pantalla de acceso y registro de la aplicación local.

Catálogo e integración

El catálogo permite buscar, filtrar por categoría, consultar detalles y añadir productos disponibles al carrito. Los pedidos son de demostración; no se realizan pagos ni envíos.

Figura 2. Catálogo propio de Nodo con disponibilidad y categorías.

Paso de React a Astro

La entrada base-react/src/main.jsx monta la interfaz con React. La página front/src/pages/index.astro incorpora esa misma interfaz mediante client:load. Los componentes y el cliente GraphQL se comparten; la API y sus reglas de negocio permanecen independientes.

Se verificaron las compilaciones de ambas entradas. La interfaz utiliza vistas React dentro de una página Astro; no todas las pantallas son rutas Astro independientes.

Autenticación y validación

Las contraseñas se almacenan con bcrypt. El JWT vence en 30 minutos y está asociado a una sesión revocable. El registro asigna CLIENTE y las operaciones administrativas requieren ADMIN en el servidor. El token se conserva en memoria: una recarga requiere iniciar sesión de nuevo.

Figura 3. Administración de productos con permisos de servidor.

Resultados de las pruebas

La suite de API pasó 14 subpruebas (15 resultados contando el caso contenedor): registro, credenciales, tokens inválidos o vencidos, roles, validación, precios calculados por servidor, idempotencia, propiedad del historial, stock, reversión de transacciones, concurrencia, conservación del historial y cierre de sesión.

En navegador se comprobaron búsqueda, filtros, detalle, registro, pedido, historial, administración y diseño móvil. La compilación y la comprobación de tipos terminaron sin errores. npm audit informó cero vulnerabilidades conocidas en la revisión realizada.

Pendientes para la entrega final

Publicar la API con almacenamiento persistente y el frontend con su dirección HTTPS, verificar los flujos desde internet y actualizar este reporte con la URL. No incluye recuperación de contraseña ni verificación de correo. La guía adjunta explica la demostración presencial.

Referencias técnicas

<link href="https://docs.astro.build/en/guides/integrations-guide/react/" color="#1748cd">Astro: integración con React</link> · <link href="https://docs.nestjs.com/security/authentication" color="#1748cd">NestJS: autenticación</link> · <link href="https://docs.nestjs.com/security/authorization" color="#1748cd">NestJS: autorización</link>