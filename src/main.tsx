import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "./styles/variables.css"
import './index.css'
import App from './App.tsx'
import './styles/LayoutNormalization.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
