/**
 * 存储管理模块
 * 负责缓存翻译结果，提高翻译速度
 */

class TranslationStorage {
  constructor() {
    this.cache = new Map();
    this.maxCacheSize = 10000; // 最大缓存条目数
    this.cacheKey = 'translationCache';
  }

  // 初始化，从存储加载缓存
  async init() {
    try {
      const result = await chrome.storage.local.get(this.cacheKey);
      if (result[this.cacheKey]) {
        const entries = Object.entries(result[this.cacheKey]);
        this.cache = new Map(entries);
        console.log(`加载了 ${this.cache.size} 条翻译缓存`);
      }
      return true;
    } catch (error) {
      console.error('加载翻译缓存失败:', error);
      return false;
    }
  }

  // 获取缓存的翻译
  get(text) {
    if (!text) return null;
    const key = this.normalizeKey(text);
    const cached = this.cache.get(key);
    
    if (cached) {
      // 更新访问时间
      cached.lastAccess = Date.now();
      return cached.translation;
    }
    return null;
  }

  // 设置翻译缓存
  async set(text, translation, source = 'ai') {
    if (!text || !translation) return false;
    
    const key = this.normalizeKey(text);
    
    // 如果缓存已满，清理旧条目
    if (this.cache.size >= this.maxCacheSize) {
      await this.cleanup();
    }
    
    this.cache.set(key, {
      translation,
      source, // 'dictionary' 或 'ai'
      createdAt: Date.now(),
      lastAccess: Date.now()
    });
    
    // 异步保存到存储
    this.saveDebounced();
    
    return true;
  }

  // 标准化缓存键
  normalizeKey(text) {
    return text.trim().toLowerCase();
  }

  // 清理旧缓存
  async cleanup() {
    // 按最后访问时间排序，删除最老的20%
    const entries = Array.from(this.cache.entries());
    entries.sort((a, b) => a[1].lastAccess - b[1].lastAccess);
    
    const toRemove = Math.floor(entries.length * 0.2);
    for (let i = 0; i < toRemove; i++) {
      this.cache.delete(entries[i][0]);
    }
    
    console.log(`清理了 ${toRemove} 条旧缓存`);
    await this.save();
  }

  // 防抖保存
  saveDebounced() {
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
    }
    this.saveTimeout = setTimeout(() => {
      this.save();
    }, 1000);
  }

  // 保存缓存到存储
  async save() {
    try {
      const obj = {};
      for (const [key, value] of this.cache.entries()) {
        obj[key] = value;
      }
      await chrome.storage.local.set({ [this.cacheKey]: obj });
      return true;
    } catch (error) {
      console.error('保存翻译缓存失败:', error);
      return false;
    }
  }

  // 清空缓存
  async clear() {
    this.cache.clear();
    try {
      await chrome.storage.local.remove(this.cacheKey);
      return true;
    } catch (error) {
      console.error('清空翻译缓存失败:', error);
      return false;
    }
  }

  // 获取统计信息
  getStats() {
    let aiCount = 0;
    let dictCount = 0;
    
    for (const value of this.cache.values()) {
      if (value.source === 'ai') {
        aiCount++;
      } else {
        dictCount++;
      }
    }
    
    return {
      totalCount: this.cache.size,
      aiCount,
      dictCount,
      maxSize: this.maxCacheSize
    };
  }

  // 导出缓存
  export() {
    const obj = {};
    for (const [key, value] of this.cache.entries()) {
      obj[key] = value;
    }
    return obj;
  }

  // 导入缓存
  async import(data, merge = true) {
    try {
      if (!merge) {
        this.cache.clear();
      }
      
      let count = 0;
      for (const [key, value] of Object.entries(data)) {
        if (value && value.translation) {
          this.cache.set(key, value);
          count++;
        }
      }
      
      await this.save();
      return { success: true, count };
    } catch (error) {
      console.error('导入缓存失败:', error);
      return { success: false, error: error.message };
    }
  }

  // 删除特定条目
  async delete(text) {
    const key = this.normalizeKey(text);
    if (this.cache.has(key)) {
      this.cache.delete(key);
      await this.save();
      return true;
    }
    return false;
  }

  // 检查是否有缓存
  has(text) {
    if (!text) return false;
    const key = this.normalizeKey(text);
    return this.cache.has(key);
  }
}

// 设置存储类 - 管理用户设置
class SettingsStorage {
  constructor() {
    this.settingsKey = 'userSettings';
    this.defaults = {
      enabled: true,
      autoTranslate: true,
      useAI: false,
      showOriginal: false,
      highlightTranslated: false,
      apiUrl: 'https://api.gemai.cc/v1/chat/completions',
      apiKey: '',
      model: 'claude-haiku-4-5-20251001',
      translateDelay: 100, // 翻译延迟（毫秒）
      batchSize: 10, // 批量翻译大小
      maxRetries: 3 // 最大重试次数
    };
    this.settings = { ...this.defaults };
  }

  // 初始化
  async init() {
    try {
      const result = await chrome.storage.sync.get(this.settingsKey);
      if (result[this.settingsKey]) {
        this.settings = { ...this.defaults, ...result[this.settingsKey] };
      }
      return true;
    } catch (error) {
      console.error('加载设置失败:', error);
      return false;
    }
  }

  // 获取设置
  get(key) {
    if (key) {
      return this.settings[key];
    }
    return { ...this.settings };
  }

  // 设置
  async set(key, value) {
    if (typeof key === 'object') {
      // 批量设置
      this.settings = { ...this.settings, ...key };
    } else {
      this.settings[key] = value;
    }
    
    try {
      await chrome.storage.sync.set({ [this.settingsKey]: this.settings });
      return true;
    } catch (error) {
      console.error('保存设置失败:', error);
      return false;
    }
  }

  // 重置为默认设置
  async reset() {
    this.settings = { ...this.defaults };
    try {
      await chrome.storage.sync.set({ [this.settingsKey]: this.settings });
      return true;
    } catch (error) {
      console.error('重置设置失败:', error);
      return false;
    }
  }

  // 导出设置
  export() {
    return { ...this.settings };
  }

  // 导入设置
  async import(data) {
    try {
      this.settings = { ...this.defaults, ...data };
      await chrome.storage.sync.set({ [this.settingsKey]: this.settings });
      return { success: true };
    } catch (error) {
      console.error('导入设置失败:', error);
      return { success: false, error: error.message };
    }
  }
}

// 导出
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { TranslationStorage, SettingsStorage };
}
