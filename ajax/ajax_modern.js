/**
 * 现代 AJAX 解决方案示例
 * 
 * 本文件展示了使用现代方法进行 AJAX 通信的各种技术，
 * 包括 Fetch API、Axios 和 async/await 模式。
 * 每个示例都包含详细的注释，便于理解和实践。
 */

// ========== Fetch API 基础用法 ==========

/**
 * 使用 Fetch API 发送 GET 请求
 * 
 * Fetch API 是浏览器原生支持的现代 AJAX 解决方案
 * 它返回 Promise，便于链式调用和错误处理
 * 
 * @param {string} url - 请求的 URL
 * @returns {Promise} - 可以继续链式处理的 Promise
 */
function fetchData(url) {
  // fetch() 返回一个 Promise，代表请求的响应 (不一定是成功的)
  return fetch(url)
    // 第一个 then() 检查响应状态并转换为 JSON
    .then(response => {
      // 检查 HTTP 状态码是否在 200-299 范围内
      if (!response.ok) {
        // 如果不是成功的响应，抛出错误连同状态码
        // 这会被后面的 catch 捕获
        throw new Error(`HTTP 错误! 状态码: ${response.status}`);
      }
      
      // 将响应体解析为 JSON 并返回一个新的 Promise
      // (response.json() 也返回 Promise)
      return response.json();
    })
    // 第二个 then() 处理解析后的 JSON 数据
    .then(data => {
      console.log('获取的数据:', data);
      return data; // 返回数据供调用者使用
    })
    // 捕获网络错误、解析错误或上面抛出的自定义错误
    .catch(error => {
      console.error('获取数据时出错:', error.message);
      // 可以选择重新抛出错误或返回一个默认值
      throw error; // 重新抛出以便调用者知道出错了
    });
}

// 使用示例
// fetchData('https://jsonplaceholder.typicode.com/users');

/**
 * 使用 Fetch API 发送 POST 请求
 * 
 * 演示如何发送 JSON 数据并处理响应
 * 
 * @param {string} url - 请求的 URL
 * @param {object} data - 要发送的 JSON 数据
 * @returns {Promise} - 可以继续链式处理的 Promise
 */
function postData(url, data) {
  // fetch 的第二个参数是一个配置对象
  return fetch(url, {
    // 指定 HTTP 方法
    method: 'POST',
    // 设置请求头
    headers: {
      'Content-Type': 'application/json',
      // 可以添加认证令牌等其他头信息
      // 'Authorization': 'Bearer YOUR_TOKEN'
    },
    // 请求体需要转换为 JSON 字符串
    body: JSON.stringify(data),
    // 其他可选配置
    mode: 'cors', // 跨域模式: cors, no-cors, same-origin
    credentials: 'same-origin', // 发送凭据: omit, same-origin, include
    cache: 'no-cache', // 缓存控制: default, no-store, reload, no-cache, force-cache, only-if-cached
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP 错误! 状态码: ${response.status}`);
    }
    return response.json();
  })
  .then(responseData => {
    console.log('服务器响应:', responseData);
    return responseData;
  })
  .catch(error => {
    console.error('发送数据时出错:', error.message);
    throw error;
  });
}

// 使用示例
// const newUser = { name: '张三', email: 'zhangsan@example.com' };
// postData('https://jsonplaceholder.typicode.com/users', newUser);

// ========== Async/Await 模式 ==========

/**
 * 使用 async/await 模式进行 GET 请求
 * 
 * async/await 是处理 Promise 的现代语法糖，
 * 可以让异步代码看起来更像同步代码，更易于理解和维护
 * 
 * @param {string} url - 请求的 URL
 * @returns {Promise<object>} - 返回解析后的 JSON 数据
 */
async function fetchDataAsync(url) {
  try {
    // await 关键字等待 Promise 解决，并直接返回结果
    // 这使得代码看起来像是同步的，更直观
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP 错误! 状态码: ${response.status}`);
    }
    
    // 等待 JSON 解析完成
    const data = await response.json();
    console.log('获取的数据:', data);
    return data;
  } catch (error) {
    // 使用 try/catch 结构捕获错误，比链式 .catch() 更直观
    console.error('获取数据时出错:', error.message);
    throw error; // 重新抛出错误以便调用者处理
  }
}

