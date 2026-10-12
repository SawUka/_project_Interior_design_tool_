import { useState, useEffect, useCallback } from 'react';
import { Rnd } from 'react-rnd';
import { useAuth } from '../context/AuthContext';
import './ConstructorPage.css';

const furnitureIcons = {
  'Диван Modern': (color) => `<svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg">
    <rect x="5" y="10" width="110" height="60" rx="8" fill="${color}" stroke="#666" stroke-width="1"/>
    <rect x="10" y="15" width="100" height="20" rx="4" fill="${color}" opacity="0.85"/>
    <rect x="10" y="40" width="45" height="25" rx="3" fill="${color}" opacity="0.95"/>
    <rect x="65" y="40" width="45" height="25" rx="3" fill="${color}" opacity="0.95"/>
    <rect x="10" y="15" width="20" height="45" rx="3" fill="${color}" opacity="0.75"/>
    <rect x="90" y="15" width="20" height="45" rx="3" fill="${color}" opacity="0.75"/>
  </svg>`,
  'Диван Classic': (color) => `<svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg">
    <rect x="8" y="12" width="104" height="56" rx="6" fill="${color}" stroke="#666" stroke-width="1"/>
    <rect x="12" y="16" width="96" height="18" rx="3" fill="${color}" opacity="0.85"/>
    <rect x="12" y="38" width="44" height="26" rx="2" fill="${color}" opacity="0.95"/>
    <rect x="64" y="38" width="44" height="26" rx="2" fill="${color}" opacity="0.95"/>
  </svg>`,
  'Диван Corner': (color) => `<svg viewBox="0 0 140 120" xmlns="http://www.w3.org/2000/svg">
    <path d="M10,10 L130,10 L130,50 L70,50 L70,110 L10,110 Z" fill="${color}" stroke="#666" stroke-width="1"/>
    <rect x="15" y="15" width="110" height="15" rx="2" fill="${color}" opacity="0.85"/>
    <rect x="15" y="55" width="50" height="50" rx="2" fill="${color}" opacity="0.9"/>
  </svg>`,
  'Диван Retro': (color) => `<svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="60" cy="40" rx="55" ry="35" fill="${color}" stroke="#666" stroke-width="1"/>
    <circle cx="30" cy="40" r="12" fill="${color}" opacity="0.85"/>
    <circle cx="60" cy="40" r="12" fill="${color}" opacity="0.85"/>
    <circle cx="90" cy="40" r="12" fill="${color}" opacity="0.85"/>
  </svg>`,
  'Кровать Arc': (color) => `<svg viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg">
    <rect x="10" y="30" width="80" height="85" rx="4" fill="${color}" stroke="#666" stroke-width="1"/>
    <path d="M10,30 Q50,5 90,30" fill="none" stroke="#666" stroke-width="3"/>
    <rect x="15" y="35" width="32" height="35" rx="2" fill="${color}" opacity="0.85"/>
    <rect x="53" y="35" width="32" height="35" rx="2" fill="${color}" opacity="0.85"/>
  </svg>`,
  'Кровать Rectangular': (color) => `<svg viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg">
    <rect x="10" y="25" width="80" height="90" rx="3" fill="${color}" stroke="#666" stroke-width="1"/>
    <rect x="10" y="25" width="80" height="20" fill="${color}" opacity="0.8"/>
    <rect x="15" y="50" width="32" height="30" rx="2" fill="${color}" opacity="0.9"/>
    <rect x="53" y="50" width="32" height="30" rx="2" fill="${color}" opacity="0.9"/>
  </svg>`,
  'Кровать Single': (color) => `<svg viewBox="0 0 80 120" xmlns="http://www.w3.org/2000/svg">
    <rect x="10" y="25" width="60" height="90" rx="3" fill="${color}" stroke="#666" stroke-width="1"/>
    <rect x="10" y="25" width="60" height="18" fill="${color}" opacity="0.8"/>
    <rect x="15" y="48" width="50" height="28" rx="2" fill="${color}" opacity="0.9"/>
  </svg>`,
  'Кровать Kids': (color) => `<svg viewBox="0 0 80 100" xmlns="http://www.w3.org/2000/svg">
    <path d="M10,30 Q40,10 70,30 L70,90 L10,90 Z" fill="${color}" stroke="#666" stroke-width="1"/>
    <rect x="15" y="35" width="50" height="50" rx="2" fill="${color}" opacity="0.85"/>
  </svg>`,
  'Стол Minimal': (color) => `<svg viewBox="0 0 100 80" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="50" cy="40" rx="45" ry="35" fill="${color}" stroke="#666" stroke-width="1.5"/>
    <circle cx="20" cy="20" r="4" fill="#D4C5B0"/>
    <circle cx="80" cy="20" r="4" fill="#D4C5B0"/>
    <circle cx="20" cy="60" r="4" fill="#D4C5B0"/>
    <circle cx="80" cy="60" r="4" fill="#D4C5B0"/>
  </svg>`,
  'Стол Desk': (color) => `<svg viewBox="0 0 120 70" xmlns="http://www.w3.org/2000/svg">
    <rect x="5" y="5" width="110" height="60" rx="3" fill="${color}" stroke="#666" stroke-width="1.5"/>
    <rect x="75" y="10" width="35" height="22" rx="2" fill="${color}" opacity="0.85" stroke="#666" stroke-width="0.5"/>
    <rect x="75" y="38" width="35" height="22" rx="2" fill="${color}" opacity="0.85" stroke="#666" stroke-width="0.5"/>
  </svg>`,
  'Стол Compact': (color) => `<svg viewBox="0 0 90 70" xmlns="http://www.w3.org/2000/svg">
    <rect x="5" y="5" width="80" height="60" rx="3" fill="${color}" stroke="#666" stroke-width="1.5"/>
    <rect x="50" y="10" width="30" height="20" rx="2" fill="${color}" opacity="0.85" stroke="#666" stroke-width="0.5"/>
  </svg>`,
  'Стул Windsor': (color) => `<svg viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
    <circle cx="25" cy="25" r="20" fill="${color}" stroke="#666" stroke-width="1.5"/>
    <line x1="15" y1="10" x2="15" y2="20" stroke="#666" stroke-width="1"/>
    <line x1="25" y1="8" x2="25" y2="20" stroke="#666" stroke-width="1"/>
    <line x1="35" y1="10" x2="35" y2="20" stroke="#666" stroke-width="1"/>
  </svg>`,
  'Стул Modern': (color) => `<svg viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
    <rect x="10" y="10" width="30" height="30" rx="6" fill="${color}" stroke="#666" stroke-width="1.5"/>
    <rect x="12" y="12" width="26" height="12" rx="3" fill="${color}" opacity="0.85"/>
  </svg>`,
  'Шкаф Sliding': (color) => `<svg viewBox="0 0 100 60" xmlns="http://www.w3.org/2000/svg">
    <rect x="5" y="5" width="90" height="50" rx="2" fill="${color}" stroke="#333" stroke-width="1.5"/>
    <line x1="50" y1="5" x2="50" y2="55" stroke="#333" stroke-width="1"/>
    <line x1="20" y1="10" x2="20" y2="50" stroke="#555" stroke-width="0.5"/>
    <line x1="30" y1="10" x2="30" y2="50" stroke="#555" stroke-width="0.5"/>
    <line x1="40" y1="10" x2="40" y2="50" stroke="#555" stroke-width="0.5"/>
    <line x1="60" y1="10" x2="60" y2="50" stroke="#555" stroke-width="0.5"/>
    <line x1="70" y1="10" x2="70" y2="50" stroke="#555" stroke-width="0.5"/>
    <line x1="80" y1="10" x2="80" y2="50" stroke="#555" stroke-width="0.5"/>
  </svg>`,
  'Шкаф Legs': (color) => `<svg viewBox="0 0 90 60" xmlns="http://www.w3.org/2000/svg">
    <rect x="10" y="8" width="70" height="44" rx="2" fill="${color}" stroke="#666" stroke-width="1.5"/>
    <line x1="35" y1="8" x2="35" y2="52" stroke="#666" stroke-width="0.5"/>
    <line x1="60" y1="8" x2="60" y2="52" stroke="#666" stroke-width="0.5"/>
    <circle cx="18" cy="56" r="2" fill="#D4C5B0"/>
    <circle cx="72" cy="56" r="2" fill="#D4C5B0"/>
  </svg>`,
  'Шкаф Tall': (color) => `<svg viewBox="0 0 100 60" xmlns="http://www.w3.org/2000/svg">
    <rect x="5" y="5" width="90" height="50" rx="2" fill="${color}" stroke="#666" stroke-width="1.5"/>
    <line x1="35" y1="5" x2="35" y2="55" stroke="#666" stroke-width="0.5"/>
    <line x1="65" y1="5" x2="65" y2="55" stroke="#666" stroke-width="0.5"/>
    <line x1="33" y1="25" x2="33" y2="35" stroke="#333" stroke-width="1.5"/>
    <line x1="63" y1="25" x2="63" y2="35" stroke="#333" stroke-width="1.5"/>
    <line x1="67" y1="25" x2="67" y2="35" stroke="#333" stroke-width="1.5"/>
  </svg>`,
  'Комод 4-ящика': (color) => `<svg viewBox="0 0 100 60" xmlns="http://www.w3.org/2000/svg">
    <rect x="5" y="5" width="90" height="50" rx="2" fill="${color}" stroke="#333" stroke-width="1.5"/>
    <line x1="5" y1="18" x2="95" y2="18" stroke="#555" stroke-width="0.5"/>
    <line x1="5" y1="30" x2="95" y2="30" stroke="#555" stroke-width="0.5"/>
    <line x1="5" y1="42" x2="95" y2="42" stroke="#555" stroke-width="0.5"/>
    <line x1="40" y1="10" x2="60" y2="10" stroke="#777" stroke-width="1.5"/>
    <line x1="40" y1="23" x2="60" y2="23" stroke="#777" stroke-width="1.5"/>
    <line x1="40" y1="35" x2="60" y2="35" stroke="#777" stroke-width="1.5"/>
    <line x1="40" y1="47" x2="60" y2="47" stroke="#777" stroke-width="1.5"/>
  </svg>`,
  'Комод Sideboard': (color) => `<svg viewBox="0 0 120 50" xmlns="http://www.w3.org/2000/svg">
    <rect x="5" y="5" width="110" height="40" rx="2" fill="${color}" stroke="#666" stroke-width="1.5"/>
    <line x1="60" y1="5" x2="60" y2="45" stroke="#666" stroke-width="0.5"/>
    <line x1="85" y1="5" x2="85" y2="45" stroke="#666" stroke-width="0.5"/>
    <line x1="85" y1="18" x2="115" y2="18" stroke="#666" stroke-width="0.5"/>
    <line x1="85" y1="31" x2="115" y2="31" stroke="#666" stroke-width="0.5"/>
    <rect x="55" y="20" width="6" height="10" fill="#333"/>
  </svg>`,
  'Люстра Cage': (color) => `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
    <circle cx="30" cy="30" r="25" fill="none" stroke="${color}" stroke-width="2"/>
    <circle cx="30" cy="30" r="15" fill="#FFFDD0" opacity="0.6"/>
    <line x1="30" y1="5" x2="30" y2="55" stroke="${color}" stroke-width="1"/>
    <line x1="5" y1="30" x2="55" y2="30" stroke="${color}" stroke-width="1"/>
  </svg>`,
  'Торшер Double Spot': (color) => `<svg viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
    <circle cx="25" cy="25" r="3" fill="${color}"/>
    <circle cx="15" cy="15" r="8" fill="${color}" stroke="#D4C5B0" stroke-width="1"/>
    <circle cx="35" cy="20" r="8" fill="${color}" stroke="#D4C5B0" stroke-width="1"/>
  </svg>`,
  'Лампа настольная Ribbed': (color) => `<svg viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="25" cy="40" rx="15" ry="5" fill="#1A1A1A"/>
    <path d="M20,40 L22,25 L28,25 L30,40 Z" fill="#1A1A1A"/>
    <ellipse cx="25" cy="20" rx="12" ry="8" fill="${color}" stroke="#555" stroke-width="0.5"/>
  </svg>`,
  'Торшер Tripod': (color) => `<svg viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
    <line x1="25" y1="25" x2="10" y2="45" stroke="#1A1A1A" stroke-width="1.5"/>
    <line x1="25" y1="25" x2="25" y2="45" stroke="#1A1A1A" stroke-width="1.5"/>
    <line x1="25" y1="25" x2="40" y2="45" stroke="#1A1A1A" stroke-width="1.5"/>
    <ellipse cx="25" cy="15" rx="15" ry="10" fill="${color}"/>
  </svg>`
};

