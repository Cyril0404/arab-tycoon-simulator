# 编码规范文档

> **项目**: Arab Tycoon Simulator
> **版本**: v1.0
> **最后更新**: 2026-03-29

---

## 1. 项目目录结构

```
arab-tycoon-simulator/
│
├── index.html                 # 应用入口文件
├── 404.html                   # GitHub Pages SPA fallback
│
├── css/
│     ├── main.css             # 全局样式、变量定义
│     ├── components.css        # 组件样式
│     ├── animations.css       # 动画关键帧
│     └── pages.css            # 各页面特定样式
│
├── js/
│     ├── app.js               # Vue 3 应用入口
│     ├── router.js            # Vue Router 配置
│     ├── firebase-config.js   # Firebase 初始化
│     │
│     ├── stores/               # Pinia Store（状态管理）
│     │     ├── user.js         # 用户数据 Store
│     │     ├── game.js         # 游戏逻辑 Store（赚钱/消费）
│     │     ├── social.js       # 社交 Store（好友/PK）
│     │     └── leaderboard.js  # 排行榜 Store
│     │
│     ├── services/             # 业务服务层
│     │     ├── auth.js         # 匿名登录服务
│     │     ├── userService.js  # 用户 CRUD
│     │     ├── gameService.js  # 游戏操作（赚钱/购买）
│     │     ├── socialService.js# 社交操作
│     │     └── shareService.js # 分享服务
│     │
│     ├── components/           # Vue 组件
│     │     ├── StatusBar.vue   # 顶部状态栏
│     │     ├── BottomTabs.vue  # 底部导航
│     │     ├── EarnPanel.vue   # 赚钱面板
│     │     ├── ShopPanel.vue   # 商店面板
│     │     ├── ItemCard.vue    # 商品卡片
│     │     ├── Leaderboard.vue # 排行榜
│     │     ├── FriendsList.vue # 好友列表
│     │     ├── GiftModal.vue   # 送礼弹窗
│     │     ├── PKModal.vue     # PK 弹窗
│     │     ├── ShareModal.vue  # 分享弹窗
│     │     ├── UpgradeModal.vue# 升级弹窗
│     │     └── CooldownBar.vue # 冷却时间条
│     │
│     ├── pages/                # 页面组件
│     │     ├── SplashPage.vue  # 启动页
│     │     ├── HomePage.vue    # 主界面（Tab容器）
│     │     ├── LeaderboardPage.vue
│     │     ├── FriendsPage.vue
│     │     ├── FriendProfilePage.vue
│     │     └── SharePage.vue
│     │
│     └── utils/                # 工具函数
│           ├── format.js       # 格式化（货币/时间）
│           ├── storage.js      # localStorage 封装
│           ├── audio.js        # 音效管理
│           └── share.js         # 分享工具
│
├── assets/
│     ├── icons/                # SVG 图标（备选）
│     │     └── *.svg
│     └── images/               # 静态图片资源
│           ├── avatars/        # 头像
│           ├── items/          # 商品图
│           └── backgrounds/    # 背景图
│
├── manifest.json              # PWA manifest
├── sw.js                       # Service Worker
├── firebase.json               # Firebase CLI 配置
├── firestore.rules             # Firestore 安全规则
├── firestore.indexes.json      # Firestore 索引配置
│
├── .github/
│     └── workflows/
│           └── deploy.yml      # GitHub Actions CI/CD
│
├── SPEC.md                     # 本文档（规范索引）
└── README.md                   # 项目说明
```

---

## 2. 文件命名规范

### 2.1 通用规则

| 类型 | 规范 | 示例 |
|------|------|------|
| HTML 文件 |  kebab-case | `index.html`, `leaderboard.html` |
| CSS 文件 |  kebab-case | `main.css`, `animations.css` |
| JavaScript 文件 | kebab-case | `firebase-config.js`, `user-service.js` |
| Vue 组件 | PascalCase | `StatusBar.vue`, `LeaderboardCard.vue` |
| 图片文件 | kebab-case | `car-ferrari.webp`, `bg-splash.jpg` |
| 常量/配置 | kebab-case | `cooldown-config.js` |

### 2.2 JavaScript 文件命名

