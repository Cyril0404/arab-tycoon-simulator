# 安全与反作弊文档

> **项目**: Arab Tycoon Simulator
> **版本**: v1.0
> **最后更新**: 2026-03-29

---

## 1. 安全威胁模型

### 1.1 主要威胁向量

| 威胁类型 | 描述 | 严重程度 | 防护措施 |
|----------|------|----------|----------|
| 客户端数据篡改 | 修改 localStorage/JS 变量刷钱 | 高 | 服务端计算，Firebase Rules |
| 冷却时间绕过 | 绕过打工/做生意冷却 | 中 | 服务端时间戳验证 |
| 排行榜作弊 | 伪造排名数据 | 中 | 排行榜服务端写入 |
| 刷钱机器人 | 自动化操作刷金币 | 高 | 频率限制 + 行为检测 |
| XSS 攻击 | 在昵称/聊天中注入脚本 | 中 | 输入校验 + CSP |
| 暴力注册 | 大量创建虚假账号 | 低 | Firebase 匿名登录限制 |
| 社交攻击 | PK 骚扰/垃圾好友请求 | 低 | 每日限制 + 黑名单 |

---

## 2. 客户端数据篡改防范

### 2.1 核心安全原则

**原则：永远不要信任客户端。**

| 错误做法 | 风险 | 正确做法 |
|----------|------|----------|
| 客户端计算财富变化 | 用户可篡改 JS | 服务端 Firestore 计算 |
| 客户端验证冷却时间 | 用户可改系统时间 | 服务端 `request.time` 验证 |
| 客户端存储金币余额 | localStorage 可修改 | Firestore 作为单一数据源 |
| 关键逻辑在客户端判断 | 可被调试器绕过 | 服务端 Security Rules |

### 2.2 防御体系

```
用户操作（打工）
    ↓
客户端发送请求（firebase SDK）
    ↓
Firestore Security Rules 验证
    ├── 身份验证（isAuthenticated）
    ├── 数据完整性检查（数据格式）
    ├── 业务规则检查（冷却时间、余额）
    └── 频率限制（maxReads/maxWrites）
    ↓
服务端处理（Cloud Functions / 直接 Firestore 写入）
    ↓
返回结果给客户端
    ↓
客户端更新 UI
```

### 2.3 强化代码示例：防篡改赚钱操作

```javascript
// js/services/gameService.js

/**
 * 打工赚钱 - 服务端验证版本
 * 冷却时间验证在 Security Rules 中执行
 */
async function doWork(uid) {
  const db = firebase.firestore();
  const userRef = db.collection('users').doc(uid);

  try {
    await db.runTransaction(async (transaction) => {
      const userDoc = await transaction.get(userRef);
      const userData = userDoc.data();
      const cooldowns = userData.cooldowns || {};

      // 服务端验证冷却时间
      const workCooldown = cooldowns.work?.toDate() || new Date(0);
      const now = new Date();

      if (now < workCooldown) {
        throw new Error('WORK_COOLDOWN_NOT_READY');
      }

      // 服务端计算新数值
      const newCash = (userData.wealth.cash || 0) + 1000;
      const newTotal = (userData.wealth.totalWealth || 0) + 1000;
      const newCooldown = new Date(now.getTime() + 60_000); // 60秒后

      // 原子更新
      transaction.update(userRef, {
        'wealth.cash': newCash,
        'wealth.totalWealth': newTotal,
        'cooldowns.work': firebase.firestore.Timestamp.fromDate(newCooldown),
        'stats.totalEarned': firebase.firestore.FieldValue.increment(1000)
      });
    });

    return { success: true, earned: 1000 };

  } catch (err) {
    if (err.message === 'WORK_COOLDOWN_NOT_READY') {
      return { success: false, error: 'cooldown' };
    }
    throw err;
  }
}
```

---

## 3. Firebase Security Rules 完整代码

