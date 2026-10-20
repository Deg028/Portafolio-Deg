import { useEffect, useRef, useState } from 'react'
import projects from './data/projects.js'
import './App.css'

const themeStorageKey = 'deg-portfolio-theme'
const codeSymbols = ['</>', '{ }', '[ ]', '=>', '01', '!=', '&&']

function readStoredTheme() {
  try {
    return localStorage.getItem(themeStorageKey) === 'dark' ? 'dark' : 'light'
  } catch (error) {
    console.error('No se pudo leer el tema guardado.', error)
    return 'light'
  }
}

function ProjectLink({ href, className, children }) {
  return (
    <a className={className} href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  )
}

function App() {
  const hasInitializedTheme = useRef(false)
  const [theme, setTheme] = useState('light')
  const [brandMark, setBrandMark] = useState('</>')
  const [bootVisible, setBootVisible] = useState(true)
  const [bootReady, setBootReady] = useState(false)
  const [bootExiting, setBootExiting] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeProject, setActiveProject] = useState(0)

  useEffect(() => {
    // Theme preference is only available after Astro has rendered the page.
    // eslint-disable-next-line react/set-state-in-effect -- Hydrate local storage after SSR.
    setTheme(readStoredTheme())
  }, [])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // eslint-disable-next-line react/set-state-in-effect -- Skip the boot animation when requested.
      setBootVisible(false)
      return undefined
    }

    const readyTimer = window.setTimeout(() => setBootReady(true), 600)
    const exitTimer = window.setTimeout(() => setBootExiting(true), 720)
    const removeTimer = window.setTimeout(() => setBootVisible(false), 1_000)

    return () => {
      window.clearTimeout(readyTimer)
      window.clearTimeout(exitTimer)
      window.clearTimeout(removeTimer)
    }
  }, [])

  useEffect(() => {
    const root = document.documentElement
    root.dataset.theme = theme
    root.classList.add('theme-ready')
    const themeColor = document.querySelector('meta[name="theme-color"]')
    if (themeColor) themeColor.content = theme === 'dark' ? '#151b26' : '#f6e5e3'

    if (hasInitializedTheme.current) {
      try {
        localStorage.setItem(themeStorageKey, theme)
      } catch (error) {
        console.error('No se pudo guardar la preferencia de tema.', error)
      }
    } else {
      hasInitializedTheme.current = true
    }

    return () => root.classList.remove('theme-ready')
  }, [theme])

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setBrandMark((currentMark) => {
        const availableSymbols = codeSymbols.filter((symbol) => symbol !== currentMark)
        return availableSymbols[Math.floor(Math.random() * availableSymbols.length)]
      })
    }, 60_000)

    return () => window.clearInterval(intervalId)
  }, [])

  function changeProject(direction) {
    if (projects.length < 2) return
    setActiveProject((current) => (current + direction + projects.length) % projects.length)
  }

  function closeMenu() {
    setMenuOpen(false)
  }

  const selectedProject = projects.length
    ? projects[activeProject % projects.length]
    : null

  return (
    <div className="portfolio-root">
      {bootVisible && (
        <div
          className={`retro-loader${bootExiting ? ' is-exiting' : ''}`}
          role="status"
          aria-live="polite"
        >
          <div className="retro-loader-panel">
            <span className="retro-loader-mark" aria-hidden="true">&lt;/&gt;</span>
            <p className="retro-loader-title">DEG // PORTAFOLIO</p>
            <div className="retro-loader-track" aria-hidden="true">
              <span />
            </div>
            <p className="retro-loader-message">
              {bootReady ? 'SISTEMA LISTO' : 'CARGANDO INTERFAZ...'}
            </p>
          </div>
        </div>
      )}
      <div className="scanlines" aria-hidden="true" />
      <header className="site-header">
        <div className="header-left">
          <a className="brand" href="#inicio" aria-label="Ir al inicio">
            <span className="brand-mark" aria-hidden="true">{brandMark}</span>
            <span className="brand-name">Deg<span className="cursor">_</span></span>
          </a>
          <button
            id="theme-toggle"
            className="theme-toggle"
            type="button"
            aria-label={theme === 'dark' ? 'Activar modo claro' : 'Activar modo oscuro'}
            aria-pressed={theme === 'dark'}
            title={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            onClick={() => setTheme((current) => current === 'dark' ? 'light' : 'dark')}
          >
            <span className="theme-icon" aria-hidden="true">{theme === 'dark' ? '☀' : '☾'}</span>
            <span className="theme-label">{theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}</span>
          </button>
        </div>
        <button
          className="menu-toggle"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="site-nav"
          onClick={() => setMenuOpen((current) => !current)}
        >
          MENU
        </button>
        <nav id="site-nav" className={`site-nav${menuOpen ? ' is-open' : ''}`} aria-label="Navegación principal">
          <a href="#proyectos" onClick={closeMenu}>Proyectos</a>
          <a href="#stack" onClick={closeMenu}>Stack</a>
          <a href="#sobre-mi" onClick={closeMenu}>Sobre mí</a>
          <a className="github-button" href="https://github.com/" target="_blank" rel="noreferrer" aria-label="Visitar GitHub de Deg" title="GitHub de Deg" onClick={closeMenu}>
            <svg className="github-logo" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 1.5a10.5 10.5 0 0 0-3.32 20.46c.53.1.72-.23.72-.5v-1.8c-2.93.64-3.55-1.25-3.55-1.25-.48-1.22-1.17-1.55-1.17-1.55-.96-.66.07-.65.07-.65 1.06.08 1.62 1.09 1.62 1.09.94 1.61 2.46 1.14 3.06.87.1-.68.37-1.14.67-1.4-2.34-.27-4.8-1.17-4.8-5.2 0-1.15.41-2.09 1.08-2.83-.11-.27-.47-1.34.1-2.79 0 0 .88-.28 2.89 1.08A10 10 0 0 1 12 6.7a10 10 0 0 1 2.63.36c2-.136 2.88-1.08 2.88-1.08.57 1.45.21 2.52.1 2.79.68.74 1.09 1.68 1.09 2.83 0 4.04-2.47 4.92-4.82 5.19.38.33.72.97.72 1.96v2.9c0 .27.19.6.73.5A10.5 10.5 0 0 0 12 1.5Z" />
            </svg>
            <span>GitHub</span>
          </a>
        </nav>
      </header>

      <main>
        <section id="inicio" className="hero section-shell">
          <div className="hero-copy reveal">
            <p className="eyebrow"><span className="status-dot" />Disponible para proyectos</p>
            <h1>Desarrollo web full stack: <em>frontend atractivo y backend eficiente.</em></h1>
            <p className="hero-intro">Desarrollador full stack enfocado en crear productos claros, veloces y con personalidad. Código limpio, ideas grandes.</p>
            <div className="hero-actions">
              <a className="button button-primary" href="#proyectos">Ver proyectos <span aria-hidden="true">-&gt;</span></a>
              <a className="button button-ghost" href="#contacto">Contáctame</a>
            </div>
            <div className="hero-meta">
              <span><strong>02+</strong> años creando<br />sitios web responsive</span>
              <span><strong>03</strong> proyectos lanzados</span>
            </div>
          </div>
          <div className="hero-console reveal" aria-label="Perfil de desarrollador">
            <div className="console-top"><span>PROFILE.exe</span><span>■ ■ ■</span></div>
            <div className="avatar-stage">
              <div className="code-screen" aria-hidden="true"><span>const deg = {'{'}</span><span>  coffee: true,</span><span>  code: 'ready'</span><span>{'};'}</span></div>
              <div className="pixel-avatar" aria-hidden="true">
                <i className="hair" /><i className="face" /><i className="neck" />
                <i className="eye eye-left" /><i className="eye eye-right" /><i className="mouth" />
                <i className="shirt" /><i className="typing-hand" /><i className="coffee-cup" /><i className="coffee-steam" />
              </div>
              <div className="pixel-desk" aria-hidden="true"><span className="keyboard" /><span className="desk-line" /></div>
              <div className="level-badge">LVL 04</div>
            </div>
            <div className="console-info"><span>PLAYER_01</span><strong>FULL-STACK<br />DEVELOPER</strong></div>
            <div className="xp-label"><span>EXPERIENCIA</span><span>84%</span></div>
            <div className="xp-bar"><span /></div>
            <div className="console-bottom"><span>STATUS: ONLINE</span><span>///</span></div>
          </div>
        </section>

        <section id="proyectos" className="projects section-shell">
          <div className="section-heading reveal">
            <div><p className="eyebrow">01 / trabajo seleccionado</p><h2>Proyectos <span>destacados</span></h2></div>
          </div>
          <div className="project-viewer reveal">
            <div id="project-track" className="project-track">
              {selectedProject ? (
                <article className="project-card">
                  <div className="project-preview">
                    {selectedProject.demo ? (
                      <>
                        <iframe
                          src={selectedProject.demo}
                          title={`Vista previa del proyecto ${selectedProject.name}`}
                          loading="lazy"
                          referrerPolicy="no-referrer"
                          sandbox="allow-forms allow-popups allow-scripts allow-same-origin"
                        />
                        <ProjectLink className="preview-open-link" href={selectedProject.demo}>Abrir sitio</ProjectLink>
                      </>
                    ) : selectedProject.repository ? (
                      <ProjectLink className="repository-preview" href={selectedProject.repository}>⌘  Ver repositorio en GitHub</ProjectLink>
                    ) : null}
                  </div>
                  <div className="project-details">
                    <span className="project-category">{selectedProject.category}</span>
                    <h3>{selectedProject.name}</h3>
                    <p>{selectedProject.description}</p>
                    <div className="project-links">
                      {selectedProject.repository && <ProjectLink href={selectedProject.repository}>Ver código en GitHub</ProjectLink>}
                      {selectedProject.demo && <ProjectLink href={selectedProject.demo}>Ver proyecto en vivo</ProjectLink>}
                    </div>
                  </div>
                </article>
              ) : (
                <p className="project-empty">Aún no hay proyectos publicados. Agrega tus proyectos al catálogo para que aparezcan aquí para todos.</p>
              )}
            </div>
            <div className="slider-controls">
              <div id="project-dots" className="project-dots" aria-label="Seleccionar proyecto">
                {projects.map((project, index) => (
                  <button
                    key={`${project.name}-${index}`}
                    type="button"
                    aria-label={`Mostrar proyecto ${index + 1}: ${project.name}`}
                    aria-current={index === activeProject}
                    onClick={() => setActiveProject(index)}
                  />
                ))}
              </div>
              <div className="arrow-controls">
                <button id="prev-project" className="icon-button" type="button" aria-label="Proyecto anterior" disabled={projects.length < 2} onClick={() => changeProject(-1)}>&#8592;</button>
                <button id="next-project" className="icon-button" type="button" aria-label="Siguiente proyecto" disabled={projects.length < 2} onClick={() => changeProject(1)}>&#8594;</button>
              </div>
            </div>
          </div>
        </section>

        <section id="stack" className="stack section-shell">
          <div className="section-heading reveal"><div><p className="eyebrow">02 / herramientas</p><h2>Mi <span>stack</span></h2></div></div>
          <div className="stack-grid reveal">
            <article className="skill-item" style={{ '--skill': '95%' }}><div className="skill-icon js-icon">JS</div><div><h3>JavaScript</h3><p>Interacciones y lógica</p></div><span className="skill-level">95%</span></article>
            <article className="skill-item" style={{ '--skill': '98%' }}><div className="skill-icon">&lt;/&gt;</div><div><h3>HTML + CSS</h3><p>Interfaces responsive</p></div><span className="skill-level">100%</span></article>
            <article className="skill-item" style={{ '--skill': '88%' }}><div className="skill-icon bootstrap-icon">B</div><div><h3>Bootstrap</h3><p>Sistemas y prototipos</p></div><span className="skill-level">100%</span></article>
            <article className="skill-item" style={{ '--skill': '82%' }}><div className="skill-icon python-icon">Py</div><div><h3>Python</h3><p>Automatización y datos</p></div><span className="skill-level">92%</span></article>
            <article className="skill-item skill-item-java" style={{ '--skill': '90%' }}><div className="skill-icon java-icon">J</div><div><h3>Java</h3><p>Desarrollo backend</p></div><span className="skill-level">90%</span></article>
            <article className="skill-item" style={{ '--skill': '80%' }}><div className="skill-icon react-icon">R</div><div><h3>React</h3><p>Interfaces y componentes</p></div><span className="skill-level">80%</span></article>
            <article className="skill-item" style={{ '--skill': '90%' }}><div className="skill-icon github-icon">GH</div><div><h3>GitHub</h3><p>Control de versiones y colaboración</p></div><span className="skill-level">90%</span></article>
            <article className="skill-item" style={{ '--skill': '80%' }}><div className="skill-icon netlify-icon">N</div><div><h3>Netlify</h3><p>Despliegue de sitios web</p></div><span className="skill-level">80%</span></article>
          </div>
        </section>

        <section id="sobre-mi" className="about section-shell">
          <div className="about-copy reveal">
            <p className="eyebrow">03 / el jugador y el desarrollador</p>
            <h2>Código con <span>intención.</span></h2>
            <p>Creo proyectos web full stack de principio a fin: interfaces frontend, APIs y backend listos para funcionar.</p>
            <div className="about-tags"><span>Inteligencia artificial</span><span>Desarrollo web full stack</span><span>Aprendizaje continuo</span></div>
          </div>
          <div className="quote-box reveal"><span className="quote-mark">“</span><p>Si puedes crear una idea por más descabellada que suene, hazla realidad.</p><span className="quote-author">— Deg</span></div>
        </section>

        <section id="contacto" className="contact section-shell reveal">
          <p className="eyebrow">04 / siguiente nivel</p>
          <h2>Hagamos algo <span>memorable.</span></h2>
          <p>Tu próxima idea merece una buena partida. Cuéntame qué tienes en mente y lo desarrollamos.</p>
          <a className="button button-primary" href="mailto:hola@deg.dev" aria-label="Enviar correo a hola@deg.dev">
            <svg className="gmail-icon" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="#4285f4" d="M1.6 6.7v11.1c0 .9.7 1.6 1.6 1.6h2.5V9.2L1.6 6.7Z" />
              <path fill="#34a853" d="M18.3 19.4h2.5c.9 0 1.6-.7 1.6-1.6V6.7l-4.1 2.5v10.2Z" />
              <path fill="#fbbc04" d="M18.3 4.6v4.6l4.1-2.5V5.1c0-1.7-1.9-2.7-3.3-1.7l-.8 1.2Z" />
              <path fill="#ea4335" d="M5.7 9.2 12 14l6.3-4.8V4.6L12 9.4 5.7 4.6v4.6Z" />
              <path fill="#c5221f" d="M1.6 5.1v1.6l4.1 2.5V4.6l-.8-1.2c-1.4-1-3.3 0-3.3 1.7Z" />
            </svg>
            <span>hola@deg.dev</span>
            <span aria-hidden="true">-&gt;</span>
          </a>
        </section>
      </main>

      <footer className="site-footer section-shell">
        <span className="footer-copyright">© 2026 <strong>DEG</strong></span>
        <span className="footer-credit">HECHO CON <b>☕</b> Y <strong>BUEN CÓDIGO</strong></span>
        <a href="#inicio">VOLVER ARRIBA ↑</a>
      </footer>

    </div>
  )
}

export default App
