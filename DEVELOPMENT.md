# 开发规范文档

> **项目**: Arab Tycoon Simulator
> **版本**: v1.0
> **最后更新**: 2026-03-29

---

## 1. 开发环境搭建

### 1.1 基础要求

| 工具 | 版本要求 | 说明 |
|------|----------|------|
| Node.js | ≥ 18.0 | npm 包管理器需要 |
| Git | 任意版本 | 代码版本管理 |
| VS Code | 最新版 | 推荐 IDE |
| Chrome | 最新版 | 开发调试 |
| Firebase CLI | ≥ 12.0 | 部署 Firestore 规则 |

### 1.2 本地开发环境搭建步骤

**Step 1: 克隆仓库**

```bash
git clone https://github.com/Cyril0404/arab-tycoon-simulator.git
cd arab-tycoon-simulator
```

**Step 2: 安装 Firebase CLI（如需部署 Firestore 规则）**

```bash
npm install -g firebase-tools
firebase login
```

**Step 3: 本地开发服务器（可选，HTTP server）**

由于项目是纯静态文件，可以直接用任意 HTTP 服务器：

```bash
# 方法 1: Python（已安装）
python3 -m http.server 8080

# 方法 2: npx（无需安装）
npx serve .

# 方法 3: VS Code Live Server 插件（推荐）
# 在 VS Code 中按 Cmd+Shift+P → "Live Server: Open with Live Server"
```

**Step 4: 配置 Firebase 项目**

```bash
# 初始化 Firebase（首次）
firebase init firestore
# 选择已有项目或创建新项目
# 选择项目 ID：arab-tycoon-simulator
# 默认规则文件：firestore.rules
# 默认索引文件：firestore.indexes.json

# 本地运行 Firestore 模拟器（可选）
firebase init emulators
firebase emulators:start
```

**Step 5: 配置环境变量**

在 `js/firebase-config.js` 中填入 Firebase 配置：

```javascript
// js/firebase-config.js
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "arab-tycoon-simulator.firebaseapp.com",
  projectId: "arab-tycoon-simulator",
  storageBucket: "arab-tycoon-simulator.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

> ⚠️ **重要**：Firebase 的 apiKey 是前端的，不算泄露。真正的保护来自 Firestore Security Rules。

**Step 6: 运行开发服务器**

```bash
npx serve . -l 8080
# 访问 http://localhost:8080
```

### 1.3 VS Code 推荐插件

| 插件名称 | 用途 |
|----------|------|
| Vue - Official | Vue 3 语言支持、语法高亮 |
| ESLint | 代码检查 |
| Prettier | 代码格式化 |
| Live Server | 本地开发服务器 |
| Firebase Explorer | Firestore 数据可视化 |

---

## 2. 调试方法

### 2.1 手机真机调试（Android Chrome）

**Step 1: 手机开启开发者选项 + USB 调试**

```
设置 → 关于手机 → 连续点击"版本号"7次 → 返回 → 开发者选项 → USB 调试
```

**Step 2: 用 USB 连接电脑和手机**

**Step 3: 电脑端 Chrome 打开 `chrome://inspect`**

```
在 Chrome 地址栏输入 chrome://inspect
勾选 "Discover USB devices"
```

**Step 4: 手机上打开游戏（通过 WhatsApp 链接或 Chrome）**

**Step 5: 在电脑端点击设备名称，开始调试**

- 可以查看 DOM 结构
- 可以查看 Console 输出
- 可以断点调试 JavaScript

**Step 6: 查看 Console 输出**

```javascript
// 在游戏代码中添加日志
console.log('[Game] Player earned:', amount);
console.log('[Firebase] Data synced:', data);
```

### 2.2 模拟 WhatsApp 内置浏览器

WhatsApp 使用的是 Android System WebView，和 Chrome 类似但不完全相同：

**方法：通过微信/QQ/Telegram 内置浏览器测试**

这些内置浏览器和 WhatsApp WebView 有类似的限制：
- 不支持部分 ES6+
- 不支持某些 CSS 属性

**检查清单：**
- [ ] `console.log` 是否有报错？
- [ ] `backdrop-filter` 是否正常？
- [ ] 字体是否正确加载？
- [ ] localStorage 是否可用？

### 2.3 Firestore 调试技巧

**使用 Firestore 模拟器进行本地测试：**

```bash
firebase init emulators
# 选择 Firestore Emulator，端口 8080
firebase emulators:start
```

然后修改 `firebase-config.js` 指向模拟器：

```javascript
connectFirestoreEmulator(db, 'localhost', 8080);
```

**Firebase Console 实时查看：**

