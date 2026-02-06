# Webflow 中文翻译助手

一款专为 Webflow 设计的浏览器扩展，将 Webflow 界面自动翻译为简体中文，提升中文用户的使用体验。

## 项目概述

| 属性 | 说明 |
|------|------|
| 名称 | Webflow 中文翻译助手 |
| 版本 | 1.0.0 |
| 类型 | Chrome 浏览器扩展 (Manifest V3) |
| 目标平台 | Webflow (https://webflow.com) |
| 设计风格 | iOS 玻璃拟态 (Glassmorphism) |

## 功能特性

### 核心功能
- **自动翻译**: 页面加载后自动识别并翻译英文界面元素
- **内置词典**: 包含 460+ 条 Webflow 专业术语的预设翻译
- **AI 智能翻译**: 支持接入 OpenAI 格式 API，自动翻译未知词条
- **翻译缓存**: 自动缓存 AI 翻译结果，加速后续访问
- **DOM 监听**: 实时监听页面变化，动态翻译新增内容

### 词典管理
- **自定义词条**: 添加个人专属翻译词条
- **内置词条覆盖**: 修改或禁用内置词典中的词条
- **导入/导出**: 支持 JSON 格式的词典备份与恢复
- **批量操作**: 支持批量导入、清空等操作

### 用户界面
- **弹出窗口**: 快速开关翻译、查看统计、执行翻译
- **选项页面**: 完整的词典管理和 API 设置
- **iOS 风格设计**: 简约现代的玻璃拟态视觉风格

## 项目结构

```
webflow-cn-translator/
├── manifest.json          # 扩展配置文件
├── background.js          # 后台服务脚本 (Service Worker)
├── content.js             # 内容脚本 (注入 Webflow 页面)
├── content.css            # 内容脚本样式
├── popup.html             # 弹出窗口 HTML
├── popup.js               # 弹出窗口脚本
├── popup.css              # 弹出窗口样式
├── options.html           # 选项页面 HTML
├── options.js             # 选项页面脚本
├── options.css            # 选项页面样式
├── icons/                 # 扩展图标
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── js/                    # 核心模块文件夹
    ├── dictionary.js      # 词典模块 - 470条内置词条
    ├── storage.js         # 存储管理模块 - 缓存与设置
    └── translator.js      # AI 翻译引擎模块
```

## 技术架构

### 架构图

```
┌─────────────────────────────────────────────────────────────────────┐
│                         Chrome Extension                             │
├─────────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────────┐  │
│  │   Popup     │  │   Options   │  │      Content Script         │  │
│  │  (popup.js) │  │  (options.js)│  │       (content.js)          │  │
│  └──────┬──────┘  └──────┬──────┘  └──────────────┬──────────────┘  │
│         │                │                        │                 │
│         └────────────────┼────────────────────────┘                 │
│                          │                                          │
│                   ┌──────▼──────────────────┐                      │
│                   │      Background         │                      │
│                   │     (Service Worker)    │                      │
│                   └──────┬──────────────────┘                      │
│                          │                                          │
│         ┌────────────────┼────────────────┐                        │
│         ▼                ▼                ▼                        │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐               │
│  │   js/模块    │ │ chrome.storage│ │   AI API     │               │
│  ├──────────────┤ ├──────────────┤ ├──────────────┤               │
│  │dictionary.js │ │ 自定义词典    │ │ OpenAI 格式  │               │
│  │  (470+词条)  │ │ builtInOverrides│ │  兼容接口    │               │
│  ├──────────────┤ ├──────────────┤ └──────────────┘               │
│  │ storage.js   │ │ translationCache│                                │
│  │TranslationStorage│ │  (LRU缓存)   │                                │
│  │SettingsStorage├──────────────┤                                │
│  ├──────────────┤ │ userSettings  │                                │
│  │translator.js │ │  (同步存储)   │                                │
│  │ AITranslator │ └──────────────┘                                │
│  └──────────────┘                                                   │
└─────────────────────────────────────────────────────────────────────┘
```

### 核心组件说明

#### 1. Background Script (background.js)
- **类型**: Service Worker (Manifest V3)
- **职责**:
  - 维护内置词典 (BUILT_IN_DICTIONARY)
  - 管理自定义词典和内置词条覆盖
  - 处理翻译缓存
  - 执行 AI 翻译 API 调用
  - 响应来自 Popup、Options、Content Script 的消息

#### 2. Content Script (content.js)
- **注入时机**: document_idle
- **匹配域名**: webflow.com, *.webflow.com
- **职责**:
  - 遍历页面 DOM，提取需要翻译的文本
  - 批量发送翻译请求到 Background
  - 应用翻译结果到页面元素
  - 监听 DOM 变化，翻译动态新增内容
  - 支持恢复原始文本

#### 3. Popup (popup.html/js)
- **触发方式**: 点击扩展图标
- **功能**:
  - 快速启用/禁用翻译
  - 手动触发翻译/恢复
  - 显示词典统计
  - 快捷设置选项

#### 4. Options Page (options.html/js)
- **打开方式**: 右键扩展图标 → 选项
- **功能模块**:
  - 词典管理 (添加、搜索、导入导出)
  - 内置词条管理 (修改、禁用、重置)
  - API 设置 (配置 AI 翻译接口)
  - 缓存管理 (导出、导入、清空)
  - 关于页面

#### 5. 核心模块 (js/)

**dictionary.js** - 词典管理模块
- `Dictionary` 类：管理内置和自定义词典
- 470+ 条内置词条，涵盖 Webflow 所有界面元素
- 支持精确匹配和部分匹配翻译
- 提供词条搜索、导入导出功能

**storage.js** - 存储管理模块
- `TranslationStorage` 类：翻译缓存管理
  - 最大 10000 条缓存
  - LRU 淘汰策略
  - 支持导入导出
- `SettingsStorage` 类：用户设置管理
  - 默认设置持久化
  - 支持设置导入导出

**translator.js** - AI 翻译引擎
- `AITranslator` 类：调用 AI API 进行翻译
- 支持单条和批量翻译
- 请求去重和并发控制
- 自动重试机制
- 30秒超时保护

## 翻译流程

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  页面加载    │────▶│  提取文本    │────▶│  批量翻译    │────▶│  应用翻译    │
│             │     │             │     │             │     │             │
└─────────────┘     └─────────────┘     └──────┬──────┘     └─────────────┘
                                               │
                         ┌─────────────────────┼─────────────────────┐
                         │                     │                     │
                         ▼                     ▼                     ▼
                  ┌────────────┐       ┌────────────┐       ┌────────────┐
                  │ 内置词典匹配 │       │ 缓存匹配    │       │ AI 翻译    │
                  │ (优先)      │       │ (次之)      │       │ (最后)      │
                  └────────────┘       └────────────┘       └────────────┘
```

### 翻译优先级
1. **内置词典**: 硬编码的 460+ 条专业术语
2. **自定义词典**: 用户添加的词条 (覆盖内置)
3. **内置覆盖**: 用户对内置词条的修改
4. **翻译缓存**: 之前 AI 翻译的结果
5. **AI 翻译**: 调用 API 实时翻译 (需配置)

## 数据存储

### Storage Schema

```javascript
// chrome.storage.sync - 用户设置
{
  "userSettings": {
    "enabled": true,           // 是否启用翻译
    "autoTranslate": true,     // 是否自动翻译
    "useAI": false,            // 是否使用 AI 翻译
    "showOriginal": false,     // 是否悬停显示原文
    "highlightTranslated": false, // 是否高亮已翻译
    "apiUrl": "https://api.gemai.cc/v1/chat/completions",
    "apiKey": "",              // API Key (加密存储)
    "model": "claude-haiku-4-5-20251001",
    "translateDelay": 100,     // 翻译延迟 (ms)
    "batchSize": 10,           // 批量翻译大小
    "maxRetries": 3            // 最大重试次数
  }
}

// chrome.storage.local - 词典和缓存
{
  "customDictionary": {        // 自定义词典
    "Custom Term": "自定义词条"
  },
  "builtInOverrides": {        // 内置词条覆盖
    "Original": "修改后的翻译"
  },
  "disabledBuiltIn": [         // 禁用的内置词条
    "Disabled Term"
  ],
  "translationCache": {        // 翻译缓存
    "cached text": {
      "translation": "缓存的翻译",
      "source": "ai",          // ai / dictionary
      "createdAt": 1234567890,
      "lastAccess": 1234567890
    }
  }
}
```

## API 接口

### 支持的 API 格式
- OpenAI Chat Completions API
- 任何兼容 OpenAI 格式的 API 服务

### 默认配置
```javascript
{
  apiUrl: 'https://api.gemai.cc/v1/chat/completions',
  model: 'claude-haiku-4-5-20251001'
}
```

### 请求格式
```json
{
  "model": "your-model",
  "messages": [
    {
      "role": "system",
      "content": "翻译提示词..."
    },
    {
      "role": "user",
      "content": "翻译：要翻译的文本"
    }
  ],
  "temperature": 0.1,
  "max_tokens": 200
}
```

## 消息通信

### 消息类型

| Action | 发送方 | 接收方 | 说明 |
|--------|--------|--------|------|
| `getSettings` | Popup/Options | Background | 获取用户设置 |
| `updateSettings` | Popup/Options | Background | 更新用户设置 |
| `translateBatch` | Content | Background | 批量翻译文本 |
| `toggleTranslation` | Popup | Content | 开关翻译 |
| `translatePage` | Popup | Content | 触发页面翻译 |
| `restoreOriginal` | Popup | Content | 恢复原文 |
| `getDictionaryStats` | Popup/Options | Background | 获取词典统计 |
| `addDictionaryEntry` | Options | Background | 添加自定义词条 |
| `exportDictionary` | Options | Background | 导出词典 |
| `importDictionary` | Options | Background | 导入词典 |
| `getBuiltInEntries` | Options | Background | 获取内置词条列表 |
| `updateBuiltInEntry` | Options | Background | 修改内置词条 |
| `disableBuiltInEntry` | Options | Background | 禁用内置词条 |
| `enableBuiltInEntry` | Options | Background | 启用内置词条 |
| `resetAllBuiltIn` | Options | Background | 重置所有内置修改 |
| `clearCache` | Popup/Options | Background | 清空翻译缓存 |
| `testAPI` | Options | Background | 测试 API 连接 |

## 样式设计

### 设计系统
- **风格**: iOS 玻璃拟态 (Glassmorphism)
- **配色**: iOS 系统色
  - 主色: `#007aff` (iOS Blue)
  - 成功: `#34c759` (iOS Green)
  - 警告: `#ff9500` (iOS Orange)
  - 错误: `#ff3b30` (iOS Red)
- **字体**: -apple-system, SF Pro Text, Noto Sans SC
- **圆角**: 8px(sm), 12px(md), 16px(lg), 20px(xl)
- **阴影**: 柔和的多层阴影

### CSS 变量
```css
:root {
  --ios-blue: #007aff;
  --ios-green: #34c759;
  --ios-orange: #ff9500;
  --ios-red: #ff3b30;
  --glass-bg: rgba(255, 255, 255, 0.72);
  --glass-border: rgba(0, 0, 0, 0.08);
}
```

## 安装与使用

### 开发环境安装
1. 克隆或下载项目代码
2. 打开 Chrome 浏览器，进入 `chrome://extensions/`
3. 开启右上角"开发者模式"
4. 点击"加载已解压的扩展程序"
5. 选择项目文件夹

### 使用流程
1. 访问 Webflow 网站 (webflow.com)
2. 点击扩展图标，启用翻译
3. 页面自动翻译为中文
4. 点击"词典管理"进入选项页，管理词条和设置

### 配置 AI 翻译 (可选)
1. 打开选项页 → API 设置
2. 填写 API 地址和 API Key
3. 选择模型名称
4. 点击"测试连接"验证
5. 在弹出窗口开启"使用 AI 翻译"

## 内置词典分类

| 分类 | 词条数量 | 示例 |
|------|----------|------|
| 主导航 | 8 | Dashboard, Designer, Editor |
| 元素面板 | 8 | Elements, Typography, Forms |
| 结构元素 | 11 | Section, Container, Grid |
| 基础元素 | 8 | Button, Heading, Paragraph |
| 表单元素 | 13 | Input, Checkbox, Select |
| 媒体元素 | 8 | Image, Video, Lottie |
| 导航元素 | 7 | Navbar, Dropdown |
| 样式面板 | 15 | Selector, States, Layout |
| 布局属性 | 20 | Display, Position, Flexbox |
| 排版 | 18 | Font, Color, Text Align |
| 背景/边框 | 15 | Background, Border, Shadow |
| 效果/交互 | 20 | Opacity, Animation, Transition |
| CMS | 15 | Collections, Fields |
| 页面/站点设置 | 20 | SEO, Publishing, Hosting |
| 操作 | 27 | Add, Delete, Copy, Undo, Filter, Sort |
| 通用 | 30 | Loading, Error, Success |
| 账户相关 | 15 | Account, Workspace, Project |
| 其他 | 22 | Name, Type, Value, Preview, Link |

**总计**: 470 条内置词条 (详见 `js/dictionary.js`)

## 浏览器兼容性

- Chrome 88+
- Edge 88+
- 其他基于 Chromium 的浏览器

## 权限说明

| 权限 | 用途 |
|------|------|
| `storage` | 存储词典、缓存和设置 |
| `activeTab` | 与当前标签页通信 |
| `scripting` | 注入内容脚本 |
| `host_permissions` | 访问 webflow.com 域名 |

## 开发计划

### 已实现
- [x] 基础翻译功能
- [x] 内置词典 (470 词条，模块化设计)
- [x] AI 翻译支持
- [x] 翻译缓存 (LRU 策略，最大 10000 条)
- [x] 词典导入/导出
- [x] 内置词条管理 (修改/禁用/重置)
- [x] iOS 风格 UI (玻璃拟态设计)
- [x] 模块化架构 (js/ 核心模块)

### 待实现
- [ ] 深色模式优化
- [ ] 更多第三方 API 支持
- [ ] 翻译质量反馈
- [ ] 协作词典共享
- [ ] 快捷键支持

## 贡献指南

欢迎提交 Issue 和 Pull Request!

### 提交新词条
1. 在 `js/dictionary.js` 的 `BUILT_IN_DICTIONARY` 中添加词条
2. 遵循现有分类组织
3. 保持翻译简洁专业
4. 提交 PR 时说明词条用途

### 模块开发
- `js/dictionary.js` - 词典管理类，支持精确/部分匹配
- `js/storage.js` - 存储管理，包含缓存和设置管理
- `js/translator.js` - AI 翻译引擎，支持批量翻译

## 许可证

MIT License

## 联系方式

如有问题或建议，请通过 GitHub Issues 反馈。