// 使用示例
// 注意：要调用 async 函数，可以使用 .then() 或在另一个 async 函数中使用 await
/*
fetchDataAsync('https://jsonplaceholder.typicode.com/users')
  .then(data => {
    console.log('处理数据', data);
  })
  .catch(err => {
    console.error('处理错误', err);
  });
*/

/**
 * 使用 async/await 模式进行 POST 请求
 * 
 * @param {string} url - 请求的 URL
 * @param {object} data - 要发送的 JSON 数据
 * @returns {Promise<object>} - 返回服务器响应数据
 */
async function postDataAsync(url, data) {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      // 获取更详细的错误信息（如果服务器提供）
      let errorMessage = `HTTP 错误! 状态码: ${response.status}`;
      try {
        // 尝试解析错误响应中的 JSON
        const errorData = await response.json();
        errorMessage += ` - ${errorData.message || JSON.stringify(errorData)}`;
      } catch (e) {
        // 如果无法解析 JSON，使用原始错误信息
      }
      throw new Error(errorMessage);
    }
    
    const responseData = await response.json();
    console.log('服务器响应:', responseData);
    return responseData;
  } catch (error) {
    console.error('发送数据时出错:', error.message);
    throw error;
  }
}

// ========== 实用的 Fetch API 扩展 ==========

/**
 * 带超时控制的 fetch
 * 
 * 标准的 fetch 没有超时设置，这个函数添加了超时功能
 * 
 * @param {string} url - 请求的 URL
 * @param {object} options - fetch 选项
 * @param {number} timeout - 超时时间（毫秒）
 * @returns {Promise} - 可以继续链式处理的 Promise
 */
function fetchWithTimeout(url, options = {}, timeout = 5000) {
  // 创建 AbortController，用于取消 fetch 请求
  const controller = new AbortController();
  const { signal } = controller;
  
  // 创建一个超时 Promise，在指定时间后 reject
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => {
      controller.abort(); // 取消请求
      reject(new Error(`请求超时 - 超过 ${timeout}ms`));
    }, timeout);
  });
  
  // 将 signal 添加到 fetch 选项
  const fetchPromise = fetch(url, { ...options, signal });
  
  // 使用 Promise.race 竞争 fetch 和超时
  return Promise.race([fetchPromise, timeoutPromise]);
}

// 使用示例
/*
fetchWithTimeout('https://jsonplaceholder.typicode.com/users', {}, 3000)
  .then(response => response.json())
  .then(data => console.log('数据:', data))
  .catch(error => console.error('错误:', error.message));
*/

/**
 * 自动重试的 fetch
 * 
 * 当请求失败时自动重试，适用于不稳定的网络环境
 * 
 * @param {string} url - 请求的 URL
 * @param {object} options - fetch 选项
 * @param {number} maxRetries - 最大重试次数
 * @param {number} delayMs - 重试间隔（毫秒）
 * @returns {Promise} - 可以继续链式处理的 Promise
 */
async function fetchWithRetry(url, options = {}, maxRetries = 3, delayMs = 1000) {
  let lastError;
  
  // 尝试最多 maxRetries+1 次（包括初始尝试）
  for (let i = 0; i <= maxRetries; i++) {
    try {
      // 尝试发送请求
      const response = await fetch(url, options);
      
      // 如果成功，返回响应
      if (response.ok) {
        return response;
      }
      
      // 如果响应不成功，记录错误
      lastError = new Error(`HTTP 错误! 状态码: ${response.status}`);
      
      // 4xx 错误（客户端错误）通常不应重试
      if (response.status >= 400 && response.status < 500) {
        throw lastError;
      }
    } catch (error) {
      // 记录网络错误或上面抛出的客户端错误
      lastError = error;
      
      // 如果是客户端错误或已达到最大重试次数，直接抛出
      if (i === maxRetries || error.message.includes('HTTP 错误! 状态码: 4')) {
        throw lastError;
      }
    }
    
    // 等待一段时间后重试
    console.log(`请求失败，${delayMs}ms 后重试... (${i + 1}/${maxRetries})`);
    await new Promise(resolve => setTimeout(resolve, delayMs));
    
    // 可以选择增加重试间隔（指数退避）
    delayMs = delayMs * 1.5;
  }
  
  // 如果所有尝试都失败，抛出最后一个错误
  throw lastError;
}

