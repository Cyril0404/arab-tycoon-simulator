# 游戏数据设计文档

> **项目**: Arab Tycoon Simulator
> **版本**: v2.0（代码同步版）
> **最后更新**: 2026-03-30

---

## 1. 商品数据（Items）

### 1.1 完整商品列表

所有商品数据存储于 Firestore `items/` collection。

#### 1.1.1 豪车类（Cars）

| itemId | 名称 | 价格 (AED) | 图标 | 描述 | 解锁等级 | 稀有度 | 最大持有 |
|--------|------|-----------|------|------|----------|--------|----------|
| `car_001` | Toyota Camry | 200,000 | 🚗 | 经济实惠，迪拜通勤首选 | 1 | common | -1 |
| `car_002` | Mercedes S-Class | 1,000,000 | 🚙 | 德系豪华，商务首选 | 2 | rare | -1 |
| `car_003` | Rolls-Royce Cullinan | 10,000,000 | 🚗 | 奢华英伦风格，迪拜街头常客 | 3 | epic | -1 |
| `car_004` | Ferrari SF90 | 15,000,000 | 🏎️ | 跃马旗舰，0-100km/h 仅 2.5 秒 | 3 | epic | -1 |
| `car_005` | Lamborghini Revuelto | 18,000,000 | 🏎️ | 混动蛮牛，沙漠中的烈焰 | 4 | legendary | 1 |
| `car_006` | Bentley Mulsanne | 8,000,000 | 🚗 | 英式优雅，低调奢华 | 3 | epic | -1 |
| `car_007` | McLaren P1 | 20,000,000 | 🏎️ | 混动超跑，科技感十足 | 4 | legendary | 1 |
| `car_008` | Bugatti Chiron | 80,000,000 | 🚗 | 全球限量，迪拜土豪标配 | 5 | mythical | 1 |
| `car_009` | Gulfstream G650 | 1,000,000,000 | ✈️ | 洲际飞行，空中宫殿 | 5 | mythical | 1 |
| `car_010` | Luxury Yacht | 800,000,000 | 🚢 | 海上别墅，派对神器 | 5 | mythical | 1 |

#### 1.1.2 豪宅类（Properties）

| itemId | 名称 | 价格 (AED) | 图标 | 描述 | 解锁等级 | 稀有度 | 最大持有 |
|--------|------|-----------|------|------|----------|--------|----------|
| `prop_001` | Dubai Apartment | 5,000,000 | 🏠 | 迪拜市中心的现代公寓 | 2 | common | -1 |
| `prop_002` | Palm Villa | 200,000,000 | 🏘️ | 棕榈岛上的人工岛屿别墅 | 4 | legendary | 1 |
| `prop_003` | Abu Dhabi Palace | 1,000,000,000 | 🏰 | 皇宫级奢华，国王般享受 | 5 | mythical | 1 |

#### 1.1.3 宠物类（Pets）

| itemId | 名称 | 价格 (AED) | 图标 | 描述 | 解锁等级 | 稀有度 | 最大持有 |
|--------|------|-----------|------|------|----------|--------|----------|
| `pet_001` | Falcon | 2,000,000 | 🦅 | 沙漠猎鹰，阿联酋国鸟 | 3 | rare | -1 |
| `pet_002` | Arabian Horse | 5,000,000 | 🐎 | 纯种阿拉伯马，皇室血统 | 3 | epic | -1 |
| `pet_003` | Lion | 20,000,000 | 🦁 | 迪拜土豪标配宠物，回头率 100% | 4 | legendary | 1 |
| `pet_004` | White Tiger | 50,000,000 | 🐯 | 稀有白虎，霸气十足 | 5 | mythical | 1 |

#### 1.1.4 奢侈品类（Luxury Items）

| itemId | 名称 | 价格 (AED) | 图标 | 描述 | 解锁等级 | 稀有度 | 最大持有 |
|--------|------|-----------|------|------|----------|--------|----------|
| `lux_001` | Patek Philippe Nautilus | 2,000,000 | ⌚ | 瑞士名表，永恒经典 | 2 | rare | -1 |
| `lux_002` | Hermès Birkin | 1,500,000 | 👜 | 包包中的皇后 | 2 | rare | -1 |
| `lux_003` | Limited Edition AJ | 100,000 | 👟 | 球鞋天花板，收藏价值极高 | 1 | common | -1 |
| `lux_004` | Gold Diamond iPhone | 500,000 | 📱 | 纯金机身，钻石按键 | 1 | epic | -1 |

#### 1.1.5 礼物类（Gifts）

礼物不可直接购买，通过送礼系统使用：

| itemId | 对应商品 | 礼物名称 | 价值 (AED) |
|--------|---------|---------|-----------|
| `gift_watch` | `lux_001` | Patek Philippe Watch | 50,000 |
| `gift_car` | `car_002` | Ferrari Sports Car | 500,000 |
| `gift_villa` | `prop_002` | Palm Island Villa | 5,000,000 |

---

## 2. 赚钱行为详细参数（v2.0打工系统）

> ⚠️ 代码实现了6种工作类型，按资产规模解锁。经济核心原则：**打工为温饱积蓄，资产带来身份，身份解锁更高的赚钱效率**。

### 2.1 六种工作类型（WORK_TYPES_V2）

| 工作ID | 名称 | 英文名 | 解锁门槛 | 基础收益 | 冷却时间 | 说明 |
|--------|------|--------|---------|----------|----------|------|
| `carpet` | 地毯店 | Carpet Shop | 0 | +50 AED | 60 秒 | 新手起步 |
| `guide` | 沙漠导游 | Desert Guide | 100,000 | +200 AED | 60 秒 | 小老板专属 |
| `oil_sales` | 石油销售 | Oil Sales | 1,000,000 | +1,000 AED | 60 秒 | 财富增长期 |
| `realestate` | 房产中介 | Real Estate | 10,000,000 | +10,000 AED | 60 秒 | 富商阶段 |
| `trade` | 国际贸易 | Intl Trade | 100,000,000 | +100,000 AED | 60 秒 | 超级富豪 |
| `advisor` | 投资顾问 | Invest Advisor | 1,000,000,000 | +1,000,000 AED | 60 秒 | 中东首富 |

### 2.2 打工等级系统