```
{service}.js        # 服务层：auth.js, userService.js
{module}.js         # 模块：game.js, social.js
{util}.js           # 工具：format.js, storage.js
{component}.js      # 仅在非单文件组件时：StatusBar.js
```

---

## 3. HTML 编码规范

### 3.1 基本规范

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <meta name="theme-color" content="#000000">
  <meta name="description" content="Start with 1,000 AED, become the richest in the Middle East!">
  <title>Arab Tycoon Simulator</title>
  <!-- CSS 内联关键样式以加快首屏 -->
  <style>
    body { background: #000; color: #fff; margin: 0; }
  </style>
  <link rel="stylesheet" href="css/main.css">
</head>
<body>
  <div id="app"></div>
  <script src="js/app.js" defer></script>
</body>
</html>
```

### 3.2 Vue 模板规范

```html
<!-- 组件模板规范 -->
<template>
  <div class="item-card" :class="[rarityClass, { locked, owned }]">
    <!-- 使用 emoji 或 SVG，避免外部图片加载 -->
    <div class="item-icon">{{ icon }}</div>
    <div class="item-name">{{ name }}</div>
    <div class="item-price">{{ formatCurrency(price) }}</div>

    <!-- 按钮必须有 aria-label -->
    <button
      class="btn-primary"
      :disabled="isLocked || isOnCooldown"
      @click="handleBuy"
      :aria-label="`Buy ${name} for ${price} AED`"
    >
      {{ buyButtonLabel }}
    </button>
  </div>
</template>

<script>
export default {
  name: 'ItemCard',
  props: {
    itemId: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    icon: { type: String, default: '🎁' },
    rarity: { type: String, default: 'common' },
    isLocked: { type: Boolean, default: false },
    isOwned: { type: Boolean, default: false }
  },
  emits: ['buy'],
  computed: {
    rarityClass() { return `rarity-${this.rarity}`; },
    buyButtonLabel() {
      if (this.isLocked) return '🔒 Locked';
      if (this.isOwned) return '✓ Owned';
      return 'Buy';
    }
  },
  methods: {
    handleBuy() {
      if (!this.isLocked && !this.isOwned) {
        this.$emit('buy', this.itemId);
      }
    }
  }
};
</script>

<style scoped>
.item-card {
  background: #2C1E0F;
  border-radius: 16px;
  padding: 16px;
}
</style>
```

---

## 4. CSS 编码规范

### 4.1 类名命名系统（BEM）

使用 BEM（Block-Element-Modifier）命名：

```css
/* Block */
.item-card { }

/* Element（属于 Block 的子元素） */
.item-card__icon { }
.item-card__name { }
.item-card__price { }
.item-card__button { }

/* Modifier（状态变体） */
.item-card--locked { }
.item-card--owned { }
.item-card--rare { }
.item-card--epic { }
.item-card--legendary { }

/* 多单词 Block */
.leaderboard-card { }
.leaderboard-card__rank { }
.leaderboard-card__avatar { }
.leaderboard-card--top-1 { }
.leaderboard-card--self { }
```

### 4.2 全局 CSS 变量

```css
/* main.css */
:root {
  /* Colors */
  --gold-primary:    #D4AF37;
  --gold-light:      #F5D77A;
  --gold-dark:       #AA8C2C;
  --black:           #000000;
  --dark-brown:      #2C1E0F;
  --medium-brown:    #4A3728;
  --white:           #FFFFFF;
  --light-gray:      #B0A090;
  --border-gold:     #8B7355;
  --green-income:    #4CAF50;
  --red-expense:     #F44336;
  --orange-warning:  #FF9800;

  /* Typography */
  --font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-hero:    900 36px / 1.1 var(--font-family);
  --font-h1:      700 28px / 1.2 var(--font-family);
  --font-h2:      700 22px / 1.3 var(--font-family);
  --font-body:    400 16px / 1.5 var(--font-family);
  --font-caption: 400 14px / 1.4 var(--font-family);

  /* Spacing */
  --space-xs:  4px;
  --space-sm:  8px;
  --space-md:  16px;
  --space-lg:  24px;
  --space-xl:  32px;
  --space-xxl: 48px;

  /* Borders */
  --radius-sm:   8px;
  --radius-md:   12px;
  --radius-lg:   16px;
  --radius-xl:   20px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-gold: 0 4px 15px rgba(212, 175, 55, 0.4);
  --shadow-dark: 0 4px 20px rgba(0, 0, 0, 0.6);

  /* Transitions */
  --ease-micro:    150ms cubic-bezier(0.4, 0, 0.2, 1);
  --ease-standard: 250ms cubic-bezier(0.25, 0.1, 0.25, 1);
  --ease-spring:   350ms cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

### 4.3 避免使用 !important

```css
/* ✗ 错误：滥用 !important */
.btn { color: red !important; }

/* ✓ 正确：使用具体选择器 */
.item-card__button.btn-primary { color: red; }
```

---

## 5. JavaScript 编码规范

### 5.1 变量命名

| 类型 | 规范 | 示例 |
|------|------|------|
| 变量/函数 | camelCase | `getUserData`, `totalWealth` |
| 常量 | UPPER_SNAKE_CASE | `MAX_FRIENDS`, `COOLDOWN_WORK` |
| 类/构造函数 | PascalCase | `GameStore`, `UserService` |
| 私有变量 | _下划线前缀 | `_cachedData` |
| 布尔变量 | is/has/can 前缀 | `isLoading`, `hasPermission` |
| 数组 | 复数名词 | `friendsList`, `items` |
| Vue refs | 保持与 HTML 一致 | `ref="buyButton"` |

### 5.2 常量定义位置

所有游戏数值常量必须集中在配置文件中，禁止硬编码：

```javascript
// config/game-config.js
export const GAME_CONFIG = {
  INITIAL_CASH: 1000,

  EARNINGS: {
    work: { amount: 1_000, cooldownSeconds: 60 },
    business: { amount: 10_000, cooldownSeconds: 600 },
    oil: {
      successAmount: 1_000_000,
      failureAmount: -500_000,
      successRate: 0.5,
      cooldownSeconds: 3600
    }
  },

  LEVELS: [
    { level: 1, name: 'Commoner', threshold: 0 },
    { level: 2, name: 'Small Boss', threshold: 100_000 },
    { level: 3, name: 'Rich Merchant', threshold: 1_000_000 },
    { level: 4, name: 'Super Tycoon', threshold: 100_000_000 },
    { level: 5, name: "Middle East's Richest", threshold: 10_000_000_000 }
  ],

  DAILY_LIMITS: {
    like: 10,
    visit: 1,
    pkChallenge: 5,
    gift: 10
  }
};
```

### 5.3 注释规范

```javascript
/**
 * 计算用户的当前身份等级
 * @param {number} totalWealth - 用户总资产（AED）
 * @returns {number} 等级（1-5）
 */
function calculateLevel(totalWealth) {
  // 从高到低遍历找到匹配的等级
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (totalWealth >= LEVELS[i].threshold) {
      return LEVELS[i].level;
    }
  }
  return 1;
}

// TODO: v1.1 - 添加阿拉伯语翻译支持
// FIXME: WhatsApp 浏览器分享 API 不支持，需要 fallback
```

### 5.4 Vue 3 Composition API 规范

```javascript
// stores/game.js（Pinia Store）
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { GAME_CONFIG } from '../config/game-config.js';
import { gameService } from '../services/gameService.js';

export const useGameStore = defineStore('game', () => {
  // State
  const cash = ref(1000);
  const totalWealth = ref(1000);
  const inventory = ref([]);
  const cooldowns = ref({ work: null, business: null, oil: null });
  const isLoading = ref(false);

  // Getters（Computed）
  const currentLevel = computed(() => calculateLevel(totalWealth.value));

  const canWork = computed(() => isCooldownReady('work'));
  const canBusiness = computed(() => isCooldownReady('business'));
  const canOil = computed(() => isCooldownReady('oil'));

  const remainingWorkCooldown = computed(() =>
    getRemainingSeconds(cooldowns.value.work)
  );

  // Actions
  async function doWork() {
    if (!canWork.value) return;
    isLoading.value = true;
    try {
      const result = await gameService.earn('work', GAME_CONFIG.EARNINGS.work.amount);
      cash.value += result.earned;
      totalWealth.value += result.earned;
      cooldowns.value.work = result.newCooldown;
    } finally {
      isLoading.value = false;
    }
  }

  return { cash, totalWealth, inventory, cooldowns, isLoading,
           currentLevel, canWork, canBusiness, canOil,
           remainingWorkCooldown, doWork };
});
```

---

## 6. Git 分支策略（Git Flow）

### 6.1 分支命名

| 分支类型 | 命名格式 | 示例 |
|----------|----------|------|
| 主分支 | `main` | 生产环境代码 |
| 开发分支 | `develop` | 集成分支 |
| 功能分支 | `feature/{功能名}` | `feature/shop-system` |
| 修复分支 | `fix/{问题描述}` | `fix/cooldown-bug` |
| 发布分支 | `release/v{版本号}` | `release/v1.0.0` |

### 6.2 分支流程

```
main (发布) ←────────────────────── merge (release)
                ↑                      │
                │   merge (develop)    │  merge
develop ──────────────────────────→  release/v1.0.0
  ↑                ↑                      │
  │                │                      │
feature/shop  feature/leaderboard        │
  ↑                                      │
  └──────────────────────────────────────┘
        merge (feature branches)
```

### 6.3 GitHub PR 流程

1. 从 `develop` 创建 `feature/xxx` 分支
2. 开发完成后提交 PR 到 `develop`
3. 至少 1 人 Review 通过后合并
4. `develop` 稳定后合并到 `main`

---

## 7. Git 提交信息规范（Conventional Commits）

### 7.1 格式

```
<type>(<scope>): <subject>

[body]

[footer]
```

### 7.2 Type 列表

| Type | 说明 | 示例 |
|------|------|------|
| `feat` | 新功能 | `feat(shop): add car purchase logic` |
| `fix` | Bug 修复 | `fix(cooldown): fix timer not resetting` |
| `docs` | 文档更新 | `docs: update README` |
| `style` | 代码格式（不影响功能） | `style(css): format code` |
| `refactor` | 重构 | `refactor(game): extract cooldown logic` |
| `perf` | 性能优化 | `perf: lazy load leaderboard` |
| `test` | 测试相关 | `test: add cooldown unit tests` |
| `chore` | 构建/工具 | `chore: add firebase config` |

### 7.3 提交示例

```
feat(shop): add car purchase with cooldown check

- Add buyCar action to gameStore
- Integrate cooldown validation before purchase
- Show error toast when player has insufficient funds

Closes #23
```

```
fix(leaderboard): rank not updating after wealth change

The leaderboard document wasn't being updated when a user
purchased an item. Added leaderboard update trigger in
gameService.purchaseItem().

Fixes #31
```

---

## 8. 代码审查清单（Code Review Checklist）

### 8.1 功能性

- [ ] 功能逻辑是否正确？边界情况是否处理？
- [ ] 是否有明显的无限循环或性能问题？
- [ ] 错误处理是否完善？（try-catch、网络失败）
- [ ] 游戏数值（价格/冷却）是否从配置文件读取，而非硬编码？

### 8.2 安全

- [ ] 是否涉及用户输入？是否做了校验？
- [ ] 是否有 XSS 风险？（innerHTML 使用需谨慎）
- [ ] Firebase Security Rules 是否覆盖了新功能？
- [ ] 是否有新的 API 调用需要加频率限制？

### 8.3 UI/UX

- [ ] 所有按钮都有 `@click` 事件吗？
- [ ] 所有按钮都有 `aria-label` 吗？
- [ ] loading 状态有处理吗？
- [ ] disabled 状态有明确视觉反馈吗？
- [ ] 移动端触摸反馈正常吗？

### 8.4 代码质量

- [ ] 新增的常量是否放入 `config/` 目录？
- [ ] 是否遵守了 BEM 命名规范？
- [ ] 是否有重复代码需要抽取？
- [ ] 注释是否充分？
- [ ] Vue 组件是否使用了 `scoped` CSS？

---

## 9. ESLint 配置（可选）

```json
{
  "extends": ["eslint:recommended"],
  "env": {
    "browser": true,
    "es2021": true
  },
  "globals": {
    "Vue": "readonly",
    "Pinia": "readonly",
    "firebase": "readonly"
  },
  "rules": {
    "no-unused-vars": "warn",
    "no-console": "off",
    "semi": ["error", "always"],
    "quotes": ["error", "single"]
  }
}
```
