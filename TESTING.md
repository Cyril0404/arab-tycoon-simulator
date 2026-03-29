# 测试计划文档

> **项目**: Arab Tycoon Simulator
> **版本**: v1.0
> **最后更新**: 2026-03-29

---

## 1. 测试策略概述

### 1.1 测试金字塔

```
        ┌─────────────┐
        │    E2E     │  ← Playwright（最高层，最慢，最贵）
        │   Tests    │
        ├─────────────┤
        │ Integration │  ← Vue Test Utils + Firebase Emulator
        │   Tests    │
        ├─────────────┤
        │ Unit Tests │  ← Vitest（最底层，最快，最便宜）
        └─────────────┘
```

### 1.2 测试工具选型

| 层级 | 工具 | 理由 |
|------|------|------|
| 单元测试 | Vitest | 快、ESM 支持好、和 Vite 集成、API 接近 Jest |
| 集成测试 | Vue Test Utils + Vitest | Vue 官方测试库 |
| E2E 测试 | Playwright | 支持 WhatsApp WebView、跨浏览器、强移动端支持 |
| Firebase 测试 | Firebase Emulator | 本地模拟 Firestore，无需真实数据库 |

---

## 2. 单元测试（Vitest）

### 2.1 项目配置

```bash
# 安装 Vitest
npm install -D vitest @vitejs/plugin-vue vue-test-utils happy-dom

# vite.config.js
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'happy-dom',
    include: ['tests/unit/**/*.test.js']
  }
});
```

### 2.2 核心测试用例

#### 2.2.1 等级计算测试

```javascript
// tests/unit/level.test.js
import { describe, it, expect } from 'vitest';
import { calculateLevel, LEVELS } from '../../js/utils/level.js';

describe('calculateLevel', () => {
  it('returns level 1 for 0 wealth', () => {
    expect(calculateLevel(0)).toBe(1);
  });

  it('returns level 1 for wealth < 100,000', () => {
    expect(calculateLevel(50_000)).toBe(1);
    expect(calculateLevel(99_999)).toBe(1);
  });

  it('returns level 2 for wealth >= 100,000', () => {
    expect(calculateLevel(100_000)).toBe(2);
    expect(calculateLevel(500_000)).toBe(2);
  });

  it('returns level 3 for wealth >= 1,000,000', () => {
    expect(calculateLevel(1_000_000)).toBe(3);
    expect(calculateLevel(50_000_000)).toBe(3);
  });

  it('returns level 4 for wealth >= 100,000,000', () => {
    expect(calculateLevel(100_000_000)).toBe(4);
  });

  it('returns level 5 for wealth >= 10,000,000,000', () => {
    expect(calculateLevel(10_000_000_000)).toBe(5);
    expect(calculateLevel(999_999_999_999)).toBe(5);
  });
});
```

#### 2.2.2 冷却时间测试

```javascript
// tests/unit/cooldown.test.js
import { describe, it, expect } from 'vitest';
import { isCooldownReady, getRemainingSeconds } from '../../js/utils/cooldown.js';

describe('isCooldownReady', () => {
  it('returns true if no cooldown ever set', () => {
    const cooldowns = { work: null, business: null, oil: null };
    const now = Date.now();
    expect(isCooldownReady(cooldowns, 'work', now)).toBe(true);
  });

  it('returns true if cooldown has expired', () => {
    const pastTime = new Date(Date.now() - 120_000).toISOString(); // 2 min ago
    const cooldowns = { work: pastTime };
    const now = Date.now();
    expect(isCooldownReady(cooldowns, 'work', now)).toBe(true);
  });

  it('returns false if cooldown is still active', () => {
    const futureTime = new Date(Date.now() + 60_000).toISOString(); // 1 min later
    const cooldowns = { work: futureTime };
    const now = Date.now();
    expect(isCooldownReady(cooldowns, 'work', now)).toBe(false);
  });
});

describe('getRemainingSeconds', () => {
  it('returns 0 if no cooldown set', () => {
    expect(getRemainingSeconds(null)).toBe(0);
  });

  it('returns positive seconds if cooldown is future', () => {
    const futureTime = new Date(Date.now() + 30_000).toISOString();
    const remaining = getRemainingSeconds(futureTime);
    expect(remaining).toBeGreaterThan(29);
    expect(remaining).toBeLessThanOrEqual(30);
  });
});
```