| 打工等级 | 累计打工次数 | 收益倍率 | 解锁内容 |
|---------|------------|---------|---------|
| Lv.1 | 0 | ×1.0 | 初始 |
| Lv.2 | 50次 | ×1.2 | 打工有概率获得双倍AED |
| Lv.3 | 200次 | ×1.5 | 打工CD减少20% |
| Lv.4 | 500次 | ×2.0 | 解锁「精英打工」 |
| Lv.5 | 1000次 | ×2.5 | 打工CD减少50% |
| Lv.MAX | 5000次 | ×5.0 | 所有打工永久无CD |

### 2.3 Combo连击系统

- 打工3次（每次在CD内完成）→ 触发 Combo ×1.5
- 打工10次（每次在CD内完成）→ 触发 Combo ×2 + 解锁「加班模式」

### 2.4 人脉Buff系统（15%概率触发）

| 人脉ID | 人脉名称 | 触发概率 | 效果 | 持续时间 |
|--------|---------|---------|------|---------|
| `contact_merchant` | 本地商人 | 4% | 做生意收益 +20% | 3次 |
| `contact_oil` | 石油大亨 | 2% | 石油投资成功率 +10% | 永久（可叠加3次）|
| `contact_official` | 政府官员 | 2% | 所有商品价格 9折 | 1次购买 |
| `contact_influencer` | 网红博主 | 3% | 分享奖励 AED 翻倍 | 1次分享 |
| `contact_friend` | 明星朋友 | 2% | 好友互动经验 +50% | 3次好友互动 |
| `contact_mystery` | 神秘商人 | 2% | 随机获得 1,000~100,000 AED | 即时 |

### 2.5 石油投资系统

| 行为ID | 名称 | 成功收益 | 失败损失 | 成功概率 | 冷却时间 |
|--------|------|---------|---------|----------|----------|
| `oil` | 投资石油 | +100,000 AED | -50,000 AED | 50% | 7200秒（2小时） |

**注**：石油特权Buff（阿布扎比地块）可将成功率提升至70%。

### 2.6 被动收入（收租）新模型

> **重要变更**：旧版"每日收租"导致有钱玩家越来越快。新版改为**里程碑达成奖励**，让地块购买更有意义但不产生通货膨胀。

**收租（Passive Income）= 里程碑达成奖励，非日常现金产出：**

| 持有资产规模 | 每日自动触发 | 奖励 | 说明 |
|-------------|------------|------|------|
| 持有任意D级地块 | ✅ | +500 AED/天 | 小地主福利 |
| 持有任意C级地块 | ✅ | +2,000 AED/天 | 中产地主 |
| 持有任意B级地块 | ✅ | +10,000 AED/天 | 城市投资者 |
| 持有任意A级地块 | ✅ | +50,000 AED/天 | 核心地主 |
| 持有任意S级/★级地块 | ✅ | +500,000 AED/天 | 土豪象征 |
| 集齐任意城市所有地块 | ✅ | +1,000,000 AED/天 | 城市垄断者 |

**收租上限：** 每日所有收租合计最高 2,000,000 AED（防止通货膨胀）
**收租计算：** 持有多个同类地块时，按件数×单件奖励

### 2.3 每日收益上限（每日重置）

| 玩家身份等级 | 每日主动收入上限（AED）| 每日被动收租上限 | 说明 |
|-------------|---------------------|-----------------|------|
| 1 平民 | 50,000 | 50,000 | 新手保护 |
| 2 小老板 | 200,000 | 200,000 | 小康阶段 |
| 3 富商 | 2,000,000 | 1,000,000 | 中产阶段 |
| 4 超级富豪 | 20,000,000 | 5,000,000 | 富裕阶段 |
| 5 中东首富 | 无上限 | 2,000,000 | 顶级无限制 |

### 2.4 赚钱参数配置

```javascript
const EARN_ACTIONS = {
  work: {
    name: 'Work',
    nameAr: 'العمل',
    earnings: 50,
    cooldownSeconds: 60,
    icon: '💼',
    description: 'Basic freelance work'
  },
  business: {
    name: 'Run Business',
    nameAr: 'إدارة الأعمال',
    earnings: 300,
    cooldownSeconds: 300,
    icon: '🏢',
    description: 'Manage your small business'
  },
  invest: {
    name: 'City Investment',
    nameAr: 'استثمار المدينة',
    earnings: 2000,
    cooldownSeconds: 60,
    icon: '🏙️',
    description: 'Requires owning any city plot',
    unlockCondition: { type: 'plot', tier: 'any' }
  },
  oil: {
    name: 'Invest in Oil',
    nameAr: 'استثمار النفط',
    earnings: { success: 100_000, failure: -50_000 },
    successRate: 0.5,
    cooldownSeconds: 7200,
    icon: '🛢️',
    description: 'High risk, high reward!'
  }
};
```

### 2.5 投资石油算法

```javascript
function calculateOilInvestment(userCityBuff) {
  // 城市BUFF提升成功率（阿布扎比石油特权）
  const successRate = userCityBuff.includes('abu_dhabi') ? 0.7 : 0.5;
  const roll = Math.random();
  if (roll < successRate) {
    return {
      success: true,
      earnings: 100_000,
      message: 'Oil prices surged! You earned 100,000 AED!'
    };
  } else {
    return {
      success: false,
      earnings: -50_000,
      message: 'Oil prices crashed. You lost 50,000 AED.'
    };
  }
}
```

### 2.6 里程碑达成奖励（新系统）

> 替代旧版"收租"，新版里程碑奖励让积累更有目标感。

| 里程碑 | 条件 | 一次性奖励 | 永久BUFF |
|--------|------|----------|---------|
| 第一桶金 | 总资产首次≥100,000 AED | 50,000 AED | 解锁做生意 |
| 百万富翁 | 总资产首次≥1,000,000 AED | 100,000 AED | 打工收益+20% |
| 房产入门 | 购买第1块地块 | 20,000 AED | 解锁城市投资 |
| 千万富翁 | 总资产首次≥10,000,000 AED | 500,000 AED | 所有收益+15% |
| 房产大亨 | 持有5块以上地块 | 1,000,000 AED | 收租+30% |
| 亿万富翁 | 总资产首次≥100,000,000 AED | 5,000,000 AED | 所有收益+30% |
| 全迪拜 | 集齐迪拜全部8块地块 | 50,000,000 AED + 称号 | 迪拜地块收租×3 |
| 中东首富 | 总资产≥100,000,000,000 AED | 无（终极目标）| 全服广播 + 名人堂 |

