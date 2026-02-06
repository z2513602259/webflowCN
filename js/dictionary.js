/**
 * 内置词典模块
 * 包含 Webflow 界面常用词汇的中文翻译
 */

// 内置词典 - Webflow 界面常用词汇
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
  "Scroll": "滚动",
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
  "Forms": "表单",
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
  "Style Panel": "样式面板",
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
  "Clear": "清除",
  "Search": "搜索",
  "Filter": "筛选",
  "Sort": "排序",
  "Rename": "重命名",
  "Move": "移动",
  "Create": "创建",
  "New": "新建",
  "Open": "打开",
  "Close": "关闭",
  "Expand": "展开",
  "Collapse": "折叠",
  "Select": "选择",
  "Select All": "全选",
  "Deselect": "取消选择",
  "Show": "显示",
  "Hide": "隐藏",
  "Lock": "锁定",
  "Unlock": "解锁",
  "Group": "分组",
  "Ungroup": "取消分组",
  "Wrap": "包裹",
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
  "Preview": "预览",
  "View": "查看",
  "Share": "分享",
  "Embed": "嵌入",
  "Code": "代码",
  "Link": "链接",
  "URL": "网址",
  "Alt Text": "替代文本",
  "Caption": "说明",
  "Placeholder": "占位符",
  "Tooltip": "工具提示"
};

// 词典管理类
class Dictionary {
  constructor() {
    this.builtIn = { ...BUILT_IN_DICTIONARY };
    this.custom = {};
    this.merged = {};
  }

  // 初始化，从存储加载自定义词典
  async init() {
    try {
      const result = await chrome.storage.local.get('customDictionary');
      if (result.customDictionary) {
        this.custom = result.customDictionary;
      }
      this.merge();
      return true;
    } catch (error) {
      console.error('加载自定义词典失败:', error);
      this.merge();
      return false;
    }
  }

  // 合并内置词典和自定义词典
  merge() {
    this.merged = { ...this.builtIn, ...this.custom };
  }

  // 翻译单个文本（精确匹配）
  translate(text) {
    if (!text || typeof text !== 'string') return null;
    const trimmed = text.trim();
    return this.merged[trimmed] || null;
  }

  // 翻译文本（支持部分匹配）
  translatePartial(text) {
    if (!text || typeof text !== 'string') return null;
    
    let result = text;
    let hasMatch = false;
    
    // 按照词条长度降序排列，优先匹配长词
    const sortedKeys = Object.keys(this.merged).sort((a, b) => b.length - a.length);
    
    for (const key of sortedKeys) {
      if (result.includes(key)) {
        result = result.replace(new RegExp(this.escapeRegex(key), 'g'), this.merged[key]);
        hasMatch = true;
      }
    }
    
    return hasMatch ? result : null;
  }

  // 转义正则特殊字符
  escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  // 检查是否有匹配的词条
  hasMatch(text) {
    if (!text || typeof text !== 'string') return false;
    const trimmed = text.trim();
    return this.merged.hasOwnProperty(trimmed);
  }

  // 添加自定义词条
  async addEntry(english, chinese) {
    this.custom[english] = chinese;
    this.merge();
    await this.saveCustom();
    return true;
  }

  // 删除自定义词条
  async removeEntry(english) {
    if (this.custom.hasOwnProperty(english)) {
      delete this.custom[english];
      this.merge();
      await this.saveCustom();
      return true;
    }
    return false;
  }

  // 保存自定义词典到存储
  async saveCustom() {
    try {
      await chrome.storage.local.set({ customDictionary: this.custom });
      return true;
    } catch (error) {
      console.error('保存自定义词典失败:', error);
      return false;
    }
  }

  // 导出词典
  exportDictionary(includeBuiltIn = false) {
    if (includeBuiltIn) {
      return {
        builtIn: this.builtIn,
        custom: this.custom
      };
    }
    return { custom: this.custom };
  }

  // 导入词典
  async importDictionary(data, merge = true) {
    try {
      if (data.custom) {
        if (merge) {
          this.custom = { ...this.custom, ...data.custom };
        } else {
          this.custom = data.custom;
        }
        this.merge();
        await this.saveCustom();
      }
      return { success: true, count: Object.keys(data.custom || {}).length };
    } catch (error) {
      console.error('导入词典失败:', error);
      return { success: false, error: error.message };
    }
  }

  // 清空自定义词典
  async clearCustom() {
    this.custom = {};
    this.merge();
    await this.saveCustom();
    return true;
  }

  // 获取统计信息
  getStats() {
    return {
      builtInCount: Object.keys(this.builtIn).length,
      customCount: Object.keys(this.custom).length,
      totalCount: Object.keys(this.merged).length
    };
  }

  // 搜索词条
  search(query) {
    if (!query) return [];
    const lowerQuery = query.toLowerCase();
    const results = [];
    
    for (const [english, chinese] of Object.entries(this.merged)) {
      if (english.toLowerCase().includes(lowerQuery) || chinese.includes(query)) {
        results.push({
          english,
          chinese,
          isCustom: this.custom.hasOwnProperty(english)
        });
      }
    }
    
    return results;
  }

  // 获取所有词条
  getAllEntries() {
    return Object.entries(this.merged).map(([english, chinese]) => ({
      english,
      chinese,
      isCustom: this.custom.hasOwnProperty(english)
    }));
  }
}

// 导出
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { Dictionary, BUILT_IN_DICTIONARY };
}
