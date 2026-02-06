/**
 * Background Service Worker
 * 后台服务脚本 - 处理消息和 API 请求
 */

// 导入模块（通过 importScripts 无法在 Service Worker 中使用，需要内联代码）

// ============ 内置词典 ============
const BUILT_IN_DICTIONARY = {
  // 主导航
  "Dashboard": "仪表板",
  "Designer": "设计器",
  "Editor": "编辑器",
  "Settings": "设置",
  "Publish": "发布",
  "Preview": "预览",
  "Export": "导出",
  "Import": "导入",
  
  // 元素面板
  "Elements": "元素",
  "Add Elements": "添加元素",
  "Structure": "结构",
  "Basic": "基础",
  "Typography": "排版",
  "Forms": "表单",
  "Media": "媒体",
  "Components": "组件",
  "Layouts": "布局",
  
  // 结构元素
  "Section": "区块",
  "Container": "容器",
  "Columns": "列",
  "Grid": "网格",
  "Div Block": "Div 块",
  "List": "列表",
  "List Item": "列表项",
  "Link Block": "链接块",
  "V Flex": "垂直弹性布局",
  "H Flex": "水平弹性布局",
  "Quick Stack": "快速堆叠",
  
  // 基础元素
  "Button": "按钮",
  "Link": "链接",
  "Text Link": "文本链接",
  "Heading": "标题",
  "Paragraph": "段落",
  "Text Block": "文本块",
  "Block Quote": "引用块",
  "Rich Text": "富文本",
  
  // 表单元素
  "Form Block": "表单块",
  "Form": "表单",
  "Label": "标签",
  "Input": "输入框",
  "Text Field": "文本字段",
  "Text Area": "文本区域",
  "Checkbox": "复选框",
  "Radio Button": "单选按钮",
  "Select": "下拉选择",
  "File Upload": "文件上传",
  "Submit Button": "提交按钮",
  "Success Message": "成功消息",
  "Error Message": "错误消息",
  
  // 媒体元素
  "Image": "图片",
  "Video": "视频",
  "Background Video": "背景视频",
  "YouTube": "YouTube",
  "Vimeo": "Vimeo",
  "Lottie Animation": "Lottie 动画",
  "Spline Scene": "Spline 场景",
  
  // 导航元素
  "Navbar": "导航栏",
  "Navigation": "导航",
  "Nav Menu": "导航菜单",
  "Nav Link": "导航链接",
  "Dropdown": "下拉菜单",
  "Dropdown Toggle": "下拉开关",
  "Dropdown List": "下拉列表",
  "Menu Button": "菜单按钮",
  
  // 样式面板
  "Style": "样式",
  "Styles": "样式",
  "Style Panel": "样式面板",
  "Selector": "选择器",
  "States": "状态",
  "None": "无",
  "Hover": "悬停",
  "Pressed": "按下",
  "Focused": "聚焦",
  "Visited": "已访问",
  "Placeholder": "占位符",
  
  // 布局属性
  "Layout": "布局",
  "Display": "显示",
  "Block": "块级",
  "Flex": "弹性",
  "Inline Block": "行内块",
  "Inline": "行内",
  "Position": "定位",
  "Static": "静态",
  "Relative": "相对",
  "Absolute": "绝对",
  "Fixed": "固定",
  "Sticky": "粘性",
  "Float": "浮动",
  "Clear": "清除",
  "Overflow": "溢出",
  "Visible": "可见",
  "Hidden": "隐藏",
  "Scroll": "滚动",
  "Auto": "自动",
  
  // Flexbox
  "Direction": "方向",
  "Horizontal": "水平",
  "Vertical": "垂直",
  "Justify": "主轴对齐",
  "Align": "交叉轴对齐",
  "Start": "起始",
  "Center": "居中",
  "End": "结束",
  "Space Between": "两端对齐",
  "Space Around": "均匀分布",
  "Space Evenly": "等间距",
  "Stretch": "拉伸",
  "Baseline": "基线",
  "Wrap": "换行",
  "Nowrap": "不换行",
  "Children": "子元素",
  "Gap": "间距",
  "Row Gap": "行间距",
  "Column Gap": "列间距",
  
  // 尺寸
  "Size": "尺寸",
  "Sizing": "尺寸调整",
  "Width": "宽度",
  "Height": "高度",
  "Min Width": "最小宽度",
  "Max Width": "最大宽度",
  "Min Height": "最小高度",
  "Max Height": "最大高度",
  "Fit": "适应",
  
  // 间距
  "Spacing": "间距",
  "Margin": "外边距",
  "Padding": "内边距",
  "Top": "上",
  "Right": "右",
  "Bottom": "下",
  "Left": "左",
  "All Sides": "所有边",
  
  // 排版
  "Font": "字体",
  "Font Family": "字体族",
  "Font Size": "字号",
  "Font Weight": "字重",
  "Line Height": "行高",
  "Letter Spacing": "字间距",
  "Text Align": "文本对齐",
  "Text Decoration": "文本装饰",
  "Text Transform": "文本转换",
  "Uppercase": "大写",
  "Lowercase": "小写",
  "Capitalize": "首字母大写",
  "Underline": "下划线",
  "Strikethrough": "删除线",
  "Italic": "斜体",
  "Bold": "粗体",
  "Color": "颜色",
  "Text Color": "文本颜色",
  
  // 背景
  "Background": "背景",
  "Backgrounds": "背景",
  "Background Color": "背景颜色",
  "Background Image": "背景图片",
  "Gradient": "渐变",
  "Linear Gradient": "线性渐变",
  "Radial Gradient": "径向渐变",
  "Cover": "覆盖",
  "Contain": "包含",
  "Tile": "平铺",
  
  // 边框
  "Border": "边框",
  "Borders": "边框",
  "Border Color": "边框颜色",
  "Border Width": "边框宽度",
  "Border Style": "边框样式",
  "Border Radius": "圆角",
  "Solid": "实线",
  "Dashed": "虚线",
  "Dotted": "点线",
  "Double": "双线",
  
  // 效果
  "Effects": "效果",
  "Opacity": "不透明度",
  "Shadow": "阴影",
  "Box Shadow": "盒子阴影",
  "Text Shadow": "文字阴影",
  "Blur": "模糊",
  "Filter": "滤镜",
  "Backdrop Filter": "背景滤镜",
  "Transform": "变换",
  "Rotate": "旋转",
  "Scale": "缩放",
  "Translate": "平移",
  "Skew": "倾斜",
  "Transition": "过渡",
  "Transitions": "过渡",
  "Duration": "持续时间",
  "Delay": "延迟",
  "Easing": "缓动",
  "Cursor": "光标",
  
  // 交互
  "Interactions": "交互",
  "Trigger": "触发器",
  "Animation": "动画",
  "Animations": "动画",
  "Click": "点击",
  "Mouse Move": "鼠标移动",
  "Page Load": "页面加载",
  "Page Scroll": "页面滚动",
  "Element Trigger": "元素触发",
  "While Scrolling": "滚动中",
  "Scroll Into View": "滚动到视图",
  "Mouse Hover": "鼠标悬停",
  "Mouse Click": "鼠标点击",
  "Timed": "定时",
  
  // CMS
  "CMS": "内容管理",
  "Collections": "集合",
  "Collection": "集合",
  "Collection List": "集合列表",
  "Collection Item": "集合项",
  "Add Field": "添加字段",
  "Field": "字段",
  "Fields": "字段",
  "Plain Text": "纯文本",
  "Number": "数字",
  "Date": "日期",
  "Switch": "开关",
  "Reference": "引用",
  "Multi Reference": "多引用",
  "Option": "选项",
  "File": "文件",
  
  // 页面设置
  "Pages": "页面",
  "Page": "页面",
  "Page Settings": "页面设置",
  "SEO": "搜索引擎优化",
  "SEO Settings": "SEO 设置",
  "Title Tag": "标题标签",
  "Meta Description": "元描述",
  "Open Graph": "开放图谱",
  "Custom Code": "自定义代码",
  "Slug": "别名",
  "Password": "密码",
  "Locales": "区域设置",
  
  // 站点设置
  "Site Settings": "站点设置",
  "General": "常规",
  "Publishing": "发布",
  "Hosting": "托管",
  "Fonts": "字体",
  "Integrations": "集成",
  "Billing": "账单",
  "Backups": "备份",
  "Members": "成员",
  "Memberships": "会员资格",
  
  // 发布
  "Publish to": "发布到",
  "Staging": "预发布",
  "Production": "生产环境",
  "Publish Changes": "发布更改",
  "Last Published": "上次发布",
  "Unpublish": "取消发布",
  
  // 资源管理
  "Assets": "资源",
  "Asset Manager": "资源管理器",
  "Upload": "上传",
  "Upload Asset": "上传资源",
  "Folder": "文件夹",
  "Folders": "文件夹",
  "New Folder": "新建文件夹",
  "Search Assets": "搜索资源",
  "All Assets": "所有资源",
  
  // 符号和组件
  "Symbols": "符号",
  "Symbol": "符号",
  "Create Symbol": "创建符号",
  "Unlink Symbol": "取消链接符号",
  "Override": "覆盖",
  "Overrides": "覆盖",
  "Edit Symbol": "编辑符号",
  "Component": "组件",
  "Create Component": "创建组件",
  
  // 类和选择器
  "Class": "类",
  "Classes": "类",
  "Add Class": "添加类",
  "Remove Class": "移除类",
  "Combo Class": "组合类",
  "Base Class": "基础类",
  "Tag": "标签",
  "ID": "ID",
  "All Classes": "所有类",
  "Global Classes": "全局类",
  
  // 面板和视图
  "Navigator": "导航器",
  "Layers": "图层",
  "Add Panel": "添加面板",
  "Settings Panel": "设置面板",
  "Asset Panel": "资源面板",
  "Symbol Panel": "符号面板",
  "Pages Panel": "页面面板",
  "CMS Panel": "CMS 面板",
  
  // 断点
  "Breakpoints": "断点",
  "Breakpoint": "断点",
  "Desktop": "桌面端",
  "Tablet": "平板",
  "Mobile Landscape": "手机横屏",
  "Mobile Portrait": "手机竖屏",
  "Large": "大屏",
  "Base": "基准",
  
  // 操作
  "Add": "添加",
  "Delete": "删除",
  "Remove": "移除",
  "Edit": "编辑",
  "Copy": "复制",
  "Paste": "粘贴",
  "Cut": "剪切",
  "Duplicate": "复制",
  "Undo": "撤销",
  "Redo": "重做",
  "Save": "保存",
  "Cancel": "取消",
  "Apply": "应用",
  "Reset": "重置",
  "Search": "搜索",
  "Rename": "重命名",
  "Move": "移动",
  "Create": "创建",
  "New": "新建",
  "Open": "打开",
  "Close": "关闭",
  "Expand": "展开",
  "Collapse": "折叠",
  "Select All": "全选",
  "Deselect": "取消选择",
  "Show": "显示",
  "Hide": "隐藏",
  "Lock": "锁定",
  "Unlock": "解锁",
  "Group": "分组",
  "Ungroup": "取消分组",
  "Unwrap": "解除包裹",
  
  // 通用
  "Loading": "加载中",
  "Error": "错误",
  "Success": "成功",
  "Warning": "警告",
  "Info": "信息",
  "Yes": "是",
  "No": "否",
  "OK": "确定",
  "Confirm": "确认",
  "Done": "完成",
  "Continue": "继续",
  "Back": "返回",
  "Next": "下一步",
  "Previous": "上一步",
  "Learn More": "了解更多",
  "Help": "帮助",
  "Documentation": "文档",
  "Tutorial": "教程",
  "Tutorials": "教程",
  "Upgrade": "升级",
  "Free": "免费",
  "Pro": "专业版",
  "Team": "团队",
  "Enterprise": "企业版",
  
  // 账户相关
  "Account": "账户",
  "Profile": "个人资料",
  "Log In": "登录",
  "Log Out": "登出",
  "Sign In": "登录",
  "Sign Out": "登出",
  "Sign Up": "注册",
  "Email": "邮箱",
  "Username": "用户名",
  "Workspace": "工作区",
  "Workspaces": "工作区",
  "Project": "项目",
  "Projects": "项目",
  "Site": "站点",
  "Sites": "站点",
  "Template": "模板",
  "Templates": "模板",
  
  // 其他常用
  "Name": "名称",
  "Description": "描述",
  "Type": "类型",
  "Value": "值",
  "Default": "默认",
  "Custom": "自定义",
  "Required": "必填",
  "Optional": "可选",
  "Enabled": "启用",
  "Disabled": "禁用",
  "Active": "激活",
  "Inactive": "未激活",
  "On": "开",
  "Off": "关",
  "More": "更多",
  "Less": "更少",
  "Options": "选项",
  "Advanced": "高级",
  "Properties": "属性",
  "Details": "详情",
  "Overview": "概览",
  "Summary": "摘要",
  "View": "查看",
  "Share": "分享",
  "Embed": "嵌入",
  "Code": "代码",
  "URL": "网址",
  "Alt Text": "替代文本",
  "Caption": "说明",
  "Tooltip": "工具提示"
};

