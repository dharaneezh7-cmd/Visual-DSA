import { StrictMode } from 'react'
import { RouterProvider } from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from './context/AuthContext'
import { router } from './router/router'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
)