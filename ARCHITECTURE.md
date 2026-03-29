# 技术架构文档

> **项目**: Arab Tycoon Simulator
> **版本**: v1.0
> **最后更新**: 2026-03-29

---

## 1. 整体技术架构

### 1.1 架构概览（文字版）

```
┌─────────────────────────────────────────────────────────────┐
│                      用户端（Client）                        │
│   ┌─────────────────────────────────────────────────────┐   │
│   │              H5 应用程序（单页应用）                  │   │
│   │   ┌─────────┐  ┌─────────┐  ┌─────────┐           │   │
│   │   │  Vue3   │  │  Pinia   │  │ Vue Router│          │   │
│   │   │ (CDN)  │  │ (状态)   │  │ (路由)    │           │   │
│   │   └─────────┘  └─────────┘  └─────────┘           │   │
│   │   ┌─────────────────────────────────────────┐      │   │
│   │   │           业务逻辑层（Game Logic）        │      │   │
│   │   │  赚钱/消费/装备/社交/排行榜/分享           │      │   │
│   │   └─────────────────────────────────────────┘      │   │
│   │   ┌─────────────────────────────────────────┐      │   │
│   │   │         Firebase SDK（云端同步）          │      │   │
│   │   └─────────────────────────────────────────┘      │   │
│   └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              ↕
                    Firebase Firestore (云端数据库)
                    Firebase Auth (匿名登录)
                    Firebase Hosting (静态资源)
                              ↕
┌─────────────────────────────────────────────────────────────┐
│                      GitHub Pages                           │
│               静态资源托管（index.html/CSS/JS）               │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 数据流向

```
用户操作（点击按钮）
    ↓
Vue 组件处理事件
    ↓
Pinia Store 更新状态
    ↓
Firebase SDK 写入 Firestore（异步）
    ↓
Firestore 触发实时订阅
    ↓
其他客户端同步更新
    ↓
