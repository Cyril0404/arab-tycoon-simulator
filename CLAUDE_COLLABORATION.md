
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

