import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './CatalogPage.css';

const topCategories = ['Все', 'Диваны', 'Кровати', 'Столы', 'Стулья', 'Шкафы', 'Комоды', 'Освещение'];

const rooms = ['Гостиная', 'Спальня', 'Кухня', 'Кабинет'];
const styles = ['Современный', 'Минимализм', 'Скандинавский', 'Лофт', 'Классика', 'Ретро'];

const colorPalette = [
  { name: 'Бежевый', hex: '#D8C8B5' },
  { name: 'Серый', hex: '#8B8B8B' },
  { name: 'Белый', hex: '#FFFFFF' },
  { name: 'Чёрный', hex: '#1A1A1A' },
  { name: 'Зелёный', hex: '#4A6B5A' },
  { name: 'Синий', hex: '#2C5F7F' },
  { name: 'Коричневый', hex: '#6B4423' }
];

const CatalogPage = () => {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [selectedCat, setSelectedCat] = useState('Все');
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [selectedStyles, setSelectedStyles] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [priceMax, setPriceMax] = useState(500000);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState(() => {
    return JSON.parse(localStorage.getItem('roomcraft_favorites') || '[]');
  });

  useEffect(() => {
    const abortController = new AbortController();
    const fetchProducts = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/furniture', { 
          signal: abortController.signal 
        });
        if (!res.ok) throw new Error('Ошибка загрузки');
        const data = await res.json();
        setProducts(data);
        setFiltered(data);
        setLoading(false);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError('Не удалось загрузить каталог мебели');
          setLoading(false);
        }
      }
    };
    fetchProducts();
    return () => abortController.abort();
  }, []);

  useEffect(() => {
    let res = [...products];

    if (selectedCat !== 'Все') {
      res = res.filter(p => p.category === selectedCat);
    }

    if (selectedRooms.length > 0) {
      res = res.filter(p => selectedRooms.includes(p.room));
    }

    if (selectedStyles.length > 0) {
      res = res.filter(p => selectedStyles.includes(p.style));
    }

    if (selectedColors.length > 0) {
      res = res.filter(p => 
        p.colors && p.colors.some(c => selectedColors.includes(c.name))
      );
    }

    res = res.filter(p => p.price <= priceMax);

    if (search) {
      res = res.filter(p => 
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (sortBy === 'price-asc') res.sort((a, b) => a.price - b.price);
    if (sortBy === 'price-desc') res.sort((a, b) => b.price - a.price);
    if (sortBy === 'rating') res.sort((a, b) => b.rating - a.rating);

    setFiltered(res);
  }, [selectedCat, selectedRooms, selectedStyles, selectedColors, priceMax, search, sortBy, products]);

  const toggleRoom = (room) => {
    setSelectedRooms(prev => prev.includes(room) ? prev.filter(r => r !== room) : [...prev, room]);
  };

  const toggleStyle = (style) => {
    setSelectedStyles(prev => prev.includes(style) ? prev.filter(s => s !== style) : [...prev, style]);
  };

  const toggleColor = (color) => {
    setSelectedColors(prev => prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]);
  };

    const toggleFavorite = (id) => {
    const savedFavorites = JSON.parse(localStorage.getItem('roomcraft_favorites') || '[]');
    const newFavorites = savedFavorites.includes(id) 
      ? savedFavorites.filter(favId => favId !== id)
      : [...savedFavorites, id];
    localStorage.setItem('roomcraft_favorites', JSON.stringify(newFavorites));
    setFavorites(newFavorites);
  };

  const formatPrice = (price) => {
    return Math.round(price).toLocaleString('ru-RU') + ' ₸';
  };

  if (loading) return <div className="loading">Загрузка каталога...</div>;
  if (error) return (
    <div className="error-state">
      <p>{error}</p>
      <button onClick={() => window.location.reload()} className="btn-primary">Повторить</button>
    </div>
  );

  return (
    <div className="catalog-page">
      <div className="container">
        <div className="catalog-hero">
          <h1>Каталог мебели</h1>
          <p>Выбирайте мебель для своего интерьера. Добавляйте в проект и создавайте уют.</p>
        </div>

        <div className="category-tabs">
          {topCategories.map(cat => (
            <button
              key={cat}
              className={`tab-btn ${selectedCat === cat ? 'active' : ''}`}
              onClick={() => setSelectedCat(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="catalog-layout">
          <aside className="filters-sidebar">
            <div className="filter-section">
              <h3>Комната</h3>
              {rooms.map(room => (
                <label key={room} className="filter-option">
                  <input 
                    type="checkbox" 
                    checked={selectedRooms.includes(room)}
                    onChange={() => toggleRoom(room)}
                  />
                  {room}
                </label>
              ))}
            </div>

            <div className="filter-section">
              <h3>Стиль</h3>
              {styles.map(style => (
                <label key={style} className="filter-option">
                  <input 
                    type="checkbox" 
                    checked={selectedStyles.includes(style)}
                    onChange={() => toggleStyle(style)}
                  />
                  {style}
                </label>
              ))}
            </div>

            <div className="filter-section">
              <h3>Цвет</h3>
              <div className="color-filter">
                {colorPalette.map(color => (
                  <button
                    key={color.name}
                    className={`color-filter-btn ${selectedColors.includes(color.name) ? 'active' : ''}`}
                    onClick={() => toggleColor(color.name)}
                    title={color.name}
                    style={{ backgroundColor: color.hex }}
                  />
                ))}
              </div>
            </div>

            <div className="filter-section">
              <h3>Цена</h3>
              <div className="price-slider">
                <input 
                  type="range" 
                  min="0" 
                  max="500000" 
                  step="5000"
                  value={priceMax}
                  onChange={(e) => setPriceMax(parseInt(e.target.value))}
                />
                <div className="price-values">
                  <span>0 ₸</span>
                  <span>{formatPrice(priceMax)}</span>
                </div>
              </div>
            </div>
          </aside>

          <main className="catalog-main">
            <div className="catalog-header">
              <input 
                type="text" 
                placeholder="Поиск по мебели..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="search-input-main"
              />
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
              >
                <option value="popular">По популярности</option>
                <option value="price-asc">По цене (сначала дешёвые)</option>
                <option value="price-desc">По цене (сначала дорогие)</option>
                <option value="rating">По рейтингу</option>
              </select>
            </div>

            {filtered.length === 0 ? (
              <div className="empty-state">
                <p>Ничего не найдено</p>
              </div>
            ) : (
              <div className="products-grid">
                {filtered.map(p => (
                  <Link to={`/catalog/${p.id}`} key={p.id} className="product-card">
                    <div className="product-image">
                      <img src={p.thumbnail} alt={p.title} />
                      <button 
                        className={`favorite-btn ${favorites.includes(p.id) ? 'active' : ''}`}
                        onClick={(e) => {
                          e.preventDefault();
                          toggleFavorite(p.id);
                        }}
                      >
                        {favorites.includes(p.id) ? '♥' : '♡'}
                      </button>
                    </div>
                    <div className="product-info">
                      <h3>{p.title}</h3>
                      <p className="cat">{p.category} · {p.room}</p>
                      <p className="price">{formatPrice(p.price)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default CatalogPage;