---

## 3. 身份等级详细定义

### 3.1 等级数据表（代码同步版）

| 等级 | 名称（EN） | 名称（中文） | 门槛 (AED) | 称号颜色 | 解锁功能 | 解锁装备 |
|------|-----------|------------|-----------|---------|----------|----------|
| 1 | Peasant | 农民 | 0 | 灰色 `#9e9e9e` | 打工、地毯店、奢侈品 | lux_003, lux_004 |
| 2 | Small Boss | 小老板 | 1,000,000 | 铜色 `#4caf50` | 沙漠导游、Mercedes S-Class | car_001, lux_001, lux_002 |
| 3 | Rich Merchant | 富商 | 100,000,000 | 银色 `#42a5f5` | 石油销售、房产中介、豪车、豪宅 | car_002, car_003, car_006, pet_001, pet_002 |
| 4 | Tycoon | 土豪 | 1,000,000,000 | 金色 `#ab47bc` | 国际贸易、私人飞机/游艇、宠物 | car_005, car_007, pet_003, prop_002 |
| 5 | Middle East King | 中东之王 | 100,000,000,000 | 彩虹光效 `#D4AF37` | 投资顾问、顶级装备 | car_008, car_009, car_010, pet_004, prop_003 |

### 3.2 升级判定算法

```javascript
function calculateLevel(totalWealth) {
  const LEVEL_THRESHOLDS = [
    { level: 1, threshold: 0 },
    { level: 2, threshold: 1_000_000 },
    { level: 3, threshold: 100_000_000 },
    { level: 4, threshold: 1_000_000_000 },
    { level: 5, threshold: 100_000_000_000 }
  ];

  // 从高到低遍历，找到第一个满足条件的等级
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (totalWealth >= LEVEL_THRESHOLDS[i].threshold) {
      return LEVEL_THRESHOLDS[i].level;
    }
  }
  return 1;
}
```

### 3.3 等级奖励一览

| 等级 | 初始解锁称号 | 称号特效 |
|------|------------|---------|
| 1 | 无称号 | 灰色普通边框 |
| 2 | 小老板 | 铜色边框 + 小图标 |
| 3 | 富商 | 银色 + 微光 |
| 4 | 超级富豪 | 金色 + 光晕 + 粒子 |
| 5 | 中东首富 | 彩虹边框 + 皇冠 + 全屏特效 |

---

## 4. 成就系统设计

### 4.1 成就列表

| 成就ID | 名称 | 英文名 | 条件 | 奖励 | 分类 |
|--------|------|--------|------|------|------|
| `first_earn` | 初出茅庐 | First Earn | 完成第一次打工 | 0 AED | 新手 |
| `first_million` | 百万富翁 | Millionaire | 总资产达到 1,000,000 AED | 称号「Millionaire」 | 财富 |
| `first_10m` | 千万富翁 | Deca-Millionaire | 总资产达到 10,000,000 AED | 称号「Deca-Millionaire」 | 财富 |
| `first_100m` | 亿万富翁 | Centi-Millionaire | 总资产达到 100,000,000 AED | 称号「Centi-Millionaire」 | 财富 |
| `first_billion` | 十亿富翁 | Billionaire | 总资产达到 1,000,000,000 AED | 称号「Billionaire」 | 财富 |
| `first_car` | 有车一族 | Car Owner | 购买第一辆车 | +50,000 AED | 收藏 |
| `first_property` | 有房一族 | Property Owner | 购买第一套房产 | +200,000 AED | 收藏 |
| `first_pet` | 宠物达人 | Pet Lover | 购买第一只宠物 | +100,000 AED | 收藏 |
| `oil_king` | 石油大王 | Oil King | 石油投资连续成功 3 次 | +500,000 AED | 投资 |
| `oil_curse` | 石油诅咒 | Oil Curse | 石油投资连续失败 3 次 | 无（成就） | 投资 |
| `social_butterfly` | 社交达人 | Social Butterfly | 添加 10 个好友 | +100,000 AED | 社交 |
| `generous` | 慷慨大方 | Generous | 成功送礼 5 次 | +300,000 AED | 社交 |
| `pk_champion` | PK之王 | PK Champion | PK 胜利 10 次 | +500,000 AED | 社交 |
| `pk_legend` | PK传奇 | PK Legend | PK 胜利 50 次 | 称号「PK Legend」 | 社交 |
| `diamond_hands` | 钻石之手 | Diamond Hands | 持有奢侈品满 30 天不卖 | +1,000,000 AED | 收藏 |
| `all_cars` | 豪车收藏家 | Car Collector | 集齐所有豪车 | +5,000,000 AED | 收藏 |
| `all_properties` | 房产大亨 | Property Baron | 集齐所有豪宅 | +10,000,000 AED | 收藏 |

### 4.2 成就存储格式

```json
{
  "achievements": {
    "first_earn": { "unlockedAt": "2026-03-28T08:05:00Z", "rewardClaimed": true },
    "first_million": { "unlockedAt": "2026-03-28T10:00:00Z", "rewardClaimed": true },
    "first_car": { "unlockedAt": "2026-03-28T09:00:00Z", "rewardClaimed": true }
  }
}
```

### 4.3 成就检查逻辑

```javascript
function checkAchievements(userData, newEvent) {
  const checks = [
    {
      id: 'first_earn',
      condition: (u) => u.stats.totalEarned > 0,
      reward: { type: 'title', value: 'Newcomer' }
    },
    {
      id: 'first_million',
      condition: (u) => u.wealth.totalWealth >= 1_000_000,
      reward: { type: 'cash', value: 0 }
    },
    {
      id: 'first_car',
      condition: (u) => u.inventory.some(i => i.itemId.startsWith('car_')),
      reward: { type: 'cash', value: 50_000 }
    },
    {
      id: 'oil_king',
      condition: (u) => u.stats.oilWinStreak >= 3,
      reward: { type: 'cash', value: 500_000 }
    }
    // ... 更多检查
  ];

  checks.forEach(check => {
    if (!userData.achievements[check.id] && check.condition(userData)) {
      unlockAchievement(userData, check.id, check.reward);
    }
  });
}
```

---

## 5. 好友互动行为定义

### 5.1 互动行为列表

