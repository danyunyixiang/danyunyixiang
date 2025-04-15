# AJAX 技术详解

## 什么是 AJAX

AJAX（Asynchronous JavaScript and XML）是一种在不重新加载整个页面的情况下，与服务器交换数据并更新部分网页的技术。它使用了以下技术的组合：

- 浏览器内置的 `XMLHttpRequest` 对象（或新的 `fetch` API）
- JavaScript 和 DOM（文档对象模型）
- HTML 和 CSS 用于信息显示和样式
- 数据交换格式，通常是 JSON 或 XML

## AJAX 的工作原理

1. 网页中的事件触发 AJAX 调用（如按钮点击）
2. JavaScript 创建 `XMLHttpRequest` 对象或使用 `fetch` API
3. 向服务器发送请求
4. 服务器处理请求并返回响应
5. JavaScript 处理响应并更新页面内容

## 基本用法

### 使用 Fetch API（现代方法）

```javascript
fetch("https://api.example.com/data")
  .then((response) => {
    // 检查响应状态
    if (!response.ok) {
      throw new Error("网络响应不正常");
    }
    return response.json(); // 解析 JSON 响应
  })
  .then((data) => {
    // 处理数据
    console.log(data);
    document.getElementById("result").textContent = data.message;
  })
  .catch((error) => {
    // 处理错误
    console.error("获取数据出错:", error);
  });
```

### 使用 Async/Await（更现代的方法）

```javascript
async function fetchData(url) {
  try {
    // 发起请求并等待响应
    const response = await fetch(url);

    // 检查响应状态
    if (!response.ok) {
      throw new Error(`HTTP 错误! 状态码: ${response.status}`);
    }

    // 解析JSON响应
    const data = await response.json();

    // 处理数据
    console.log("获取的数据:", data);
    document.getElementById("result").textContent = data.message;
    return data;
  } catch (error) {
    // 使用 try/catch 结构处理错误
    console.error("获取数据时出错:", error.message);
    document.getElementById("error").textContent = error.message;
    throw error;
  }
}

// 调用示例
// fetchData('https://api.example.com/data');
```

## POST 请求示例

### 使用 Fetch API 发送 POST 请求

```javascript
const data = {
  name: "John",
  email: "john@example.com",
  message: "这是一个测试消息",
};

fetch("https://api.example.com/submit", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(data),
})
  .then((response) => response.json())
  .then((data) => {
    console.log("提交成功:", data);
  })
  .catch((error) => {
    console.error("提交错误:", error);
  });
```

### 使用 Async/Await 发送 POST 请求

```javascript
async function postData(url, data) {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`提交失败: ${response.status}`);
    }

    const responseData = await response.json();
    console.log("提交成功:", responseData);
    return responseData;
  } catch (error) {
    console.error("提交出错:", error.message);
    throw error;
  }
}

// 调用示例
// const formData = { name: "张三", email: "zhangsan@example.com" };
// postData('https://api.example.com/submit', formData);
```

## 实用的 Fetch API 扩展

### 带超时控制的 fetch

```javascript
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
// fetchWithTimeout('https://api.example.com/data', {}, 3000)
//   .then(response => response.json())
//   .then(data => console.log('数据:', data))
//   .catch(error => console.error('错误:', error.message));
```

### 自动重试的 fetch

```javascript
async function fetchWithRetry(
  url,
  options = {},
  maxRetries = 3,
  delayMs = 1000
) {
  let lastError;

  for (let i = 0; i <= maxRetries; i++) {
    try {
      const response = await fetch(url, options);
      if (response.ok) return response;

      lastError = new Error(`HTTP 错误! 状态码: ${response.status}`);
      // 4xx 错误（客户端错误）通常不应重试
      if (response.status >= 400 && response.status < 500) throw lastError;
    } catch (error) {
      lastError = error;
      if (i === maxRetries) throw lastError;
    }

    console.log(`请求失败，${delayMs}ms 后重试... (${i + 1}/${maxRetries})`);
    await new Promise((resolve) => setTimeout(resolve, delayMs));
    // 指数退避策略
    delayMs = delayMs * 1.5;
  }

  throw lastError;
}
```

## 实际应用示例

### 加载用户数据并显示在表格中

