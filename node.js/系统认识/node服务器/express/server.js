import express from 'express';
import {} from 'node:fs';
import cors from 'cors';

// "type": "module"情况下处理__dirname的方式
import path from 'path';
import { fileURLToPath } from 'node:url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
// app.use(cors());

app.get('/', (req, res) => {
  return res.sendFile(path.join(__dirname, 'index.html'));
});

// 带路由参数的路由的实现方式
// Route path: /users/:userId/books/:bookId
// Request URL: https://:3000/users/34/books/8989
// req.params: { "userId": "34", "bookId": "8989" }
app.get('/:Routing', (req, res) => {
  const Routing = req.params.Routing;
  if (Routing === 'data') {
    return res.sendFile(path.join(__dirname, 'data.json'));
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`运行在 http://127.0.0.1:${PORT} 上`);
});