### 3.1 firestore.rules 完整实现

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // ==============================================
    // Helper Functions
    // ==============================================

    function isAuthenticated() {
      return request.auth != null;
    }

    function isCurrentUser(userId) {
      return request.auth.uid == userId;
    }

    function getUserData(userId) {
      return get(/databases/$(database)/documents/users/$(userId));
    }

    function resourceIsUser() {
      return resource.data.uid == request.auth.uid;
    }

    // 验证昵称格式（防 XSS）
    function isValidNickname(nickname) {
      return nickname is string
        && nickname.size() >= 2
        && nickname.size() <= 20
        && nickname.matches('^[a-zA-Z0-9_]+$'); // 仅字母数字下划线
    }

    // ==============================================
    // Users Collection
    // ==============================================
    match /users/{userId} {
      // 读取：任何认证用户可读取公开信息
      allow read: if isAuthenticated();

      // 创建：本人且满足数据格式
      allow create: if isCurrentUser(userId)
        && request.resource.data.profile.nickname is string
        && request.resource.data.wealth.cash == 1000  // 初始金额固定
        && request.resource.data.wealth.totalWealth == 1000;

      // 更新：本人，且满足以下所有条件
      allow update: if isCurrentUser(userId)
        // 1. 不能修改 uid（防止身份冒充）
        && request.resource.data.uid == resource.data.uid
        // 2. 昵称格式验证
        && (
          !('profile' in request.resource.data.diff(resource.data).affectedKeys())
          || isValidNickname(request.resource.data.profile.nickname)
        )
        // 3. 财富变化在合理范围内（见下方函数）
        && wealthChangeIsValid(userId)
        // 4. 冷却时间不能被提前（防时间篡改）
        && cooldownChangeIsValid();

      // 删除：禁止（用户数据不可删除，只能注销）
      allow delete: if false;

      // ---- Sub-collections ----

      // 用户的 transactions 子集合
      match /transactions/{transactionId} {
        allow read: if isCurrentUser(userId);
        allow create: if isCurrentUser(userId)
          && request.resource.data.uid == userId
          && request.resource.data.amount != 0;
        allow update, delete: if false;
      }
    }

    // ==============================================
    // Leaderboard Collection
    // ==============================================
    match /leaderboard/{category} {
      // 任何人可读排行榜
      allow read: if isAuthenticated();

      // 禁止客户端直接写入（由 Cloud Functions 更新）
      allow write: if false;
    }

    // ==============================================
    // Friends Collection
    // ==============================================
    match /friends/{userId}/{document=**} {
      // 本人可读写好友列表
      allow read, write: if isCurrentUser(userId);

      // 好友关系另一方只能读取自己的关系记录
      allow read: if isCurrentUser(resource.data.friendId);
    }

    // ==============================================
    // Items Collection（商品定义）
    // ==============================================
    match /items/{itemId} {
      // 任何认证用户可读取商品信息
      allow read: if isAuthenticated();

      // 禁止客户端写入（商品数据由管理员在 Console 管理）
      allow write: if false;
    }

    // ==============================================
    // Transactions Collection
    // ==============================================
    match /transactions/{transactionId} {
      allow read: if isAuthenticated()
        && resource.data.uid == request.auth.uid;

      allow create: if isAuthenticated()
        && request.resource.data.uid == request.auth.uid
        && request.resource.data.amount != 0
        && request.resource.data.timestamp == request.time;

      allow update, delete: if false;
    }

    // ==============================================
    // Gifts Collection
    // ==============================================
    match /gifts/{giftId} {
      allow read: if isAuthenticated()
        && (resource.data.fromUid == request.auth.uid
            || resource.data.toUid == request.auth.uid);

      allow create: if isAuthenticated()
        && request.resource.data.fromUid == request.auth.uid
        && request.resource.data.sentAt == request.time;

      allow update: if isAuthenticated()
        && resource.data.toUid == request.auth.uid
        && request.resource.data.status == 'pending';

      allow delete: if false;
    }

    // ==============================================
    // Validation Functions
    // ==============================================

    function wealthChangeIsValid(userId) {
      let current = getUserData(userId).data.wealth;
      let incoming = request.resource.data.wealth;

      // 单次现金变化不能超过 5,000,000 AED
      let maxSingleChange = 5_000_000;
      let cashDelta = incoming.cash - current.cash;
      let wealthDelta = incoming.totalWealth - current.totalWealth;

      return abs(cashDelta) <= maxSingleChange
        && abs(wealthDelta) <= maxSingleChange;
    }

    function cooldownChangeIsValid() {
      let current = resource.data.cooldowns;
      let incoming = request.resource.data.cooldowns;

      // 冷却时间不能被提前（只能延长，不能缩短）
      // 即新冷却时间 >= 当前时间
      let actions = ['work', 'business', 'oil'];

      return actions.hasAll(request.resource.data.cooldowns.keys())
        && (!('work' in current) || incoming.work >= current.work)
        && (!('business' in current) || incoming.business >= current.business)
        && (!('oil' in current) || incoming.oil >= current.oil);
    }
  }
}
```

---

## 4. API 调用频率限制

### 4.1 客户端频率限制实现

```javascript
// js/services/rateLimit.js

