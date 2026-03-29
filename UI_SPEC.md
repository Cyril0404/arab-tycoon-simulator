# UI/UX 设计规范

> **项目**: Arab Tycoon Simulator
> **版本**: v1.0
> **最后更新**: 2026-03-29

---

## 1. 设计原则

1. **金色奢华感**：金色 #D4AF37 作为核心视觉语言，贯穿全游戏
2. **信息层次清晰**：财富数字永远是最大最醒目的元素
3. **阿拉伯土豪审美**：金色、深棕、黑底、白色文字，奢华感拉满
4. **移动优先**：360px - 480px 竖屏，所有设计基于此尺寸
5. **操作简单**：单手操作，无需精准点击，大按钮优先

---

## 2. 屏幕列表

| 屏幕 | 路由 | 说明 |
|------|------|------|
| 启动页 | `/` | 品牌展示 + 开始按钮 |
| 主界面 | `/home` | 底部 Tab 导航容器 |
| Home Tab | `/home/earn` | 赚钱操作面板（默认页） |
| 商店 Tab | `/home/shop` | 商品购买 |
| 背包 Tab | `/home/inventory` | 已购装备 |
| 排行榜 Tab | `/leaderboard` | 各类排行榜 |
| 好友 Tab | `/friends` | 好友列表 |
| 好友主页 | `/friends/:uid` | 查看特定好友 |
| 设置页面 | `/settings` | 用户设置 |
| 升级弹窗 | Modal | 升级庆祝弹窗 |
| PK 结果弹窗 | Modal | PK 战斗结果 |
| 炫富海报页 | `/share` | 分享海报预览 |

---

## 3. 配色系统

### 3.1 主色板

| 颜色名称 | 色值 | 用途 |
|----------|------|------|
| 金色（Gold Primary） | `#D4AF37` | 主按钮、标题、重要数字 |
| 金色亮（Gold Light） | `#F5D77A` | hover 状态、金色渐变起点 |
| 金色暗（Gold Dark） | `#AA8C2C` | 按钮按压状态、深色渐变 |
| 黑色（Deep Black） | `#000000` | 主背景 |
| 深棕（Dark Brown） | `#2C1E0F` | 卡片背景、次级背景 |
| 中棕（Medium Brown） | `#4A3728` | 输入框背景 |
| 白色（White） | `#FFFFFF` | 正文文字 |
| 浅灰（Light Gray） | `#B0A090` | 次级文字、说明文字 |
| 边框金（Gold Border） | `#8B7355` | 卡片边框 |

### 3.2 语义色

| 语义 | 色值 | 用途 |
|------|------|------|
| 收入/赚钱 | `#4CAF50` | 绿色表示赚钱 |
| 支出/消费 | `#F44336` | 红色表示花钱 |
| 警告 | `#FF9800` | 橙色表示冷却中 |
| 皇冠（金） | `#FFD700` | 排行榜第一 |
| 皇冠（银） | `#C0C0C0` | 排行榜第二 |
| 皇冠（铜） | `#CD7F32` | 排行榜第三 |

### 3.3 渐变定义

```css
/* 主渐变：金色从浅到深 */
.gold-gradient {
  background: linear-gradient(135deg, #F5D77A 0%, #D4AF37 50%, #AA8C2C 100%);
}

/* 深色背景渐变 */
.dark-gradient {
  background: linear-gradient(180deg, #2C1E0F 0%, #000000 100%);
}

/* 卡片背景渐变 */
.card-gradient {
  background: linear-gradient(145deg, #3A2A1A 0%, #2C1E0F 100%);
}
```

### 3.4 颜色使用规则

```css
/* ✓ 正确 */
color: #D4AF37;           /* 标题、强调 */
color: #FFFFFF;           /* 正文文字 */
color: #B0A090;           /* 次级说明文字 */
background-color: #000000; /* 主背景 */

/* ✗ 错误 */
color: #333333;            /* 太暗，金色不突出 */
background-color: #FFFFFF; /* 太亮，破坏奢华感 */
```

---

## 4. 字体规范

