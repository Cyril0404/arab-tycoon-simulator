# 数据库设计文档（Database Design）

> **项目**: Arab Tycoon Simulator
> **版本**: v1.0
> **最后更新**: 2026-03-29
> **数据库**: Firebase Firestore

---

## 1. Firestore 数据模型总览

### 1.1 Collections 和 Documents 结构

```
Firestore Root
│
├── users/                          (Collection: 用户数据)
│     └── {uid}/                    (Document: 单个用户)
│           ├── profile             (Object: 用户资料)
│           ├── wealth              (Object: 财富数据)
│           ├── inventory           (Array: 背包物品)
│           ├── cooldowns           (Object: 冷却时间)
│           ├── achievements         (Array: 成就列表)
│           └── settings            (Object: 用户设置)
│
├── leaderboard/                    (Collection: 排行榜)
│     └── global_totalWealth/       (Document: 总资产排行)
│     └── global_carValue/           (Document: 豪车排行)
│     └── global_propertyValue/     (Document: 豪宅排行)
│     └── global_petValue/          (Document: 宠物排行)
│     └── global_luxuryValue/       (Document: 奢侈品排行)
│
├── friends/                        (CollectionGroup: 好友关系)
│     └── {uid}/                    (Document: 用户的好友索引)
│           └── list/               (Subcollection: 好友列表)
│                 └── {friendUid}/  (Document: 单个好友关系)
│
├── items/                          (Collection: 商品定义)
│     └── {itemId}/                 (Document: 单个商品)
│
├── transactions/                   (Collection: 交易历史)
│     └── {transactionId}/          (Document: 单笔交易)
│
└── gifts/                          (Collection: 礼物记录)
      └── {giftId}/                (Document: 单个礼物)
```

---

## 2. Users Collection（用户数据）

### 2.1 Document Path

```
users/{uid}
```

### 2.2 Fields 详细说明

| 字段路径 | 类型 | 必填 | 说明 |
|----------|------|------|------|
| `profile.nickname` | string | ✅ | 昵称（4-20字符，不含特殊字符） |
| `profile.avatar` | string | ✅ | 头像 URL，默认 `default_avatar` |
| `profile.createdAt` | timestamp | ✅ | 注册时间 |
| `profile.lastLoginAt` | timestamp | ✅ | 最后登录时间 |
| `wealth.cash` | number | ✅ | 当前现金（AED），默认 1000 |
| `wealth.totalWealth` | number | ✅ | 总资产 = 现金 + 装备价值 |
| `wealth.totalCarValue` | number | ✅ | 豪车总价值 |
| `wealth.totalPropertyValue` | number | ✅ | 豪宅总价值 |
| `wealth.totalPetValue` | number | ✅ | 宠物总价值 |
| `wealth.totalLuxuryValue` | number | ✅ | 奢侈品总价值 |
| `inventory[]` | array | ✅ | 已购装备列表（见下方结构） |
| `inventory[].itemId` | string | ✅ | 商品 ID |
| `inventory[].count` | number | ✅ | 购买数量（默认 1） |
| `inventory[].boughtAt` | timestamp | ✅ | 购买时间 |
| `inventory[].displayed` | boolean | ✅ | 是否展示中（默认 false） |
| `cooldowns.work` | timestamp | ✅ | 打工冷却截止时间 |
| `cooldowns.business` | timestamp | ✅ | 做生意冷却截止时间 |
| `cooldowns.oil` | timestamp | ✅ | 石油投资冷却截止时间 |
| `achievements[]` | array | ✅ | 已解锁成就 ID 列表 |
| `settings.displayWealth` | boolean | ✅ | 是否公开财富（默认 true） |
| `settings.notifications` | boolean | ✅ | 是否接收通知（默认 true） |
| `title.tempTitle` | string | ✅ | 临时称号（如"小土豪"） |
| `title.tempTitleExpiresAt` | timestamp | ✅ | 临时称号过期时间 |
| `stats.totalEarned` | number | ✅ | 历史累计收入（AED） |
| `stats.totalSpent` | number | ✅ | 历史累计支出（AED） |
| `stats.pkWins` | number | ✅ | PK 胜利次数 |
| `stats.pkLosses` | number | ✅ | PK 失败次数 |
| `stats.giftsSent` | number | ✅ | 已送出礼物数 |
| `stats.friendsCount` | number | ✅ | 好友数量 |

### 2.3 示例数据

