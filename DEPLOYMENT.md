# 部署运维文档

> **项目**: Arab Tycoon Simulator
> **版本**: v1.0
> **最后更新**: 2026-03-29

---

## 1. 整体部署架构

```
代码仓库（GitHub）
       │
       ├── push to main ──────→ GitHub Pages（前端自动部署）
       │                            │
       │                            └── https://Cyril0404.github.io/arab-tycoon-simulator/
       │
       ├── push to main ──────→ GitHub Actions CI/CD
       │                            │
       │                            ├── Firebase Hosting（静态资源）
       │                            ├── Firestore 规则部署
       │                            └── Firestore 索引部署

用户访问路径：
WhatsApp / Chrome → GitHub Pages URL → 加载 HTML/CSS/JS → Firebase Auth → Firestore 数据
```

---

## 2. GitHub Pages 部署前端

### 2.1 前提条件

- GitHub 账户
- 对仓库的 Admin 权限
- 仓库已启用 GitHub Pages

### 2.2 手动部署步骤

**Step 1: 确保 `index.html` 在仓库根目录**

**Step 2: 推送代码到 `main` 分支**

```bash
git add .
git commit -m "feat: initial MVP release"
git push origin main
```

**Step 3: 配置 GitHub Pages**

1. 进入仓库 Settings → Pages
2. Source: Deploy from a branch
3. Branch: `main` / `(root)`
4. 点击 Save

**Step 4: 等待部署（约 2-3 分钟）**

访问：`https://Cyril0404.github.io/arab-tycoon-simulator/`

### 2.3 SPA 路由 fallback（必须配置）

创建 `404.html`（重要！否则页面刷新会 404）：

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Arab Tycoon Simulator</title>
  <script>
    // GitHub Pages SPA fallback
    sessionStorage.setItem('redirect', location.pathname);
    location.href = '/';
  </script>
</head>
<body></body>
</html>
```

---

## 3. Firebase Hosting 部署

### 3.1 初始化 Firebase 项目

**Step 1: 创建 Firebase 项目**

1. 访问 [Firebase Console](https://console.firebase.google.com)
2. 点击 "Add project"
3. 项目名称：`arab-tycoon-simulator`
4. 关闭 Google Analytics（MVP 不需要）

**Step 2: 注册 Web 应用**

1. Project Settings → Your apps → Add app → Web (</>)
2. 应用昵称：`Arab Tycoon Web`
3. 不勾选 Firebase Hosting（我们用 GitHub Pages 托管）
4. 复制 Firebase 配置

**Step 3: 获取 Firebase 配置**

```javascript
// 在 Firebase Console → Project Settings → Your apps → Config
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "arab-tycoon-simulator.firebaseapp.com",
  projectId: "arab-tycoon-simulator",
  storageBucket: "arab-tycoon-simulator.appspot.com",
  messagingSenderId: "...",
  appId: "..."
};
```

### 3.2 初始化 Firebase CLI

```bash
npm install -g firebase-tools
firebase login
firebase projects:list  # 确认已登录
```

### 3.3 配置 firebase.json

在项目根目录创建 `firebase.json`：

```json
{
  "hosting": {
    "public": ".",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**",
      "*.md",
      "*.yml",
      "firestore.rules",
      "firestore.indexes.json"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  },
  "firestore": {
    "rules": "firestore.rules",
    "indexes": "firestore.indexes.json"
  }
}
```

### 3.4 部署 Firebase 资源

```bash
# 部署 Hosting + Firestore 规则 + 索引
firebase deploy --project arab-tycoon-simulator

# 只部署 Firestore 规则
firebase deploy --only firestore:rules

# 只部署 Hosting
firebase deploy --only hosting

# 预览部署（不正式发布）
firebase hosting:channel:create preview
firebase hosting:channel:deploy preview
```

---

## 4. CI/CD 自动部署（GitHub Actions）

### 4.1 创建 GitHub Actions Workflow

在仓库创建 `.github/workflows/deploy.yml`：

```yaml
name: Deploy to GitHub Pages and Firebase

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install Firebase CLI
        run: npm install -g firebase-tools

      - name: Deploy to GitHub Pages
        run: |
          # GitHub Pages 部署由 GitHub 自动处理
          # 但可以验证构建
          echo "Deploying to GitHub Pages..."
          echo "Files to deploy:"
          ls -la

      - name: Deploy to Firebase Hosting
        run: |
          firebase deploy --project arab-tycoon-simulator --token ${{ secrets.FIREBASE_TOKEN }}
        env:
          FIREBASE_TOKEN: ${{ secrets.FIREBASE_TOKEN }}

      - name: Deploy Firestore Rules
        run: |
          firebase deploy --only firestore:rules --project arab-tycoon-simulator --token ${{ secrets.FIREBASE_TOKEN }}
