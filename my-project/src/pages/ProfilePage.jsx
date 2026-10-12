import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './ProfilePage.css';

const ProfilePage = () => {
  const { user, logout, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    email: '',
    phone: '',
    birthDate: ''
  });
  const [activities, setActivities] = useState([]);
  const [stats, setStats] = useState({
    apartments: 0,
    favorites: 0
  });
  const [avatarPreview, setAvatarPreview] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        birthDate: user.birthDate || ''
      });
      setAvatarPreview(user.avatar || null);
    }
  }, [user]);

  // Загрузка активности
  useEffect(() => {
    const saved = localStorage.getItem('roomcraft_activities');
    if (saved) {
      setActivities(JSON.parse(saved));
    }
  }, []);

  // Загрузка реальной статистики
  useEffect(() => {
    const loadStats = async () => {
      // Квартиры из API
      try {
        const res = await fetch('http://localhost:3001/api/apartments', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (res.ok) {
          const apartments = await res.json();
          setStats(prev => ({ ...prev, apartments: apartments.length }));
        }
      } catch (err) {
        console.error('Ошибка загрузки квартир:', err);
      }

      // Избранное из localStorage
      const favorites = JSON.parse(localStorage.getItem('roomcraft_favorites') || '[]');
      setStats(prev => ({ ...prev, favorites: favorites.length }));
    };

    if (user) {
      loadStats();
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Сжимаем изображение
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = async () => {
      const maxSize = 200;
      let width = img.width;
      let height = img.height;
      
      if (width > height) {
        if (width > maxSize) {
          height *= maxSize / width;
          width = maxSize;
        }
      } else {
        if (height > maxSize) {
          width *= maxSize / height;
          height = maxSize;
        }
      }
      
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);
      
      const avatarBase64 = canvas.toDataURL('image/jpeg', 0.8);
      setAvatarPreview(avatarBase64);
      
      try {
        await updateProfile({ avatar: avatarBase64 });
        setMessage('Аватар обновлён!');
        setTimeout(() => setMessage(''), 3000);
      } catch (err) {
        setMessage('Ошибка обновления аватара');
        setTimeout(() => setMessage(''), 3000);
      }
    };
    
    img.src = URL.createObjectURL(file);
  };

  const handleSave = async () => {
    try {
      await updateProfile(formData);
      setMessage('Профиль обновлён!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Ошибка сохранения');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Только что';
    if (minutes < 60) return `${minutes} мин назад`;
    if (hours < 24) return `${hours} ч назад`;
    if (days === 1) return 'Вчера';
    return `${days} дн назад`;
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'constructor': return '🏠';
      case 'catalog': return '🛋️';
      case 'profile': return '👤';
      case 'apartment': return '';
      default: return '📌';
    }
  };

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-layout">
          {/* Левое меню */}
          <aside className="profile-sidebar">
            <nav className="profile-nav">
              <button 
                className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => setActiveTab('profile')}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                Мой профиль
              </button>
              <Link to="/dashboard" className="nav-item">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                  <polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
                Мои квартиры
              </Link>
              <Link to="/favorites" className="nav-item">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
                Избранное
              </Link>
              <Link to="/settings" className="nav-item">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                </svg>
                Настройки
              </Link>
              <button 
                className="nav-item logout-btn"
                onClick={handleLogout}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                  <polyline points="16 17 21 12 16 7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
                Выйти
              </button>
            </nav>
          </aside>

          {/* Основной контент */}
          <main className="profile-content">
            <div className="content-header">
              <h1>Профиль</h1>
              <p>Здесь вы можете просмотреть и изменить свои данные, а также управлять аккаунтом.</p>
            </div>

            {activeTab === 'profile' && (
              <>
                {/* Карточка профиля */}
                <div className="profile-card">
                  <div className="profile-info">
                    <div className="profile-avatar-wrapper">
                      <img 
                        src={avatarPreview || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200"} 
                        alt="Аватар" 
                        className="profile-avatar"
                      />
                      <label className="avatar-upload-btn" title="Изменить аватар">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                          <circle cx="12" cy="13" r="4"/>
                        </svg>
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={handleAvatarChange}
                          style={{ display: 'none' }}
                        />
                      </label>
                    </div>
                    <div className="profile-details">
                      <h2>{user?.name} {user?.lastName}</h2>
                      <p className="profile-email">{user?.email}</p>
                      <span className="profile-role">Пользователь</span>
                    </div>
                  </div>

                  <div className="profile-stats">
                    <div className="stat">
                      <span className="stat-number">{stats.apartments}</span>
                      <span className="stat-label">Квартиры</span>
                    </div>
                    <div className="stat">
                      <span className="stat-number">{stats.favorites}</span>
                      <span className="stat-label">Избранных товаров</span>
                    </div>
                  </div>
                </div>

                {/* Форма редактирования */}
                <div className="edit-form">
                  <div className="form-tabs">
                    <button className="form-tab active">Личные данные</button>
                  </div>

                  <div className="form-grid">
                    <div className="form-group">
                      <label>Имя</label>
                      <input 
                        type="text" 
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-group">
                      <label>Фамилия</label>
                      <input 
                        type="text" 
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-group">
                      <label>Email</label>
                      <input 
                        type="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-group">
                      <label>Телефон</label>
                      <input 
                        type="tel" 
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-group">
                      <label>Дата рождения</label>
                      <input 
                        type="date" 
                        name="birthDate"
                        value={formData.birthDate}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <button className="btn-save" onClick={handleSave}>
                    Сохранить изменения
                  </button>

                  {message && <div className="message">{message}</div>}
                </div>

                {/* Быстрые действия */}
                <div className="quick-actions">
                  <h3>Быстрые действия</h3>
                  <div className="actions-grid">
                    <Link to="/constructor" className="action-card">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                        <polyline points="9 22 9 12 15 12 15 22"/>
                      </svg>
                      <span>Создать новую квартиру</span>
                    </Link>
                    <Link to="/catalog" className="action-card">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="3" width="7" height="7"/>
                        <rect x="14" y="3" width="7" height="7"/>
                        <rect x="14" y="14" width="7" height="7"/>
                        <rect x="3" y="14" width="7" height="7"/>
                      </svg>
                      <span>Перейти в каталог</span>
                    </Link>
                    <Link to="/constructor" className="action-card">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
                      </svg>
                      <span>Открыть конструктор</span>
                    </Link>
                  </div>
                </div>

                {/* Последняя активность */}
                <div className="activity-section">
                  <h3>Последняя активность</h3>
                  {activities.length === 0 ? (
                    <p className="no-activity">Нет активности</p>
                  ) : (
                    <div className="activity-list">
                      {activities.map(activity => (
                        <div key={activity.id} className="activity-item">
                          <div className="activity-content">
                            <p className="activity-description">{activity.description}</p>
                            <span className="activity-time">{formatTime(activity.timestamp)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;