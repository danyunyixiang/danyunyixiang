/**
 * Node.js HTTP模块实战练习
 * 
 * 本文件包含多个HTTP模块的练习示例，
 * 每个示例都附有详细注释和解释。
 */

const http = require('http');
const url = require('url');
const fs = require('fs');

/**
 * 1. 基础HTTP服务器
 * 
 * 创建一个简单的HTTP服务器，响应所有请求并返回"Hello World"
 */
function basicServer() {
  // 创建服务器
  const server = http.createServer((req, res) => {
    // 设置状态码和响应头
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    
    // 发送响应体并结束响应
    res.end('Hello World');
  });
  
  // 监听端口
  server.listen(3000, '127.0.0.1', () => {
    console.log('基础HTTP服务器运行在 http://127.0.0.1:3000/');
  });
  
  return server;
}

// 取消注释以运行该服务器
// const server1 = basicServer();
// 停止服务器：server1.close();

/**
 * 2. 路由处理
 * 
 * 创建一个能够处理不同URL路径的HTTP服务器
 */
function routingServer() {
  const server = http.createServer((req, res) => {
    // 获取URL路径
    const path = url.parse(req.url).pathname;
    
    // 设置通用响应头
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    
    // 根据不同路径返回不同内容
    switch(path) {
      case '/':
        res.statusCode = 200;
        res.end('首页');
        break;
      case '/about':
        res.statusCode = 200;
        res.end('关于我们');
        break;
      case '/contact':
        res.statusCode = 200;
        res.end('联系我们');
        break;
      default:
        // 404处理
        res.statusCode = 404;
        res.end('页面不存在');
    }
  });
  
  server.listen(3000, '127.0.0.1', () => {
    console.log('路由服务器运行在 http://127.0.0.1:3000/');
  });
  
  return server;
}

// 取消注释以运行该服务器
// const server2 = routingServer();

/**
 * 3. 获取URL参数
 * 
 * 创建能够处理URL查询参数的HTTP服务器
 */
function queryParamsServer() {
  const server = http.createServer((req, res) => {
    // 解析URL，第二个参数true表示将查询字符串解析为对象
    const parsedUrl = url.parse(req.url, true);
    const query = parsedUrl.query;
    
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    
    if (parsedUrl.pathname === '/hello') {
      // 获取name参数，如果不存在则使用默认值
      const name = query.name || '访客';
      res.statusCode = 200;
      res.end(`你好，${name}！`);
    } else {
      res.statusCode = 404;
      res.end('使用 /hello?name=xxx 访问');
    }
  });
  
  server.listen(3000, '127.0.0.1', () => {
    console.log('URL参数服务器运行在 http://127.0.0.1:3000/');
    console.log('访问 http://127.0.0.1:3000/hello?name=张三 试试');
  });
  
  return server;
}

// 取消注释以运行该服务器
// const server3 = queryParamsServer();

/**
 * 4. 处理不同HTTP方法
 * 
 * 创建能够区分GET、POST等不同HTTP方法的服务器
 */
function methodsServer() {
  const server = http.createServer((req, res) => {
    const method = req.method;
    const path = url.parse(req.url).pathname;
    
    res.setHeader('Content-Type', 'application/json');
    
    if (path === '/api/data') {
      switch(method) {
        case 'GET':
          // 处理GET请求
          res.statusCode = 200;
          res.end(JSON.stringify({ method: 'GET', message: '这是GET请求' }));
          break;
        case 'POST':
          // 处理POST请求
          res.statusCode = 200;
          res.end(JSON.stringify({ method: 'POST', message: '这是POST请求' }));
          break;
        case 'PUT':
          // 处理PUT请求
          res.statusCode = 200;
          res.end(JSON.stringify({ method: 'PUT', message: '这是PUT请求' }));
          break;
        case 'DELETE':
          // 处理DELETE请求
          res.statusCode = 200;
          res.end(JSON.stringify({ method: 'DELETE', message: '这是DELETE请求' }));
          break;
        default:
          // 处理其他方法
          res.statusCode = 405; // Method Not Allowed
          res.end(JSON.stringify({ error: '方法不允许' }));
      }
    } else {
      res.statusCode = 404;
      res.end(JSON.stringify({ error: '路径不存在' }));
    }
  });
  
  server.listen(3000, '127.0.0.1', () => {
    console.log('HTTP方法服务器运行在 http://127.0.0.1:3000/');
    console.log('使用不同HTTP方法访问 /api/data 路径');
  });
  
  return server;
}

