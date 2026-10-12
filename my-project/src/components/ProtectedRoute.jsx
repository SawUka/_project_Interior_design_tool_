import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // Пока загружается - показываем загрузку
  if (loading) {
    return <div style={{padding: '50px', textAlign: 'center'}}>Загрузка...</div>;
  }

  // Если нет пользователя - редирект на логин
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Если есть пользователь - показываем контент
  return children;
};

export default ProtectedRoute;