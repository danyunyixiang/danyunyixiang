// 引入 express 模块
const express = require('express');
// 引入 cors 模块，用于处理跨域请求
// 知识点: 'cors' 是一个中间件，用于允许或限制来自不同源（域、协议、端口）的请求。这对前后端分离的应用很重要。
const cors = require('cors');

// 创建 express 应用实例
// 知识点: express() 返回一个应用实例，我们通常将其赋值给 app。
const app = express();
// 定义服务器端口
// 知识点: process.env.PORT 是一个常见的获取环境变量中端口号的方式，如果没有设置，则使用默认值 3000。
const port = process.env.PORT || 3000;

// 使用 express.json() 中间件解析 JSON 请求体
// 知识点: app.use() 用于加载中间件。express.json() 是 Express 内置的中间件，用于解析 Content-Type 为 application/json 的请求体，并将解析后的数据挂载到 req.body。
app.use(express.json());
// 使用 cors 中间件允许所有来源的跨域请求
// 知识点: cors() 默认允许所有来源的请求。在生产环境中，你可能需要配置具体的允许来源。
app.use(cors());

// --- 数据存储 ---
// 知识点: 在这个示例中，我们使用一个简单的 JavaScript 数组 (let books) 来模拟数据库。
// let 关键字允许我们稍后修改这个数组（比如添加或删除书籍）。
// 每个图书对象包含 id, title, author 属性。
// nextId 用于追踪下一个可用的 ID，确保 ID 的唯一性。
//TODO: 在实际应用中，这里通常会连接到数据库（如 MongoDB, PostgreSQL, MySQL）。
// 你可以使用数据库驱动程序或 ORM (如 Mongoose, Sequelize) 来操作数据。
let books = [
    { id: 1, title: '示例书籍1', author: '作者A' },
    { id: 2, title: '示例书籍2', author: '作者B' }
];
let nextId = 3;
//END

// --- API 路由 ---

// GET /books - 获取所有图书
// 知识点: app.get(path, handler) 用于定义处理 GET 请求的路由。
// path 是请求的路径 ('/books')。
// handler 是一个回调函数，接收请求对象 (req) 和响应对象 (res)。
// req 对象包含请求信息 (如参数、查询字符串、请求头、请求体)。
// res 对象用于向客户端发送响应 (如状态码、JSON 数据、HTML)。
app.get('/books', (req, res) => {
    console.log('GET /books 请求');
    //TODO: 你可以在这里添加过滤、分页或排序逻辑，例如根据 req.query 中的参数。
    // 例如: /books?author=作者A
    // const authorFilter = req.query.author;
    // let filteredBooks = books;
    // if (authorFilter) {
    //    filteredBooks = books.filter(book => book.author === authorFilter);
    // }
    // res.json(filteredBooks);

    // 知识点: res.json(data) 是 Express 提供的方法，用于将 JavaScript 对象或数组转换为 JSON 字符串，并设置正确的 Content-Type 响应头 (application/json)。
    res.json(books);
    //END
});

// POST /books - 添加一本新书
// 知识点: app.post(path, handler) 用于定义处理 POST 请求的路由。POST 请求通常用于创建新资源。
app.post('/books', (req, res) => {
    console.log('POST /books 请求, body:', req.body);

    //TODO: 完善输入验证逻辑。
    // 知识点: req.body 包含由 express.json() 中间件解析后的请求体数据。
    // 我们使用解构赋值从 req.body 中提取 title 和 author。
    const { title, author } = req.body;

    // 知识点: 进行输入验证是保证数据质量和应用安全的重要步骤。
    // 这里是一个非常基础的验证，检查 title 和 author 是否为空。
    // res.status(code) 设置 HTTP 响应状态码。400 Bad Request 表示客户端请求无效。
    // res.json(errorObject) 发送包含错误信息的 JSON 响应。
    if (!title || !author) {
        return res.status(400).json({ message: '书名和作者不能为空' });
    }
    //END

    //TODO: 创建并存储新书对象。
    // 知识点: 创建一个新的 book 对象，使用当前的 nextId 作为其 id，然后递增 nextId。
    const newBook = {
        id: nextId++,
        title: title, // 或者使用 ES6 简写: title,
        author: author // 或者使用 ES6 简写: author
    };

    // 知识点: Array.prototype.push() 方法将一个或多个元素添加到数组的末尾。
    books.push(newBook);

    // 知识点: 返回成功响应。状态码 201 Created 通常用于表示资源创建成功。
    // 将新创建的图书对象作为 JSON 返回给客户端是一种常见的做法。
    res.status(201).json(newBook);
    //END
});

