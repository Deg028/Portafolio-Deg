# Portafolio de Deg

Portafolio estático creado con Astro y React. Astro genera la página y sus metadatos; React mantiene la interactividad del tema, el menú y la navegación de proyectos.

## Requisitos

- Node.js 22.22.0 o superior.
- npm.

## Desarrollo

```sh
npm install
npm run dev
```

Astro muestra la URL local en la terminal, normalmente `http://localhost:4321`.

## Producción

```sh
npm run build
npm run preview
```

## Verificaciones

```sh
npm run lint
npm run build
```

## Proyectos publicados

El catálogo compartido vive en `src/data/projects.js`. Los proyectos incluidos allí se muestran a todos los visitantes; ya no se guardan en el navegador de cada persona.

### Agregar un proyecto

1. Abre `src/data/projects.js` y agrega un objeto al arreglo:

   ```js
   const projects = [
     {
       name: 'Nombre de mi proyecto',
       description: 'Qué hace el proyecto y qué parte desarrollé.',
       category: 'Web App',
       repository: 'https://github.com/mi-usuario/mi-repositorio',
       demo: 'https://mi-proyecto.netlify.app',
     },
   ]

   export default projects
   ```

2. Sustituye los valores de ejemplo por los datos reales. `repository` enlaza al código y `demo` al sitio publicado. Si no tienes uno de los enlaces, puedes asignarle `null`; agrega al menos uno. Para incluir varios proyectos, separa los objetos con comas.
3. Guarda el archivo y ejecuta `npm run dev` para revisar la página localmente en `http://localhost:4321/`. Confirma que los textos y enlaces sean correctos y revisa la presentación en escritorio y móvil.
4. Verifica que el sitio compile:

   ```sh
   npm run build
   ```

5. Sube el cambio a GitHub:

   ```sh
   git add src/data/projects.js
   git commit -m "Add portfolio project"
   git push origin main
   ```

6. Confirma que el despliegue termine en la plataforma de hosting. Si está configurada para publicar los cambios de `main`, el `push` iniciará el despliegue automáticamente; de lo contrario, tendrás que iniciarlo desde esa plataforma.

La tarjeta muestra el sitio dentro de una vista previa cuando se proporciona `demo`. Algunos sitios bloquean esa presentación en un marco; en ese caso, el enlace permite abrirlos directamente. Los proyectos guardados anteriormente en el navegador no se transfieren al catálogo y deben agregarse aquí.

## Conectar un CMS más adelante

Todavía no hay un CMS conectado. Para añadir uno, se definiría en el CMS un tipo de contenido “Proyecto” con campos como nombre, descripción, categoría, repositorio, demo e imagen. Astro consultaría esos datos al compilar y los usaría para generar la página estática. Al publicar cambios en el CMS, un webhook podría iniciar un nuevo despliegue. Las claves privadas necesarias se guardarían como variables de entorno del servicio de compilación, nunca en el navegador.
