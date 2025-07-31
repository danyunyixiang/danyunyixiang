# Node.js HTTP 模块详解

## HTTP 模块原理

### 1. 模块架构

Node.js 的 HTTP 模块是基于底层的 `net` 模块构建的，它实现了 HTTP/1.1 协议。主要包含以下几个核心组件：

- **HTTP 服务器 (Server)**: 负责监听端口，接收和处理 HTTP 请求
- **HTTP 客户端 (Client)**: 用于发送 HTTP 请求到其他服务器
- **请求对象 (Request)**: 封装了客户端发送的 HTTP 请求信息
- **响应对象 (Response)**: 封装了服务器返回的 HTTP 响应信息

### 2. 事件驱动机制

HTTP 模块采用 Node.js 的事件驱动、非阻塞 I/O 模型：

```javascript
// 事件驱动示例
server.on("request", (req, res) => {
  // 处理请求
});

server.on("connection", (socket) => {
  // 处理新连接
});

server.on("error", (err) => {
  // 处理错误
});
```

- 当新连接建立时，触发 `connection` 事件
- 当收到 HTTP 请求时，触发 `request` 事件
- 当发生错误时，触发 `error` 事件

### 3. 请求处理流程

1. **连接建立**:

   - 客户端通过 TCP 连接到服务器
   - 服务器创建新的 socket 连接
   - 触发 `connection` 事件

2. **请求解析**:

   - 服务器接收 HTTP 请求报文
   - 解析请求行、请求头和请求体
   - 创建 `http.IncomingMessage` 对象

3. **请求处理**:

   - 触发 `request` 事件
   - 执行请求处理函数
   - 创建 `http.ServerResponse` 对象

4. **响应发送**:
   - 设置响应状态码和头信息
   - 写入响应体
   - 结束响应，关闭连接

### 4. 流式处理

HTTP 模块使用 Node.js 的流（Stream）机制处理数据：

```javascript
// 请求体流式处理
req.on("data", (chunk) => {
  // 处理数据块
});

// 响应体流式处理
res.write("数据块1");
res.write("数据块2");
res.end();
```

- 请求和响应都是可读/可写流
- 支持分块传输数据
- 减少内存使用，提高性能

### 5. 连接管理

HTTP 模块实现了连接池和连接复用机制：

- 默认启用 `keep-alive` 连接
- 自动管理连接的生命周期
- 支持连接超时和空闲连接清理

### 6. 安全性考虑

- 支持 HTTPS 协议
- 提供基本的请求验证机制
- 支持 CORS 跨域资源共享
- 可配置请求大小限制

## 基础概念

HTTP 模块是 Node.js 的核心模块之一，用于创建 HTTP 服务器和客户端。它提供了处理 HTTP 请求和响应的底层 API。

## 创建基本 HTTP 服务器

```javascript
const http = require("http");

// 创建HTTP服务器
const server = http.createServer((req, res) => {
  // 设置状态码和响应头
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");

  // 发送响应数据并结束响应
  res.end("Hello World\n");
});

// 监听3000端口
server.listen(3000, "127.0.0.1", () => {
  console.log("服务器运行在 http://127.0.0.1:3000/");
});
```

## 请求对象(Request)

`request`对象包含关于客户端请求的所有信息：

```javascript
server.on("request", (req, res) => {
  // 请求方法: GET, POST, PUT 等
  console.log(req.method);

  // 请求URL
  console.log(req.url);

  // HTTP版本
  console.log(req.httpVersion);

  // 请求头
  console.log(req.headers);

  // 获取请求体
  let body = [];
  req.on("data", (chunk) => {
    body.push(chunk);
  });
  req.on("end", () => {
    body = Buffer.concat(body).toString();
    console.log(body);
    // 处理请求体...
  });
});
```

## 响应对象(Response)

`response`对象用于向客户端发送数据：