#### 2.2.3 石油投资随机性测试

```javascript
// tests/unit/oil-investment.test.js
import { describe, it, expect } from 'vitest';
import { calculateOilInvestment } from '../../js/utils/game.js';

describe('calculateOilInvestment', () => {
  it('returns either success or failure', () => {
    const results = { success: 0, failure: 0 };
    // 运行 1000 次统计
    for (let i = 0; i < 1000; i++) {
      const result = calculateOilInvestment();
      if (result.success) results.success++;
      else results.failure++;
    }
    // 成功率应该在 40%-60% 之间（蒙特卡洛容忍度）
    expect(results.success).toBeGreaterThan(350);
    expect(results.success).toBeLessThan(650);
  });

  it('returns correct amounts', () => {
    const successResult = calculateOilInvestment();
    if (successResult.success) {
      expect(successResult.earnings).toBe(1_000_000);
    } else {
      expect(successResult.earnings).toBe(-500_000);
    }
  });
});
```

#### 2.2.4 财富计算测试

```javascript
// tests/unit/wealth.test.js
import { describe, it, expect } from 'vitest';
import { calculateTotalWealth } from '../../js/utils/wealth.js';

describe('calculateTotalWealth', () => {
  it('equals cash when no items owned', () => {
    const cash = 5000;
    const inventory = [];
    expect(calculateTotalWealth(cash, inventory)).toBe(5000);
  });

  it('includes item prices in total wealth', () => {
    const cash = 1000;
    const inventory = [
      { itemId: 'car_002', count: 1 },
      { itemId: 'lux_001', count: 1 }
    ];
    const items = {
      car_002: { price: 3_000_000 },
      lux_001: { price: 500_000 }
    };
    expect(calculateTotalWealth(cash, inventory, items)).toBe(3_501_000);
  });
});
```

### 2.3 运行单元测试

```bash
# 运行所有测试
npm run test

# 监听模式（开发时）
npm run test:watch

# 生成覆盖率报告
npm run test:coverage
```

---

## 3. E2E 测试（Playwright）

### 3.1 项目配置

```bash
# 安装 Playwright
npm install -D @playwright/test

# 初始化 Playwright
npx playwright install --with-deps chromium
```

创建 `playwright.config.js`：

```javascript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',

  use: {
    baseURL: 'http://localhost:8080',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'safari',
      use: { ...devices['iPhone 12'] },
    },
  ],

  webServer: {
    command: 'npx serve . -l 8080',
    port: 8080,
    reuseExistingServer: !process.env.CI,
  },
});
```

### 3.2 E2E 测试用例

#### 3.2.1 启动页测试

```javascript
// tests/e2e/splash.spec.js
import { test, expect } from '@playwright/test';

test.describe('Splash Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('displays game title', async ({ page }) => {
    await expect(page.locator('.game-title')).toContainText('Arab Tycoon Simulator');
  });

  test('displays subtitle text', async ({ page }) => {
    await expect(page.locator('.subtitle')).toContainText('Start with 1,000 AED');
  });

  test('Start Game button is visible and clickable', async ({ page }) => {
    const btn = page.locator('.btn-start');
    await expect(btn).toBeVisible();
    await expect(btn).toHaveText('Start Game');
    await btn.click();
    // 跳转到主页
    await expect(page).toHaveURL(/\/home/);
  });
});
```

#### 3.2.2 赚钱功能测试

