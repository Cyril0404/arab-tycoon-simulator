
---

## 土豪模拟器 Firebase 接入任务 [23:28]

### 已完成
- Firebase项目创建 ✅
- Firestore数据库创建 ✅
- Authentication匿名登录 ✅
- Firestore安全规则发布 ✅
- firebaseConfig已填入代码 ✅

### CC需要做的
在 index.html 里实现以下Firebase功能：

1. **匿名登录** — Firebase Auth Anonymous登录，用户打开游戏自动创建匿名账号
2. **用户存档** — Firestore存储用户数据（totalWealth, level, cars, houses等）
3. **排行榜** — Firestore存储排行榜数据
4. **好友系统** — Firestore读写好友关系

### Firestore数据结构
```
users/{uid}
  - name, avatar, totalWealth, cash, level, title
  - cars[], houses[], pets[], achievements[]
  - friends[], dailyStreak, createdAt, lastLogin

leaderboard/totalWealth/{uid}
leaderboard/cars/{uid}
leaderboard/houses/{uid}
leaderboard/pets/{uid}
```

### Firebase SDK
代码里已有：
```html
<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-auth-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore-compat.js"></script>
```

### 参考文档
- FIREBASE_SETUP.md
- FIREBASE_DEPLOYMENT.md
- DATABASE.md

### 完成后
git push origin main → GitHub Pages自动部署 → 测试WhatsApp打开


---

## 土豪模拟器上线标准 [23:54]

### 上线前必须完成

| # | 事项 | 状态 | 备注 |
|---|------|------|------|
| 1 | Firebase基础流程（登录/存档/加载） | ✅ | 已完成 |
| 2 | 排行榜Firebase接入 | 🔄 | CC做中 |
| 3 | NPC好友互动存Firestore | ✅ | 已完成 |
| 4 | 真实玩家好友系统 | ⬜ | 暂不做，上线后迭代 |
| 5 | 英文翻译检查 | ⬜ | 上线前必须零错误 |
| 6 | 阿拉伯语翻译检查 | ⬜ | 上线前必须零错误 |
| 7 | UI阿拉伯语RTL适配 | ⬜ | 从右到左布局 |
| 8 | GitHub Pages部署 | ✅ | 已上线 |

### 上线语言要求
- **中文**：隐藏（保留源码，方便以后加新内容）
- **英文**：必须零错误
- **阿拉伯语**：必须零错误，RTL适配完整

### 上线标准
1. 英文 + 阿拉伯语 完全就绪
2. 翻译零错误
3. 排行榜/好友系统基本功能完成
4. WhatsApp内置浏览器测试通过

### 上线后迭代
- 真实玩家好友系统
- 真实排行榜（全球排行）
- 阿拉伯语内容持续优化

