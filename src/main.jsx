import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from './context/AuthContext'
import AppRouter from './routes/AppRouter'
import { CartProvider } from './context/CartContext'
import { NotificationsProvider } from './context/NotificationsContext'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <CartProvider>
        <NotificationsProvider>
          <AppRouter />
        </NotificationsProvider>
      </CartProvider>
    </AuthProvider>
  </StrictMode>
)