// Internationalization - Arab Tycoon Simulator
// English strings (preparation for Arabic RTL support later)

const I18N = {
  // App
  app: {
    title: 'Arab Tycoon Simulator',
    subtitle: 'Become the richest in the Middle East!'
  },

  // Start Screen
  start: {
    welcome: 'Welcome, Young Tycoon!',
    tagline: 'Start with 1,000 AED and climb your way to the top!',
    startBtn: 'Start Game',
    continueBtn: 'Continue'
  },

  // Status Bar
  status: {
    cash: 'Cash',
    totalAssets: 'Total Assets',
    level: 'Level'
  },

  // Tabs
  tabs: {
    home: 'Home',
    shop: 'Shop',
    leaderboard: 'Ranking',
    friends: 'Friends'
  },

  // Home / Earn Panel
  earn: {
    title: 'Earn Money',
    work: 'Work',
    workDesc: '+1,000 AED',
    workCD: '1 min cooldown',
    business: 'Business',
    businessDesc: '+10,000 AED',
    businessCD: '10 min cooldown',
    invest: 'Oil Investment',
    investDesc: '50% chance: +1M AED',
    investFailDesc: '50% chance: -500K AED',
    investCD: '60 min cooldown',
    cooldown: 'Cooldown',
    ready: 'Ready!',
    justEarned: 'You just earned',
    youLost: 'You lost',
    aed: 'AED'
  },

  // Shop
  shop: {
    title: 'Shop',
    categories: {
      all: 'All',
      cars: 'Cars',
      homes: 'Homes',
      pets: 'Pets',
      luxury: 'Luxury'
    },
    locked: 'Locked',
    lockedLevel: 'Unlock at Level',
    owned: 'Owned',
    buy: 'Buy',
    buyConfirm: 'Confirm Purchase',
    cancel: 'Cancel',
    purchaseSuccess: 'Purchase successful!',
    purchaseFail: 'Not enough AED!',
    itemBought: 'You bought'
  },

  // Leaderboard
  leaderboard: {
    title: 'Leaderboard',
    globalWealth: 'Global Wealth Ranking',
    rank: 'Rank',
    player: 'Player',
    wealth: 'Wealth',
    you: '(You)'
  },

  // Friends
  friends: {
    title: 'Friends',
    visit: 'Visit',
    gift: 'Gift',
    pk: 'PK',
    visitReward: '+100 AED',
    online: 'Online',
    offline: 'Offline',
    noFriends: 'No friends yet',
    pkChallenge: 'PK Challenge',
    pkConfirm: 'Challenge to PK?',
    pkWin: 'You Won!',
    pkLose: 'You Lost!',
    pkDraw: 'Draw!',
    sendGift: 'Send Gift',
    selectGift: 'Select a gift to send'
  },

  // Levels
  levels: {
    1: 'Peasant',
    2: 'Small Boss',
    3: 'Rich Merchant',
    4: 'Tycoon',
    5: 'Middle East King'
  },

  // Messages
  messages: {
    levelUp: 'Level Up!',
    congrats: 'Congratulations!',
    newLevel: 'You are now',
    insufficientFunds: 'Insufficient funds!'
  },

  // Actions
  actions: {
    confirm: 'Confirm',
    cancel: 'Cancel',
    close: 'Close',
    ok: 'OK'
  }
};

// Helper function to get translation
function t(key) {
  const keys = key.split('.');
  let value = I18N;
  for (const k of keys) {
    if (value && value[k] !== undefined) {
      value = value[k];
    } else {
      return key; // Return key if not found
    }
  }
  return value;
}
