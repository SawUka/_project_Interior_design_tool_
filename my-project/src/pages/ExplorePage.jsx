import { useState, useEffect } from 'react';
import './ExplorePage.css';

const ExplorePage = () => {
  const [inspirations, setInspirations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const abortController = new AbortController();
    const fetchInspirations = async () => {
      try {
        const res = await fetch('https://dummyjson.com/products?limit=20&skip=50', { signal: abortController.signal });
        if (!res.ok) throw new Error('Ошибка загрузки');
        const data = await res.json();
        setInspirations(data.products);
        setLoading(false);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError('Не удалось загрузить данные. Проверьте подключение к интернету.');
          setLoading(false);
        }
      }
    };
    fetchInspirations();
    return () => abortController.abort();
  }, []);

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    window.location.reload();
  };

  if (loading) return <div className="status-msg">Загрузка...</div>;

  return (
    <div className="explore-page">
      <div className="container">
        <h1>О проекте RoomCraft</h1>
        <p className="subtitle">Создавайте интерьеры мечты с нашим конструктором</p>

        {error && (
          <div className="error-state">
            <p>{error}</p>
            <button onClick={handleRetry} className="btn btn-primary">Повторить</button>
          </div>
        )}

        {!error && (
          <div className="inspirations-grid">
            {inspirations.map(item => (
              <div key={item.id} className="inspiration-card">
                <img src={item.thumbnail} alt={item.title} />
                <div className="inspiration-info">
                  <h3>{item.title}</h3>
                  <p className="cat">{item.category}</p>
                  <p className="price">{item.price} ₽</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExplorePage;