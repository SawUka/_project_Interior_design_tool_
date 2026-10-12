import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  // Реактивное состояние авторизации
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem('token');
  });

  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('roomcraft_theme');
    // Если не авторизован — всегда светлая
    if (!localStorage.getItem('token')) return 'light';
    return saved || 'light';
  });

  // Отслеживаем изменения авторизации
  useEffect(() => {
    const checkAuth = () => {
      const auth = !!localStorage.getItem('token');
      setIsAuthenticated(auth);
      
      // Если пользователь вышел — сбрасываем на светлую
      if (!auth) {
        setTheme('light');
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.removeItem('roomcraft_theme');
      }
    };

    checkAuth();

    // Слушаем изменения в других вкладках
    window.addEventListener('storage', checkAuth);
    
    // Периодически проверяем (на случай изменений в этой вкладке)
    const interval = setInterval(checkAuth, 1000);

    return () => {
      window.removeEventListener('storage', checkAuth);
      clearInterval(interval);
    };
  }, []);

  // Применяем тему только если авторизован
  useEffect(() => {
    if (!isAuthenticated) {
      document.documentElement.setAttribute('data-theme', 'light');
      return;
    }

    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('roomcraft_theme', theme);
  }, [theme, isAuthenticated]);

  const toggleTheme = () => {
    if (!isAuthenticated) {
      console.log('Тема доступна только авторизованным пользователям');
      return;
    }
    setTheme(prev => {
      const newTheme = prev === 'light' ? 'dark' : 'light';
      console.log('Переключение темы:', newTheme);
      return newTheme;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme, isAuthenticated }}>
      {children}
    </ThemeContext.Provider>
  );
};