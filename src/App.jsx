import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import NotificationPage from './pages/NotificationPage'
import ProductsPage from './pages/ProductsPage'
import CategoriesPage from './pages/CategoriesPage'
import OrdersPage from './pages/OrdersPage'
import UsersPage from './pages/UsersPage'
import BannersPage from './pages/BannersPage'
import FlashSalePage from './pages/FlashSalePage'
import BlogsPage from './pages/BlogsPage'
import ProfilePage from './pages/ProfilePage'
import AdminLayout from './layouts/AdminLayout'
import { ProfileProvider } from './contexts/ProfileContext'
import './App.css'
import './styles/global.css'

// Protected route component that wraps pages with AdminLayout
function ProtectedRoute({ children }) {
  return (
    <ProfileProvider>
      <AdminLayout>{children}</AdminLayout>
    </ProfileProvider>
  )
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } />
        <Route path="/notifications" element={
          <ProtectedRoute>
            <NotificationPage />
          </ProtectedRoute>
        } />
        <Route path="/products" element={
          <ProtectedRoute>
            <ProductsPage />
          </ProtectedRoute>
        } />
        <Route path="/categories" element={
          <ProtectedRoute>
            <CategoriesPage />
          </ProtectedRoute>
        } />
        <Route path="/orders" element={
          <ProtectedRoute>
            <OrdersPage />
          </ProtectedRoute>
        } />
        <Route path="/users" element={
          <ProtectedRoute>
            <UsersPage />
          </ProtectedRoute>
        } />
        <Route path="/banners" element={
          <ProtectedRoute>
            <BannersPage />
          </ProtectedRoute>
        } />
        <Route path="/blog" element={
          <ProtectedRoute>
            <BlogsPage />
          </ProtectedRoute>
        } />
        <Route path="/flash-sale" element={
          <ProtectedRoute>
            <FlashSalePage />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        } />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  )
}

export default App
