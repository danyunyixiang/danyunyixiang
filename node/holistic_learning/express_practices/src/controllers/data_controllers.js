import {
  render,
  getAll,
  add,
  updata,
  deleteById,
  getCount,
} from '../servers/data_servers.js';

// 根路由渲染HTML 函数
const renderHtml = async (_req, res) => {
  const injectHtml = await render();
  res.send(injectHtml);
};

const getAllUsers = async (req, res) => {
  const currentPage = req.query.page;

  const users = await getAll(currentPage);
  const userData = JSON.stringify(users, null, 2);
  return res.send(userData);
};

const addUser = async (req, res) => {
  const Data = req.body;

  try {
    const newUser = await add(Data);
    return res.status(201).json({ message: '用户创建成功', Data: newUser });
  } catch (error) {
    return res.status(400).json({ message: '无效数据' });
  }
};

const updataUser = async (req, res) => {
  const { id } = req.params;
  const Data = req.body;

  try {
    const updatedUser = await updata(id, Data);
    return res.status(200).json({ message: '用户更新成功', Data: updatedUser });
  } catch (error) {
    return res.status(400).json({ message: '无效数据' });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    await deleteById(id);
    return res.status(200).json({ message: '用户删除成功' });
  } catch (error) {
    return res.status(400).json({ message: '删除失败' });
  }
};

const getCountUsers = async (_req, res) => {
  const dataCount = await getCount();
  return res.send(dataCount);
};

export {
  renderHtml,
  getAllUsers,
  addUser,
  updataUser,
  deleteUser,
  getCountUsers,
};
