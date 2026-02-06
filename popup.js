/**
 * Popup Script
 * 弹出窗口脚本
 */

document.addEventListener('DOMContentLoaded', async () => {
  // 元素引用
  const elements = {
    enableToggle: document.getElementById('enableToggle'),
    pageStatus: document.getElementById('pageStatus'),
    translateStatus: document.getElementById('translateStatus'),
    translateBtn: document.getElementById('translateBtn'),
    restoreBtn: document.getElementById('restoreBtn'),
    builtInCount: document.getElementById('builtInCount'),
    customCount: document.getElementById('customCount'),
    cacheCount: document.getElementById('cacheCount'),
    autoTranslate: document.getElementById('autoTranslate'),
    useAI: document.getElementById('useAI'),
    showOriginal: document.getElementById('showOriginal'),
    settingsBtn: document.getElementById('settingsBtn'),
    openOptions: document.getElementById('openOptions'),
    clearCache: document.getElementById('clearCache'),
    apiKeyNotice: document.getElementById('apiKeyNotice'),
    goToSettings: document.getElementById('goToSettings')
  };

  // 初始化
  await initialize();

  // ============ 初始化 ============
  async function initialize() {
    try {
      // 加载设置
      const response = await chrome.runtime.sendMessage({ action: 'getSettings' });
      if (response && response.success) {
        const settings = response.settings;
        elements.enableToggle.checked = settings.enabled;
        elements.autoTranslate.checked = settings.autoTranslate;
        elements.useAI.checked = settings.useAI;
        elements.showOriginal.checked = settings.showOriginal;

        // 检查 API Key 是否已配置
        checkApiKeyStatus(settings);
      }

      // 加载统计信息
      await loadStats();

      // 检查当前页面
      await checkCurrentPage();

    } catch (error) {
      console.error('初始化失败:', error);
      showToast('初始化失败', 'error');
    }
  }

  // 检查 API Key 状态
  function checkApiKeyStatus(settings) {
    if (!settings.apiKey || settings.apiKey.trim() === '') {
      // 显示 API Key 未配置提示
      if (elements.apiKeyNotice) {
        elements.apiKeyNotice.style.display = 'flex';
      }
      // 禁用 AI 翻译选项
      if (elements.useAI) {
        elements.useAI.disabled = true;
        elements.useAI.checked = false;
      }
    } else {
      // 隐藏提示
      if (elements.apiKeyNotice) {
        elements.apiKeyNotice.style.display = 'none';
      }
      // 启用 AI 翻译选项
      if (elements.useAI) {
        elements.useAI.disabled = false;
      }
    }
  }

  // ============ 加载统计信息 ============
  async function loadStats() {
    try {
      const response = await chrome.runtime.sendMessage({ action: 'getDictionaryStats' });
      if (response && response.success) {
        elements.builtInCount.textContent = response.stats.builtInCount;
        elements.customCount.textContent = response.stats.customCount;
        elements.cacheCount.textContent = response.stats.cacheCount;
      }
    } catch (error) {
      console.error('加载统计失败:', error);
    }
  }

  // ============ 检查当前页面 ============
  async function checkCurrentPage() {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      if (tab && tab.url) {
        const isWebflow = tab.url.includes('webflow.com');
        
        if (isWebflow) {
          elements.pageStatus.textContent = 'Webflow 页面';
          elements.pageStatus.className = 'status-value success';
          elements.translateBtn.disabled = false;
          elements.restoreBtn.disabled = false;
        } else {
          elements.pageStatus.textContent = '非 Webflow 页面';
          elements.pageStatus.className = 'status-value warning';
          elements.translateBtn.disabled = true;
          elements.restoreBtn.disabled = true;
        }
      }
    } catch (error) {
      elements.pageStatus.textContent = '无法检测';
      elements.pageStatus.className = 'status-value error';
    }
  }

  // ============ 事件监听 ============
  
  // 主开关
  elements.enableToggle.addEventListener('change', async (e) => {
    const enabled = e.target.checked;
    
    // 更新设置
    await chrome.runtime.sendMessage({
      action: 'updateSettings',
      settings: { enabled }
    });

    // 通知内容脚本
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab && tab.id) {
        await chrome.tabs.sendMessage(tab.id, {
          action: 'toggleTranslation',
          enabled
        });
      }
    } catch (error) {
      console.log('无法通知内容脚本');
    }

    elements.translateStatus.textContent = enabled ? '已启用' : '已禁用';
  });

  // 立即翻译
  elements.translateBtn.addEventListener('click', async () => {
    try {
      elements.translateBtn.disabled = true;
      elements.translateBtn.innerHTML = '<span class="loading">翻译中</span>';
      elements.translateStatus.textContent = '正在翻译...';

      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab && tab.id) {
        await chrome.tabs.sendMessage(tab.id, { action: 'translatePage' });
      }

      elements.translateStatus.textContent = '翻译完成';
      showToast('翻译完成', 'success');
    } catch (error) {
      elements.translateStatus.textContent = '翻译失败';
      showToast('翻译失败: ' + error.message, 'error');
    } finally {
      elements.translateBtn.disabled = false;
      elements.translateBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M5 8l6 6"></path>
          <path d="M4 14l6-6 2-3"></path>
          <path d="M2 5h12"></path>
          <path d="M7 2h1"></path>
          <path d="M22 22l-5-10-5 10"></path>
          <path d="M14 18h6"></path>
        </svg>
        立即翻译
      `;
    }
  });

  // 恢复原文
  elements.restoreBtn.addEventListener('click', async () => {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab && tab.id) {
        await chrome.tabs.sendMessage(tab.id, { action: 'restoreOriginal' });
      }
      elements.translateStatus.textContent = '已恢复原文';
      showToast('已恢复原文', 'success');
    } catch (error) {
      showToast('恢复失败', 'error');
    }
  });

  // 自动翻译设置
  elements.autoTranslate.addEventListener('change', async (e) => {
    await chrome.runtime.sendMessage({
      action: 'updateSettings',
      settings: { autoTranslate: e.target.checked }
    });
  });

  // AI 翻译设置
  elements.useAI.addEventListener('change', async (e) => {
    await chrome.runtime.sendMessage({
      action: 'updateSettings',
      settings: { useAI: e.target.checked }
    });
  });

  // 显示原文设置
  elements.showOriginal.addEventListener('change', async (e) => {
    await chrome.runtime.sendMessage({
      action: 'updateSettings',
      settings: { showOriginal: e.target.checked }
    });

    // 通知内容脚本
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab && tab.id) {
        await chrome.tabs.sendMessage(tab.id, {
          action: 'updateSettings',
          settings: { showOriginal: e.target.checked }
        });
      }
    } catch (error) {
      console.log('无法通知内容脚本');
    }
  });

  // 设置按钮
  elements.settingsBtn.addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
  });

  // 打开选项页
  elements.openOptions.addEventListener('click', (e) => {
    e.preventDefault();
    chrome.runtime.openOptionsPage();
  });

  // 去设置按钮（API Key 提示）
  if (elements.goToSettings) {
    elements.goToSettings.addEventListener('click', () => {
      chrome.runtime.openOptionsPage();
    });
  }

  // 清除缓存
  elements.clearCache.addEventListener('click', async (e) => {
    e.preventDefault();
    
    if (confirm('确定要清除所有翻译缓存吗？')) {
      try {
        await chrome.runtime.sendMessage({ action: 'clearCache' });
        await loadStats();
        showToast('缓存已清除', 'success');
      } catch (error) {
        showToast('清除失败', 'error');
      }
    }
  });

  // ============ 工具函数 ============
  function showToast(message, type = 'info') {
    // 移除现有的 toast
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
      existingToast.remove();
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    // 显示
    requestAnimationFrame(() => {
      toast.classList.add('visible');
    });

    // 3秒后隐藏
    setTimeout(() => {
      toast.classList.remove('visible');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }
});
