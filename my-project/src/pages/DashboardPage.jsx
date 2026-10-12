import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './DashboardPage.css';

const DashboardPage = () => {
  const { user } = useAuth();
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApartments = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/apartments', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setApartments(data);
        }
        setLoading(false);
      } catch (err) {
        console.error('Ошибка загрузки:', err);
        setLoading(false);
      }
    };
    fetchApartments();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Удалить квартиру?')) return;
    
    try {
      const res = await fetch(`http://localhost:3001/api/apartments/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (res.ok) {
        setApartments(apartments.filter(a => a.id !== id));
      }
    } catch (err) {
      console.error('Ошибка удаления:', err);
    }
  };

  if (loading) return <div className="loading">Загрузка...</div>;

  return (
    <div className="dashboard-page">
      <div className="container">
        <div className="dashboard-header">
          <h1>Мои квартиры</h1>
          <Link to="/constructor" className="btn-create">
            + Создать квартиру
          </Link>
        </div>

        {apartments.length === 0 ? (
          <div className="empty-state">
            <p>У вас пока нет квартир</p>
            <Link to="/constructor" className="btn-primary">
              Создать первую квартиру
            </Link>
          </div>
        ) : (
          <div className="apartments-grid">
            {apartments.map(apt => (
              <div key={apt.id} className="apartment-card">
                <div className="apartment-image">
                  <img 
                    src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=400" 
                    alt={apt.name}
                  />
                </div>
                <div className="apartment-info">
                  <h3>{apt.name}</h3>
                  <p className="apartment-details">
                    {apt.rooms} комнаты · {apt.area} м²
                  </p>
                  <div className="apartment-actions">
                    <Link to={`/constructor?id=${apt.id}`} className="btn-open">
                      Открыть
                    </Link>
                    <button 
                      className="btn-delete"
                      onClick={() => handleDelete(apt.id)}
                    >
                      ...
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

export default DashboardPage;