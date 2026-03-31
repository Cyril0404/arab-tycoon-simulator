# Firebase 后端部署方案（完整版）

> 文档版本：v1.0
> 最后更新：2026-03-31
> 维护者：丞相

---

## 一、部署架构图

```
用户手机（WhatsApp/Chrome）
         │
         ▼
GitHub Pages 托管前端
（index.html + Firebase SDK）
         │
         ▼
Firebase Authentication
（用户登录/注册）
         │
         ▼
Cloud Firestore
（用户数据、排行榜、好友）
         │
         ▼
Firebase Hosting
（备用部署方案）
```

---

## 二、部署步骤

### Step 1：创建 Firebase 项目

1. 打开 https://console.firebase.google.com
2. 点击「添加项目」
3. 项目名称：`arab-tycoon-simulator`
4. Google Analytics：关闭（MVP不需要）
5. 点击「创建项目」

### Step 2：注册 Web 应用

1. 进入项目后，点击「项目设置」
2. 往下滚，找到「应用」区域
3. 点击 Web 图标 `</>`
4. 应用昵称：`Arab Tycoon Web`
5. **不要勾选**「为此应用设置 Firebase Hosting」
6. 点击「注册应用」

### Step 3：获取 Firebase 配置

注册完会显示一段配置代码，长这样：

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "arab-tycoon-simulator.firebaseapp.com",
  projectId: "arab-tycoon-simulator",
  storageBucket: "arab-tycoon-simulator.appspot.com",
  messagingSenderId: "...",
  appId: "..."
};
```

**把这个配置发给丞相/CC**，需要写入代码里。

### Step 4：启用 Authentication

1. 左侧菜单 → 「Authentication」
2. 点击「开始」
3. 在「Sign-in method」里启用：
   - **Anonymous（匿名登录）** ← 推荐先用这个，WhatsApp直接进不用注册
   - Google（可选，让用户用Google账号登录）
4. 保存

### Step 5：创建 Firestore 数据库

1. 左侧菜单 → 「Firestore Database」
2. 点击「创建数据库」
3. 区域选择：`asia-east1`（东京）或 `europe-west1`（欧洲）
4. 测试模式：先用「测试模式」起家
5. 点击「启用」

### Step 6：设置数据库规则（安全规则）

进入 Firestore → 「规则」，粘贴以下规则：

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // 用户文档
    match /users/{userId} {
      // 任何人可读，登录后可写自己的数据
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // 排行榜（只读）
    match /leaderboard/{type} {
      allow read: if true;
      allow write: if false; // 服务端写入
    }
    
    // 好友关系
    match /friends/{friendId} {
      allow read, write: if request.auth != null && request.auth.uid == friendId;
    }
  }
}
```

点击「发布」。

### Step 7：在代码里集成 Firebase

**需要改 index.html，在 `<head>` 里加入：**

```html
<!-- Firebase SDK -->
<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-auth-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore-compat.js"></script>
```

**然后在游戏初始化处加入 Firebase 配置：**

```javascript
// Firebase 配置（替换成 Step 3 的配置）
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "arab-tycoon-simulator.firebaseapp.com",
  projectId: "arab-tycoon-simulator",
  storageBucket: "arab-tycoon-simulator.appspot.com",
  messagingSenderId: "...",
  appId: "..."
};

// 初始化 Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();
```

---

## 三、Firestore 数据结构设计

根据 PRD 的 DATABASE.md 设计：

```
Firestore
│
├── users/{userId}
│   ├── name: string              // 玩家名称
│   ├── avatar: string            // 头像
│   ├── totalWealth: number      // 总资产（AED）
│   ├── cash: number              // 现金
│   ├── level: number             // 等级
│   ├── title: string             // 称号
│   ├── cars: array               // 已购车辆
│   ├── houses: array             // 已购房产
│   ├── pets: array               // 已购宠物
│   ├── achievements: array       // 成就列表
│   ├── friends: array            // 好友ID列表
│   ├── dailyStreak: number        // 连续签到天数
│   ├── createdAt: timestamp       // 注册时间
│   └── lastLogin: timestamp      // 最后登录时间
│
├── leaderboard/
│   ├── totalWealth/{userId}      // 总资产排行
│   │   └── wealth: number
│   ├── cars/{userId}             // 豪车排行
│   │   └── wealth: number
│   ├── houses/{userId}            // 豪宅排行
│   │   └── wealth: number
│   └── pets/{userId}             // 宠物排行
│       └── wealth: number
│
├── gifts/{giftId}               // 礼物配置（固定数据）
│   └── ...
│
└── achievements/{achievementId}  // 成就配置（固定数据）
    └── ...
```

---

## 四、实现功能清单