// ========== Axios 库示例 ==========

/**
 * 使用 Axios 发送 GET 请求
 * 
 * Axios 是一个流行的 HTTP 客户端库，提供了更多高级功能和更简洁的 API
 * 注意：使用前需要安装 axios：npm install axios
 * 
 * @param {string} url - 请求的 URL
 * @returns {Promise} - 返回 Axios 响应 Promise
 */
function axiosGet(url) {
  // 这里假设已经导入了 axios
  // const axios = require('axios'); // Node.js
  // 或 import axios from 'axios'; // ES modules
  
  // 基本 GET 请求
  return axios.get(url)
    .then(response => {
      // Axios 会自动将响应 JSON 解析为 JavaScript 对象
      // 并包含在 response.data 中
      console.log('状态码:', response.status);
      console.log('数据:', response.data);
      return response.data;
    })
    .catch(error => {
      // Axios 错误对象包含详细信息
      if (error.response) {
        // 服务器返回了错误状态码
        console.error('错误响应:', error.response.status, error.response.data);
      } else if (error.request) {
        // 请求已发送但没有收到响应
        console.error('未收到响应:', error.request);
      } else {
        // 在设置请求时发生错误
        console.error('请求错误:', error.message);
      }
      throw error;
    });
}

/**
 * 使用 Axios 发送 POST 请求
 * 
 * @param {string} url - 请求的 URL
 * @param {object} data - 要发送的 JSON 数据
 * @returns {Promise} - 返回 Axios 响应 Promise
 */
function axiosPost(url, data) {
  // axios.post() 自动将 JavaScript 对象转换为 JSON
  // 并设置适当的 Content-Type 头
  return axios.post(url, data)
    .then(response => {
      console.log('状态码:', response.status);
      console.log('响应数据:', response.data);
      return response.data;
    })
    .catch(error => {
      if (error.response) {
        console.error('错误响应:', error.response.status, error.response.data);
      } else {
        console.error('请求错误:', error.message);
      }
      throw error;
    });
}

/**
 * 使用 Axios 的高级配置
 * 
 * Axios 允许创建具有特定配置的实例
 * 这在需要为多个请求设置相同的基础 URL 或头信息时很有用
 * 
 * @returns {object} - 配置好的 axios 实例
 */
function createApiClient() {
  // 创建新的 axios 实例
  const apiClient = axios.create({
    baseURL: 'https://api.example.com', // 所有请求的基础 URL
    timeout: 10000, // 10秒超时
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  });
  
  // 添加请求拦截器（在请求发送前执行）
  apiClient.interceptors.request.use(
    config => {
      // 可以在这里添加认证令牌
      // config.headers.Authorization = `Bearer ${getToken()}`;
      console.log('发送请求:', config.url);
      return config;
    },
    error => {
      console.error('请求错误:', error);
      return Promise.reject(error);
    }
  );
  
  // 添加响应拦截器（在收到响应后执行）
  apiClient.interceptors.response.use(
    response => {
      // 可以在这里统一处理响应
      console.log('收到响应:', response.status);
      return response;
    },
    error => {
      // 统一处理错误，如 401 未授权时自动重定向到登录页
      if (error.response && error.response.status === 401) {
        console.log('未授权，重定向到登录页');
        // window.location = '/login';
      }
      return Promise.reject(error);
    }
  );
  
  return apiClient;
}

// 使用 apiClient 实例
/*
const api = createApiClient();
api.get('/users')
  .then(response => console.log(response.data))
  .catch(error => console.error(error));
*/

// ========== 实际场景示例 ==========

/**
 * 实现数据加载状态指示器
 * 
 * 在数据加载过程中显示加载状态，提升用户体验
 * 
 * @param {string} url - 请求的 URL
 * @param {string} elementId - 显示加载状态和数据的元素 ID
 */