// ============ 状态管理 ============
let dictionary = { ...BUILT_IN_DICTIONARY };
let customDictionary = {};
let builtInOverrides = {};  // 内置词条覆盖：{ english: chinese } 用于修改内置词条
let disabledBuiltIn = [];   // 被禁用的内置词条列表
let translationCache = new Map();
let settings = {
  enabled: true,
  autoTranslate: true,
  useAI: false,
  showOriginal: false,
  highlightTranslated: false,
  apiUrl: 'https://api.gemai.cc/v1/chat/completions',
  apiKey: '',
  model: 'claude-haiku-4-5-20251001',
  translateDelay: 100,
  batchSize: 10,
  maxRetries: 3
};

// 重建词典（合并内置、覆盖、自定义）
function rebuildDictionary() {
  // 从内置词典开始
  const base = { ...BUILT_IN_DICTIONARY };
  
  // 移除被禁用的内置词条
  for (const key of disabledBuiltIn) {
    delete base[key];
  }
  
  // 应用内置词条的覆盖
  for (const [key, value] of Object.entries(builtInOverrides)) {
    if (BUILT_IN_DICTIONARY.hasOwnProperty(key)) {
      base[key] = value;
    }
  }
  
  // 最后合并自定义词典（自定义词典优先级最高）
  dictionary = { ...base, ...customDictionary };
}

