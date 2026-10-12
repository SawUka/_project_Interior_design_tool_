import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './FavoritesPage.css';

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [furniture, setFurniture] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/furniture');
        const data = await res.json();
        setFurniture(data);
        
        const savedFavorites = JSON.parse(localStorage.getItem('roomcraft_favorites') || '[]');
        const favoriteItems = data.filter(item => savedFavorites.includes(item.id));
        setFavorites(favoriteItems);
        setLoading(false);
      } catch (err) {
        console.error('Ошибка загрузки:', err);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const removeFromFavorites = (id) => {
    const savedFavorites = JSON.parse(localStorage.getItem('roomcraft_favorites') || '[]');
    const newFavorites = savedFavorites.filter(favId => favId !== id);
    localStorage.setItem('roomcraft_favorites', JSON.stringify(newFavorites));
    setFavorites(favorites.filter(item => item.id !== id));
  };

  const formatPrice = (price) => Math.round(price).toLocaleString('ru-RU') + ' ₸';

  if (loading) return <div className="loading">Загрузка...</div>;

  return (
    <div className="favorites-page">
      <div className="container">
        <div className="favorites-header">
          <h1>Избранное</h1>
          <p className="favorites-count">{favorites.length} товаров</p>
        </div>

        {favorites.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">♡</div>
            <h2>Список избранного пуст</h2>
            <p>Добавляйте товары в избранное, чтобы не потерять их</p>
            <Link to="/catalog" className="btn-primary">Перейти в каталог</Link>
          </div>
        ) : (
          <div className="favorites-grid">
            {favorites.map(item => (
              <div key={item.id} className="favorite-card">
                <Link to={`/catalog/${item.id}`} className="favorite-image">
                  <img src={item.thumbnail} alt={item.title} />
                </Link>
                <div className="favorite-info">
                  <Link to={`/catalog/${item.id}`} className="favorite-title">
                    {item.title}
                  </Link>
                  <p className="favorite-category">{item.category} · {item.room}</p>
                  <p className="favorite-price">{formatPrice(item.price)}</p>
                  <div className="favorite-actions">
                    <Link to={`/catalog/${item.id}`} className="btn-view">
                      Подробнее
                    </Link>
                    <button 
                      className="btn-remove"
                      onClick={() => removeFromFavorites(item.id)}
                    >
                      Удалить
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;