### 4.1 用户系统

| 功能 | 实现方式 | 状态 |
|------|---------|------|
| 匿名登录 | Firebase Anonymous Auth | ⬜ |
| Google登录 | Firebase Google Auth | ⬜ |
| 存档数据 | Firestore users/{uid} | ⬜ |
| 离线保存 | localStorage + Firestore同步 | ⬜ |

### 4.2 排行榜

| 功能 | 实现方式 | 状态 |
|------|---------|------|
| 总资产排行 | Firestore查询排序 | ⬜ |
| 豪车排行 | Firestore查询排序 | ⬜ |
| 豪宅排行 | Firestore查询排序 | ⬜ |
| 实时更新 | Firestore onSnapshot | ⬜ |

### 4.3 好友系统

| 功能 | 实现方式 | 状态 |
|------|---------|------|
| 添加好友 | Firestore写入 | ⬜ |
| 好友列表 | Firestore读取 | ⬜ |
| PK对战 | Firestore实时更新 | ⬜ |
| 送礼功能 | Firestore事务 | ⬜ |

---

## 五、部署命令

### GitHub Pages 部署（方案A）

```bash
# 1. 克隆仓库
git clone https://github.com/Cyril0404/arab-tycoon-simulator.git
cd arab-tycoon-simulator

# 2. 创建 404.html（SPA必须）
cat > 404.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Arab Tycoon Simulator</title>
  <script>
    sessionStorage.setItem('redirect', location.pathname);
    location.href = '/';
  </script>
</head>
<body></body>
</html>
EOF

# 3. 提交代码
git add .
git commit -m "feat: add Firebase integration"
git push origin main

# 4. 启用GitHub Pages（网页操作）
# Settings → Pages → Source: main / (root) → Save
```

**访问地址**：`https://Cyril0404.github.io/arab-tycoon-simulator/`

---

### Firebase Hosting 部署（方案B）

```bash
# 1. 安装 Firebase CLI
npm install -g firebase-tools

# 2. 登录
firebase login

# 3. 初始化
firebase init hosting
# 选择项目：arab-tycoon-simulator
# 目录：./ (当前目录)
# 单页应用：是

# 4. 创建 firebase.json
cat > firebase.json << 'EOF'
{
  "hosting": {
    "public": ".",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**", "*.md"],
    "rewrites": [{"source": "**", "destination": "/index.html"}]
  },
  "firestore": {
    "rules": "firestore.rules",
    "indexes": "firestore.indexes.json"
  }
}
EOF

# 5. 部署
firebase deploy
```

**访问地址**：`https://arab-tycoon-simulator.web.app/`

---

## 六、测试清单

部署完成后测试：

- [ ] 游戏首页能打开
- [ ] 点击Start直接匿名登录成功
- [ ] 打工赚钱，数据保存了
- [ ] 刷新页面，数据还在（Firebase读取成功）
- [ ] 排行榜显示真实用户
- [ ] WhatsApp里打开链接能玩
- [ ] iOS Safari里打开能玩

---

## 七、成本预估

| Firebase服务 | 免费额度 | 费用 |
|-------------|---------|------|
| Authentication | 无限 | $0 |
| Firestore | 1GB存储 / 5万次读写/天 | $0 |
| Hosting | 10GB/月 | $0 |
| **总计** | | **$0** |

**什么时候开始花钱？**

- 月活用户 > 10万
- 存储 > 1GB

**结论：游戏推广阶段基本不花钱** ✅

---

## 八、责任分工

| 任务 | 负责人 |
|------|--------|
| 创建Firebase项目 | 神冢（需要Google账号） |
| 提供Firebase配置 | 神冢 |
| 代码集成Firebase | CC |
| GitHub Pages部署 | CC |
| 测试WhatsApp打开 | 神冢 |

---

## 九、修改记录

| 时间 | 修改人 | 修改内容 |
|------|--------|----------|
| 2026-03-31 20:34 | 丞相 | 创建完整Firebase部署方案 |

---

## 十、神冢操作指南

**神冢你需要做的事：**

1. 打开 https://console.firebase.google.com
2. 用Google账号登录
3. 点击「添加项目」→ 项目名 `arab-tycoon-simulator`
4. 项目创建完成后，进「项目设置」→ 注册Web应用
5. 复制 Firebase 配置（那段 apiKey... 的代码）
6. 把这个配置发给 CC 或丞相

然后 CC 负责改代码、部署。

---

## 参考文档

- Firebase官方文档：https://firebase.google.com/docs
- Firestore规则：https://firebase.google.com/docs/firestore/security/rules
- Anonymous Auth：https://firebase.google.com/docs/auth/web/anonymous-auth