// ============ 初始化 ============
async function initialize() {
  try {
    // 加载自定义词典
    const dictResult = await chrome.storage.local.get('customDictionary');
    if (dictResult.customDictionary) {
      customDictionary = dictResult.customDictionary;
    }

    // 加载内置词条覆盖
    const overridesResult = await chrome.storage.local.get('builtInOverrides');
    if (overridesResult.builtInOverrides) {
      builtInOverrides = overridesResult.builtInOverrides;
    }

    // 加载禁用的内置词条
    const disabledResult = await chrome.storage.local.get('disabledBuiltIn');
    if (disabledResult.disabledBuiltIn) {
      disabledBuiltIn = disabledResult.disabledBuiltIn;
    }

    // 重建词典
    rebuildDictionary();

    // 加载翻译缓存
    const cacheResult = await chrome.storage.local.get('translationCache');
    if (cacheResult.translationCache) {
      translationCache = new Map(Object.entries(cacheResult.translationCache));
    }

    // 加载设置
    const settingsResult = await chrome.storage.sync.get('userSettings');
    if (settingsResult.userSettings) {
      settings = { ...settings, ...settingsResult.userSettings };
    }

    console.log('Webflow 翻译助手已初始化');
  } catch (error) {
    console.error('初始化失败:', error);
  }
}