UI 自动刷新
```

---

## 2. 前端技术选型

### 2.1 技术栈选择

**推荐方案：Vue 3 + CDN（Composition API）**

| 备选方案 | 优点 | 缺点 | 推荐度 |
|----------|------|------|--------|
| **Vue 3 CDN** | 轻量（~40KB gzip）、无需构建、CDN加载快 | 无 TypeScript（MVP可接受） | ⭐⭐⭐⭐⭐ |
| React 18 CDN | 生态丰富 | 文件较大，学习成本高 | ⭐⭐⭐ |
| Vanilla JS | 零依赖，最小包 | 代码量大了难以维护 | ⭐⭐⭐ |

### 2.2 Vue 3 CDN 方案详解

**为什么选 Vue 3 CDN：**

1. **无需构建步骤**：H5游戏不需要 webpack/vite，MVP阶段直接 CDN 引入，开发效率最高
2. **包体积小**：Vue 3 gzip 后仅 ~40KB，比 React 动辄 100KB+ 小很多
3. **上手快**：团队如果熟悉 Vue，2小时就能上手
4. **响应式**：Pinia（Vuex继任者）提供强力的状态管理，适合游戏数据流
5. **生态好**：Vue Router（路由）、VueUse（工具函数）都支持CDN

**引入方式：**
```html
<!-- Vue 3 全家桶 CDN 引入 -->
<script src="https://unpkg.com/vue@3/dist/vue.global.prod.js"></script>
<script src="https://unpkg.com/vue-router@4/dist/vue-router.global.js"></script>
```

### 2.3 前端依赖清单

| 依赖 | 版本 | CDN 地址 | 用途 |
|------|------|----------|------|
| Vue 3 | 3.4+ | unpkg.com/vue@3 | 核心框架 |
| Pinia | 2.1+ | unpkg.com/pinia | 状态管理 |
| Vue Router | 4.2+ | unpkg.com/vue-router@4 | 路由管理 |
| Firebase SDK | 10.7+ | firebase.google.com/js-sdk | 后端服务 |

### 2.4 不使用构建工具的理由

| 因素 | 说明 |
|------|------|
| **WhatsApp 兼容性** | WhatsApp 内置浏览器对动态 import() 支持不稳定，bundle 更安全 |
| **上线速度** | 无需 npm install / build，直接改 .html 就能上线 |
| **调试简单** | 直接在浏览器调试，不依赖 sourcemap |
| **免费部署** | GitHub Pages 直接托管静态文件 |

---

## 3. 后端技术选型

### 3.1 Firebase BaaS 方案 vs 传统 Node.js 方案

| 维度 | **Firebase BaaS（推荐）** | 传统 Node.js |
|------|--------------------------|--------------|
| 开发速度 | 快（MVP 优先，1天即可上线） | 慢（需要设计 API、写 controller） |
| 实时数据 | 内置 Firestore 实时同步 | 需要 WebSocket 实现 |
| 认证 | Firebase Auth（匿名登录即用） | 需自建登录系统 |
| 数据库 | Firestore NoSQL，免费额度充足 | 需要购买数据库服务 |
| 费用 | **免费**（Spark 套餐：1GB 存储，50K 读写/天） | 云服务器 + 数据库 = 每月$10+ |
| 扩展性 | 自动弹性扩展 | 需手动扩容 |
| 数据迁移 | 导出 JSON，易迁移 | 取决于数据库 |
| **推荐度** | **⭐⭐⭐⭐⭐** | ⭐⭐⭐ |

**Firebase 免费套餐额度（MVP足够）：**
- Firestore：1GB 存储，每天 50K 读 / 20K 写
- Firebase Auth：无限匿名用户
- Firebase Hosting：10GB 存储 / 月， 360MB/天流量
- Cloud Functions：400K  invocation/month（未来用）

**结论：MVP 阶段使用 Firebase BaaS 方案，是最优解。**

### 3.2 Firebase 各服务用途

```
Firebase Auth         → 匿名登录（用户无需注册，直接进入游戏）
Firebase Firestore    → 游戏数据存储（用户数据、排行榜、好友关系）
Firebase Hosting      → 静态资源托管（CSS/JS/图片）
Firebase Analytics    → 用户行为分析（游戏内按钮点击、留存）
```

---

## 4. Firebase Firestore 数据模型

### 4.1 Collections 结构

```
Firestore
├── users/{uid}
│     ├── profile: { nickname, avatar, createdAt }
│     ├── wealth: { cash, totalWealth, totalCarValue, ... }
│     ├── inventory: [ { itemId, count, boughtAt } ]
│     ├── cooldowns: { work: timestamp, business: timestamp, oil: timestamp }
│     └── settings: { displayWealth: boolean }
│
├── leaderboard/{category}
│     ├── global_totalWealth: [ { uid, value, rank } ]
│     ├── global_carValue:    [ { uid, value, rank } ]
│     ├── global_propertyValue:[ { uid, value, rank } ]
│     └── global_petValue:    [ { uid, value, rank } ]
│
├── friends/{uid}
│     ├── friend_{friendUid}: { addedAt, status: 'active'|'blocked' }
│
├── items/{itemId}
│     ├── name, category, price, description, iconUrl, unlockLevel
│
├── transactions/{transactionId}
│     ├── uid, type, amount, itemId?, timestamp, description
│
└── gifts/{giftId}
      ├── fromUid, toUid, itemId, sentAt
```

### 4.2 为什么这样设计？

| 设计决策 | 理由 |
|----------|------|
| 使用 document ID 而非自动递增 ID | 便于查询和更新 |
| 排行榜单独 collection | 避免每次查询都扫描 users |
| 好友关系双向存储 | 查询好友列表时 O(1)，无需 JOIN |
| transactions 单独 collection | 便于审计和反作弊 |

---

## 5. API 设计（Firestore 实时同步）

### 5.1 传统 REST API vs Firestore SDK

**Firebase Firestore 不需要手写 REST API。** 使用 SDK 的实时订阅模式：

```javascript
// 订阅用户数据变化（自动实时同步）
const unsub = db.collection('users').doc(uid)
  .onSnapshot(doc => {
    const data = doc.data();
    store.updateWealth(data.wealth);
  });