class RateLimiter {
  constructor(maxRequests, windowMs) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.requests = [];
  }

  canProceed() {
    const now = Date.now();
    // 清理过期记录
    this.requests = this.requests.filter(t => now - t < this.windowMs);
    return this.requests.length < this.maxRequests;
  }

  record() {
    this.requests.push(Date.now());
  }

  getRemaining() {
    const now = Date.now();
    this.requests = this.requests.filter(t => now - t < this.windowMs);
    return Math.max(0, this.maxRequests - this.requests.length);
  }
}

// 针对每个操作单独的限流器
const RATE_LIMITS = {
  work:    new RateLimiter(10, 60_000),   // 每分钟最多 10 次打工
  business: new RateLimiter(10, 600_000), // 每 10 分钟最多 10 次做生意
  oil:     new RateLimiter(5, 3_600_000), // 每小时最多 5 次投资
  general: new RateLimiter(30, 60_000)    // 通用限制
};

async function safeDoWork() {
  if (!RATE_LIMITS.work.canProceed()) {
    showToast('Too many requests. Please wait.');
    return;
  }
  RATE_LIMITS.work.record();

  try {
    const result = await doWork(uid);
    // ...
  } catch (err) {
    // 失败时回退限流记录
    RATE_LIMITS.work.requests.pop();
  }
}
```

### 4.2 Firestore 频率限制（Security Rules 层面）

```javascript
// 在 firestore.rules 中添加速率检查
// 注意：Firestore Security Rules 不直接支持计数，
// 所以这部分主要靠客户端限流 + 服务端 Cloud Functions
// 此处展示概念（实际需要 Cloud Functions 实现）

function isWithinWriteLimit(userId) {
  // 获取用户过去 1 分钟的写入次数
  let recentWrites = getRecentWriteCount(userId, 60_000);
  return recentWrites < 10;
}
```

### 4.3 Cloud Functions 频率限制（Cloud Functions 层）

```javascript
// functions/src/index.js
const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

const RATE_LIMIT_WINDOW = 60_000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 30;

const writeCounts = new Map();

exports.secureEarnMoney = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Not logged in');
  }

  const uid = context.auth.uid;
  const now = Date.now();

  // Rate limiting
  if (!writeCounts.has(uid)) {
    writeCounts.set(uid, []);
  }

  const timestamps = writeCounts.get(uid).filter(t => now - t < RATE_LIMIT_WINDOW);

  if (timestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    throw new functions.https.HttpsError(
      'resource-exhausted',
      'Rate limit exceeded. Please try again later.'
    );
  }

  timestamps.push(now);
  writeCounts.set(uid, timestamps);

  // Process earn money...
  return { success: true, earned: 1000 };
});
```

---

## 5. 排行榜作弊检测

### 5.1 作弊检测思路

**核心原则：排行榜数据只能由服务端（Cloud Functions）更新。**

```
客户端 → Firestore → Cloud Functions → Leaderboard 更新
                 ↑
         Security Rules: allow write: if false;
```

### 5.2 Cloud Functions 自动更新排行榜

```javascript
// functions/src/leaderboard.js
const functions = require('firebase-functions');
const admin = require('firebase-admin');

const db = admin.firestore();

// 当用户财富变化时，自动更新排行榜
exports.updateLeaderboardOnWealthChange = functions.firestore
  .document('users/{userId}')
  .onWrite(async (change, context) => {
    const userId = context.params.userId;
    const before = change.before.exists ? change.before.data() : null;
    const after = change.after.exists ? change.after.data() : null;

    if (!after) return; // 用户删除，忽略

    const userProfile = {
      uid: userId,
      nickname: after.profile?.nickname || 'Unknown',
      avatar: after.profile?.avatar || 'default_avatar',
      level: calculateLevel(after.wealth?.totalWealth || 0)
    };

    const batch = db.batch();

    // 更新总资产榜
    const totalWealthRef = db.collection('leaderboard').doc('global_totalWealth');
    batch.update(totalWealthRef, {
      rankings: admin.firestore.FieldValue.arrayUnion({
        ...userProfile,
        value: after.wealth?.totalWealth || 0
      })
    });

    // 更新豪车榜
    const carValueRef = db.collection('leaderboard').doc('global_carValue');
    batch.update(carValueRef, {
      rankings: admin.firestore.FieldValue.arrayUnion({
        ...userProfile,
        value: after.wealth?.totalCarValue || 0
      })
    });

    // ... 其他榜单类似

    await batch.commit();
  });
