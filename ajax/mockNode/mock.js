const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors'); // 引入 CORS 中间件

const app = express();

// 使用 CORS 中间件，允许所有来源访问
app.use(cors());

// 处理 JSON 数据
app.use(express.json());

// 定义文件路径
const filePath = path.join(__dirname, '2.json');

// GET 请求：读取文件内容
app.get('/save-data', (req, res) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(404).send('文件不存在或无法读取');
        }
        res.send(data); // 返回文件内容
    });
});

// POST 请求：写入文件内容
app.post('/save-data', (req, res) => {
    const newData = req.body;

    // 将数据写入文件
    fs.writeFile(filePath, JSON.stringify(newData, null, 2), (err) => {
        if (err) {
            console.error('写入失败:', err);
            return res.status(500).send('写入文件失败');
        }
        res.send('数据已写入 2.json');
    });
});

// 启动服务器
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`后端服务运行在 http://localhost:${PORT}`);
});