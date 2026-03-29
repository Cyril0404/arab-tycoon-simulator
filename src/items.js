// Game Items Data - Arab Tycoon Simulator
// All items organized by category

// Items v1.1 balanced - prices updated per GAME_DATA.md
const ITEMS = {
  cars: [
    { id: 'car_001', name: 'Toyota Camry', price: 200000, icon: '🚗', description: 'Economical choice, Dubai commute', unlockLevel: 1, rarity: 'common', maxCount: -1 },
    { id: 'car_002', name: 'Mercedes S-Class', price: 1000000, icon: '🚙', description: 'German luxury, business首选', unlockLevel: 2, rarity: 'rare', maxCount: -1 },
    { id: 'car_003', name: 'Rolls-Royce Cullinan', price: 10000000, icon: '🚗', description: 'Luxury British style, Dubai street favorite', unlockLevel: 3, rarity: 'epic', maxCount: -1 },
    { id: 'car_004', name: 'Ferrari SF90', price: 15000000, icon: '🏎️', description: 'Prancing horse flagship, 0-100km/h in 2.5s', unlockLevel: 3, rarity: 'epic', maxCount: -1 },
    { id: 'car_005', name: 'Lamborghini Revuelto', price: 18000000, icon: '🏎️', description: 'Hybrid bull, flame in the desert', unlockLevel: 4, rarity: 'legendary', maxCount: 1 },
    { id: 'car_006', name: 'Bentley Mulsanne', price: 8000000, icon: '🚗', description: 'British elegance, low-key luxury', unlockLevel: 3, rarity: 'epic', maxCount: -1 },
    { id: 'car_007', name: 'McLaren P1', price: 20000000, icon: '🏎️', description: 'Hybrid supercar, full of tech', unlockLevel: 4, rarity: 'legendary', maxCount: 1 },
    { id: 'car_008', name: 'Bugatti Chiron', price: 80000000, icon: '🚗', description: 'Global limited edition, Dubai tycoon标配', unlockLevel: 5, rarity: 'mythical', maxCount: 1 },
    { id: 'car_009', name: 'Gulfstream G650', price: 1000000000, icon: '✈️', description: 'Intercontinental flight, sky palace', unlockLevel: 5, rarity: 'mythical', maxCount: 1 },
    { id: 'car_010', name: 'Luxury Yacht', price: 800000000, icon: '🚢', description: 'Sea villa, party essential', unlockLevel: 5, rarity: 'mythical', maxCount: 1 }
  ],
  homes: [
    { id: 'prop_001', name: 'Dubai Apartment', price: 5000000, icon: '🏠', description: 'Modern apartment in downtown Dubai', unlockLevel: 2, rarity: 'common', maxCount: -1 },
    { id: 'prop_002', name: 'Palm Villa', price: 200000000, icon: '🏘️', description: 'Man-made island villa on Palm Jumeirah', unlockLevel: 4, rarity: 'legendary', maxCount: 1 },
    { id: 'prop_003', name: 'Abu Dhabi Palace', price: 1000000000, icon: '🏰', description: 'Palace-level luxury, king-style living', unlockLevel: 5, rarity: 'mythical', maxCount: 1 }
  ],
  pets: [
    { id: 'pet_001', name: 'Falcon', price: 2000000, icon: '🦅', description: 'Desert falcon, UAE national bird', unlockLevel: 3, rarity: 'rare', maxCount: -1 },
    { id: 'pet_002', name: 'Arabian Horse', price: 5000000, icon: '🐎', description: 'Purebred Arabian horse, royal bloodline', unlockLevel: 3, rarity: 'epic', maxCount: -1 },
    { id: 'pet_003', name: 'Lion', price: 20000000, icon: '🦁', description: 'Dubai tycoon standard pet, 100% attention', unlockLevel: 4, rarity: 'legendary', maxCount: 1 },
    { id: 'pet_004', name: 'White Tiger', price: 50000000, icon: '🐯', description: 'Rare white tiger, full of dominance', unlockLevel: 5, rarity: 'mythical', maxCount: 1 }
  ],
  luxury: [
    { id: 'lux_001', name: 'Patek Philippe Nautilus', price: 2000000, icon: '⌚', description: 'Swiss watch, eternal classic', unlockLevel: 2, rarity: 'rare', maxCount: -1 },
    { id: 'lux_002', name: 'Hermès Birkin', price: 1500000, icon: '👜', description: 'Queen of handbags', unlockLevel: 2, rarity: 'rare', maxCount: -1 },
    { id: 'lux_003', name: 'Limited Edition AJ', price: 100000, icon: '👟', description: 'Sneaker ceiling, extremely collectible', unlockLevel: 1, rarity: 'common', maxCount: -1 },
    { id: 'lux_004', name: 'Gold Diamond iPhone', price: 500000, icon: '📱', description: 'Pure gold body, diamond buttons', unlockLevel: 1, rarity: 'epic', maxCount: -1 }
  ]
};

