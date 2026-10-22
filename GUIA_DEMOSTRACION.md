# Demostración presencial — 5 a 7 minutos

## Preparación

Ejecuta los tres comandos del README. Comprueba que http://localhost:4321 abre el catálogo. Ten a mano ACCESOS_LOCALES.txt sin proyectar la contraseña. No necesitas una cuenta de nube para la demostración local.

## Recorrido

1. **Catálogo:** selecciona una categoría, busca un producto y abre sus detalles. Muestra el estado de un artículo sin existencias.
2. **Cliente:** entra a la pantalla de acceso y registra una cuenta de demostración con una contraseña de al menos 10 caracteres. No reutilices una contraseña personal.
3. **Pedido:** añade un producto disponible al carrito y confirma. Muestra el total, el historial personal y la disminución de stock. Aclara que no existe cobro real.
4. **Permisos:** observa que el cliente no tiene administración. Cierra sesión e inicia con la cuenta administradora generada durante setup.
5. **Administración:** crea un producto de prueba, edita su precio o stock y elimínalo. No necesitas borrar productos iniciales.
6. **Persistencia:** vuelve a iniciar sesión con el cliente y muestra que su pedido sigue guardado. Recargar borra el token en memoria, pero no borra la cuenta, el pedido o el carrito.
7. **Astro:** abre index.astro y explica `client:load`; compara con la entrada main.jsx de base-react. Muestra que la API es independiente.

## Preguntas que debes poder explicar

- ¿Qué hace Astro? Genera la página y carga la isla React para la interacción.
- ¿Qué hace GraphQL? Expone consultas y mutaciones para acceder a las funciones del servidor.
- ¿Dónde están los datos? En SQLite, a través de Prisma; el archivo se crea localmente con setup.
- ¿Por qué un cliente no puede administrar? Un guard del servidor valida sesión y rol ADMIN.
- ¿Puede el navegador imponer un precio? No; el servidor consulta precios y existencias para crear el pedido.
- ¿Es una migración de tu blog? No. Es una base de tienda nueva, con entradas React y Astro para demostrar su integración.

## Si algo falla

- Error de conexión: comprueba que la terminal muestra API y WEB activos.
- Puerto ocupado: cierra una instancia anterior con Ctrl+C.
- Credenciales: consulta ACCESOS_LOCALES.txt; no las busques dentro del ZIP porque se generan al instalar.
- Token vencido o recarga: vuelve a iniciar sesión.
- No compartas `.env`, la base de datos ni ACCESOS_LOCALES.txt al subir el código.
