import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AuthPage.css';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }
    if (form.password.length < 6) {
      setError('Пароль должен содержать минимум 6 символов');
      return;
    }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Ошибка регистрации');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="logo-header">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
          <span>RoomCraft</span>
        </div>
        <h1>Регистрация</h1>
        <p className="subtitle">Создайте аккаунт, чтобы сохранять проекты и управлять своими квартирами</p>
        {error && <div className="error-msg">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Имя</label>
            <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required placeholder="Введите ваше имя" />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required placeholder="example@mail.com" />
          </div>
          <div className="form-group">
            <label>Пароль</label>
            <input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required placeholder="Придумайте пароль" />
          </div>
          <div className="form-group">
            <label>Подтвердите пароль</label>
            <input type="password" value={form.confirmPassword} onChange={e => setForm({...form, confirmPassword: e.target.value})} required placeholder="Повторите пароль" />
          </div>
          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? 'Регистрация...' : 'Зарегистрироваться'}
          </button>
        </form>
        <p className="footer-text">
          Уже есть аккаунт? <Link to="/login">Войти</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;