// 启动时初始化
initialize();

// ============ 词典翻译 ============
function translateWithDictionary(text) {
  if (!text || typeof text !== 'string') return null;
  const trimmed = text.trim();
  return dictionary[trimmed] || null;
}

// ============ AI 翻译 ============
async function translateWithAI(text) {
  if (!text || !settings.useAI) {
    return { success: false, error: 'AI 翻译已禁用' };
  }

  // 检查 API Key 是否已配置，未配置则静默跳过 AI 翻译
  if (!settings.apiKey || settings.apiKey.trim() === '') {
    return { success: false, error: 'API Key 未配置，跳过 AI 翻译' };
  }

  try {
    const response = await fetch(settings.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${settings.apiKey}`
      },
      body: JSON.stringify({
        model: settings.model,
        messages: [
          {
            role: 'system',
            content: `你是一个专业的 Webflow 界面翻译助手。将 Webflow 设计工具的英文界面文本翻译成简体中文。要求：
1. 保持翻译简洁、专业
2. 使用中国用户熟悉的软件术语
3. 只返回翻译结果，不要解释`
          },
          {
            role: 'user',
            content: `翻译：${text}`
          }
        ],
        temperature: 0.1,
        max_tokens: 200
      })
    });

    if (!response.ok) {
      throw new Error(`API 错误: ${response.status}`);
    }

    const data = await response.json();
    if (data.choices && data.choices[0] && data.choices[0].message) {
      let translation = data.choices[0].message.content.trim();
      translation = translation.replace(/^["']|["']$/g, '');
      return { success: true, translation };
    }

    throw new Error('API 返回格式错误');
  } catch (error) {
    console.error('AI 翻译失败:', error);
    return { success: false, error: error.message };
  }
}

// ============ 批量 AI 翻译 ============
async function translateBatchWithAI(texts) {
  if (!texts || texts.length === 0 || !settings.useAI) {
    return { success: false, error: 'AI 翻译已禁用或无文本' };
  }

  // 检查 API Key 是否已配置，未配置则静默跳过 AI 翻译
  if (!settings.apiKey || settings.apiKey.trim() === '') {
    return { success: false, error: 'API Key 未配置，跳过 AI 翻译' };
  }

  try {
    const textList = texts.map((t, i) => `${i + 1}. ${t}`).join('\n');
    
    const response = await fetch(settings.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${settings.apiKey}`
      },
      body: JSON.stringify({
        model: settings.model,
        messages: [
          {
            role: 'system',
            content: `你是一个专业的 Webflow 界面翻译助手。将 Webflow 设计工具的英文界面文本翻译成简体中文。
要求：
1. 保持翻译简洁、专业
2. 使用中国用户熟悉的软件术语
3. 每行一个翻译，格式为"序号. 翻译结果"
4. 不要添加任何解释`
          },
          {
            role: 'user',
            content: `翻译以下文本：\n${textList}`
          }
        ],
        temperature: 0.1,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      throw new Error(`API 错误: ${response.status}`);
    }

    const data = await response.json();
    if (data.choices && data.choices[0] && data.choices[0].message) {
      const content = data.choices[0].message.content.trim();
      const translations = {};
      const lines = content.split('\n').filter(l => l.trim());

      for (let i = 0; i < texts.length; i++) {
        for (const line of lines) {
          const match = line.match(new RegExp(`^${i + 1}[.、]\\s*(.+)$`));
          if (match) {
            translations[texts[i]] = match[1].trim().replace(/^["']|["']$/g, '');
            break;
          }
        }
      }

      return { success: true, translations };
    }

    throw new Error('API 返回格式错误');
  } catch (error) {
    console.error('批量 AI 翻译失败:', error);
    return { success: false, error: error.message };
  }
}

// ============ 缓存管理 ============
function getCachedTranslation(text) {
  const key = text.trim().toLowerCase();
  const cached = translationCache.get(key);
  if (cached) {
    cached.lastAccess = Date.now();
    return cached.translation;
  }
  return null;
}

async function setCachedTranslation(text, translation, source = 'ai') {
  const key = text.trim().toLowerCase();
  
  // 限制缓存大小
  if (translationCache.size >= 10000) {
    // 删除最老的 20% 条目
    const entries = Array.from(translationCache.entries());
    entries.sort((a, b) => a[1].lastAccess - b[1].lastAccess);
    const toRemove = Math.floor(entries.length * 0.2);
    for (let i = 0; i < toRemove; i++) {
      translationCache.delete(entries[i][0]);
    }
  }

  translationCache.set(key, {
    translation,
    source,
    createdAt: Date.now(),
    lastAccess: Date.now()
  });

  // 保存到存储
  await saveCacheDebounced();
}

let saveCacheTimeout = null;
async function saveCacheDebounced() {
  if (saveCacheTimeout) {
    clearTimeout(saveCacheTimeout);
  }
  saveCacheTimeout = setTimeout(async () => {
    try {
      const obj = {};
      for (const [key, value] of translationCache.entries()) {
        obj[key] = value;
      }
      await chrome.storage.local.set({ translationCache: obj });
    } catch (error) {
      console.error('保存缓存失败:', error);
    }
  }, 2000);
}

// ============ 消息处理 ============
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  handleMessage(request, sender).then(sendResponse);
  return true; // 保持消息通道打开
});

async function handleMessage(request, sender) {
  switch (request.action) {
    case 'translate':
      return await handleTranslate(request.text);

    case 'translateBatch':
      return await handleTranslateBatch(request.texts);

    case 'getSettings':
      return { success: true, settings };

    case 'updateSettings':
      settings = { ...settings, ...request.settings };
      await chrome.storage.sync.set({ userSettings: settings });
      return { success: true };

    case 'getDictionaryStats':
      return {
        success: true,
        stats: {
          builtInCount: Object.keys(BUILT_IN_DICTIONARY).length,
          customCount: Object.keys(customDictionary).length,
          totalCount: Object.keys(dictionary).length,
          cacheCount: translationCache.size,
          overridesCount: Object.keys(builtInOverrides).length,
          disabledCount: disabledBuiltIn.length
        }
      };

    case 'exportDictionary':
      return {
        success: true,
        data: {
          custom: customDictionary,
          builtIn: request.includeBuiltIn ? BUILT_IN_DICTIONARY : undefined,
          builtInOverrides: request.includeBuiltIn ? builtInOverrides : undefined,
          disabledBuiltIn: request.includeBuiltIn ? disabledBuiltIn : undefined
        }
      };

    case 'importDictionary':
      if (request.data && request.data.custom) {
        if (request.merge) {
          customDictionary = { ...customDictionary, ...request.data.custom };
        } else {
          customDictionary = request.data.custom;
        }
        rebuildDictionary();
        await chrome.storage.local.set({ customDictionary });
        return { success: true, count: Object.keys(request.data.custom).length };
      }
      return { success: false, error: '无效的词典数据' };

    case 'addDictionaryEntry':
      // 检查是否已存在于内置词典
      if (BUILT_IN_DICTIONARY.hasOwnProperty(request.english)) {
        const builtInTranslation = builtInOverrides[request.english] || BUILT_IN_DICTIONARY[request.english];
        return {
          success: false,
          error: 'exists_builtin',
          existingTranslation: builtInTranslation,
          message: `该词条已存在于内置词典中，翻译为"${builtInTranslation}"。如需修改，请前往"内置词条"标签页进行覆盖。`
        };
      }
      // 检查是否已存在于自定义词典
      if (customDictionary.hasOwnProperty(request.english)) {
        return {
          success: false,
          error: 'exists_custom',
          existingTranslation: customDictionary[request.english],
          message: `该词条已存在于自定义词典中，翻译为"${customDictionary[request.english]}"。`
        };
      }
      customDictionary[request.english] = request.chinese;
      rebuildDictionary();
      await chrome.storage.local.set({ customDictionary });
      return { success: true };

    case 'updateDictionaryEntry':
      // 强制更新自定义词条（用于用户确认覆盖时）
      customDictionary[request.english] = request.chinese;
      rebuildDictionary();
      await chrome.storage.local.set({ customDictionary });
      return { success: true };

    case 'checkDictionaryEntry':
      // 检查词条是否存在
      const result = {
        existsInBuiltIn: BUILT_IN_DICTIONARY.hasOwnProperty(request.english),
        existsInCustom: customDictionary.hasOwnProperty(request.english),
        builtInTranslation: null,
        customTranslation: null
      };
      if (result.existsInBuiltIn) {
        result.builtInTranslation = builtInOverrides[request.english] || BUILT_IN_DICTIONARY[request.english];
      }
      if (result.existsInCustom) {
        result.customTranslation = customDictionary[request.english];
      }
      return { success: true, ...result };

    case 'removeDictionaryEntry':
      if (customDictionary[request.english]) {
        delete customDictionary[request.english];
        rebuildDictionary();
        await chrome.storage.local.set({ customDictionary });
        return { success: true };
      }
      return { success: false, error: '词条不存在' };

    case 'clearCache':
      translationCache.clear();
      await chrome.storage.local.remove('translationCache');
      return { success: true };

    case 'clearCustomDictionary':
      customDictionary = {};
      rebuildDictionary();
      await chrome.storage.local.set({ customDictionary: {} });
      return { success: true };

    // ============ 内置词条管理 ============
    case 'getBuiltInEntries':
      // 获取所有内置词条（包含覆盖和禁用状态）
      const entries = [];
      for (const [english, chinese] of Object.entries(BUILT_IN_DICTIONARY)) {
        entries.push({
          english,
          chinese,
          overrideValue: builtInOverrides[english] || null,
          isDisabled: disabledBuiltIn.includes(english)
        });
      }
      return { success: true, entries };

    case 'updateBuiltInEntry':
      // 修改内置词条的翻译
      if (!BUILT_IN_DICTIONARY.hasOwnProperty(request.english)) {
        return { success: false, error: '该词条不是内置词条' };
      }
      builtInOverrides[request.english] = request.chinese;
      rebuildDictionary();
      await chrome.storage.local.set({ builtInOverrides });
      return { success: true };

    case 'resetBuiltInEntry':
      // 重置内置词条为原始值
      if (builtInOverrides[request.english]) {
        delete builtInOverrides[request.english];
        rebuildDictionary();
        await chrome.storage.local.set({ builtInOverrides });
      }
      return { success: true };

    case 'disableBuiltInEntry':
      // 禁用内置词条
      if (!BUILT_IN_DICTIONARY.hasOwnProperty(request.english)) {
        return { success: false, error: '该词条不是内置词条' };
      }
      if (!disabledBuiltIn.includes(request.english)) {
        disabledBuiltIn.push(request.english);
        rebuildDictionary();
        await chrome.storage.local.set({ disabledBuiltIn });
      }
      return { success: true };

    case 'enableBuiltInEntry':
      // 启用内置词条
      const index = disabledBuiltIn.indexOf(request.english);
      if (index > -1) {
        disabledBuiltIn.splice(index, 1);
        rebuildDictionary();
        await chrome.storage.local.set({ disabledBuiltIn });
      }
      return { success: true };

    case 'resetAllBuiltIn':
      // 重置所有内置词条修改
      builtInOverrides = {};
      disabledBuiltIn = [];
      rebuildDictionary();
      await chrome.storage.local.set({ builtInOverrides: {}, disabledBuiltIn: [] });
      return { success: true };

    case 'addBuiltInEntry':
      // 添加新的内置词条（实际上是添加到覆盖中，因为原始词典是硬编码的）
      // 注意：这实际上是添加到自定义词典，因为我们不能修改硬编码的 BUILT_IN_DICTIONARY
      customDictionary[request.english] = request.chinese;
      rebuildDictionary();
      await chrome.storage.local.set({ customDictionary });
      return { success: true };

    case 'searchBuiltInEntries':
      // 搜索内置词条
      const searchResults = [];
      const query = (request.query || '').toLowerCase();
      for (const [english, chinese] of Object.entries(BUILT_IN_DICTIONARY)) {
        if (english.toLowerCase().includes(query) || chinese.includes(request.query)) {
          searchResults.push({
            english,
            chinese,
            overrideValue: builtInOverrides[english] || null,
            isDisabled: disabledBuiltIn.includes(english)
          });
        }
      }
      return { success: true, entries: searchResults };

    case 'testAPI':
      const testResult = await translateWithAI('Hello');
      return testResult;

    default:
      return { success: false, error: '未知的操作' };
  }
}

async function handleTranslate(text) {
  if (!text) {
    return { success: false, error: '无效的文本' };
  }

  // 1. 先尝试词典翻译
  const dictTranslation = translateWithDictionary(text);
  if (dictTranslation) {
    return { success: true, translation: dictTranslation, source: 'dictionary' };
  }

  // 2. 检查缓存
  const cachedTranslation = getCachedTranslation(text);
  if (cachedTranslation) {
    return { success: true, translation: cachedTranslation, source: 'cache' };
  }

  // 3. AI 翻译
  if (settings.useAI) {
    const aiResult = await translateWithAI(text);
    if (aiResult.success) {
      await setCachedTranslation(text, aiResult.translation, 'ai');
      return { success: true, translation: aiResult.translation, source: 'ai' };
    }
    return aiResult;
  }

  return { success: false, error: '无法翻译' };
}

async function handleTranslateBatch(texts) {
  if (!texts || texts.length === 0) {
    return { success: false, error: '无效的文本列表' };
  }

  const results = {};
  const needAITranslation = [];

  // 先处理词典和缓存
  for (const text of texts) {
    const dictTranslation = translateWithDictionary(text);
    if (dictTranslation) {
      results[text] = { translation: dictTranslation, source: 'dictionary' };
      continue;
    }

    const cachedTranslation = getCachedTranslation(text);
    if (cachedTranslation) {
      results[text] = { translation: cachedTranslation, source: 'cache' };
      continue;
    }

    needAITranslation.push(text);
  }

  // 批量 AI 翻译
  if (needAITranslation.length > 0 && settings.useAI) {
    const aiResult = await translateBatchWithAI(needAITranslation);
    if (aiResult.success && aiResult.translations) {
      for (const [text, translation] of Object.entries(aiResult.translations)) {
        results[text] = { translation, source: 'ai' };
        await setCachedTranslation(text, translation, 'ai');
      }
    }
  }

  return { success: true, results };
}

// ============ 扩展安装/更新处理 ============
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('Webflow 翻译助手已安装');
  } else if (details.reason === 'update') {
    console.log('Webflow 翻译助手已更新到版本', chrome.runtime.getManifest().version);
  }
});
