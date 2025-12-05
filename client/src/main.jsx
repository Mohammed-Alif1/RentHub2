import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { AppContextProvider } from './context/AppContext.jsx'
import { MotionConfig } from 'motion/react'


createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <MotionConfig viewport={{ once: true }}>
      <AppContextProvider>
        <App />
      </AppContextProvider>
    </MotionConfig>
  </BrowserRouter>,
)
