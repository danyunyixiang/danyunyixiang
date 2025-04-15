/**
 * URL 工具函数库
 * 
 * 提供处理和操作URL的实用函数集合
 */

/**
 * 解析URL字符串，返回各个组成部分
 * 
 * @param {string} urlString - 要解析的URL字符串
 * @returns {object} - 解析后的URL对象
 */
function parseUrl(urlString) {
  try {
    const url = new URL(urlString);
    return {
      protocol: url.protocol, // 包含末尾冒号
      hostname: url.hostname, // 不包含端口
      port: url.port || (url.protocol === 'https:' ? '443' : '80'),
      pathname: url.pathname,
      search: url.search, // 包含?
      hash: url.hash, // 包含#
      host: url.host, // 包含端口(如果指定了)
      origin: url.origin, // 协议+主机+端口
      username: url.username,
      password: url.password,
      searchParams: Object.fromEntries(url.searchParams.entries())
    };
  } catch (error) {
    throw new Error(`无效的URL: ${error.message}`);
  }
}

/**
 * 构建URL，支持添加路径和查询参数
 * 
 * @param {string} baseUrl - 基础URL
 * @param {string} [path=''] - 可选的路径
 * @param {object} [params={}] - 可选的查询参数对象
 * @returns {string} - 构建的完整URL
 */
function buildUrl(baseUrl, path = '', params = {}) {
  try {
    // 处理基础URL和路径
    const url = new URL(path, baseUrl);
    
    // 添加查询参数
    Object.entries(params).forEach(([key, value]) => {
      // 处理数组值
      if (Array.isArray(value)) {
        value.forEach(item => {
          url.searchParams.append(key, item);
        });
      } 
      // 跳过null和undefined值
      else if (value !== null && value !== undefined) {
        url.searchParams.set(key, value);
      }
    });
    
    return url.toString();
  } catch (error) {
    throw new Error(`构建URL失败: ${error.message}`);
  }
}

/**
 * 从URL中提取查询参数
 * 
 * @param {string} [url] - 可选的URL字符串，默认为当前页面URL
 * @returns {object} - 包含所有查询参数的对象
 */
function getQueryParams(url) {
  const urlObj = url ? new URL(url) : new URL(window.location.href);
  return Object.fromEntries(urlObj.searchParams.entries());
}

/**
 * 从URL中获取特定的查询参数值
 * 
 * @param {string} name - 参数名
 * @param {string} [url] - 可选的URL字符串，默认为当前页面URL
 * @returns {string|null} - 参数值，不存在则返回null
 */
function getQueryParam(name, url) {
  const urlObj = url ? new URL(url) : new URL(window.location.href);
  return urlObj.searchParams.get(name);
}

/**
 * 修改URL的查询参数
 * 
 * @param {string} url - 原始URL
 * @param {object} paramsToUpdate - 要更新的参数对象
 * @param {string[]} [paramsToRemove=[]] - 要移除的参数名称数组
 * @returns {string} - 更新后的URL
 */
function updateQueryParams(url, paramsToUpdate, paramsToRemove = []) {
  const urlObj = new URL(url);
  
  // 添加或更新参数
  Object.entries(paramsToUpdate).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      urlObj.searchParams.set(key, value);
    }
  });
  
  // 移除指定的参数
  paramsToRemove.forEach(param => {
    urlObj.searchParams.delete(param);
  });
  
  return urlObj.toString();
}

/**
 * 将相对URL转换为绝对URL
 * 
 * @param {string} relativeUrl - 相对URL
 * @param {string} [baseUrl] - 基础URL，默认为当前页面URL
 * @returns {string} - 绝对URL
 */
function resolveUrl(relativeUrl, baseUrl) {
  const base = baseUrl || window.location.href;
  return new URL(relativeUrl, base).href;
}

/**
 * 获取URL的路径部分，可选择性地包含查询参数和片段
 * 
 * @param {string} url - 原始URL
 * @param {object} [options] - 选项
 * @param {boolean} [options.includeQuery=false] - 是否包含查询参数
 * @param {boolean} [options.includeHash=false] - 是否包含片段标识符
 * @returns {string} - 提取的URL路径
 */
function getUrlPath(url, options = {}) {
  const { includeQuery = false, includeHash = false } = options;
  const urlObj = new URL(url);
  
  let result = urlObj.pathname;
  
  if (includeQuery && urlObj.search) {
    result += urlObj.search;
  }
  
  if (includeHash && urlObj.hash) {
    result += urlObj.hash;
  }
  
  return result;
}