```html
<!DOCTYPE html>
<html>
  <head>
    <title>AJAX 用户列表</title>
    <style>
      table {
        border-collapse: collapse;
        width: 100%;
      }
      th,
      td {
        border: 1px solid #ddd;
        padding: 8px;
        text-align: left;
      }
      th {
        background-color: #f2f2f2;
      }
      button {
        padding: 10px;
        margin-bottom: 20px;
      }
      .loading {
        padding: 20px;
        text-align: center;
        color: #666;
      }
      .error {
        color: red;
        padding: 10px;
        border: 1px solid red;
        background: #fff0f0;
      }
    </style>
  </head>
  <body>
    <h1>用户列表</h1>
    <button id="loadUsers">加载用户</button>

    <div id="userContainer"></div>

    <script>
      document
        .getElementById("loadUsers")
        .addEventListener("click", function () {
          loadDataWithIndicator(
            "https://jsonplaceholder.typicode.com/users",
            "userContainer"
          );
        });

      function loadDataWithIndicator(url, elementId) {
        const element = document.getElementById(elementId);

        // 显示加载状态
        element.innerHTML = '<div class="loading">加载中...</div>';

        // 发送请求
        fetch(url)
          .then((response) => {
            if (!response.ok) {
              throw new Error(`HTTP 错误! 状态码: ${response.status}`);
            }
            return response.json();
          })
          .then((users) => {
            // 清空表格内容
            element.innerHTML = "";

            // 创建表格
            const table = document.createElement("table");

            // 添加表头
            const thead = document.createElement("thead");
            const headerRow = document.createElement("tr");

            ["ID", "姓名", "电子邮件", "电话"].forEach((text) => {
              const th = document.createElement("th");
              th.textContent = text;
              headerRow.appendChild(th);
            });

            thead.appendChild(headerRow);
            table.appendChild(thead);

            // 添加表体
            const tbody = document.createElement("tbody");

            users.forEach((user) => {
              const row = document.createElement("tr");

              // ID 单元格
              const idCell = document.createElement("td");
              idCell.textContent = user.id;
              row.appendChild(idCell);

              // 姓名单元格
              const nameCell = document.createElement("td");
              nameCell.textContent = user.name;
              row.appendChild(nameCell);

              // 邮件单元格
              const emailCell = document.createElement("td");
              emailCell.textContent = user.email;
              row.appendChild(emailCell);

              // 电话单元格
              const phoneCell = document.createElement("td");
              phoneCell.textContent = user.phone;
              row.appendChild(phoneCell);

              tbody.appendChild(row);
            });

            table.appendChild(tbody);
            element.appendChild(table);
          })
          .catch((error) => {
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
    </script>
  </body>
</html>
```

## AJAX 的优缺点

### 优点

- 无需刷新页面即可更新数据
- 在后台与服务器通信，不中断用户体验
- 减少带宽使用，因为只传输需要的数据
- 分离数据和表现层，提高开发效率

### 缺点

- 浏览器后退按钮对 AJAX 页面无效
- 搜索引擎可能无法索引 AJAX 内容
- 依赖 JavaScript，禁用 JS 的用户无法使用
- 跨域请求存在安全限制（同源策略）

## 处理跨域请求

### 使用 CORS（跨域资源共享）

服务器需要设置适当的响应头：

```
Access-Control-Allow-Origin: *
```

或者指定特定域名：

```
Access-Control-Allow-Origin: https://your-domain.com
```

## 现代 AJAX 替代方案

### axios 库

axios 是一个流行的基于 Promise 的 HTTP 客户端，具有更简洁的 API 和更多高级功能。

```javascript
// GET 请求
axios
  .get("https://api.example.com/data")
  .then((response) => {
    console.log(response.data);
  })
  .catch((error) => {
    console.error("错误:", error);
  });

// POST 请求
axios
  .post("https://api.example.com/submit", {
    name: "John",
    email: "john@example.com",
  })
  .then((response) => {
    console.log(response.data);
  })
  .catch((error) => {
    console.error("错误:", error);
  });
```

### 使用 axios 与 async/await

```javascript
async function getData() {
  try {
    const response = await axios.get("https://api.example.com/data");
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("获取数据出错:", error.message);
    throw error;
  }
}
```

### axios 的高级配置

```javascript
// 创建自定义实例
const api = axios.create({
  baseURL: "https://api.example.com", // 基础URL
  timeout: 10000, // 10秒超时
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// 添加请求拦截器
api.interceptors.request.use(
  (config) => {
    // 可以在这里添加认证令牌
    // config.headers.Authorization = `Bearer ${getToken()}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// 添加响应拦截器
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 处理401错误
    if (error.response && error.response.status === 401) {
      // 未授权，重定向到登录页
    }
    return Promise.reject(error);
  }
);

// 使用自定义实例
api.get("/users").then((response) => console.log(response.data));
```

### jQuery AJAX

虽然现代应用程序越来越少使用 jQuery，但在许多现有项目中仍然可以找到：

```javascript
// GET 请求
$.ajax({
  url: "https://api.example.com/data",
  method: "GET",
  success: function (response) {
    console.log("数据:", response);
  },
  error: function (xhr, status, error) {
    console.error("错误:", error);
  },
});

// POST 请求
$.ajax({
  url: "https://api.example.com/submit",
  method: "POST",
  data: JSON.stringify({
    name: "John",
    email: "john@example.com",
  }),
  contentType: "application/json",
  success: function (response) {
    console.log("提交成功:", response);
  },
  error: function (xhr, status, error) {
    console.error("提交错误:", error);
  },
});
```

## 小结

AJAX 技术显著改变了网页应用的用户体验，让网页变得更像桌面应用程序。现代 Web 开发中，几乎所有交互式网站都使用某种形式的 AJAX 技术。随着 Fetch API 和 Promise 的出现，AJAX 编程变得更加简洁和强大，而 async/await 语法则进一步提高了代码的可读性。

要精通 AJAX，需要理解异步编程概念、HTTP 请求/响应模型以及如何有效处理和展示从服务器获取的数据。