// 写入数据
await db.collection('users').doc(uid).update({
  'wealth.cash': cash + earned,
  'wealth.totalWealth': newTotal,
  [`cooldowns.${action}`]: Timestamp.now()
});
```

### 5.2 关键 Firestore 操作

**读取（Read）：**
```javascript
// 获取当前用户
const userDoc = await db.collection('users').doc(uid).get();

// 订阅排行榜
db.collection('leaderboard').doc('global_totalWealth')
  .onSnapshot(snap => {
    const rankings = snap.data().rankings;
    store.setLeaderboard(rankings);
  });

// 订阅好友列表
db.collection('friends').doc(uid).collection('list')
  .onSnapshot(snap => {
    const friends = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    store.setFriends(friends);
  });
```

**写入（Write）：**
```javascript
// 打工赚钱
await db.collection('users').doc(uid).update({
  'wealth.cash': increment(1000),
  'wealth.totalWealth': increment(1000)
});

// 购买装备
await db.collection('users').doc(uid).update({
  'wealth.cash': increment(-itemPrice),
  inventory: arrayUnion({ itemId, count: 1, boughtAt: Date.now() })
});
```

---

## 6. 实时机制

### 6.1 Firestore 实时订阅机制

Firebase Firestore 内置实时推送，无需 WebSocket：

```javascript
// 游戏启动时订阅所有必要数据
function subscribeToGameData(uid) {
  const unsubs = [];

  // 订阅自身数据
  unsubs.push(
    db.collection('users').doc(uid)
      .onSnapshot(userDoc => {
        if (userDoc.exists) {
          store.setUser(userDoc.data());
        }
      })
  );

  // 订阅排行榜（全局）
  unsubs.push(
    db.collection('leaderboard').doc('global_totalWealth')
      .onSnapshot(snap => {
        store.setLeaderboard(snap.data().rankings || []);
      })
  );

  // 订阅好友列表
  unsubs.push(
    db.collectionGroup('friends').where('uid', '==', uid)
      .onSnapshot(snap => { /* ... */ })
  );

  return () => unsubs.forEach(u => u()); // 清理函数
}
```

### 6.2 离线支持

Firebase SDK 内置离线持久化：
```javascript
firebase.firestore().enablePersistence()
  .then(() => {
    // 离线也可读取缓存数据
  })
  .catch(err => {
    if (err.code === 'failed-precondition') {
      console.warn('多个标签页打开，仅第一个标签页启用持久化');
    }
  });
```

---

## 7. 部署方案

### 7.1 整体部署架构

```
┌─────────────────────────────────────────────────────┐
│                    域名（可选）                       │
│              arabtycoon.com (Cloudflare)            │
└───────────────────┬─────────────────────────────────┘
                    │
        ┌───────────┴───────────┐
        ↓                       ↓
┌───────────────┐      ┌──────────────────┐
│  GitHub Pages │      │ Firebase Hosting │
│  静态资源托管  │      │  Firestore 数据   │
│  (前端)        │      │  Firebase Auth   │
│  免费          │      │  免费额度足够     │
└───────────────┘      └──────────────────┘
```

### 7.2 部署地址

| 环境 | 地址 | 说明 |
|------|------|------|
| GitHub Pages | `https://Cyril0404.github.io/arab-tycoon-simulator/` | 前端静态资源 |
| Firebase | `arab-tycoon-simulator.web.app` | Firebase 默认域名 |
| GitHub Actions | CI/CD 自动部署 | 代码推送后自动构建 |

### 7.3 资源加载路径