```json
{
  "uid": "abc123xyz",
  "profile": {
    "nickname": "DubaiKing",
    "avatar": "avatar_03",
    "createdAt": "2026-03-28T08:00:00Z",
    "lastLoginAt": "2026-03-29T10:00:00Z"
  },
  "wealth": {
    "cash": 5_000_000,
    "totalWealth": 8_500_000,
    "totalCarValue": 3_000_000,
    "totalPropertyValue": 0,
    "totalPetValue": 500_000,
    "totalLuxuryValue": 0
  },
  "inventory": [
    {
      "itemId": "car_002",
      "count": 1,
      "boughtAt": "2026-03-28T09:00:00Z",
      "displayed": true
    },
    {
      "itemId": "pet_001",
      "count": 1,
      "boughtAt": "2026-03-28T10:00:00Z",
      "displayed": false
    }
  ],
  "cooldowns": {
    "work": "2026-03-29T10:01:00Z",
    "business": "2026-03-29T10:00:00Z",
    "oil": "2026-03-29T09:00:00Z"
  },
  "achievements": ["first_million", "first_car"],
  "settings": {
    "displayWealth": true,
    "notifications": true
  },
  "title": {
    "tempTitle": "小土豪",
    "tempTitleExpiresAt": "2026-03-30T10:00:00Z"
  },
  "stats": {
    "totalEarned": 10_000_000,
    "totalSpent": 5_000_000,
    "pkWins": 3,
    "pkLosses": 1,
    "giftsSent": 5,
    "friendsCount": 20
  }
}
```

---

## 3. Leaderboard Collection（排行榜）

### 3.1 Document Path

```
leaderboard/global_totalWealth
leaderboard/global_carValue
leaderboard/global_propertyValue
leaderboard/global_petValue
leaderboard/global_luxuryValue
```

### 3.2 Fields 详细说明

| 字段路径 | 类型 | 说明 |
|----------|------|------|
| `updatedAt` | timestamp | 最后更新时间 |
| `rankings[]` | array | 排名前 100 的用户数组 |

**rankings 数组结构：**

| 字段 | 类型 | 说明 |
|------|------|------|
| `rankings[].uid` | string | 用户 ID |
| `rankings[].nickname` | string | 用户昵称 |
| `rankings[].avatar` | string | 头像 ID |
| `rankings[].value` | number | 对应指标数值 |
| `rankings[].level` | number | 身份等级 |

### 3.3 示例数据

```json
{
  "updatedAt": "2026-03-29T10:00:00Z",
  "rankings": [
    { "uid": "user_001", "nickname": "OilPrince", "avatar": "avatar_01", "value": 15_000_000_000, "level": 5 },
    { "uid": "user_002", "nickname": "DubaiKing", "avatar": "avatar_03", "value": 500_000_000, "level": 4 },
    { "uid": "user_003", "nickname": "SandTycoon", "avatar": "avatar_05", "value": 200_000_000, "level": 4 }
  ]
}
```

### 3.4 排行榜更新策略

**为什么用预计算排行榜？**
- 避免每次查询都 scan 所有 users collection
- Firestore 查询效率：预计算 O(1)，实时计算 O(N)
- 更新频率：用户操作时触发增量更新（非实时全量重算）

**更新触发时机：**
- 用户购买装备时
- 用户赚钱时（每小时更新一次总榜，防止频繁写入）

---

## 4. Friends Collection（好友关系）

### 4.1 Document Path

```
friends/{uid}          (用户的好友索引文档)
friends/{uid}/list/{friendUid}  (单条好友关系)
```

### 4.2 Fields 详细说明

**friends/{uid} 文档：**

| 字段 | 类型 | 说明 |
|------|------|------|
| `updatedAt` | timestamp | 最后更新时间 |

**friends/{uid}/list/{friendUid} 文档：**

| 字段 | 类型 | 说明 |
|------|------|------|
| `addedAt` | timestamp | 添加时间 |
| `status` | string | `active`（正常）\| `blocked`（拉黑） |
| `nickname` | string | 好友昵称（冗余存储，加速显示） |
| `avatar` | string | 好友头像（冗余存储） |
| `level` | number | 好友等级（冗余存储） |
| `totalWealth` | number | 好友总资产（冗余存储） |

### 4.3 示例数据

```json
{
  "addedAt": "2026-03-28T08:00:00Z",
  "status": "active",
  "nickname": "SandTycoon",
  "avatar": "avatar_05",
  "level": 4,
  "totalWealth": 200_000_000
}
```

---

## 5. Items Collection（商品定义）

### 5.1 Document Path

```
items/{itemId}
```

### 5.2 Fields 详细说明