### 4.1 字体栈

```css
/* 英文/数字字体：使用系统字体栈以保证加载速度 */
font-family: -apple-system, BlinkMacSystemFont,
             'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell,
             'Helvetica Neue', sans-serif;

/* 数字字体（财富数字使用 tabular-nums 对齐） */
font-variant-numeric: tabular-nums;

/* 阿拉伯语（v1.1 RTL 支持） */
font-family: 'Noto Sans Arabic', 'Segoe UI', sans-serif;
```

### 4.2 字号系统

| 级别 | 字号 | 用途 | 示例 |
|------|------|------|------|
| Hero | 36px / 2.25rem | 启动页主标题 | "Arab Tycoon Simulator" |
| H1 | 28px / 1.75rem | 页面大标题 | 资产数字 |
| H2 | 22px / 1.375rem | 卡片标题 | 排行榜玩家名 |
| H3 | 18px / 1.125rem | 模块标题 | "Earn Money" |
| Body | 16px / 1rem | 正文内容 | 商品描述 |
| Caption | 14px / 0.875rem | 次级说明 | 冷却时间提示 |
| Micro | 12px / 0.75rem | 辅助信息 | 底部版权 |

### 4.3 字重

| 字重 | 值 | 用途 |
|------|------|------|
| Light | 300 | 辅助说明 |
| Regular | 400 | 正文 |
| Medium | 500 | 按钮文字 |
| Bold | 700 | 重要数字、标题 |
| Black | 900 | 启动页大标题 |

### 4.4 财富数字特殊样式

```css
.wealth-number {
  font-size: 28px;
  font-weight: 900;
  color: #D4AF37;
  font-variant-numeric: tabular-nums;
  text-shadow: 0 0 10px rgba(212, 175, 55, 0.3);
  letter-spacing: -0.5px;
}

.wealth-number.hero {
  font-size: 36px;
  text-shadow: 0 0 20px rgba(212, 175, 55, 0.5);
}
```

---

## 5. 组件库

### 5.1 按钮（Button）

#### 主要按钮（Primary Button）

```css
.btn-primary {
  /* 尺寸 */
  min-height: 52px;
  min-width: 120px;
  padding: 14px 28px;
  border-radius: 12px;

  /* 颜色 */
  background: linear-gradient(135deg, #F5D77A 0%, #D4AF37 50%, #AA8C2C 100%);
  color: #000000;
  font-size: 16px;
  font-weight: 700;

  /* 边框 */
  border: 2px solid #D4AF37;
  box-shadow: 0 4px 15px rgba(212, 175, 55, 0.4);

  /* 交互 */
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(212, 175, 55, 0.6);
}

.btn-primary:active {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(212, 175, 55, 0.3);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}
```

#### 次要按钮（Secondary Button）

```css
.btn-secondary {
  min-height: 48px;
  padding: 12px 24px;
  border-radius: 10px;
  background: transparent;
  color: #D4AF37;
  border: 2px solid #D4AF37;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  background: rgba(212, 175, 55, 0.1);
}
```

#### 图标按钮（Icon Button）

```css
.btn-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(212, 175, 55, 0.1);
  border: 1px solid #8B7355;
  color: #D4AF37;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-icon:active {
  background: rgba(212, 175, 55, 0.3);
  transform: scale(0.95);
}
```

### 5.2 卡片（Card）

#### 商品卡片（Item Card）

```css
.item-card {
  background: linear-gradient(145deg, #3A2A1A 0%, #2C1E0F 100%);
  border: 1px solid #8B7355;
  border-radius: 16px;
  padding: 16px;
  min-height: 180px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.item-card:hover {
  border-color: #D4AF37;
  box-shadow: 0 0 20px rgba(212, 175, 55, 0.2);
  transform: translateY(-4px);
}

.item-card.locked {
  opacity: 0.5;
  filter: grayscale(0.5);
}

.item-card.owned {
  border-color: #4CAF50;
}

.item-card .item-icon {
  font-size: 48px;
  text-align: center;
  padding: 10px 0;
}

.item-card .item-name {
  font-size: 14px;
  font-weight: 600;
  color: #FFFFFF;
  text-align: center;
  margin-top: 8px;
}

.item-card .item-price {
  font-size: 16px;
  font-weight: 700;
  color: #D4AF37;
  text-align: center;
  margin-top: 4px;
}

/* 稀有度边框 */
.item-card.rare    { border-color: #4FC3F7; }
.item-card.epic    { border-color: #BA68C8; }
.item-card.legendary { border-color: #FFD700; }
```