```
/
├── index.html          (入口文件)
├── css/
│     ├── main.css      (主样式)
│     ├── components.css (组件样式)
│     └── animations.css (动效)
├── js/
│     ├── app.js        (Vue 应用入口)
│     ├── router.js     (路由配置)
│     ├── stores/       (Pinia stores)
│     │     ├── user.js
│     │     ├── game.js
│     │     └── social.js
│     ├── services/     (Firebase 服务封装)
│     │     ├── firebase.js
│     │     ├── userService.js
│     │     └── leaderboardService.js
│     └── utils/        (工具函数)
│           ├── format.js
│           └── storage.js
├── assets/
│     ├── icons/        (SVG 图标)
│     └── images/       (图片资源)
├── manifest.json       (PWA 配置)
└── sw.js               (Service Worker)
```

---

## 8. CDN 和资源优化

### 8.1 CDN 引入策略

```html
<!-- Vue 3 CDN（使用 unpkg，带版本锁定） -->
<script src="https://unpkg.com/vue@3.4.21/dist/vue.global.prod.js"></script>
<!-- Pinia -->
<script src="https://unpkg.com/pinia@2.1.7/dist/pinia.iife.prod.js"></script>
<!-- Vue Router -->
<script src="https://unpkg.com/vue-router@4.3.0/dist/vue-router.global.js"></script>
<!-- Firebase -->
<script src="https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.8.0/firebase-auth-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore-compat.js"></script>
```

### 8.2 资源优化策略

| 优化项 | 具体做法 |
|--------|----------|
| 图片格式 | 使用 WebP 格式（比 PNG 小 30%） |
| 图片尺寸 | 限制最大 200KB，图标用 SVG |
| CSS/JS | CDN 已 gzip，无需额外压缩 |
| 字体 | 使用系统字体栈（不引入外部字体 CDN） |
| 代码分割 | 功能模块懒加载（Vue Router lazy load） |
| 首屏优化 | 关键 CSS 内联，JS defer 加载 |

### 8.3 Service Worker 缓存策略

```javascript
// sw.js
const CACHE_NAME = 'arab-tycoon-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/css/main.css',
  '/js/app.js'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
```

---

## 9. 安全考虑

### 9.1 客户端数据篡改防范

**核心原则：所有关键数据由服务端计算和存储，客户端仅负责展示和发起操作。**

| 风险 | 防范措施 |
|------|----------|
| 修改 localStorage 伪造财富 | 数据存储在 Firestore，localStorage 仅作离线缓存 |
| 修改 JS 变量刷钱 | 所有操作通过 Firestore transactions，客户端无法篡改 |
| 刷排行榜 | Firebase Security Rules 限制写入频率（每分钟最多10次财富变更） |
| 伪造好友关系 | 好友关系双向验证，均需双方确认 |

### 9.2 API Key 保护

Firebase API Key 暴露在客户端是**安全的**，因为：
- Firestore Security Rules 在服务端验证权限
- API Key 只有在配合 Firestore Rules 校验后才能读写数据
- **不要**在客户端硬编码敏感的 Admin Key（Firebase 不需要）

### 9.3 Firestore Security Rules

详见 `SECURITY.md` 文档。

---

## 10. 技术债务与未来扩展

### 10.1 MVP 阶段的技术妥协

| 妥协项 | 原因 | 未来改进 |
|--------|------|----------|
| 无 TypeScript | CDN 引入不支持 TS 类型 | v1.1 迁移到 Vite + TS |
| 无单元测试 | MVP 时间紧 | v1.1 增加 Vitest |
| 无 CI/CD 单元测试 | MVP 先上线 | v1.1 增加 GitHub Actions |
| localStorage 缓存 | 离线体验 | Firebase 离线支持已足够 |

### 10.2 未来扩展方向

- **实时多人 PK**：使用 Firebase Cloud Functions + Firestore
- **广告变现**：接入 Google AdMob（v2.0）
- **阿拉伯语**：RTL 支持（v1.1）
- **服务器端计算**：将投资石油概率运算移到 Cloud Functions