| 字段 | 类型 | 说明 |
|------|------|------|
| `itemId` | string | 商品 ID（如 `car_001`） |
| `name` | string | 商品名称 |
| `category` | string | 分类：`car`\|`property`\|`pet`\|`luxury` |
| `subCategory` | string | 子分类（便于筛选） |
| `price` | number | 价格（AED） |
| `currentValue` | number | 当前市场价值（AED，通常与 price 相同） |
| `description` | string | 商品描述 |
| `icon` | string | 图标 emoji 或 SVG ID |
| `iconUrl` | string | 图标图片 URL（WebP格式） |
| `thumbnailUrl` | string | 缩略图 URL |
| `unlockLevel` | number | 解锁所需等级（1-5） |
| `rarity` | string | `common`\|`rare`\|`epic`\|`legendary` |
| `maxCount` | number | 最大持有数量（-1 表示无限制） |
| `annualDepreciation` | number | 年贬值率（奢侈品 5%，其他 0%） |
| `displayOrder` | number | 商店内排序 |

### 5.3 示例数据

```json
{
  "itemId": "car_004",
  "name": "Bugatti Chiron",
  "category": "car",
  "subCategory": "super_car",
  "price": 15_000_000,
  "currentValue": 15_000_000,
  "description": "全球限量，迪拜土豪标配",
  "icon": "🚗",
  "iconUrl": "https://cdn.arabtycoon.com/icons/car_004.webp",
  "thumbnailUrl": "https://cdn.arabtycoon.com/thumbs/car_004.webp",
  "unlockLevel": 3,
  "rarity": "epic",
  "maxCount": 1,
  "annualDepreciation": 0,
  "displayOrder": 4
}
```

---

## 6. Transactions Collection（交易历史）

### 6.1 Document Path

```
transactions/{transactionId}
```

### 6.2 Fields 详细说明

| 字段 | 类型 | 说明 |
|------|------|------|
| `transactionId` | string | 交易 ID（UUID） |
| `uid` | string | 用户 ID |
| `type` | string | `earn`\|`spend`\|`gift_sent`\|`gift_received`\|`refund` |
| `amount` | number | 金额（正数=收入，负数=支出） |
| `itemId` | string | 商品 ID（购买/退款时有值） |
| `description` | string | 交易描述 |
| `timestamp` | timestamp | 交易时间 |
| `relatedUid` | string | 关联用户（送礼/收礼时） |

### 6.3 示例数据

```json
{
  "transactionId": "txn_abc123",
  "uid": "user_001",
  "type": "spend",
  "amount": -15_000_000,
  "itemId": "car_004",
  "description": "购买 Bugatti Chiron",
  "timestamp": "2026-03-28T12:00:00Z",
  "relatedUid": null
}
```

---

## 7. Gifts Collection（礼物记录）

### 7.1 Document Path

```
gifts/{giftId}
```

### 7.2 Fields 详细说明

| 字段 | 类型 | 说明 |
|------|------|------|
| `giftId` | string | 礼物记录 ID |
| `fromUid` | string | 送礼者 UID |
| `toUid` | string | 收礼者 UID |
| `itemId` | string | 礼物对应的商品 ID |
| `message` | string | 祝福语（可选，最多 50 字） |
| `sentAt` | timestamp | 发送时间 |
| `status` | string | `pending`\|`delivered`\|`read` |

---

## 8. 索引设计（Composite Indexes）

### 8.1 必须创建的索引

在 Firebase Console → Firestore → Indexes 添加以下组合索引：

| 索引名称 | Collection | 字段 |
|----------|-----------|------|
| `leaderboard_totalWealth` | leaderboard | `global_totalWealth`（不需要复合，Firestore 单字段索引即可） |
| `friends_by_uid` | friends | uid ASC |
| `transactions_by_uid_time` | transactions | uid ASC, timestamp DESC |
| `gifts_by_toUid` | gifts | toUid ASC, sentAt DESC |
| `gifts_by_fromUid` | gifts | fromUid ASC, sentAt DESC |

**Firestore 单字段索引（默认已开启）：**
- `users.totalWealth ASC`
- `users.totalCarValue ASC`
- `users.totalPropertyValue ASC`
- `users.totalPetValue ASC`
- `transactions.uid ASC`
- `transactions.timestamp DESC`

### 8.2 索引配置（firestore.indexes.json）

```json
{
  "indexes": [
    {
      "collectionGroup": "transactions",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "uid", "order": "ASCENDING" },
        { "fieldPath": "timestamp", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "gifts",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "toUid", "order": "ASCENDING" },
        { "fieldPath": "sentAt", "order": "DESCENDING" }
      ]
    }
  ]
}
```

---

## 9. Firebase Security Rules

