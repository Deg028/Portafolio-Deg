// level: 1 = Básico, 2 = Intermedio, 3 = Avanzado
export const levels = {
  1: 'Básico',
  2: 'Intermedio',
  3: 'Avanzado',
}

const skills = [
  { name: 'JavaScript', description: 'Interacciones y lógica', icon: 'JS', iconClass: 'js-icon', level: 3 },
  { name: 'HTML + CSS', description: 'Interfaces responsive', icon: '</>', level: 3 },
  { name: 'Bootstrap', description: 'Sistemas y prototipos', icon: 'B', iconClass: 'bootstrap-icon', level: 2 },
  { name: 'Python', description: 'Automatización y datos', icon: 'Py', iconClass: 'python-icon', level: 2 },
  { name: 'Java', description: 'Desarrollo backend', icon: 'J', iconClass: 'java-icon', level: 3 },
  { name: 'React', description: 'Interfaces y componentes', icon: 'R', iconClass: 'react-icon', level: 2 },
  { name: 'GitHub', description: 'Control de versiones y colaboración', icon: 'GH', iconClass: 'github-icon', level: 3 },
  { name: 'Netlify', description: 'Despliegue de sitios web', icon: 'N', iconClass: 'netlify-icon', level: 2 },
]

export default skills