| 行为 | ID | 触发条件 | 奖励 | 描述 |
|------|-----|----------|------|------|
| 拜访好友 | `visit` | 点击好友 → 进入好友主页 | 每日首次 +100 AED | 浏览好友装备 |
| 给好友点赞 | `like` | 点赞好友装备 | 点赞方 +50 AED | 每日可点 10 次 |
| 送礼物 | `gift` | 选择礼物 → 确认发送 | 收礼方获得装备 | 送礼方扣 AED |
| PK 挑战 | `pk_challenge` | 发起挑战 → 对方接受 | 胜利方获 24h 称号 | 比较总资产 |
| 接受 PK | `pk_accept` | 收到挑战 → 点击接受 | 无 | 进入 PK 流程 |
| 拒绝 PK | `pk_reject` | 收到挑战 → 点击拒绝 | 无 | 挑战失效 |

### 5.2 送礼流程状态机

```
IDLE → SELECT_GIFT → CONFIRM → SENDING → DELIVERED
                    ↓
                CANCELLED
```

### 5.3 PK 对战详细规则

```javascript
const PK_RULES = {
  duration: 24 * 60 * 60 * 1000, // 挑战有效期：24小时
  titleDuration: 24 * 60 * 60 * 1000, // 称号持续时间：24小时
  titleName: '小土豪 / Mini Tycoon',
  drawTitleMultiplier: 2, // 平局称号时间翻倍
  maxActiveChallenges: 3 // 同时最多 3 个挑战
};

async function resolvePK(challengerUid, challengedUid) {
  const challenger = await getUser(challengerUid);
  const challenged = await getUser(challengedUid);

  if (challenger.wealth.totalWealth > challenged.wealth.totalWealth) {
    // 挑战者胜
    await grantTempTitle(challengerUid, PK_RULES.titleName, PK_RULES.titleDuration);
    await incrementStat(challengerUid, 'pkWins');
    await incrementStat(challengedUid, 'pkLosses');
    return { winner: challengerUid, loser: challengedUid };
  } else if (challenger.wealth.totalWealth < challenged.wealth.totalWealth) {
    // 防守方胜
    await grantTempTitle(challengedUid, PK_RULES.titleName, PK_RULES.titleDuration);
    await incrementStat(challengedUid, 'pkWins');
    await incrementStat(challengerUid, 'pkLosses');
    return { winner: challengedUid, loser: challengerUid };
  } else {
    // 平局：双方称号时间翻倍
    await grantTempTitle(challengerUid, PK_RULES.titleName, PK_RULES.titleDuration * 2);
    await grantTempTitle(challengedUid, PK_RULES.titleName, PK_RULES.titleDuration * 2);
    return { winner: null, loser: null, draw: true };
  }
}
```

### 5.4 每日限制

| 行为 | 每日上限 | 说明 |
|------|----------|------|
| 点赞好友 | 10 次/天 | 防止刷金币 |
| 领取拜访奖励 | 1 次/天 | 每日首次拜访好友 |
| 发起 PK | 5 次/天 | 防止骚扰 |
| 送礼 | 10 次/天 | 限制刷钱 |

---

## 6. 初始数据（New User）

### 6.1 新用户默认数据

```javascript
const DEFAULT_USER_DATA = {
  profile: {
    nickname: 'Player' + Math.floor(Math.random() * 9999),
    avatar: 'avatar_01',
    createdAt: Timestamp.now(),
    lastLoginAt: Timestamp.now()
  },
  wealth: {
    cash: 1000,
    totalWealth: 1000,
    totalCarValue: 0,
    totalPropertyValue: 0,
    totalPetValue: 0,
    totalLuxuryValue: 0
  },
  inventory: [],
  cooldowns: {
    work: Timestamp.fromDate(new Date(0)),
    business: Timestamp.fromDate(new Date(0)),
    oil: Timestamp.fromDate(new Date(0))
  },
  achievements: {},
  settings: {
    displayWealth: true,
    notifications: true
  },
  title: {
    tempTitle: null,
    tempTitleExpiresAt: null
  },
  stats: {
    totalEarned: 0,
    totalSpent: 0,
    pkWins: 0,
    pkLosses: 0,
    giftsSent: 0,
    friendsCount: 0,
    oilWinStreak: 0,
    oilLossStreak: 0
  }
};
```

---

## 7. 游戏平衡性数值总结

### 7.1 核心数值速查表

| 参数 | 值 | 说明 |
|------|-----|------|
| 初始资金 | 1,000 AED | 新用户注册后获得 |
| 打工收益 | 1,000 AED | 每 60 秒 |
| 做生意收益 | 10,000 AED | 每 600 秒 |
| 投资石油成功 | +1,000,000 AED | 50% 概率 |
| 投资石油失败 | -500,000 AED | 50% 概率 |
| 邀请奖励 | 100,000 AED | 双方各获得 |
| 每日收入上限（Lv1） | 1,000,000 AED | 防止刷钱 |
| 点赞奖励 | 50 AED | 给好友点赞方获得 |
| 拜访奖励 | 100 AED | 每日首次拜访好友 |
| 小老板升级门槛 | 1,000,000 AED |  |
| 富商升级门槛 | 100,000,000 AED |  |
| 土豪升级门槛 | 1,000,000,000 AED |  |
| 中东之王升级门槛 | 100,000,000,000 AED |  |

### 7.2 升级所需时间估算

| 等级 | 目标财富 | 纯打工所需时间 | 打工+做生意 | 投资石油加成 |
|------|---------|--------------|-----------|------------|
| 0→1 | 100K | ~100 分钟 | ~10 分钟 | - |
| 1→2 | 1M | ~16 小时 | ~2 小时 | - |
| 2→3 | 100M | ~69 天 | ~7 天 | ~3 天 |
| 3→4 | 100M→10B | ~6900 天 | ~690 天 | ~350 天 |
| 4→5 | 10B→10B | - | - | 需要运气 |

> 注：实际游戏中玩家可通过持续在线快速升级，以上仅为极端保守估算。核心目标是保证玩家在 1-3 天游戏体验内能体验到大部分内容。

---

| 天数 | AED奖励 | 连续天数 | 说明 |
|------|---------|----------|------|
| 1 | 500 | 1 | 入门礼 |
| 2 | 1,000 | 2 | - |
| 3 | 2,000 | 3 | - |
| 4 | 5,000 | 4 | - |
| 5 | 10,000 | 5 | - |
| 6 | 20,000 | 6 | - |
| 7 | 100,000 + 专属头像框 | 7 | 周奖励 |

