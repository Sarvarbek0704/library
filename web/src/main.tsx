import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './store/index.ts'
import { Toaster } from 'react-hot-toast'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from './contexts/ThemeContext.tsx'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <BrowserRouter>
          <App />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: 'rgb(17,17,21)',
                color: 'rgb(245,245,247)',
                border: '1px solid rgb(38,38,50)',
                borderRadius: '12px',
                fontSize: '14px',
              },
              success: { iconTheme: { primary: 'rgb(34,197,94)', secondary: 'rgb(17,17,21)' } },
              error:   { iconTheme: { primary: 'rgb(239,68,68)',  secondary: 'rgb(17,17,21)' } },
            }}
          />
        </BrowserRouter>
      </Provider>
    </QueryClientProvider>
    </ThemeProvider>
  </React.StrictMode>
)