/**
 * 安全编码URL参数
 * 
 * @param {string} value - 要编码的值
 * @returns {string} - 编码后的值
 */
function encodeUrlParam(value) {
  return encodeURIComponent(value)
    .replace(/[!'()*]/g, c => `%${c.charCodeAt(0).toString(16).toUpperCase()}`);
}

/**
 * 创建分页URL
 * 
 * @param {string} baseUrl - 基础URL
 * @param {number} page - 页码
 * @param {number} [pageSize] - 每页项目数
 * @param {object} [additionalParams={}] - 额外的查询参数
 * @returns {string} - 构建的分页URL
 */
function buildPaginationUrl(baseUrl, page, pageSize, additionalParams = {}) {
  const params = { 
    ...additionalParams,
    page
  };
  
  if (pageSize !== undefined) {
    params.pageSize = pageSize;
  }
  
  return buildUrl(baseUrl, '', params);
}

/**
 * 生成一系列分页链接
 * 
 * @param {string} baseUrl - 基础URL
 * @param {number} currentPage - 当前页码
 * @param {number} totalPages - 总页数
 * @param {number} [maxLinks=5] - 最多显示的链接数
 * @param {object} [options] - 额外选项
 * @returns {Array<{page: number, url: string, current: boolean}>} - 分页链接数组
 */
function generatePaginationLinks(baseUrl, currentPage, totalPages, maxLinks = 5, options = {}) {
  const links = [];
  
  // 计算要显示的页码范围
  let startPage = Math.max(1, currentPage - Math.floor(maxLinks / 2));
  let endPage = Math.min(totalPages, startPage + maxLinks - 1);
  
  // 调整起始页，确保显示正确数量的链接
  if (endPage - startPage + 1 < maxLinks) {
    startPage = Math.max(1, endPage - maxLinks + 1);
  }
  
  // 生成链接
  for (let i = startPage; i <= endPage; i++) {
    links.push({
      page: i,
      url: buildPaginationUrl(baseUrl, i, options.pageSize, options.additionalParams),
      current: i === currentPage
    });
  }
  
  return links;
}

/**
 * 解析URL路径参数
 * 例如，对于模式"/users/:id/profile"和路径"/users/123/profile"，
 * 将返回{id: "123"}
 * 
 * @param {string} pattern - 路径模式，包含:param占位符
 * @param {string} path - 实际路径
 * @returns {object|null} - 解析的参数对象，如果不匹配则返回null
 */
function extractPathParams(pattern, path) {
  // 创建正则表达式，将:param替换为捕获组
  const paramNames = [];
  const regexPattern = pattern
    .replace(/:[^\s/]+/g, (match) => {
      paramNames.push(match.substring(1));
      return '([^/]+)';
    })
    .replace(/\/$/, '') // 移除尾部斜杠
    + '/?$'; // 匹配可选的尾部斜杠
  
  const regex = new RegExp(regexPattern);
  const match = path.replace(/\/$/, '').match(regex);
  
  if (!match) {
    return null;
  }
  
  // 提取参数值
  const params = {};
  paramNames.forEach((name, index) => {
    params[name] = match[index + 1];
  });
  
  return params;
}

/**
 * 检查URL是否为绝对URL
 * 
 * @param {string} url - 要检查的URL
 * @returns {boolean} - 如果是绝对URL则返回true
 */
function isAbsoluteUrl(url) {
  return /^(?:[a-z]+:)?\/\//i.test(url);
}

/**
 * 从URL中获取域名
 * 
 * @param {string} url - 输入URL
 * @returns {string} - 提取的域名
 */
function getDomain(url) {
  try {
    return new URL(url).hostname;
  } catch (e) {
    throw new Error('无效的URL');
  }
}

/**
 * 获取URL的文件扩展名
 * 
 * @param {string} url - 输入URL
 * @returns {string|null} - 文件扩展名或null（如果没有扩展名）
 */
function getFileExtension(url) {
  try {
    const pathname = new URL(url).pathname;
    const matches = pathname.match(/\.([^.]+)$/);
    return matches ? matches[1].toLowerCase() : null;
  } catch (e) {
    // 尝试直接从字符串提取
    const matches = url.match(/\.([^.]+)$/);
    return matches ? matches[1].toLowerCase() : null;
  }
}

// 导出所有函数
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    parseUrl,
    buildUrl,
    getQueryParams,
    getQueryParam,
    updateQueryParams,
    resolveUrl,
    getUrlPath,
    encodeUrlParam,
    buildPaginationUrl,
    generatePaginationLinks,
    extractPathParams,
    isAbsoluteUrl,
    getDomain,
    getFileExtension
  };
} 