**签到奖励说明：**
- 7天为一个周期，断签重置为第1天
- 头像框为「连续签到徽章」，展示在排行榜上
- 签到是**新玩家前7天最重要的积累方式**，之后主要靠打工+收租

---

## 11. 收租数据

### 11.1 可收租房产

| 物品ID | 名称 | 类别 | 价格(AED) | 每日租金(AED) | 收租CD |
|--------|------|------|-----------|--------------|--------|
| prop_apartment | Dubai Apartment | 房产 | 2,000,000 | 2,000 | 24小时 |
| prop_palm_villa | Palm Villa | 房产 | 50,000,000 | 50,000 | 24小时 |
| prop_palace | Abu Dhabi Palace | 房产 | 200,000,000 | 200,000 | 24小时 |

**租金公式：** `日租金 = 物品价格 × 0.001`（0.1%）

---

## 12. 原油期货数据

### 12.1 参数配置

| 参数 | 值 | 说明 |
|------|----|------|
| 最小买入 | 10,000 AED | 最低下注 |
| 最大持仓比例 | 现金×50% | 防止过度杠杆 |
| 更新间隔 | 30秒 | 价格刷新频率 |
| 波动范围 | ±5% | 每次更新最大涨跌幅 |
| 趋势惯性 | 70% | 延续上次方向概率 |
| K线历史 | 20个点 | 图表显示数量 |

### 12.2 初始价格

- 初始原油价格：1,000 AED/桶（模拟单位）

---

## 13. 送礼系统数据

### 13.1 礼物列表

| 礼物ID | 名称 | 图标 | 价格(AED) | 回礼价值(AED) | 回礼期限 |
|--------|------|------|-----------|--------------|----------|
| gift_dates | 椰枣礼盒 | 🥥 | 1,000 | 1,500 | 48小时 |
| gift_perfume | 中东香水 | 🌸 | 10,000 | 15,000 | 48小时 |
| gift_watch | 名表 | ⌚ | 100,000 | 150,000 | 48小时 |
| gift_supercar | 跑车 | 🏎️ | 1,000,000 | 1,500,000 | 48小时 |

### 13.2 送礼循环奖励

- 成功完成一次送礼循环：双方各获得 `礼物价格×0.5` AED 额外奖励
- 达成「礼尚往来」成就（10次循环）：1,000,000 AED + 称号

---

## 14. 邀请PK系统数据

### 14.1 对战配置

| 参数 | 值 |
|------|----|
| 组队人数 | 2人（玩家+好友）|
| 对手 | 电脑AI土豪×3 |
| AI1总资产 | 100,000,000 AED |
| AI2总资产 | 200,000,000 AED |
| AI3总资产 | 500,000,000 AED |
| 对战时长 | 3天 |
| 获胜奖励（每人）| 500,000 AED + 「最佳拍档」称号 |

---

## 15. 成就数据

### 15.1 完整成就表

| 成就ID | 名称 | 条件描述 | 奖励(AED) | 特殊奖励 |
|--------|------|----------|----------|----------|
| ach_first_million | 百万富翁 | 总资产≥1,000,000 | 1,000,000 | 「Millionaire」称号 |
| ach_ten_million | 千万富翁 | 总资产≥10,000,000 | 5,000,000 | - |
| ach_car_collector | 豪车收藏家 | 拥有全部7辆豪车 | 10,000,000 | 「Car Collector」称号 |
| ach_pet_collector | 动物园主 | 拥有全部4种宠物 | 5,000,000 | 「Zookeeper」称号 |
| ach_gift_master | 礼尚往来 | 完成10次送礼循环 | 1,000,000 | 「Gift Master」称号 |
| ach_daily_7 | 坚持不懈 | 连续签到7天 | 500,000 | 专属头像框 |
| ach_philanthropist | 乐善好施 | 累计慈善≥100,000,000 | 称号 | 「德高望重」全员+5%收益 |
| ach_first_kingdom | 小国王 | 总资产≥100亿 | 50,000,000 | 皇冠动画 |
| ach_visit_100 | 社交达人 | 拜访好友≥100次 | 称号 | 头像框 |
| ach_be_generous | 土豪本豪 | 单次购买≥50,000,000 | 称号 | 「真·土豪」专属称号 |
| ach_rent_30 | 包租公 | 收租累计30次 | 200,000 | - |
| ach_futures_win | 原油大王 | 原油期货盈利≥1,000,000 | 1,000,000 | 「Futures King」称号 |

---

## 16. 慈善项目数据

### 16.1 慈善项目表

| 项目ID | 名称 | 图标 | 最低捐赠(AED) | 效果 |
|--------|------|------|-------------|------|
| charity_mosque | 建造清真寺 | 🕌 | 10,000,000 | 「慈善家」称号 |
| charity_hospital | 捐建医院 | 🏥 | 50,000,000 | 每日+1次免费打工 |
| charity_school | 成立教育基金 | 🎓 | 100,000,000 | 「德高望重」全员收益+5% |
| charity_water | 沙漠饮水工程 | 💧 | 200,000,000 | 收租收益+10% |

### 16.2 慈善累计效果

- 每完成一个慈善项目，已捐总额累加
- 称号系统：已捐10M=「慈善家」，100M=「德高望重」，200M=「沙漠之友」

---

## 17. 限时活动数据

### 17.1 活动配置

| 活动ID | 名称 | 时间 | 效果 | 图标 |
|--------|------|------|------|------|
| event_ramadan | 斋月活动 | 伊斯兰历9月 | 打工/做生意双倍收益 | 🌙 |
| event_dubai_sale | 迪拜购物节 | 每年1-2月 | 奢侈品8折 | 🛍️ |
| event_camel | 骆驼节 | 每年1月 | 宠物类5折 | 🐪 |
| event_eid | 开斋节 | 斋月结束 | 全服每人发1,000,000 AED | 🎉 |

### 17.2 活动倍率

- 斋月打工基础收益：2,000 AED（原1,000）
- 斋月做生意基础收益：20,000 AED（原10,000）

---

## 18. 领土系统数据

### 18.1 地块完整列表

#### 迪拜 (Dubai) - 共8块

| 地块ID | 名称 | 等级 | 价格(AED) | 日收租 | 相邻地块 | 特殊 |
|--------|------|------|----------|--------|---------|------|
| plot_dubai_a01 | 迪拜购物中心 | A | 50,000,000 | 50,000 | dubai_a02, dubai_d01 | - |
| plot_dubai_a02 | 迪拜地铁 | A | 40,000,000 | 40,000 | dubai_a01, dubai_a03 | - |
| plot_dubai_a03 | 迪拜港 | A | 60,000,000 | 60,000 | dubai_a02, dubai_a04 | - |
| plot_dubai_a04 | 迪拜运动城 | A | 45,000,000 | 45,000 | dubai_a03, dubai_s01 | - |
| plot_dubai_s01 | 棕榈岛别墅 | S | 200,000,000 | 200,000 | dubai_a04, dubai_d02 | 传奇地块 |
| plot_dubai_d01 | 沙漠庄园1 | D | 100,000 | 100 | dubai_a01, dubai_d02 | - |
| plot_dubai_d02 | 沙漠庄园2 | D | 120,000 | 120 | dubai_d01, dubai_d03 | - |
| plot_dubai_d03 | 沙漠庄园3 | D | 80,000 | 80 | dubai_d02 | - |

#### 阿布扎比 (Abu Dhabi) - 共6块

| 地块ID | 名称 | 等级 | 价格(AED) | 日收租 | 相邻地块 | 特殊 |
|--------|------|------|----------|--------|---------|------|
| plot_abu_a01 | 阿布扎比海滨 | A | 30,000,000 | 30,000 | plot_abu_a02 | - |
| plot_abu_a02 | 谢赫宫外围 | A | 70,000,000 | 70,000 | plot_abu_a01, plot_abu_s01 | - |
| plot_abu_s01 | 阿布扎比皇宫 | S | 300,000,000 | 300,000 | plot_abu_a02, plot_abu_c01 | 传奇地块 |
| plot_abu_c01 | 王室庄园 | C | 500,000 | 500 | plot_abu_s01, plot_abu_c02 | - |
| plot_abu_c02 | 沙漠绿洲 | C | 800,000 | 800 | plot_abu_c01, plot_abu_c03 | - |
| plot_abu_c03 | 骆驼市场 | C | 300,000 | 300 | plot_abu_c02 | - |

#### 利雅得 (Riyadh) - 共5块

| 地块ID | 名称 | 等级 | 价格(AED) | 日收租 | 相邻地块 | 特殊 |
|--------|------|------|----------|--------|---------|------|
| plot_riyadh_a01 | 利雅得皇宫 | A | 35,000,000 | 35,000 | plot_riyadh_a02 | - |
| plot_riyadh_a02 | 国家博物馆 | A | 25,000,000 | 25,000 | plot_riyadh_a01, plot_riyadh_s01 | - |
| plot_riyadh_s01 | 利雅得塔 | S | 150,000,000 | 150,000 | plot_riyadh_a02 | 传奇地块 |
| plot_riyadh_c01 | 沙漠绿洲庄园 | C | 600,000 | 600 | plot_riyadh_c02 | - |
| plot_riyadh_c02 | 传统集市 | C | 400,000 | 400 | plot_riyadh_c01 | - |

#### 多哈 (Doha) - 共4块

| 地块ID | 名称 | 等级 | 价格(AED) | 日收租 | 相邻地块 | 特殊 |
|--------|------|------|----------|--------|---------|------|
| plot_doha_s01 | 石油平台 | S | 500,000,000 | 500,000 | plot_doha_b01 | 传奇地块 |
| plot_doha_b01 | 海湾金融中心 | B | 10,000,000 | 10,000 | plot_doha_s01, plot_doha_b02 | - |
| plot_doha_b02 | 珍珠岛 | B | 15,000,000 | 15,000 | plot_doha_b01, plot_doha_c01 | - |
| plot_doha_c01 | 滨海路公寓 | C | 700,000 | 700 | plot_doha_b02 | - |

#### 科威特城 (Kuwait) - 共3块

| 地块ID | 名称 | 等级 | 价格(AED) | 日收租 | 相邻地块 | 特殊 |
|--------|------|------|----------|--------|---------|------|
| plot_kuwait_b01 | 科威特塔 | B | 20,000,000 | 20,000 | plot_kuwait_b02 | - |
| plot_kuwait_b02 | 皇宫饭店 | B | 18,000,000 | 18,000 | plot_kuwait_b01, plot_kuwait_c01 | - |
| plot_kuwait_c01 | 滨海公寓 | C | 900,000 | 900 | plot_kuwait_b02 | - |

#### 史诗地标（★级，全服唯一）

| 地块ID | 名称 | 真实原型 | 价格(AED) | 日收租 | 特殊效果 |
|--------|------|---------|----------|--------|---------|
| plot_epic_01 | 帆船酒店 | 迪拜帆船酒店 | 500,000,000 | 500,000 | 「奢华象征」称号 |
| plot_epic_02 | 哈利法塔 | 迪拜塔 | 1,000,000,000 | 1,000,000 | 「世界之巅」+ 全局收入+5% |

---

### 18.2 地块升级费用

| 当前等级 | 升至下一等级费用 | 收租倍率 | 累计倍率 | 解锁条件 |
|---------|----------------|---------|---------|---------|
| Lv.1 | 初始（购买价×0%）| 100% | 100% | 购买时 |
| Lv.2 | 购买价×30% | 150% | 150% | 持有≥7天 |
| Lv.3 | 购买价×50% | 200% | 200% | 持有≥30天 |
| Lv.4 | 购买价×100% | 300% | 300% | 持有≥90天 |
| Lv.5 | 购买价×200% | 500% | 500% | 持有≥180天 |
| Lv.MAX | 购买价×500% | 1000% | 1000% | 持有≥365天 |

---

### 18.3 城市BUFF

| 城市 | BUFF名称 | 触发条件 | 效果 |
|------|---------|---------|------|
| 迪拜 | Dubai Soul | 持有≥3块迪拜地块 | 迪拜地块收租+10% |
| 阿布扎比 | Oil Privilege | 持有任意阿布扎比地块 | 石油投资成功率+20% |
| 利雅得 | Desert Walker | 持有任意利雅得地块 | 全部收租+15% |
| 多哈 | Port Bonus | 持有任意多哈地块 | 送礼CD-30% |
| 科威特 | Diplomatic Bonus | 持有任意科威特地块 | PK胜率+10% |

---

### 18.4 城市战争参数

