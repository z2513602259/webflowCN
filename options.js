/**
 * Options Page Script
 * 选项页面脚本
 */

document.addEventListener('DOMContentLoaded', async () => {
  // 元素引用
  const elements = {
    // 标签页
    tabBtns: document.querySelectorAll('.tab-btn'),
    tabContents: document.querySelectorAll('.tab-content'),
    
    // 词典统计
    builtInCount: document.getElementById('builtInCount'),
    customCount: document.getElementById('customCount'),
    totalCount: document.getElementById('totalCount'),
    
    // 添加词条
    addEntryForm: document.getElementById('addEntryForm'),
    englishInput: document.getElementById('englishInput'),
    chineseInput: document.getElementById('chineseInput'),
    
    // 导入导出
    exportDict: document.getElementById('exportDict'),
    exportFullDict: document.getElementById('exportFullDict'),
    importDict: document.getElementById('importDict'),
    mergeImport: document.getElementById('mergeImport'),
    
    // 搜索
    searchInput: document.getElementById('searchInput'),
    searchBtn: document.getElementById('searchBtn'),
    searchResults: document.getElementById('searchResults'),
    
    // 清空
    clearCustomDict: document.getElementById('clearCustomDict'),
    
    // 内置词条管理
    builtInTotalCount: document.getElementById('builtInTotalCount'),
    overridesCount: document.getElementById('overridesCount'),
    disabledCount: document.getElementById('disabledCount'),
    builtInSearchInput: document.getElementById('builtInSearchInput'),
    builtInSearchBtn: document.getElementById('builtInSearchBtn'),
    builtInSearchResults: document.getElementById('builtInSearchResults'),
    showModifiedOnly: document.getElementById('showModifiedOnly'),
    showDisabledOnly: document.getElementById('showDisabledOnly'),
    resetAllBuiltIn: document.getElementById('resetAllBuiltIn'),
    
    // API 设置
    apiSettingsForm: document.getElementById('apiSettingsForm'),
    apiUrl: document.getElementById('apiUrl'),
    apiKey: document.getElementById('apiKey'),
    model: document.getElementById('model'),
    maxRetries: document.getElementById('maxRetries'),
    translateDelay: document.getElementById('translateDelay'),
    batchSize: document.getElementById('batchSize'),
    toggleApiKey: document.getElementById('toggleApiKey'),
    testApi: document.getElementById('testApi'),
    resetSettings: document.getElementById('resetSettings'),
    apiTestResult: document.getElementById('apiTestResult'),
    
    // 缓存
    cacheCount: document.getElementById('cacheCount'),
    aiCacheCount: document.getElementById('aiCacheCount'),
    dictCacheCount: document.getElementById('dictCacheCount'),
    exportCache: document.getElementById('exportCache'),
    importCache: document.getElementById('importCache'),
    clearCache: document.getElementById('clearCache')
  };

  // 初始化
  await initialize();

  // ============ 初始化 ============
  async function initialize() {
    try {
      // 加载统计信息
      await loadStats();
      
      // 加载设置
      await loadSettings();
      
      // 设置事件监听
      setupEventListeners();
      
    } catch (error) {
      console.error('初始化失败:', error);
      showToast('初始化失败', 'error');
    }
  }

  // ============ 加载统计 ============
  async function loadStats() {
    try {
      const response = await chrome.runtime.sendMessage({ action: 'getDictionaryStats' });
      if (response && response.success) {
        elements.builtInCount.textContent = response.stats.builtInCount;
        elements.customCount.textContent = response.stats.customCount;
        elements.totalCount.textContent = response.stats.totalCount;
        elements.cacheCount.textContent = response.stats.cacheCount;
        
        // 内置词条统计
        if (elements.builtInTotalCount) {
          elements.builtInTotalCount.textContent = response.stats.builtInCount;
        }
        if (elements.overridesCount) {
          elements.overridesCount.textContent = response.stats.overridesCount || 0;
        }
        if (elements.disabledCount) {
          elements.disabledCount.textContent = response.stats.disabledCount || 0;
        }
        
        // 这些需要额外的统计信息
        if (elements.aiCacheCount) {
          elements.aiCacheCount.textContent = '-';
        }
        if (elements.dictCacheCount) {
          elements.dictCacheCount.textContent = '-';
        }
      }
    } catch (error) {
      console.error('加载统计失败:', error);
    }
  }

  // ============ 加载设置 ============
  async function loadSettings() {
    try {
      const response = await chrome.runtime.sendMessage({ action: 'getSettings' });
      if (response && response.success) {
        const settings = response.settings;
        elements.apiUrl.value = settings.apiUrl || '';
        elements.apiKey.value = settings.apiKey || '';
        elements.model.value = settings.model || '';
        elements.maxRetries.value = settings.maxRetries || 3;
        elements.translateDelay.value = settings.translateDelay || 100;
        elements.batchSize.value = settings.batchSize || 10;

        // 检查是否是首次使用（没有配置 API Key）
        checkFirstTimeSetup(settings);
      }
    } catch (error) {
      console.error('加载设置失败:', error);
    }
  }

  // 检查 API Key 配置状态
  function checkFirstTimeSetup(settings) {
    const apiKeyWarning = document.getElementById('apiKeyWarning');

    if (!settings.apiKey) {
      // 显示警告
      if (apiKeyWarning) {
        apiKeyWarning.style.display = 'block';
      }
      // 自动切换到设置标签页
      const settingsTab = document.querySelector('[data-tab="settings"]');
      if (settingsTab) {
        settingsTab.click();
      }
    } else {
      // 已配置 API Key，隐藏提示
      if (apiKeyWarning) {
        apiKeyWarning.style.display = 'none';
      }
    }
  }

  // ============ 设置事件监听 ============
  function setupEventListeners() {
    // 标签页切换
    elements.tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const tabId = btn.dataset.tab;
        
        elements.tabBtns.forEach(b => b.classList.remove('active'));
        elements.tabContents.forEach(c => c.classList.remove('active'));
        
        btn.classList.add('active');
        document.getElementById(tabId).classList.add('active');
      });
    });

    // 添加词条
    elements.addEntryForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const english = elements.englishInput.value.trim();
      const chinese = elements.chineseInput.value.trim();
      
      if (!english || !chinese) {
        showToast('请填写完整', 'error');
        return;
      }

      try {
        const response = await chrome.runtime.sendMessage({
          action: 'addDictionaryEntry',
          english,
          chinese
        });

        if (response && response.success) {
          showToast('词条已添加', 'success');
          elements.englishInput.value = '';
          elements.chineseInput.value = '';
          await loadStats();
        } else if (response && response.error === 'exists_builtin') {
          // 已存在于内置词典
          showToast(response.message, 'warning');
        } else if (response && response.error === 'exists_custom') {
          // 已存在于自定义词典，询问是否覆盖
          const confirmOverride = confirm(
            `${response.message}\n\n是否要覆盖为新的翻译"${chinese}"？`
          );
          if (confirmOverride) {
            const updateResponse = await chrome.runtime.sendMessage({
              action: 'updateDictionaryEntry',
              english,
              chinese
            });
            if (updateResponse && updateResponse.success) {
              showToast('词条已更新', 'success');
              elements.englishInput.value = '';
              elements.chineseInput.value = '';
              await loadStats();
            } else {
              showToast('更新失败', 'error');
            }
          }
        } else {
          showToast(response?.message || '添加失败', 'error');
        }
      } catch (error) {
        showToast('添加失败: ' + error.message, 'error');
      }
    });

    // 导出自定义词典
    elements.exportDict.addEventListener('click', async () => {
      try {
        const response = await chrome.runtime.sendMessage({
          action: 'exportDictionary',
          includeBuiltIn: false
        });

        if (response && response.success) {
          downloadJson(response.data, 'webflow-custom-dictionary.json');
          showToast('导出成功', 'success');
        }
      } catch (error) {
        showToast('导出失败', 'error');
      }
    });

    // 导出完整词典
    elements.exportFullDict.addEventListener('click', async () => {
      try {
        const response = await chrome.runtime.sendMessage({
          action: 'exportDictionary',
          includeBuiltIn: true
        });

        if (response && response.success) {
          downloadJson(response.data, 'webflow-full-dictionary.json');
          showToast('导出成功', 'success');
        }
      } catch (error) {
        showToast('导出失败', 'error');
      }
    });

    // 导入词典
    elements.importDict.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      try {
        const text = await file.text();
        const data = JSON.parse(text);
        
        const response = await chrome.runtime.sendMessage({
          action: 'importDictionary',
          data,
          merge: elements.mergeImport.checked
        });

        if (response && response.success) {
          showToast(`成功导入 ${response.count} 个词条`, 'success');
          await loadStats();
        } else {
          showToast('导入失败: ' + (response.error || '未知错误'), 'error');
        }
      } catch (error) {
        showToast('导入失败: 文件格式错误', 'error');
      }

      // 清空文件输入
      e.target.value = '';
    });

    // 搜索
    const doSearch = async () => {
      const query = elements.searchInput.value.trim();
      if (!query) {
        elements.searchResults.innerHTML = '<p style="color: #666; text-align: center;">请输入搜索关键词</p>';
        return;
      }

      // 这里我们需要在 background 中添加搜索功能
      // 暂时使用简单的本地搜索
      try {
        const response = await chrome.runtime.sendMessage({
          action: 'exportDictionary',
          includeBuiltIn: true
        });

        if (response && response.success) {
          const results = [];
          const data = response.data;
          const lowerQuery = query.toLowerCase();

          // 搜索内置词典
          if (data.builtIn) {
            for (const [english, chinese] of Object.entries(data.builtIn)) {
              if (english.toLowerCase().includes(lowerQuery) || chinese.includes(query)) {
                results.push({ english, chinese, isCustom: false });
              }
            }
          }

          // 搜索自定义词典
          if (data.custom) {
            for (const [english, chinese] of Object.entries(data.custom)) {
              if (english.toLowerCase().includes(lowerQuery) || chinese.includes(query)) {
                results.push({ english, chinese, isCustom: true });
              }
            }
          }

          renderSearchResults(results);
        }
      } catch (error) {
        showToast('搜索失败', 'error');
      }
    };

    elements.searchBtn.addEventListener('click', doSearch);
    elements.searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') doSearch();
    });

    // 清空自定义词典
    elements.clearCustomDict.addEventListener('click', async () => {
      if (!confirm('确定要清空所有自定义词条吗？此操作不可恢复！')) {
        return;
      }

      try {
        const response = await chrome.runtime.sendMessage({ action: 'clearCustomDictionary' });
        if (response && response.success) {
          showToast('自定义词典已清空', 'success');
          await loadStats();
        }
      } catch (error) {
        showToast('清空失败', 'error');
      }
    });

    // API 设置保存
    elements.apiSettingsForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const settings = {
        apiUrl: elements.apiUrl.value.trim(),
        apiKey: elements.apiKey.value.trim(),
        model: elements.model.value.trim(),
        maxRetries: parseInt(elements.maxRetries.value) || 3,
        translateDelay: parseInt(elements.translateDelay.value) || 100,
        batchSize: parseInt(elements.batchSize.value) || 10
      };

      try {
        const response = await chrome.runtime.sendMessage({
          action: 'updateSettings',
          settings
        });

        if (response && response.success) {
          showToast('设置已保存', 'success');
        }
      } catch (error) {
        showToast('保存失败', 'error');
      }
    });

    // 显示/隐藏 API Key
    elements.toggleApiKey.addEventListener('click', () => {
      const input = elements.apiKey;
      input.type = input.type === 'password' ? 'text' : 'password';
    });

    // 测试 API
    elements.testApi.addEventListener('click', async () => {
      elements.testApi.disabled = true;
      elements.testApi.textContent = '测试中...';
      elements.apiTestResult.className = 'test-result';
      elements.apiTestResult.style.display = 'none';

      try {
        const response = await chrome.runtime.sendMessage({ action: 'testAPI' });
        
        elements.apiTestResult.style.display = 'block';
        
        if (response && response.success) {
          elements.apiTestResult.className = 'test-result visible success';
          elements.apiTestResult.textContent = `✓ 连接成功！测试翻译结果: "${response.translation}"`;
        } else {
          elements.apiTestResult.className = 'test-result visible error';
          elements.apiTestResult.textContent = `✗ 连接失败: ${response.error || '未知错误'}`;
        }
      } catch (error) {
        elements.apiTestResult.className = 'test-result visible error';
        elements.apiTestResult.textContent = `✗ 连接失败: ${error.message}`;
      } finally {
        elements.testApi.disabled = false;
        elements.testApi.textContent = '测试连接';
      }
    });



    // 导出缓存
    elements.exportCache.addEventListener('click', async () => {
      try {
        const result = await chrome.storage.local.get('translationCache');
        if (result.translationCache) {
          downloadJson(result.translationCache, 'webflow-translation-cache.json');
          showToast('缓存导出成功', 'success');
        } else {
          showToast('没有缓存数据', 'error');
        }
      } catch (error) {
        showToast('导出失败', 'error');
      }
    });

    // 导入缓存
    elements.importCache.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      try {
        const text = await file.text();
        const data = JSON.parse(text);
        
        await chrome.storage.local.set({ translationCache: data });
        showToast('缓存导入成功', 'success');
        await loadStats();
      } catch (error) {
        showToast('导入失败: 文件格式错误', 'error');
      }

      e.target.value = '';
    });

    // 清空缓存
    elements.clearCache.addEventListener('click', async () => {
      if (!confirm('确定要清空所有翻译缓存吗？')) {
        return;
      }

      try {
        const response = await chrome.runtime.sendMessage({ action: 'clearCache' });
        if (response && response.success) {
          showToast('缓存已清空', 'success');
          await loadStats();
        }
      } catch (error) {
        showToast('清空失败', 'error');
      }
    });

    // ============ 内置词条管理事件 ============
    
    // 内置词条搜索
    const doBuiltInSearch = async () => {
      const query = elements.builtInSearchInput.value.trim();
      const showModifiedOnly = elements.showModifiedOnly.checked;
      const showDisabledOnly = elements.showDisabledOnly.checked;

      try {
        let response;
        if (query) {
          response = await chrome.runtime.sendMessage({
            action: 'searchBuiltInEntries',
            query
          });
        } else {
          response = await chrome.runtime.sendMessage({
            action: 'getBuiltInEntries'
          });
        }

        if (response && response.success) {
          let entries = response.entries;
          
          // 应用过滤器
          if (showModifiedOnly) {
            entries = entries.filter(e => e.overrideValue !== null);
          }
          if (showDisabledOnly) {
            entries = entries.filter(e => e.isDisabled);
          }
          
          renderBuiltInResults(entries);
        }
      } catch (error) {
        showToast('搜索失败', 'error');
      }
    };

    if (elements.builtInSearchBtn) {
      elements.builtInSearchBtn.addEventListener('click', doBuiltInSearch);
    }
    if (elements.builtInSearchInput) {
      elements.builtInSearchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') doBuiltInSearch();
      });
    }
    if (elements.showModifiedOnly) {
      elements.showModifiedOnly.addEventListener('change', doBuiltInSearch);
    }
    if (elements.showDisabledOnly) {
      elements.showDisabledOnly.addEventListener('change', doBuiltInSearch);
    }

    // 重置所有内置词条修改
    if (elements.resetAllBuiltIn) {
      elements.resetAllBuiltIn.addEventListener('click', async () => {
        if (!confirm('确定要重置所有内置词条的修改吗？这将恢复所有被修改和禁用的内置词条。')) {
          return;
        }

        try {
          const response = await chrome.runtime.sendMessage({ action: 'resetAllBuiltIn' });
          if (response && response.success) {
            showToast('所有内置词条已重置', 'success');
            await loadStats();
            doBuiltInSearch();
          }
        } catch (error) {
          showToast('重置失败', 'error');
        }
      });
    }
  }

  // ============ 渲染内置词条结果 ============
  function renderBuiltInResults(entries) {
    if (!entries || entries.length === 0) {
      elements.builtInSearchResults.innerHTML = '<p class="no-results">未找到匹配的内置词条</p>';
      return;
    }

    const html = entries.map(item => {
      const statusClasses = [];
      if (item.isDisabled) statusClasses.push('disabled');
      if (item.overrideValue) statusClasses.push('modified');
      
      const displayChinese = item.overrideValue || item.chinese;
      const showOriginal = item.overrideValue && item.overrideValue !== item.chinese;
      
      return `
        <div class="builtin-item ${statusClasses.join(' ')}" data-english="${escapeHtml(item.english)}">
          <div class="builtin-item-header">
            <div class="builtin-item-text">
              <span class="builtin-english">${escapeHtml(item.english)}</span>
              <span class="builtin-arrow">→</span>
              ${showOriginal ? `<span class="builtin-original">${escapeHtml(item.chinese)}</span>` : ''}
              <span class="builtin-chinese">${escapeHtml(displayChinese)}</span>
              <span class="builtin-status">
                ${item.overrideValue ? '<span class="status-badge modified">已修改</span>' : ''}
                ${item.isDisabled ? '<span class="status-badge disabled">已禁用</span>' : ''}
              </span>
            </div>
          </div>
          <div class="builtin-item-actions">
            <div class="builtin-edit-form">
              <input type="text" class="builtin-edit-input" value="${escapeHtml(displayChinese)}" placeholder="输入新翻译...">
              <button class="btn btn-small btn-primary builtin-save-btn">保存</button>
            </div>
            ${item.overrideValue ? `<button class="btn btn-small btn-secondary builtin-reset-btn">重置</button>` : ''}
            ${item.isDisabled
              ? `<button class="btn btn-small btn-success builtin-enable-btn">启用</button>`
              : `<button class="btn btn-small btn-warning builtin-disable-btn">禁用</button>`
            }
          </div>
        </div>
      `;
    }).join('');

    elements.builtInSearchResults.innerHTML = html;

    // 绑定事件
    elements.builtInSearchResults.querySelectorAll('.builtin-item').forEach(item => {
      const english = item.dataset.english;
      
      // 保存按钮
      const saveBtn = item.querySelector('.builtin-save-btn');
      const editInput = item.querySelector('.builtin-edit-input');
      if (saveBtn && editInput) {
        saveBtn.addEventListener('click', async () => {
          const newValue = editInput.value.trim();
          if (!newValue) {
            showToast('翻译不能为空', 'error');
            return;
          }
          await updateBuiltInEntry(english, newValue);
        });
      }

      // 重置按钮
      const resetBtn = item.querySelector('.builtin-reset-btn');
      if (resetBtn) {
        resetBtn.addEventListener('click', async () => {
          await resetBuiltInEntry(english);
        });
      }

      // 禁用按钮
      const disableBtn = item.querySelector('.builtin-disable-btn');
      if (disableBtn) {
        disableBtn.addEventListener('click', async () => {
          await disableBuiltInEntry(english);
        });
      }

      // 启用按钮
      const enableBtn = item.querySelector('.builtin-enable-btn');
      if (enableBtn) {
        enableBtn.addEventListener('click', async () => {
          await enableBuiltInEntry(english);
        });
      }
    });
  }

  // 更新内置词条
  async function updateBuiltInEntry(english, chinese) {
    try {
      const response = await chrome.runtime.sendMessage({
        action: 'updateBuiltInEntry',
        english,
        chinese
      });
      if (response && response.success) {
        showToast('词条已更新', 'success');
        await loadStats();
        // 重新搜索以更新显示
        elements.builtInSearchBtn.click();
      } else {
        showToast('更新失败: ' + (response.error || '未知错误'), 'error');
      }
    } catch (error) {
      showToast('更新失败', 'error');
    }
  }

  // 重置内置词条
  async function resetBuiltInEntry(english) {
    try {
      const response = await chrome.runtime.sendMessage({
        action: 'resetBuiltInEntry',
        english
      });
      if (response && response.success) {
        showToast('词条已重置', 'success');
        await loadStats();
        elements.builtInSearchBtn.click();
      } else {
        showToast('重置失败', 'error');
      }
    } catch (error) {
      showToast('重置失败', 'error');
    }
  }

  // 禁用内置词条
  async function disableBuiltInEntry(english) {
    try {
      const response = await chrome.runtime.sendMessage({
        action: 'disableBuiltInEntry',
        english
      });
      if (response && response.success) {
        showToast('词条已禁用', 'success');
        await loadStats();
        elements.builtInSearchBtn.click();
      } else {
        showToast('禁用失败: ' + (response.error || '未知错误'), 'error');
      }
    } catch (error) {
      showToast('禁用失败', 'error');
    }
  }

  // 启用内置词条
  async function enableBuiltInEntry(english) {
    try {
      const response = await chrome.runtime.sendMessage({
        action: 'enableBuiltInEntry',
        english
      });
      if (response && response.success) {
        showToast('词条已启用', 'success');
        await loadStats();
        elements.builtInSearchBtn.click();
      } else {
        showToast('启用失败', 'error');
      }
    } catch (error) {
      showToast('启用失败', 'error');
    }
  }

  // ============ 渲染搜索结果 ============
  function renderSearchResults(results) {
    if (results.length === 0) {
      elements.searchResults.innerHTML = '<p style="color: #666; text-align: center;">未找到匹配的词条</p>';
      return;
    }

    const html = results.map(item => `
      <div class="search-result-item">
        <div class="result-text">
          <span class="result-english">${escapeHtml(item.english)}</span>
          <span class="result-chinese">→ ${escapeHtml(item.chinese)}</span>
          <span class="result-badge ${item.isCustom ? 'custom' : 'builtin'}">
            ${item.isCustom ? '自定义' : '内置'}
          </span>
        </div>
        ${item.isCustom ? `
          <div class="result-actions">
            <button class="btn btn-danger" onclick="deleteEntry('${escapeHtml(item.english)}')">删除</button>
          </div>
        ` : ''}
      </div>
    `).join('');

    elements.searchResults.innerHTML = html;
  }

  // 删除词条（全局函数）
  window.deleteEntry = async function(english) {
    if (!confirm(`确定要删除词条 "${english}" 吗？`)) {
      return;
    }

    try {
      const response = await chrome.runtime.sendMessage({
        action: 'removeDictionaryEntry',
        english
      });

      if (response && response.success) {
        showToast('词条已删除', 'success');
        await loadStats();
        // 重新搜索
        elements.searchBtn.click();
      } else {
        showToast('删除失败', 'error');
      }
    } catch (error) {
      showToast('删除失败', 'error');
    }
  };

  // ============ 工具函数 ============
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function downloadJson(data, filename) {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function showToast(message, type = 'info') {
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
      existingToast.remove();
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.add('visible');
    });

    setTimeout(() => {
      toast.classList.remove('visible');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }
});
