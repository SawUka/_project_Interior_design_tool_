import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { authMiddleware } from '../middleware/auth.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const router = express.Router();

const APARTMENTS_FILE = path.join(__dirname, '../data/apartments.json');

const readApartments = () => {
  const data = fs.readFileSync(APARTMENTS_FILE, 'utf-8');
  return JSON.parse(data);
};

const writeApartments = (apartments) => {
  fs.writeFileSync(APARTMENTS_FILE, JSON.stringify(apartments, null, 2));
};

// Получить все квартиры текущего пользователя
router.get('/', authMiddleware, (req, res) => {
  const apartments = readApartments();
  const userApartments = apartments.filter(a => a.userId === req.userId);
  res.json(userApartments);
});

// Получить одну квартиру
router.get('/:id', authMiddleware, (req, res) => {
  const apartments = readApartments();
  const apartment = apartments.find(a => a.id === parseInt(req.params.id));

  if (!apartment) {
    return res.status(404).json({ error: 'Квартира не найдена' });
  }

  if (apartment.userId !== req.userId) {
    return res.status(403).json({ error: 'Доступ запрещен' });
  }

  res.json(apartment);
});

// Создать квартиру
router.post('/', authMiddleware, (req, res) => {
  const { name, rooms, area, style, furniture } = req.body;

  if (!name || !rooms || !area) {
    return res.status(400).json({ error: 'Название, комнаты и площадь обязательны' });
  }

  const apartments = readApartments();

  const newApartment = {
    id: Date.now(),
    userId: req.userId,
    name,
    rooms: parseInt(rooms),
    area: parseFloat(area),
    style: style || 'Современный',
    furniture: furniture || [],
    createdAt: new Date().toISOString()
  };

  apartments.push(newApartment);
  writeApartments(apartments);

  res.status(201).json(newApartment);
});

// Обновить квартиру
router.put('/:id', authMiddleware, (req, res) => {
  const apartments = readApartments();
  const index = apartments.findIndex(a => a.id === parseInt(req.params.id));

  if (index === -1) {
    return res.status(404).json({ error: 'Квартира не найдена' });
  }

  if (apartments[index].userId !== req.userId) {
    return res.status(403).json({ error: 'Доступ запрещен' });
  }

  apartments[index] = {
    ...apartments[index],
    ...req.body,
    updatedAt: new Date().toISOString()
  };

  writeApartments(apartments);

  res.json(apartments[index]);
});

// Удалить квартиру
router.delete('/:id', authMiddleware, (req, res) => {
  const apartments = readApartments();
  const index = apartments.findIndex(a => a.id === parseInt(req.params.id));

  if (index === -1) {
    return res.status(404).json({ error: 'Квартира не найдена' });
  }

  if (apartments[index].userId !== req.userId) {
    return res.status(403).json({ error: 'Доступ запрещен' });
  }

  apartments.splice(index, 1);
  writeApartments(apartments);

  res.json({ message: 'Квартира удалена' });
});

export default router;