```javascript
// tests/e2e/earn.spec.js
import { test, expect } from '@playwright/test';

test.describe('Earn Money', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // 点击开始游戏（如果有启动页）
    const startBtn = page.locator('.btn-start');
    if (await startBtn.isVisible()) {
      await startBtn.click();
    }
  });

  test('Work button earns 1000 AED', async ({ page }) => {
    // 获取初始资产
    const initialWealth = await page.locator('.total-wealth').textContent();
    const initialValue = parseWealthNumber(initialWealth);

    // 点击打工按钮
    const workBtn = page.locator('.btn-work');
    await expect(workBtn).toBeEnabled();
    await workBtn.click();

    // 验证资产增加
    await page.waitForTimeout(500); // 等待 UI 更新
    const newWealth = await page.locator('.total-wealth').textContent();
    const newValue = parseWealthNumber(newWealth);
    expect(newValue - initialValue).toBe(1000);
  });

  test('Work button shows cooldown after clicking', async ({ page }) => {
    const workBtn = page.locator('.btn-work');
    await workBtn.click();

    // 按钮应该变为禁用状态（冷却中）
    await expect(workBtn).toBeDisabled();
    await expect(page.locator('.cooldown-text')).toContainText('59');
  });
});
```

#### 3.2.3 购买商品测试

```javascript
// tests/e2e/shop.spec.js
import { test, expect } from '@playwright/test';

test.describe('Shop - Purchase', () => {
  test('can purchase item when has enough money', async ({ page }) => {
    await page.goto('/#/home/shop');

    // 找到劳斯莱斯（5,000,000 AED，需要钱够）
    // 先打工赚钱到够买一个奢侈品
    // 注意：这里简化测试，实际需要多次操作

    const ajSneakers = page.locator('.item-card[data-item-id="lux_003"]');
    await ajSneakers.locator('.btn-buy').click();

    // 确认购买弹窗出现
    await expect(page.locator('.confirm-modal')).toBeVisible();

    // 确认购买
    await page.locator('.confirm-btn').click();

    // 验证已购标识出现
    await expect(ajSneakers.locator('.owned-badge')).toBeVisible();
  });

  test('cannot purchase locked item', async ({ page }) => {
    await page.goto('/#/home/shop');

    // 棕榈岛别墅（需要 Lv4 = 100M），刚注册用户没有
    const palmVilla = page.locator('.item-card[data-item-id="prop_002"]');
    await expect(palmVilla).toHaveClass(/locked/);
    await palmVilla.locator('.btn-buy').click();

    // 应该显示等级不足提示
    await expect(page.locator('.toast')).toContainText('Level');
  });
});
```

#### 3.2.4 排行榜测试

```javascript
// tests/e2e/leaderboard.spec.js
import { test, expect } from '@playwright/test';

test.describe('Leaderboard', () => {
  test('displays top 3 with crown icons', async ({ page }) => {
    await page.goto('/#/leaderboard');

    const topThree = page.locator('.lb-card').first(3);
    await expect(topThree).toHaveCount(3);

    // 第1名应该有金色皇冠
    await expect(topThree.nth(0).locator('.lb-rank')).toHaveClass(/top-1/);
    await expect(topThree.nth(1).locator('.lb-rank')).toHaveClass(/top-2/);
    await expect(topThree.nth(2).locator('.lb-rank')).toHaveClass(/top-3/);
  });

  test('can switch between different leaderboard tabs', async ({ page }) => {
    await page.goto('/#/leaderboard');

    // 点击豪车榜
    await page.locator('.lb-tab[data-category="carValue"]').click();
    await expect(page.locator('.lb-card').first()).toBeVisible();

    // 点击豪宅榜
    await page.locator('.lb-tab[data-category="propertyValue"]').click();
    await expect(page.locator('.lb-card').first()).toBeVisible();
  });
});
```

### 3.3 运行 E2E 测试

