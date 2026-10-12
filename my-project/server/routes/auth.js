import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { JWT_SECRET } from '../middleware/auth.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const router = express.Router();

const USERS_FILE = path.join(__dirname, '../data/users.json');

const readUsers = () => {
  const data = fs.readFileSync(USERS_FILE, 'utf-8');
  return JSON.parse(data);
};

const writeUsers = (users) => {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
};

// Функция для формирования полного объекта пользователя
const formatUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  avatar: user.avatar || null,
  lastName: user.lastName || '',
  birthDate: user.birthDate || '',
  phone: user.phone || ''
});

// Регистрация
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Все поля обязательны' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Пароль должен содержать минимум 6 символов' });
    }
    const users = readUsers();
    const exists = users.find(u => u.email === email);
    if (exists) {
      return res.status(400).json({ error: 'Пользователь с таким email уже существует' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: Date.now(),
      name,
      email,
      password: hashedPassword,
      role: 'user',
      lastName: '',
      birthDate: '',
      phone: '',
      avatar: null,
      createdAt: new Date().toISOString()
    };
    users.push(newUser);
    writeUsers(users);
    const token = jwt.sign({ userId: newUser.id }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({
      token,
      user: formatUser(newUser)
    });
  } catch (err) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Вход
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const users = readUsers();
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ error: 'Неверный email или пароль' });
    }
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: 'Неверный email или пароль' });
    }
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({
      token,
      user: formatUser(user)
    });
  } catch (err) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Текущий пользователь
router.get('/me', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Не авторизован' });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const users = readUsers();
    const user = users.find(u => u.id === decoded.userId);
    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }
    res.json({ user: formatUser(user) });
  } catch (err) {
    res.status(401).json({ error: 'Недействительный токен' });
  }
});

// Обновление профиля
router.put('/profile', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Не авторизован' });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const users = readUsers();
    const index = users.findIndex(u => u.id === decoded.userId);
    if (index === -1) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }
    const { name, email, avatar, lastName, birthDate, phone } = req.body;
    if (email && email !== users[index].email) {
      const exists = users.find(u => u.email === email);
      if (exists) {
        return res.status(400).json({ error: 'Email уже используется' });
      }
    }
    if (name) users[index].name = name;
    if (email) users[index].email = email;
    if (avatar) users[index].avatar = avatar;
    if (lastName !== undefined) users[index].lastName = lastName;
    if (birthDate !== undefined) users[index].birthDate = birthDate;
    if (phone !== undefined) users[index].phone = phone;
    writeUsers(users);
    res.json({ user: formatUser(users[index]) });
  } catch (err) {
    res.status(401).json({ error: 'Недействительный токен' });
  }
});

export default router;