function loadDataWithIndicator(url, elementId) {
  const element = document.getElementById(elementId);
  
  // 显示加载状态
  element.innerHTML = '<div class="loading">加载中...</div>';
  
  // 发送请求
  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP 错误! 状态码: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      // 数据加载成功，更新 UI
      element.innerHTML = '';
      
      // 根据数据类型显示不同的 UI
      if (Array.isArray(data)) {
        // 如果是数组，创建列表
        const list = document.createElement('ul');
        data.forEach(item => {
          const listItem = document.createElement('li');
          listItem.textContent = typeof item === 'object' ? 
            JSON.stringify(item) : item.toString();
          list.appendChild(listItem);
        });
        element.appendChild(list);
      } else {
        // 如果是对象或其他类型，直接显示
        element.textContent = JSON.stringify(data, null, 2);
      }
    })
    .catch(error => {
      // 显示错误信息
      element.innerHTML = `
        <div class="error">
          <p>加载失败</p>
          <p>${error.message}</p>
          <button onclick="loadDataWithIndicator('${url}', '${elementId}')">
            重试
          </button>
        </div>
      `;
    });
}

/**
 * 实现表单提交与验证
 * 
 * 使用 fetch 提交表单数据，包含基本的验证逻辑
 * 
 * @param {string} formId - 表单的 ID
 * @param {string} url - 提交的 URL
 */
function setupFormSubmission(formId, url) {
  const form = document.getElementById(formId);
  
  if (!form) {
    console.error(`表单 ID "${formId}" 不存在`);
    return;
  }
  
  form.addEventListener('submit', async function(event) {
    // 阻止表单默认提交行为
    event.preventDefault();
    
    // 获取表单数据
    const formData = new FormData(form);
    const formObject = {};
    
    // 将 FormData 转换为普通对象
    formData.forEach((value, key) => {
      formObject[key] = value;
    });
    
    // 简单验证（示例）
    const errors = [];
    
    if (formObject.name && formObject.name.length < 2) {
      errors.push('名称至少需要2个字符');
    }
    
    if (formObject.email && !formObject.email.includes('@')) {
      errors.push('请输入有效的电子邮件地址');
    }
    
    // 如果有验证错误，显示错误并中止提交
    if (errors.length > 0) {
      const errorElement = document.getElementById(`${formId}-errors`) || 
                          document.createElement('div');
      
      errorElement.id = `${formId}-errors`;
      errorElement.className = 'form-errors';
      errorElement.innerHTML = `
        <ul>
          ${errors.map(error => `<li>${error}</li>`).join('')}
        </ul>
      `;
      
      form.parentNode.insertBefore(errorElement, form);
      return;
    }
    
    // 清除任何现有错误
    const existingErrors = document.getElementById(`${formId}-errors`);
    if (existingErrors) {
      existingErrors.remove();
    }
    
    // 禁用提交按钮，防止重复提交
    const submitButton = form.querySelector('button[type="submit"]');
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = '提交中...';
    }
    
    try {
      // 发送数据
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formObject)
      });
      
      if (!response.ok) {
        throw new Error(`提交失败: ${response.status}`);
      }
      
      const result = await response.json();
      
      // 显示成功消息
      const successElement = document.createElement('div');
      successElement.className = 'form-success';
      successElement.textContent = '表单提交成功！';
      
      // 清空表单
      form.reset();
      
      // 在表单后显示成功消息
      form.parentNode.insertBefore(successElement, form.nextSibling);
      
      // 3秒后移除成功消息
      setTimeout(() => {
        successElement.remove();
      }, 3000);
      
    } catch (error) {
      // 显示错误消息
      const errorElement = document.createElement('div');
      errorElement.className = 'form-errors';
      errorElement.innerHTML = `<p>提交出错: ${error.message}</p>`;
      
      form.parentNode.insertBefore(errorElement, form);
    } finally {
      // 重新启用提交按钮
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = '提交';
      }
    }
  });
}

// ========== 导出实用函数 ==========

// 如果在模块环境中，可以导出这些函数
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    // Fetch API 基础
    fetchData,
    postData,
    
    // Async/Await
    fetchDataAsync,
    postDataAsync,
    
    // 增强的 Fetch
    fetchWithTimeout,
    fetchWithRetry,
    
    // Axios 示例（需要安装 axios）
    axiosGet,
    axiosPost,
    createApiClient,
    
    // 实际场景
    loadDataWithIndicator,
    setupFormSubmission
  };
} 