```javascript
http
  .createServer((req, res) => {
    // 设置状态码
    res.statusCode = 200;

    // 设置响应头
    res.setHeader("Content-Type", "application/json");
    res.setHeader("X-Custom-Header", "CustomValue");

    // 一次性设置多个响应头
    res.writeHead(200, {
      "Content-Type": "application/json",
      "X-Custom-Header": "CustomValue",
    });

    // 写入响应体
    res.write('{"message": "Part 1"}');
    res.write('{"message": "Part 2"}');

    // 结束响应
    res.end('{"message": "Complete"}');
  })
  .listen(3000);
```

## 处理不同 HTTP 方法

```javascript
http
  .createServer((req, res) => {
    const { method, url } = req;

    switch (method) {
      case "GET":
        handleGet(url, res);
        break;
      case "POST":
        handlePost(req, res);
        break;
      case "PUT":
        handlePut(req, res);
        break;
      case "DELETE":
        handleDelete(url, res);
        break;
      default:
        res.statusCode = 405;
        res.end(`${method} 方法不允许`);
    }
  })
  .listen(3000);
```

## 解析 URL 和查询参数

```javascript
const http = require("http");
const url = require("url");

http
  .createServer((req, res) => {
    // 解析URL
    const parsedUrl = url.parse(req.url, true);

    // 获取路径
    const pathname = parsedUrl.pathname;

    // 获取查询参数
    const query = parsedUrl.query;

    res.end(`路径: ${pathname}, 查询参数: ${JSON.stringify(query)}`);
  })
  .listen(3000);
```

## 解析请求体

```javascript
http
  .createServer((req, res) => {
    if (req.method === "POST") {
      let body = "";

      // 接收数据片段
      req.on("data", (chunk) => {
        body += chunk.toString();
      });

      // 数据接收完毕
      req.on("end", () => {
        try {
          const data = JSON.parse(body);
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ received: data }));
        } catch (e) {
          res.statusCode = 400;
          res.end("无效的JSON数据");
        }
      });
    } else {
      res.statusCode = 405;
      res.end("仅支持POST请求");
    }
  })
  .listen(3000);
```

## 路由处理

```javascript
http
  .createServer((req, res) => {
    const { url, method } = req;

    // 简单路由
    if (url === "/api/users" && method === "GET") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ users: ["用户1", "用户2"] }));
    } else if (url === "/api/users" && method === "POST") {
      // 处理添加用户...
      res.end("添加用户");
    } else if (url.match(/^\/api\/users\/\d+$/) && method === "GET") {
      // 获取用户ID
      const userId = url.split("/").pop();
      res.end(`获取ID为 ${userId} 的用户`);
    } else {
      res.statusCode = 404;
      res.end("未找到");
    }
  })
  .listen(3000);
```

## 错误处理

```javascript
const server = http.createServer((req, res) => {
  // 处理请求...
});

// 监听服务器错误
server.on("error", (err) => {
  console.error("服务器错误:", err);
});

// 监听客户端错误
server.on("clientError", (err, socket) => {
  socket.end("HTTP/1.1 400 Bad Request\r\n\r\n");
});

server.listen(3000);
```

## HTTP 客户端 - 发送请求

```javascript
const http = require("http");

// GET请求
http
  .get("http://example.com", (res) => {
    let data = "";

    // 接收数据
    res.on("data", (chunk) => {
      data += chunk;
    });

    // 数据接收完毕
    res.on("end", () => {
      console.log(data);
    });
  })
  .on("error", (err) => {
    console.error(`错误: ${err.message}`);
  });

// POST请求(或其他方法)
const options = {
  hostname: "example.com",
  port: 80,
  path: "/api/data",
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Content-Length": Buffer.byteLength(postData),
  },
};

const postData = JSON.stringify({ key: "value" });

const req = http.request(options, (res) => {
  let data = "";
  res.on("data", (chunk) => {
    data += chunk;
  });
  res.on("end", () => {
    console.log(data);
  });
});

req.on("error", (e) => {
  console.error(`请求错误: ${e.message}`);
});

// 写入请求体
req.write(postData);
req.end();
```

## 处理文件上传