// 取消注释以运行该服务器
// const server4 = methodsServer();

/**
 * 5. 解析请求体
 * 
 * 创建能够解析POST请求体数据的服务器
 */
function requestBodyServer() {
  const server = http.createServer((req, res) => {
    // 只处理POST请求到/api/echo的情况
    if (req.method === 'POST' && url.parse(req.url).pathname === '/api/echo') {
      let body = '';
      
      // 数据以块的形式接收
      req.on('data', (chunk) => {
        body += chunk.toString();
      });
      
      // 数据接收完毕
      req.on('end', () => {
        try {
          // 尝试解析JSON
          const data = JSON.parse(body);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            received: data,
            message: '成功接收数据'
          }));
        } catch (e) {
          // JSON解析失败
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            error: '无效的JSON数据',
            rawData: body
          }));
        }
      });
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: '访问 /api/echo 并使用POST方法' }));
    }
  });
  
  server.listen(3000, '127.0.0.1', () => {
    console.log('请求体解析服务器运行在 http://127.0.0.1:3000/');
    console.log('发送POST请求到 /api/echo 并带上JSON数据');
  });
  
  return server;
}

// 取消注释以运行该服务器
// const server5 = requestBodyServer();

/**
 * 6. 提供静态文件
 * 
 * 创建一个简易的静态文件服务器
 */
function staticFileServer() {
  const server = http.createServer((req, res) => {
    // 获取URL路径
    const pathname = url.parse(req.url).pathname;
    // 转换为相对文件路径 (去掉开头的'/')
    const filePath = './public' + pathname;
    
    // 尝试读取文件
    fs.readFile(filePath, (err, data) => {
      if (err) {
        // 文件不存在或其他错误
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('文件不存在');
        return;
      }
      
      // 根据文件扩展名设置Content-Type
      let contentType = 'text/plain';
      if (filePath.endsWith('.html')) {
        contentType = 'text/html';
      } else if (filePath.endsWith('.css')) {
        contentType = 'text/css';
      } else if (filePath.endsWith('.js')) {
        contentType = 'application/javascript';
      } else if (filePath.endsWith('.json')) {
        contentType = 'application/json';
      } else if (filePath.endsWith('.png')) {
        contentType = 'image/png';
      } else if (filePath.endsWith('.jpg') || filePath.endsWith('.jpeg')) {
        contentType = 'image/jpeg';
      }
      
      // 返回文件内容
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    });
  });
  
  server.listen(3000, '127.0.0.1', () => {
    console.log('静态文件服务器运行在 http://127.0.0.1:3000/');
    console.log('确保public目录中有文件可以访问');
  });
  
  return server;
}

// 取消注释以运行该服务器
// const server6 = staticFileServer();

/**
 * 7. 实现简单的RESTful API
 * 
 * 创建一个支持CRUD操作的任务列表API
 */
