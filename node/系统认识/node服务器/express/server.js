import express from 'express';
import { readFile, writeFile } from 'node:fs/promises';
import cors from 'cors';

// "type": "module"情况下处理__dirname的方式
import path from 'path';
import { fileURLToPath } from 'node:url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'http://127.0.0.1';
const DATA_PATH = process.env.DATA_PATH || 'data.json';
const dataFilePath = path.join(__dirname, DATA_PATH);

const app = express();
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  // _req 除未使用提示/待定
  return res.sendFile(path.join(__dirname, 'index.html'));
});

// 带路由参数的路由的实现方式
// Route path: /users/:userId/books/:bookId
// Request URL: https://:3000/users/34/books/8989
// req.params: { "userId": "34", "bookId": "8989" }
app.get('/:Routing', (req, res) => {
  const Routing = req.params.Routing;
  if (Routing === 'data') {
    return res.sendFile(dataFilePath);
  }
});

// app.get('/todos/:todoId', async (req, res) => {
//   const todoId = Number(req.params.todoId);
//   if (typeof todoId !== 'number') {
//     return;
//   }

//   const todoData = await readFile(path.join(__dirname, 'Date.json'));
//   const todo = JSON.parse(todoData);
//   res.send(todo[todoId - 1]);
// });

// POST
// GET请求通过URL传递参数，而浏览器对URL长度有限制
// POST通过请求体传递参数，没有内容大小限制
// POST能够传输媒体资源等复杂数据类型
app.post('/data', async (req, res) => {
  const Date = req.body;
  // console.log('收到的数据:', Date);

  if (Date && Date.name) {
    res.json({ message: '数据已成功接收', Date });
    const existingData = await readFile(dataFilePath, 'utf-8');
    const ResultData = JSON.parse(existingData);
    ResultData.push(Date);
    await writeFile(dataFilePath, JSON.stringify(ResultData, null, 2));
    return;
  }
  return res.status(400).json({ message: '无效数据' });
});

app.listen(PORT, () => {
  console.log(`运行在 ${HOST}:${PORT} 上`);
});
