import { render, getUers, postUser } from '../servers/data_servers.js';

// 根路由渲染HTML 函数
const renderHtml = async (_req, res) => {
  const injectHtml = await render();
  res.send(injectHtml);
};

const Routing = async (req, res) => {
  const routeName = req.params.Routing;
  if (routeName === 'data') {
    const users = await getUers();
    const userData = JSON.stringify(users, null, 2);
    return res.send(userData);
  }
};

const dataPost = async (req, res) => {
  const Data = req.body;

  try {
    const newUser = await postUser(Data);

    return res.status(201).json({ message: '用户创建成功', Data: newUser });
  } catch (error) {
    return res.status(400).json({ message: '无效数据' });
  }
};

export { renderHtml, Routing, dataPost };