```javascript
http
  .createServer((req, res) => {
    if (
      req.method === "POST" &&
      req.headers["content-type"].includes("multipart/form-data")
    ) {
      const boundary = req.headers["content-type"].split("boundary=")[1];

      // 这里需要实现multipart解析
      // 实际项目中建议使用成熟的库如formidable或multer
      // 简化示例:
      let fileData = Buffer.alloc(0);

      req.on("data", (chunk) => {
        fileData = Buffer.concat([fileData, chunk]);
      });

      req.on("end", () => {
        res.end("文件上传成功");
      });
    } else {
      res.statusCode = 400;
      res.end("仅支持文件上传");
    }
  })
  .listen(3000);
```

## 服务器发送事件(SSE)

```javascript
http
  .createServer((req, res) => {
    if (req.url === "/events") {
      // 设置SSE响应头
      res.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      });

      // 发送初始数据
      res.write("data: 连接已建立\n\n");

      // 每秒发送一次数据
      const intervalId = setInterval(() => {
        res.write(`data: ${new Date().toISOString()}\n\n`);
      }, 1000);

      // 客户端断开连接时清理资源
      req.on("close", () => {
        clearInterval(intervalId);
      });
    } else {
      res.end("访问 /events 获取实时更新");
    }
  })
  .listen(3000);
```

## 实现 RESTful API

```javascript
// 模拟数据库
const users = [
  { id: 1, name: "张三" },
  { id: 2, name: "李四" },
];

http
  .createServer((req, res) => {
    const { url, method } = req;

    // 设置CORS头以允许跨域请求
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    // 处理预检请求
    if (method === "OPTIONS") {
      res.statusCode = 204;
      res.end();
      return;
    }

    // 获取所有用户
    if (url === "/api/users" && method === "GET") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(users));
    }
    // 获取单个用户
    else if (url.match(/^\/api\/users\/\d+$/) && method === "GET") {
      const id = parseInt(url.split("/").pop());
      const user = users.find((u) => u.id === id);

      if (user) {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(user));
      } else {
        res.statusCode = 404;
        res.end(JSON.stringify({ error: "用户不存在" }));
      }
    }
    // 创建用户
    else if (url === "/api/users" && method === "POST") {
      let body = "";

      req.on("data", (chunk) => {
        body += chunk.toString();
      });

      req.on("end", () => {
        try {
          const newUser = JSON.parse(body);
          newUser.id = users.length + 1;
          users.push(newUser);

          res.writeHead(201, { "Content-Type": "application/json" });
          res.end(JSON.stringify(newUser));
        } catch (e) {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: "无效数据" }));
        }
      });
    }
    // 更新用户
    else if (url.match(/^\/api\/users\/\d+$/) && method === "PUT") {
      const id = parseInt(url.split("/").pop());
      let body = "";

      req.on("data", (chunk) => {
        body += chunk.toString();
      });

      req.on("end", () => {
        try {
          const userData = JSON.parse(body);
          const index = users.findIndex((u) => u.id === id);

          if (index !== -1) {
            users[index] = { ...users[index], ...userData, id };
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(users[index]));
          } else {
            res.statusCode = 404;
            res.end(JSON.stringify({ error: "用户不存在" }));
          }
        } catch (e) {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: "无效数据" }));
        }
      });
    }
    // 删除用户
    else if (url.match(/^\/api\/users\/\d+$/) && method === "DELETE") {
      const id = parseInt(url.split("/").pop());
      const index = users.findIndex((u) => u.id === id);

      if (index !== -1) {
        const deletedUser = users.splice(index, 1)[0];
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(deletedUser));
      } else {
        res.statusCode = 404;
        res.end(JSON.stringify({ error: "用户不存在" }));
      }
    } else {
      res.statusCode = 404;
      res.end(JSON.stringify({ error: "资源不存在" }));
    }
  })
  .listen(3000, () => {
    console.log("RESTful API 服务运行在 http://localhost:3000");
  });
```

## 使用 HTTPS

