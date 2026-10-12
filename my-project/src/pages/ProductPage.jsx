import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './ProductPage.css';

const ProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(null);
  const [isFavorite, setIsFavorite] = useState(() => {
    const savedFavorites = JSON.parse(localStorage.getItem('roomcraft_favorites') || '[]');
    return savedFavorites.includes(parseInt(id));
  });

  const toggleFavorite = () => {
    const savedFavorites = JSON.parse(localStorage.getItem('roomcraft_favorites') || '[]');
    const productId = parseInt(id);
    const newFavorites = savedFavorites.includes(productId)
      ? savedFavorites.filter(favId => favId !== productId)
      : [...savedFavorites, productId];
    localStorage.setItem('roomcraft_favorites', JSON.stringify(newFavorites));
    setIsFavorite(!isFavorite);
  };

  useEffect(() => {
    const abortController = new AbortController();
    
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/furniture/${id}`, { 
          signal: abortController.signal 
        });
        if (!res.ok) throw new Error('Товар не найден');
        const data = await res.json();
        setProduct(data);
        setSelectedImage(0);
        if (data.colors && data.colors.length > 0) {
          setSelectedColor(data.colors[0]);
        }

        const allRes = await fetch('http://localhost:3001/api/furniture', {
          signal: abortController.signal
        });
        if (allRes.ok) {
          const allData = await allRes.json();
          setSimilar(allData.filter(p => p.category === data.category && p.id !== data.id).slice(0, 4));
        }
        setLoading(false);
      } catch (err) {
        if (err.name !== 'AbortError') setLoading(false);
      }
    };

    fetchProduct();
    return () => abortController.abort();
  }, [id]);

  const handleColorSelect = (color) => {
    setSelectedColor(color);
    if (color.image) {
      const imageIndex = product.images.findIndex(img => img === color.image);
      setSelectedImage(imageIndex >= 0 ? imageIndex : 0);
    }
  };

  const formatPrice = (price) => {
    return Math.round(price).toLocaleString('ru-RU') + ' ';
  };

  const renderStars = (rating) => {
    const full = Math.floor(rating);
    return '★'.repeat(full) + '☆'.repeat(5 - full);
  };

  if (loading) return <div className="loading">Загрузка...</div>;
  if (!product) return <div className="not-found">Товар не найден</div>;

  const images = product.images?.length > 0 ? product.images : [product.thumbnail];
  const currentImage = selectedColor?.image || images[selectedImage];

  return (
    <div className="product-page">
      <div className="container">
        <nav className="breadcrumb">
          <Link to="/">Главная</Link> <span className="sep">›</span>
          <Link to="/catalog">Каталог</Link> <span className="sep">›</span>
          <Link to={`/catalog?cat=${product.category}`}>{product.category}</Link> <span className="sep">›</span>
          <span>{product.title}</span>
        </nav>

        <div className="product-layout">
          <div className="product-gallery">
            <div className="main-image">
              <img src={currentImage} alt={product.title} />
            </div>
            <div className="thumbnails">
              {images.slice(0, 4).map((img, i) => (
                <button
                  key={i}
                  className={`thumb ${selectedImage === i ? 'active' : ''}`}
                  onClick={() => setSelectedImage(i)}
                >
                  <img src={img} alt="" />
                </button>
              ))}
            </div>
          </div>

          <div className="product-info">
            <div className="product-header">
              <h1>{product.title}</h1>
              <button className={`fav-btn ${isFavorite ? 'active' : ''}`} onClick={toggleFavorite}>
                {isFavorite ? '♥' : '♡'}
              </button>
            </div>

            {product.inStock && <span className="in-stock">✓ В наличии</span>}

            <div className="rating">
              <span className="stars">{renderStars(product.rating)}</span>
              <span className="rating-value">{product.rating}</span>
              <span className="reviews">({product.reviews || 24} отзывов)</span>
            </div>

            <p className="price">{formatPrice(product.price)}</p>

            <div className="description">
              <h3>Описание</h3>
              <p>{product.description}</p>
            </div>

            <div className="specs">
              <h3>Характеристики</h3>
              <div className="spec-row">
                <span className="spec-label">Размеры (Ш×В×Г)</span>
                <span className="spec-value">{product.meta?.dimensions?.width} × {product.meta?.dimensions?.height} × {product.meta?.dimensions?.depth} см</span>
              </div>
              <div className="spec-row">
                <span className="spec-label">Материал</span>
                <span className="spec-value">{product.meta?.material}</span>
              </div>
              <div className="spec-row">
                <span className="spec-label">Цвет</span>
                <span className="spec-value">{selectedColor?.name || '-'}</span>
              </div>
              <div className="spec-row">
                <span className="spec-label">Стиль</span>
                <span className="spec-value">{product.style}</span>
              </div>
              <div className="spec-row">
                <span className="spec-label">Комната</span>
                <span className="spec-value">{product.room}</span>
              </div>
            </div>

            {product.colors && product.colors.length > 0 && (
              <div className="color-section">
                <h3>Выберите цвет: <span className="selected-color-name">{selectedColor?.name}</span></h3>
                <div className="color-options">
                  {product.colors.map((color, index) => (
                    <button
                      key={index}
                      className={`color-option ${selectedColor?.name === color.name ? 'active' : ''}`}
                      onClick={() => handleColorSelect(color)}
                      title={color.name}
                    >
                      <span 
                        className="color-dot" 
                        style={{ 
                          backgroundColor: color.hex,
                          border: color.hex.toUpperCase() === '#FFFFFF' || color.hex.toUpperCase() === '#F5F5F5' ? '2px solid #ddd' : 'none'
                        }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="benefits">
              <div className="benefit"><span></span><span>Быстрая доставка</span></div>
              <div className="benefit"><span>✓</span><span>Гарантия качества</span></div>
              <div className="benefit"><span>♥</span><span>В избранное</span></div>
            </div>
          </div>
        </div>

        {similar.length > 0 && (
          <div className="similar-section">
            <h2>Похожие товары</h2>
            <div className="similar-grid">
              {similar.map(p => (
                <Link to={`/catalog/${p.id}`} key={p.id} className="similar-card">
                  <img src={p.thumbnail} alt={p.title} />
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductPage;