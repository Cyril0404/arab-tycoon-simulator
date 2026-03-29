# 游戏数据设计文档

> **项目**: Arab Tycoon Simulator
> **版本**: v1.0
> **最后更新**: 2026-03-29

---

## 1. 商品数据（Items）

### 1.1 完整商品列表

所有商品数据存储于 Firestore `items/` collection。

#### 1.1.1 豪车类（Cars）

| itemId | 名称 | 价格 (AED) | 图标 | 描述 | 解锁等级 | 稀有度 | 年贬值 | 最大持有 |
|--------|------|-----------|------|------|----------|--------|--------|----------|
| `car_001` | Rolls-Royce Cullinan | 5,000,000 | 🚗 | 奢华英伦风格，迪拜街头常客 | 2 | rare | 0% | -1 |
| `car_002` | Ferrari SF90 | 3,000,000 | 🏎️ | 跃马旗舰，0-100km/h 仅 2.5 秒 | 2 | rare | 0% | -1 |
| `car_003` | Lamborghini Revuelto | 3,500,000 | 🏎️ | 混动蛮牛，沙漠中的烈焰 | 2 | rare | 0% | -1 |
| `car_004` | Bugatti Chiron | 15,000,000 | 🚗 | 全球限量，迪拜土豪标配 | 3 | epic | 0% | 1 |
| `car_005` | Bentley Mulsanne | 2,000,000 | 🚗 | 英式优雅，低调奢华 | 2 | rare | 0% | -1 |
| `car_006` | McLaren P1 | 4,000,000 | 🏎️ | 混动超跑，科技感十足 | 2 | rare | 0% | -1 |
| `car_007` | Gulfstream G650（私人飞机） | 200,000,000 | ✈️ | 洲际飞行，空中宫殿 | 4 | legendary | 0% | 1 |
| `car_008` | Luxury Yacht（豪华游艇） | 150,000,000 | 🚢 | 海上别墅，派对神器 | 4 | legendary | 0% | 1 |

#### 1.1.2 豪宅类（Properties）

| itemId | 名称 | 价格 (AED) | 图标 | 描述 | 解锁等级 | 稀有度 | 年贬值 | 最大持有 |
|--------|------|-----------|------|------|----------|--------|--------|----------|
| `prop_001` | Dubai Apartment（迪拜公寓） | 2,000,000 | 🏠 | 迪拜市中心的现代公寓 | 3 | common | 0% | -1 |
| `prop_002` | Palm Villa（棕榈岛别墅） | 50,000,000 | 🏘️ | 棕榈岛上的人工岛屿别墅 | 4 | epic | 0% | 1 |
| `prop_003` | Abu Dhabi Palace（阿布扎比皇宫） | 200,000,000 | 🏰 | 皇宫级奢华，国王般享受 | 5 | legendary | 0% | 1 |

#### 1.1.3 宠物类（Pets）

| itemId | 名称 | 价格 (AED) | 图标 | 描述 | 解锁等级 | 稀有度 | 年贬值 | 最大持有 |
|--------|------|-----------|------|------|----------|--------|--------|----------|
| `pet_001` | Falcon（猎鹰） | 500,000 | 🦅 | 沙漠猎鹰，阿联酋国鸟 | 4 | rare | 0% | -1 |
| `pet_002` | Arabian Horse（阿拉伯马） | 1,000,000 | 🐎 | 纯种阿拉伯马，皇室血统 | 4 | rare | 0% | -1 |
| `pet_003` | Lion（狮子） | 5,000,000 | 🦁 | 迪拜土豪标配宠物，回头率 100% | 4 | epic | 0% | 1 |
| `pet_004` | White Tiger（白虎） | 6,000,000 | 🐯 | 稀有白虎，霸气十足 | 5 | legendary | 0% | 1 |

#### 1.1.4 奢侈品类（Luxury Items）

| itemId | 名称 | 价格 (AED) | 图标 | 描述 | 解锁等级 | 稀有度 | 年贬值 | 最大持有 |
|--------|------|-----------|------|------|----------|--------|--------|----------|
| `lux_001` | Patek Philippe Nautilus | 500,000 | ⌚ | 瑞士名表，永恒经典 | 1 | rare | 5%/年 | -1 |
| `lux_002` | Hermès Birkin | 300,000 | 👜 | 包包中的皇后 | 1 | rare | 5%/年 | -1 |
| `lux_003` | Limited Edition AJ | 10,000 | 👟 | 球鞋天花板，收藏价值极高 | 1 | common | 3%/年 | -1 |
| `lux_004` | Gold Diamond iPhone | 100,000 | 📱 | 纯金机身，钻石按键 | 1 | epic | 5%/年 | -1 |

#### 1.1.5 礼物类（Gifts）

礼物不可直接购买，通过送礼系统使用：