// DELETE /books/:id - 删除指定 ID 的图书
// 知识点: app.delete(path, handler) 用于定义处理 DELETE 请求的路由。DELETE 请求通常用于删除资源。
// :id 是一个路由参数。Express 会将 URL 中匹配 :id 部分的值提取出来，挂载到 req.params.id。
app.delete('/books/:id', (req, res) => {
    //TODO: 实现查找和删除逻辑。
    // 知识点: req.params 包含路由参数。URL 中的参数默认是字符串，如果需要进行数字比较或操作，通常需要使用 parseInt() 转换为数字。
    // 第二个参数 10 (基数) 确保按十进制解析。
    const bookId = parseInt(req.params.id, 10);
    console.log(`DELETE /books/${bookId} 请求`);

    // 检查转换是否成功 (如果 URL 中的 id 不是有效数字，parseInt 会返回 NaN)
    if (isNaN(bookId)) {
        return res.status(400).json({ message: '无效的图书 ID' });
    }

    // 知识点: Array.prototype.findIndex() 方法返回数组中满足提供的测试函数的第一个元素的索引。若没有找到对应元素则返回 -1。
    // 我们查找 id 与请求参数 bookId 匹配的书籍。
    const bookIndex = books.findIndex(book => book.id === bookId);

    // 知识点: 如果 findIndex 返回的索引不是 -1，说明找到了图书。
    if (bookIndex !== -1) {
        // Array.prototype.splice(start, deleteCount) 方法通过删除或替换现有元素或者原地添加新的元素来修改数组。
        // 这里我们从 bookIndex 开始，删除 1 个元素。
        books.splice(bookIndex, 1);
        // 知识点: 状态码 204 No Content 通常用于表示操作成功，但服务器没有内容需要返回。
        // 注意：发送 204 响应时，不应包含响应体，所以使用 res.status(204).send() 或 res.sendStatus(204)。
        res.status(204).send();
    } else {
        // 知识点: 如果 findIndex 返回 -1，说明未找到具有该 ID 的图书。
        // 返回 404 Not Found 错误状态码和相应的错误消息。
        res.status(404).json({ message: '未找到指定ID的图书' });
    }
    //END
});

// --- 启动服务器 ---
// 知识点: app.listen(port, callback) 启动服务器，使其在指定的端口上监听连接。
// 当服务器成功启动时，可选的回调函数会被执行。
app.listen(port, () => {
    //TODO: 可以添加更详细的启动日志或错误处理。
    console.log(`图书管理后端服务器正在运行于 http://localhost:${port}`);
    //END
});

//TODO: 可以添加 PUT /books/:id 路由用于更新图书信息。
/*
app.put('/books/:id', (req, res) => {
    // 1. 获取 bookId 和请求体中的更新数据 (title, author)
    const bookId = parseInt(req.params.id, 10);
    const { title, author } = req.body;

    // 2. 验证 bookId 和输入数据
    if (isNaN(bookId)) {
        return res.status(400).json({ message: '无效的图书 ID' });
    }
    // (可选) 验证 title 或 author 是否存在，根据你的更新逻辑决定

    // 3. 查找要更新的书籍
    const bookIndex = books.findIndex(book => book.id === bookId);

    // 4. 如果找到，则更新书籍信息
    if (bookIndex !== -1) {
        // 创建更新后的书籍对象，保留原有 id
        const updatedBook = {
            ...books[bookIndex], // 复制原有属性
            title: title || books[bookIndex].title, // 如果提供了新 title，则使用它，否则保留旧的
            author: author || books[bookIndex].author // 如果提供了新 author，则使用它，否则保留旧的
        };
        // 替换掉数组中旧的对象
        books[bookIndex] = updatedBook;
        // 返回更新后的书籍信息和 200 OK 状态码
        res.json(updatedBook);
    } else {
        // 5. 如果未找到，则返回 404 Not Found
        res.status(404).json({ message: '未找到指定ID的图书' });
    }
});
*/
//END 