import React from 'react'
import ReactDOM from 'react-dom/client'
import './assets/index.css'
import Router from './Router'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Router />
  </React.StrictMode>,
)