```javascript
const https = require("https");
const fs = require("fs");

const options = {
  key: fs.readFileSync("server-key.pem"),
  cert: fs.readFileSync("server-cert.pem"),
};

https
  .createServer(options, (req, res) => {
    res.writeHead(200);
    res.end("Hello HTTPS\n");
  })
  .listen(443);
```

## 实用技巧

1. **超时处理**

```javascript
const server = http.createServer((req, res) => {
  // 设置请求超时
  req.setTimeout(5000, () => {
    res.statusCode = 408;
    res.end("请求超时");
  });

  // 处理请求...
});
```

2. **请求限流**

```javascript
const requestCounts = {};

http
  .createServer((req, res) => {
    const ip = req.socket.remoteAddress;

    // 简单限流: 每IP每分钟最多100个请求
    if (!requestCounts[ip]) {
      requestCounts[ip] = { count: 1, resetTime: Date.now() + 60000 };
    } else if (Date.now() > requestCounts[ip].resetTime) {
      requestCounts[ip] = { count: 1, resetTime: Date.now() + 60000 };
    } else if (requestCounts[ip].count > 100) {
      res.statusCode = 429;
      res.end("请求过多，请稍后再试");
      return;
    } else {
      requestCounts[ip].count++;
    }

    // 处理请求...
  })
  .listen(3000);
```

## 高级应用

1. **代理服务器**

```javascript
const http = require("http");
const { URL } = require("url");

http
  .createServer((req, res) => {
    const target = new URL("http://example.com");

    const options = {
      hostname: target.hostname,
      port: target.port || 80,
      path: req.url,
      method: req.method,
      headers: req.headers,
    };

    const proxyReq = http.request(options, (proxyRes) => {
      res.writeHead(proxyRes.statusCode, proxyRes.headers);
      proxyRes.pipe(res);
    });

    req.pipe(proxyReq);
  })
  .listen(8080);
```

2. **WebSocket 握手**

```javascript
// 仅展示WebSocket握手部分
http
  .createServer((req, res) => {
    if (
      req.headers.upgrade &&
      req.headers.upgrade.toLowerCase() === "websocket" &&
      req.headers["sec-websocket-key"]
    ) {
      const crypto = require("crypto");
      const key = req.headers["sec-websocket-key"];
      const acceptKey = crypto
        .createHash("sha1")
        .update(key + "258EAFA5-E914-47DA-95CA-C5AB0DC85B11", "binary")
        .digest("base64");

      res.writeHead(101, {
        Upgrade: "websocket",
        Connection: "Upgrade",
        "Sec-WebSocket-Accept": acceptKey,
      });
      res.end();

      // 此后socket连接已升级为WebSocket
      // 需要自行实现WebSocket协议的数据帧解析
    } else {
      // 处理普通HTTP请求
    }
  })
  .listen(3000);
```

## 调试和性能优化

1. **请求和响应调试**

```javascript
http
  .createServer((req, res) => {
    console.time(`请求处理时间: ${req.url}`);

    // 记录请求信息
    console.log(`${req.method} ${req.url}`);
    console.log("Headers:", req.headers);

    // 给响应对象添加结束时间记录
    const originalEnd = res.end;
    res.end = function (...args) {
      console.timeEnd(`请求处理时间: ${req.url}`);
      console.log(`响应状态码: ${res.statusCode}`);
      return originalEnd.apply(this, args);
    };

    // 处理请求...
  })
  .listen(3000);
```

2. **性能监控**

```javascript
const server = http.createServer((req, res) => {
  // 处理请求...
});

// 监控连接数
let connectionCount = 0;
server.on("connection", () => {
  connectionCount++;
  console.log(`当前连接数: ${connectionCount}`);
});

server.on("request", (req, res) => {
  res.on("finish", () => {
    connectionCount--;
  });
});

// 定时报告服务器状态
setInterval(() => {
  const memoryUsage = process.memoryUsage();
  console.log({
    rss: `${Math.round(memoryUsage.rss / 1024 / 1024)} MB`,
    heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)} MB`,
    heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)} MB`,
    connections: connectionCount,
  });
}, 30000);

server.listen(3000);
```
