import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';
import apartmentRoutes from './routes/apartments.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Роуты
app.use('/api/auth', authRoutes);
app.use('/api/apartments', apartmentRoutes);

// Маршрут для получения мебели
app.get('/api/furniture', (req, res) => {
  try {
    const furnitureFile = path.join(__dirname, 'data/furniture.json');
    const data = fs.readFileSync(furnitureFile, 'utf-8');
    const furniture = JSON.parse(data);
    res.json(furniture);
  } catch (err) {
    res.status(500).json({ error: 'Ошибка чтения данных' });
  }
});

// Маршрут для получения одного предмета мебели
app.get('/api/furniture/:id', (req, res) => {
  try {
    const furnitureFile = path.join(__dirname, 'data/furniture.json');
    const data = fs.readFileSync(furnitureFile, 'utf-8');
    const furniture = JSON.parse(data);
    const item = furniture.find(f => f.id === parseInt(req.params.id));
    
    if (!item) {
      return res.status(404).json({ error: 'Товар не найден' });
    }
    
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: 'Ошибка чтения данных' });
  }
});

// Проверка сервера
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'RoomCraft API работает' });
});

// Хранилище проектов в памяти (можно заменить на файл/БД)
const projectsStorage = {};

// Сохранение проекта комнаты
app.post('/api/rooms', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Не авторизован' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const { name, projects } = req.body;

    // Сохраняем в память сервера
    if (!projectsStorage[decoded.userId]) {
      projectsStorage[decoded.userId] = {};
    }
    projectsStorage[decoded.userId] = {
      name,
      projects,
      updatedAt: new Date().toISOString()
    };

    console.log('Проект сохранён:', { 
      userId: decoded.userId, 
      name,
      rooms: Object.keys(projects || {}).length
    });

    res.json({ 
      success: true, 
      message: 'Проект сохранён',
      projectId: Date.now()
    });
  } catch (err) {
    console.error('Ошибка сохранения:', err);
    res.status(401).json({ error: 'Недействительный токен' });
  }
});

// Загрузка проекта
app.get('/api/rooms', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Не авторизован' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const project = projectsStorage[decoded.userId] || null;
    res.json(project);
  } catch (err) {
    res.status(401).json({ error: 'Недействительный токен' });
  }
});

// Обновление квартиры
app.put('/api/apartments/:id', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Не авторизован' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const apartmentId = parseInt(req.params.id);

    const apartmentsFile = path.join(__dirname, 'data/apartments.json');
    const apartments = JSON.parse(fs.readFileSync(apartmentsFile, 'utf-8'));
    const index = apartments.findIndex(a => a.id === apartmentId);

    if (index === -1) {
      return res.status(404).json({ error: 'Квартира не найдена' });
    }

    if (apartments[index].userId !== decoded.userId) {
      return res.status(403).json({ error: 'Доступ запрещен' });
    }

    apartments[index] = {
      ...apartments[index],
      ...req.body,
      updatedAt: new Date().toISOString()
    };

    fs.writeFileSync(apartmentsFile, JSON.stringify(apartments, null, 2));
    res.json(apartments[index]);
  } catch (err) {
    res.status(401).json({ error: 'Недействительный токен' });
  }
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
  console.log(`Мебель доступна на http://localhost:${PORT}/api/furniture`);
});