// level: 1 = Básico, 2 = Intermedio, 3 = Avanzado
export const levels = {
  1: 'Básico',
  2: 'Intermedio',
  3: 'Avanzado',
}

const skills = [
  { name: 'JavaScript', description: 'Lógica de aplicación e interactividad', icon: 'JS', iconClass: 'js-icon', level: 3 },
  { name: 'HTML + CSS', description: 'Maquetación responsive y accesible', icon: '</>', level: 3 },
  { name: 'Bootstrap', description: 'Prototipado rápido de interfaces', icon: 'B', iconClass: 'bootstrap-icon', level: 2 },
  { name: 'Python', description: 'Automatización y manejo de datos', icon: 'Py', iconClass: 'python-icon', level: 2 },
  { name: 'Java', description: 'Lógica de servidor y backend', icon: 'J', iconClass: 'java-icon', level: 3 },
  { name: 'React', description: 'Interfaces basadas en componentes', icon: 'R', iconClass: 'react-icon', level: 2 },
  { name: 'GitHub', description: 'Control de versiones y trabajo colaborativo', icon: 'GH', iconClass: 'github-icon', level: 3 },
  { name: 'Netlify', description: 'Despliegue continuo de sitios web', icon: 'N', iconClass: 'netlify-icon', level: 2 },
]

export default skills
