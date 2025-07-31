# Node.js HTTP 模块练习题

## 基础练习

### 练习 1: 创建基本 HTTP 服务器

创建一个 HTTP 服务器，监听 3000 端口，对所有请求返回"Hello World"文本。

### 练习 2: 解析 URL 参数

创建一个 HTTP 服务器，当访问`/hello?name=xxx`时，返回`Hello, xxx!`，如果没有提供 name 参数，则返回`Hello, Guest!`。

### 练习 3: 根据不同路径返回不同内容

创建一个 HTTP 服务器，实现以下路由:

- `/` - 返回"欢迎访问首页"
- `/about` - 返回"关于我们"
- `/contact` - 返回"联系我们"
- 其他路径 - 返回 404 状态码和"页面不存在"

### 练习 4: 处理不同 HTTP 方法

创建一个 HTTP 服务器，针对`/api/data`路径:

- GET 请求 - 返回 JSON 数据`{message: "这是GET请求"}`
- POST 请求 - 返回 JSON 数据`{message: "这是POST请求"}`
- 其他方法 - 返回 405 状态码和"方法不允许"

### 练习 5: 解析 JSON 请求体

创建一个 HTTP 服务器，当收到 POST 请求到`/api/echo`时，解析请求体中的 JSON 数据并原样返回。如果数据不是有效的 JSON，返回 400 状态码和错误信息。

## 中级练习

### 练习 6: 实现静态文件服务器

创建一个 HTTP 服务器，能够提供指定目录（如`./public`）下的静态文件。要求:

- 正确设置 Content-Type 头
- 处理文件不存在的情况
- 支持子目录访问

### 练习 7: 实现 RESTful API - 简易任务列表

创建一个任务列表 API，支持以下操作:

- GET `/tasks` - 返回所有任务
- GET `/tasks/:id` - 返回指定 ID 的任务
- POST `/tasks` - 创建新任务
- PUT `/tasks/:id` - 更新指定任务
- DELETE `/tasks/:id` - 删除指定任务

使用内存数组存储任务数据。

### 练习 8: 文件上传处理

创建一个 HTTP 服务器，处理`/upload`路径的 POST 请求，将上传的文件保存到`./uploads`目录。

- 提示: 可以使用`formidable`库简化实现
- 进阶: 尝试不使用第三方库实现

### 练习 9: 实现基本身份验证

创建一个 HTTP 服务器，对`/admin`路径实施基本 HTTP 身份验证:

- 要求用户提供用户名和密码
- 验证通过后显示"管理面板"
- 验证失败返回 401 状态码

### 练习 10: 服务器发送事件(SSE)实时计数器

创建一个使用 SSE 的实时计数器:

- 浏览器访问页面后，服务器每秒发送一个递增的数字
- 实现一个简单的 HTML 页面显示这些数据
- 确保正确处理客户端断开连接

## 高级练习

### 练习 11: 实现简单反向代理

创建一个 HTTP 代理服务器，将请求转发到另一个服务器:

- 转发所有请求头和请求体
- 将响应返回给客户端
- 处理错误情况

### 练习 12: 实现限流中间件

创建一个限流功能:

- 每个 IP 每分钟最多允许 30 个请求
- 超过限制返回 429 状态码
- 在响应头中添加剩余配额信息

### 练习 13: HTTP 客户端实现

编写代码获取指定 URL 的内容:

- 支持 GET 和 POST 请求
- 处理重定向
- 设置超时
- 处理各种错误情况

### 练习 14: 实现 WebSocket 握手

实现 HTTP 到 WebSocket 的协议升级:

- 正确处理 WebSocket 握手
- 实现简单的消息收发
- 处理连接关闭

### 练习 15: HTTPS 服务器

创建一个 HTTPS 服务器:

- 生成自签名证书
- 配置 HTTPS 选项
- 实现与 HTTP 服务器相同的功能

## 实战练习

### 练习 16: 完整聊天应用

创建一个实时聊天应用:

- 使用 HTTP 提供静态文件
- 使用 WebSocket 实现实时通信
- 实现用户名设置、消息发送和接收
- 显示在线用户列表

### 练习 17: API 网关

实现一个简单的 API 网关:

- 路由请求到不同的后端服务
- 实现请求合并
- 添加认证层
- 实现简单的缓存机制

### 练习 18: 监控仪表板

创建一个 HTTP 服务器性能监控仪表板:

- 记录请求数、响应时间等指标
- 使用 SSE 实时更新数据
- 显示图表和统计信息
- 提供历史数据查询

## 答案示例

### 练习 1 答案:

```javascript
const http = require("http");

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");
  res.end("Hello World");
});

server.listen(3000, "127.0.0.1", () => {
  console.log("服务器运行在 http://127.0.0.1:3000/");
});
```

### 练习 2 答案:

```javascript
const http = require("http");
const url = require("url");

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const name = parsedUrl.query.name || "Guest";

  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.end(`Hello, ${name}!`);
});

server.listen(3000, "127.0.0.1", () => {
  console.log("服务器运行在 http://127.0.0.1:3000/");
});
```

### 练习 5 答案:

```javascript
const http = require("http");

const server = http.createServer((req, res) => {
  if (req.method === "POST" && req.url === "/api/echo") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      try {
        const data = JSON.parse(body);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(data));
      } catch (e) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "无效的JSON数据" }));
      }
    });
  } else {
    res.statusCode = 404;
    res.end("Not Found");
  }
});

server.listen(3000, "127.0.0.1", () => {
  console.log("服务器运行在 http://127.0.0.1:3000/");
});
```
