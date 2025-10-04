// import { readFile, writeFile } from 'node:fs';
// writeFile(path, data, callback());
// readFile(path, 'utf-8', callback())

//api用法不同
import { readFile, writeFile } from 'node:fs/promises';

// 对文件内容进行解密

const decodeFuntion = (key, data) => {
  const list = [
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
    'y',
    'z',
  ];
  return data
    .split('')
    .map((item) => {
      if (item === ' ') return ' ';

      const L1 = list.indexOf(item);
      // 左移
      const L2 = (L1 + 26 - parseInt(key, 10)) % 26;
      // 右移
      // const L2 = (L1 + parseInt(key, 10)) % 26;

      // console.log(L2);
      return list[L2];
    })
    .join('');
};
(async function () {
  const data = await readFile('./data.txt', 'utf-8');
  const keyChain = await readFile('./keychain.txt', 'utf-8');

  const decodeResult = decodeFuntion(keyChain, data);

  writeFile('./rusult.txt', decodeResult, 'utf-8');

  console.log(decodeResult);
})();

// charCodeAt(0) 获取字符的 ASCII 值。
// String.fromCharCode() 根据 ASCII 值生成字符。