function restApiServer() {
  // 模拟数据库
  const tasks = [
    { id: 1, title: '学习Node.js', completed: false },
    { id: 2, title: '学习HTTP模块', completed: true }
  ];
  
  // 获取下一个ID
  let nextId = 3;
  
  const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    const method = req.method;
    
    // 设置CORS头以允许跨域请求
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // 处理预检请求
    if (method === 'OPTIONS') {
      res.statusCode = 204;
      res.end();
      return;
    }
    
    // 所有响应都是JSON格式
    res.setHeader('Content-Type', 'application/json');
    
    // 获取所有任务
    if (path === '/tasks' && method === 'GET') {
      res.statusCode = 200;
      res.end(JSON.stringify(tasks));
    }
    // 获取单个任务
    else if (path.match(/^\/tasks\/\d+$/) && method === 'GET') {
      const id = parseInt(path.split('/').pop());
      const task = tasks.find(t => t.id === id);
      
      if (task) {
        res.statusCode = 200;
        res.end(JSON.stringify(task));
      } else {
        res.statusCode = 404;
        res.end(JSON.stringify({ error: '任务不存在' }));
      }
    }
    // 创建任务
    else if (path === '/tasks' && method === 'POST') {
      let body = '';
      
      req.on('data', chunk => {
        body += chunk.toString();
      });
      
      req.on('end', () => {
        try {
          const newTask = JSON.parse(body);
          newTask.id = nextId++;
          tasks.push(newTask);
          
          res.statusCode = 201;
          res.end(JSON.stringify(newTask));
        } catch (e) {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: '无效的任务数据' }));
        }
      });
    }
    // 更新任务
    else if (path.match(/^\/tasks\/\d+$/) && method === 'PUT') {
      const id = parseInt(path.split('/').pop());
      const taskIndex = tasks.findIndex(t => t.id === id);
      
      if (taskIndex === -1) {
        res.statusCode = 404;
        res.end(JSON.stringify({ error: '任务不存在' }));
        return;
      }
      
      let body = '';
      
      req.on('data', chunk => {
        body += chunk.toString();
      });
      
      req.on('end', () => {
        try {
          const updatedTask = JSON.parse(body);
          // 保留ID，更新其他字段
          tasks[taskIndex] = { ...updatedTask, id };
          
          res.statusCode = 200;
          res.end(JSON.stringify(tasks[taskIndex]));
        } catch (e) {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: '无效的任务数据' }));
        }
      });
    }
    // 删除任务
    else if (path.match(/^\/tasks\/\d+$/) && method === 'DELETE') {
      const id = parseInt(path.split('/').pop());
      const taskIndex = tasks.findIndex(t => t.id === id);
      
      if (taskIndex === -1) {
        res.statusCode = 404;
        res.end(JSON.stringify({ error: '任务不存在' }));
        return;
      }
      
      const deletedTask = tasks.splice(taskIndex, 1)[0];
      res.statusCode = 200;
      res.end(JSON.stringify(deletedTask));
    }
    // 处理未知路径
    else {
      res.statusCode = 404;
      res.end(JSON.stringify({ error: '路径不存在' }));
    }
  });
  
  server.listen(3000, '127.0.0.1', () => {
    console.log('RESTful API服务器运行在 http://127.0.0.1:3000/');
    console.log('可用端点: GET /tasks, GET /tasks/:id, POST /tasks, PUT /tasks/:id, DELETE /tasks/:id');
  });
  
  return server;
}

// 取消注释以运行该服务器
// const server7 = restApiServer();

/**
 * 8. 服务器发送事件(SSE)
 * 
 * 创建使用SSE机制向客户端推送实时更新的服务器
 */
