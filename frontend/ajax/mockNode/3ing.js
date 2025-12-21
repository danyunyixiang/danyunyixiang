const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors'); // 引入 CORS 中间件

const app = express();

// 使用 CORS 中间件，允许所有来源访问
app.use(cors());

// 处理 JSON 数据
app.use(express.json());

// 访问地址,返回html页面
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../example', '3个人信息设置.html'));
});

const filePath = path.join(__dirname, '../json', '3.json');
const url = 'http://localhost/3000';

app.post('/avatar-img', (req, res) => {});