| itemId | 对应商品 | 礼物名称 | 价值 (AED) |
|--------|---------|---------|-----------|
| `gift_watch` | `lux_001` | 百达翡丽名表 | 50,000 |
| `gift_car` | `car_002` | 法拉利跑车 | 500,000 |
| `gift_villa` | `prop_002` | 棕榈岛别墅 | 5,000,000 |

---

## 2. 赚钱行为详细参数

### 2.1 三种赚钱方式

| 行为ID | 名称 | 英文名 | 基础收益 | 冷却时间 | 随机事件 |
|--------|------|--------|----------|----------|----------|
| `work` | 打工 | Work | +1,000 AED | 60 秒 | 无 |
| `business` | 做生意 | Business | +10,000 AED | 600 秒（10分钟） | 无 |
| `oil` | 投资石油 | Oil Investment | +1,000,000 AED（成功）<br>-500,000 AED（失败） | 3600 秒（1小时） | 50% 概率 |

### 2.2 冷却时间配置（cooldown 配置）

```javascript
const EARN_ACTIONS = {
  work: {
    name: 'Work',
    nameAr: 'العمل',
    earnings: 1000,
    cooldownSeconds: 60,
    icon: '💼',
    description: 'Do some freelance work'
  },
  business: {
    name: 'Run Business',
    nameAr: 'إدارة الأعمال',
    earnings: 10000,
    cooldownSeconds: 600,
    icon: '🏢',
    description: 'Manage your small business'
  },
  oil: {
    name: 'Invest in Oil',
    nameAr: 'استثمار النفط',
    earnings: { success: 1_000_000, failure: -500_000 },
    successRate: 0.5,
    cooldownSeconds: 3600,
    icon: '🛢️',
    description: 'High risk, high reward!'
  }
};
```

### 2.3 投资石油算法

```javascript
function calculateOilInvestment() {
  const roll = Math.random();
  if (roll >= 0.5) {
    return {
      success: true,
      earnings: 1_000_000,
      message: 'Oil prices surged! You doubled your investment!'
    };
  } else {
    return {
      success: false,
      earnings: -500_000,
      message: 'Oil prices crashed. You lost half your investment.'
    };
  }
}
```

### 2.4 每日收益上限

为防止刷钱，设置每日最高收入限制：

| 等级 | 每日最高收入（AED） |
|------|---------------------|
| 1（平民） | 1,000,000 |
| 2（小老板） | 10,000,000 |
| 3（富商） | 100,000,000 |
| 4（超级富豪） | 1,000,000,000 |
| 5（中东首富） | 无上限 |

---

## 3. 身份等级详细定义

### 3.1 等级数据表

| 等级 | 名称（EN） | 名称（中文） | 门槛 (AED) | 称号颜色 | 解锁功能 | 解锁装备 |
|------|-----------|------------|-----------|---------|----------|----------|
| 1 | Commoner | 平民 | 0 | 灰色 `#9E9E9E` | 打工、做生意、奢侈品购买 | lux_001, lux_002, lux_003, lux_004 |
| 2 | Small Boss | 小老板 | 100,000 | 铜色 `#CD7F32` | 购买普通豪车 | car_001, car_002, car_003, car_005, car_006 |
| 3 | Rich Merchant | 富商 | 1,000,000 | 银色 `#C0C0C0` | 购买豪宅、豪华跑车 | prop_001, car_004 |
| 4 | Super Tycoon | 超级富豪 | 100,000,000 | 金色 `#D4AF37` | 购买宠物、私人飞机/游艇 | pet_001, pet_002, pet_003, car_007, car_008, prop_002 |
| 5 | Middle East's Richest | 中东首富 | 10,000,000,000 | 彩虹光效 `#FFD700` | 限量装备、全服公告 | pet_004, prop_003 |

### 3.2 升级判定算法

```javascript
function calculateLevel(totalWealth) {
  const LEVEL_THRESHOLDS = [
    { level: 1, threshold: 0 },
    { level: 2, threshold: 100_000 },
    { level: 3, threshold: 1_000_000 },
    { level: 4, threshold: 100_000_000 },
    { level: 5, threshold: 10_000_000_000 }
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
| 小老板升级门槛 | 100,000 AED |  |
| 富商升级门槛 | 1,000,000 AED |  |
| 超级富豪升级门槛 | 100,000,000 AED |  |
| 中东首富升级门槛 | 10,000,000,000 AED |  |

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

## 10. 每日签到数据

### 10.1 签到奖励表

| 天数 | AED奖励 | 连续天数 |
|------|---------|----------|
| 1 | 1,000 | 1 |
| 2 | 5,000 | 2 |
| 3 | 10,000 | 3 |
| 4 | 20,000 | 4 |
| 5 | 50,000 | 5 |
| 6 | 100,000 | 6 |
| 7 | 500,000 + 头像框 | 7 |

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
