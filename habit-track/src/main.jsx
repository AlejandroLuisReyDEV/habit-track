import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './context/AuthContext.jsx' // <-- IMPORTAMOS ESTO

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* ENVOLVEMOS LA APP CON EL PROVEEDOR DE AUTENTICACIÓN */}
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>,
)