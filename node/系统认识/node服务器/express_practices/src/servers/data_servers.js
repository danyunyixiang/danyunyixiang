import { readFile } from 'node:fs/promises';
import { prisma } from '../lib/prisma.ts';

// "type": "module"情况下处理__dirname的方式
import path from 'path';
import { fileURLToPath } from 'node:url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// 或者
// const __dirname = import.meta.dirname;
// const __filename = import.meta.filename;

const PER_PAGE = Number(process.env.PER_PAGE) || 10;

const render = async () => {
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

  return injectHtml;
};

const getAll = async (currentPage) => {
  let users = null;
  if (currentPage) {
    const skipUsers = PER_PAGE * (currentPage - 1);

    users = await prisma.user.findMany({
      skip: skipUsers,
      take: PER_PAGE,
    });
  } else {
    users = await prisma.user.findMany();
  }

  // 注意数据结构
  // 格式化日期为YYYY-MM-DD字符串
  const userData = users.map(({ id, name, birthday, group, position }) => ({
    id,
    name,
    birthday: birthday.toISOString().split('T')[0],
    group,
    position,
  }));

  return userData;
};

const add = async (userData) => {
  const { name, birthday, group, position } = userData;
  if (!name || !birthday || !group || !position) {
    throw new Error('缺少必要的用户信息');
  }

  const newUser = await prisma.user.create({
    data: {
      name: name,
      birthday: new Date(birthday),
      group: group,
      position: position,
    },
  });
  return newUser;
};

const updata = async (id, userData) => {
  const { name, birthday, group, position } = userData;
  if (!name || !birthday || !group || !position) {
    throw new Error('缺少必要的用户信息');
  }

  const updatedUser = await prisma.user.update({
    where: { id: Number(id) },
    data: {
      name: name,
      birthday: new Date(birthday),
      group: group,
      position: position,
    },
  });
  return updatedUser;
};

const deleteById = async (id) => {
  await prisma.user.delete({
    where: { id: Number(id) },
  });
};

const getCount = async () => {
  const dataCount = await prisma.user.count();
  return { dataCount: dataCount, per_page: PER_PAGE };
};

export { render, getAll, add, updata, deleteById, getCount };