```

### 5.3 异常检测：财富增长速度异常

```javascript
// Cloud Functions: 每日检测财富增长异常
exports.detectWealthAnomaly = functions.pubsub
  .schedule('every 24 hours')
  .onRun(async () => {
    const users = await db.collection('users').get();

    for (const userDoc of users.docs) {
      const user = userDoc.data();
      const stats = user.stats || {};

      // 如果日均收入超过等级上限的 200%，标记为可疑
      const level = calculateLevel(user.wealth?.totalWealth || 0);
      const dailyLimit = DAILY_LIMITS[level] || 1_000_000;
      const estimatedDaily = stats.totalEarned / 30; // 简化估算

      if (estimatedDaily > dailyLimit * 2) {
        await db.collection('auditLogs').add({
          uid: userDoc.id,
          type: 'wealth_anomaly',
          message: `Suspected cheating: daily earning ${estimatedDaily} exceeds limit ${dailyLimit}`,
          timestamp: admin.firestore.FieldValue.serverTimestamp()
        });
      }
    }
  });
```

---

## 6. CSP（Content Security Policy）配置

### 6.1 完整 CSP 配置

在 `index.html` 中添加：

```html
<meta http-equiv="Content-Security-Policy"
  content="
    default-src 'self';
    script-src
      'self'
      'unsafe-inline'
      https://unpkg.com
      https://www.gstatic.com;
    style-src
      'self'
      'unsafe-inline';
    img-src
      'self'
      data:
      https:;
    font-src 'self';
    connect-src
      'self'
      https://*.firebaseio.com
      https://*.googleapis.com
      https://firestore.googleapis.com;
    frame-src 'none';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
  ">
```

### 6.2 CSP 说明

| Directive | 值 | 说明 |
|-----------|-----|------|
| `default-src` | `'self'` | 默认只允许同源 |
| `script-src` | 允许 unpkg（Vue CDN）和 Firebase | 必要的 CDN 白名单 |
| `style-src` | `'unsafe-inline'` | MVP 阶段简化（可优化） |
| `img-src` | `data:` + `https:` | 允许 emoji 和外部图片 |
| `connect-src` | Firebase 相关域名 | 只允许连接 Firebase |
| `frame-src` | `'none'` | 禁止 iframe |

### 6.3 防范 XSS（昵称过滤）

```javascript
function sanitizeNickname(nickname) {
  // 移除所有 HTML 标签和特殊字符
  return nickname
    .replace(/<[^>]*>/g, '')  // 移除 HTML 标签
    .replace(/[<>'"&]/g, '')   // 移除危险字符
    .trim()
    .substring(0, 20);          // 限制长度
}

// Firestore Security Rules 中也会验证
// nickname.matches('^[a-zA-Z0-9_]+$')
```

---

## 7. Firebase 安全最佳实践

### 7.1 不要做的 5 件事

| ❌ 不要做 | ✅ 正确做法 |
|---------|------------|
| 在代码中硬编码数据库密码 | 使用 Firebase Auth |
| 把 Admin SDK 密钥放在前端 | Firebase 不需要后端密钥（前端 SDK 足够） |
| 设置 `allow read, write: if true` | 设置精确的读写规则 |
| 允许跨域请求到未知域名 | 配置 CSP |
| 在客户端存储敏感数据 | 只存 Firestore |

### 7.2 推荐的安全检查清单

- [ ] Firestore Rules 已配置，禁止客户端直接写排行榜
- [ ] 昵称输入经过正则校验（`^[a-zA-Z0-9_]+$`）
- [ ] CSP meta 标签已添加
- [ ] 所有 Firestore 写入经过限流
- [ ] 客户端不存储金币/财富等关键数据
- [ ] Service Worker 已注册（防止 CDN 被劫持）
- [ ] GitHub Actions 的 Firebase Token 已作为 Secret 存储
- [ ] 无 `console.log` 包含敏感信息
- [ ] Google API Keys 已限制引用网站（Google Cloud Console → Credentials）
