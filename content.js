/**
 * Content Script
 * 内容脚本 - 注入到 Webflow 页面，处理界面翻译
 */

(function() {
  'use strict';

  // 状态管理
  let isEnabled = true;
  let isTranslating = false;
  let settings = {
    enabled: true,
    autoTranslate: true,
    showOriginal: false,
    highlightTranslated: false,
    translateDelay: 100
  };

  // 已翻译的元素集合
  const translatedElements = new WeakSet();
  
  // 翻译队列
  const translationQueue = [];
  let isProcessingQueue = false;

  // 观察器
  let observer = null;

  // ============ 初始化 ============
  async function initialize() {
    try {
      // 获取设置
      const response = await chrome.runtime.sendMessage({ action: 'getSettings' });
      if (response && response.success) {
        settings = { ...settings, ...response.settings };
        isEnabled = settings.enabled;
      }

      if (isEnabled && settings.autoTranslate) {
        // 延迟启动，等待页面加载完成
        setTimeout(() => {
          translatePage();
          startObserver();
        }, 1000);
      }

      // 监听来自 popup 的消息
      chrome.runtime.onMessage.addListener(handleMessage);

      console.log('Webflow 翻译助手已加载');
    } catch (error) {
      console.error('初始化失败:', error);
    }
  }

  // ============ 消息处理 ============
  function handleMessage(request, sender, sendResponse) {
    switch (request.action) {
      case 'toggleTranslation':
        isEnabled = request.enabled;
        if (isEnabled) {
          translatePage();
          startObserver();
        } else {
          stopObserver();
          restoreOriginalText();
        }
        sendResponse({ success: true });
        break;

      case 'translatePage':
        translatePage();
        sendResponse({ success: true });
        break;

      case 'restoreOriginal':
        restoreOriginalText();
        sendResponse({ success: true });
        break;

      case 'updateSettings':
        settings = { ...settings, ...request.settings };
        isEnabled = settings.enabled;
        sendResponse({ success: true });
        break;

      default:
        sendResponse({ success: false, error: '未知操作' });
    }
    return true;
  }

  // ============ 页面翻译 ============
  async function translatePage() {
    if (!isEnabled || isTranslating) return;
    
    isTranslating = true;
    console.log('开始翻译页面...');

    try {
      // 获取所有需要翻译的文本节点
      const textNodes = getTextNodes(document.body);
      
      // 收集需要翻译的文本
      const textsToTranslate = new Map();
      
      for (const node of textNodes) {
        const text = node.textContent.trim();
        if (shouldTranslate(text)) {
          if (!textsToTranslate.has(text)) {
            textsToTranslate.set(text, []);
          }
          textsToTranslate.get(text).push(node);
        }
      }

      // 同时翻译元素属性
      const elementsWithAttributes = getElementsWithTranslatableAttributes(document.body);
      for (const { element, attribute, text } of elementsWithAttributes) {
        if (shouldTranslate(text)) {
          if (!textsToTranslate.has(text)) {
            textsToTranslate.set(text, []);
          }
          textsToTranslate.get(text).push({ element, attribute });
        }
      }

      if (textsToTranslate.size === 0) {
        console.log('没有需要翻译的文本');
        isTranslating = false;
        return;
      }

      console.log(`找到 ${textsToTranslate.size} 个不同的文本需要翻译`);

      // 批量翻译
      const texts = Array.from(textsToTranslate.keys());
      const batchSize = settings.batchSize || 20;
      
      for (let i = 0; i < texts.length; i += batchSize) {
        const batch = texts.slice(i, i + batchSize);
        const response = await chrome.runtime.sendMessage({
          action: 'translateBatch',
          texts: batch
        });

        if (response && response.success && response.results) {
          for (const [originalText, result] of Object.entries(response.results)) {
            if (result && result.translation) {
              const targets = textsToTranslate.get(originalText);
              if (targets) {
                for (const target of targets) {
                  applyTranslation(target, originalText, result.translation);
                }
              }
            }
          }
        }

        // 小延迟，避免请求过快
        if (i + batchSize < texts.length) {
          await delay(settings.translateDelay || 100);
        }
      }

      console.log('页面翻译完成');
    } catch (error) {
      console.error('翻译页面失败:', error);
    } finally {
      isTranslating = false;
    }
  }

  // ============ 获取文本节点 ============
  function getTextNodes(root) {
    const textNodes = [];
    const walker = document.createTreeWalker(
      root,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: function(node) {
          // 跳过脚本和样式
          const parent = node.parentElement;
          if (!parent) return NodeFilter.FILTER_REJECT;
          
          const tagName = parent.tagName.toLowerCase();
          if (tagName === 'script' || tagName === 'style' || tagName === 'noscript') {
            return NodeFilter.FILTER_REJECT;
          }

          // 跳过空白文本
          const text = node.textContent.trim();
          if (!text) return NodeFilter.FILTER_REJECT;

          // 跳过已翻译的元素
          if (translatedElements.has(parent)) {
            return NodeFilter.FILTER_REJECT;
          }

          return NodeFilter.FILTER_ACCEPT;
        }
      }
    );

    while (walker.nextNode()) {
      textNodes.push(walker.currentNode);
    }

    return textNodes;
  }

  // ============ 获取有可翻译属性的元素 ============
  function getElementsWithTranslatableAttributes(root) {
    const results = [];
    const translatableAttributes = ['title', 'placeholder', 'aria-label', 'alt'];
    
    const elements = root.querySelectorAll('*');
    for (const element of elements) {
      if (translatedElements.has(element)) continue;
      
      for (const attr of translatableAttributes) {
        const value = element.getAttribute(attr);
        if (value && value.trim()) {
          results.push({
            element,
            attribute: attr,
            text: value.trim()
          });
        }
      }
    }

    return results;
  }

  // ============ 判断是否需要翻译 ============
  function shouldTranslate(text) {
    if (!text || text.length < 2) return false;
    
    // 跳过纯数字
    if (/^\d+$/.test(text)) return false;
    
    // 跳过 URL
    if (/^https?:\/\//.test(text)) return false;
    
    // 跳过邮箱
    if (/^[\w.-]+@[\w.-]+\.\w+$/.test(text)) return false;
    
    // 跳过 CSS 类名格式
    if (/^[\w-]+$/.test(text) && text.includes('-')) return false;
    
    // 检查是否包含英文字母
    if (!/[a-zA-Z]/.test(text)) return false;
    
    // 跳过已经是中文的文本
    if (/[\u4e00-\u9fa5]/.test(text) && !/[a-zA-Z]{2,}/.test(text)) return false;
    
    return true;
  }

  // ============ 应用翻译 ============
  function applyTranslation(target, originalText, translation) {
    try {
      if (target instanceof Node) {
        // 文本节点
        const parent = target.parentElement;
        if (!parent) return;

        // 保存原始文本
        if (!parent.dataset.originalText) {
          parent.dataset.originalText = originalText;
        }

        // 应用翻译
        target.textContent = target.textContent.replace(originalText, translation);
        
        // 标记为已翻译
        translatedElements.add(parent);
        
        // 高亮显示
        if (settings.highlightTranslated) {
          parent.classList.add('wf-translated');
        }

        // 添加悬停提示
        if (settings.showOriginal) {
          parent.title = `原文: ${originalText}`;
        }
      } else if (target.element && target.attribute) {
        // 元素属性
        const element = target.element;
        const attr = target.attribute;
        
        // 保存原始值
        if (!element.dataset[`original${attr}`]) {
          element.dataset[`original${attr}`] = originalText;
        }

        // 应用翻译
        element.setAttribute(attr, translation);
        
        // 标记为已翻译
        translatedElements.add(element);
      }
    } catch (error) {
      console.error('应用翻译失败:', error);
    }
  }

  // ============ 恢复原始文本 ============
  function restoreOriginalText() {
    // 恢复文本节点
    const translatedElems = document.querySelectorAll('[data-original-text]');
    for (const elem of translatedElems) {
      const originalText = elem.dataset.originalText;
      if (originalText) {
        elem.textContent = originalText;
        delete elem.dataset.originalText;
        elem.classList.remove('wf-translated');
        elem.removeAttribute('title');
      }
    }

    // 恢复属性
    const attributes = ['title', 'placeholder', 'aria-label', 'alt'];
    for (const attr of attributes) {
      const elems = document.querySelectorAll(`[data-original${attr}]`);
      for (const elem of elems) {
        const originalValue = elem.dataset[`original${attr}`];
        if (originalValue) {
          elem.setAttribute(attr, originalValue);
          delete elem.dataset[`original${attr}`];
        }
      }
    }

    console.log('已恢复原始文本');
  }

  // ============ DOM 变化观察器 ============
  function startObserver() {
    if (observer) return;

    observer = new MutationObserver((mutations) => {
      if (!isEnabled) return;

      let hasNewContent = false;
      
      for (const mutation of mutations) {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          for (const node of mutation.addedNodes) {
            if (node.nodeType === Node.ELEMENT_NODE) {
              hasNewContent = true;
              break;
            }
          }
        }
        if (hasNewContent) break;
      }

      if (hasNewContent) {
        // 防抖处理
        clearTimeout(observer.debounceTimer);
        observer.debounceTimer = setTimeout(() => {
          translatePage();
        }, 500);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    console.log('DOM 观察器已启动');
  }

  function stopObserver() {
    if (observer) {
      observer.disconnect();
      observer = null;
      console.log('DOM 观察器已停止');
    }
  }

  // ============ 工具函数 ============
  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // ============ 启动 ============
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }
})();