// Gift items (not directly purchasable)
const GIFTS = [
  { id: 'gift_watch', name: 'Patek Philippe Watch', value: 50000, icon: '⌚' },
  { id: 'gift_car', name: 'Ferrari Sports Car', value: 500000, icon: '🏎️' },
  { id: 'gift_villa', name: 'Palm Island Villa', value: 5000000, icon: '🏘️' }
];

// Level definitions (v1.1 balanced - see GAME_DATA.md)
const LEVELS = [
  { level: 1, name: 'Peasant',        nameAr: 'فلاح',          threshold: 0,                   color: '#9E9E9E',  nameCn: '平民' },
  { level: 2, name: 'Small Boss',     nameAr: 'رئيس صغير',     threshold: 1_000_000,          color: '#CD7F32',  nameCn: '小老板' },
  { level: 3, name: 'Rich Merchant',  nameAr: 'تاجر غني',       threshold: 100_000_000,        color: '#C0C0C0',  nameCn: '富商' },
  { level: 4, name: 'Tycoon',         nameAr: 'رجل أعمال',       threshold: 1_000_000_000,      color: '#D4AF37',  nameCn: '超级富豪' },
  { level: 5, name: 'Middle East King', nameAr: 'ملك الشرق الأوسط', threshold: 100_000_000_000, color: '#FFD700',  nameCn: '中东首富' }
];

// Earn actions configuration (v1.1 balanced - see GAME_DATA.md)
const EARN_ACTIONS = {
  work: {
    id: 'work',
    name: 'Work',
    nameAr: 'العمل',
    earnings: 50,          // 旧版1000 → 新版50（降95%）
    cooldownSeconds: 60,
    icon: '💼',
    description: 'Basic freelance work'
  },
  business: {
    id: 'business',
    name: 'Business',
    nameAr: 'إدارة الأعمال',
    earnings: 300,         // 旧版10000 → 新版300（降97%）
    cooldownSeconds: 300,  // 旧版600 → 新版300秒（5分钟）
    icon: '🏢',
    description: 'Manage your business'
  },
  invest: {
    id: 'invest',
    name: 'Oil Investment',
    nameAr: 'استثمار النفط',
    successEarning: 100000,    // 旧版1000000 → 新版10万（降90%）
    failureEarning: -50000,   // 旧版-500000 → 新版-5万
    successRate: 0.5,
    cooldownSeconds: 7200,    // 旧版3600 → 新版2小时
    icon: '🛢️',
    description: 'High risk, high reward!'
  }
};

// Leaderboard preset players
// Leaderboard presets v1.1 - all values scaled to match new economy
const LEADERBOARD_PRESETS = [
  { rank: 1, name: 'Khalifa bin Zayed', wealth: 5000000000000, avatar: '👑', level: 5 },  // 5万亿
  { rank: 2, name: 'Mohammed Alaba', wealth: 3000000000000, avatar: '🏰', level: 5 },
  { rank: 3, name: 'Ahmed Al Maktoum', wealth: 1000000000000, avatar: '💎', level: 5 },
  { rank: 4, name: 'Omar Hassan', wealth: 500000000000, avatar: '🦅', level: 5 },
  { rank: 5, name: 'Tariq Al Rajhi', wealth: 200000000000, avatar: '🐎', level: 4 },
  { rank: 6, name: 'Faisal Al Saud', wealth: 100000000000, avatar: '🦁', level: 4 },
  { rank: 7, name: 'Rashid Al Maktoum', wealth: 50000000000, avatar: '🏎️', level: 4 },
  { rank: 8, name: 'Hassan Al Thani', wealth: 20000000000, avatar: '✈️', level: 4 },
  { rank: 9, name: 'Salman Al Nahyan', wealth: 10000000000, avatar: '🏘️', level: 4 },
  { rank: 10, name: 'Jamal Al Faraj', wealth: 5000000000, avatar: '👑', level: 4 }
];

// Friends presets v1.1 - scaled to match new economy
const FRIENDS_PRESETS = [
  { id: 'f1', name: 'Ahmed Dhabi', avatar: '👤', wealth: 50000000, level: 4, status: 'online' },   // 5000万（小土豪）
  { id: 'f2', name: 'Khalid Sharjah', avatar: '👤', wealth: 20000000, level: 4, status: 'online' }, // 2000万
  { id: 'f3', name: 'Omar Ajman', avatar: '👤', wealth: 8000000, level: 3, status: 'offline' },    // 800万
  { id: 'f4', name: 'Faisal RAK', avatar: '👤', wealth: 150000000, level: 4, status: 'online' }, // 1.5亿
  { id: 'f5', name: 'Hamad Fujairah', avatar: '👤', wealth: 500000, level: 2, status: 'offline' } // 50万
];