#### 排行榜卡片（Leaderboard Card）

```css
.lb-card {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background: rgba(44, 30, 15, 0.8);
  border-radius: 12px;
  margin-bottom: 8px;
  border: 1px solid transparent;
}

.lb-card.top-1 { border-color: #FFD700; background: rgba(255, 215, 0, 0.1); }
.lb-card.top-2 { border-color: #C0C0C0; }
.lb-card.top-3 { border-color: #CD7F32; }
.lb-card.self  { border-color: #D4AF37; background: rgba(212, 175, 55, 0.1); }

.lb-rank {
  font-size: 20px;
  font-weight: 900;
  width: 36px;
  color: #D4AF37;
  text-align: center;
}

.lb-rank.top-1::before { content: '👑'; }
.lb-rank.top-2::before { content: '🥈'; }
.lb-rank.top-3::before { content: '🥉'; }

.lb-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #4A3728;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  margin: 0 12px;
}

.lb-info {
  flex: 1;
}

.lb-nickname {
  font-size: 15px;
  font-weight: 600;
  color: #FFFFFF;
}

.lb-level {
  font-size: 12px;
  color: #B0A090;
}

.lb-value {
  font-size: 16px;
  font-weight: 700;
  color: #D4AF37;
  font-variant-numeric: tabular-nums;
}
```

### 5.3 状态栏（Status Bar）

```css
.status-bar {
  background: rgba(44, 30, 15, 0.95);
  border-bottom: 1px solid #8B7355;
  padding: 12px 16px;
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.status-bar .cash {
  font-size: 22px;
  font-weight: 900;
  color: #D4AF37;
  font-variant-numeric: tabular-nums;
}

.status-bar .level-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  background: rgba(212, 175, 55, 0.15);
  color: #D4AF37;
  border: 1px solid #D4AF37;
}

.status-bar .total-wealth {
  font-size: 12px;
  color: #B0A090;
}

.status-bar .total-wealth span {
  font-size: 14px;
  font-weight: 700;
  color: #FFFFFF;
}
```

### 5.4 进度条（Progress Bar）

```css
.progress-bar {
  height: 8px;
  background: #4A3728;
  border-radius: 4px;
  overflow: hidden;
  position: relative;
}

.progress-bar .fill {
  height: 100%;
  background: linear-gradient(90deg, #AA8C2C, #D4AF37, #F5D77A);
  border-radius: 4px;
  transition: width 0.5s ease;
}

.progress-bar .label {
  font-size: 11px;
  color: #B0A090;
  margin-top: 4px;
}

/* 冷却倒计时样式 */
.cooldown-bar {
  height: 4px;
  background: #4A3728;
  border-radius: 2px;
  overflow: hidden;
  margin-top: 6px;
}

.cooldown-bar .fill {
  height: 100%;
  background: #FF9800;
  transition: width 1s linear;
}
```

### 5.5 Tab 导航（Bottom Tabs）

```css
.bottom-tabs {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(44, 30, 15, 0.98);
  border-top: 1px solid #8B7355;
  display: flex;
  justify-content: space-around;
  padding: 8px 0;
  padding-bottom: max(8px, env(safe-area-inset-bottom));
  z-index: 200;
}

.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 8px;
  cursor: pointer;
  color: #B0A090;
  transition: all 0.2s ease;
  border: none;
  background: none;
}

.tab-item.active {
  color: #D4AF37;
}

.tab-item .tab-icon {
  font-size: 24px;
  line-height: 1;
}

.tab-item .tab-label {
  font-size: 11px;
  font-weight: 500;
}

.tab-item.active .tab-icon {
  transform: scale(1.1);
  filter: drop-shadow(0 0 6px rgba(212, 175, 55, 0.6));
}
```

