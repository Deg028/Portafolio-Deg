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

Los proyectos se administran en `src/data/projects.js`, que forma parte del repositorio y se incluye en la página generada por Astro. Para publicar uno, agrega un objeto al arreglo:

```js
const projects = [
  {
    name: 'Nombre del proyecto',
    description: 'Qué hace y qué parte desarrollaste.',
    category: 'Web App',
    repository: 'https://github.com/usuario/proyecto',
    demo: 'https://mi-proyecto.example.com',
  },
]

export default projects
```

Puedes dejar `repository` o `demo` como `null` si no tienes ese enlace; agrega al menos uno. Guarda el archivo, verifica con `npm run build` y publica los cambios del repositorio para que el catálogo actualizado aparezca para todos los visitantes. Los proyectos que se hayan agregado previamente desde el formulario del navegador estaban guardados solo en ese navegador y no se transfieren al catálogo automáticamente.

## Conectar un CMS más adelante

El catálogo actual está listo para sustituirse por contenido de un CMS, pero todavía no hay ningún CMS conectado. Con un CMS como Sanity o Contentful, crearías un tipo de contenido “Proyecto” con campos equivalentes (nombre, descripción, categoría, repositorio, demo y, opcionalmente, imagen). Astro consultaría ese contenido durante la compilación, entregaría la lista al componente React y generaría la página estática con los datos publicados.

El flujo sería: editar y publicar un proyecto en el CMS → el CMS avisa al servicio de despliegue → Astro vuelve a compilar → el portafolio publicado muestra el cambio. Las claves privadas, si el proveedor las requiere, se guardarían como variables de entorno del servidor y nunca en React ni en el navegador. Así no hace falta crear un panel de administración propio y todos los visitantes reciben el mismo contenido.
