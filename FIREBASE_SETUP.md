# Firebase 接入教程 - Arab Tycoon Simulator

## 第一步：创建 Firebase 项目

1. 打开 [Firebase Console](https://console.firebase.google.com/)
2. 点击 **"Add project"**
3. 输入项目名称：`arab-tycoon`（或其他名字）
4. 关闭 "Enable Google Analytics"（可选，不影响功能）
5. 点击 **"Create project"** 等待创建完成

---

## 第二步：注册 Web App

1. 进入项目后，点击 **"Project Overview"** 旁边的 ⚙️ 图标
2. 选择 **"Project Settings"**
3. 往下滚动，找到 **"Your apps"** 版块
4. 点击 **Web 图标** `</>` 添加 Web App
5. 输入 App 名称：`Arab Tycoon Simulator`
6. **不要**勾选 "Also set up Firebase Hosting"
7. 点击 **"Register app"**

---

## 第三步：获取配置信息

注册完成后，页面会显示类似这样的代码：

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy....................",
  authDomain: "arab-tycoon.firebaseapp.com",
  projectId: "arab-tycoon",
  storageBucket: "arab-tycoon.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

**把这些配置信息复制保存好，发给开发者（我）。**

---

## 第四步：启用 Authentication

1. 左侧菜单点击 **"Authentication"**
2. 点击 **"Get started"**
3. 在 "Sign-in method" 标签页，找到 **"Google"**
4. 点击 Google，启用它
5. 选择一个公开的 **"Project support email"**
6. 点击 **"Save"**

---

## 第五步：启用 Firestore Database

1. 左侧菜单点击 **"Firestore Database"**
2. 点击 **"Create database"**
3. 选择 **"Start in test mode"**（测试模式）
4. 选择一个服务器位置（推荐：asia-east1 或 us-central）
5. 点击 **"Enable"**

---

## 第六步：配置 Firestore 规则（重要！）

1. 进入 Firestore Database 后，点击 **"Rules"** 标签
2. 删除现有规则，替换为：

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 玩家只能读写自己的数据
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    // 好友数据
    match /friends/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

4. 点击 **"Publish"**

---

## 第七步：发送配置给开发者

把第三步获取的 `firebaseConfig` 对象发给我，格式如下：

```
apiKey: xxx
authDomain: xxx
projectId: xxx
storageBucket: xxx
messagingSenderId: xxx
appId: xxx
```

---

## 完成后功能

接入后玩家可以：
- ✅ 用 Google 账号登录
- ✅ 数据云端保存，换手机不丢失
- ✅ 真实好友系统（需要互加）
- ✅ 排行榜云端同步

## 费用

| 功能 | 免费额度 | 超出后 |
|------|---------|--------|
| Google 登录 | 10,000 用户/月 | $0.06/用户 |
| Firestore 读写 | 50K/20K 次/天 | $0.10/10万次 |
| 存储 | 5GB | $0.20/GB |

**日活几百人以内基本不花钱。**