### 5.6 模态弹窗（Modal）

```css
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  animation: fadeIn 0.2s ease;
}

.modal-content {
  background: linear-gradient(145deg, #3A2A1A 0%, #2C1E0F 100%);
  border: 2px solid #D4AF37;
  border-radius: 20px;
  padding: 28px 24px;
  max-width: 360px;
  width: 100%;
  text-align: center;
  animation: slideUp 0.3s ease;
}

.modal-title {
  font-size: 22px;
  font-weight: 900;
  color: #D4AF37;
  margin-bottom: 16px;
}

.modal-body {
  color: #FFFFFF;
  font-size: 15px;
  line-height: 1.6;
  margin-bottom: 20px;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
```

---

## 6. 动效规范

### 6.1 时间曲线

```css
/* 快速轻微动效（按钮按压） */
--ease-micro:    cubic-bezier(0.4, 0, 0.2, 1);   /* 150ms */

/* 标准动效（页面切换、卡片 hover） */
--ease-standard: cubic-bezier(0.25, 0.1, 0.25, 1); /* 250ms */

/* 弹性动效（弹窗、升级庆祝） */
--ease-spring:   cubic-bezier(0.34, 1.56, 0.64, 1); /* 350ms */

/* 缓慢优雅动效（背景粒子、金币飘落） */
--ease-slow:     cubic-bezier(0.4, 0, 0.6, 1);   /* 600ms */
```

### 6.2 按钮点击动效

```javascript
// 点击时缩放反馈（0.95），松手后回弹
function onButtonTap(e) {
  const el = e.currentTarget;
  el.style.transform = 'scale(0.95)';
  setTimeout(() => {
    el.style.transform = '';
  }, 150);
}
```

### 6.3 页面切换动效

```css
/* 页面淡入淡出 */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.25s ease;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
}

/* 页面滑动（左/右） */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s var(--ease-standard);
}
.slide-enter-from {
  transform: translateX(100%);
}
.slide-leave-to {
  transform: translateX(-100%);
}
```

### 6.4 数字滚动动效

```javascript
// 财富数字从旧值动画滚动到新值
function animateNumber(el, from, to, duration = 800) {
  const startTime = performance.now();
  const diff = to - from;

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // easeOutExpo
    const eased = 1 - Math.pow(2, -10 * progress);
    const current = Math.round(from + diff * eased);
    el.textContent = formatCurrency(current);
    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }
  requestAnimationFrame(update);
}
```

### 6.5 升级庆祝动效

```javascript
// 升级时触发金色粒子爆炸
function celebrateUpgrade(level) {
  const overlay = document.createElement('div');
  overlay.className = 'upgrade-overlay';
  overlay.innerHTML = `
    <div class="level-up-content">
      <div class="crown-icon">👑</div>
      <div class="level-name">LEVEL UP!</div>
      <div class="new-rank">${getLevelName(level)}</div>
    </div>
  `;
  document.body.appendChild(overlay);

  // 创建金色粒子
  createGoldParticles(50);

  // 2.5 秒后自动消失
  setTimeout(() => {
    overlay.remove();
  }, 2500);
}
```

### 6.6 冷却时间动效

```javascript
// 冷却时间倒计时：圆形进度条
function updateCooldownCircle(btn, remainingSeconds, totalSeconds) {
  const progress = remainingSeconds / totalSeconds;
  const angle = progress * 360;
  btn.style.background =
    `conic-gradient(#FF9800 ${angle}deg, #4A3728 0deg)`;
}
```

---

## 7. 响应式适配

### 7.1 适配范围

| 尺寸 | 设备 | 适配策略 |
|------|------|----------|
| 320px | 小屏 Android | 最小支持宽度，内容不溢出 |
| 360px | 主流 Android | 基准尺寸 |
| 375px | iPhone SE/8 | 基准尺寸 |
| 390px | iPhone 12/13/14 | 基准尺寸 |
| 414px | 大屏 Android/iPhone Plus | 基准尺寸 |
| 480px | 最大竖屏 | 最大宽度，内容居中 |

### 7.2 容器宽度

```css
/* 最大内容宽度 */
.game-container {
  max-width: 480px;
  margin: 0 auto;
  min-height: 100vh;
  background: #000000;
}