function sseServer() {
  const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    
    if (parsedUrl.pathname === '/events') {
      // 设置SSE所需的响应头
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*'
      });
      
      // 发送初始消息
      res.write('data: 连接已建立\n\n');
      
      // 每秒发送当前时间
      const intervalId = setInterval(() => {
        const data = {
          time: new Date().toISOString(),
          random: Math.random()
        };
        
        res.write(`data: ${JSON.stringify(data)}\n\n`);
      }, 1000);
      
      // 当客户端断开连接时清理资源
      req.on('close', () => {
        clearInterval(intervalId);
        console.log('客户端断开连接');
      });
    } 
    else if (parsedUrl.pathname === '/') {
      // 提供一个简单的HTML页面用于展示SSE数据
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>SSE示例</title>
        </head>
        <body>
          <h1>服务器发送事件(SSE)示例</h1>
          <div id="events"></div>
          
          <script>
            const eventsDiv = document.getElementById('events');
            
            // 创建EventSource对象
            const eventSource = new EventSource('/events');
            
            // 监听消息
            eventSource.onmessage = function(event) {
              const data = JSON.parse(event.data);
              const div = document.createElement('div');
              div.textContent = '时间: ' + data.time + ', 随机数: ' + data.random;
              eventsDiv.appendChild(div);
              
              // 只保留最新的10条消息
              if (eventsDiv.children.length > 10) {
                eventsDiv.removeChild(eventsDiv.children[0]);
              }
            };
            
            // 错误处理
            eventSource.onerror = function() {
              const div = document.createElement('div');
              div.textContent = '连接错误，尝试重新连接...';
              div.style.color = 'red';
              eventsDiv.appendChild(div);
            };
          </script>
        </body>
        </html>
      `);
    } 
    else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
    }
  });
  
  server.listen(3000, '127.0.0.1', () => {
    console.log('SSE服务器运行在 http://127.0.0.1:3000/');
    console.log('访问 http://127.0.0.1:3000/ 查看实时更新');
  });
  
  return server;
}

// 取消注释以运行该服务器
// const server8 = sseServer();

/**
 * 9. HTTP客户端
 * 
 * 使用HTTP模块发送请求到其他服务器
 */
function httpClient() {
  // GET请求示例
  function makeGetRequest() {
    // 设置请求选项
    const options = {
      hostname: 'jsonplaceholder.typicode.com',
      port: 80,
      path: '/posts/1',
      method: 'GET'
    };
    
    const req = http.request(options, (res) => {
      console.log(`状态码: ${res.statusCode}`);
      console.log(`响应头: ${JSON.stringify(res.headers)}`);
      
      let data = '';
      
      // 接收数据
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      // 数据接收完毕
      res.on('end', () => {
        console.log('响应数据:');
        console.log(JSON.parse(data));
      });
    });
    
    // 错误处理
    req.on('error', (e) => {
      console.error(`请求错误: ${e.message}`);
    });
    
    // 结束请求
    req.end();
  }
  
  // POST请求示例
  function makePostRequest() {
    // 要发送的数据
    const postData = JSON.stringify({
      title: 'Node.js HTTP客户端',
      body: '这是一个POST请求示例',
      userId: 1
    });
    
    // 设置请求选项
    const options = {
      hostname: 'jsonplaceholder.typicode.com',
      port: 80,
      path: '/posts',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };
    
    const req = http.request(options, (res) => {
      console.log(`状态码: ${res.statusCode}`);
      
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log('响应数据:');
        console.log(JSON.parse(data));
      });
    });
    
    req.on('error', (e) => {
      console.error(`请求错误: ${e.message}`);
    });
    
    // 写入请求体
    req.write(postData);
    req.end();
  }
  
  // 使用http.get简化GET请求
  function simpleGetRequest() {
    http.get('http://jsonplaceholder.typicode.com/todos/1', (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log('简化GET响应:');
        console.log(JSON.parse(data));
      });
    }).on('error', (e) => {
      console.error(`简化GET错误: ${e.message}`);
    });
  }
  
  console.log('HTTP客户端示例:');
  makeGetRequest();
  // 间隔执行，避免混淆输出
  setTimeout(makePostRequest, 1000);
  setTimeout(simpleGetRequest, 2000);
}

// 取消注释以运行HTTP客户端示例
// httpClient();

/**
 * 10. 基本HTTP代理
 * 
 * 创建一个简单的HTTP代理服务器
 */
function proxyServer() {
  const server = http.createServer((req, res) => {
    console.log(`接收到请求: ${req.method} ${req.url}`);
    
    // 要转发到的目标服务器
    const targetHost = 'jsonplaceholder.typicode.com';
    
    // 构建代理请求选项
    const options = {
      hostname: targetHost,
      port: 80,
      path: req.url,
      method: req.method,
      headers: req.headers
    };
    
    // 修改Host头为目标服务器
    options.headers.host = targetHost;
    
    console.log(`转发到: ${targetHost}${req.url}`);
    
    // 创建到目标服务器的请求
    const proxyReq = http.request(options, (proxyRes) => {
      // 将目标服务器的响应状态码和头部转发回客户端
      res.writeHead(proxyRes.statusCode, proxyRes.headers);
      
      // 将目标服务器的响应体转发回客户端
      proxyRes.pipe(res);
    });
    
    // 处理代理请求错误
    proxyReq.on('error', (e) => {
      console.error(`代理请求错误: ${e.message}`);
      res.statusCode = 500;
      res.end(`代理错误: ${e.message}`);
    });
    
    // 如果有请求体，将其转发到目标服务器
    req.pipe(proxyReq);
  });
  
  server.listen(3000, '127.0.0.1', () => {
    console.log('HTTP代理服务器运行在 http://127.0.0.1:3000/');
    console.log('所有请求将被转发到 jsonplaceholder.typicode.com');
    console.log('例如，访问 http://127.0.0.1:3000/posts/1');
  });
  
  return server;
}

// 取消注释以运行该服务器
// const server10 = proxyServer();

// 导出所有示例函数，方便单独使用
module.exports = {
  basicServer,
  routingServer,
  queryParamsServer,
  methodsServer,
  requestBodyServer,
  staticFileServer,
  restApiServer,
  sseServer,
  httpClient,
  proxyServer
};

// 如果直接运行此文件，启动基础服务器
if (require.main === module) {
  console.log('HTTP模块练习启动...');
  console.log('默认启动基础HTTP服务器');
  console.log('编辑此文件取消注释以运行其他示例');
  const server = basicServer();
  
  console.log('按Ctrl+C终止服务器');
} 