import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import ProductPage from './pages/ProductPage';
import DashboardPage from './pages/DashboardPage';
import ConstructorPage from './pages/ConstructorPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ExplorePage from './pages/ExplorePage';
import ProfilePage from './pages/ProfilePage';
import FavoritesPage from './pages/FavoritesPage';
import SettingsPage from './pages/SettingsPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              
              <Route path="catalog" element={
                <ProtectedRoute>
                  <CatalogPage />
                </ProtectedRoute>
              } />
              <Route path="catalog/:id" element={
                <ProtectedRoute>
                  <ProductPage />
                </ProtectedRoute>
              } />
              
              <Route path="explore" element={<ExplorePage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
              
              <Route path="dashboard" element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              } />
              <Route path="constructor" element={
                <ProtectedRoute>
                  <ConstructorPage />
                </ProtectedRoute>
              } />
              <Route path="constructor/:id" element={
                <ProtectedRoute>
                  <ConstructorPage />
                </ProtectedRoute>
              } />
              <Route path="profile" element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } />
              <Route path="favorites" element={
                <ProtectedRoute>
                  <FavoritesPage />
                </ProtectedRoute>
              } />
              <Route path="settings" element={
                <ProtectedRoute>
                  <SettingsPage />
                </ProtectedRoute>
              } />
              
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;