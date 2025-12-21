// 访问对象属性
const obj = {
  name: "huwenqi",
  age: 18,
};
obj.name; //"huwenqi"
const myname = ["n", "a", "m", "e"].join();
obj[myname]; //"huwenqi"
// 但是 obj.myname 不行, .无法处理动态key

// 截断整数
let n = 5.21;
// ~~n => Math.trunc(n)
const truncate = (n) => ~~n;
truncate(n); // 5

// charCodeAt(0) 获取字符的 ASCII 值。
// String.fromCharCode() 根据 ASCII 值生成字符。
