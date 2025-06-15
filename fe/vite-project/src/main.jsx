import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom' // <-- Add this line
import './index.css'
import App from './App.jsx'
import { QueryClient } from '@tanstack/react-query' // <-- Import QueryClient
const queryClient=new QueryClient();
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <QueryClient.Provider client={queryClient}>
         <App/>
    </QueryClient.Provider>
    </BrowserRouter>
  </StrictMode>
)
