# Portafolio de Deg

Portafolio estático creado con Astro, sin frameworks de interfaz en el navegador. Astro genera toda la página en HTML estático; el tema, el menú, el efecto de escritura y la etiqueta de las tarjetas usan scripts pequeños. Si el JS falla, el contenido y los enlaces siguen funcionando.

La interfaz toma como referencia el portafolio [PotatoSlop/portfolio](https://github.com/PotatoSlop/portfolio) (navegación en píldoras con barrido, título grande con efecto de escritura, banco de accesos con borde discontinuo, tarjetas de proyecto con imagen y etiqueta que sigue al cursor, pie curvo) manteniendo la identidad propia: tipografía pixel, paleta rojo/amarillo, escena del desarrollador y modo oscuro.

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

El catálogo vive en `src/data/projects.json` y se versiona en Git. Todo lo que esté ahí se genera como HTML estático, por lo que **lo ven todos los visitantes** cuando el sitio se despliega.

### Agregar un proyecto (flujo local → público)

1. Ejecuta `npm run dev` y abre `http://localhost:4321/`.
2. En la sección **Proyectos** aparece el panel punteado **«+ Agregar proyecto»** (solo existe en local). Llena nombre, descripción, categoría, tecnologías y al menos un enlace (repositorio o demo) y pulsa **Guardar en el catálogo**.
3. El proyecto se escribe en `src/data/projects.json` y aparece al instante. Cada tarjeta tiene un botón **«Quitar del catálogo»** (también solo en local).
4. Verifica que compile y publica:

   ```sh
   npm run build
   git add src/data/projects.json
   git commit -m "Add portfolio project"
   git push origin main
   ```

5. Si el hosting está configurado para desplegar `main`, el `push` publica el cambio para todos; de lo contrario, inicia el despliegue desde la plataforma.

También puedes editar `src/data/projects.json` a mano: cada objeto lleva `name`, `description`, `category`, `tags` (arreglo, puede ser vacío), `image` (ruta en `public/`, por ejemplo `/projects/captura.png`, o `null`), `repository` y `demo` (usa `null` si no aplica, pero debe haber al menos uno).

El panel y el botón «Quitar» no se incluyen en `npm run build`, y la ruta que escribe el archivo (`integrations/projects-dev-api.mjs`) solo existe en el servidor de desarrollo.

Cada proyecto es una tarjeta con su captura de fondo; al pulsarla abre el sitio en vivo (o el repositorio si no hay demo) y los enlaces de abajo permiten elegir. Guarda las capturas en `public/projects/`.

## Habilidades

Los niveles (Básico, Intermedio, Avanzado) se editan en `src/data/skills.js` con `level: 1`, `2` o `3`.

## Conectar un CMS más adelante

Todavía no hay un CMS conectado. Para añadir uno, se definiría en el CMS un tipo de contenido “Proyecto” con campos como nombre, descripción, categoría, repositorio, demo e imagen. Astro consultaría esos datos al compilar y los usaría para generar la página estática. Al publicar cambios en el CMS, un webhook podría iniciar un nuevo despliegue. Las claves privadas necesarias se guardarían como variables de entorno del servicio de compilación, nunca en el navegador.