const categories = [
  { id: 'Диваны', name: 'Диваны', icon: '🛋️' },
  { id: 'Кровати', name: 'Кровати', icon: '🛏️' },
  { id: 'Столы', name: 'Столы', icon: '🪑' },
  { id: 'Стулья', name: 'Стулья', icon: '💺' },
  { id: 'Шкафы', name: 'Шкафы', icon: '🚪' },
  { id: 'Комоды', name: 'Комоды', icon: '🗄️' },
  { id: 'Освещение', name: 'Освещение', icon: '💡' }
];

const rooms = ['Гостиная', 'Спальня', 'Кухня', 'Кабинет', 'Детская', 'Ванная', 'Прихожая'];
const STORAGE_KEY = 'roomcraft_projects';
const DEFAULT_PIXEL_WIDTH = 140;

const ConstructorPage = () => {
  const { user } = useAuth();
  const [furniture, setFurniture] = useState([]);
  const [selectedCat, setSelectedCat] = useState('Диваны');
  const [selectedItem, setSelectedItem] = useState(null);
  const [roomItems, setRoomItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [projectName, setProjectName] = useState('Моя квартира');
  const [selectedRoom, setSelectedRoom] = useState('Гостиная');
  const [zoom, setZoom] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [projects, setProjects] = useState({});
  const [saveMessage, setSaveMessage] = useState('');
  const [currentApartmentId, setCurrentApartmentId] = useState(null);
  const [isNewProject, setIsNewProject] = useState(true); // Флаг: новая квартира или загруженная

  // Загрузка мебели
  useEffect(() => {
    const fetchFurniture = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/furniture');
        const data = await res.json();
        setFurniture(data);
        setLoading(false);
      } catch (err) {
        console.error('Ошибка загрузки мебели:', err);
        setLoading(false);
      }
    };
    fetchFurniture();
  }, []);

  // При монтировании: проверяем URL и решаем — новая квартира или загрузка существующей
  useEffect(() => {
    if (furniture.length === 0) return;

    const urlParams = new URLSearchParams(window.location.search);
    const apartmentId = urlParams.get('id');

    if (apartmentId) {
      // Загружаем существующую квартиру
      setIsNewProject(false);
      const loadApartment = async () => {
        try {
          const res = await fetch(`http://localhost:3001/api/apartments/${apartmentId}`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });
          
          if (res.ok) {
            const apartment = await res.json();
            setCurrentApartmentId(apartment.id);
            setProjectName(apartment.name);
            
            const projectsByRoom = {};
            if (apartment.furniture && apartment.furniture.length > 0) {
              apartment.furniture.forEach(item => {
                const room = item.room || 'Гостиная';
                if (!projectsByRoom[room]) {
                  projectsByRoom[room] = [];
                }
                const furnitureData = furniture.find(f => f.id === item.furnitureId);
                projectsByRoom[room].push({
                  ...item,
                  id: Date.now() + Math.random(),
                  thumbnail: furnitureData?.thumbnail || '',
                  colors: furnitureData?.colors || [],
                  material: furnitureData?.meta?.material || 'Ткань',
                  realWidth: furnitureData?.meta?.dimensions?.width || item.width || 200,
                  realHeight: furnitureData?.meta?.dimensions?.depth || item.height || 100,
                  realHeight3D: furnitureData?.meta?.dimensions?.height || 80,
                  selectedColorHex: (furnitureData?.colors || []).find(c => c.name === item.selectedColor)?.hex || '#C8C8C8'
                });
              });
            }
            
            setProjects(projectsByRoom);
            const firstRoom = Object.keys(projectsByRoom)[0] || 'Гостиная';
            setSelectedRoom(firstRoom);
            setRoomItems(projectsByRoom[firstRoom] || []);
            saveToHistory(projectsByRoom[firstRoom] || []);
          }
        } catch (err) {
          console.error('Ошибка загрузки квартиры:', err);
        }
      };
      
      loadApartment();
    } else {
      // НОВАЯ КВАРТИРА — сбрасываем всё
      setIsNewProject(true);
      setCurrentApartmentId(null);
      setProjectName('Моя квартира');
      setSelectedRoom('Гостиная');
      setRoomItems([]);
      setProjects({});
      setHistory([]);
      setHistoryIndex(-1);
      setSelectedItem(null);
      // Очищаем localStorage для нового проекта
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [furniture]);

  // Автосохранение только если НЕ новая квартира (или если пользователь уже начал работать)
  useEffect(() => {
    if (isNewProject && roomItems.length === 0) return; // Не сохраняем пустой новый проект
    
    if (roomItems.length > 0 || projects[selectedRoom]) {
      const newProjects = { ...projects, [selectedRoom]: roomItems };
      setProjects(newProjects);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newProjects));
    }
  }, [roomItems, selectedRoom, isNewProject]);

  const saveToHistory = useCallback((newItems) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(JSON.parse(JSON.stringify(newItems)));
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      const newItems = JSON.parse(JSON.stringify(history[newIndex]));
      setRoomItems(newItems);
      setHistoryIndex(newIndex);
      setSelectedItem(null);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      const newItems = JSON.parse(JSON.stringify(history[newIndex]));
      setRoomItems(newItems);
      setHistoryIndex(newIndex);
      setSelectedItem(null);
    }
  };

  const filteredFurniture = furniture.filter(f => 
    f.category === selectedCat && 
    f.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addToRoom = (item) => {
    const realW = item.meta?.dimensions?.width || 200;
    const realH = item.meta?.dimensions?.depth || 100;
    const realH3D = item.meta?.dimensions?.height || 80;
    
    const newItem = {
      id: Date.now(),
      furnitureId: item.id,
      title: item.title,
      thumbnail: item.thumbnail,
      colors: item.colors || [],
      category: item.category,
      material: item.meta?.material || 'Ткань',
      x: 250 + Math.random() * 100,
      y: 150 + Math.random() * 100,
      width: DEFAULT_PIXEL_WIDTH,
      height: Math.round(DEFAULT_PIXEL_WIDTH * (realH / realW)),
      rotation: 0,
      selectedColor: item.colors[0]?.name || '',
      selectedColorHex: item.colors[0]?.hex || '#C8C8C8',
      realWidth: realW,
      realHeight: realH,
      realHeight3D: realH3D,
      room: selectedRoom
    };
    const newItems = [...roomItems, newItem];
    setRoomItems(newItems);
    setSelectedItem(newItem);
    saveToHistory(newItems);
  };

  const handleDragStop = (id, x, y) => {
    setRoomItems(prev => prev.map(item => 
      item.id === id ? { ...item, x, y } : item
    ));
    setSelectedItem(current => current && current.id === id ? { ...current, x, y } : current);
  };

  const handleResizeStop = (id, newWidth, newHeight) => {
    setRoomItems(prev => {
      const newItems = prev.map(item => {
        if (item.id === id) {
          const ratioW = item.realWidth / item.width;
          const ratioH = item.realHeight / item.height;
          return {
            ...item,
            width: newWidth,
            height: newHeight,
            realWidth: Math.round(newWidth * ratioW),
            realHeight: Math.round(newHeight * ratioH)
          };
        }
        return item;
      });
      
      setSelectedItem(current => {
        if (current && current.id === id) {
          const ratioW = current.realWidth / current.width;
          const ratioH = current.realHeight / current.height;
          return {
            ...current,
            width: newWidth,
            height: newHeight,
            realWidth: Math.round(newWidth * ratioW),
            realHeight: Math.round(newHeight * ratioH)
          };
        }
        return current;
      });
      
      return newItems;
    });
  };

  const rotateItem = (id, angle) => {
    setRoomItems(prev => prev.map(item => 
      item.id === id ? { ...item, rotation: (item.rotation + angle + 360) % 360 } : item
    ));
    setSelectedItem(current => {
      if (current && current.id === id) {
        return { ...current, rotation: (current.rotation + angle + 360) % 360 };
      }
      return current;
    });
  };

  const changeColor = (id, colorName) => {
    setRoomItems(prev => prev.map(item => {
      if (item.id === id) {
        const color = item.colors.find(c => c.name === colorName);
        return { 
          ...item, 
          selectedColor: colorName,
          selectedColorHex: color?.hex || item.selectedColorHex
        };
      }
      return item;
    }));
    setSelectedItem(current => {
      if (current && current.id === id) {
        const color = current.colors.find(c => c.name === colorName);
        return { 
          ...current, 
          selectedColor: colorName,
          selectedColorHex: color?.hex || current.selectedColorHex
        };
      }
      return current;
    });
  };

  const duplicateItem = (id) => {
    const original = roomItems.find(item => item.id === id);
    if (original) {
      const duplicate = {
        ...original,
        id: Date.now(),
        x: original.x + 30,
        y: original.y + 30
      };
      const newItems = [...roomItems, duplicate];
      setRoomItems(newItems);
      setSelectedItem(duplicate);
      saveToHistory(newItems);
    }
  };

  const removeItem = (id) => {
    const newItems = roomItems.filter(item => item.id !== id);
    setRoomItems(newItems);
    setSelectedItem(null);
    saveToHistory(newItems);
  };

  const updateSize = (id, field, value) => {
    const numValue = parseInt(value) || 0;
    setRoomItems(prev => prev.map(item => {
      if (item.id === id) {
        if (field === 'realWidth') {
          const ratio = item.width / item.realWidth;
          return { ...item, realWidth: numValue, width: Math.round(numValue * ratio) };
        }
        if (field === 'realHeight') {
          const ratio = item.height / item.realHeight;
          return { ...item, realHeight: numValue, height: Math.round(numValue * ratio) };
        }
        return { ...item, [field]: numValue };
      }
      return item;
    }));
    setSelectedItem(prev => {
      if (prev && prev.id === id) {
        if (field === 'realWidth') {
          const ratio = prev.width / prev.realWidth;
          return { ...prev, realWidth: numValue, width: Math.round(numValue * ratio) };
        }
        if (field === 'realHeight') {
          const ratio = prev.height / prev.realHeight;
          return { ...prev, realHeight: numValue, height: Math.round(numValue * ratio) };
        }
        return { ...prev, [field]: numValue };
      }
      return prev;
    });
  };

  const updatePosition = (id, field, value) => {
    const numValue = parseInt(value) || 0;
    setRoomItems(prev => prev.map(item => 
      item.id === id ? { ...item, [field]: numValue } : item
    ));
    setSelectedItem(prev => prev && prev.id === id ? { ...prev, [field]: numValue } : prev);
  };

  const switchRoom = (newRoom) => {
    const newProjects = { ...projects, [selectedRoom]: roomItems };
    setSelectedRoom(newRoom);
    const savedRoom = newProjects[newRoom] || [];
    setRoomItems(savedRoom);
    setProjects(newProjects);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newProjects));
    saveToHistory(savedRoom);
    setSelectedItem(null);
  };

    const saveProject = async () => {
    if (!user) { alert('Войдите в аккаунт'); return; }
    
    // Проверяем, есть ли мебель хотя бы в одной комнате
    const allRoomsItems = Object.values(projects).flat();
    if (allRoomsItems.length === 0) { 
      alert('Добавьте мебель хотя бы в одну комнату'); 
      return; 
    }

    setSaving(true);
    
    // Сначала обновляем текущую комнату в projects
    const newProjects = { ...projects, [selectedRoom]: roomItems };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newProjects));
    setProjects(newProjects);

    // Собираем мебель из ВСЕХ комнат
    const allFurniture = Object.values(newProjects)
      .flat()
      .map(item => ({
        furnitureId: item.furnitureId,
        title: item.title,
        category: item.category,
        room: item.room,
        x: Math.round(item.x),
        y: Math.round(item.y),
        width: Math.round(item.width),
        height: Math.round(item.height),
        rotation: item.rotation,
        selectedColor: item.selectedColor
      }));

    const apartmentData = {
      name: projectName,
      rooms: Object.keys(newProjects).filter(k => newProjects[k] && newProjects[k].length > 0).length,
      area: 100,
      style: 'Современный',
      furniture: allFurniture  // Теперь сохраняем ВСЕ комнаты
    };

    try {
      let res;
      
      if (currentApartmentId) {
        res = await fetch(`http://localhost:3001/api/apartments/${currentApartmentId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(apartmentData)
        });
      } else {
        res = await fetch('http://localhost:3001/api/apartments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(apartmentData)
        });
      }

      if (res.ok) {
        const savedApartment = await res.json();
        
        if (savedApartment.id && !currentApartmentId) {
          setCurrentApartmentId(savedApartment.id);
          setIsNewProject(false);
        }
        
        const activity = {
          id: Date.now(),
          type: 'apartment',
          description: currentApartmentId 
            ? `Квартира «${projectName}» обновлена` 
            : `Квартира «${projectName}» сохранена`,
          timestamp: new Date().toISOString()
        };
        const savedActivities = JSON.parse(localStorage.getItem('roomcraft_activities') || '[]');
        localStorage.setItem('roomcraft_activities', JSON.stringify([activity, ...savedActivities].slice(0, 10)));
        
        setSaveMessage(currentApartmentId ? 'Квартира обновлена!' : 'Квартира сохранена!');
      } else {
        setSaveMessage('Сохранено локально');
      }
    } catch (err) {
      setSaveMessage('Сохранено локально');
    } finally {
      setSaving(false);
      setTimeout(() => setSaveMessage(''), 3000);
    }
  };

  const clearRoom = () => {
    if (window.confirm('Очистить комнату?')) {
      setRoomItems([]);
      setSelectedItem(null);
      saveToHistory([]);
    }
  };

  const getIconSvg = (item) => {
    const color = item.selectedColorHex || '#C8C8C8';
    const iconFn = furnitureIcons[item.title];
    if (iconFn && typeof iconFn === 'function') {
      return iconFn(color);
    }
    return `<svg viewBox="0 0 60 60"><rect width="60" height="60" fill="${color}"/></svg>`;
  };

  if (loading) return <div className="loading">Загрузка...</div>;

  return (
    <div className="constructor-page">
      <aside className="left-panel">
        <div className="panel-header">
          <input 
            type="text" 
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="project-title"
          />
        </div>

        <div className="search-box">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
          <input 
            type="text" 
            placeholder="Поиск мебели..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="categories-section">
  <h3>Категории</h3>
  <div className="category-list">
    {categories.map(cat => (
      <button
        key={cat.id}
        className={`category-btn ${selectedCat === cat.id ? 'active' : ''}`}
        onClick={() => { setSelectedCat(cat.id); setSearchQuery(''); }}
      >
        <span>{cat.name}</span>
      </button>
    ))}
  </div>
</div>

        <div className="furniture-section">
          <h3>{categories.find(c => c.id === selectedCat)?.name}</h3>
          <div className="furniture-grid">
            {filteredFurniture.map(item => (
              <div 
                key={item.id} 
                className="furniture-card"
                onClick={() => addToRoom(item)}
              >
                <div className="furniture-thumb">
                  <img src={item.thumbnail} alt={item.title} />
                </div>
                <span className="furniture-name">{item.title}</span>
              </div>
            ))}
          </div>
          {filteredFurniture.length === 0 && (
            <p className="no-furniture">Нет мебели</p>
          )}
        </div>
      </aside>

      <main className="room-plan">
        <div className="room-toolbar">
          <div className="toolbar-group">
            <button className="tool-btn" onClick={undo} disabled={historyIndex <= 0}>↶</button>
            <button className="tool-btn" onClick={redo} disabled={historyIndex >= history.length - 1}>↷</button>
          </div>
          <div className="toolbar-group">
            <button className="tool-btn" onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}>−</button>
            <span className="zoom-value">{Math.round(zoom * 100)}%</span>
            <button className="tool-btn" onClick={() => setZoom(Math.min(2, zoom + 0.1))}>+</button>
            <button className="tool-btn" onClick={() => setZoom(1)}>⊞</button>
          </div>
          <div className="toolbar-group">
            <button className="tool-btn danger" onClick={clearRoom}>Очистить</button>
          </div>
        </div>

        <div className="room-tabs">
  {rooms.map(room => {
    const count = projects[room]?.length || 0;
    
    return (
      <button
        key={room}
        className={`room-tab ${selectedRoom === room ? 'active' : ''}`}
        onClick={() => switchRoom(room)}
      >
        <span className="room-tab-name">{room}</span>
        {count > 0 && (
          <span className="room-badge">{count}</span>
        )}
      </button>
    );
  })}
</div>

        <div className="room-container" style={{ transform: `scale(${zoom})` }}>
          <div className="room-walls">
            <div className="wall wall-top"></div>
            <div className="wall wall-bottom"></div>
            <div className="wall wall-left"></div>
            <div className="wall wall-right"></div>
            <div className="door door-bottom"></div>
            <div className="door door-right"></div>
            <div className="window window-top"></div>
            <div className="baseboard baseboard-top"></div>
            <div className="baseboard baseboard-bottom"></div>
            <div className="baseboard baseboard-left"></div>
            <div className="baseboard baseboard-right"></div>
          </div>
          <div className="room-floor"></div>
          <div className="room-grid"></div>
          <div className="room-rug"></div>
          <div className="room-plant">
            <svg width="40" height="40" viewBox="0 0 40 40">
              <circle cx="20" cy="20" r="15" fill="#4A6B5A" opacity="0.8"/>
              <circle cx="15" cy="15" r="8" fill="#5A7B6A" opacity="0.9"/>
              <circle cx="25" cy="18" r="7" fill="#3A5B4A" opacity="0.9"/>
              <circle cx="20" cy="25" r="9" fill="#4A6B5A" opacity="0.85"/>
            </svg>
          </div>

          {roomItems.map(item => (
            <Rnd
              key={item.id}
              size={{ width: item.width, height: item.height }}
              position={{ x: item.x, y: item.y }}
              onDragStop={(e, d) => handleDragStop(item.id, d.x, d.y)}
              onResizeStop={(e, direction, ref, delta, position) => {
                handleResizeStop(item.id, ref.offsetWidth, ref.offsetHeight);
              }}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedItem(item);
              }}
              className={`room-furniture ${selectedItem?.id === item.id ? 'selected' : ''}`}
              bounds="parent"
              minWidth={40}
              minHeight={30}
              enableResizing={{
                top: true, right: true, bottom: true, left: true,
                topRight: true, bottomRight: true, bottomLeft: true, topLeft: true
              }}
            >
              <div 
                className="furniture-svg"
                style={{ transform: `rotate(${item.rotation}deg)` }}
                dangerouslySetInnerHTML={{ __html: getIconSvg(item) }}
              />
            </Rnd>
          ))}
        </div>

        <div className="room-info">
          <span>{roomItems.length} предметов</span>
          <span>•</span>
          <span>{selectedRoom}</span>
          {saveMessage && <span className="save-message">✓ {saveMessage}</span>}
        </div>
      </main>

      <aside className="right-panel">
        {selectedItem ? (
          <>
            <div className="selected-header">
              <div className="selected-thumb">
                <img src={selectedItem.thumbnail} alt={selectedItem.title} />
              </div>
              <div className="selected-info">
                <h3>{selectedItem.title}</h3>
                <p className="selected-price">
                  {Math.round(furniture.find(f => f.id === selectedItem.furnitureId)?.price || 0).toLocaleString('ru-RU')} ₸
                </p>
              </div>
            </div>

            <div className="settings-section">
              <h4>Размеры (см)</h4>
              <div className="size-inputs">
                <div className="size-input">
                  <label>Длина</label>
                  <input 
                    type="number" 
                    value={selectedItem.realWidth}
                    onChange={(e) => updateSize(selectedItem.id, 'realWidth', e.target.value)}
                  />
                </div>
                <div className="size-input">
                  <label>Ширина</label>
                  <input 
                    type="number" 
                    value={selectedItem.realHeight}
                    onChange={(e) => updateSize(selectedItem.id, 'realHeight', e.target.value)}
                  />
                </div>
                <div className="size-input">
                  <label>Высота</label>
                  <input 
                    type="number" 
                    value={selectedItem.realHeight3D}
                    onChange={(e) => updateSize(selectedItem.id, 'realHeight3D', e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="settings-section">
              <h4>Позиция</h4>
              <div className="position-inputs">
                <div className="pos-input">
                  <label>X</label>
                  <input 
                    type="number" 
                    value={Math.round(selectedItem.x)}
                    onChange={(e) => updatePosition(selectedItem.id, 'x', e.target.value)}
                  />
                </div>
                <div className="pos-input">
                  <label>Y</label>
                  <input 
                    type="number" 
                    value={Math.round(selectedItem.y)}
                    onChange={(e) => updatePosition(selectedItem.id, 'y', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {selectedItem.colors && selectedItem.colors.length > 0 && (
              <div className="settings-section">
                <h4>Цвет</h4>
                <div className="color-options">
                  {selectedItem.colors.map(color => (
                    <button
                      key={color.name}
                      className={`color-btn ${selectedItem.selectedColor === color.name ? 'active' : ''}`}
                      onClick={() => changeColor(selectedItem.id, color.name)}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    />
                  ))}
                </div>
                <p className="color-name">{selectedItem.selectedColor}</p>
              </div>
            )}

            <div className="settings-section">
              <h4>Материал</h4>
              <p className="material-value">{selectedItem.material}</p>
            </div>

            <div className="settings-section">
              <h4>Поворот</h4>
              <div className="rotation-buttons">
                <button onClick={() => rotateItem(selectedItem.id, -90)}>↺ 90°</button>
                <button onClick={() => rotateItem(selectedItem.id, 90)}>↻ 90°</button>
                <button onClick={() => rotateItem(selectedItem.id, -45)}>↺ 45°</button>
                <button onClick={() => rotateItem(selectedItem.id, 45)}>↻ 45°</button>
              </div>
              <p className="rotation-value">{selectedItem.rotation}°</p>
            </div>

            <div className="action-buttons">
              <button className="btn-action" onClick={() => duplicateItem(selectedItem.id)}>
                📋 Дублировать
              </button>
              <button className="btn-action danger" onClick={() => removeItem(selectedItem.id)}>
                🗑 Удалить
              </button>
            </div>

            <button className="btn-save-project" onClick={saveProject} disabled={saving}>
              {saving ? 'Сохранение...' : 'Сохранить квартиру'}
            </button>
          </>
        ) : (
          <div className="no-selection">
            <div className="no-selection-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
            </div>
            <h3>Ничего не выбрано</h3>
            <p>Кликните на предмет в комнате или добавьте мебель из каталога</p>
          </div>
        )}
      </aside>
    </div>
  );
};

export default ConstructorPage;