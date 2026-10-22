# Página en Netlify y API en esta computadora

Esta modalidad publica la interfaz. Las cuentas, el catálogo y los pedidos funcionan únicamente cuando la computadora donde se abre la página ejecuta la API local. No constituye un backend público.

## Publicar la interfaz

En Netlify importa el repositorio GitHub nodo-astro-auth como un proyecto nuevo (no reemplaces el blog anterior).

- Rama: main.
- Base directory: raíz del repositorio (vacío).
- Build command: npm run build -w front.
- Publish directory: front/dist.
- PUBLIC_API_URL: http://localhost:3000/graphql.

netlify.toml ya contiene la compilación, la carpeta de salida y la URL de API. No configures contraseñas ni JWT_SECRET en Netlify: la interfaz no los necesita.

## Demostración presencial

Con Node.js 24 instalado, abre una terminal en la carpeta del proyecto y ejecuta una vez:

```sh
npm ci
npm run setup
npm run build -w back
```

Para cada demostración:

```sh
npm run demo:netlify
```

Pega la URL HTTPS exacta que Netlify te asignó. El script permite ese origen en la API y escucha únicamente en esta computadora. Abre la URL en el navegador de esta misma computadora y deja la terminal abierta. Si Chrome o Edge solicita acceso a la red local para tu página, concédelo. No desactives globalmente la seguridad del navegador.

La cuenta administradora se encuentra en ACCESOS_LOCALES.txt, generado durante setup. Las cuentas de cliente se registran desde la interfaz. Para detener la API pulsa Ctrl+C. Si otra instancia usa el puerto 3000, detenla antes.

Si no se conecta, comprueba la URL ingresada, el permiso local del navegador y que la API esté activa. Como alternativa para la presentación, npm run dev abre también la interfaz local en http://localhost:4321.

En el reporte describe este alcance expresamente: interfaz publicada en Netlify con backend SQLite local para la demostración. Una visita desde otra computadora sin la API no podrá utilizar el catálogo ni la autenticación.