| 参数 | 值 |
|------|----|
| 宣战费用 | 1,000,000 AED |
| 战争债券价格 | 10,000 AED/个 |
| 备战期 | 48小时 |
| 战争期 | 48小时 |
| 每次驻扎消耗 | 1个战争债券 |
| 进攻胜利奖励 | 抢夺对方最贵地块 |
| 防守胜利奖励 | 全城收租+20%（7天）|

---

## 19. 打工系统 v2.0（Enhanced Work System）

> 本章节为打工系统全面重设计，结合放置游戏+人脉社交元素，参考：Adventure Capitalist、Cookie Clicker、土豪模拟器原版设计。

### 19.1 设计理念

原版打工系统问题：只有1个按钮、1种收益、无策略深度、容易无聊。

新打工系统核心设计原则：
- **多层次**：打工类型随资产规模解锁，渐进式深度
- **惊喜感**：每次打工有概率触发人脉事件
- **连击反馈**：连续点击有视觉+数值奖励
- **被动收入**：员工系统让玩家可以"挂着玩"
- **进度感**：打工等级系统提供长期刷的动力

---

### 19.2 打工类型（按资产规模解锁）

| 工作ID | 名称 | 解锁门槛（总资产）| 基础收益 | CD时间 | 说明 |
|--------|------|----------------|---------|--------|------|
| work_carpet | 地毯店 | 0 | 50 AED | 60秒 | 新手起步 |
| work_guide | 沙漠导游 | 100,000 | 200 AED | 60秒 | 小老板专属 |
| work_oil_sales | 石油销售 | 1,000,000 | 1,000 AED | 60秒 | 财富增长期 |
| work_realestate | 房产中介 | 10,000,000 | 10,000 AED | 60秒 | 富商阶段 |
| work_trade | 国际贸易 | 100,000,000 | 100,000 AED | 60秒 | 超级富豪 |
| work_advisor | 投资顾问 | 1,000,000,000 | 1,000,000 AED | 60秒 | 中东首富 |

**解锁机制：** 当玩家总资产首次达到门槛时，自动解锁对应打工类型，并在屏幕上弹出"新工作解锁！"动画提示。

**策略性：** 玩家可以选择性地只做高收益工作（高门槛），也可以把低门槛工作当作日常小额积累。

---

### 19.3 打工人脉系统（核心创新）

> 每次打工有概率遇到人脉，人脉触发后获得buff或奖励

**触发规则：**
- 每次打工完成后，以 15% 概率触发人脉事件
- 人脉触发时弹出专属动画（如金色光圈、角色出场动画）

**人脉类型：**

| 人脉ID | 人脉名称 | 触发概率 | 效果 | 持续时间 |
|--------|---------|---------|------|---------|
| contact_merchant | 本地商人 | 4% | 做生意收益 +20% | 3次做生意 |
| contact_oil | 石油大亨 | 2% | 石油投资成功率 +10%（+10%永久）| 永久（可叠加3次）|
| contact_official | 政府官员 | 2% | 所有商品价格 9折 | 1次购买 |
| contact_influencer | 网红博主 | 3% | 分享奖励 AED 翻倍 | 1次分享 |
| contact_friend | 明星朋友 | 2% | 好友互动经验 +50% | 3次好友互动 |
| contact_mystery | 神秘商人 | 2% | 随机获得 1,000~100,000 AED | 即时 |

**人脉叠加规则：**
- 石油大亨效果可叠加（遇到3次 = 成功率从50%→70%→80%→90%，上限90%）
- 其他效果为一次性，不叠加
- 效果消耗完毕后在下次打工时可能再次触发

**人脉展示：**
- Home 界面顶部显示当前持有的人脉buff（图标+剩余次数）
- 倒计时/次数用金色小字显示

---

### 19.4 连击系统（Combo）

**机制：**
```
打工1次 → 基础收益
打工3次（每次在CD内完成） → 触发 Combo x1.5 + 显示 🔥
打工10次（每次在CD内完成） → 触发 Combo x2 + 解锁「加班模式」
```

**加班模式：**
- 激活后打工变为自动触发（每秒1次）
- 不需要手动点击
- 画面出现"加班中"动画效果
- 随时可手动关闭
- 关闭后Combo清零

**连击计数器：**
- 屏幕右上角显示 Combo 计数（🔥×12）
- 达到10次时触发全屏金色特效

**Combo失效条件：**
- 打工CD结束但未点击（等待超过CD时间）
- 手动关闭加班模式
- 切换到其他Tab（暂停）

---

### 19.5 打工升级系统

**打工等级：**
- 每次打工获得 1 点「打工经验」
- 打工经验累计升级打工等级
- 打工等级影响所有打工类型的收益倍率

**打工等级表：**

| 打工等级 | 累计打工次数 | 收益倍率 | 解锁内容 |
|---------|------------|---------|---------|
| Lv.1 | 0 | ×1.0 | 初始 |
| Lv.2 | 50次 | ×1.2 | 打工有概率获得双倍AED |
| Lv.3 | 200次 | ×1.5 | 打工CD减少20%（48秒）|
| Lv.4 | 500次 | ×2.0 | 解锁「精英打工」（每次收益×3）|
| Lv.5 | 1000次 | ×2.5 | 打工CD减少50%（30秒）|
| Lv.MAX | 5000次 | ×5.0 | 所有打工永久无CD |

---

### 19.6 员工系统（Passive Income）

> 玩家可以雇佣员工，员工每秒自动产生收益，不需要手动点击

**员工类型：**

| 员工ID | 名称 | 价格(AED) | 每秒收益 | 说明 |
|--------|------|-----------|---------|------|
| staff_intern | 实习生 | 10,000 | 1 AED/s | 入门级被动收入 |
| staff_employee | 正式员工 | 100,000 | 10 AED/s | 中级被动收入 |
| staff_manager | 部门经理 | 1,000,000 | 100 AED/s | 高级被动收入 |
| staff_director | 总监 | 10,000,000 | 1,000 AED/s | 高级被动收入 |
| staff_executive | 执行董事 | 100,000,000 | 10,000 AED/s | 土豪专属 |
| staff_ceo | CEO | 1,000,000,000 | 100,000 AED/s | 终极被动收入 |

**员工购买规则：**
- 每种员工可以购买多份
- 每购买1份，价格上涨 15%（通货膨胀）
- 员工产生的收益自动累加到现金（每1秒结算1次）

**员工管理界面：**
- Home Tab 新增「员工」按钮
- 显示当前所有员工数量和每秒总产出
- 可购买新员工
- 「员工总产出」显示在顶部状态栏

