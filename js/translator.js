/**
 * AI 翻译器模块
 * 调用 AI API 进行翻译
 */

class AITranslator {
  constructor(options = {}) {
    this.apiUrl = options.apiUrl || 'https://api.gemai.cc/v1/chat/completions';
    this.apiKey = options.apiKey || '';
    this.model = options.model || 'claude-haiku-4-5-20251001';
    this.maxRetries = options.maxRetries || 3;
    this.timeout = options.timeout || 30000; // 30秒超时
    this.pendingRequests = new Map();
  }

  // 更新配置
  updateConfig(options) {
    if (options.apiUrl) this.apiUrl = options.apiUrl;
    if (options.apiKey) this.apiKey = options.apiKey;
    if (options.model) this.model = options.model;
    if (options.maxRetries) this.maxRetries = options.maxRetries;
    if (options.timeout) this.timeout = options.timeout;
  }

  // 翻译单个文本
  async translate(text) {
    if (!text || typeof text !== 'string') {
      return { success: false, error: '无效的输入文本' };
    }

    const trimmed = text.trim();
    if (!trimmed) {
      return { success: false, error: '空文本' };
    }

    // 检查是否有相同的请求正在进行
    if (this.pendingRequests.has(trimmed)) {
      return this.pendingRequests.get(trimmed);
    }

    const promise = this._doTranslate(trimmed);
    this.pendingRequests.set(trimmed, promise);

    try {
      const result = await promise;
      return result;
    } finally {
      this.pendingRequests.delete(trimmed);
    }
  }

  // 执行翻译请求
  async _doTranslate(text, retryCount = 0) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            {
              role: 'system',
              content: `你是一个专业的 Webflow 界面翻译助手。你的任务是将 Webflow 设计工具的英文界面文本翻译成简体中文。

翻译要求：
1. 保持翻译简洁、专业
2. 使用中国用户熟悉的软件术语
3. 保持技术术语的准确性
4. 如果是按钮或菜单文本，保持简短
5. 只返回翻译结果，不要解释

示例：
- "Add Element" → "添加元素"
- "Style Panel" → "样式面板"
- "Publish Changes" → "发布更改"`
            },
            {
              role: 'user',
              content: `请翻译以下 Webflow 界面文本为简体中文：\n\n"${text}"`
            }
          ],
          temperature: 0.1,
          max_tokens: 500
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`API 请求失败: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.choices && data.choices[0] && data.choices[0].message) {
        let translation = data.choices[0].message.content.trim();
        
        // 清理翻译结果（移除可能的引号）
        translation = translation.replace(/^["']|["']$/g, '');
        
        return {
          success: true,
          translation,
          source: 'ai',
          model: this.model
        };
      } else {
        throw new Error('API 返回格式错误');
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        return { success: false, error: '请求超时' };
      }

      // 重试逻辑
      if (retryCount < this.maxRetries) {
        console.log(`翻译失败，正在重试 (${retryCount + 1}/${this.maxRetries})...`);
        await this._delay(1000 * (retryCount + 1)); // 递增延迟
        return this._doTranslate(text, retryCount + 1);
      }

      console.error('AI 翻译失败:', error);
      return { success: false, error: error.message };
    }
  }

  // 批量翻译
  async translateBatch(texts, options = {}) {
    const { concurrency = 3, onProgress } = options;
    const results = new Map();
    const queue = [...texts];
    let completed = 0;

    const worker = async () => {
      while (queue.length > 0) {
        const text = queue.shift();
        if (!text) continue;

        const result = await this.translate(text);
        results.set(text, result);
        completed++;

        if (onProgress) {
          onProgress({
            completed,
            total: texts.length,
            current: text,
            result
          });
        }
      }
    };

    // 创建并发工作器
    const workers = Array(Math.min(concurrency, texts.length))
      .fill(null)
      .map(() => worker());

    await Promise.all(workers);

    return results;
  }

  // 翻译多个文本（合并为单个请求）
  async translateMultiple(texts) {
    if (!texts || texts.length === 0) {
      return { success: false, error: '无效的输入' };
    }

    // 过滤空文本
    const validTexts = texts.filter(t => t && t.trim());
    if (validTexts.length === 0) {
      return { success: false, error: '没有有效的文本' };
    }

    // 如果只有一个文本，使用单个翻译
    if (validTexts.length === 1) {
      const result = await this.translate(validTexts[0]);
      if (result.success) {
        return {
          success: true,
          translations: { [validTexts[0]]: result.translation }
        };
      }
      return result;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout * 2);

      const textList = validTexts.map((t, i) => `${i + 1}. "${t}"`).join('\n');

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            {
              role: 'system',
              content: `你是一个专业的 Webflow 界面翻译助手。你的任务是将 Webflow 设计工具的英文界面文本翻译成简体中文。

翻译要求：
1. 保持翻译简洁、专业
2. 使用中国用户熟悉的软件术语
3. 保持技术术语的准确性
4. 如果是按钮或菜单文本，保持简短
5. 返回格式：每行一个翻译，格式为 "序号. 翻译结果"
6. 不要添加任何解释`
            },
            {
              role: 'user',
              content: `请翻译以下 Webflow 界面文本为简体中文：\n\n${textList}`
            }
          ],
          temperature: 0.1,
          max_tokens: 2000
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`API 请求失败: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.choices && data.choices[0] && data.choices[0].message) {
        const content = data.choices[0].message.content.trim();
        const translations = this._parseMultipleTranslations(content, validTexts);
        
        return {
          success: true,
          translations,
          source: 'ai',
          model: this.model
        };
      } else {
        throw new Error('API 返回格式错误');
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        return { success: false, error: '请求超时' };
      }
      console.error('批量翻译失败:', error);
      return { success: false, error: error.message };
    }
  }

  // 解析多个翻译结果
  _parseMultipleTranslations(content, originalTexts) {
    const translations = {};
    const lines = content.split('\n').filter(l => l.trim());

    for (let i = 0; i < originalTexts.length; i++) {
      const pattern = new RegExp(`^${i + 1}[.、]\\s*(.+)$`);
      
      for (const line of lines) {
        const match = line.match(pattern);
        if (match) {
          let translation = match[1].trim();
          // 移除可能的引号
          translation = translation.replace(/^["']|["']$/g, '');
          translations[originalTexts[i]] = translation;
          break;
        }
      }

      // 如果没找到对应翻译，尝试按顺序匹配
      if (!translations[originalTexts[i]] && lines[i]) {
        let translation = lines[i].replace(/^\d+[.、]\s*/, '').trim();
        translation = translation.replace(/^["']|["']$/g, '');
        translations[originalTexts[i]] = translation;
      }
    }

    return translations;
  }

  // 延迟函数
  _delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // 测试 API 连接
  async testConnection() {
    try {
      const result = await this.translate('Hello');
      return {
        success: result.success,
        message: result.success ? '连接成功' : result.error
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }
}

// 导出
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { AITranslator };
}