访问 [Firebase Console](https://console.firebase.google.com) → Firestore → Data，实时查看数据变化。

---

## 3. WhatsApp 内置浏览器调试技巧

### 3.1 WhatsApp WebView 特性

| 特性 | 支持情况 | 说明 |
|------|----------|------|
| ES6+ JavaScript | ✅ 基本支持 | 主流设备支持 |
| CSS Flexbox | ✅ 支持 |  |
| CSS Grid | ✅ 支持 |  |
| `backdrop-filter` | ❌ 部分不支持 | 需要 fallback |
| `navigator.share` | ❌ 不支持 | 需要替代方案 |
| WebSocket | ✅ 支持 |  |
| Service Worker | ⚠️ 部分支持 | iOS WhatsApp 不支持 |
| localStorage | ✅ 支持（5MB限额） | 建议用 Firebase 替代 |
| IndexedDB | ✅ 支持 |  |

### 3.2 常见问题排查

**问题 1: 页面显示乱码或样式错位**

原因：CSS `backdrop-filter` 在 WhatsApp WebView 不支持
解决：
```css
.status-bar {
  background: rgba(44, 30, 15, 0.95); /* fallback */
}
@supports (backdrop-filter: blur(10px)) {
  .status-bar {
    background: rgba(44, 30, 15, 0.85);
    backdrop-filter: blur(10px);
  }
}
```

**问题 2: 页面刷新后白屏（路由 404）**

原因：GitHub Pages 不知道 SPA 路由，需要 fallback
解决：`404.html` 内容：

```html
<script>
  sessionStorage.setItem('redirect', location.pathname);
  location.href = '/';
</script>
```

**问题 3: localStorage 存不下（5MB 限制）**

原因：WhatsApp WebView 的 localStorage 限额小
解决：主要数据存在 Firestore，localStorage 仅存用户 UID 和简单缓存

**问题 4: 微信/WhatsApp 拦截分享 API**

原因：这些 WebView 重写了 `navigator.share`
解决：使用 Canvas 生成图片，复制链接到剪贴板作为 fallback

```javascript
async function shareToWhatsApp(text, imageDataUrl) {
  if (navigator.share) {
    await navigator.share({ text, files: [imageDataUrl] });
  } else {
    // Fallback: 复制链接到剪贴板
    await navigator.clipboard.writeText(text);
    alert('Link copied! Paste it in WhatsApp.');
  }
}
```

### 3.3 CSP（Content Security Policy）配置

WhatsApp WebView 有严格的 CSP，需要在 HTTP 响应头中配置：

```
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://unpkg.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  connect-src 'self' https://*.firebaseio.com https://*.googleapis.com;
  font-src 'self';
```

**在 GitHub Pages 上配置 CSP：**
在 `index.html` 的 `<head>` 中添加：

```html
<meta http-equiv="Content-Security-Policy"
  content="default-src 'self';
           script-src 'self' 'unsafe-inline' https://unpkg.com;
           style-src 'self' 'unsafe-inline';
           img-src 'self' data: https:;
           connect-src 'self' https://*.firebaseio.com https://*.googleapis.com;
           font-src 'self';">
```

---

## 4. 常见问题排查（FAQ）

### 4.1 网络相关

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| Firebase 连接失败 | 网络问题或配置错误 | 检查 `firebase-config.js`，确认项目 ID 正确 |
| Firestore 读取失败 | Security Rules 拦截 | 检查 `firestore.rules` |
| 数据不同步 | 离线模式 | Firebase 有离线缓存，检查 `enableOffline` |

### 4.2 游戏逻辑相关

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| 冷却时间不重置 | Firestore 写入失败 | 检查网络状态，增加重试逻辑 |
| 购买后金币没扣 | `increment` 原子操作未生效 | 使用 Firestore 事务 |
| 等级不升级 | 条件判断错误 | 检查 `calculateLevel` 函数逻辑 |
| 排行榜没更新 | 排行榜写入了 Security Rules | 排行榜只能通过 Cloud Functions 写入 |

### 4.3 跨域问题（CORS）

Firebase Firestore SDK 使用 WebSocket，不存在跨域问题。但如果自己写 REST API：

```javascript
// 在 Firebase Cloud Functions 中处理 CORS
const cors = require('cors')({ origin: true });
exports.apiHandler = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    // 处理请求
  });
});
```

---

## 5. 性能优化

### 5.1 首屏加载优化

**目标：首屏渲染 < 3 秒（3G 网络）**

| 优化项 | 具体做法 |
|--------|----------|
| 关键 CSS 内联 | 将 `main.css` 的 CSS 变量和核心布局内联到 `<head>` |
| CDN 懒加载 | 非关键 JS 使用 `defer`，不阻塞渲染 |
| 图片压缩 | 商品图使用 WebP，限制 200KB 以内 |
| 字体优化 | 使用系统字体栈，不引入外部字体 |
| 骨架屏 | 加载中显示骨架屏（placeholder） |

**骨架屏示例（CSS）：**
```css
.skeleton {
  background: linear-gradient(90deg, #2C1E0F 25%, #4A3728 50%, #2C1E0F 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}
@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

### 5.2 图片优化

| 优化项 | 要求 |
|--------|------|
| 格式 | WebP（优先），JPEG（备选） |
| 商品图标 | ≤ 128×128px，≤ 50KB |
| 头像 | ≤ 64×64px，≤ 20KB |
| 海报背景 | ≤ 1080×1920px，≤ 300KB |

### 5.3 代码分割（路由懒加载）

```javascript
// router.js
const routes = [
  { path: '/', component: () => import('./pages/SplashPage.vue') },
  { path: '/home', component: () => import('./pages/HomePage.vue') },
  // ...
];
```

### 5.4 Firebase 查询优化

```javascript
// ✗ 错误：获取所有用户再筛选（浪费 reads）
const allUsers = await db.collection('users').get();
const myFriends = allUsers.docs.filter(d => d.friendIds.includes(uid));

// ✓ 正确：直接查询好友集合
const friendsSnap = await db
  .collection('friends').doc(uid).collection('list')
  .get();
```

### 5.5 防抖和节流

```javascript
// 冷却时间更新（节流：每秒最多更新1次）
function updateCooldownDisplay() {
  // DOM 更新放在 requestAnimationFrame 中
  requestAnimationFrame(() => {
    timerEl.textContent = formatTime(remainingSeconds);
  });
}
setInterval(updateCooldownDisplay, 1000);

// 滚动事件（节流）
window.addEventListener('scroll', throttle(handleScroll, 200));

function throttle(fn, delay) {
  let last = 0;
  return function(...args) {
    const now = Date.now();
    if (now - last >= delay) {
      last = now;
      fn.apply(this, args);
    }
  };
}
```

---

## 6. PWA 配置

### 6.1 manifest.json

```json
{
  "name": "Arab Tycoon Simulator",
  "short_name": "Arab Tycoon",
  "description": "Start with 1,000 AED, become the richest in the Middle East!",
  "start_url": "/",
  "display": "standalone",
  "orientation": "portrait",
  "background_color": "#000000",
  "theme_color": "#D4AF37",
  "lang": "en",
  "icons": [
    {
      "src": "assets/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "assets/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ],
  "categories": ["games", "entertainment"],
  "screenshots": [
    {
      "src": "assets/screenshots/gameplay.png",
      "sizes": "390x844",
      "type": "image/png"
    }
  ]
}
```

### 6.2 Service Worker（sw.js）

```javascript
const CACHE_NAME = 'arab-tycoon-v1.0.0';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/css/main.css',
  '/css/components.css',
  '/css/animations.css',
  '/js/app.js',
  '/js/router.js',
  '/js/stores/user.js',
  '/js/stores/game.js',
  '/js/stores/social.js',
  '/js/stores/leaderboard.js',
  '/manifest.json'
];

// Install
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Fetch（缓存优先，网络更新）
self.addEventListener('fetch', event => {
  // 跳过 Firestore 请求（不需要缓存）
  if (event.request.url.includes('firebaseio.com') ||
      event.request.url.includes('googleapis.com')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cached => {
      const networkFetch = fetch(event.request).then(response => {
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, clone);
          });
        }
        return response;
      }).catch(() => cached);

      return cached || networkFetch;
    })
  );
});
```

### 6.3 注册 Service Worker

```html
<!-- index.html -->
<script>
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then(reg => console.log('SW registered:', reg.scope))
        .catch(err => console.log('SW registration failed:', err));
    });
  }
</script>
```

---

## 7. 日志规范

### 7.1 游戏日志分级

```javascript
const LOGGER = {
  DEBUG: '[DEBUG]',
  INFO: '[INFO]',
  WARN: '[WARN]',
  ERROR: '[ERROR]'
};

function log(level, tag, message, data) {
  if (process.env.NODE_ENV === 'production') {
    if (level === LOGGER.ERROR || level === LOGGER.WARN) {
      console.error(`${level} [${tag}] ${message}`, data);
    }
  } else {
    console.log(`${level} [${tag}] ${message}`, data || '');
  }
}

// 使用
log(LOGGER.INFO, 'Game', 'Player earned', { amount: 1000 });
```
