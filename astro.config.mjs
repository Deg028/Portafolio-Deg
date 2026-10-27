import { defineConfig } from 'astro/config'
import projectsDevApi from './integrations/projects-dev-api.mjs'

export default defineConfig({
  site: 'https://portafolio-deg.vercel.app',
  integrations: [projectsDevApi()],
})