```bash
# 运行所有 E2E 测试
npm run test:e2e

# 在特定浏览器运行
npx playwright test --project=chromium

# 交互模式（浏览器可视化）
npx playwright test --project=chromium --headed

# 生成测试报告
npx playwright show-report
```

---

## 4. 兼容性测试矩阵

### 4.1 浏览器兼容性

| 浏览器 | 版本 | 支持等级 | 备注 |
|--------|------|----------|------|
| Chrome Android | 120+ | ✅ 完全支持 | 首选调试浏览器 |
| Safari iOS | 16+ | ✅ 完全支持 | iPhone 用户主力 |
| WhatsApp WebView (Android) | System WebView 120+ | ✅ 完全支持 | 核心场景 |
| WhatsApp WebView (iOS) | WKWebView | ⚠️ 部分支持 | Service Worker 可能不支持 |
| Samsung Internet | 20+ | ✅ 完全支持 | 三星手机用户 |
| Firefox Android | 120+ | ✅ 基本支持 | - |
| WeChat WebView | 8.0+ | ⚠️ 基本支持 | 仅备选 |

### 4.2 设备兼容性

| 设备类型 | 屏幕宽度 | 目标效果 |
|----------|----------|----------|
| 小屏手机（iPhone SE） | 320px | 内容不溢出，可滚动 |
| 中屏手机（iPhone 12/13/14） | 375px | 完美显示 |
| 大屏手机（iPhone Plus/Max） | 390-414px | 完美显示 |
| 超大屏（折叠屏展开） | 480px | 内容居中，两侧留白 |

### 4.3 网络环境

| 网络 | 模拟条件 | 目标 |
|------|----------|------|
| 4G | 50ms 延迟，1.5Mbps | 首屏 < 3s |
| 3G | 150ms 延迟，400Kbps | 功能可用 |
| 弱网 | 300ms 延迟，100Kbps | 基本功能 |

---

## 5. 性能测试指标

### 5.1 性能指标定义

| 指标 | 目标值 | 测量方法 |
|------|--------|----------|
| 首屏加载时间（FCP） | < 2.0s | Lighthouse |
| 最大内容绘制（LCP） | < 3.0s | Lighthouse |
| 总阻塞时间（TBT） | < 200ms | Lighthouse |
| 首次交互（TTI） | < 3.0s | Lighthouse |
| 页面大小（未压缩） | < 500KB | Lighthouse |
| 游戏内响应延迟 | < 100ms | 手动测试 |
| 动画帧率 | ≥ 30 FPS | Chrome DevTools |

### 5.2 性能测试脚本

```javascript
// tests/performance/lighthouse.spec.js
import { test, expect } from '@playwright/test';

test('Performance Score >= 80', async ({ page }) => {
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text());
  });

  await page.goto('/', { waitUntil: 'networkidle' });

  // Lighthouse 性能检查（需要 lighthouse npm 包）
  const { default: lighthouse } = await import('lighthouse');
  const result = await lighthouse(page.url(), {
    onlyCategories: ['performance'],
    port: 9222
  });

  const score = result.lhr.categories.performance.score * 100;
  console.log(`Lighthouse Score: ${score}`);
  expect(score).toBeGreaterThanOrEqual(80);
  expect(errors).toHaveLength(0); // 无 console.error
});
```

### 5.3 首屏加载时间测试

```javascript
// tests/performance/load-time.spec.js
import { test, expect } from '@playwright/test';

test('First contentful paint < 2s', async ({ page }) => {
  // 使用 Performance API
  await page.goto('/', { waitUntil: 'domcontentloaded' });

  const paintMetrics = await page.evaluate(() => {
    const navStart = performance.getEntriesByType('navigation')[0];
    const paintEntries = performance.getEntriesByType('paint');
    const fcp = paintEntries.find(e => e.name === 'first-contentful-paint');
    return {
      domContentLoaded: navStart.domContentLoadedEnd - navStart.startTime,
      fcp: fcp ? fcp.startTime : null
    };
  });

  console.log('FCP:', paintMetrics.fcp, 'ms');
  expect(paintMetrics.fcp).toBeLessThan(2000);
});
```

