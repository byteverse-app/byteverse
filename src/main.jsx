import React from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App.jsx'
import SeedPage from './pages/SeedPage.jsx'
import './styles/global.css'

const router = createBrowserRouter([
  { path: '/', element: <App /> },
  { path: '/seed', element: <SeedPage /> }
])

createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
)