### 9.1 完整 Security Rules 代码

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // ==========================================
    // Helper Functions
    // ==========================================
    function isAuthenticated() {
      return request.auth != null;
    }

    function isCurrentUser(userId) {
      return request.auth.uid == userId;
    }

    function getUserData(userId) {
      return get(/databases/$(database)/documents/users/$(userId));
    }

    function isCooldownReady(userId, action) {
      // 检查冷却时间是否已过
      let userDoc = getUserData(userId);
      let cooldownMap = userDoc.data.cooldowns;
      let lastUsed = cooldownMap[action];
      if (lastUsed == null) return true;
      // Firebase timestamp vs request.time
      return request.time > lastUsed;
    }

    // ==========================================
    // Users Collection
    // ==========================================
    match /users/{userId} {
      // 任何人都可以读取用户公开信息（昵称、财富、等级）
      allow read: if isAuthenticated();

      // 只有本人可以写入自己的数据
      allow write: if isCurrentUser(userId)
        // 额外验证：防止刷钱
        && validateWealthUpdate(userId, request.resource.data);

      // 财富更新验证函数
      function validateWealthUpdate(userId, data) {
        let currentData = getUserData(userId).data;
        let currentCash = currentData.wealth.cash;
        let currentTotal = currentData.wealth.totalWealth;
        let newCash = data.wealth.cash;
        let newTotal = data.wealth.totalWealth;

        // 现金变化不能超过单次最大收入/支出的 5 倍
        // 打工最大 1000 * 5 = 5000
        // 做生意最大 10000 * 5 = 50000
        // 投资石油最大 1000000 * 5 = 5000000
        let maxChange = 5000000;
        return abs(newCash - currentCash) <= maxChange
          && abs(newTotal - currentTotal) <= maxChange;
      }
    }

    // ==========================================
    // Leaderboard Collection
    // ==========================================
    match /leaderboard/{docId} {
      // 任何人可读排行榜
      allow read: if isAuthenticated();

      // 只有系统（Cloud Functions）可以写入排行榜
      // MVP阶段：禁止客户端直接写排行榜
      allow write: if false;
    }

    // ==========================================
    // Friends Collection
    // ==========================================
    match /friends/{userId}/{document=**} {
      // 本人可读写好友列表
      allow read, write: if isCurrentUser(userId);
    }

    // ==========================================
    // Items Collection（只读，商品定义不可改）
    // ==========================================
    match /items/{itemId} {
      allow read: if isAuthenticated();
      allow write: if false; // 仅管理员可写（通过 Firebase Console）
    }

    // ==========================================
    // Transactions Collection
    // ==========================================
    match /transactions/{transactionId} {
      // 本人可读写自己的交易记录
      allow read, create: if isAuthenticated()
        && request.resource.data.uid == request.auth.uid;

      allow update, delete: if false; // 交易不可修改和删除
    }

    // ==========================================
    // Gifts Collection
    // ==========================================
    match /gifts/{giftId} {
      // 送礼者和收礼者可读取
      allow read: if isAuthenticated()
        && (request.auth.uid == resource.data.fromUid
            || request.auth.uid == resource.data.toUid);

      // 送礼者可创建礼物记录
      allow create: if isAuthenticated()
        && request.resource.data.fromUid == request.auth.uid;

      allow update, delete: if false;
    }
  }
}
```

### 9.2 安全规则关键设计说明

| 设计决策 | 理由 |
|----------|------|
| `allow write: if false`（排行榜） | 排行榜必须由服务端（Cloud Functions）更新，防止客户端伪造排名 |
| 客户端不能直接修改 `cooldowns` | 防止绕过冷却时间作弊 |
| 财富更新幅度限制 | 单次变化不超过 5,000,000 AED |
| 交易不可删除 | 审计追踪，防止洗钱类作弊 |
| 好友列表仅本人可读写 | 隐私保护 |

---

## 10. 数据迁移与备份

### 10.1 数据导出

```bash
# 使用 Firebase CLI 导出数据
firebase firestore:export ./firestore-backup

# 导出为 JSON（需要 Cloud Functions 辅助）
# 参考：https://firebase.google.com/docs/firestore/manage-data/export-import
```

### 10.2 备份策略

| 备份类型 | 频率 | 保留时间 |
|----------|------|----------|
| Firestore 自动备份 | 每日 | 7 天 |
| 手动导出 | 每周 | 永久 |
| GitHub Actions 定时触发 | 每周 | 30 天 |

### 10.3 Firestore 定价与配额监控

**免费套餐限制（Spark）：**
- 每天 50,000 次读取
- 每天 20,000 次写入
- 每天 20,000 次删除
- 1 GB 存储

**MVP 阶段预估消耗：**
- 1000 DAU，每天操作 20 次 = 20,000 读取
- 基本在免费额度内