/* 内容区域内边距 */
.content-padding {
  padding: 0 16px;
}
```

### 7.3 iOS 安全区域适配

```css
/* 适配 iPhone 刘海屏和底部 Home 指示条 */
body {
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
}

.bottom-tabs {
  padding-bottom: max(8px, env(safe-area-inset-bottom));
}
```

### 7.4 字体响应式

```css
/* 动态字号，根据屏幕宽度调整 */
.game-title {
  font-size: clamp(24px, 6vw, 36px);
}

.wealth-number {
  font-size: clamp(20px, 5.5vw, 28px);
}
```

---

## 8. WhatsApp 内置浏览器兼容性

### 8.1 已知问题清单

| 问题 | 影响 | 解决方案 |
|------|------|----------|
| WebView 不支持 `navigator.share` | 分享功能失效 | 改用 Canvas 生成图片 + 复制链接 |
| WebView 不支持部分 CSS（如 `backdrop-filter`） | 毛玻璃效果不显示 | 使用纯色 fallback |
| WebView 不支持某些 ES6+ 特性 | 代码报错 | Babel 转译（CDN 版已处理） |
| WebView localStorage 限额 5MB | 数据存储不足 | 使用 IndexedDB 或 Firebase |
| WebView 不支持 `pushState`（SPA路由） | 页面刷新 404 | GitHub Pages 配置 404 fallback |
| WebView 不支持 `IntersectionObserver` | 懒加载失效 | 使用替代方案 |

### 8.2 兼容性 CSS Fallback

```css
/* backdrop-filter fallback */
.status-bar {
  background: rgba(44, 30, 15, 0.95); /* fallback */
}

@supports (backdrop-filter: blur(10px)) {
  .status-bar {
    background: rgba(44, 30, 15, 0.85);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
  }
}
```

### 8.3 GitHub Pages SPA 路由配置

在 `404.html` 中添加：

```html
<script>
  // SPA fallback for GitHub Pages
  sessionStorage.setItem('redirect', location.pathname);
  location.href = '/';
</script>
```

---

## 9. 图标与图片规范

### 9.1 Emoji 优先策略

MVP 阶段优先使用 Emoji 作为图标，原因：
- 无需加载图片，加载速度最快
- 所有设备字体支持
- 体积小，维护成本低
- 金色滤镜处理即可统一风格

```css
.icon-gold {
  filter: sepia(1) saturate(3) brightness(1.1) hue-rotate(0deg);
}
```

### 9.2 图片资源规范

| 资源类型 | 格式 | 最大尺寸 | 用途 |
|----------|------|----------|------|
| 头像 | WebP | 64×64px | 用户头像 |
| 商品图标 | WebP | 128×128px | 商店商品展示 |
| 缩略图 | WebP | 200×200px | 排行榜/列表 |
| 海报背景 | WebP | 1080×1920px | 分享海报背景 |
| 背景纹理 | SVG | 500×500px | 可平铺背景 |

---

## 10. 辅助功能

### 10.1 颜色对比度

| 元素 | 颜色 | 背景 | 对比度 | WCAG 等级 |
|------|------|------|--------|----------|
| 正文文字 | #FFFFFF | #000000 | 21:1 | AAA |
| 次级文字 | #B0A090 | #000000 | 7.8:1 | AAA |
| 按钮文字 | #000000 | #D4AF37 | 9.2:1 | AAA |
| 重要数字 | #D4AF37 | #000000 | 11.1:1 | AAA |

### 10.2 可访问性

- 所有按钮有 `aria-label`
- 图片有 `alt` 文本
- 支持 `prefers-reduced-motion`（减少动效）
- 触摸目标最小 44×44px
