import { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Layout.css';

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [avatarKey, setAvatarKey] = useState(0);

  useEffect(() => {
    setAvatarKey(prev => prev + 1);
  }, [user?.avatar]);

  const handleLogout = () => {
    logout();
    navigate('/');
    setShowDropdown(false);
  };

  const getAvatarSrc = () => {
    if (!user?.avatar) {
      return "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100";
    }

    if (user.avatar.startsWith('data:')) {
      return user.avatar;
    }

    const separator = user.avatar.includes('?') ? '&' : '?';
    return `${user.avatar}${separator}v=${avatarKey}`;
  };

  return (
    <div className="layout">
      <header className="header">
        <div className="container header-content">
          <Link to="/" className="logo">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            <span>RoomCraft</span>
          </Link>
          
          <nav className="nav">
            <Link to="/" className="nav-link">Главная</Link>
            <Link to="/catalog" className="nav-link">Каталог</Link>
            <Link to="/constructor" className="nav-link">Конструктор</Link>
            <Link to="/dashboard" className="nav-link">Мои квартиры</Link>
            <Link to="/profile" className="nav-link">Профиль</Link>
          </nav>

          <div className="header-right">
            {user ? (
              <div className="profile-dropdown">
                <button 
                  className="profile-trigger"
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  <img 
                    src={getAvatarSrc()} 
                    alt="Аватар" 
                    className="avatar-small"
                    key={`small-${avatarKey}`}
                  />
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </button>

                {showDropdown && (
                  <div className="dropdown-menu">
                    <div className="dropdown-header">
                      <img 
                        src={getAvatarSrc()} 
                        alt="Аватар" 
                        className="avatar-medium"
                        key={`medium-${avatarKey}`}
                      />
                      <div>
                        <p className="user-name">{user.name}</p>
                        <p className="user-email">{user.email}</p>
                      </div>
                    </div>
                    <Link to="/profile" className="dropdown-item" onClick={() => setShowDropdown(false)}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                        <circle cx="12" cy="7" r="4"/>
                      </svg>
                      Профиль
                    </Link>
                    <Link to="/settings" className="dropdown-item" onClick={() => setShowDropdown(false)}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="3"/>
                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                      </svg>
                      Настройки
                    </Link>
                    <button className="dropdown-item logout" onClick={handleLogout}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                        <polyline points="16 17 21 12 16 7"/>
                        <line x1="21" y1="12" x2="9" y2="12"/>
                      </svg>
                      Выйти
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="auth-buttons">
                <Link to="/login" className="btn-login">Войти</Link>
                <Link to="/register" className="btn-register">Регистрация</Link>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="main">
        <Outlet />
      </main>

      <footer className="footer">
        <div className="container">
          <p>© 2026 RoomCraft. Все права защищены.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;