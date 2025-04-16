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


function ensureFileExists() {
    //注意同步与异步操作
    try {
      // 如果文件不存在，则创建默认数据
      if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify({ users: []}, null, 2));
      }
    } catch (err) {
      console.error('文件初始化失败:', err);
    }
  }

// POST 请求：写入文件内容
app.post('/save-data', (req, res) => {
    ensureFileExists()

    fs.readFile(filePath, (err, data) => {
        if (err) { console.log(err)}

        // data为buffter流,二进制
        // console.log(JSON.parse(data.toString()));
        // console.log(JSON.parse(data.toString()).users);

        const Data = JSON.parse(data.toString())
        const id = Data.users.length + 1


        Data.users.push({...req.body, id: id})
        // console.log(Data);

        // 需在读取文件后，其内部 使用Date,以防Date未赋值问题

        // 将数据写入文件
        fs.writeFile(filePath,JSON.stringify(Data, null, 2), (err) => {
            if (err) {
                console.error('写入失败:', err);
                return res.status(500).send('写入文件失败');
            }
            res.send('数据已写入 2.json');
        });
        
    })

});
// DELETE请求 删除文件
app.delete('/save-data', (req, res) => {
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error('删除失败:', err.message);
        return res.status(500).json({ error: '删除文件失败' });
      }
      res.status(200).json({ message: '文件已删除' });
    });
  });

// 启动服务器
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`后端服务运行在 http://localhost:${PORT}`);
});