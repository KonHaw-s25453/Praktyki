import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ApiClient } from "./api/src";
import './index.css'
import App from './App.tsx'

ApiClient.instance.basePath = import.meta.env.VITE_API_URL;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