---

## 6. 测试用例设计汇总

### 6.1 核心流程测试用例

| 用例编号 | 用例名称 | 前置条件 | 测试步骤 | 预期结果 |
|----------|---------|---------|---------|---------|
| TC-01 | 新用户启动游戏 | 无 | 打开链接 → 点击 Start Game | 跳转主页，初始金币 1000 |
| TC-02 | 打工赚钱 | 主页 | 点击打工按钮 | 金币 +1000，出现冷却倒计时 |
| TC-03 | 冷却时间验证 | 刚打完工 | 再次点击打工按钮 | 按钮禁用，提示冷却中 |
| TC-04 | 购买奢侈品 | 金币足够 | 打开商店 → 点击 AJ 球鞋购买 | 金币扣除，装备出现在背包 |
| TC-05 | 等级升级 | 资产达到 100K | 赚钱到 10 万 | 全屏升级特效，弹出升级提示 |
| TC-06 | 查看排行榜 | 已有多名用户 | 点击排行榜 Tab | 显示前 100 名，有皇冠标识 |
| TC-07 | 添加好友 | 知道对方 ID | 搜索 → 添加 | 好友出现在好友列表 |
| TC-08 | PK 对战 | 互为好友 | 点击 PK → 对方接受 | 显示对战结果，胜者获称号 |
| TC-09 | 分享到 WhatsApp | 财富 > 0 | 点击分享 → 选择 WhatsApp | 生成海报，链接已复制 |
| TC-10 | WhatsApp 内打开 | 从 WhatsApp 打开链接 | 点击分享的链接 | 游戏正常加载，数据同步 |

### 6.2 边界情况测试用例

| 用例编号 | 用例名称 | 测试场景 | 预期结果 |
|----------|---------|---------|---------|
| BC-01 | 余额不足购买 | 金币 500，点击 1000 商品 | 按钮禁用，提示余额不足 |
| BC-02 | 等级不足解锁 | Lv1 用户点击 Lv3 商品 | 显示锁定状态，不可购买 |
| BC-03 | 网络断开赚钱 | 开启飞行模式，点击打工 | 弹出网络错误提示 |
| BC-04 | 刷新页面数据恢复 | 赚钱后刷新页面 | 数据从 Firestore 恢复 |
| BC-05 | 超大财富数字显示 | 财富超过 10 亿 | 正确显示 "10.5B AED" |
| BC-06 | 同时多标签页 | 两个标签页同时操作 | 数据最终一致（Firebase 处理） |

---

## 7. 测试报告模板

每个 Sprint 结束时生成测试报告：

```markdown
## Arab Tycoon Simulator - Test Report
**版本**: v1.0.0
**测试日期**: 2026-03-29
**测试人员**: QA Team

### 执行摘要
- 总测试用例：50
- 通过：48
- 失败：2
- 阻塞：0
- 通过率：96%

### 测试结果详情
| 模块 | 用例数 | 通过 | 失败 |
|------|--------|------|------|
| 启动页 | 5 | 5 | 0 |
| 赚钱系统 | 10 | 10 | 0 |
| 商店系统 | 8 | 8 | 0 |
| 排行榜 | 6 | 5 | 1 |
| 好友系统 | 8 | 7 | 1 |
| 分享功能 | 5 | 5 | 0 |
| 性能测试 | 4 | 4 | 0 |
| 兼容性 | 4 | 4 | 0 |

### 失败的测试用例
- LB-04: 切换 Tab 后排行榜卡顿（>1s），需优化 Firestore 查询
- FR-03: 送礼后好友列表未实时更新，Firebase 订阅失效

### 遗留问题（不影响上线）
- [低] 弱网环境下超时提示不友好
- [低] iOS Safari 首次加载动画有掉帧
```
