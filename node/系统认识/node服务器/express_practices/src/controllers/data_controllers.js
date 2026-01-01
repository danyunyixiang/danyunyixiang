import path from 'path';
import { readFile, writeFile } from 'node:fs/promises';

// "type": "module"情况下处理__dirname的方式
import { fileURLToPath } from 'node:url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// 或者
// const __dirname = import.meta.dirname;
// const __filename = import.meta.filename;

const dataFilePath = path.join(__dirname, '..', 'data.json');

// 根路由渲染HTML 函数
const renderHtml = async (_req, res) => {
  const base_path = path.join(__dirname, '..', '..', 'frontend');
  // console.log(base_path);

  //  处理本地html无法读取外部文件问题
  const [html, css, js] = await Promise.all([
    readFile(path.join(base_path, 'index.html'), 'utf-8'),
    readFile(path.join(base_path, 'index.css'), 'utf-8'),
    readFile(path.join(base_path, 'index.js'), 'utf-8'),
  ]);

  const injectHtml = html
    .replace('<!-- INJECT_STYLE -->', `<style>${css}</style>`)
    .replace('<!-- INJECT_SCRIPT -->', `<script>${js}</script>`);

  res.send(injectHtml);
};

const Routing = (req, res) => {
  const routeName = req.params.Routing;
  if (routeName === 'data') {
    return res.sendFile(dataFilePath);
  }
};

const DataPost = async (req, res) => {
  const Data = req.body;

  if (Data && Data.name) {
    res.json({ message: '数据已成功接收', Data });
    const existingData = await readFile(dataFilePath, 'utf-8');
    const ResultData = [...JSON.parse(existingData), Data];
    await writeFile(dataFilePath, JSON.stringify(ResultData, null, 2));
    return;
  }
  return res.status(400).json({ message: '无效数据' });
};

export { renderHtml, Routing, DataPost };
