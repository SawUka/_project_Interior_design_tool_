import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import './SettingsPage.css';

const SettingsPage = () => {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();

  // Если не авторизован — показываем сообщение
  if (!user) {
    return (
      <div className="settings-page">
        <div className="container">
          <div className="settings-header">
            <h1>Настройки</h1>
            <p>Войдите в аккаунт, чтобы изменить настройки</p>
          </div>
          <div className="settings-card">
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px' }}>
              Для изменения темы оформления необходимо войти в аккаунт.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="settings-page">
      <div className="container">
        <div className="settings-header">
          <h1>Настройки</h1>
          <p>Выберите тему оформления сайта</p>
        </div>

        <div className="settings-card">
          <h2>Тема оформления</h2>
          
          <div className="theme-options">
            <button
              className={`theme-card ${theme === 'light' ? 'active' : ''}`}
                onClick={() => {
              console.log('Клик на светлую тему, текущая:', theme);
                if (theme !== 'light') toggleTheme();
            }}
            >
              <div className="theme-preview light-preview">
                <div className="preview-header">
                  <div className="preview-logo"></div>
                  <div className="preview-nav">
                    <div className="preview-nav-item"></div>
                    <div className="preview-nav-item"></div>
                    <div className="preview-nav-item"></div>
                  </div>
                </div>
                <div className="preview-content">
                  <div className="preview-block"></div>
                  <div className="preview-block small"></div>
                  <div className="preview-block"></div>
                </div>
              </div>
              <div className="theme-info">
                <div>
                  <h3>Светлая тема</h3>
                  <p>Классическое светлое оформление</p>
                </div>
              </div>
              {theme === 'light' && <div className="theme-check">✓</div>}
            </button>

            <button
              className={`theme-card ${theme === 'dark' ? 'active' : ''}`}
                onClick={() => {
              console.log('Клик на тёмную тему, текущая:', theme);
                if (theme !== 'dark') toggleTheme();
            }}
            >
              <div className="theme-preview dark-preview">
                <div className="preview-header">
                  <div className="preview-logo"></div>
                  <div className="preview-nav">
                    <div className="preview-nav-item"></div>
                    <div className="preview-nav-item"></div>
                    <div className="preview-nav-item"></div>
                  </div>
                </div>
                <div className="preview-content">
                  <div className="preview-block"></div>
                  <div className="preview-block small"></div>
                  <div className="preview-block"></div>
                </div>
              </div>
              <div className="theme-info">
                <div>
                  <h3>Тёмная тема</h3>
                  <p>Тёмное оформление для комфорта глаз</p>
                </div>
              </div>
              {theme === 'dark' && <div className="theme-check">✓</div>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;