```

### 4.2 配置 Firebase CI Token

**Step 1: 生成 Firebase CI Token**

```bash
firebase login:ci
# 浏览器打开，授权
# 生成 token（格式：1/...）
```

**Step 2: 在 GitHub 仓库添加 Secret**

1. 仓库 Settings → Secrets and variables → Actions
2. New repository secret
3. Name: `FIREBASE_TOKEN`
4. Value: 粘贴上面生成的 token

### 4.3 启用 GitHub Actions

在 GitHub 仓库的 Actions 页面确认 workflow 已启用。

---

## 5. 域名绑定（可选）

### 5.1 购买域名

推荐在 Namecheap / GoDaddy / Cloudflare 购买：
- `arabtycoon.com`
- `arabtycoon.io`

### 5.2 配置 GitHub Pages 自定义域名

**Step 1: 在 GitHub Pages 设置**

1. 仓库 Settings → Pages
2. Custom domain: `arabtycoon.com`
3. 勾选 "Enforce HTTPS"

**Step 2: 在域名服务商配置 DNS**

添加 CNAME 记录：

| Type | Name | Target |
|------|------|--------|
| CNAME | www | `Cyril0404.github.io` |
| CNAME | @ | `Cyril0404.github.io` |

或者使用 Cloudflare（推荐）：

| Type | Name | Target |
|------|------|--------|
| CNAME | www | `Cyril0404.github.io` |
| CNAME | @ | `Cyril0404.github.io` |

### 5.3 Firebase Hosting 自定义域名

如果使用 Firebase Hosting：

```bash
firebase hosting:disable
firebase init hosting
# 选择域名，配置验证
firebase deploy --only hosting
```

---

## 6. 监控与日志

### 6.1 Firebase Analytics（免费）

Firebase Analytics 自动收集用户行为：

```javascript
import { analytics } from 'firebase/analytics';

analytics.logEvent('earn_money', {
  action_type: 'work',
  amount: 1000
});

analytics.logEvent('purchase_item', {
  item_id: 'car_004',
  item_category: 'car',
  price: 15000000
});

analytics.logEvent('share_game', {
  method: 'whatsapp'
});
```

在 Firebase Console → Analytics 查看：
- DAU（日活跃用户）
- 用户留存
- 事件转化漏斗
- 热门商品

### 6.2 自定义错误日志

```javascript
window.onerror = function(message, source, lineno, colno, error) {
  // 上报错误到 Firebase（也可以用 Sentry）
  console.error('[Error]', message, source, lineno);
  return false;
};

// Vue 错误处理
app.config.errorHandler = (err, instance, info) => {
  console.error('[Vue Error]', err, info);
};
```

### 6.3 性能监控

使用 Firebase Performance Monitoring：

```javascript
import { trace } from 'firebase/performance';

const perf = getPerformance();
const t = trace(perf, 'load_game');
t.start();

// 游戏加载完成后
t.stop();
```

---

## 7. 备份策略

### 7.1 Firestore 数据导出

```bash
# 手动导出
firebase firestore:export ./firestore-backup-$(date +%Y%m%d)

# 自动导出脚本（可配合 GitHub Actions 定时执行）
```

### 7.2 GitHub Actions 定时备份

```yaml
# .github/workflows/backup.yml
name: Weekly Firestore Backup

on:
  schedule:
    - cron: '0 2 * * 0'  # 每周日凌晨 2 点

jobs:
  backup:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      - name: Install Firebase CLI
        run: npm install -g firebase-tools
      - name: Export Firestore data
        run: |
          firebase firestore:export ./backup --project arab-tycoon-simulator \
            --token ${{ secrets.FIREBASE_TOKEN }}
      - name: Upload backup to GitHub
        uses: actions/upload-artifact@v4
        with:
          name: firestore-backup
          path: ./backup
          retention-days: 30
```

### 7.3 备份恢复测试

```bash
# 定期测试备份是否可以恢复
firebase firestore:import ./backup --project arab-tycoon-simulator --force
```

---

## 8. 环境说明

| 环境 | 用途 | 部署位置 |
|------|------|----------|
| 开发环境 | 本地开发 | `localhost:8080` |
| 预览环境 | 测试 | Firebase Hosting Channel: preview |
| 生产环境 | 正式用户 | GitHub Pages (`github.io`) |
| Firebase Firestore | 云数据库 | Firebase 云服务 |
