import { useState } from 'react'

// Única isla de React: alterna entre la vista previa del sitio y la del repositorio.
// El HTML inicial se genera en el servidor, así que sin JS las tarjetas siguen mostrando
// los enlaces; el iframe solo se carga cuando la persona lo pide.
function ProjectPreview({ name, demo, repository, repositoryImage }) {
  const [mode, setMode] = useState(demo ? 'site' : 'repo')
  const [siteLoaded, setSiteLoaded] = useState(false)
  const [imageFailed, setImageFailed] = useState(false)
  const hasBoth = Boolean(demo && repository)

  return (
    <div className="project-preview">
      {hasBoth && (
        <div className="preview-tabs" role="group" aria-label={`Vista previa de ${name}`}>
          <button type="button" aria-pressed={mode === 'site'} onClick={() => setMode('site')}>Sitio</button>
          <button type="button" aria-pressed={mode === 'repo'} onClick={() => setMode('repo')}>Repositorio</button>
        </div>
      )}

      <div className="preview-frame">
        {mode === 'site' && demo && (
          siteLoaded ? (
            <iframe
              src={demo}
              title={`Vista previa del sitio ${name}`}
              referrerPolicy="no-referrer"
              sandbox="allow-forms allow-popups allow-scripts allow-same-origin"
            />
          ) : (
            <div className="preview-placeholder">
              <span className="preview-url" aria-hidden="true">{new URL(demo).host}</span>
              <button type="button" className="preview-load" onClick={() => setSiteLoaded(true)}>
                ▶ Cargar vista previa
              </button>
            </div>
          )
        )}

        {mode === 'repo' && repository && (
          <a className="preview-repo" href={repository} target="_blank" rel="noopener noreferrer">
            {repositoryImage && !imageFailed ? (
              <img
                src={repositoryImage}
                alt={`Vista previa del repositorio de ${name} en GitHub`}
                loading="lazy"
                width="1200"
                height="600"
                onError={() => setImageFailed(true)}
              />
            ) : (
              <span>⌘ Ver repositorio en GitHub</span>
            )}
          </a>
        )}
      </div>
    </div>
  )
}

export default ProjectPreview
