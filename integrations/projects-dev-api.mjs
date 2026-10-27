import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

// Solo existe durante `astro dev`: permite agregar y quitar proyectos desde la propia página
// escribiendo en src/data/projects.json. El archivo se versiona en Git, así que al hacer
// commit y push el despliegue publica los mismos proyectos para todos los visitantes.
// En `astro build` no se registra ninguna ruta: el sitio publicado es 100 % estático.

const dataFile = fileURLToPath(new URL('../src/data/projects.json', import.meta.url))
const endpoint = '/__projects'
const limits = { name: 80, description: 400, category: 40, tag: 24, tags: 8, image: 200 }

function cleanUrl(value) {
  if (value == null || String(value).trim() === '') return null
  const url = new URL(String(value).trim())
  if (url.protocol !== 'https:' && url.protocol !== 'http:') throw new Error('Los enlaces deben empezar con https://')
  return url.href.replace(/\/$/, '')
}

function validate(body) {
  const name = String(body.name ?? '').trim()
  const description = String(body.description ?? '').trim()
  const category = String(body.category ?? '').trim() || 'Web App'
  if (!name || name.length > limits.name) throw new Error('El nombre es obligatorio (máximo 80 caracteres).')
  if (!description || description.length > limits.description) throw new Error('La descripción es obligatoria (máximo 400 caracteres).')
  if (category.length > limits.category) throw new Error('La categoría es demasiado larga.')

  const rawTags = Array.isArray(body.tags) ? body.tags : String(body.tags ?? '').split(',')
  const tags = [...new Set(rawTags.map((tag) => String(tag).trim()).filter(Boolean))]
  if (tags.length > limits.tags || tags.some((tag) => tag.length > limits.tag)) throw new Error('Máximo 8 etiquetas de hasta 24 caracteres.')

  let repository
  let demo
  try {
    repository = cleanUrl(body.repository)
    demo = cleanUrl(body.demo)
  } catch (error) {
    throw new Error(error.message.startsWith('Los enlaces') ? error.message : 'Alguno de los enlaces no es una URL válida.')
  }
  if (!repository && !demo) throw new Error('Agrega al menos un enlace: repositorio o demo.')

  const image = String(body.image ?? '').trim() || null
  if (image && (image.length > limits.image || !/^(\/(?!\/)|https?:\/\/)/.test(image))) {
    throw new Error('La imagen debe ser una ruta de /public (por ejemplo /projects/captura.png) o una URL https.')
  }

  return { name, description, category, tags, image, repository, demo }
}

async function readBody(request) {
  let raw = ''
  for await (const chunk of request) {
    raw += chunk
    if (raw.length > 20_000) throw new Error('La solicitud es demasiado grande.')
  }
  return raw ? JSON.parse(raw) : {}
}

function send(response, status, payload) {
  response.statusCode = status
  response.setHeader('Content-Type', 'application/json')
  response.end(JSON.stringify(payload))
}

export default function projectsDevApi() {
  return {
    name: 'projects-dev-api',
    hooks: {
      'astro:server:setup': ({ server }) => {
        server.middlewares.use(endpoint, async (request, response) => {
          // Evita que otra página abierta en el navegador escriba en el archivo (CSRF).
          const origin = request.headers.origin
          if (request.headers['x-portfolio-dev'] !== '1' || (origin && new URL(origin).host !== request.headers.host)) {
            return send(response, 403, { error: 'Solicitud no permitida.' })
          }

          try {
            const projects = JSON.parse(await readFile(dataFile, 'utf8'))

            if (request.method === 'POST') {
              const project = validate(await readBody(request))
              if (projects.some((item) => item.name.toLowerCase() === project.name.toLowerCase())) {
                return send(response, 409, { error: 'Ya existe un proyecto con ese nombre.' })
              }
              projects.push(project)
            } else if (request.method === 'DELETE') {
              const { name } = await readBody(request)
              const next = projects.filter((item) => item.name !== name)
              if (next.length === projects.length) return send(response, 404, { error: 'No se encontró el proyecto.' })
              projects.length = 0
              projects.push(...next)
            } else {
              return send(response, 405, { error: 'Método no permitido.' })
            }

            await writeFile(dataFile, `${JSON.stringify(projects, null, 2)}\n`, 'utf8')
            send(response, 200, { ok: true, total: projects.length })
          } catch (error) {
            send(response, 400, { error: error.message })
          }
        })
      },
    },
  }
}
