import { useEffect } from 'react'
import { initializePortfolio } from '../script.js'
import portfolioDocument from '../Portafolio/Index.html?raw'
import './App.css'

const bodyMatch = portfolioDocument.match(
  /<body[^>]*>([\s\S]*?)<script\b[^>]*src="script\.js"[^>]*><\/script>\s*<\/body>/i,
)

if (!bodyMatch) {
  throw new Error('No se pudo cargar el contenido HTML del portafolio.')
}

function App() {
  useEffect(() => initializePortfolio(), [])

  return (
    <div
      className="portfolio-root"
      dangerouslySetInnerHTML={{ __html: bodyMatch[1] }}
    />
  )
}

export default App
