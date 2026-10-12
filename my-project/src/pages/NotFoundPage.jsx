import { Link } from 'react-router-dom';
import './NotFoundPage.css';

const NotFoundPage = () => (
  <div className="not-found">
    <h1>404</h1>
    <h2>Страница не найдена</h2>
    <p>К сожалению, запрашиваемая страница не существует</p>
    <Link to="/" className="btn btn-primary">На главную</Link>
  </div>
);

export default NotFoundPage;