**被动收入上限（配合主线每日上限）：**
- 员工每秒产出总计不超过玩家当前等级每日上限的 20%

---

### 19.7 打工系统数据结构

```javascript
// 打工系统 v2.0 完整数据结构
const workSystem = {
  // 打工类型
  workTypes: {
    work_carpet:     { name: 'Carpet Shop',     unlock: 0,               baseEarnings: 50,     cooldown: 60 },
    work_guide:       { name: 'Desert Guide',     unlock: 100_000,          baseEarnings: 200,    cooldown: 60 },
    work_oil_sales:  { name: 'Oil Sales',        unlock: 1_000_000,        baseEarnings: 1_000,  cooldown: 60 },
    work_realestate:  { name: 'Real Estate',     unlock: 10_000_000,       baseEarnings: 10_000, cooldown: 60 },
    work_trade:      { name: 'Intl Trade',      unlock: 100_000_000,      baseEarnings: 100_000,cooldown: 60 },
    work_advisor:    { name: 'Invest Advisor',  unlock: 1_000_000_000,   baseEarnings: 1_000_000,cooldown: 60 },
  },

  // 打工人脉效果
  contacts: {
    merchant:   { buff: 'business_bonus',     value: 0.2,  remaining: 3 },  // 做生意+20%
    oilBaron:   { buff: 'oil_success_rate',  value: 0.1,  permanent: true }, // 石油成功率+10%
    official:   { buff: 'discount',           value: 0.1,  remaining: 1 },  // 9折
    influencer: { buff: 'share_double',        value: 2.0,  remaining: 1 },  // 分享×2
    friend:     { buff: 'friend_exp',         value: 0.5,  remaining: 3 },  // 好友经验+50%
    mystery:    { buff: 'random_cash',         value: null,  remaining: 1 },  // 随机AED
  },

  // 打工等级
  workLevel: 1,
  workExp: 0,
  workLevelConfig: [
    { level: 1, exp: 0,     multiplier: 1.0, unlock: null },
    { level: 2, exp: 50,    multiplier: 1.2, unlock: 'double_chance' },
    { level: 3, exp: 200,   multiplier: 1.5, unlock: 'cooldown_reduce_20' },
    { level: 4, exp: 500,   multiplier: 2.0, unlock: 'elite_work' },
    { level: 5, exp: 1000,  multiplier: 2.5, unlock: 'cooldown_reduce_50' },
    { level: 6, exp: 5000,   multiplier: 5.0, unlock: 'no_cooldown' },
  ],

  // Combo状态
  combo: {
    count: 0,        // 当前连击数
    multiplier: 1.0,  // 当前连击倍率
    overtime: false,   // 加班模式
  },

  // 员工数据
  staff: {
    intern:      { count: 0, basePrice: 10_000,     incomePerSec: 1 },
    employee:    { count: 0, basePrice: 100_000,    incomePerSec: 10 },
    manager:     { count: 0, basePrice: 1_000_000,  incomePerSec: 100 },
    director:    { count: 0, basePrice: 10_000_000, incomePerSec: 1_000 },
    executive:   { count: 0, basePrice: 100_000_000,incomePerSec: 10_000 },
    ceo:        { count: 0, basePrice: 1_000_000_000,incomePerSec: 100_000 },
  },

  // 已解锁打工类型（随资产自动解锁）
  unlockedWorks: ['work_carpet'],
};

// 打工执行算法
function doWork(workType) {
  // 1. 计算基础收益
  let earnings = workSystem.workTypes[workType].baseEarnings;

  // 2. 应用打工等级倍率
  earnings *= getWorkLevelMultiplier();

  // 3. 应用Combo倍率
  earnings *= getComboMultiplier();

  // 4. 应用人脉buff
  earnings *= (1 + getContactBonus('business_bonus'));

  // 5. 扣除CD（Lv.5以上无CD）
  if (!hasUnlocked('no_cooldown')) {
    applyCooldown(workType);
  }

  // 6. 获得打工经验
  addWorkExp(1);

  // 7. 触发人脉判定（15%概率）
  if (Math.random() < 0.15) {
    triggerRandomContact();
  }

  // 8. 更新Combo
  incrementCombo();

  // 9. 发放收益
  addCash(earnings);

  return { earnings, combo: combo.count, contact: lastContact };
}
```

---

### 19.8 UI 界面设计

**Home Tab 打工区域（新版）：**

```
┌─────────────────────────────────┐
│ 💼 打工大厅                      [员工👔] │
├─────────────────────────────────┤
│ 🔥 COMBO ×12                    │
│ ─────────────────────────────── │
│ [ ] 地毯店      50 AED    ✅    │
│ [ ] 沙漠导游    200 AED   🔒(需100K)│
│ [ ] 石油销售    1,000 AED  🔒(需1M)│
│ ─────────────────────────────── │
│ 当前倍率: ×2.0（打工Lv.4）        │
│ 本次收益: +100 AED              │
│ ─────────────────────────────── │
│ 人脉buff: 🛢️石油+10% 剩余永久    │
│ ─────────────────────────────── │
│ [加班模式: OFF]  [开始加班]      │
└─────────────────────────────────┘
```

**员工管理弹窗：**

```
┌─────────────────────────────────┐
│ 👔 员工管理                    [×] │
├─────────────────────────────────┤
│ 总产出: 1,234 AED/秒            │
│ ─────────────────────────────── │
│ 实习生     ×3    +3/s    10K AED │
│ 员工       ×1   +10/s   100K AED │
│ 部门经理   ×0    +0/s  1,000K AED│
│ 总监       ×0    +0/s   10,000K AED│
│ 执行董事   ×0    +0/s  100,000K AED│
│ CEO        ×0    +0/s1,000,000K AED│
│ ─────────────────────────────── │
│ [雇佣新员工]                    │
└─────────────────────────────────┘
```

---

### 19.9 每日打工上限（与主线经济上限联动）

| 玩家身份等级 | 每日主动打工上限 | 员工被动收入上限 |
|-------------|----------------|----------------|
| 平民 | 50,000 AED | 20,000 AED |
| 小老板 | 200,000 AED | 100,000 AED |
| 富商 | 2,000,000 AED | 1,000,000 AED |
| 超级富豪 | 20,000,000 AED | 10,000,000 AED |
| 中东首富 | 无上限 | 20,000,000 AED |

