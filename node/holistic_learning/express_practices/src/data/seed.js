import { prisma } from '../lib/prisma.ts';
import { readFile } from 'node:fs/promises';

import path from 'path';
import { fileURLToPath } from 'node:url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const initialize = async () => {
  await prisma.user.deleteMany();
};

const seed = async () => {
  const seedFilePath = path.join(__dirname, 'data.json');
  const data = await readFile(seedFilePath, 'utf-8');
  const users = JSON.parse(data).map(({ name, birthday, group, position }) => ({
    name,
    birthday: new Date(birthday),
    group,
    position,
  }));

  await initialize();

  await prisma.user.createMany({
    data: users,
  });

  // await promises.all(users.map(
  //   async (user) => await prisma.user.create({ data: user })
  // ));
};

seed()
  .then(() => {
    console.log('数据库已成功初始化并填充种子数据。');
    process.exit(0);
  })
  .catch((error) => {
    console.error('填充种子数据时出错:', error);
    process.exit(1);
  });
