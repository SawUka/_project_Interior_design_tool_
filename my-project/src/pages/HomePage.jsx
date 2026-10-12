import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroSlides = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1600',
      title: 'Создайте интерьер своей мечты',
      subtitle: 'Планируйте, расставляйте мебель, подбирайте стиль и создавайте уют в каждом уголке вашей квартиры.',
      cta: 'Перейти к конструктору',
      ctaLink: '/constructor'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1600',
      title: 'Тысячи товаров в каталоге',
      subtitle: 'Выбирайте из огромной коллекции мебели и декора от лучших производителей.',
      cta: 'Смотреть каталог',
      ctaLink: '/catalog'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1600',
      title: 'Сохраняйте и делитесь проектами',
      subtitle: 'Все ваши квартиры в одном месте. Делитесь идеями с друзьями и семьёй.',
      cta: 'Мои квартиры',
      ctaLink: '/dashboard'
    }
  ];

  const featureCards = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600',
      title: 'Хотите выиграть дизайн-проект?',
      description: 'Участвуйте в нашем конкурсе и получите бесплатный дизайн-проект от профессионалов.'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600',
      title: 'Читайте всё о RoomCraft!',
      description: 'Статьи, обзоры и идеи для вашего следующего проекта.'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600',
      title: 'Привилегии участника',
      description: 'Получайте бонусы, скидки и эксклюзивный доступ к новинкам.'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  return (
    <div className="home-page">
      {/* Hero Section — только большой слайдер */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-slider">
            <div className="hero-slide">
              <img 
                src={heroSlides[currentSlide].image} 
                alt={heroSlides[currentSlide].title}
                className="hero-image"
              />
              <div className="hero-overlay">
                <div className="hero-content">
                  <h1>{heroSlides[currentSlide].title}</h1>
                  <p>{heroSlides[currentSlide].subtitle}</p>
                  <Link to={heroSlides[currentSlide].ctaLink} className="hero-cta">
                    {heroSlides[currentSlide].cta}
                  </Link>
                </div>
              </div>
            </div>

            <button className="slider-nav prev" onClick={prevSlide}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
            </button>
            <button className="slider-nav next" onClick={nextSlide}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </button>

            <div className="slider-dots">
              {heroSlides.map((_, index) => (
                <button
                  key={index}
                  className={`dot ${index === currentSlide ? 'active' : ''}`}
                  onClick={() => setCurrentSlide(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Секция "Узнайте больше" — без кнопок */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Узнайте больше</h2>
          <div className="features-grid">
            {featureCards.map(card => (
              <div key={card.id} className="feature-card">
                <div className="feature-image">
                  <img src={card.image} alt={card.title} />
                </div>
                <div className="feature-content">
                  <h3>{card.title}</h3>
                  <p>{card.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA секция */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Готовы создать свой идеальный интерьер?</h2>
            <p>Начните проектировать прямо сейчас — это бесплатно!</p>
            <div className="cta-buttons">
              <Link to="/constructor" className="btn-primary">
                Открыть конструктор
              </Link>
              <Link to="/catalog" className="btn-secondary">
                Смотреть каталог
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;